"use client"

import RevealText from "../ui/RevealText"

export default function RevealTextDemo() {
  return (
    <div className="relative max-w-md space-y-6">
      <div>
        <RevealText>Reveal text with fade/slide!</RevealText>
        <div>
          <RevealText direction="left" className="text-brand text-lg font-bold">
            Slide in from left
          </RevealText>
        </div>
        <div>
          <RevealText delay={500} className="text-2xl font-semibold">
            Delayed reveal
          </RevealText>
        </div>
        <div style={{ height: 100 }} />
        <RevealText triggerOnView className="text-xl font-bold">
          This reveals when in view
        </RevealText>
      </div>
    </div>
  )
}
