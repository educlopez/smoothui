import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import JobListingComponent, { type Job } from "../index";

const jobs: Job[] = [
  {
    company: "SmoothUI",
    title: "Frontend Engineer",
    job_description: "Build animated UIs.",
    job_time: "Full-time",
    location: "Remote",
    logo: <span>S</span>,
    remote: "Yes",
    salary: "100k",
  },
];

describe("JobListingComponent", () => {
  it("renders without throwing", () => {
    const { container } = render(<JobListingComponent jobs={jobs} />);
    expect(container).toBeInTheDocument();
  });
});
