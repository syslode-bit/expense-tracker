// Express doesn't catch errors thrown inside an async route handler —
// a rejected promise there becomes an unhandled rejection and crashes the
// whole server. Wrapping a handler in this passes any error to Express's
// error-handling middleware instead (see the app.use((err, ...)) in
// server.js).
function asyncHandler(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}

module.exports = asyncHandler;
