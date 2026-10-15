import { deflateSync, inflateSync } from "node:zlib";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

/** Transparent margin around the painted pixels, in device pixels (capture is 2x). */
export const POSTER_TRIM_PAD = 32;

const ALPHA_FLOOR = 16;

interface RgbaPng {
  data: Buffer;
  height: number;
  width: number;
}

const crcTable = new Uint32Array(256);
for (let index = 0; index < 256; index += 1) {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) === 1 ? 0xed_b8_83_20 ^ (value >>> 1) : value >>> 1;
  }
  crcTable[index] = value;
}

const crc32 = (buffer: Buffer): number => {
  let crc = 0xff_ff_ff_ff;
  for (const byte of buffer) {
    const tableIndex = (crc ^ byte) & 0xff;
    const entry = crcTable[tableIndex] ?? 0;
    crc = entry ^ (crc >>> 8);
  }
  return (crc ^ 0xff_ff_ff_ff) >>> 0;
};

const chunk = (type: string, data: Buffer): Buffer => {
  const body = Buffer.concat([Buffer.from(type), data]);
  const header = Buffer.alloc(8);
  header.writeUInt32BE(data.length, 0);
  body.copy(header, 4, 0, 4);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([header, data, checksum]);
};

const paeth = (left: number, up: number, upperLeft: number): number => {
  const estimate = left + up - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const diagonal = Math.abs(estimate - upperLeft);
  if (leftDistance <= upDistance && leftDistance <= diagonal) {
    return left;
  }
  if (upDistance <= diagonal) {
    return up;
  }
  return upperLeft;
};

const decode = (png: Buffer): RgbaPng => {
  if (!png.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("poster trim expected a PNG");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  const idat: Buffer[] = [];

  while (offset + 8 <= png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const data = png.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      const [bitDepth, colorType] = data.subarray(8, 10);
      if (bitDepth !== 8 || colorType !== 6) {
        return { data: Buffer.alloc(0), height: 0, width: 0 };
      }
    }

    if (type === "IDAT") {
      idat.push(data);
    }

    if (type === "IEND") {
      break;
    }
  }

  const inflated = inflateSync(Buffer.concat(idat));
  const rowBytes = width * 4;
  const pixels = Buffer.alloc(height * rowBytes);
  let source = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[source] ?? 0;
    source += 1;
    const rowStart = y * rowBytes;
    const previous = y === 0 ? -1 : rowStart - rowBytes;

    for (let index = 0; index < rowBytes; index += 1) {
      const raw = inflated[source + index] ?? 0;
      const left = index >= 4 ? (pixels[rowStart + index - 4] ?? 0) : 0;
      const up = previous < 0 ? 0 : (pixels[previous + index] ?? 0);
      const upperLeft =
        previous < 0 || index < 4 ? 0 : (pixels[previous + index - 4] ?? 0);
      let value = raw;
      if (filter === 1) {
        value = (raw + left) & 0xff;
      } else if (filter === 2) {
        value = (raw + up) & 0xff;
      } else if (filter === 3) {
        value = (raw + Math.floor((left + up) / 2)) & 0xff;
      } else if (filter === 4) {
        value = (raw + paeth(left, up, upperLeft)) & 0xff;
      }
      pixels[rowStart + index] = value;
    }

    source += rowBytes;
  }

  return { data: pixels, height, width };
};

const encode = (image: RgbaPng): Buffer => {
  const rowBytes = image.width * 4;
  const raw = Buffer.alloc(image.height * (rowBytes + 1));
  for (let y = 0; y < image.height; y += 1) {
    const destination = y * (rowBytes + 1);
    raw[destination] = 0;
    image.data.copy(raw, destination + 1, y * rowBytes, (y + 1) * rowBytes);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(image.width, 0);
  header.writeUInt32BE(image.height, 4);
  header[8] = 8;
  header[9] = 6;

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
};

/**
 * Drop the transparent margin around what was actually painted, then add an
 * even pad so the subject sits inside the card instead of on a tall empty frame.
 */
export const trimPosterPng = (png: Buffer, pad = POSTER_TRIM_PAD): Buffer => {
  const image = decode(png);
  if (image.width === 0 || image.height === 0) {
    return png;
  }
  let top = image.height;
  let left = image.width;
  let bottom = -1;
  let right = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      const alpha = image.data[(y * image.width + x) * 4 + 3] ?? 0;
      if (alpha <= ALPHA_FLOOR) {
        continue;
      }
      top = Math.min(top, y);
      left = Math.min(left, x);
      bottom = Math.max(bottom, y);
      right = Math.max(right, x);
    }
  }

  if (bottom < top || right < left) {
    return png;
  }

  const cropWidth = right - left + 1;
  const cropHeight = bottom - top + 1;
  const width = cropWidth + pad * 2;
  const height = cropHeight + pad * 2;
  const data = Buffer.alloc(width * height * 4);

  for (let y = 0; y < cropHeight; y += 1) {
    image.data.copy(
      data,
      ((y + pad) * width + pad) * 4,
      ((top + y) * image.width + left) * 4,
      ((top + y) * image.width + left + cropWidth) * 4
    );
  }

  return encode({ data, height, width });
};
