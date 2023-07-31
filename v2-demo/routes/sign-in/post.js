import { getAuthTokenForUser } from "../../logic/auth.js";
import { generateNotice } from "../utils.js";
import db from "../../db.js";

export default async (req, res) => {
  const user = await db.User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  });

  if (user) {
    res.cookie("authToken", getAuthTokenForUser(user));
    res.redirect("/");
  } else {
    res.clearCookie("notice");
    return res.render("signin.ejs", {
      notice: generateNotice("error", "Invalid email or password"),
    });
  }
};
