"use client";

import AgentAvatar from "@repo/smoothui/components/agent-avatar";

const AgentAvatarDemo = () => (
  <div className="flex flex-wrap items-center justify-center gap-6 p-8">
    <div className="text-center">
      <AgentAvatar seed="Harper" size={80} />
      <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
        Harper
      </p>
    </div>
    <div className="text-center">
      <AgentAvatar seed="Lucas" size={80} />
      <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
        Lucas
      </p>
    </div>
    <div className="text-center">
      <AgentAvatar seed="Olivia" size={80} />
      <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
        Olivia
      </p>
    </div>
    <div className="text-center">
      <AgentAvatar seed="Benjamin" size={80} />
      <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
        Benjamin
      </p>
    </div>
    <div className="text-center">
      <AgentAvatar seed="Charlotte" size={80} />
      <p className="mt-2 text-neutral-500 text-sm dark:text-neutral-400">
        Charlotte
      </p>
    </div>
  </div>
);

export default AgentAvatarDemo;
