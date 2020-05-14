const handleImageUpdate = (req, res, db, apiError) => {
  const { id } = req.body;
  db('users')
    .where({ id })
    .increment({
      score: 1,
    })
    .returning('*')
    .then(score => {
      score.length > 0
        ? res.json(score[0])
        : res.status(404).json('Cannot increment score on invalid user');
    })
    .catch(() => res.status(500).json(apiError));
};

module.exports = { handleImageUpdate };
