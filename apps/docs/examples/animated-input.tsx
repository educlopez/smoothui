"use client";

import AnimatedInput from "@repo/smoothui/components/animated-input";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const EmailDemo = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <AnimatedInput
          icon={<Mail className="h-4 w-4 text-gray-400" />}
          label="Email Address"
          onChange={setEmail}
          placeholder="Enter your email"
          value={email}
        />
      </div>
    </div>
  );
};

const UsernameDemo = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <AnimatedInput
          icon={<User className="h-4 w-4 text-gray-400" />}
          label="Username"
          onChange={setUsername}
          placeholder="Choose a username"
          value={username}
        />
      </div>
    </div>
  );
};

const PasswordDemo = () => {
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <AnimatedInput
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          label="Password"
          onChange={setPassword}
          placeholder="Enter your password"
          value={password}
        />
      </div>
    </div>
  );
};

export const demoScenes = {
  Email: EmailDemo,
  Features: EmailDemo,
  Password: PasswordDemo,
  Username: UsernameDemo,
};

export default function AnimatedInputDemo() {
  return <EmailDemo />;
}
