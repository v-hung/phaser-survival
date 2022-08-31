// import type { Load } from '@sveltejs/kit';
// import { error } from '@sveltejs/kit';
 
// /** @type {import('./$types').PageLoad} */
// export const load: Load = async ({ params }) => {
//   if (params.slug === 'hello-world') {
//     return {
//       title: 'Hello world!',
//       content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
//     };
//   }
 
//   throw error(404, 'Not found');
// }

import { dev } from '$app/environment';

// we don't need any JS on this page, though we'll load
// it in dev so that we get hot module replacement...
export const csr = dev;

// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in prod
export const prerender = true;
export const ssr = false