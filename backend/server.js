const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const userRoutes = require('./routes/users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

app.listen(3000, function() {
    console.log('Server běží na http://localhost:3000');
});