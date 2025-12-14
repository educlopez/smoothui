/**
 * Unified Person interface for all people data
 *
 * This single interface contains all possible fields for people data.
 * Components can use only the fields they need:
 * - Team components: name, role, bio, avatar, location, experience, social, company
 * - Testimonial components: name, role, avatar, stars, content
 * - Mixed components: any combination of fields
 */
export type Person = {
  name: string;
  role: string;
  bio?: string;
  avatar: string;
  location?: string;
  experience?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  company?: string;
  // Testimonial specific fields
  stars?: number;
  content?: string;
};

export const peopleData: Person[] = [
  {
    name: "Eduardo Calvo",
    role: "CEO & Founder",
    bio: "Passionate about building products that make a difference. Leading the vision for innovative user experiences.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/educalvolpz.jpg",
    location: "Spain",
    experience: "8+ years of experience",
    company: "SmoothUI",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content:
      "SmoothUI has revolutionized how we build user interfaces. The animations are buttery smooth and the developer experience is incredible.",
  },
  {
    name: "Drew Cano",
    role: "Head of Design",
    bio: "Creating beautiful and intuitive user experiences that users love. Passionate about design systems and accessibility.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar.jpg",
    location: "San Francisco, CA",
    experience: "7+ years of experience",
    company: "Design Studio",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content:
      "The design system is incredibly well thought out. Every component feels intentional and polished.",
  },
  {
    name: "Marcus Johnson",
    role: "Lead Developer",
    bio: "Building scalable solutions for modern applications. Expert in React, TypeScript, and cloud architecture.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-1.jpg",
    location: "Austin, TX",
    experience: "10+ years of experience",
    company: "TechCorp",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content:
      "Best UI library I've used. The TypeScript support is excellent and the components are highly customizable.",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Manager",
    bio: "Driving product strategy and user research to create products that truly solve user problems.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-2.jpg",
    location: "New York, NY",
    experience: "6+ years of experience",
    company: "ProductCo",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 4,
    content:
      "Our users love the smooth interactions. It's made our product feel premium and professional.",
  },
  {
    name: "Mollie Hall",
    role: "CTO",
    bio: "Full-stack engineer with expertise in distributed systems and team leadership. Building the future of technology.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-3.jpg",
    location: "Seattle, WA",
    experience: "12+ years of experience",
    company: "InnovateTech",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content:
      "The performance is outstanding. Our bundle size stayed the same while getting beautiful animations.",
  },
  {
    name: "Alec Whitten",
    role: "UX Researcher",
    bio: "Understanding user behavior and needs to inform design decisions. Passionate about creating inclusive experiences.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-4.jpg",
    location: "Toronto, Canada",
    experience: "5+ years of experience",
    company: "ResearchLab",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content:
      "The accessibility features are top-notch. Every component follows WCAG guidelines perfectly.",
  },
  {
    name: "Alisa Hester",
    role: "Frontend Engineer",
    bio: "Specializing in React, animations, and performance optimization. Creating smooth user experiences.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-5.jpg",
    location: "London, UK",
    experience: "4+ years of experience",
    company: "WebStudio",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
  },
  {
    name: "Johnny Bell",
    role: "Backend Engineer",
    bio: "Building robust APIs and microservices. Expert in Node.js, Python, and cloud infrastructure.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-6.jpg",
    location: "Barcelona, Spain",
    experience: "6+ years of experience",
    company: "BackendPro",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
  },
  {
    name: "Mia Ward",
    role: "DevOps Engineer",
    bio: "Automating deployments and ensuring system reliability. Passionate about infrastructure as code.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-7.jpg",
    location: "Berlin, Germany",
    experience: "8+ years of experience",
    company: "CloudOps",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
  },
  {
    name: "Josh Knight",
    role: "Marketing Director",
    bio: "Driving growth through strategic marketing and community building. Expert in developer relations.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-8.jpg",
    location: "Singapore",
    experience: "7+ years of experience",
    company: "GrowthCo",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
  },

  {
    name: "Kelly Myer",
    role: "Creator of Sand/UI",
    bio: "Building beautiful and accessible UI components for React developers.",
    avatar: "https://ik.imagekit.io/16u211libb/smoothui/avatar-9.jpg",
    location: "Remote",
    experience: "5+ years of experience",
    company: "sand/ui",
    social: {
      twitter: "https://twitter.com/educalvolpz",
      linkedin: "https://linkedin.com/in/educlopez",
      github: "https://github.com/educlopez",
      website: "https://educalvolopez.com",
    },
    stars: 5,
    content: "SmoothUI is my go-to for fast, beautiful UIs.",
  },
];

// Get people who have testimonials (stars and content)
export const testimonialsData: Person[] = peopleData.filter(
  (person) => person.stars && person.content
);

type ImageKitOptions = {
  width?: number;
  height?: number;
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "jpeg" | "png" | "avif";
  transformations?: string;
};

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
    width: retinaSize,
    height: retinaSize,
    quality: 85, // Higher quality for faces
    format: "auto",
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
