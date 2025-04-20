import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.visualization import plot_histogram
import matplotlib.pyplot as plt
import io
import base64
from datetime import datetime, timedelta
import random
import json

class EavesdroppingDetector:
    def __init__(self):
        self.backend = AerSimulator()
        self.anomaly_history = []
        self.generate_sample_history()
    
    def generate_sample_history(self):
        # Generate sample anomaly history for demonstration
        now = datetime.now()
        for i in range(30):
            date = now - timedelta(days=i)
            # Random QBER between 0 and 0.3
            qber = random.uniform(0, 0.3)
            # Higher probability of anomaly in certain days
            is_anomaly = qber > 0.15 or (i % 7 == 0 and random.random() > 0.7)
            
            self.anomaly_history.append({
                "date": date.strftime("%Y-%m-%d"),
                "qber": qber,
                "is_anomaly": is_anomaly,
                "confidence": min(qber * 6.67, 1.0) if qber > 0.15 else 0.0,
                "affected_qubits": random.randint(1, 5) if is_anomaly else 0,
                "protocol": random.choice(["BB84", "E91", "Six-State"]),
                "severity": "High" if qber > 0.25 else "Medium" if qber > 0.15 else "Low"
            })
    
    def detect_eavesdropping(self, num_qubits=5, num_bits=100):
        # Create a BB84-like circuit
        alice_bits = np.random.randint(2, size=num_bits)
        alice_bases = np.random.randint(2, size=num_bits)
        bob_bases = np.random.randint(2, size=num_bits)
        
        # Simulate eavesdropping with some probability
        eve_present = random.random() > 0.7
        eve_strategy = random.choice(["intercept-resend", "entanglement", "trojan"])
        
        # Run quantum circuits
        circuits = []
        for i in range(num_bits):
            qc = QuantumCircuit(num_qubits, num_qubits)
            
            # Prepare qubits based on Alice's bits and bases
            for q in range(num_qubits):
                if alice_bits[i] == 1:
                    qc.x(q)
                if alice_bases[i] == 1:
                    qc.h(q)
            
            # Eve's intervention
            if eve_present:
                if eve_strategy == "intercept-resend":
                    # Intercept-resend attack
                    for q in range(num_qubits):
                        qc.measure(q, q)
                        qc.reset(q)
                        if random.random() > 0.5:
                            qc.x(q)
                        if random.random() > 0.5:
                            qc.h(q)
                elif eve_strategy == "entanglement":
                    # Entanglement-based attack (simplified)
                    for q in range(num_qubits-1):
                        qc.cx(q, q+1)
                else:
                    # Trojan horse attack (simplified)
                    for q in range(num_qubits):
                        if random.random() > 0.7:
                            qc.z(q)
            
            # Bob's measurement
            for q in range(num_qubits):
                if bob_bases[i] == 1:
                    qc.h(q)
                qc.measure(q, q)
            
            circuits.append(qc)
        
        # Run the circuits
        transpiled = transpile(circuits, self.backend)
        results = self.backend.run(transpiled, shots=1).result()
        
        # Process results
        error_rates = []
        for i in range(min(10, num_bits)):  # Process a subset for visualization
            counts = results.get_counts(i)
            # Generate histogram plot
            fig = plt.figure(figsize=(5, 4))
            plot_histogram(counts, title=f"Qubit Distribution - Round {i+1}")
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            plt.close(fig)
            buf.seek(0)
            plot_data = base64.b64encode(buf.read()).decode('utf-8')
            
            # Calculate error rate for this round
            expected = bin(alice_bits[i])[2:].zfill(num_qubits)
            actual = max(counts, key=counts.get)
            errors = sum(e != a for e, a in zip(expected, actual))
            error_rate = errors / num_qubits
            error_rates.append(error_rate)
        
        # Overall QBER
        qber = sum(error_rates) / len(error_rates) if error_rates else 0
        
        # Determine if eavesdropping is detected
        eavesdropping_detected = qber > 0.15 or (eve_present and random.random() > 0.3)
        confidence = min(qber * 6.67, 1.0) if qber > 0.15 else 0.0
        
        # Add to history
        self.anomaly_history.insert(0, {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "qber": qber,
            "is_anomaly": eavesdropping_detected,
            "confidence": confidence,
            "affected_qubits": random.randint(1, num_qubits) if eavesdropping_detected else 0,
            "protocol": "BB84",
            "severity": "High" if qber > 0.25 else "Medium" if qber > 0.15 else "Low"
        })
        
        # Keep only the last 30 days
        self.anomaly_history = self.anomaly_history[:30]
        
        return {
            "eavesdropping_detected": eavesdropping_detected,
            "qber": qber,
            "confidence": confidence,
            "eve_strategy": eve_strategy if eve_present and eavesdropping_detected else "None",
            "affected_qubits": random.randint(1, num_qubits) if eavesdropping_detected else 0,
            "error_rates": error_rates,
            "plots": [plot_data for _ in range(min(5, num_bits))],  # Include only first 5 plots
            "timestamp": datetime.now().isoformat()
        }
    
    def get_anomaly_timeline(self):
        return {
            "anomalies": self.anomaly_history,
            "total_anomalies": sum(1 for entry in self.anomaly_history if entry["is_anomaly"]),
            "average_qber": sum(entry["qber"] for entry in self.anomaly_history) / len(self.anomaly_history),
            "last_updated": datetime.now().isoformat()
        }
    
    def detect_anomalies_with_ibm(self, backend_name, api_token=None):
        # Simulate IBM Quantum execution
        # In a real implementation, this would use the IBM Quantum API
        
        # Generate random results for demonstration
        anomaly_types = ["bit-flip", "phase-flip", "depolarizing", "amplitude-damping"]
        detected_anomalies = []
        
        for _ in range(random.randint(0, 3)):
            anomaly_type = random.choice(anomaly_types)
            affected_qubits = [random.randint(0, 4) for _ in range(random.randint(1, 3))]
            severity = random.uniform(0.1, 0.9)
            
            detected_anomalies.append({
                "type": anomaly_type,
                "affected_qubits": affected_qubits,
                "severity": severity,
                "description": f"{anomaly_type.capitalize()} noise detected on qubit(s) {', '.join(map(str, affected_qubits))}",
                "recommendation": "Adjust error correction parameters" if severity < 0.5 else "Switch to a different quantum channel"
            })
        
        return {
            "backend": backend_name,
            "anomalies_detected": len(detected_anomalies) > 0,
            "anomalies": detected_anomalies,
            "overall_channel_quality": random.uniform(0.5, 1.0),
            "timestamp": datetime.now().isoformat()
        }
