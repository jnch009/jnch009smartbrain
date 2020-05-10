const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('this is working');
})

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