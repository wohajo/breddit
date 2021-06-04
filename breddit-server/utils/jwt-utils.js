const jwt = require("jsonwebtoken");

const getUserIdFromToken = (token) => {
  return jwt.decode(token).id;
};

exports.getUserIdFromToken = getUserIdFromToken;
