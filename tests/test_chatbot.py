import unittest
from chatbot import get_response

class TestChatbot(unittest.TestCase):
    def test_response(self):
        self.assertEqual(get_response("hi"), "Hello!")
        self.assertEqual(get_response("how are you"), "I'm good, thank you!")
        self.assertEqual(get_response("bye"), "Goodbye!")
        self.assertEqual(get_response("unknown"), "Sorry, I don't understand that.")

if __name__ == '__main__':
    unittest.main()
