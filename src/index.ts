/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Hono } from 'hono';

import { initializeEnvironment } from './env';
import { feeds } from './feeds';
import { processBlogPosts } from './use-cases/process-blog-posts';
import { bskyPost } from './services/bsky';
import { z } from 'zod';

const app = new Hono<{ Bindings: Env }>();

app.post('/bsky', async (c) => {
  try {
    initializeEnvironment(c.env);

    const body = await c.req.json();
    const parsedBody = z.object({ text: z.string() }).parse(body);

    await bskyPost(parsedBody.text);
    return c.json({ message: 'enqueued' })
  } catch (err) {
    console.log(JSON.stringify(err, null, 4));
  }
})

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    try {
      initializeEnvironment(env);
      await Promise.allSettled(feeds.map((f) => processBlogPosts(f)));
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  },
  fetch(request: Request, env: Env) {
    return app.fetch(request, env);
  },
};
