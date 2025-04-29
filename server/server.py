from flask import Flask, request, jsonify, send_from_directory
import util
import os

app = Flask(__name__, static_folder='../client')

@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'app.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

@app.route('/get_location_names', methods=['GET'])
def get_location_names():
    response = jsonify({
        'locations': util.get_location_names()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    if request.method == 'GET':
        # For GET requests, get parameters from query string
        total_sqft = float(request.args.get('total_sqft'))
        location = request.args.get('location')
        bhk = int(request.args.get('bhk'))
        parking = int(request.args.get('parking'))
    else:
        # For POST requests, get parameters from form data
        total_sqft = float(request.form['total_sqft'])
        location = request.form['location']
        bhk = int(request.form['bhk'])
        parking = int(request.form['parking'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(location,total_sqft,bhk,parking)
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Home Price Prediction...")
    util.load_saved_artifacts()
    app.run()