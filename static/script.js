var socket = io();

function sendMessage() {
    var message = document.getElementById('messageInput').value;
    if (message.trim() === '') {
        return;
    }
    addMessage(message, 'user');
    socket.send(message);
    document.getElementById('messageInput').value = '';
}

socket.on('message', function(msg) {
    addMessage(msg, 'bot');
});

function addMessage(message, sender) {
    var li = document.createElement("li");
    li.classList.add('message');
    if (sender === 'user') {
        li.classList.add('user');
    }
    li.textContent = message;
    document.getElementById('messages').appendChild(li);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

function toggleChatbot() {
    var chatbotContainer = document.getElementById('chatbotContainer');
    var chatIcon = document.getElementById('chatIcon');
    if (chatbotContainer.style.display === "none" || chatbotContainer.style.display === "") {
        chatbotContainer.style.display = "block";
        chatIcon.style.display = "none";
    } else {
        chatbotContainer.style.display = "none";
        chatIcon.style.display = "block";
    }
}
