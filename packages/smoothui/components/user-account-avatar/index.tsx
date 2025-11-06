"use client";

import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { Eye, Package, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export type UserData = {
  name: string;
  email: string;
  avatar: string;
};

export type Order = {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered";
  progress: number;
};

export type UserAccountAvatarProps = {
  user?: UserData;
  orders?: Order[];
  onProfileSave?: (user: UserData) => void;
  onOrderView?: (orderId: string) => void;
  className?: string;
};

const initialUserData: UserData = {
  name: "John Doe",
  email: "john@example.com",
  avatar:
    "https://res.cloudinary.com/dyzxnud9z/image/upload/w_90,h_90,c_fill,g_auto/v1759818651/smoothui/educalvolpz.jpg",
};

const mockOrders: Order[] = [
  { id: "ORD001", date: "2023-03-15", status: "delivered", progress: 100 },
  { id: "ORD002", date: "2023-03-20", status: "shipped", progress: 66 },
];

export default function UserAccountAvatar({
  user = initialUserData,
  orders = mockOrders,
  onProfileSave,
  onOrderView,
  className = "",
}: UserAccountAvatarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>(user);

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleProfileSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...userData,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    setUserData(updatedUser);
    if (onProfileSave) {
      onProfileSave(updatedUser);
    }
    setActiveSection(null);
  };

  const renderEditProfile = () => (
    <form className="flex flex-col gap-2 p-4" onSubmit={handleProfileSave}>
      <label
        className="font-medium text-primary-foreground text-xs"
        htmlFor="name"
      >
        Name
      </label>
      <input
        className="rounded-sm border bg-primary p-2 text-foreground text-xs"
        defaultValue={userData.name}
        id="name"
        name="name"
        placeholder="Name"
      />
      <label
        className="font-medium text-primary-foreground text-xs"
        htmlFor="email"
      >
        Email
      </label>
      <input
        className="rounded-sm border bg-primary p-2 text-foreground text-xs"
        defaultValue={userData.email}
        id="email"
        name="email"
        placeholder="Email"
      />

      <button
        className="cursor-pointer rounded-sm bg-smooth-300 px-4 py-2 text-foreground text-sm hover:bg-smooth-400"
        type="submit"
      >
        Save
      </button>
    </form>
  );

  const getStatusColor = (status: Order["status"]) => {
    if (status === "processing") {
      return "bg-blue-500";
    }
    if (status === "shipped") {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  const renderLastOrders = () => (
    <div className="flex flex-col gap-2 p-2">
      {orders.map((order) => (
        <div
          className="flex flex-col items-center justify-between gap-3 rounded-sm border bg-primary p-2 text-xs"
          key={order.id}
        >
          <div className="flex w-full items-center justify-between">
            <div className="font-medium">{order.id}</div>
            <div className="text-primary-foreground">{order.date}</div>
          </div>
          <div className="flex w-full items-center gap-2">
            <div className="w-full">
              <div className="flex justify-between">
                <span>{order.status}</span>
                <span>{order.progress}%</span>
              </div>
              <div className="mt-1 h-1 w-full rounded-sm bg-gray-200">
                <div
                  className={`h-full rounded ${getStatusColor(order.status)}`}
                  style={{ width: `${order.progress}%` }}
                />
              </div>
            </div>
            <button
              aria-label="View Order"
              className="rounded-sm border bg-background p-1"
              onClick={() => {
                onOrderView?.(order.id);
              }}
              type="button"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PopoverRoot>
      <PopoverTrigger asChild>
        <button
          className={`flex cursor-pointer items-center gap-2 rounded-full border bg-background ${className}`}
          type="button"
        >
          {/* biome-ignore lint/performance/noImgElement: Using img for user avatar without Next.js Image optimizations */}
          <img
            alt="User Avatar"
            className="rounded-full"
            height={48}
            src={userData.avatar}
            width={48}
          />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          className="w-48 overflow-hidden rounded-lg border bg-background text-sm shadow-lg"
          sideOffset={5}
        >
          <motion.div
            animate={{ height: "auto" }}
            initial={{ height: "auto" }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          >
            <div className="flex flex-col">
              <button
                className="cursor-pointer p-2 hover:bg-smooth-200"
                onClick={() => {
                  handleSectionClick("profile");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSectionClick("profile");
                  }
                }}
                type="button"
              >
                <User className="mr-2 inline" size={16} />
                Edit Profile
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "profile" && (
                  <motion.div
                    animate={{
                      opacity: 1,
                      height: "auto",
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {renderEditProfile()}
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                className="cursor-pointer p-2 hover:bg-smooth-200"
                onClick={() => {
                  handleSectionClick("orders");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSectionClick("orders");
                  }
                }}
                type="button"
              >
                <Package className="mr-2 inline" size={16} />
                Last Orders
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "orders" && (
                  <motion.div
                    animate={{
                      opacity: 1,
                      height: "auto",
                      filter: "blur(0px)",
                    }}
                    exit={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    initial={{ opacity: 0, height: 0, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  >
                    {renderLastOrders()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  );
}
