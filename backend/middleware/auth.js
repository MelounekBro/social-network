const sessions = {};

function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function requireLogin(req, res, next) {
    const token = req.headers['x-session-token'];
    if (!token || !sessions[token]) {
        return res.status(401).json({ error: 'Nejsi přihlášen' });
    }
    req.userId = sessions[token].userId;
    req.username = sessions[token].username;
    next();
}

module.exports = { sessions, generateToken, requireLogin };