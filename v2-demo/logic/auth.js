import jwt from "jsonwebtoken";
import db from "../db.js";

export function getAuthTokenForUser(user) {
  return jwt.sign({ id: user.id }, process.env.SECRET);
}

export async function getUserFromAuthToken(token) {
  const decoded = jwt.verify(token, process.env.SECRET);
  return db.User.findByPk(decoded.id);
}
