const usernameInput = document.getElementById('username');
const usernameLoginButton = document.getElementById('login-btn');

const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');

const tabsButton = document.querySelectorAll('.tab-btn');
const tabConents = document.querySelectorAll('.tab-content');


function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 3600000).toUTCString();

    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
      return document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1];
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function checkAuth() {
    const username = getCookie('username');

    if(username) {
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadTab('users');
    } else {
        authScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
}


usernameLoginButton.addEventListener('click', () => {
    const usernameValue = usernameInput.value;

    if(usernameValue) {
        setCookie('username', usernameValue, 1);
        checkAuth();
    }

})

function loadTab(tabName) {
    tabConents.forEach((item) => item.classList.add('hidden'));

    const tab = document.getElementById(`${tabName}-tab`);
    tab.classList.remove('hidden');

    if(tabName == 'users') {
        fetchUsers();
    }
}

tabsButton.forEach((item) => {
    item.addEventListener('click', () => {
        const target = item.dataset.tab;
        loadTab(target);
    })
})

const themeToggle = document.getElementById('theme-toggle');
const usersSearchInput = document.getElementById('users-search');
const prevUsersButton = document.getElementById('prev-users');
const nextUsersButton = document.getElementById('next-users');

let userPage = 1;
const defaultLimit = 5;

prevUsersButton.addEventListener('click', () => {
    if(userPage > 1) {
        userPage -= 1;
        fetchUsers();
    }
})

nextUsersButton.addEventListener('click', () => {
    userPage += 1;
    fetchUsers();
})

usersSearchInput.oninput = (event) => {
    userPage = 1;
    fetchUsers(event.target.value);
}

function renderUsers(users) {
    const usersList = document.getElementById('users-list');
    if(users.length) {
        usersList.innerHTML = users.map((user) => {
            return `<div>${user.name} - ${user.email}</div>`;
        }).join('');

    } else {
        usersList.innerHTML = 'Нету пользователей';
    }

}

function fetchUsers(query='') {
    fetch(`https://jsonplaceholder.typicode.com/users?_limit=${defaultLimit}&_page=${userPage}&q=${query}`).then((response) => {
        return response.json();
    }).then((data) => {
        renderUsers(data);
    })

}

themeToggle.onchange = () => {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
}

setInterval(() => {
    const username = getCookie('username');

    if(!username) {
        deleteCookie('username');
        location.reload();
    }
}, 10000);

checkAuth();
