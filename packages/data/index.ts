// ---------------------------------------------------------------------------
// AI-first metadata types & schema
// ---------------------------------------------------------------------------
export type {
  AnimationType,
  ApiErrorResponse,
  BlockDetailResponse,
  BlockListResponse,
  BlockMeta,
  BlockQueryParams,
  BlockType,
  Complexity,
  ComponentCategory,
  ComponentDetailResponse,
  ComponentListResponse,
  ComponentMeta,
  ComponentQueryParams,
  PaginatedResponse,
} from "./component-meta";

export type {
  ParseFailure,
  ParseResult,
  ParseSuccess,
  SmoothUIPackageMeta,
} from "./smoothui-schema";

export { parseSmoothUIMeta } from "./smoothui-schema";

// ---------------------------------------------------------------------------
// People data
// ---------------------------------------------------------------------------

/**
 * Unified Person interface for all people data
 *
 * This single interface contains all possible fields for people data.
 * Components can use only the fields they need:
 * - Team components: name, role, bio, avatar, location, experience, social, company
 * - Testimonial components: name, role, avatar, stars, content
 * - Mixed components: any combination of fields
 */
export interface Person {
  avatar: string;
  bio?: string;
  company?: string;
  content?: string;
  experience?: string;
  location?: string;
  name: string;
  role: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  // Testimonial specific fields
  stars?: number;
}

export const peopleData: Person[] = [
  {
    avatar:
      "https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631",
    bio: "Passionate about building products that make a difference. Leading the vision for innovative user experiences.",
    company: "SmoothUI",
    content:
      "SmoothUI has revolutionized how we build user interfaces. The animations are buttery smooth and the developer experience is incredible.",
    experience: "8+ years of experience",
    location: "Spain",
    name: "Eduardo Calvo",
    role: "CEO & Founder",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar.jpg",
    bio: "Creating beautiful and intuitive user experiences that users love. Passionate about design systems and accessibility.",
    company: "Design Studio",
    content:
      "The design system is incredibly well thought out. Every component feels intentional and polished.",
    experience: "7+ years of experience",
    location: "San Francisco, CA",
    name: "Drew Cano",
    role: "Head of Design",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-1.jpg",
    bio: "Building scalable solutions for modern applications. Expert in React, TypeScript, and cloud architecture.",
    company: "TechCorp",
    content:
      "Best UI library I've used. The TypeScript support is excellent and the components are highly customizable.",
    experience: "10+ years of experience",
    location: "Austin, TX",
    name: "Marcus Johnson",
    role: "Lead Developer",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-2.jpg",
    bio: "Driving product strategy and user research to create products that truly solve user problems.",
    company: "ProductCo",
    content:
      "Our users love the smooth interactions. It's made our product feel premium and professional.",
    experience: "6+ years of experience",
    location: "New York, NY",
    name: "Emily Rodriguez",
    role: "Product Manager",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 4,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-3.jpg",
    bio: "Full-stack engineer with expertise in distributed systems and team leadership. Building the future of technology.",
    company: "InnovateTech",
    content:
      "The performance is outstanding. Our bundle size stayed the same while getting beautiful animations.",
    experience: "12+ years of experience",
    location: "Seattle, WA",
    name: "Mollie Hall",
    role: "CTO",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-4.jpg",
    bio: "Understanding user behavior and needs to inform design decisions. Passionate about creating inclusive experiences.",
    company: "ResearchLab",
    content:
      "The accessibility features are top-notch. Every component follows WCAG guidelines perfectly.",
    experience: "5+ years of experience",
    location: "Toronto, Canada",
    name: "Alec Whitten",
    role: "UX Researcher",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-5.jpg",
    bio: "Specializing in React, animations, and performance optimization. Creating smooth user experiences.",
    company: "WebStudio",
    experience: "4+ years of experience",
    location: "London, UK",
    name: "Alisa Hester",
    role: "Frontend Engineer",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-6.jpg",
    bio: "Building robust APIs and microservices. Expert in Node.js, Python, and cloud infrastructure.",
    company: "BackendPro",
    experience: "6+ years of experience",
    location: "Barcelona, Spain",
    name: "Johnny Bell",
    role: "Backend Engineer",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-7.jpg",
    bio: "Automating deployments and ensuring system reliability. Passionate about infrastructure as code.",
    company: "CloudOps",
    experience: "8+ years of experience",
    location: "Berlin, Germany",
    name: "Mia Ward",
    role: "DevOps Engineer",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
  },
  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-8.jpg",
    bio: "Driving growth through strategic marketing and community building. Expert in developer relations.",
    company: "GrowthCo",
    experience: "7+ years of experience",
    location: "Singapore",
    name: "Josh Knight",
    role: "Marketing Director",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
  },

  {
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-9.jpg",
    bio: "Building beautiful and accessible UI components for React developers.",
    company: "sand/ui",
    content: "SmoothUI is my go-to for fast, beautiful UIs.",
    experience: "5+ years of experience",
    location: "Remote",
    name: "Kelly Myer",
    role: "Creator of Sand/UI",
    social: {
      github: "https://github.com/educlopez",
      linkedin: "https://linkedin.com/in/educlopez",
      twitter: "https://twitter.com/educalvolpz",
      website: "https://educalvolopez.com",
    },
    stars: 5,
  },
];

