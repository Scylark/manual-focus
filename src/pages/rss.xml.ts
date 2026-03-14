import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return rss({
    title: 'Manual Focus | Blog',
    description: 'Perspectives on marketing, AI, and digital transformation from Manual Focus.',
    site: context.site!.toString(),
    items: sortedPosts.map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.id}/`,
    })),
  });
}
