"use client";

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
} from "../shared";

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
];

type LogoCloudSimpleProps = {
  title?: string;
  description?: string;
  count?: number;
};

export function LogoCloudSimple({
  title = "You're in good company",
  description = "Trusted by leading teams from around the world",
  count = 4,
}: LogoCloudSimpleProps) {
  const logos = LOGOS.slice(0, count);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-balance text-center md:mb-16">
          <h2 className="font-semibold text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-center gap-8 md:grid-cols-4">
          {logos.map((logo) => (
            <div
              className="flex items-center justify-center opacity-60 transition-opacity duration-200 *:fill-foreground hover:opacity-100"
              key={logo.key}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LogoCloudSimple;
