from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import time
from datetime import datetime
from qkd_simulation import QKDSimulation

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the QKD simulation
qkd_sim = QKDSimulation()

# Store simulation results in memory (for demo purposes)
# In a production app, you might use a database
simulation_results = {}

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "QKD Simulation API is running",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.json
        n = data.get('n', 100)  # Default to 100 qubits if not specified
        
        # Validate input
        if not isinstance(n, int) or n <= 0 or n > 1000:
            return jsonify({
                "error": "Invalid input: 'n' must be a positive integer between 1 and 1000"
            }), 400
        
        # Generate a unique ID for this simulation
        simulation_id = f"sim_{int(time.time())}_{n}"
        
        # Run the simulation
        result = qkd_sim.run_simulation(n)
        
        # Store the result
        simulation_results[simulation_id] = result
        
        # Return the simulation ID and a summary
        return jsonify({
            "simulation_id": simulation_id,
            "n": n,
            "timestamp": result["timestamp"],
            "execution_time": result["execution_time"],
            "message": "Simulation completed successfully"
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred during simulation"
        }), 500

@app.route('/results/<simulation_id>', methods=['GET'])
def get_results(simulation_id):
    try:
        if simulation_id not in simulation_results:
            return jsonify({
                "error": "Simulation not found",
                "message": f"No simulation found with ID: {simulation_id}"
            }), 404
        
        return jsonify(simulation_results[simulation_id])
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while retrieving simulation results"
        }), 500

@app.route('/results/latest', methods=['GET'])
def get_latest_results():
    try:
        if not simulation_results:
            return jsonify({
                "error": "No simulations found",
                "message": "No simulations have been run yet"
            }), 404
        
        # Get the latest simulation ID
        latest_id = max(simulation_results.keys(), key=lambda k: simulation_results[k]["timestamp"])
        
        return jsonify(simulation_results[latest_id])
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while retrieving latest simulation results"
        }), 500

@app.route('/results', methods=['GET'])
def list_results():
    try:
        # Return a list of all simulation IDs and their basic info
        summary = [
            {
                "simulation_id": sim_id,
                "n": result["num_qubits"],
                "timestamp": result["timestamp"],
                "execution_time": result["execution_time"]
            }
            for sim_id, result in simulation_results.items()
        ]
        
        return jsonify({
            "count": len(summary),
            "simulations": summary
        })
    
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An error occurred while listing simulation results"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
