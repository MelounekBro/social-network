const express = require('express');
const db = require('../db');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();


router.get('/', requireLogin, function(req, res) {
    db.query(
        'SELECT id, first_name, last_name, age, gender, created_at FROM users ORDER BY last_name ASC',
        function(err, rows) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        }
    );
});


router.get('/:id', requireLogin, function(req, res) {
    const userId = req.params.id;

    db.query(
        'SELECT id, first_name, last_name, age, gender, created_at FROM users WHERE id = ?',
        [userId],
        function(err, users) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (users.length === 0) {
                return res.status(404).json({ error: 'Uživatel nenalezen' });
            }

            db.query(
                `SELECT p.*, COUNT(DISTINCT l.id) AS like_count, COUNT(DISTINCT c.id) AS comment_count
                 FROM posts p
                 LEFT JOIN likes l ON l.post_id = p.id
                 LEFT JOIN comments c ON c.post_id = p.id
                 WHERE p.user_id = ?
                 GROUP BY p.id
                 ORDER BY p.created_at DESC`,
                [userId],
                function(err2, posts) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }

                    db.query(
                        `SELECT DISTINCT p.*, u.first_name, u.last_name,
                                COUNT(DISTINCT l2.id) AS like_count,
                                COUNT(DISTINCT c2.id) AS comment_count
                         FROM posts p
                         JOIN users u ON p.user_id = u.id
                         LEFT JOIN likes l2 ON l2.post_id = p.id
                         LEFT JOIN comments c2 ON c2.post_id = p.id
                         WHERE p.user_id != ?
                           AND p.id IN (
                               SELECT post_id FROM likes WHERE user_id = ?
                               UNION
                               SELECT post_id FROM comments WHERE user_id = ?
                           )
                         GROUP BY p.id
                         ORDER BY p.created_at DESC`,
                        [userId, userId, userId],
                        function(err3, activity) {
                            if (err3) {
                                return res.status(500).json({ error: err3.message });
                            }
                            res.json({ user: users[0], posts: posts, activity: activity });
                        }
                    );
                }
            );
        }
    );
});

module.exports = router;