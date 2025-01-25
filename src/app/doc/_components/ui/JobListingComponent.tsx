"use client"

import { useEffect, useRef, useState, type JSX } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOnClickOutside } from "usehooks-ts"

import {
  Resend,
  Supabase,
  Turso,
} from "@/app/doc/_components/resources/logos/appleList"

export const JobListingComponent = () => {
  const [activeItem, setActiveItem] = useState<{
    company: string
    logo: JSX.Element
    title: string
    job_description: string
    salary: string
    location: string
    remote: string
    job_time: string
  } | null>(null)
  const ref = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  useOnClickOutside(ref, () => setActiveItem(null))

  useEffect(() => {
    function onKeyDown(event: { key: string }) {
      if (event.key === "Escape") {
        setActiveItem(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <>
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-light-900/10 dark:bg-dark-50/10 pointer-events-none absolute inset-0 z-10 bg-blend-luminosity backdrop-blur-xl"
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {activeItem ? (
          <>
            <div className="group absolute inset-0 z-10 grid place-items-center">
              <motion.div
                className="bg-light-50 dark:bg-dark-50 flex h-fit w-[90%] cursor-pointer flex-col items-start gap-4 overflow-hidden p-4 shadow-xs"
                ref={ref}
                layoutId={`workItem-${activeItem.company}`}
                style={{ borderRadius: 12 }}
              >
                <div className="flex w-full items-center gap-4">
                  <motion.div layoutId={`workItemLogo-${activeItem.company}`}>
                    {activeItem.logo}
                  </motion.div>
                  <div className="flex grow items-center justify-between">
                    <div className="flex w-full flex-col gap-0.5">
                      <div className="flex w-full flex-row justify-between gap-0.5">
                        <motion.div
                          className="text-light-503 dark:text-dark-503 text-sm font-medium"
                          layoutId={`workItemCompany-${activeItem.company}`}
                        >
                          {activeItem.company}
                        </motion.div>
                      </div>
                      <motion.p
                        layoutId={`workItemTitle-${activeItem.company}`}
                        className="text-light-900 dark:text-dark-900 text-sm"
                      >
                        {activeItem.title} / {activeItem.salary}
                      </motion.p>
                      <motion.div
                        className="text-light-900 dark:text-dark-900 flex flex-row gap-2 text-xs"
                        layoutId={`workItemExtras-${activeItem.company}`}
                      >
                        {activeItem.remote === "Yes" &&
                          ` ${activeItem.location} `}
                        {activeItem.remote === "No" &&
                          ` ${activeItem.location} `}
                        {activeItem.remote === "Hybrid" &&
                          ` ${activeItem.remote} / ${activeItem.location} `}
                        | {activeItem.job_time}
                      </motion.div>
                    </div>
                  </div>
                </div>
                <motion.p
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.05 } }}
                  className="text-light-900 dark:text-dark-900 text-sm"
                >
                  {activeItem.job_description}
                </motion.p>
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
      <div className="relative flex items-start p-6">
        <div className="relative flex w-full flex-col items-center gap-4 px-2">
          {content.map((role) => (
            <motion.div
              layoutId={`workItem-${role.company}`}
              key={role.company}
              className="group border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 flex w-full cursor-pointer flex-row items-center gap-4 border p-2 shadow-xs md:p-4"
              onClick={() => setActiveItem(role)}
              style={{ borderRadius: 8 }}
            >
              <motion.div layoutId={`workItemLogo-${role.company}`}>
                {role.logo}
              </motion.div>
              <div className="flex w-full flex-col items-start justify-between gap-0.5">
                <motion.div
                  className="text-light-950 dark:text-dark-950 font-medium"
                  layoutId={`workItemCompany-${role.company}`}
                >
                  {role.company}
                </motion.div>
                <motion.div
                  className="text-light-900 dark:text-dark-900 text-xs"
                  layoutId={`workItemTitle-${role.company}`}
                >
                  {role.title} / {role.salary}
                </motion.div>

                <motion.div
                  className="text-light-900 dark:text-dark-900 flex flex-row gap-2 text-xs"
                  layoutId={`workItemExtras-${role.company}`}
                >
                  {role.remote === "Yes" && ` ${role.location} `}
                  {role.remote === "No" && ` ${role.location} `}
                  {role.remote === "Hybrid" &&
                    ` ${role.remote} / ${role.location} `}
                  | {role.job_time}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}

const content: {
  company: string
  title: string
  logo: JSX.Element
  job_description: string
  salary: string
  location: string
  remote: string
  job_time: string
}[] = [
  {
    company: "Supabase",
    title: "I/UX Designer",
    logo: <Supabase />,
    job_description:
      "We are looking for a creative and driven UI/UX Designer to join our team. You will be responsible for designing and implementing user interfaces for our web and mobile applications.",
    salary: "$85,000 - $95,000",
    location: "San Francisco, CA",
    remote: "No",
    job_time: "Full-time",
  },
  {
    company: "Resend",
    title: "UI Developer",
    logo: <Resend className="fill-black dark:fill-white" />,
    job_description:
      "Seeking an experienced UI Developer to work on our latest project. The ideal candidate will have strong skills in HTML, CSS, and JavaScript, and a keen eye for detail.",
    salary: "$75,000 - $85,000",
    location: "Remote",
    remote: "Yes",
    job_time: "Contract",
  },
  {
    company: "Turso",
    title: "Graphic Designer",
    logo: <Turso />,
    job_description:
      "We are in search of a talented Graphic Designer with UI experience to help create stunning visuals for our clients. This role involves collaboration with the design team and clients to deliver high-quality work.",
    salary: "$60,000 - $70,000",
    location: "New York, NY",
    remote: "Hybrid",
    job_time: "Part-time",
  },
]
