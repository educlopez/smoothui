"use client"

import TypewriterText from "../ui/TypewriterText"

export default function TypewriterTextDemo() {
  return (
    <div className="relative max-w-md space-y-6">
      <div>
        <TypewriterText>Typewriter effect for your text!</TypewriterText>
        <div>
          <TypewriterText speed={100} className="text-brand font-mono text-lg">
            Slower typing speed example
          </TypewriterText>
        </div>
        <div>
          <TypewriterText loop className="text-2xl font-semibold">
            This will loop forever!
          </TypewriterText>
        </div>
      </div>
    </div>
  )
}
