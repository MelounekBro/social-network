const express = require('express');
const db = require('../db');
const { sessions, generateToken } = require('../middleware/auth');

const router = express.Router();


router.post('/register', function(req, res) {
    const { first_name, last_name, age, gender, username, password } = req.body;

    if (!first_name || !last_name || !age || !gender || !username || !password) {
        return res.status(400).json({ error: 'Vyplň všechna pole' });
    }

    if (parseInt(age) < 13) {
        return res.status(400).json({ error: 'Musíš mít alespoň 13 let' });
    }

    const sql = 'INSERT INTO users (first_name, last_name, age, gender, username, password) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(sql, [first_name, last_name, age, gender, username, password], function(err, result) {
        if (err) {
            return res.status(500).json({ error: 'Chyba při registraci: ' + err.message });
        }
        res.json({ message: 'Registrace proběhla úspěšně', userId: result.insertId });
    });
});


router.post('/login', function(req, res) {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], function(err, rows) {
        if (err) {
            return res.status(500).json({ error: 'Chyba DB' });
        }
        if (rows.length === 0 || rows[0].password !== password) {
            return res.status(401).json({ error: 'Špatné přihlašovací údaje' });
        }

        const token = generateToken();
        sessions[token] = { userId: rows[0].id, username: rows[0].username };

        res.json({ message: 'Přihlášení úspěšné', token: token, userId: rows[0].id });
    });
});


router.post('/logout', function(req, res) {
    const token = req.headers['x-session-token'];
    if (token && sessions[token]) {
        delete sessions[token];
    }
    res.json({ message: 'Odhlášení úspěšné' });
});


router.get('/me', function(req, res) {
    const token = req.headers['x-session-token'];
    if (!token || !sessions[token]) {
        return res.status(401).json({ loggedIn: false });
    }
    res.json({ loggedIn: true, userId: sessions[token].userId, username: sessions[token].username });
});

module.exports = router;