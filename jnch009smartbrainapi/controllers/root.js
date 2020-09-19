const handleRoot = (req, res) => {
  if (req.id !== undefined) {
    res.json(req.id);
  } else {
    res.clearCookie('jwt').status(401).json('Unauthorized, please log in');
  }
};

module.exports = { handleRoot };
