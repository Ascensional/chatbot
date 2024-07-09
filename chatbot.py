import random

def get_response(message):
    responses = {
        "hi": "Hello!",
        "how are you": "I'm good, thank you!",
        "bye": "Goodbye!"
    }
    return responses.get(message.lower(), "Sorry, I don't understand that.")
