document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const errorEl = document.getElementById('error');
    const age = parseInt(document.getElementById('age').value);

    if (age < 13) {
        errorEl.textContent = 'Musíš mít alespoň 13 let';
        return;
    }

    const data = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        age: age,
        gender: document.getElementById('gender').value,
        username: document.getElementById('username').value,
        password: document.getElementById('password').value
    };

    register(data).then(function(res) {
        if (res.error) {
            errorEl.textContent = res.error;
            return;
        }
        window.location.href = 'index.html';
    });
});