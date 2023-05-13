export default function (req, res, next) {
  try {
    const notice = JSON.parse(req.cookies.notice);
    if (notice.expires > new Date().getTime()) {
      console.log(`INFO: Found notice: ${JSON.stringify(notice)}`);
      req.notice = notice;
    } else {
      console.log(`INFO: Clearing notice`);
      res.clearCookie("notice");
    }
  } catch (err) {
    res.clearCookie("notice");
  }
  next();
}
