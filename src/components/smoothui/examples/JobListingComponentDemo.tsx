import React from "react"

import JobListingComponent, {
  Job,
  Resend,
  Supabase,
  Turso,
} from "../ui/JobListingComponent"

const jobs: Job[] = [
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

const JobListingComponentDemo = () => <JobListingComponent jobs={jobs} />

export default JobListingComponentDemo
