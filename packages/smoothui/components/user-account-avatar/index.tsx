"use client";

import {
  Content as PopoverContent,
  Portal as PopoverPortal,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from "@radix-ui/react-popover";
import { Eye, Package, User } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  user: UserData;
  orders?: Order[];
  onProfileSave?: (user: UserData) => void;
  onOrderView?: (orderId: string) => void;
  className?: string;
};

const mockOrders: Order[] = [
  { id: "ORD001", date: "2023-03-15", status: "delivered", progress: 100 },
  { id: "ORD002", date: "2023-03-20", status: "shipped", progress: 66 },
];

export default function UserAccountAvatar({
  user,
  orders = mockOrders,
  onProfileSave,
  onOrderView,
  className = "",
}: UserAccountAvatarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>(user);
  const shouldReduceMotion = useReducedMotion();

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
    <form className="flex flex-col gap-3 p-4" onSubmit={handleProfileSave}>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-medium text-muted-foreground"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          defaultValue={userData.name}
          id="name"
          name="name"
          placeholder="Enter your name"
          type="text"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          className="text-xs font-medium text-muted-foreground"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
          defaultValue={userData.email}
          id="email"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
      </div>

      <button
        className="mt-2 cursor-pointer rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand/90 hover:shadow-md active:scale-[0.98] active:bg-brand"
        type="submit"
      >
        Save Changes
      </button>
    </form>
  );

  const getStatusColor = (status: Order["status"]) => {
    if (status === "processing") {
      return "bg-blue-500";
    }
    if (status === "shipped") {
      return "bg-amber-500";
    }
    return "bg-emerald-500";
  };

  const renderLastOrders = () => (
    <div className="flex flex-col gap-3 p-4">
      {orders.map((order) => (
        <div
          className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
          key={order.id}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">{order.id}</div>
            <div className="text-xs text-muted-foreground">{order.date}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="capitalize font-medium text-foreground">
                  {order.status}
                </span>
                <span className="text-muted-foreground">{order.progress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? {}
                      : { width: `${order.progress}%` }
                  }
                  className={`h-full rounded-full ${getStatusColor(order.status)}`}
                  initial={shouldReduceMotion ? {} : { width: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 30, duration: 0.4 }
                  }
                />
              </div>
            </div>
            <button
              aria-label="View Order"
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-md border border-border bg-background p-2 transition-colors hover:bg-muted hover:border-primary"
              onClick={() => {
                onOrderView?.(order.id);
              }}
              type="button"
            >
              <Eye className="text-muted-foreground" size={16} />
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
          className="z-50 w-64 overflow-hidden rounded-xl border bg-background shadow-xl"
          sideOffset={8}
          style={{ pointerEvents: "auto" }}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { height: "auto" }}
            initial={shouldReduceMotion ? {} : { height: "auto" }}
            style={{ pointerEvents: "auto" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", duration: 0.25, bounce: 0 }
            }
          >
            <div className="flex flex-col divide-y divide-border" style={{ pointerEvents: "auto" }}>
              <button
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === "profile"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
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
                <User className="shrink-0" size={16} />
                Edit Profile
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "profile" && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, height: "auto" }
                        : {
                            opacity: 1,
                            height: "auto",
                            filter: "blur(0px)",
                          }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, height: 0, transition: { duration: 0 } }
                        : { opacity: 0, height: 0, filter: "blur(10px)" }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0, height: 0 }
                        : { opacity: 0, height: 0, filter: "blur(10px)" }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.25, bounce: 0 }
                    }
                  >
                    {renderEditProfile()}
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeSection === "orders"
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
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
                <Package className="shrink-0" size={16} />
                Last Orders
              </button>
              <AnimatePresence initial={false}>
                {activeSection === "orders" && (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1, height: "auto" }
                        : {
                            opacity: 1,
                            height: "auto",
                            filter: "blur(0px)",
                          }
                    }
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, height: 0, transition: { duration: 0 } }
                        : { opacity: 0, height: 0, filter: "blur(10px)" }
                    }
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0, height: 0 }
                        : { opacity: 0, height: 0, filter: "blur(10px)" }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { type: "spring", duration: 0.25, bounce: 0 }
                    }
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
