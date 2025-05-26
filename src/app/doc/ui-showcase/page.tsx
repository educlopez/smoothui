"use client"

import { useState } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const uiComponents = [
  {
    name: "Badge",
    Comp: () => <Badge>Badge</Badge>,
  },
  {
    name: "Button",
    Comp: () => (
      <div className="flex flex-col gap-2">
        <Button>Button</Button>
        <Button variant="secondary">Button</Button>
        <Button variant="outline">Button</Button>
        <Button variant="destructive">Button</Button>
        <Button variant="ghost">Button</Button>
        <Button variant="link">Button</Button>
      </div>
    ),
  },

  {
    name: "Input",
    Comp: () => <Input placeholder="Type here..." />,
  },
  {
    name: "Separator",
    Comp: () => <Separator className="my-2" />,
  },
  {
    name: "Skeleton",
    Comp: () => <Skeleton className="h-6 w-32" />,
  },
  {
    name: "Tooltip",
    Comp: () => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    name: "Sheet",
    Comp: function SheetDemo() {
      const [open, setOpen] = useState(false)
      return (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => setOpen(true)}>Open Sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>This is a demo sheet.</SheetDescription>
            </SheetHeader>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </SheetContent>
        </Sheet>
      )
    },
  },
  {
    name: "Accordion",
    Comp: () => (
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    name: "Avatar",
    Comp: () => (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
  {
    name: "Card",
    Comp: () => (
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>Button</Button>
        </CardFooter>
      </Card>
    ),
  },
]

export default function UIShowcasePage() {
  return (
    <section className="w-full py-24 transition">
      <h2 className="font-title text-foreground mb-8 text-center text-3xl font-bold transition">
        All @ui Components
      </h2>
      <div className="mt-16 grid w-full grid-cols-2 gap-4">
        {uiComponents.map(({ name, Comp }) => (
          <div
            key={name}
            className="bg-background flex flex-col items-center rounded-lg border p-4"
          >
            <h3 className="text-primary-foreground mb-4 text-lg font-semibold">
              {name}
            </h3>
            <div className="flex w-full flex-1 items-center justify-center">
              <Comp />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
