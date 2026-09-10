// Vercel serverless entry point.
//
// Vercel runs this file as a function — it must EXPORT a request handler, never
// call app.listen(). The Express app in src/app.js is already a valid
// (req, res) handler, so we just re-export it. `src/server.js` (which does call
// listen) is only used for local `npm start` / `npm run dev`.
module.exports = require('../src/app')
