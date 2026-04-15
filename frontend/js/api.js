const API = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'x-session-token': getToken()
    };
}

function login(username, password) {
    return fetch(API + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    }).then(function(res) { return res.json(); });
}

function register(data) {
    return fetch(API + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(function(res) { return res.json(); });
}

function logout() {
    return fetch(API + '/auth/logout', {
        method: 'POST',
        headers: authHeaders()
    }).then(function(res) { return res.json(); });
}

function getPosts() {
    return fetch(API + '/posts', {
        headers: authHeaders()
    }).then(function(res) { return res.json(); });
}

function createPost(title, content) {
    return fetch(API + '/posts', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: title, content: content })
    }).then(function(res) { return res.json(); });
}

function getPostDetail(id) {
    return fetch(API + '/posts/' + id, {
        headers: authHeaders()
    }).then(function(res) { return res.json(); });
}

function addComment(postId, content) {
    return fetch(API + '/comments', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ post_id: postId, content: content })
    }).then(function(res) { return res.json(); });
}

function toggleLike(postId) {
    return fetch(API + '/likes', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ post_id: postId })
    }).then(function(res) { return res.json(); });
}

function getUsers() {
    return fetch(API + '/users', {
        headers: authHeaders()
    }).then(function(res) { return res.json(); });
}

function getUserDetail(id) {
    return fetch(API + '/users/' + id, {
        headers: authHeaders()
    }).then(function(res) { return res.json(); });
}