// Get people who have testimonials (stars and content)
export const testimonialsData: Person[] = peopleData.filter(
  (person) => person.stars && person.content
);

interface ImageKitOptions {
  format?: "auto" | "webp" | "jpg" | "jpeg" | "png" | "avif";
  height?: number;
  quality?: number;
  transformations?: string;
  width?: number;
}

/**
 * Build transformation string from options
 */
function buildTransformations(options?: ImageKitOptions): string {
  if (options?.transformations) {
    return options.transformations;
  }

  const parts: string[] = [];

  if (options?.width) {
    parts.push(`w-${options.width}`);
  }
  if (options?.height) {
    parts.push(`h-${options.height}`);
  }

  const quality = options?.quality ?? 80;
  parts.push(`q-${quality}`);

  const format = options?.format ?? "auto";
  parts.push(`f-${format}`);

  return parts.join(",");
}

/**
 * Process full URL and add transformations
 */
function processFullUrl(imagePath: string, transformations: string): string {
  const url = new URL(imagePath);
  url.searchParams.delete("updatedAt");
  const baseUrl = url.origin + url.pathname;

  if (!transformations) {
    return baseUrl;
  }
  return `${baseUrl}?tr=${transformations}`;
}

/**
 * Build local path URL
 */
function buildLocalPathUrl(imagePath: string, transformations: string): string {
  const endpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    process.env.IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/16u211libb";

  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;

  const imageKitPath = cleanPath.startsWith("images/")
    ? `smoothui/${cleanPath.replace("images/", "")}`
    : `smoothui/${cleanPath}`;

  const baseUrl = `${endpoint}/${imageKitPath}`;

  if (transformations) {
    return `${baseUrl}?tr=${transformations}`;
  }

  return baseUrl;
}

/**
 * Get ImageKit URL for an image with optimized transformations
 * Converts local image paths (/images/...) to ImageKit URLs with bandwidth optimization
 * @param imagePath - Local image path (e.g., "/images/avatar.jpg") or already full URL
 * @param options - Optional transformation options
 * @param options.width - Image width in pixels
 * @param options.height - Image height in pixels
 * @param options.quality - Image quality (1-100, default: 80)
 * @param options.format - Image format (auto, webp, jpg, png, etc.)
 * @param options.transformations - Raw transformation string (overrides other options)
 * @returns Full ImageKit URL with optimized transformations
 */
export function getImageKitUrl(
  imagePath: string,
  options?: ImageKitOptions
): string {
  const transformations = buildTransformations(options);

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return processFullUrl(imagePath, transformations);
  }

  return buildLocalPathUrl(imagePath, transformations);
}

/**
 * Helper function to get avatar URL with optimized size and quality
 * @param avatar - Avatar image path or URL
 * @param size - Avatar size in pixels (default: 40, will be doubled for retina)
 * @returns Optimized ImageKit URL for avatar
 */
export function getAvatarUrl(avatar: string, size = 40): string {
  // Double the size for retina displays, use higher quality for avatars
  const retinaSize = size * 2;
  return getImageKitUrl(avatar, {
    format: "auto",
    height: retinaSize,
    quality: 85, // Higher quality for faces
    width: retinaSize,
  });
}

// Helper function to get team member data (people without testimonials or all people)
export function getTeamMembers(
  count = 4,
  includeTestimonials = false
): Person[] {
  if (includeTestimonials) {
    return peopleData.slice(0, count);
  }
  // Return people who don't have testimonials for team display
  return peopleData
    .filter((person) => !(person.stars && person.content))
    .slice(0, count);
}

// Helper function to get testimonials data
export function getTestimonials(count = 4): Person[] {
  return testimonialsData.slice(0, count);
}

// Helper function to get all people data
export function getAllPeople(): Person[] {
  return peopleData;
}

// Helper function to get people by role
export function getPeopleByRole(role: string): Person[] {
  return peopleData.filter((person) =>
    person.role.toLowerCase().includes(role.toLowerCase())
  );
}

// Helper function to get people with testimonials
export function getPeopleWithTestimonials(): Person[] {
  return testimonialsData;
}
