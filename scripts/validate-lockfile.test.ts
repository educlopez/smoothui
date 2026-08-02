import assert from "node:assert/strict";
import test from "node:test";
import { validateLockfile } from "./validate-lockfile";

const VALID_LOCKFILE = `
lockfileVersion: '9.0'
packages:
  safe-package@1.0.0:
    resolution:
      integrity: sha512-safe
`;

const INVALID_LOCKFILES = [
  {
    expectedPath: "resolution.tarball",
    name: "tarball resolution",
    source: `
lockfileVersion: '9.0'
packages:
  unsafe@1.0.0:
    resolution:
      integrity: sha512-misleading
      tarball: https://example.com/archive.tgz
`,
  },
  {
    expectedPath: "resolution.directory",
    name: "directory resolution",
    source: `
lockfileVersion: '9.0'
packages:
  unsafe@1.0.0:
    resolution:
      directory: ../outside
`,
  },
  {
    expectedPath: "resolution.registry",
    name: "insecure HTTP resolution",
    source: `
lockfileVersion: '9.0'
packages:
  unsafe@1.0.0:
    resolution:
      registry: http://registry.example.com
`,
  },
  {
    expectedPath: "resolution.repo",
    name: "pnpm 11 git object resolution",
    source: `
lockfileVersion: '9.0'
packages:
  unsafe@git+file:///tmp/repository#abcdef:
    resolution:
      commit: abcdef0123456789
      repo: git+file:///tmp/repository
      type: git
`,
  },
  {
    expectedPath: "unsafe@1.0.0.resolution",
    name: "git string resolution",
    source: `
lockfileVersion: '9.0'
packages:
  unsafe@1.0.0:
    resolution: git+ssh://git@example.com/repository.git#abcdef
`,
  },
] as const;

test("accepts a registry lockfile with integrity metadata", () => {
  assert.deepEqual(validateLockfile(VALID_LOCKFILE), []);
});

for (const fixture of INVALID_LOCKFILES) {
  test(`rejects ${fixture.name}`, () => {
    const findings = validateLockfile(fixture.source);
    assert.equal(
      findings.some((finding) => finding.path.includes(fixture.expectedPath)),
      true
    );
  });
}
