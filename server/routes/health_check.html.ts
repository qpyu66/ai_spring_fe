export default defineEventHandler((event) => {
  event.node.res.setHeader('Content-Type', 'application/json');
  event.node.res.end(JSON.stringify({ code: 200, message: 'success' }));
});
