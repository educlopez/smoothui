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
      title: "Senior Frontend Engineer",
      logo: <Resend className="h-8 w-8" />,
      job_description:
        "We're looking for a senior frontend engineer to help us build the future of email infrastructure. You'll work on our React-based dashboard and help scale our platform.",
      salary: "$120k - $180k",
      location: "San Francisco",
      remote: "Hybrid",
      job_time: "Full-time",
    },
    {
      company: "Turso",
      title: "Backend Developer",
      logo: <Turso className="h-8 w-8" />,
      job_description:
        "Join our team to build the next generation of edge database technology. You'll work with Rust and help optimize our distributed database system.",
      salary: "$100k - $150k",
      location: "Remote",
      remote: "Yes",
      job_time: "Full-time",
    },
    {
      company: "Supabase",
      title: "Developer Advocate",
      logo: <Supabase className="h-8 w-8" />,
      job_description:
        "Help developers around the world discover and adopt Supabase. You'll create content, speak at conferences, and build community around our open-source platform.",
      salary: "$90k - $130k",
      location: "Remote",
      remote: "Yes",
      job_time: "Full-time",
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
