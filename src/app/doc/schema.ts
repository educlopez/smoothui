import * as z from "zod"

// Schema for deeply nested tailwind config
const tailwindSchema = z
  .object({
    config: z.record(z.string(), z.unknown()).optional(),
  })
  .optional()

// Schema for CSS variables
const cssVarsSchema = z.object({
  light: z.record(z.string(), z.string()).optional(),
  dark: z.record(z.string(), z.string()).optional(),
})

// Schema for environment variables
const envVarsSchema = z.record(z.string(), z.string())

// Schema for registry file
const registryFileSchema = z.object({
  path: z.string(),
  content: z.string(),
  type: z.enum([
    "registry:ui",
    "registry:block",
    "registry:hook",
    "registry:lib",
    "registry:theme",
  ]),
  target: z.string().optional(),
})

// Schema for registry item (v3 format)
export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: z.enum([
    "registry:ui",
    "registry:block",
    "registry:hook",
    "registry:lib",
    "registry:theme",
  ]),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryFileSchema),
  tailwind: tailwindSchema.optional(),
  cssVars: cssVarsSchema.optional(),
  envVars: envVarsSchema.optional(),
  description: z.string().optional(),
})

// Legacy schema for backward compatibility
export const registrySchema = z.record(
  z.string(),
  z.object({
    name: z.string(),
    dependencies: z.array(z.string()).optional(), // external dependencies. inferred from the import statements, and fetched from the addition .json file next to the component .tsx file
    devDependencies: z.array(z.string()).optional(), // dev dependencies. fetched from the addition .json file next to the component .tsx file
    registryDependencies: z.array(z.string()).optional(), // other component dependencies
    files: z.array(
      z.object({
        path: z.string(),
        type: z.enum([
          "registry:ui",
          "registry:block",
          "registry:hook",
          "registry:lib",
        ]),
      })
    ),
    type: z.enum([
      "registry:ui",
      "registry:block",
      "registry:hook",
      "registry:lib",
    ]),
    component: z.any().optional(), // lazy loading component for the documentation page. Not part of the output .json file
    tailwind: tailwindSchema,
  })
)

export type Registry = z.infer<typeof registrySchema>
export type RegistryItem = z.infer<typeof registryItemSchema>
