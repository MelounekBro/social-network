if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('cs-CZ') + ' ' + d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(first, last) {
    return first.charAt(0) + last.charAt(0);
}

function renderPost(post) {
    const div = document.createElement('div');
    div.className = 'card';

    div.innerHTML =
        '<div class="post-header">' +
            '<div class="avatar">' + getInitials(post.first_name, post.last_name) + '</div>' +
            '<div>' +
                '<a href="user-detail.html?id=' + post.user_id + '">' + post.first_name + ' ' + post.last_name + '</a>' +
                '<div class="post-meta">' + formatDate(post.created_at) + '</div>' +
            '</div>' +
        '</div>' +
        '<div class="post-title">' + post.title + '</div>' +
        '<div class="post-content">' + post.content + '</div>' +
        '<div class="post-actions">' +
            '<button class="like-btn" data-id="' + post.id + '">Like</button>' +
            '<span class="likes-count" data-id="' + post.id + '">' + post.like_count + '</span>' +
            '<span>' + post.comment_count + '</span>' +
        '</div>' +
        '<div class="likes-list" id="likes-' + post.id + '"></div>' +
        '<div class="comments-section" id="comments-section-' + post.id + '"></div>';

    return div;
}

function loadComments(postId) {
    const section = document.getElementById('comments-section-' + postId);

    getPostDetail(postId).then(function(data) {
        let html = '';

        for (let i = 0; i < data.comments.length; i++) {
            const c = data.comments[i];
            html +=
                '<div class="comment">' +
                    '<div class="avatar" style="width:32px;height:32px;font-size:0.75rem">' + getInitials(c.first_name, c.last_name) + '</div>' +
                    '<div class="comment-body">' +
                        '<span class="comment-author">' + c.first_name + ' ' + c.last_name + '</span>' +
                        '<span class="comment-date">' + formatDate(c.created_at) + '</span>' +
                        '<div class="comment-text">' + c.content + '</div>' +
                    '</div>' +
                '</div>';
        }

        html +=
            '<div class="comment-form">' +
                '<input type="text" id="comment-input-' + postId + '" placeholder="Napiš komentář...">' +
                '<button class="btn btn-small" onclick="submitComment(' + postId + ')">Odeslat</button>' +
            '</div>';

        section.innerHTML = html;
    });
}

function submitComment(postId) {
    const input = document.getElementById('comment-input-' + postId);
    const content = input.value.trim();
    if (!content) return;

    addComment(postId, content).then(function() {
        input.value = '';
        loadComments(postId);
    });
}

function loadWall() {
    getPosts().then(function(posts) {
        const feed = document.getElementById('feed');
        feed.innerHTML = '';

        for (let i = 0; i < posts.length; i++) {
            const el = renderPost(posts[i]);
            feed.appendChild(el);
            loadComments(posts[i].id);
        }


        const likeBtns = document.querySelectorAll('.like-btn');
        for (let i = 0; i < likeBtns.length; i++) {
            likeBtns[i].addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                toggleLike(id).then(function() {
                    loadWall();
                });
            });
        }


        const likesCounts = document.querySelectorAll('.likes-count');
        for (let i = 0; i < likesCounts.length; i++) {
            likesCounts[i].addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const listEl = document.getElementById('likes-' + id);

                if (listEl.style.display === 'block') {
                    listEl.style.display = 'none';
                    return;
                }

                getPostDetail(id).then(function(data) {
                    let html = '';
                    for (let j = 0; j < data.likes.length; j++) {
                        const l = data.likes[j];
                        html += '<div>' + l.first_name + ' ' + l.last_name + ' — ' + formatDate(l.created_at) + '</div>';
                    }
                    listEl.innerHTML = html || 'Zatím žádné liky';
                    listEl.style.display = 'block';
                });
            });
        }
    });
}

document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    createPost(title, content).then(function() {
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        loadWall();
    });
});

document.getElementById('logout-btn').addEventListener('click', function() {
    logout().then(function() {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

loadWall();