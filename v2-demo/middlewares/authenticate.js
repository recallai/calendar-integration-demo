import { getUserFromAuthToken } from "../logic/auth.js";

export default async function (req, res, next) {
  req.challenge = req.cookies.authToken;
  let user = null;
  try {
    user = await getUserFromAuthToken(req.challenge);
  } catch (err) {}

  req.authenticated = Boolean(user);

  if (req.authenticated) {
    req.authentication = { user };
  } else {
    req.authentication = { error: "INVALID_CREDENTIALS" };
  }

  next();
}
