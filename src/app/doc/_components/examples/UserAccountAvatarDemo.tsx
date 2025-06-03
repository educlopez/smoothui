"use client"

import React, { useState } from "react"

import UserAccountAvatar, {
  Order,
  UserData,
} from "../smoothui/UserAccountAvatar"

const demoUser: UserData = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: "https://github.com/educlopez.png",
}

const demoOrders: Order[] = [
  { id: "ORD100", date: "2024-06-01", status: "delivered", progress: 100 },
  { id: "ORD101", date: "2024-06-10", status: "shipped", progress: 60 },
]

const UserAccountAvatarDemo = () => {
  const [user, setUser] = useState<UserData>(demoUser)
  const [orders] = useState<Order[]>(demoOrders)

  return (
    <UserAccountAvatar
      user={user}
      orders={orders}
      onProfileSave={(updated) => {
        setUser(updated)
        alert(`Profile saved: ${updated.name} (${updated.email})`)
      }}
      onOrderView={(orderId) => alert(`View order: ${orderId}`)}
    />
  )
}

export default UserAccountAvatarDemo
