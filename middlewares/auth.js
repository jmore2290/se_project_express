const jwt = require("jsonwebtoken");
const { JWT_SECRET }= require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new UnauthorizedError("Authorization Required");
     next(error);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new UnauthorizedError("Authorization Required");
     next(error);
  }

  req.user = payload;

  return next();
};
