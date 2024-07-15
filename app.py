from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# Store messages in a list
messages = []

# Example function to get bot response based on message
def get_response(msg):
    if msg.lower() == 'hello':
        return "Hello! How can I assist you today?"
    else:
        return "Sorry, I don't understand that."

# Function to send initial greeting message
def send_initial_greeting():
    # Send initial greeting only if there are no existing messages
    if not messages:
        send("Hello! I'm your college chatbot. How can I assist you today?", broadcast=True)
        messages.append(("bot", "Hello! I'm your college chatbot. How can I assist you today?"))

@app.route('/')
def index():
    send_initial_greeting()  # Send initial greeting when chat is first opened
    return render_template('index.html', messages=messages)  # Pass messages to the template

@socketio.on('connect')
def handle_connect():
    send_initial_greeting()  # Send initial greeting when a new connection is established

@socketio.on('message')
def handleMessage(msg):
    print('Message: ' + msg)
    response = get_response(msg)
    messages.append(("user", msg))  # Store user message
    messages.append(("bot", response))  # Store bot response
    send(response, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
