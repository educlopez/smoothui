"use client"

import Image from "next/image"

import {
  getAllPeople,
  getAvatarUrl,
  getPeopleByRole,
  getPeopleWithTestimonials,
  getTeamMembers,
  getTestimonials,
} from "@/app/doc/data/peopleData"

import { TeamCarousel } from "../blocks/TeamCarousel"
import { TeamGrid } from "../blocks/TeamGrid"
import { TestimonialsStars } from "../blocks/TestimonialsStars"

export function PeopleDataExample() {
  return (
    <div className="space-y-32">
      {/* Team Grid with first 4 people */}
      <section>
        <h2 className="mb-8 text-3xl font-bold">Team Grid Example</h2>
        <TeamGrid
          title="Our Amazing Team"
          description="Meet the talented individuals who make everything possible."
          members={getTeamMembers(4)}
        />
      </section>

      {/* Team Carousel with all people */}
      <section>
        <h2 className="mb-8 text-3xl font-bold">Team Carousel Example</h2>
        <TeamCarousel
          title="Tech Experts"
          subtitle="driving innovation"
          description="Our diverse team brings together expertise from around the world."
          members={getAllPeople()}
        />
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="mb-8 text-3xl font-bold">Testimonials Example</h2>
        <TestimonialsStars />
      </section>

      {/* Custom usage examples */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold">Custom Usage Examples</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {getTeamMembers(6, true).map((person) => (
            <div key={person.name} className="rounded-lg border p-6">
              <Image
                src={getAvatarUrl(person.avatar, 60)}
                alt={person.name}
                width={60}
                height={60}
                className="mb-4 h-15 w-15 rounded-full"
              />
              <h3 className="text-lg font-semibold">{person.name}</h3>
              <p className="text-gray-600">{person.role}</p>
              {person.location && (
                <p className="text-sm text-gray-500">{person.location}</p>
              )}
              {person.bio && <p className="mt-2 text-sm">{person.bio}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials with custom data */}
      <section>
        <h2 className="mb-8 text-3xl font-bold">Custom Testimonials</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {getTestimonials(4).map((testimonial) => (
            <div key={testimonial.name} className="rounded-lg border p-6">
              <div className="mb-4 flex items-center gap-3">
                <Image
                  src={getAvatarUrl(testimonial.avatar, 40)}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="mb-3 text-gray-700">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={`${testimonial.name}-star-${i}`}
                    className={`text-sm ${
                      i < (testimonial.stars || 0)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Filter by role example */}
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">Engineers Only</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {getPeopleByRole("engineer").map((person) => (
              <div key={person.name} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={getAvatarUrl(person.avatar, 40)}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{person.name}</h4>
                    <p className="text-sm text-gray-600">{person.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* People with testimonials only */}
        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold">
            People with Testimonials
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {getPeopleWithTestimonials().map((person) => (
              <div key={person.name} className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={getAvatarUrl(person.avatar, 40)}
                    alt={person.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-semibold">{person.name}</h4>
                    <p className="text-sm text-gray-600">{person.role}</p>
                    {person.stars && (
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={`${person.name}-testimonial-star-${i}`}
                            className={`text-xs ${
                              i < (person.stars || 0)
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PeopleDataExample
