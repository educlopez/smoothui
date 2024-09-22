"use client"

import { useState } from "react"
import Image from "next/image"
import * as Popover from "@radix-ui/react-popover"
import { AnimatePresence, motion } from "framer-motion"
import { Eye, Package, User } from "lucide-react"

import Avatar from "@/app/components/resources/avatardrop/avatar.jpg"

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
  avatar: Avatar.src,
}

const mockOrders: Order[] = [
  { id: "ORD001", date: "2023-03-15", status: "delivered", progress: 100 },
  { id: "ORD002", date: "2023-03-20", status: "shipped", progress: 66 },
]

export default function AvatarDrop() {
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
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleProfileSave}
      className="flex flex-col gap-2 p-4"
    >
      <label
        htmlFor="name"
        className="text-xs font-medium text-light11 dark:text-dark11"
      >
        Name
      </label>
      <input
        id="name"
        name="name"
        defaultValue={userData.name}
        className="rounded border border-light6 bg-light2 p-2 text-xs text-light12 dark:border-dark6 dark:bg-dark2 dark:text-dark12"
        placeholder="Name"
      />
      <label
        htmlFor="email"
        className="text-xs font-medium text-light11 dark:text-dark11"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        defaultValue={userData.email}
        className="rounded border border-light6 bg-light2 p-2 text-xs text-light12 dark:border-dark6 dark:bg-dark2 dark:text-dark12"
        placeholder="Email"
      />

      <button
        type="submit"
        className="rounded bg-light4 px-4 py-2 text-sm text-light12 hover:bg-light5 dark:bg-dark4 dark:text-dark12 dark:hover:bg-dark5"
      >
        Save
      </button>
    </motion.form>
  )

  const renderLastOrders = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-2 p-2"
    >
      {mockOrders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col items-center justify-between gap-3 rounded border border-light4 bg-light2 p-2 text-xs dark:border-dark4 dark:bg-dark2"
        >
          <div className="flex w-full items-center justify-between">
            <div className="font-medium">{order.id}</div>
            <div className="text-light11 dark:text-dark11">{order.date}</div>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="w-full">
              <div className="flex justify-between">
                <span>{order.status}</span>
                <span>{order.progress}%</span>
              </div>
              <div className="mt-1 h-1 w-full rounded bg-gray-200">
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
              className="rounded border border-light4 bg-light1 p-1 dark:border-dark4 dark:bg-dark1"
              aria-label="View Order"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      ))}
    </motion.div>
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-light4 bg-light1 dark:border-dark4 dark:bg-dark1">
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
          className="w-48 overflow-hidden rounded-lg border border-light4 bg-light1 text-sm shadow-lg dark:border-dark4 dark:bg-dark1"
          sideOffset={5}
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              className="cursor-pointer p-2 hover:bg-light3 dark:hover:bg-dark3"
              onClick={() => handleSectionClick("profile")}
            >
              <User size={16} className="mr-2 inline" />
              Edit Profile
            </div>
            <AnimatePresence>
              {activeSection === "profile" && renderEditProfile()}
            </AnimatePresence>
            <div
              className="cursor-pointer p-2 hover:bg-light3 dark:hover:bg-dark3"
              onClick={() => handleSectionClick("orders")}
            >
              <Package size={16} className="mr-2 inline" />
              Last Orders
            </div>
            <AnimatePresence>
              {activeSection === "orders" && renderLastOrders()}
            </AnimatePresence>
          </motion.div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
