import { castPeople } from "./cast";

/** Fictional generated demo people. Names, portraits and roles come from Troupe.
 * The real founder remains separate. Company/contact fields are sample data. */
export interface Person {
  /** Deterministic per person: fallback backgrounds, rings, cursor labels. */
  accent: string;
  avatar: string;
  /** Present only where a demo needs prose about the person. */
  bio?: string;
  company: string;
  email: string;
  experience?: string;
  handle: string;
  /** Slug, and the avatar filename. Stable — safe to use as a React key. */
  id: string;
  /** Fallback for an avatar that has not loaded. */
  initials: string;
  location: string;
  name: string;
  role: string;
}

export const people: Person[] = castPeople.map((person, index) => ({
  accent: `oklch(0.72 0.15 ${(index * 47) % 360})`,
  avatar: person.src,
  company: "Demo Studio",
  email: `${person.id}@example.com`,
  handle: `@${person.id.replaceAll("-", "")}`,
  id: person.id,
  initials: person.name
    .split(" ")
    .map((part) => part[0])
    .join(""),
  location: "Remote",
  name: person.name,
  role: person.role,
}));

/** Lookup-only compatibility: old fictional IDs return complete canonical identities. */
export const legacyPersonIds: Record<string, string> = {
  "abraham-baker": "maya-solis",
  "adem-lane": "hana-park",
  "adil-floyd": "zara-ndiaye",
  "adriana-osullivan": "luca-moretti",
  "alec-whitten": "jun-park",
  "alesha-barry": "marcus-hale",
  "ali-mahdi": "meera-kapoor",
  "aliah-lane": "niels-holm",
  "alisa-hester": "leila-hassan",
  "amanda-lowery": "diego-ramos",
  "amelie-bennett": "ines-moreau",
  "amelie-laurent": "arjun-mehta",
  "ammar-foley": "camila-duarte",
  "anaiah-whitten": "sasha-kim",
  "andi-lane": "freya-lund",
  "angelica-wallace": "saoirse-flynn",
  "anita-cruz": "rowan-obrien",
  "ashton-blackwell": "erik-lindqvist",
  "ashwin-santiago": "chloe-bennett",
  "aston-hood": "isla-reid",
  "ava-bentley": "lars-bergman",
  "ava-wright": "morgan-reed",
  "ayah-wilkinson": "amina-osei",
  "aysha-becker": "malik-johnson",
  "bailey-richards": "yuki-tanaka",
  "bec-ferguson": "helen-frost",
  "belle-woods": "bridget-cairns",
  "benedict-doherty": "omar-khalil",
  "billie-wright": "sofia-reyes",
  "blake-riley": "kai-thompson",
  "brianna-ware": "ananya-sharma",
  "byron-robertson": "hiro-sato",
  "caitlyn-king": "theo-miller",
  "cameron-yang": "nia-brooks",
  "candice-wu": "elise-carter",
  "clifford-jennings": "jordan-wells",
  "cohen-lozano": "graham-price",
  "courtney-turner": "linh-nguyen",
  "danyal-lester": "miguel-santos",
  "demi-wilkinson": "amara-cole",
  "dillan-nguyen": "ezra-cohen",
  "drew-cano": "rosa-mendez",
  "eduard-franz": "ren-okada",
  "elena-owens": "connor-hayes",
  "elisa-nishikawa": "fatima-rahman",
  "elsie-roy": "derrick-hayes",
  "erica-wyatt": "nora-blake",
  "ethan-campbell": "tasha-greene",
  "ethan-valdez": "noah-petrov",
  "eva-bond": "valeria-cruz",
  "eve-leroy": "maya-solis",
  "fergus-gray": "hana-park",
  "fleur-cook": "zara-ndiaye",
  "florence-shaw": "luca-moretti",
  "frank-whitaker": "jun-park",
  "franklin-mays": "marcus-hale",
  "freya-browning": "meera-kapoor",
  "genevieve-mclean": "niels-holm",
  "harriet-rojas": "leila-hassan",
  "harry-bender": "diego-ramos",
  "hasan-johns": "ines-moreau",
  "herbert-fowler": "arjun-mehta",
  "isla-allison": "camila-duarte",
  "isobel-carroll": "sasha-kim",
  "isobel-fuller": "freya-lund",
  "jackson-reed": "saoirse-flynn",
  "jay-shepard": "rowan-obrien",
  "jaya-willis": "erik-lindqvist",
  "jayden-moss": "chloe-bennett",
  "jessie-meyton": "isla-reid",
  "jonathan-kelly": "lars-bergman",
  "jordan-burgess": "morgan-reed",
  "joshua-wilson": "amina-osei",
  "julius-vaughan": "malik-johnson",
  "kaden-scott": "yuki-tanaka",
  "kaitlin-hale": "helen-frost",
  "kari-rasmussen": "bridget-cairns",
  "kate-morrison": "omar-khalil",
  "katherine-moss": "sofia-reyes",
  "katy-fuller": "kai-thompson",
  "kelly-williams": "ananya-sharma",
  "kelsey-lowe": "hiro-sato",
  "koray-okumus": "theo-miller",
  "kyla-clay": "nia-brooks",
  "lana-steiner": "elise-carter",
  "levi-rocha": "jordan-wells",
  "leyton-fields": "graham-price",
  "liam-hood": "linh-nguyen",
  "lily-rose-chedjou": "miguel-santos",
  "loki-bright": "amara-cole",
  "lola-sanders": "ezra-cohen",
  "lori-bryson": "rosa-mendez",
  "lucy-bond": "ren-okada",
  "lulu-meyers": "connor-hayes",
  "luqman-anthony": "fatima-rahman",
  "lyle-kauffman": "derrick-hayes",
  "maddison-gillespie": "nora-blake",
  "madeleine-pitts": "tasha-greene",
  "marco-gross": "noah-petrov",
  "marco-kelly": "valeria-cruz",
  "marvin-robbins": "maya-solis",
  "mathilde-lewis": "hana-park",
  "maxwell-tan": "zara-ndiaye",
  "mikey-lawrence": "luca-moretti",
  "mollie-hall": "jun-park",
  "molly-vaughan": "marcus-hale",
  "nala-goins": "meera-kapoor",
  "natali-craig": "niels-holm",
  "nic-fassbender": "leila-hassan",
  "nicola-harris": "diego-ramos",
  "nicolas-trevino": "ines-moreau",
  "nicolas-wang": "arjun-mehta",
  "nikolas-gibbons": "camila-duarte",
  "noah-pierre": "sasha-kim",
  "noel-baldwin": "freya-lund",
  "olivia-rhye": "saoirse-flynn",
  "olly-schroeder": "rowan-obrien",
  "orlando-diggs": "erik-lindqvist",
  "owen-garcia": "chloe-bennett",
  "owen-harding": "isla-reid",
  "phoenix-baker": "lars-bergman",
  "pippa-wilkinson": "morgan-reed",
  "priya-shepard": "amina-osei",
  "rachael-strong": "malik-johnson",
  "rayhan-zua": "yuki-tanaka",
  "rene-wells": "helen-frost",
  "rhea-levine": "bridget-cairns",
  "rhianna-shepard": "omar-khalil",
  "riley-omoore": "sofia-reyes",
  "rory-huff": "kai-thompson",
  "rosalee-melvin": "ananya-sharma",
  "sally-mason": "hiro-sato",
  "sarah-page": "theo-miller",
  "scott-clayton": "nia-brooks",
  "sienna-hewitt": "elise-carter",
  "sophia-perez": "jordan-wells",
  "stefan-sears": "graham-price",
  "youssef-roberson": "linh-nguyen",
  "zahir-mays": "miguel-santos",
  "zahra-christensen": "amara-cole",
  "zaid-schwartz": "ezra-cohen",
  "zara-bush": "rosa-mendez",
  "zaynab-donnelly": "ren-okada",
  "zuzanna-burke": "connor-hayes",
};
/**
 * What someone said, kept apart from who they are — a person appears in far more
 * demos than testimonial walls, and most of them have nothing to quote.
 */
