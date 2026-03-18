from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__, static_folder='.')
CORS(app)

DATABASE = 'pets.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS pets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                species TEXT NOT NULL,
                age INTEGER NOT NULL,
                appointment_date TEXT,
                appointment_reason TEXT
            )
        ''')
        conn.commit()

init_db()

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_files(path):
    return send_from_directory('.', path)

import re

# REST API Endpoints
def validate_pet_data(data):
    if not re.match(r"^[a-zA-Z\s]+$", data.get('name', '')):
        raise ValueError("Name can only contain letters and spaces")
    if not re.match(r"^[a-zA-Z\s]+$", data.get('species', '')):
        raise ValueError("Species can only contain letters and spaces")

@app.route('/api/pets', methods=['GET'])
def get_pets():
    with get_db() as conn:
        pets = conn.execute('SELECT * FROM pets ORDER BY rowid DESC').fetchall()
        return jsonify([dict(p) for p in pets])

@app.route('/api/pets', methods=['POST'])
def add_pet():
    data = request.json
    try:
        validate_pet_data(data)
        with get_db() as conn:
            conn.execute('INSERT INTO pets (id, name, species, age, appointment_date, appointment_reason) VALUES (?, ?, ?, ?, ?, ?)',
                         (data['id'], data['name'], data['species'], data['age'], data.get('appointment_date'), data.get('appointment_reason')))
            conn.commit()
        return jsonify(data), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/pets/<pet_id>', methods=['PUT'])
def update_pet(pet_id):
    data = request.json
    try:
        validate_pet_data(data)
        with get_db() as conn:
            conn.execute('UPDATE pets SET name = ?, species = ?, age = ?, appointment_date = ?, appointment_reason = ? WHERE id = ?',
                         (data['name'], data['species'], data['age'], data.get('appointment_date'), data.get('appointment_reason'), pet_id))
            conn.commit()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/pets/<pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    try:
        with get_db() as conn:
            conn.execute('DELETE FROM pets WHERE id = ?', (pet_id,))
            conn.commit()
        return jsonify({'message': 'Deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
