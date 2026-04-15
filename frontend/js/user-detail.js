if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

function getInitials(first, last) {
    return first.charAt(0) + last.charAt(0);
}

function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('cs-CZ') + ' ' + d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
}

function renderPost(post) {
    return '<div class="card">' +
        '<div class="post-header">' +
            '<div class="avatar">' + getInitials(post.first_name || '', post.last_name || '') + '</div>' +
            '<div>' +
                '<div>' + (post.first_name || '') + ' ' + (post.last_name || '') + '</div>' +
                '<div class="post-meta">' + formatDate(post.created_at) + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="post-title">' + post.title + '</div>' +
        '<div class="post-content">' + post.content + '</div>' +
        '<div class="post-actions">' +
            '<span>' + post.like_count + '</span>' +
            '<span>' + post.comment_count + '</span>' +
        '</div>' +
    '</div>';
}

document.getElementById('logout-btn').addEventListener('click', function() {
    logout().then(function() {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

const params = new URLSearchParams(window.location.search);
const userId = params.get('id');

if (!userId) {
    window.location.href = 'users.html';
}

getUserDetail(userId).then(function(data) {
    const u = data.user;

    document.getElementById('user-info').innerHTML =
        '<div class="post-header">' +
            '<div class="avatar" style="width:60px;height:60px;font-size:1.4rem">' + getInitials(u.first_name, u.last_name) + '</div>' +
            '<div>' +
                '<h2>' + u.first_name + ' ' + u.last_name + '</h2>' +
                '<div class="post-meta">' + u.gender + ', ' + u.age + ' let</div>' +
            '</div>' +
        '</div>';

    const postsEl = document.getElementById('user-posts');
    if (data.posts.length === 0) {
        postsEl.innerHTML = '<p style="color:#888">Žádné příspěvky</p>';
    } else {
        for (let i = 0; i < data.posts.length; i++) {
            postsEl.innerHTML += renderPost(data.posts[i]);
        }
    }

    const activityEl = document.getElementById('user-activity');
    if (data.activity.length === 0) {
        activityEl.innerHTML = '<p style="color:#888">Žádná aktivita</p>';
    } else {
        for (let i = 0; i < data.activity.length; i++) {
            activityEl.innerHTML += renderPost(data.activity[i]);
        }
    }
});