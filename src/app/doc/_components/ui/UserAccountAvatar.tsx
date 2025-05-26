"use client"

import { useState } from "react"
import Image from "next/image" // Only if you're using nextjs
import * as Popover from "@radix-ui/react-popover"
import { Eye, Package, User } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface UserData {
  name: string
  email: string
  avatar: string
}

interface Order {
  id: string
  date: string
  status: "processing" | "shipped" | "delivered"
  progress: number
}

const initialUserData: UserData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "https://github.com/educlopez.png",
}

const mockOrders: Order[] = [
  { id: "ORD001", date: "2023-03-15", status: "delivered", progress: 100 },
  { id: "ORD002", date: "2023-03-20", status: "shipped", progress: 66 },
]

export default function UserAccountAvatar() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData>(initialUserData)

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setUserData({
      ...userData,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    })
    setActiveSection(null)
  }

  const renderEditProfile = () => (
    <form onSubmit={handleProfileSave} className="flex flex-col gap-2 p-4">
      <label htmlFor="name" className="text-smooth-900 text-xs font-medium">
        Name
      </label>
      <input
        id="name"
        name="name"
        defaultValue={userData.name}
        className="border-smooth-500 bg-smooth-100 text-smooth-950 rounded-sm border p-2 text-xs"
        placeholder="Name"
      />
      <label htmlFor="email" className="text-smooth-900 text-xs font-medium">
        Email
      </label>
      <input
        id="email"
        name="email"
        defaultValue={userData.email}
        className="border-smooth-500 bg-smooth-100 text-smooth-950 rounded-sm border p-2 text-xs"
        placeholder="Email"
      />

      <button
        type="submit"
        className="bg-smooth-300 text-smooth-950 hover:bg-smooth-400 cursor-pointer rounded-sm px-4 py-2 text-sm"
      >
        Save
      </button>
    </form>
  )

  const renderLastOrders = () => (
    <div className="flex flex-col gap-2 p-2">
      {mockOrders.map((order) => (
        <div
          key={order.id}
          className="border-smooth-300 bg-smooth-100 flex flex-col items-center justify-between gap-3 rounded-sm border p-2 text-xs"
        >
          <div className="flex w-full items-center justify-between">
            <div className="font-medium">{order.id}</div>
            <div className="text-smooth-900">{order.date}</div>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="w-full">
              <div className="flex justify-between">
                <span>{order.status}</span>
                <span>{order.progress}%</span>
              </div>
              <div className="mt-1 h-1 w-full rounded-sm bg-gray-200">
                <div
                  className={`h-full rounded ${
                    order.status === "processing"
                      ? "bg-blue-500"
                      : order.status === "shipped"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
            <button
              className="border-smooth-300 bg-smooth-50 rounded-sm border p-1"
              aria-label="View Order"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="border-smooth-300 bg-smooth-50 flex cursor-pointer items-center gap-2 rounded-full border">
          <Image
            src={userData.avatar}
            alt="User Avatar"
            width={48}
            height={48}
            className="rounded-full"
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="border-smooth-300 bg-smooth-50 w-48 overflow-hidden rounded-lg border text-sm shadow-lg"
          sideOffset={5}
        >
          <motion.div
            initial={{ height: "auto" }}
            animate={{ height: "auto" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            <div className="flex flex-col">
              <div
                className="hover:bg-smooth-200 cursor-pointer p-2"
                onClick={() => handleSectionClick("profile")}
              >
                <User size={16} className="mr-2 inline" />
                Edit Profile
              </div>
              <AnimatePresence initial={false}>
                {activeSection === "profile" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {renderEditProfile()}
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className="hover:bg-smooth-200 cursor-pointer p-2"
                onClick={() => handleSectionClick("orders")}
              >
                <Package size={16} className="mr-2 inline" />
                Last Orders
              </div>
              <AnimatePresence initial={false}>
                {activeSection === "orders" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {renderLastOrders()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
