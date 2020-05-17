const handleSignOut = (req, res) => {
  if (req.cookies.jwt !== undefined) {
    res.clearCookie('jwt');
    res.json('Successfully signed out');
  } else {
    res.status(404).json('User not logged in');
  }
};

module.exports = {
  handleSignOut,
};
