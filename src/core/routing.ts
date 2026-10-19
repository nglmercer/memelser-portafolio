export const views = ['home', 'projects', 'blog', 'about'] as const;
export type View = (typeof views)[number];

export const posts = {
  api: 'blogApiTitle',
  live: 'blogLiveTitle',
  desktop: 'blogDesktopTitle',
} as const;
export type PostSlug = keyof typeof posts;

export interface Route {
  view: View;
  post: PostSlug | null;
}

function hasPost(value: string | null): value is PostSlug {
  return value !== null && Object.hasOwn(posts, value);
}

export function routeFromUrl(value: string): Route {
  const url = new URL(value);
  let view = url.searchParams.get('view');
  if (view === 'portfolio') view = 'home';
  if (!(views as readonly string[]).includes(view ?? '')) {
    const postParam = url.searchParams.get('post');
    if (url.hash === '#blog' || url.hash.startsWith('#blog-') || (postParam !== null && hasPost(postParam))) {
      view = 'blog';
    } else if (url.hash === '#proyectos') {
      view = 'projects';
    } else if (['#sobre', '#contacto'].includes(url.hash)) {
      view = 'about';
    } else {
      view = 'home';
    }
  }
  const candidate = url.searchParams.get('post');
  return {
    view: view as View,
    post: view === 'blog' && hasPost(candidate) ? candidate : null,
  };
}

export function viewFromUrl(value: string): View {
  return routeFromUrl(value).view;
}
