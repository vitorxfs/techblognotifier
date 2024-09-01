interface Post {
  title: string;
  blogName: string;
  url: string;
}

export function buildMessage(post: Post): string {
  return `New Post from ${post.blogName}!\n`+`"${post.title}"\n\n`+post.url;
}
