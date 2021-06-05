const jwt = require("jsonwebtoken");

const getUserIdFromToken = (token) => {
  return jwt.decode(token).id;
};

const extractTokenFromHeader = (header) => {
  return header.replace("Bearer ", "");
};

exports.extractTokenFromHeader = extractTokenFromHeader;
exports.getUserIdFromToken = getUserIdFromToken;
