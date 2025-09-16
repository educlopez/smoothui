"use client"

import {
  Canpoy,
  Canva,
  Casetext,
  Clearbit,
  Descript,
  Duolingo,
  Faire,
  IDEO,
  KhanAcademy,
  Quizlet,
  Ramp,
  Strava,
} from "./logos"

const LOGOS = [
  <Canpoy key="1" />,
  <Canva key="2" />,
  <Casetext key="3" />,
  <Strava key="4" />,
  <Descript key="5" />,
  <Duolingo key="6" />,
  <Faire key="7" />,
  <Clearbit key="8" />,
  <IDEO key="9" />,
  <KhanAcademy key="10" />,
  <Quizlet key="11" />,
  <Ramp key="12" />,
]

export function LogoCloudSimple({
  title = "You're in good company",
  description = "Trusted by leading teams from around the world",
  count = 4,
}: {
  title?: string
  description?: string
  count?: number
}) {
  const logos = LOGOS.slice(0, count)

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center text-balance md:mb-16">
          <h2 className="text-4xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-4 text-lg">{description}</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 md:grid-cols-4">
          {logos.map((logo) => (
            <div
              key={logo.key}
              className="*:fill-foreground flex items-center justify-center opacity-60 transition-opacity duration-200 hover:opacity-100"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
