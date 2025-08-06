"use client"

import { useEffect, useState } from "react"

import {
  AiBranch,
  type AIBranch as AIBranchType,
} from "@/components/smoothui/ui/AiBranch"

export default function AiBranchDemo() {
  const [branches, setBranches] = useState<AIBranchType[]>([
    {
      id: "1",
      userMessage: "What time is it?",
      aiResponse:
        "I don't have access to real-time information, but you can check the current time on your device or use a clock app.",
      timestamp: new Date(Date.now() - 300000),
      isActive: true,
    },
    {
      id: "2",
      userMessage: "What time is it in New York?",
      aiResponse:
        "I don't have access to real-time information, but you can check the current time in New York using a world clock app or website like timeanddate.com.",
      timestamp: new Date(Date.now() - 240000),
      isActive: false,
    },
    {
      id: "3",
      userMessage:
        "How can I use MailHog on Laravel 12 for local development using Composer?",
      aiResponse:
        "To use MailHog with Laravel 12 for local development:\n\n1. Install MailHog via Composer: `composer require mailhog/mailhog`\n2. Configure your `.env` file:\n   ```\n   MAIL_MAILER=smtp\n   MAIL_HOST=localhost\n   MAIL_PORT=1025\n   MAIL_USERNAME=null\n   MAIL_PASSWORD=null\n   ```\n3. Start MailHog: `mailhog`\n4. Access the web interface at `http://localhost:8025`\n5. All emails sent by your Laravel app will be captured there.",
      timestamp: new Date(Date.now() - 180000),
      isActive: false,
    },
    {
      id: "4",
      userMessage: "How do I set up MailHog for Laravel development?",
      aiResponse:
        "Here's how to set up MailHog for Laravel development:\n\n1. **Install MailHog** (choose one method):\n   - Download from GitHub releases\n   - Use Docker: `docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog`\n   - Use Homebrew: `brew install mailhog`\n\n2. **Configure Laravel** in your `.env`:\n   ```\n   MAIL_MAILER=smtp\n   MAIL_HOST=localhost\n   MAIL_PORT=1025\n   MAIL_USERNAME=null\n   MAIL_PASSWORD=null\n   MAIL_ENCRYPTION=null\n   ```\n\n3. **Start MailHog** and access the web interface at `http://localhost:8025`\n\n4. **Test** by sending emails from your Laravel app - they'll appear in MailHog's inbox.",
      timestamp: new Date(Date.now() - 120000),
      isActive: false,
    },
  ])

  const handleBranchSelect = (branchId: string) => {
    setBranches((prev) =>
      prev.map((branch) => ({
        ...branch,
        isActive: branch.id === branchId,
      }))
    )
  }

  // Ensure at least one branch is active
  useEffect(() => {
    const hasActiveBranch = branches.some((branch) => branch.isActive)
    if (!hasActiveBranch && branches.length > 0) {
      setBranches((prev) =>
        prev.map((branch, index) => ({
          ...branch,
          isActive: index === 0,
        }))
      )
    }
  }, [branches])

  return (
    <div className="w-full space-y-6">
      {/* AI Branch Component */}
      <AiBranch branches={branches} onBranchSelect={handleBranchSelect} />
    </div>
  )
}
