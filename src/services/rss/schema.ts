import { array, object, string, union } from 'zod';

export const rssSchema = object({
  channel: object({
    title: string(),
    link: string(),
    description: string(),
    language: string().optional(),
    copyright: string().optional(),
    managingEditor: string().optional(),
    webMaster: string().optional(),
    pubDate: string().optional(),
    lastBuildDate: string().optional(),
    category: string().optional(),
    generator: string().optional(),
    docs: string().optional(),
    item: array(object({
      title: string(),
      link: string(),
      pubDate: string(),
      description: string().optional(),
      author: string().optional(),
      category: union([string(), array(string())]).optional(),
      comments: union([string(), array(string())]).optional(),
      source: string().optional(),
    }))
  }),
});
