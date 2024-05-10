const uuid = require("uuid");

const userIdMiddleware = (req, res, next) => {
  let userId = req.cookies.userId;

  if (!userId) {
    userId = uuid.v4();
    res.cookie("userId", userId, { maxAge: 365 * 24 * 60 * 60 * 1000 }); // Set cookie expiration to one year
  }

  req.userId = userId;
  next();
};

module.exports = userIdMiddleware;
