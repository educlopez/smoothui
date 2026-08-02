# frozen_string_literal: true

require_relative "validate-lockfile"

class AssertionFailure < StandardError; end

def assert_valid(name, source)
  findings = LockfileValidator.validate(source, filename: name)
  raise AssertionFailure, "expected no findings, got #{findings.inspect}" unless findings.empty?
end

def assert_finding(name, source, reason = nil)
  findings = LockfileValidator.validate(source, filename: name)
  raise AssertionFailure, "expected at least one finding" if findings.empty?
  return unless reason
  return if findings.any? { |finding| finding[:reason] == reason }

  raise AssertionFailure, "expected #{reason.inspect}, got #{findings.inspect}"
end

def assert_parse_rejected(name, source)
  LockfileValidator.validate(source, filename: name)
  raise AssertionFailure, "expected unsafe or malformed YAML to fail"
rescue LockfileValidator::ValidationError
  nil
end

tests = {
  "valid registry lock" => lambda do
    assert_valid("valid", <<~YAML)
      lockfileVersion: '9.0'
      packages:
        safe@1.0.0:
          resolution: {integrity: sha512-safe}
    YAML
  end,
  "comments containing forbidden text are ignored" => lambda do
    assert_valid("comments", <<~YAML)
      # resolution: {tarball: http://example.com, type: git}
      lockfileVersion: '9.0'
      packages:
        safe@1.0.0:
          resolution: {integrity: sha512-safe} # repo: git+ssh://ignored
    YAML
  end,
  "block tarball" => lambda do
    assert_finding("block-tarball", <<~YAML)
      packages:
        unsafe@1.0.0:
          resolution:
            integrity: sha512-misleading
            tarball: https://example.com/archive.tgz
    YAML
  end,
  "flow tarball after integrity" => lambda do
    assert_finding("flow-tarball", <<~YAML)
      packages: {unsafe@1.0.0: {resolution: {integrity: sha512-safe, tarball: 'https://example.com/a.tgz'}}}
    YAML
  end,
  "flow directory" => lambda do
    assert_finding("flow-directory", <<~YAML)
      packages: {unsafe@1.0.0: {resolution: {type: directory, directory: ../outside}}}
    YAML
  end,
  "insecure HTTP value" => lambda do
    assert_finding("http", <<~YAML, "uses insecure http://")
      packages:
        unsafe@1.0.0:
          resolution: {registry: 'http://registry.example.com'}
    YAML
  end,
  "pnpm 11 block git object" => lambda do
    assert_finding("pnpm11-block", <<~YAML)
      packages:
        unsafe@git+file:///tmp/repo#abcdef:
          resolution:
            commit: abcdef
            repo: git+file:///tmp/repo
            type: git
    YAML
  end,
  "pnpm 11 flow git object with reordered keys" => lambda do
    assert_finding("pnpm11-flow", <<~YAML)
      packages: {unsafe: {resolution: {type: git, commit: abcdef, repo: 'git+file:///tmp/repo'}}}
    YAML
  end,
  "scalar git protocols" => lambda do
    assert_finding("git-protocols", <<~YAML)
      packages:
        first: {resolution: 'git://example.com/repo.git'}
        second: {resolution: 'git+ssh://git@example.com/repo.git'}
        third: {resolution: 'ssh://git@example.com/repo.git'}
        fourth: {resolution: 'git@example.com:repo.git'}
    YAML
  end,
  "escaped forbidden key" => lambda do
    assert_finding("escaped-key", <<~'YAML')
      packages:
        unsafe:
          "\x72esolution": {"\x74arball": 'https://example.com/a.tgz'}
    YAML
  end,
  "escaped git value" => lambda do
    assert_finding("escaped-value", <<~'YAML')
      packages:
        unsafe:
          resolution: "\x67it+ssh://git@example.com/repo.git"
    YAML
  end,
  "double-quoted multiline continuation" => lambda do
    assert_finding("continuation", <<~'YAML')
      packages:
        unsafe:
          resolution: "git+\
            ssh://git@example.com/repo.git"
    YAML
  end,
  "alias and anchor" => lambda do
    assert_parse_rejected("alias", <<~YAML)
      shared: &source
        repo: git+file:///tmp/repo
        type: git
      packages:
        unsafe:
          resolution: *source
    YAML
  end,
  "malformed YAML" => lambda do
    assert_parse_rejected("malformed", "packages: [unterminated")
  end,
  "unsafe YAML tag" => lambda do
    assert_parse_rejected("tag", "resolution: !ruby/object:Object {}")
  end
}

failures = []
tests.each_with_index do |(name, test), index|
  test.call
  puts "ok #{index + 1} - #{name}"
rescue StandardError => e
  failures << [name, e]
  warn "not ok #{index + 1} - #{name}: #{e.message}"
end

puts "#{tests.length} tests, #{failures.length} failures"
exit 1 unless failures.empty?
