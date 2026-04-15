if (!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

function getInitials(first, last) {
    return first.charAt(0) + last.charAt(0);
}

document.getElementById('logout-btn').addEventListener('click', function() {
    logout().then(function() {
        localStorage.clear();
        window.location.href = 'index.html';
    });
});

getUsers().then(function(users) {
    const list = document.getElementById('users-list');

    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        const div = document.createElement('div');
        div.className = 'user-item';
        div.innerHTML =
            '<div class="avatar">' + getInitials(u.first_name, u.last_name) + '</div>' +
            '<div class="user-info">' +
                '<div class="name"><a href="user-detail.html?id=' + u.id + '">' + u.first_name + ' ' + u.last_name + '</a></div>' +
                '<div class="meta">' + u.gender + ', ' + u.age + ' let</div>' +
            '</div>';
        list.appendChild(div);
    }
});