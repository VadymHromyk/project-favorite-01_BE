export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `${req.method} ${req.url} route not found` });
};
