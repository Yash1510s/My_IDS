from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler
import random
import threading
import time
import os

# Resolve paths relative to project root (one level up from backend/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'ids_model.joblib')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'cicids2017.csv')

app = Flask(__name__)
CORS(app)

# Global variables for model and scaler
model = None
scaler = None
model_loaded = False

def load_model():
    global model, scaler, model_loaded
    try:
        # Load the trained model
        model = joblib.load(MODEL_PATH)
        
        # Create a scaler (you might need to save this separately)
        scaler = MinMaxScaler()
        
        # Load sample data to fit scaler
        df = pd.read_csv(DATA_PATH, nrows=1000)
        X = df.drop(columns=['Attack Type'])
        scaler.fit(X)
        
        model_loaded = True
        print("✅ Model loaded successfully!")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        model_loaded = False

# Load model on startup
load_model()

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    if not model_loaded:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        # Generate random packet features (simulating real network data)
        packet_features = generate_packet_features()
        
        # Scale the features
        packet_scaled = scaler.transform([packet_features])
        
        # Get prediction
        prediction = model.predict(packet_scaled)[0]
        prediction_proba = model.predict_proba(packet_scaled)[0]
        
        # Determine if it's an attack (for simulation)
        is_attack = random.random() < 0.3  # 30% chance of attack
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': float(max(prediction_proba)),
            'actual_label': int(is_attack),
            'features': packet_features.tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict_adversarial', methods=['POST'])
def predict_adversarial():
    if not model_loaded:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.json
        features = np.array(data['features'])
        
        # Apply adversarial perturbation
        adversarial_features = apply_adversarial_attack(features)
        
        # Scale and predict
        adversarial_scaled = scaler.transform([adversarial_features])
        prediction = model.predict(adversarial_scaled)[0]
        prediction_proba = model.predict_proba(adversarial_scaled)[0]
        
        return jsonify({
            'prediction': int(prediction),
            'confidence': float(max(prediction_proba)),
            'adversarial_features': adversarial_features.tolist(),
            'perturbation': (adversarial_features - features).tolist()
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_packet_features():
    """Generate realistic network packet features"""
    features = [
        random.uniform(0, 1),  # Duration
        random.uniform(0, 1),  # Protocol
        random.uniform(0, 1),  # Service
        random.uniform(0, 1),  # Flag
        random.uniform(0, 1),  # Source bytes
        random.uniform(0, 1),  # Destination bytes
        random.uniform(0, 1),  # Land
        random.uniform(0, 1),  # Wrong fragment
        random.uniform(0, 1),  # Urgent
        random.uniform(0, 1),  # Hot
        random.uniform(0, 1),  # Num failed logins
        random.uniform(0, 1),  # Logged in
        random.uniform(0, 1),  # Num compromised
        random.uniform(0, 1),  # Root shell
        random.uniform(0, 1),  # Su attempted
        random.uniform(0, 1),  # Num root
        random.uniform(0, 1),  # Num file creations
        random.uniform(0, 1),  # Num shells
        random.uniform(0, 1),  # Num access files
        random.uniform(0, 1),  # Num outbound cmds
        random.uniform(0, 1),  # Is host login
        random.uniform(0, 1),  # Is guest login
        random.uniform(0, 1),  # Count
        random.uniform(0, 1),  # Srv count
        random.uniform(0, 1),  # Serror rate
        random.uniform(0, 1),  # Srv serror rate
        random.uniform(0, 1),  # Rerror rate
        random.uniform(0, 1),  # Srv rerror rate
        random.uniform(0, 1),  # Same srv rate
        random.uniform(0, 1),  # Diff srv rate
        random.uniform(0, 1),  # Srv diff host rate
        random.uniform(0, 1),  # Dst host count
        random.uniform(0, 1),  # Dst host srv count
        random.uniform(0, 1),  # Dst host same srv rate
        random.uniform(0, 1),  # Dst host diff srv rate
        random.uniform(0, 1),  # Dst host same src port rate
        random.uniform(0, 1),  # Dst host serror rate
        random.uniform(0, 1),  # Dst host srv serror rate
        random.uniform(0, 1),  # Dst host rerror rate
        random.uniform(0, 1),  # Dst host srv rerror rate
    ]
    return np.array(features)

def apply_adversarial_attack(features):
    """Apply adversarial perturbation to features"""
    # Simple adversarial attack - add small random noise
    noise = np.random.normal(0, 0.1, features.shape)
    adversarial = features + noise
    
    # Clip to valid range
    adversarial = np.clip(adversarial, 0, 1)
    return adversarial

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_loaded
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)


