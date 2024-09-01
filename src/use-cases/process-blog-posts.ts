import { environment } from '../env';
import { getNewPosts } from '../services/blog';
import { buildMessage } from '../services/blog/template';
import { enqueueHttp } from '../services/queue';
import { getRSSData } from '../services/rss';

export async function processBlogPosts(url: string): Promise<global.Response> {
  const result = await getRSSData(url);
  const posts = result.entries.map((e) => ({
    ...e,
    blogName: result.title,
  }))

  const newPosts = getNewPosts(posts, +environment.TIMEGAP_IN_HOURS);
  if (!newPosts.length) { return; }

  return Promise.all(newPosts.map((p) => {
    const tw = buildMessage(p);

    return enqueueHttp({
      url: environment.WORKER_URL+'/bsky',
      method: 'POST',
      body: { text: tw },
      headers: {
        'Authorization': `Bearer ${environment.API_PASSWORD}`,
      }
    });
  }))
}
