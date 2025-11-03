"use client";

import AnimatedInput from "@repo/smoothui/components/animated-input";
import { Lock, Mail, User } from "lucide-react";
import { useState } from "react";

const Example = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Animated Input Examples</h3>

        <AnimatedInput
          icon={<Mail className="h-4 w-4 text-gray-400" />}
          label="Email Address"
          onChange={setEmail}
          placeholder="Enter your email"
          value={email}
        />

        <AnimatedInput
          icon={<User className="h-4 w-4 text-gray-400" />}
          label="Username"
          onChange={setUsername}
          placeholder="Choose a username"
          value={username}
        />

        <AnimatedInput
          icon={<Lock className="h-4 w-4 text-gray-400" />}
          label="Password"
          onChange={setPassword}
          placeholder="Enter your password"
          value={password}
        />
      </div>

      <div className="text-gray-600 text-sm dark:text-gray-300">
        <p>Try focusing on the inputs to see the label animation!</p>
      </div>
    </div>
  );
};

export default Example;
