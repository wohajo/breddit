import {
  getFromLocalStorage,
  isInLocalStorage,
  removeFromLocalStorage,
} from "./storage-utils";

const jwt = require("jsonwebtoken");

export const checkIfTokenExpired = () => {
  if (!isInLocalStorage("token")) return true;

  const token = getFromLocalStorage("token");
  const exp = jwt.decode(token).exp;
  return Date.now() >= exp * 1000 ? true : false;
};

export const logOut = () => {
  removeFromLocalStorage("token");
  removeFromLocalStorage("user");
};
