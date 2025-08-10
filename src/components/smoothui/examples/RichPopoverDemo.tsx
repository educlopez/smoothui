"use client"

import RichPopover, { YouTubeIcon } from "@/components/smoothui/ui/RichPopover"

export default function RichPopoverDemo() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="max-w-2xl space-y-4 text-base leading-relaxed">
        <p className="text-muted-foreground">
          OpenAI has just announced their latest breakthrough in artificial
          intelligence
          <RichPopover
            trigger={
              <span className="bg-background mx-2 inline-flex size-8 cursor-pointer items-center justify-center rounded-md border align-middle">
                <YouTubeIcon className="h-4 w-4 fill-red-600" />
              </span>
            }
            title="Introducing GPT-5"
            description={
              '"GPT-5 features state-of-the-art performance across coding, math, writing assistance, health, visual perception, and more. Use GPT-5 to build websites, create apps, and tap into its improved writing capabilities to help with everyday tasks like reports, emails, and editing."'
            }
            href="https://www.youtube.com/watch?v=boJG84Jcf-4"
            actionLabel="Watch announcement"
            actionHref="https://www.youtube.com/watch?v=boJG84Jcf-4"
            meta="0:00–2:15"
          />
          marking a significant leap forward in AI capabilities. This new model
          represents the most advanced language model ever created, with
          unprecedented performance across multiple domains including coding,
          mathematics, and creative writing.
        </p>
        <p className="text-muted-foreground">
          GPT-5&apos;s enhanced capabilities extend beyond traditional text
          processing to include improved visual perception and health-related
          assistance, making it a versatile tool for both professional and
          personal use. The model is now rolling out to all users, democratizing
          access to cutting-edge AI technology.
        </p>
      </div>
    </div>
  )
}
