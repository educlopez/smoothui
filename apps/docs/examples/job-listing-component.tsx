"use client";

import JobListingComponent, {
  Resend,
  Supabase,
  Turso,
} from "@repo/smoothui/components/job-listing-component";

const Example = () => {
  const sampleJobs = [
    {
      company: "Resend",
      job_description:
        "We're looking for a senior frontend engineer to help us build the future of email infrastructure. You'll work on our React-based dashboard and help scale our platform.",
      job_time: "Full-time",
      location: "San Francisco",
      logo: <Resend className="h-8 w-8" />,
      remote: "Hybrid",
      salary: "$120k - $180k",
      title: "Senior Frontend Engineer",
    },
    {
      company: "Turso",
      job_description:
        "Join our team to build the next generation of edge database technology. You'll work with Rust and help optimize our distributed database system.",
      job_time: "Full-time",
      location: "Remote",
      logo: <Turso className="h-8 w-8" />,
      remote: "Yes",
      salary: "$100k - $150k",
      title: "Backend Developer",
    },
    {
      company: "Supabase",
      job_description:
        "Help developers around the world discover and adopt Supabase. You'll create content, speak at conferences, and build community around our open-source platform.",
      job_time: "Full-time",
      location: "Remote",
      logo: <Supabase className="h-8 w-8" />,
      remote: "Yes",
      salary: "$90k - $130k",
      title: "Developer Advocate",
    },
  ];

  return (
    <div className="flex min-h-[600px] items-center justify-center">
      <JobListingComponent
        jobs={sampleJobs}
        onJobClick={(job) => console.log("Job clicked:", job.company)}
      />
    </div>
  );
};

export default Example;
