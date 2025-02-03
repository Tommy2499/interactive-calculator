from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Flask backend is running!"

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json  # Receive JSON from frontend
    num1 = data.get('num1', 0)
    num2 = data.get('num2', 0)
    result = num1 + num2  # Perform calculation
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True)
