import z from 'zod';

const envSchema = z.object({
  'WORKER_URL': z.string(),
  'API_PASSWORD': z.string(),
  'QSTASH_TOKEN': z.string(),
  'BLUESKY_BOT_USERNAME': z.string(),
  'BLUESKY_BOT_PASSWORD': z.string(),
  'TIMEGAP_IN_HOURS': z.string(),
});

export let environment: z.infer<typeof envSchema>;
export function initializeEnvironment(env: unknown) {
  environment = envSchema.parse(env);
}

export type Environment = z.infer<typeof envSchema>;
