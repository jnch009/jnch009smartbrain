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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/signin', (req, res) => {
  //res.send('Sign In Post');
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(401).json('Unauthorized');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  db.users.push({
    id: Number(db.users[db.users.length -1].id) + 1,
    name: name,
    email: email,
    password: password,
    score: 0,
    joined: new Date(),
  });

  res.json(db.users[db.users.length - 1]);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

/*
    Plan
    / --> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user
    /profile/:userId --> GET = user
    /image --> PUT --> updated user score
*/
