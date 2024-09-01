import dayjs from 'dayjs';

interface Post {
  title: string;
  published: string;
  url: string;
  blogName: string;
}

export function getNewPosts(posts: Post[], timegap: number = 2) {
  return posts
  .filter((p) => {
    const publishedDate = dayjs(p.published);
    const gapAgo = dayjs().subtract(timegap, 'hours');

    return publishedDate.isAfter(gapAgo);
  });
}
