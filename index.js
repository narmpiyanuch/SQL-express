const express = require('express');
const mysql2 = require('mysql2/promise');
const app = express();

app.use(express.json())
const db = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: '221037',
    database: 'mysql_todo_list',
    connectionLimit: 20
});

// ## Login
// Method : post, Path:/login
// Data : username, password (Request body)
app.post('/login', async (req, res, next) => {
    try {
        // Read Body
        const { username, password } = req.body
        // Find user with username, password
        const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]); // [{}, {}]
        if (result[0].length === 0) {
            return res.status(400).json({ msg: 'invalid username or password' })
        }
        res.status(200).json({ msg: 'success login' });
    } catch (err) {
        res.status(500).json({ msg: 'internal server error' })
    }
});

// ## Register
// Method: POST, Path: /Register, Body: Data => username, password
app.post('/register', async (req, res, next) => {
    try {
        // 1. Read Body
        const { username, password } = req.body;

        // 2. Validate Data เช่น Password must contain at least one Uppercase
        // Find exist username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username]) // [{ },{}]
        if (result[0].length > 0) {
            return res.status(400).json({ msg: 'username already using' });
        }
        // If validate Fail
        // res.status(400).json({ msg: 'Password not right' })
        // End validate

        // 3. Save Data to Database => use mysql2 to connect to mysql server 
        // and persist data to user table

        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ msg: 'Success for register.' });
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// ## Change Password
// Method : PUT, Path : /change-password
// Data : username, newPassword
app.put('/change-password', async (req, res, next) => {
    try {
        const { username, newPassword } = req.body
        // Validate username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username])
        if (result[0].length === 0) {
            return res.status(400).json({ msg: 'Not found this username' });
        }
        await db.query('UPDATE users SET password = ? WHERE username = ? ', [newPassword, username]);
        res.status(200).json({ msg: 'success for change password' });
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
})

// ## Create Todo
// Method : POST, Path : /createTodo
// Data : title, userId, completed
app.post('/createTodo', async (req, res, next) => {
    try {
        const { title, userID, completed } = req.body;
        const result = await db.query('SELECT * FROM users WHERE id = ?', [userID])
        if (result[0].length === 0) {
            return res.status(400).json({ msg: 'UserID not found' });
        }
        await db.query('INSERT INTO todos (title, completed, user_id)  VALUES (?,?,?)', [title, completed, userID])
        res.status(201).json({ msg: 'Create-Todo DONE !' })
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

//get todo
// Method : get, Path : / get-todo?
// Data : serachTitle, userId(query)
app.get('/get-todo', async (req, res, next) => {
    try {
        const { searchTitle, userId } = req.query
        if (searchTitle !== undefined && userId !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE title = ? AND user_id = ?', [searchTitle, userId]);
            return res.status(200).json({ resultTodo: result[0] });
        }
        if (searchTitle !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE title = ?', [searchTitle])
            return res.status(200).json({ resultTodo: result[0] });
        }
        if (userId !== undefined) {
            const result = await db.query('SELECT * FROM todos WHERE user_id = ?', [userId])
            return res.status(200).json({ resultTodo: result[0] });
        }
        const result = await db.query('SELECT * FROM todos')
        return res.status(200).json({ resultTodo: result[0] });
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
});

// Delete Todo
// Method : Delete, Path : / delete-todo/:idToDelete
// Data : idToDelete
app.delete('/delete-todo/:idToDelete', async (req, res, next) => {
    try {
        // READ PATH PARAMS
        const { idToDelete } = req.params // {idToDelete: value}
        // Find Todo
        const result = await db.query('SELECT * FROM todos WHERE id = ?', [idToDelete])
        if (result[0].length === 0) {
            return res.status(400).json({ msg: 'todo with id not found' })
        }
        await db.query('DELETE FROM todos WHERE id = ?', [idToDelete])
        res.status(200).json({ msg: 'Delete successfully' })
    } catch (err) {
        res.status(500).json({ msg: 'Internal server error' });
    }
})

app.listen(8888, () => console.log('Server on port 8888'));