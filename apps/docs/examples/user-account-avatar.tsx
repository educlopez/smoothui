"use client";

import UserAccountAvatar, {
  type Order,
  type UserData,
} from "@repo/smoothui/components/user-account-avatar";
import { getImageKitUrl } from "@smoothui/data";
import { somePeople } from "@smoothui/data/people";
import { useEffect, useState } from "react";

const [PERSON] = somePeople(1, 7);

const demoUser: UserData = {
  avatar: getImageKitUrl(`${PERSON.avatar}`, {
    format: "auto",
    height: 96,
    quality: 85,
    width: 96,
  }),
  email: "jane@example.com",
  name: "Jane Doe",
};

const demoOrders: Order[] = [
  { date: "2024-06-01", id: "ORD100", progress: 100, status: "delivered" },
  { date: "2024-06-10", id: "ORD101", progress: 60, status: "shipped" },
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
      {notification ? (
        <div className="absolute top-4 right-4 z-50 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
          {notification}
        </div>
      ) : null}
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
