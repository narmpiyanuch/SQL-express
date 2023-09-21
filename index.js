const express = require('express');
const app = express();
const erroroMiddleware = require('./middleware/error')
const userRoute = require('./routes/user-routes')
const todoRoute = require('./routes/todo-routes');

app.use(express.json())

// handle feature users
app.use('/user', userRoute);

// handle feature todo
app.use('/todo', todoRoute);

app.use(erroroMiddleware)

app.listen(8888, () => console.log('Server on port 8888'));


// register, login, change-password
// /register => /user/register
// /login => /user/login
//  /chage-password => /user/change-password
// create, get, delete todo
// /create-todo => /todo POST
// /delete-todo => /todo/:idToDelete
// /get-todo => /todo GET