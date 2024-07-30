import { z } from 'zod';

const envSchema = {
  LOGTO_APPID: z.string().min(1),
  LOGTO_ENDPOINT: z.string().min(1),
  API_URL: z.string().min(1),
  BOOKS_ITEMS_PER_PAGE: z
    .string()
    .default('12')
    .refine(
      (data) => !Number.isNaN(Number(data)),
      'BOOKS_ITEMS_PER_PAGE must be a numeric value',
    )
    .transform(Number)
    .refine((num) => num > 0, 'BOOKS_ITEMS_PER_PAGE must be a positive number'),
  GOOGLE_BOOKS_ITEMS_PER_PAGE: z
    .string()
    .default('12')
    .refine(
      (data) => !Number.isNaN(Number(data)),
      'ITEMS_PER_PAGE must be a numeric value',
    )
    .transform(Number)
    .refine((num) => num > 0, 'ITEMS_PER_PAGE must be a positive number'),
  GOOGLE_BOOKS_API: z.string().min(1),
};

const createEnv = () => {
  const envVars = Object.entries(import.meta.env).reduce<
    Record<string, string>
  >((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_')) {
      acc[key.replace('VITE_', '')] = value;
    }
    return acc;
  }, {});

  const parsedEnv = z.object(envSchema).safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}
`,
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
