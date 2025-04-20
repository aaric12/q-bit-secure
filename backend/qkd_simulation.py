import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from scipy.stats import entropy
import json
import time
from datetime import datetime

class QKDSimulation:
    def __init__(self):
        # Initialize the backend simulator
        self.backend = AerSimulator()
    
    def extract_outcome(self, counts):
        return max(counts, key=counts.get)
    
    # BB84 Protocol
    def bb84_protocol(self, n, backend=None):
        if backend is None:
            backend = self.backend
            
        alice_bits = np.random.randint(2, size=n)
        alice_bases = np.random.randint(2, size=n)
        bob_bases = np.random.randint(2, size=n)
        bob_results = []
        
        circuits = []
        for i in range(n):
            qc = QuantumCircuit(1, 1)
            if alice_bits[i] == 1:
                qc.x(0)
            if alice_bases[i] == 1:
                qc.h(0)
            if bob_bases[i] == 1:
                qc.h(0)
            qc.measure(0, 0)
            circuits.append(qc)
        
        transpiled = transpile(circuits, backend)
        results = backend.run(transpiled, shots=1).result()
        
        for i in range(n):
            counts = results.get_counts(i)
            bob_results.append(int(self.extract_outcome(counts)[-1]))
        
        sifted_indices = [i for i in range(n) if alice_bases[i] == bob_bases[i]]
        sifted_key = [bob_results[i] for i in sifted_indices]
        alice_sifted = [alice_bits[i] for i in sifted_indices]
        
        return {
            "key": "".join(map(str, sifted_key)),
            "alice_key": alice_sifted,
            "bob_key": sifted_key,
            "alice_bases": alice_bases.tolist(),
            "bob_bases": bob_bases.tolist(),
            "sifted_indices": sifted_indices
        }
    
    # E91 Protocol
    def e91_protocol(self, n, backend=None):
        if backend is None:
            backend = self.backend
            
        alice_angles = [0, np.pi / 4]
        bob_angles = [np.pi / 4, np.pi / 8, -np.pi / 8]
        key = []
        
        circuits = []
        for _ in range(n):
            theta_a = np.random.choice(alice_angles)
            theta_b = np.random.choice(bob_angles)
            
            qc = QuantumCircuit(2, 2)
            qc.h(0)
            qc.cx(0, 1)
            qc.ry(2 * theta_a, 0)
            qc.ry(2 * theta_b, 1)
            qc.measure([0, 1], [0, 1])
            circuits.append(qc)
        
        transpiled = transpile(circuits, backend)
        results = backend.run(transpiled, shots=1).result()
        
        for i in range(n):
            try:
                counts = results.get_counts(i)
                outcome = self.extract_outcome(counts)
                key.append("0" if outcome in ["00", "11"] else "1")
            except:
                continue
        
        return {
            "key": "".join(key)
        }
    
    # E92 Protocol
    def e92_protocol(self, n, backend=None):
        if backend is None:
            backend = self.backend
            
        angles = [0, np.pi / 4, np.pi / 2]
        key = []
        
        circuits = []
        for _ in range(n):
            theta = np.random.choice(angles)
            qc = QuantumCircuit(1, 1)
            qc.h(0)
            qc.ry(2 * theta, 0)
            qc.measure(0, 0)
            circuits.append(qc)
        
        transpiled = transpile(circuits, backend)
        results = backend.run(transpiled, shots=1).result()
        
        for i in range(n):
            try:
                counts = results.get_counts(i)
                outcome = self.extract_outcome(counts)
                key.append(outcome[-1])
            except:
                key.append("0")
        
        return {
            "key": "".join(key)
        }
    
    # Six-State Protocol
    def six_state_protocol(self, n, backend=None):
        if backend is None:
            backend = self.backend
            
        states = [(0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2)]
        key = []
        
        circuits = []
        for _ in range(n):
            bit, basis = states[np.random.randint(6)]
            qc = QuantumCircuit(1, 1)
            if bit == 1:
                qc.x(0)
            if basis == 1:
                qc.h(0)
            elif basis == 2:
                qc.sdg(0)
                qc.h(0)
            
            bob_basis = np.random.randint(3)
            if bob_basis == 1:
                qc.h(0)
            elif bob_basis == 2:
                qc.h(0)
                qc.s(0)
            
            qc.measure(0, 0)
            circuits.append(qc)
        
        transpiled = transpile(circuits, backend)
        results = backend.run(transpiled, shots=1).result()
        
        for i in range(n):
            try:
                counts = results.get_counts(i)
                outcome = self.extract_outcome(counts)
                key.append(outcome[-1])
            except:
                key.append("0")
        
        return {
            "key": "".join(key)
        }
    
    # Entropy calculator
    def calculate_entropy(self, bitstring):
        bits = [int(b) for b in bitstring if b in ['0', '1']]
        counts = np.bincount(bits, minlength=2)
        probs = counts / np.sum(counts) if np.sum(counts) > 0 else [0.5, 0.5]
        return entropy(probs, base=2)
    
    # QBER for BB84
    def calculate_qber(self, alice_key, bob_key):
        if not alice_key or not bob_key:
            return 0.0
        errors = sum(a != b for a, b in zip(alice_key, bob_key))
        return errors / len(alice_key)
    
    # Full QKD simulation
    def run_simulation(self, n=100):
        start_time = time.time()
        
        bb84 = self.bb84_protocol(n)
        e91 = self.e91_protocol(n)
        e92 = self.e92_protocol(n)
        six = self.six_state_protocol(n)
        
        protocol_keys = {
            "BB84": bb84["key"],
            "E91": e91["key"],
            "E92": e92["key"],
            "Six-State": six["key"]
        }
        
        entropy_stats = {
            protocol: float(self.calculate_entropy(key))
            for protocol, key in protocol_keys.items()
        }
        
        qber = self.calculate_qber(bb84["alice_key"], bb84["bob_key"])
        
        execution_time = time.time() - start_time
        
        return {
            "keys": protocol_keys,
            "entropy": entropy_stats,
            "qber": float(qber),
            "execution_time": execution_time,
            "timestamp": datetime.now().isoformat(),
            "num_qubits": n,
            "key_lengths": {
                protocol: len(key) for protocol, key in protocol_keys.items()
            },
            "bb84_details": {
                "alice_key": bb84["alice_key"],
                "bob_key": bb84["bob_key"],
                "sifted_indices": bb84["sifted_indices"],
                "total_bits": n,
                "sifted_bits": len(bb84["sifted_indices"])
            }
        }
