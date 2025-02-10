"use client"

import { useEffect, useRef, useState, type JSX } from "react"
import type { SVGProps } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOnClickOutside } from "usehooks-ts"

export const Resend = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 600 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M186 447.471V154H318.062C336.788 154 353.697 158.053 368.79 166.158C384.163 174.263 396.181 185.443 404.845 199.698C413.51 213.672 417.842 229.604 417.842 247.491C417.842 265.938 413.51 282.568 404.845 297.381C396.181 311.915 384.302 323.375 369.209 331.759C354.117 340.144 337.067 344.337 318.062 344.337H253.917V447.471H186ZM348.667 447.471L274.041 314.99L346.99 304.509L430 447.471H348.667ZM253.917 289.835H311.773C319.04 289.835 325.329 288.298 330.639 285.223C336.229 281.869 340.421 277.258 343.216 271.388C346.291 265.519 347.828 258.811 347.828 251.265C347.828 243.718 346.151 237.15 342.797 231.56C339.443 225.691 334.552 221.219 328.124 218.144C321.975 215.07 314.428 213.533 305.484 213.533H253.917V289.835Z"
      fill="inherit"
    />
  </svg>
)

export const Turso = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="none"
    height="1em"
    viewBox="0 0 201 170"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m100.055 170c-2.1901 0-18.2001-12.8-21.3001-16.45-2.44 3.73-6.44 7.96-6.44 7.96-11.05-5.57-25.17-20.06-27.83-25.13-2.62-5-12.13-62.58-12.39-79.3-.34-9.41 5.85-28.49 67.9601-28.49 62.11 0 68.29 19.08 67.96 28.49-.25 16.72-9.76 74.3-12.39 79.3-2.66 5.07-16.78 19.56-27.83 25.13 0 0-4-4.23-6.44-7.96-3.1 3.65-19.11 16.45-21.3 16.45z"
      fill="#1ebca1"
    />
    <path
      d="m100.055 132.92c-20.7301 0-33.9601-10.95-33.9601-10.95l1.91-26.67-21.75-1.94-3.91-31.55h115.4301l-3.91 31.55-21.75 1.94 1.91 26.67s-13.23 10.95-33.96 10.95z"
      fill="#183134"
    />
    <path
      d="m121.535 75.79 78.52-27.18c-4.67-27.94-29.16-48.61-29.16-48.61v30.78l-14.54 3.75-9.11-10.97-7.8 15.34-39.38 10.16-39.3801-10.16-7.8-15.34-9.11 10.97-14.54-3.75v-30.78s-24.50997 20.67-29.1799684 48.61l78.5199684 27.18-2.8 37.39c6.7 1.7 13.75 3.39 24.2801 3.39 10.53 0 17.57-1.69 24.27-3.39l-2.8-37.39z"
      fill="#4ff8d2"
    />
  </svg>
)

export const Supabase = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 109 113"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint0_linear)"
    />
    <path
      d="M63.7076 110.284C60.8481 113.885 55.0502 111.912 54.9813 107.314L53.9738 40.0627L99.1935 40.0627C107.384 40.0627 111.952 49.5228 106.859 55.9374L63.7076 110.284Z"
      fill="url(#paint1_linear)"
      fillOpacity={0.2}
    />
    <path
      d="M45.317 2.07103C48.1765 -1.53037 53.9745 0.442937 54.0434 5.041L54.4849 72.2922H9.83113C1.64038 72.2922 -2.92775 62.8321 2.1655 56.4175L45.317 2.07103Z"
      fill="#3ECF8E"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1={53.9738}
        y1={54.974}
        x2={94.1635}
        y2={71.8295}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#249361" />
        <stop offset={1} stopColor="#3ECF8E" />
      </linearGradient>
      <linearGradient
        id="paint1_linear"
        x1={36.1558}
        y1={30.578}
        x2={54.4844}
        y2={65.0806}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset={1} stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
)

export default function JobListingComponent() {
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
