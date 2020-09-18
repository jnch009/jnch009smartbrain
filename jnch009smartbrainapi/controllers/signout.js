const handleSignOut = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : false,
      secure: process.env.NODE_ENV === 'production' ? true : false,
    })
    .json('Successfully signed out');
};

module.exports = {
  handleSignOut,
};
