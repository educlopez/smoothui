"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"

import {
  getAvatarUrl,
  peopleData,
  type Person,
} from "@/app/doc/data/peopleData"

interface TeamGridProps {
  title?: string
  description?: string
  members?: Person[]
}

export function TeamGrid({
  title = "Our team",
  description = "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
  members = peopleData.slice(0, 4),
}: TeamGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="bg-primary py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:mx-0"
        >
          <h2 className="text-foreground text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
            {title}
          </h2>
          <p className="text-foreground/70 mt-6 text-lg/8">{description}</p>
        </motion.div>

        <motion.ul
          ref={ref}
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4"
        >
          {members.map((member, index) => (
            <motion.li
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Avatar */}
                <motion.div
                  className="relative overflow-hidden rounded-2xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    alt=""
                    src={getAvatarUrl(member.avatar, 400)}
                    width={400}
                    height={400}
                    className="aspect-14/13 w-full rounded-2xl object-cover outline-1 -outline-offset-1 outline-black/5 transition-all duration-300 group-hover:outline-black/10 dark:outline-white/10 dark:group-hover:outline-white/20"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Name */}
                <h3 className="text-foreground mt-6 text-lg/8 font-semibold tracking-tight">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-foreground/70 text-base/7">{member.role}</p>

                {/* Location */}
                {member.location && (
                  <p className="text-foreground/70 text-sm/6">
                    {member.location}
                  </p>
                )}

                {/* Bio */}
                {member.bio && (
                  <p className="text-foreground/70 mt-2 text-sm">
                    {member.bio}
                  </p>
                )}
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
