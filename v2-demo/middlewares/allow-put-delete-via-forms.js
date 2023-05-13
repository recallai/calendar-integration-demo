export default (req, res, next) => {
  if (req.method === "POST" && ["DELETE", "PUT"].includes(req.body._method)) {
    req.method = req.body._method;
    delete req.body._method;
  }
  
  next();
};
