# app.py
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
import random

app = Flask(__name__)
CORS(app)  # Enable CORS on the Flask app

# Sample quotes
quotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "The strong person is not the one who can overpower others, but the one who controls himself when angry. – Prophet Muhammad (PBUH)",
    "Life is what happens when you're busy making other plans. – John Lennon",
    "Get busy living or get busy dying. – Stephen King",
    "You only live once, but if you do it right, once is enough. – Mae West",
    "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe. – Albert Einstein",
    "You miss 100% of the shots you don’t take. – Wayne Gretzky",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
    "A room without books is like a body without a soul. – Marcus Tullius Cicero", 
    "Kindness is a mark of faith, and whoever is not kind has no faith. – Prophet Muhammad"
]

@app.route('/quote')
def get_quote():
    """
    Returns a random quote from the list of quotes.
    """
    quote = random.choice(quotes)
    return jsonify({'quote': quote})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
