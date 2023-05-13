export default async (req, res) => {
  return res.render("signup.ejs", {
    notice: req.notice,
  });
}