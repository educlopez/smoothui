"use client";

import UserAccountAvatar, {
  type Order,
  type UserData,
} from "@repo/smoothui/components/user-account-avatar";
import { getImageKitUrl } from "@smoothui/data";
import { useEffect, useState } from "react";

const demoUser: UserData = {
  name: "Jane Doe",
  email: "jane@example.com",
  avatar: getImageKitUrl(
    "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
    {
      width: 96,
      height: 96,
      quality: 85,
      format: "auto",
    }
  ),
};

const demoOrders: Order[] = [
  { id: "ORD100", date: "2024-06-01", status: "delivered", progress: 100 },
  { id: "ORD101", date: "2024-06-10", status: "shipped", progress: 60 },
];

const UserAccountAvatarDemo = () => {
  const [user, setUser] = useState<UserData>(demoUser);
  const [orders] = useState<Order[]>(demoOrders);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <>
      {notification && (
        <div className="absolute top-4 right-4 z-50 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
          {notification}
        </div>
      )}
      <UserAccountAvatar
        onOrderView={(orderId) => setNotification(`View order: ${orderId}`)}
        onProfileSave={(updated) => {
          setUser(updated);
          setNotification(`Profile saved: ${updated.name} (${updated.email})`);
        }}
        orders={orders}
        user={user}
      />
    </>
  );
};

export default UserAccountAvatarDemo;
