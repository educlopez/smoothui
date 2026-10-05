import { FooterBody } from "@docs/components/landing/footer";

export default function DocsFooter() {
  return (
    <footer className="py-12 sm:py-16 md:ps-60 xl:pe-[268px]">
      <div className="mx-auto w-full max-w-[calc(56.25rem+4rem)]">
        {/* No giant mark here — that bookend needs the pink dither band from the
            landing Footer, and these columns are too narrow for it alone. */}
        <FooterBody showMark={false} />
      </div>
    </footer>
  );
}
