const express = require('express');
const db = require('../db');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();


router.get('/', requireLogin, function(req, res) {
    const sql = `
        SELECT p.*, u.first_name, u.last_name,
               COUNT(DISTINCT l.id) AS like_count,
               COUNT(DISTINCT c.id) AS comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN likes l ON l.post_id = p.id
        LEFT JOIN comments c ON c.post_id = p.id
        GROUP BY p.id
        ORDER BY p.created_at DESC
    `;
    db.query(sql, function(err, rows) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


router.get('/:id', requireLogin, function(req, res) {
    const postId = req.params.id;

    db.query(
        'SELECT p.*, u.first_name, u.last_name FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?',
        [postId],
        function(err, posts) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (posts.length === 0) {
                return res.status(404).json({ error: 'Příspěvek nenalezen' });
            }

            db.query(
                'SELECT c.*, u.first_name, u.last_name FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
                [postId],
                function(err2, comments) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }

                    db.query(
                        'SELECT l.*, u.first_name, u.last_name FROM likes l JOIN users u ON l.user_id = u.id WHERE l.post_id = ? ORDER BY l.created_at DESC',
                        [postId],
                        function(err3, likes) {
                            if (err3) {
                                return res.status(500).json({ error: err3.message });
                            }
                            res.json({ post: posts[0], comments: comments, likes: likes });
                        }
                    );
                }
            );
        }
    );
});


router.post('/', requireLogin, function(req, res) {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Vyplň nadpis a text' });
    }

    db.query(
        'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)',
        [req.userId, title, content],
        function(err, result) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Příspěvek přidán', postId: result.insertId });
        }
    );
});

module.exports = router;