import { AtpAgent, RichText } from '@atproto/api';
import { environment } from '../../env';

let agent: AtpAgent;
async function login(): Promise<AtpAgent> {
  if (agent) { return agent }

  const a = new AtpAgent({
    service: 'https://bsky.social',
  });

  await a.login({
    identifier: environment.BLUESKY_BOT_USERNAME,
    password: environment.BLUESKY_BOT_PASSWORD
  });

  agent = a;
  return agent;
}

export async function bskyPost(text: string): Promise<{
  uri: string;
  cid: string;
}> {
  const a = await login();

  const rt = new RichText({ text });
  await rt.detectFacets(a);

  return a.post({
    $type: 'app.bsky.feed.post',
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString()
  });
}
