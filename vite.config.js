// Vite is the dev server and bundler. It picks up index.html in this folder.
// `base: './'` makes the built site work no matter what URL Vercel gives us.
// `server.host: true` exposes the dev server on the LAN so an iPad can hit it.
export default {
  base: './',
  server: { host: true },
}
