# -*- coding: utf-8 -*-
"""qkd002.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1wcLHN4Ob91gymQBTw-MI8OF82ZlicwNk
"""

!pip install qiskit --quiet

!pip install qiskit qiskit-ibm-runtime

# ⚙️ Install necessary packages
!pip install qiskit qiskit-ibm-runtime seaborn --quiet

from qiskit_ibm_runtime import QiskitRuntimeService

# Paste your token below
QiskitRuntimeService.save_account(channel="ibm_quantum", token="9ec5fcd44b7697e3458d566e068a9a8626482454c9a954bd3d3101c30221264c7e9b6a5119466fb5a627f3002f40924a17320c5129bc4624d21737ca9f4e08c4", overwrite=True)

from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService()

# List all backends you can use
print("✅ Available backends you have access to:\n")
for backend in service.backends():
    print("-", backend.name)

from qiskit import QuantumCircuit, transpile
from qiskit_ibm_runtime import Sampler, QiskitRuntimeService, Session
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.stats import entropy

# 📦 Helper to extract measurement result from sampler
def extract_outcome(result):
    try:
        dist = result.quasi_dists[0]  # Newer Qiskit
    except:
        dist = result.quasi_distribution[0]  # Fallback
    return max(dist, key=dist.get)

# 🔐 BB84 Protocol
def bb84_protocol(n, sampler, backend):
    print("🔐 BB84 Protocol started ✅")
    alice_bits = np.random.randint(2, size=n)
    alice_bases = np.random.randint(2, size=n)
    bob_bases = np.random.randint(2, size=n)
    bob_results = []

    for i in range(n):
        qc = QuantumCircuit(1, 1)
        if alice_bits[i] == 1:
            qc.x(0)
        if alice_bases[i] == 1:
            qc.h(0)
        if bob_bases[i] == 1:
            qc.h(0)
        qc.measure(0, 0)
        qc = transpile(qc, backend)
        result = sampler.run([qc]).result()

        try:
            outcome = extract_outcome(result)
            bob_results.append(int(outcome[-1]))
        except:
            bob_results.append(0)

    sifted_key = [bob_results[i] for i in range(n) if alice_bases[i] == bob_bases[i]]
    return "".join(map(str, sifted_key))

# 🔐 E91 Protocol
def e91_protocol(n, sampler, backend):
    print("🔐 E91 Protocol started ✅")
    alice_angles = [0, np.pi/4]
    bob_angles = [np.pi/4, np.pi/8, -np.pi/8]
    key = []

    for i in range(n):
        theta_a = np.random.choice(alice_angles)
        theta_b = np.random.choice(bob_angles)

        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.ry(2*theta_a, 0)
        qc.ry(2*theta_b, 1)
        qc.measure([0, 1], [0, 1])

        qc = transpile(qc, backend)
        result = sampler.run([qc]).result()

        try:
            outcome = extract_outcome(result)
            key.append("0" if outcome in ["00", "11"] else "1")
        except:
            continue

    return "".join(key)

# 🔐 E92 Protocol
def e92_protocol(n, sampler, backend):
    print("🔐 E92 Protocol started ✅")
    angles = [0, np.pi/4, np.pi/2]
    key = []

    for i in range(n):
        theta = np.random.choice(angles)
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.ry(2*theta, 0)
        qc.measure(0, 0)

        qc = transpile(qc, backend)
        result = sampler.run([qc]).result()

        try:
            outcome = extract_outcome(result)
            key.append(outcome[-1])
        except:
            key.append("0")

    return "".join(key)

# 🔐 Six-State Protocol
def six_state_protocol(n, sampler, backend):
    print("🔐 Six-State Protocol started ✅")
    states = [(0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2)]
    key = []

    for i in range(n):
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
        qc = transpile(qc, backend)
        result = sampler.run([qc]).result()

        try:
            outcome = extract_outcome(result)
            key.append(outcome[-1])
        except:
            key.append("0")

    return "".join(key)

# 📊 Enhanced Visualization
def plot_key_stats(protocol_keys):
    lengths = {k: len(v) for k, v in protocol_keys.items()}

    # 🔹 Plot 1: Bar Chart of Key Lengths
    plt.figure(figsize=(10, 5))
    plt.bar(lengths.keys(), lengths.values(), color='cornflowerblue')
    plt.title("QKD Key Lengths per Protocol")
    plt.xlabel("Protocol")
    plt.ylabel("Key Length (bits)")
    plt.grid(True)
    plt.tight_layout()
    plt.show()

    # 🔹 Plot 2: Bit Distribution per Protocol
    fig, axs = plt.subplots(1, len(protocol_keys), figsize=(14, 4))
    for ax, (protocol, key_bits) in zip(axs, protocol_keys.items()):
        bits = [int(b) for b in key_bits if b in ['0', '1']]
        zeros = bits.count(0)
        ones = bits.count(1)
        ax.bar(['0', '1'], [zeros, ones], color=['steelblue', 'orangered'])
        ax.set_title(f"{protocol} Bit Distribution")
        ax.set_ylabel("Count")
        ax.set_xlabel("Bit")
        ax.grid(True)
    plt.tight_layout()
    plt.show()

    # 🔹 Plot 3: Overall Bit Histogram
    all_bits = ''.join(protocol_keys.values())
    bit_array = np.array([int(b) for b in all_bits if b in ['0', '1']])
    plt.figure(figsize=(10, 4))
    sns.histplot(bit_array, bins=2, kde=False, discrete=True, color='mediumseagreen')
    plt.title("Overall Bit Frequency Across All Protocols")
    plt.xlabel("Bit Value")
    plt.ylabel("Frequency")
    plt.xticks([0, 1])
    plt.grid(True)
    plt.tight_layout()
    plt.show()

    # 🔹 Entropy per protocol
    print("\n🧠 Entropy per Protocol:")
    for protocol, key in protocol_keys.items():
        bits = [int(b) for b in key if b in ['0', '1']]
        counts = np.bincount(bits, minlength=2)
        probs = counts / np.sum(counts)
        ent = entropy(probs, base=2)
        print(f"  • {protocol}: {ent:.4f} bits")

    # 🔐 Display keys
    print("\n🔐 Generated Keys:")
    for k, v in protocol_keys.items():
        print(f"  • {k}: {v}")

# 🚀 Main Run Function
def run_qkd():
    service = QiskitRuntimeService()
    available = [b.name for b in service.backends()]
    print("✅ Available backends you have access to:\n")
    for name in available:
        print(f"- {name}")

    backend = service.backend("ibm_kyiv" if "ibm_kyiv" in available else available[0])
    print(f"\n✅ Using backend: {backend.name}")

    with Session(backend=backend) as session:
        sampler = Sampler()  # Links to active session automatically
        n = 5 # Increase for better analysis

        protocol_keys = {
            'BB84': bb84_protocol(n, sampler, backend),
            'E91': e91_protocol(n, sampler, backend),
            'E92': e92_protocol(n, sampler, backend),
            'Six-State': six_state_protocol(n, sampler, backend),
        }

        plot_key_stats(protocol_keys)

# 🧪 Run the QKD simulation
run_qkd()