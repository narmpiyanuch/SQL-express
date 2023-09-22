const express = require('express');
const db = require('../database/db');
const createError = require('../utils/create-error');

const router = express.Router();

// ## Login
// Method : post, Path:/login
// Data : username, password (Request body)
router.post('/login', async (req, res, next) => {
    try {
        // Read Body
        const { username, password } = req.body
        // Find user with username, password
        const result = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]); // [{}, {}]
        // const result = await prisma.user.findMany({where:{username.username}})

        if (result[0].length === 0) {
            // return res.status(400).json({ msg: 'invalid username or password' })
            return next(createError(400, 'invalid username or password'));
        }
        res.status(200).json({ msg: 'success login' });
    } catch (err) {
        next(createError(500, 'Internal server error'))
    }
});

// BODY, QUERY, PARAMETERS
// ## Register
// Method: POST, Path: /Register, Body: Data => username, password
router.post('/register', async (req, res, next) => {
    try {
        // 1. Read Body
        const { username, password } = req.body;

        // 2. Validate Data เช่น Password must contain at least one Uppercase
        // Find exist username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username]) // [{ },{}]
        if (result[0].length > 0) {
            // return res.status(400).json({ msg: 'username already using' });
            return next(createError(400, 'username already using'));
        }
        // If validate Fail
        // res.status(400).json({ msg: 'Password not right' })
        // End validate

        // 3. Save Data to Database => use mysql2 to connect to mysql server 
        // and persist data to user table

        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        res.status(201).json({ msg: 'Success for register.' });
    } catch (err) {
        next(createError(500, 'Internal server error'))
    }
});

// ## Change Password
// Method : PUT, Path : /change-password
// Data : username, newPassword
router.put('/change-password', async (req, res, next) => {
    try {
        const { username, newPassword } = req.body
        // Validate username
        const result = await db.query('SELECT * FROM users WHERE username = ?', [username])
        if (result[0].length === 0) {
            // return res.status(400).json({ msg: 'Not found this username' });
            return next(createError(400, 'Not found this username'));
        }
        await db.query('UPDATE users SET password = ? WHERE username = ? ', [newPassword, username]);
        res.status(200).json({ msg: 'success for change password' });
    } catch (err) {
        next(createError(500, 'Internal server error'))
    }
});

module.exports = router;