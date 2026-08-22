export default async function handler(req, res) {
  const { app } = await import('../server/dist/app.js');
  return app(req, res);
}
