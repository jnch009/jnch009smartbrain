const handleRoot = (req, res, apiError) => {
  if (req.user !== undefined) {
    res.json(req.user);
  } else {
    res.clearCookie('jwt').status(401).json('Unauthorized, please log in');
  }
};

module.exports = { handleRoot };
