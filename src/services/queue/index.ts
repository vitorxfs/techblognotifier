import { Client, PublishToUrlResponse } from "@upstash/qstash"
import { environment } from '../../env';

export async function enqueueHttp(opts: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}): Promise<PublishToUrlResponse> {
  const client = new Client({ token: environment.QSTASH_TOKEN });

  return client.publishJSON({
    url: opts.url,
    method: opts.method,
    body: opts.body,
    headers: opts.headers,
  });
}

export async function enqueue(opts: {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}): Promise<PublishToUrlResponse> {
  const client = new Client({ token: environment.QSTASH_TOKEN });

  return client.publishJSON({
    url: opts.url,
    method: opts.method,
    body: opts.body,
    headers: opts.headers,
  });
}
