const handleSignOut = (req, res) => {
  res.clearCookie('jwt').json('Successfully signed out');
};

module.exports = {
  handleSignOut,
};
