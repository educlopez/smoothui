"use client";

import { getAllPeople, getAvatarUrl, type Person } from "@smoothui/data";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const DEFAULT_MEMBER_COUNT = 4;
const AVATAR_SIZE = 400;
const STAGGER_DELAY = 0.1;

interface TeamGridProps {
  title?: string;
  description?: string;
  members?: Person[];
}

export function TeamGrid({
  title = "Our team",
  description = "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
  members = getAllPeople().slice(0, DEFAULT_MEMBER_COUNT),
}: TeamGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-pretty font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-foreground/70 text-lg/8">{description}</p>
        </motion.div>
        <motion.ul
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
          ref={ref}
        >
          {members.map((member, index) => (
            <motion.li
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              initial={{ opacity: 0, y: 30 }}
              key={member.name}
              transition={{ duration: 0.6, delay: index * STAGGER_DELAY }}
            >
              <motion.div
                className="group"
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Avatar */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    alt=""
                    className="aspect-14/13 w-full rounded-2xl object-cover outline-1 outline-black/5 -outline-offset-1 transition-all duration-300 group-hover:outline-black/10 dark:outline-white/10 dark:group-hover:outline-white/20"
                    height={AVATAR_SIZE}
                    src={getAvatarUrl(member.avatar, AVATAR_SIZE)}
                    width={AVATAR_SIZE}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ opacity: 1 }}
                  />
                </motion.div>
                {/* Name */}
                <h3 className="mt-6 font-semibold text-foreground text-lg/8 tracking-tight">
                  {member.name}
                </h3>
                {/* Role */}
                <p className="text-base/7 text-foreground/70">{member.role}</p>
                {/* Location */}
                {member.location && (
                  <p className="text-foreground/70 text-sm/6">
                    {member.location}
                  </p>
                )}
                {/* Bio */}
                {member.bio && (
                  <p className="mt-2 text-foreground/70 text-sm">
                    {member.bio}
                  </p>
                )}
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

export default TeamGrid;
