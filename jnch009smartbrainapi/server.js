const express = require('express');
const app = express();

const db = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'test123',
      score: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Jeremy',
      email: 'jeremy@gmail.com',
      password: 'jeremypassword',
      score: 0,
      joined: new Date(),
    },
  ],
};

//Helpers
const filterUserById = userId => db.users.filter(user => user.id === userId);
const filterUserByCredentials = (email, password) =>
  db.users.filter(user => user.email === email && user.password === password);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/signin', (req, res) => {
  let { email, password } = req.body;
  let signin = filterUserByCredentials(email, password);
  signin.length === 1
    ? res.json('success')
    : res.status(401).json('Unauthorized');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db.users.push({
    // be very careful about maintaining type coercion
    id: String(Number(db.users[db.users.length - 1].id) + 1),
    name: name,
    email: email,
    password: password,
    score: 0,
    joined: new Date(),
  });

  res.json(db.users[db.users.length - 1]);
});

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  let user = filterUserById(userId);
  user.length === 1 ? res.json(user) : res.status(404).json('not found');
});

app.put('/image', (req, res) => {
  const { userId } = req.body;
  let user = filterUserById(userId);

  if (user.length === 1) {
    user[0].score += 1;
    res.json(user);
  } else {
    res.status(404).json('cannot find user to update');
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
