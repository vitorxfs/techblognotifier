import { Context, Hono } from 'hono';
import { z } from 'zod';

import { environment, initializeEnvironment } from './env';
import { feeds } from './feeds';
import { processBlogPosts } from './use-cases/process-blog-posts';
import { bskyPost } from './services/bsky';
import { enqueueHttp } from './services/queue';

const app = new Hono<{ Bindings: Env }>();

app.post('/blog', async (c) => {
  initializeEnvironment(c.env);

  if (!isAuthorized(c)) {
    return c.status(401);
  }

  const body = await c.req.json();
  const parsedBody = z.object({ url: z.string() }).parse(body);

  await processBlogPosts(parsedBody.url);
  return c.json({ message: 'enqueued' });
})

app.post('/bsky', async (c) => {
  initializeEnvironment(c.env);

  if (!isAuthorized(c)) {
    return c.status(401);
  }

  const body = await c.req.json();
  const parsedBody = z.object({ text: z.string() }).parse(body);

  await bskyPost(parsedBody.text);
  return c.json({ message: 'enqueued' });
})

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext,
  ) {
    initializeEnvironment(env);

    return Promise.all(feeds.map((url) => enqueueHttp({
      url: environment.WORKER_URL+'/blog',
      method: 'POST',
      body: { url },
      headers: {
        'Authorization': `Bearer ${environment.API_PASSWORD}`,
      }
    })));
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
