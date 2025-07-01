"use client"

import { useState } from "react"
import { User } from "lucide-react"

import AnimatedInput from "@/components/smoothui/ui/AnimatedInput"

export default function AnimatedInputDemo() {
  const [value, setValue] = useState("")
  return (
    <div className="max-w-xs space-y-6">
      <AnimatedInput
        label="Controlled"
        value={value}
        onChange={setValue}
        placeholder="Type here..."
      />
      <AnimatedInput label="Uncontrolled" defaultValue="Hello" />
      <AnimatedInput
        label="With Icon"
        icon={<User size={20} strokeWidth={1.5} />}
        placeholder="Username"
      />
    </div>
  )
}
