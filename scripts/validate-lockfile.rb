# frozen_string_literal: true

require "yaml"

module LockfileValidator
  MAX_LOCKFILE_BYTES = 20 * 1024 * 1024
  FORBIDDEN_KEYS = %w[directory git repo tarball].freeze
  FORBIDDEN_TYPES = %w[directory git tarball].freeze
  GIT_SOURCE = /\A(?:(?:git(?:\+(?:file|https?|ssh))?|ssh):|git@)/i
  INSECURE_HTTP = /\Ahttp:\/\//i

  class ValidationError < StandardError; end

  module_function

  def validate(source, filename: "(lockfile)")
    if source.bytesize > MAX_LOCKFILE_BYTES
      raise ValidationError,
            "lockfile exceeds #{MAX_LOCKFILE_BYTES} byte safety limit"
    end

    document = YAML.safe_load(
      source,
      permitted_classes: [],
      permitted_symbols: [],
      aliases: false,
      filename: filename
    )
    findings = []
    traverse_document(document, "$", findings)
    findings
  rescue Psych::Exception => e
    raise ValidationError, "invalid or unsafe YAML: #{e.message}"
  end

  def traverse_document(value, path, findings)
    case value
    when Hash
      value.each do |key, child|
        child_path = "#{path}.#{key}"
        inspect_resolution(child, child_path, findings) if key.to_s == "resolution"
        traverse_document(child, child_path, findings)
      end
    when Array
      value.each_with_index do |child, index|
        traverse_document(child, "#{path}[#{index}]", findings)
      end
    end
  end

  def inspect_resolution(value, path, findings)
    case value
    when Hash
      value.each do |key, child|
        normalized_key = key.to_s.downcase
        child_path = "#{path}.#{key}"
        if FORBIDDEN_KEYS.include?(normalized_key)
          add_finding(
            findings,
            child_path,
            "uses an exotic git/tarball/directory resolution"
          )
        end
        if normalized_key == "type" &&
           FORBIDDEN_TYPES.include?(child.to_s.downcase)
          add_finding(
            findings,
            child_path,
            "uses an exotic git/tarball/directory resolution"
          )
        end
        inspect_resolution(child, child_path, findings)
      end
    when Array
      value.each_with_index do |child, index|
        inspect_resolution(child, "#{path}[#{index}]", findings)
      end
    when String
      if GIT_SOURCE.match?(value)
        add_finding(
          findings,
          path,
          "uses an exotic git/tarball/directory resolution"
        )
      end
      add_finding(findings, path, "uses insecure http://") if INSECURE_HTTP.match?(value)
    end
  end

  def add_finding(findings, path, reason)
    finding = { path: path, reason: reason }
    findings << finding unless findings.include?(finding)
  end
end

if $PROGRAM_NAME == __FILE__
  lockfile = File.expand_path(ARGV.fetch(0, "pnpm-lock.yaml"))

  begin
    if File.size(lockfile) > LockfileValidator::MAX_LOCKFILE_BYTES
      raise LockfileValidator::ValidationError,
            "lockfile exceeds #{LockfileValidator::MAX_LOCKFILE_BYTES} byte safety limit"
    end
    findings = LockfileValidator.validate(File.read(lockfile), filename: lockfile)
    if findings.empty?
      puts "#{lockfile} OK: registry-only, HTTPS, no git/tarball/directory resolutions."
    else
      findings.each do |finding|
        warn "#{finding[:path]}: #{finding[:reason]}"
      end
      exit 1
    end
  rescue Errno::ENOENT, Errno::EACCES, LockfileValidator::ValidationError => e
    warn "Unable to validate #{lockfile}: #{e.message}"
    exit 1
  end
end
