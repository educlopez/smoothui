"use client"

import React from "react"

import ButtonCopy from "../ui/ButtonCopy"

const ButtonCopyDemo = () => {
  return (
    <ButtonCopy
      onCopy={async () => {
        await navigator.clipboard.writeText("Hello from ButtonCopy!")
      }}
    />
  )
}

export default ButtonCopyDemo
