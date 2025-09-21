import type { Metadata } from "next"
import Link from "next/link"

import { BodyText } from "@/components/doc/BodyText"
import { Breadcrumbs } from "@/components/doc/breadcrumbs"
import { FeatureCard } from "@/components/doc/FeatureCard"
import { List } from "@/components/doc/List"
import { Title } from "@/components/doc/Title"
import Divider from "@/components/landing/divider"

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what SmoothUI is and how to get started with customizable React components built using TailwindCSS and Framer Motion.",
}

export default function IntroductionPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Breadcrumbs groupName="Get Started" currentPage="Introduction" />
        <div className="space-y-3.5">
          <Title level={1} tableContent="Introduction">
            Introduction
          </Title>
          <BodyText>
            SmoothUI is a collection of beautifully designed components with
            smooth animations built with React, Tailwind CSS, and Framer Motion.
          </BodyText>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* What is SmoothUI? */}
      <div className="space-y-4">
        <Title level={2} tableContent="What is SmoothUI?">
          What is SmoothUI?
        </Title>
        <BodyText>
          SmoothUI is a modern component library that brings together the best
          of React, Tailwind CSS, and Framer Motion to create beautiful,
          accessible, and performant user interfaces. Each component is
          carefully crafted with smooth animations and thoughtful design
          principles.
        </BodyText>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Beautiful Design
            </Title>
            <BodyText>
              Carefully crafted components with attention to detail and modern
              design principles.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Smooth Animations
            </Title>
            <BodyText>
              Powered by Framer Motion for fluid, performant animations that
              enhance user experience.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Developer Friendly
            </Title>
            <BodyText>
              Built with TypeScript, fully customizable with Tailwind CSS, and
              easy to integrate.
            </BodyText>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Key Features */}
      <div className="space-y-4">
        <Title level={2} tableContent="Key Features">
          Key Features
        </Title>
        <List>
          <li>
            <strong>shadcn CLI Compatible</strong>: Install components using the
            familiar shadcn CLI
          </li>
          <li>
            <strong>MCP Support</strong>: AI assistants can discover and install
            components automatically
          </li>
          <li>
            <strong>TypeScript First</strong>: Full type safety with
            comprehensive TypeScript support
          </li>
          <li>
            <strong>Accessible by Default</strong>: Built with accessibility
            best practices
          </li>
          <li>
            <strong>Dark Mode Support</strong>: All components work seamlessly
            in light and dark themes
          </li>
          <li>
            <strong>Customizable</strong>: Easy to customize with Tailwind CSS
            classes
          </li>
          <li>
            <strong>Performance Optimized</strong>: Built with performance in
            mind using modern React patterns
          </li>
        </List>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Navigation Cards */}
      <div className="space-y-4">
        <Title level={2} tableContent="Get Started">
          Get Started
        </Title>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/doc/installation"
            className="group bg-primary hover:bg-primary/80 rounded-lg border p-6 transition-colors"
          >
            <Title
              level={3}
              className="group-hover:text-brand mb-2 transition-colors"
            >
              Installation Guide
            </Title>
            <BodyText>
              Learn how to install SmoothUI components using shadcn CLI or
              manual installation methods.
            </BodyText>
          </Link>

          <Link
            href="/doc/components"
            className="group bg-primary hover:bg-primary/80 rounded-lg border p-6 transition-colors"
          >
            <Title
              level={3}
              className="group-hover:text-brand mb-2 transition-colors"
            >
              Browse All Components
            </Title>
            <BodyText>
              Explore all available components with live demos and
              documentation.
            </BodyText>
          </Link>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* FAQ */}
      <div className="space-y-4">
        <Title level={2} tableContent="Frequently Asked Questions">
          Frequently Asked Questions
        </Title>

        <div className="space-y-4">
          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Is SmoothUI free to use?
            </Title>
            <BodyText>
              Yes! SmoothUI is completely free and open source. You can use it
              in personal and commercial projects.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Do I need to know Framer Motion to use SmoothUI?
            </Title>
            <BodyText>
              No! All animations are built-in. You can use components without
              any Framer Motion knowledge.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Can I customize the components?
            </Title>
            <BodyText>
              Absolutely! All components are built with Tailwind CSS and can be
              customized using standard Tailwind classes.
            </BodyText>
          </div>

          <div className="bg-primary/50 rounded-lg border p-4">
            <Title level={3} className="mb-2">
              Does SmoothUI work with Next.js?
            </Title>
            <BodyText>
              Yes! SmoothUI works with any React framework including Next.js,
              Vite, Create React App, and more.
            </BodyText>
          </div>
        </div>
      </div>
      <Divider orientation="horizontal" className="relative" />
      {/* Contributing */}
      <div className="space-y-4">
        <Title level={2} tableContent="Contributing">
          Contributing
        </Title>
        <BodyText>
          We welcome contributions to SmoothUI! Whether you want to add new
          components, improve existing ones, or fix bugs, your contributions
          help make SmoothUI better for everyone.
        </BodyText>

        <FeatureCard title="How to Contribute" variant="info">
          <List spacing="tight">
            <li>Fork the repository on GitHub</li>
            <li>Create a new branch for your feature or bug fix</li>
            <li>Make your changes and test them thoroughly</li>
            <li>Submit a pull request with a clear description</li>
          </List>
        </FeatureCard>

        <BodyText>
          Check out our{" "}
          <Link
            href="https://github.com/educlopez/smoothui/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            contributing guide
          </Link>{" "}
          for more detailed information.
        </BodyText>
      </div>
    </div>
  )
}
