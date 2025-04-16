const usernameInput = document.getElementById('username');
const usernameLoginButton = document.getElementById('login-btn');

const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');

const tabsButton = document.querySelectorAll('.tab-btn');
const tabConents = document.querySelectorAll('.tab-content');

const themeToggle = document.getElementById('theme-toggle');
// Users elements 
const usersSearchInput = document.getElementById('users-search');
const prevUsersButton = document.getElementById('prev-users');
const nextUsersButton = document.getElementById('next-users');

// Posts elements
const postSearchInput = document.getElementById('post-search');
const prevPostsButton = document.getElementById('prev-posts');
const nextPostsButton = document.getElementById('next-posts');

// Todos elements
const prevTodosButton = document.getElementById('prev-todos');
const nextTodosButton = document.getElementById('next-todos');

let userPage = 1;
let postPage = 1;
let todoPage = 1;
const defaultLimit = 5;

const todoInput = document.getElementById('input-todo');
const addTodoButton = document.getElementById('add-todo');

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

    if(window.sessionStorage.getItem('dark-theme')) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    if(username) {
        authScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        loadTab(window.sessionStorage.getItem('activeTab') || 'users');
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

    currentTab = window.sessionStorage.getItem('activeTab') || 'users';
    tabsButton.forEach((item) => {
        const target = item.dataset.tab;
        if(target == currentTab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    })

    if(tabName == 'users') {
        fetchUsers();
    }

    if(tabName == 'posts') {
        fetchPosts();
    }

    if(tabName == 'todos') {
        fetchTodos();
    }
}

tabsButton.forEach((item) => {
    item.addEventListener('click', () => {
        const target = item.dataset.tab;
        window.sessionStorage.setItem('activeTab', target);
        loadTab(target);
    })
})



themeToggle.onchange = () => {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
    window.sessionStorage.setItem('dark-theme', themeToggle.checked);
}

setInterval(() => {
    const username = getCookie('username');

    if(!username) {
        deleteCookie('username');
        location.reload();
    }
}, 10000);

// Users
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

// Posts
prevPostsButton.addEventListener('click', () => {
    if(postPage > 1) {
        postPage -= 1;
        fetchPosts();
    }
})

nextPostsButton.addEventListener('click', () => {
    postPage += 1;
    fetchPosts();
})

postSearchInput.oninput = (event) => {
    postPage = 1;
    fetchPosts(event.target.value);
}

function renderPosts(posts) {
    const postsList = document.getElementById('post-list');
    if(posts.length) {
        postsList.innerHTML = posts.map((post) => {
            return `<div class="post"><h3>${post.title}</h3><p>${post.body}</p></div>`;
        }).join('');

    } else {
        postsList.innerHTML = 'Нету пользователей';
    }

}

function fetchPosts(query='') {
    fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${defaultLimit}&_page=${postPage}&q=${query}`).then((response) => {
        return response.json();
    }).then((data) => {
        renderPosts(data);
    })

}

// Todos
prevTodosButton.addEventListener('click', () => {
    if(todoPage > 1) {
        todoPage -= 1;
        fetchTodos();
    }
})

nextTodosButton.addEventListener('click', () => {
    todoPage += 1;
    fetchTodos();
})

function renderTodos(todos) {
    const todosList = document.getElementById('todo-list');
    todosList.start = (todoPage - 1) * defaultLimit + 1;

    if(todos.length) {
        todosList.innerHTML = todos.map((todo) => {
            return `<li>${todo.completed ? '✅' : '❌'} ${todo.title}</li>`;
        }).join('');

    } else {
        todosList.innerHTML = 'Нету задач по запросу';
    }

}

function fetchTodos(query='') {
    return fetch(`https://jsonplaceholder.typicode.com/todos?_limit=${defaultLimit}&_page=${todoPage}&q=${query}`).then((response) => {
        return response.json();
    }).then((data) => {
        renderTodos(data);
    })

}

addTodoButton.addEventListener('click', () => {
    const todoValue = todoInput.value;
    fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
            title: todoValue,
            completed: false
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    }).then((response) => {
        return response.json();
    }).then((data) => {
        todoPage = 1;
        fetchTodos().then(() => {
            const todosList = document.getElementById('todo-list');
            const li = document.createElement('li');

            li.textContent = `${data.completed ? '✅' : '❌'} ${data.title}`;
            todosList.insertBefore(li, todosList.firstChild);
            todosList.removeChild(todosList.lastChild);
        });

    })
});

// Final

checkAuth();
