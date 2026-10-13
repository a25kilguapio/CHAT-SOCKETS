const loginForm = document.getElementById('login-form');
const nameInput = document.getElementById('name-input');
const loginError = document.getElementById('login-error');

const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const userNameSpan = document.getElementById('user-name');
const statusSpan = document.getElementById('status');
const messagesDiv = document.getElementById('messages');

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const sendButton = messageForm.querySelector('button');

let myName = '';
const socket = io({ autoConnect: false });

// Un únic listener de missatges, registrat una sola vegada.
socket.on('chat:message', function (msg) {
  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = '<div class="meta"></div><div class="text"></div>';
  div.querySelector('.meta').textContent = msg.name + ' - ' + msg.time;
  div.querySelector('.text').textContent = msg.text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

socket.on('connect', function () {
  console.log('Connectat', socket.id);
  statusSpan.textContent = 'Connectat';
  statusSpan.className = '';
  messageInput.disabled = false;
  sendButton.disabled = false;
});

socket.on('disconnect', function () {
  statusSpan.textContent = 'Desconnectat';
  statusSpan.className = 'disconnected';
  messageInput.disabled = true;
  sendButton.disabled = true;
});

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();

  if (name.length === 0) {
    loginError.textContent = 'El nom no pot estar buit';
    return;
  }
  if (name.length > 20) {
    loginError.textContent = 'Màxim 20 caràcters';
    return;
  }

  myName = name;
  userNameSpan.textContent = myName;
  loginScreen.style.display = 'none';
  chatScreen.style.display = 'flex';

  socket.connect();
});

messageForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const text = messageInput.value.trim();
  if (text.length === 0 || text.length > 500) return;

  socket.emit('chat:send', { name: myName, text: text });
  messageInput.value = '';
});
