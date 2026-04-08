const express = require('express');
const db = require('../db');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();


router.post('/', requireLogin, function(req, res) {
    const { post_id, content } = req.body;

    if (!post_id || !content) {
        return res.status(400).json({ error: 'Chybí post_id nebo obsah' });
    }

    db.query(
        'INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)',
        [req.userId, post_id, content],
        function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Komentář přidán', commentId: result.insertId });
        }
    );
});

module.exports = router;