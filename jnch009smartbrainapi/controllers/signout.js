const handleSignOut = (req, res) => {
  res
    .clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production' ? true : false,
    })
    .json('Successfully signed out');
};

module.exports = {
  handleSignOut,
};
