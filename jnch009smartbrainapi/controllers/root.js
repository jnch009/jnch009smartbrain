const handleRoot = (res, db, apiError) => {
  db.select('*')
    .from('users')
    .then(users => res.send(users))
    .catch(() => res.status(500).json(apiError));
};

module.exports = { handleRoot };
