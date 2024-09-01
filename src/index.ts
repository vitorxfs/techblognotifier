import { Context, Hono } from 'hono';
import { z } from 'zod';

import { environment, initializeEnvironment } from './env';
import { feeds } from './feeds';
import { processBlogPosts } from './use-cases/process-blog-posts';
import { bskyPost } from './services/bsky';

const app = new Hono<{ Bindings: Env }>();

app.post('/bsky', async (c) => {
  try {
    initializeEnvironment(c.env);

    if (!isAuthorized(c)) {
      return c.status(401);
    }

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
      return;
    } catch (err) {
      console.log(JSON.stringify(err, null, 4));
    }
  },
  fetch(request: Request, env: Env) {
    return app.fetch(request, env);
  },
};

function isAuthorized(c: Context): boolean {
  const authToken = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!authToken) { return false; }
  if (authToken !== environment.API_PASSWORD) { return false; }
  return true;
}
