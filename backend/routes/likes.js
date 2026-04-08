const express = require('express');
const db = require('../db');
const { requireLogin } = require('../middleware/auth');

const router = express.Router();


router.post('/', requireLogin, function(req, res) {
    const { post_id } = req.body;

    if (!post_id) {
        return res.status(400).json({ error: 'Chybí post_id' });
    }

    db.query(
        'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
        [req.userId, post_id],
        function(err, existing) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (existing.length > 0) {
                db.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [req.userId, post_id], function(err2) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }
                    res.json({ message: 'Like odebrán', liked: false });
                });
            } else {
                db.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [req.userId, post_id], function(err2, result) {
                    if (err2) {
                        return res.status(500).json({ error: err2.message });
                    }
                    res.json({ message: 'Like přidán', liked: true });
                });
            }
        }
    );
});

module.exports = router;