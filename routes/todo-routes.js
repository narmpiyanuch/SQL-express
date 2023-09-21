const express = require('express');
const db = require('../database/db');
const router = express.Router();

// ## Create Todo
// Method : POST, Path : /createTodo
// Data : title, userId, completed
router.post('/', async (req, res, next) => {
    try {
        const { title, userID, completed } = req.body;
        const result = await db.query('SELECT * FROM users WHERE id = ?', [userID])
        if (result[0].length === 0) {
            // return res.status(400).json({ msg: 'UserID not found' });
            return next(createError(400, 'UserID not found'));
        }
        await db.query('INSERT INTO todos (title, completed, user_id)  VALUES (?,?,?)', [title, completed, userID])
        res.status(201).json({ msg: 'Create-Todo DONE !' })
    } catch (err) {
        next(createError(500, 'Internal server error'))
    }
});

//get todo
// Method : get, Path : / get-todo?
// Data : serachTitle, userId(query)
router.get('/', async (req, res, next) => {
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
        // res.status(500).json({ msg: 'Internal server error' });
        next(createError(500, 'Internal server error'))
    }
});

// Delete Todo
// Method : Delete, Path : / delete-todo/:idToDelete
// Data : idToDelete
router.delete('/:idToDelete', async (req, res, next) => {
    try {
        // READ PATH PARAMS
        const { idToDelete } = req.params // {idToDelete: value}
        // Find Todo
        const result = await db.query('SELECT * FROM todos WHERE id = ?', [idToDelete])
        if (result[0].length === 0) {
            // return res.status(400).json({ msg: 'todo with id not found' })
            return next(createError(400, 'todo with id not found'));
        }
        await db.query('DELETE FROM todos WHERE id = ?', [idToDelete])
        res.status(200).json({ msg: 'Delete successfully' })
    } catch (err) {
        //res.status(500).json({ msg: 'Internal server error' });
        next(createError(500, 'Internal server error'))
    }
})

module.exports = router;