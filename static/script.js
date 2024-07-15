var socket = io();
var askingForName = false;
var askingForEmail = false;
var askingForIssue = false;
var waitingForFeedback = false;

function sendMessage(message) {
    var messageInput = document.getElementById('messageInput');
    if (messageInput.value.trim() === '') {
        return;
    }
    addMessage(messageInput.value, 'user');
    socket.send(messageInput.value);
    messageInput.value = '';
}

socket.on('message', function(msg) {
    if (waitingForFeedback) {
        handleFeedbackResponse(msg);
    } else if (askingForName) {
        handleNameInput(msg);
    } else if (askingForEmail) {
        handleEmailInput(msg);
    } else if (askingForIssue) {
        handleIssueInput(msg);
    } else {
        addMessage(msg, 'bot');
    }
});

function addMessage(message, sender) {
    var li = document.createElement("li");
    li.classList.add('message');
    if (sender === 'user') {
        li.classList.add('user');
    } else {
        li.classList.add('bot');
    }
    li.textContent = message;
    document.getElementById('messages').appendChild(li);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;

    // Check if the message contains "Option X is clicked"
    if (message.startsWith('Option')) {
        showFeedbackPrompt(); // Display feedback prompt after the option message
    }
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

function toggleOptions() {
    var optionsMenu = document.getElementById('optionsMenu');
    optionsMenu.classList.toggle('show');
}

// Updated sendButtonMessage function to handle button clicks
function sendButtonMessage(option) {
    addMessage(option, 'user');  // Display the user message in the chat
    sendMessage(option);  // Send the message to the server if needed

    var botResponse = '';
    switch(option) {
        case 'Option 1':
            botResponse = "Option 1 is clicked.";
            break;
        case 'Option 2':
            botResponse = "Option 2 is clicked.";
            break;
        case 'Option 3':
            botResponse = "Option 3 is clicked.";
            break;
        case 'Option 4':
            botResponse = "Option 4 is clicked.";
            break;
        case 'Option 5':
            botResponse = "Option 5 is clicked.";
            break;
        default:
            botResponse = "Invalid option.";
    }
    addMessage(botResponse, 'bot');  // Display the bot message in the chat

    // Show feedback prompt after displaying the option message
    showFeedbackPrompt();
}

// Function to display feedback prompt
function showFeedbackPrompt() {
    // Ensure there is no existing feedback prompt before showing a new one
    var existingFeedbackPrompt = document.querySelector('.feedback-prompt');
    if (existingFeedbackPrompt) {
        existingFeedbackPrompt.remove();
    }

    var feedbackPrompt = document.createElement("div");
    feedbackPrompt.classList.add('feedback-prompt');
    
    var promptText = document.createElement("div");
    promptText.textContent = "Was this information helpful?";
    feedbackPrompt.appendChild(promptText);

    var feedbackButtons = document.createElement("div");
    feedbackButtons.classList.add('feedback-buttons');
    
    var helpfulButton = document.createElement("button");
    helpfulButton.classList.add('btn');
    helpfulButton.classList.add('btn-light');
    helpfulButton.textContent = "Yes";
    helpfulButton.onclick = function() {
        sendFeedback(true);
        feedbackPrompt.remove(); // Remove the feedback prompt after clicking Yes
    };
    feedbackButtons.appendChild(helpfulButton);

    var notHelpfulButton = document.createElement("button");
    notHelpfulButton.classList.add('btn');
    notHelpfulButton.classList.add('btn-light');
    notHelpfulButton.textContent = "No";
    notHelpfulButton.onclick = function() {
        sendFeedback(false);
        feedbackPrompt.remove(); // Remove the feedback prompt after clicking No
    };
    feedbackButtons.appendChild(notHelpfulButton);

    feedbackPrompt.appendChild(feedbackButtons);

    document.getElementById('chatbotContainer').appendChild(feedbackPrompt);
}

// Function to send feedback to the server
function sendFeedback(isHelpful) {
    if (isHelpful) {
        var feedback = "Thank you!";
        addMessage(feedback, 'bot');  // Display the bot message in the chat
        sendMessage(feedback);  // Send the feedback to the server if needed
    } else {
        askForName();
    }
}

// Function to ask for the user's name
function askForName() {
    // Reset other states if necessary
    askingForEmail = false;
    askingForIssue = false;
    
    askingForName = true; // Set flag to true for asking name
    addMessage("Please enter your name:", 'bot');
}

// Function to handle name input
function handleNameInput(name) {
    addMessage("Name: " + name, 'user');
    sendMessage("Name: " + name);  // Send the name to the server if needed
    askingForName = false; // Reset flag after handling name
    askForEmail();
}

// Function to ask for the user's email
function askForEmail() {
    // Reset other states if necessary
    askingForIssue = false;
    
    askingForEmail = true; // Set flag to true for asking email
    addMessage("Please enter your email:", 'bot');
}

// Function to handle email input
function handleEmailInput(email) {
    addMessage("Email: " + email, 'user');
    sendMessage("Email: " + email);  // Send the email to the server if needed
    askingForEmail = false; // Reset flag after handling email
    askForIssue();
}

// Function to ask for the user's issue
function askForIssue() {
    askingForIssue = true; // Set flag to true for asking issue
    addMessage("Please describe your issue:", 'bot');
}

// Function to handle issue input
function handleIssueInput(issue) {
  
    var botResponse = "Thank you for providing the information. How can I assist you further?";
    addMessage(botResponse, 'bot');
    sendMessage(botResponse);  // Send the bot response to the server if needed
    askingForIssue = false; // Reset flag after handling issue
}

// Function to handle user feedback response
function handleFeedbackResponse(response) {
    if (response.toLowerCase().includes('yes')) {
        var feedback = "Thank you!";
        addMessage(feedback, 'bot');
        sendMessage(feedback);
    } else if (response.toLowerCase().includes('no')) {
        askForName();
    }
    waitingForFeedback = false; // Reset flag after handling feedback
}

// Function to handle initial greeting and button messages
function handleInitialGreeting(messages) {
    messages.forEach((message) => {
        if (message[0] === 'bot_button') {
            var li = document.createElement("li");
            li.classList.add('message');
            li.classList.add('bot');
            var button = document.createElement("button");
            button.classList.add('btn');
            button.classList.add('btn-light');
            button.textContent = message[1];
            button.onclick = function() {
                sendButtonMessage(message[1]);
            };
            li.appendChild(button);
            document.getElementById('messages').appendChild(li);
        } else {
            addMessage(message[1], message[0]);
        }
    });
}

// Execute initial greeting display when the page loads
document.addEventListener('DOMContentLoaded', function () {
    var initialMessages = document.getElementById('messages').getElementsByTagName('li');
    if (initialMessages.length === 0) {
        socket.emit('request_initial_messages');
    }
});

// Socket event to receive initial messages from server
socket.on('initial_messages', function (messages) {
    handleInitialGreeting(messages);
});
