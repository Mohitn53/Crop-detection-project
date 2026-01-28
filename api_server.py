from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
from PIL import Image
import io
from disease_utils import format_disease_output, get_solution

app = Flask(__name__)
CORS(app)

# Global model variable
model_pipeline = None

def load_model():
    global model_pipeline
    print("Loading model... this may take a moment")
    model_pipeline = pipeline("image-classification", model="Diginsa/Plant-Disease-Detection-Project")
    print("Model loaded successfully")

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No image selected"}), 400

    try:
        # Read image
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        # Make prediction
        predictions = model_pipeline(image)
        top_prediction = predictions[0]
        
        # Format output
        result = format_disease_output(top_prediction['label'], top_prediction['score'])
        
        # Get detailed solution
        solution = get_solution(top_prediction['label'])
        
        # Merge solution into result
        result.update(solution)
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Load model before starting server
    load_model()
    # Run on all interfaces
    app.run(host='0.0.0.0', port=5000, debug=True)
