export default async (req, res) => {
  if (req.authenticated) {
    return res.redirect("/");
  } else {
    return res.render("signin.ejs", {
      notice: req.notice,
    });
  }
}