export interface Testimonial {
  personId: string;
  quote: string;
  /** 1–5. */
  stars: number;
}

export const testimonials: Testimonial[] = [
  {
    personId: "maya-solis",
    quote:
      "The design system is incredibly well thought out. Every component feels intentional and polished.",
    stars: 5,
  },
  {
    personId: "hana-park",
    quote:
      "The performance is outstanding. Our bundle size stayed the same while getting beautiful animations.",
    stars: 5,
  },
  {
    personId: "zara-ndiaye",
    quote:
      "The accessibility features are top-notch. Every component follows WCAG guidelines perfectly.",
    stars: 5,
  },
  {
    personId: "luca-moretti",
    quote: "Thoughtful details make every interaction feel easier.",
    stars: 5,
  },
  {
    personId: "jun-park",
    quote:
      "Best UI library I've used. The TypeScript support is excellent and the components are highly customizable.",
    stars: 5,
  },
  {
    personId: "marcus-hale",
    quote:
      "Our users love the smooth interactions. It's made our product feel premium and professional.",
    stars: 4,
  },
  {
    personId: "meera-kapoor",
    quote: "Thoughtful details make every interaction feel easier.",
    stars: 5,
  },
  {
    personId: "niels-holm",
    quote: "Thoughtful details make every interaction feel easier.",
    stars: 5,
  },
  {
    personId: "leila-hassan",
    quote: "Thoughtful details make every interaction feel easier.",
    stars: 5,
  },
  {
    personId: "diego-ramos",
    quote: "SmoothUI is my go-to for fast, beautiful UIs.",
    stars: 5,
  },
];

/** Lookup by id, for a demo that wants one specific person. */
export const personById = (id: string): Person | undefined =>
  people.find((person) => person.id === (legacyPersonIds[id] ?? id));

/**
 * A stable slice, so two demos asking for 4 people get the same 4 people rather
 * than a random draw that changes on every render.
 */
export const somePeople = (count: number, offset = 0): Person[] =>
  Array.from(
    { length: Math.min(count, people.length) },
    (_, index) => people[(offset + index) % people.length]
  );

/** Testimonials joined to their author, which is what a wall of quotes needs. */
export const testimonialsWithPeople = (): (Testimonial & {
  person: Person;
})[] =>
  testimonials
    .map((testimonial) => ({
      ...testimonial,
      person: personById(testimonial.personId),
    }))
    .filter(
      (entry): entry is Testimonial & { person: Person } =>
        entry.person !== undefined
    );
