export default (req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    // don't cache responses in development
    res.set("Cache-control", "no-store");
  }
};
