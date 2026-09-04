// Wraps an async route handler so any rejected promise is forwarded to the
// central error middleware instead of crashing the process.
module.exports = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
