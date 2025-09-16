"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"

interface TeamGridProps {
  title?: string
  description?: string
  members?: Array<{
    name: string
    role: string
    bio?: string
    avatar: string
    location?: string
    social?: {
      twitter?: string
      linkedin?: string
      github?: string
    }
  }>
}

export function TeamGrid({
  title = "Our team",
  description = "We're a dynamic group of individuals who are passionate about what we do and dedicated to delivering the best results for our clients.",
  members = [
    {
      name: "Eduardo Calvo",
      role: "CEO & Founder",
      bio: "Passionate about building products that make a difference.",
      avatar: "https://github.com/educlopez.png",
      location: "Spain",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Emil Kowalski",
      role: "CTO",
      bio: "Full-stack engineer with 10+ years of experience.",
      avatar: "https://github.com/emilkowalski.png",
      location: "Poland",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Rauno Freiberg",
      role: "Head of Design",
      bio: "Creating beautiful and intuitive user experiences.",
      avatar: "https://github.com/raunofreiberg.png",
      location: "Estonia",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
    {
      name: "Rauch",
      role: "Lead Developer",
      bio: "Building scalable solutions for modern applications.",
      avatar: "https://github.com/rauchg.png",
      location: "United States",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com",
      },
    },
  ],
}: TeamGridProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="bg-white py-24 sm:py-32 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl lg:mx-0"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">
            {title}
          </h2>
          <p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-400">
            {description}
          </p>
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
                  <Image
                    alt=""
                    src={member.avatar}
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
                <h3 className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900 dark:text-white">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-base/7 text-gray-600 dark:text-gray-300">
                  {member.role}
                </p>

                {/* Location */}
                {member.location && (
                  <p className="text-sm/6 text-gray-500 dark:text-gray-400">
                    {member.location}
                  </p>
                )}

                {/* Bio */}
                {member.bio && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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
