"use client";

import UserAccountAvatar, {
  type Order,
  type UserData,
} from "@repo/smoothui/components/user-account-avatar";
import { useState } from "react";

const demoUser: UserData = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar:
    "https://res.cloudinary.com/dyzxnud9z/image/upload/w_96,h_96,c_fill,g_auto/v1759818651/smoothui/educalvolpz.jpg",
};

const demoOrders: Order[] = [
  { id: "ORD100", date: "2024-06-01", status: "delivered", progress: 100 },
  { id: "ORD101", date: "2024-06-10", status: "shipped", progress: 60 },
];

const UserAccountAvatarDemo = () => {
  const [user, setUser] = useState<UserData>(demoUser);
  const [orders] = useState<Order[]>(demoOrders);

  return (
    <UserAccountAvatar
      onOrderView={(orderId) => alert(`View order: ${orderId}`)}
      onProfileSave={(updated) => {
        setUser(updated);
        alert(`Profile saved: ${updated.name} (${updated.email})`);
      }}
      orders={orders}
      user={user}
    />
  );
};

export default UserAccountAvatarDemo;
