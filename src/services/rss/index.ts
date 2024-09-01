import { XMLParser } from 'fast-xml-parser';
import z from 'zod';

import { rssSchema } from './schema';

interface RSSEntry {
  title: string;
  published: string;
  url: string;
}

export interface RSSResult {
  title: string;
  url: string
  entries: RSSEntry[];
}

type RawData = z.infer<typeof rssSchema>;

export async function getRSSData(url: string): Promise<RSSResult> {
  const parser = new XMLParser({ ignoreAttributes: false });
  const res = await fetch(url);
  const xml = await res.text();
  const parsed = parser.parse(xml);
  const feed = validate(parsed.feed || parsed.rss);

  return parseRSS(feed);
}

function validate(raw: unknown): RawData {
  return rssSchema.parse(raw);
}

function parseRSS(raw: RawData): RSSResult {
  const entries = raw.channel.item.map((entry): RSSEntry => ({
    title: entry.title,
    url: entry.link,
    published: new Date(entry.pubDate).toISOString(),
  }));

  return {
    title: raw.channel.title,
    url: raw.channel.link,
    entries,
  }
}
