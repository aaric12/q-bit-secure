import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from scipy.stats import entropy

# ⚙️ Backend simulator
backend = AerSimulator()

#  Helper to extract measurement result
def extract_outcome(counts):
    return max(counts, key=counts.get)

#  BB84 Protocol
def bb84_protocol(n, backend):
    print(" BB84 Protocol started ✅")
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
        transpiled = transpile(qc, backend)
        result = backend.run(transpiled, shots=1).result()
        counts = result.get_counts()
        bob_results.append(int(extract_outcome(counts)[-1]))

    sifted_key = [bob_results[i] for i in range(n) if alice_bases[i] == bob_bases[i]]
    return "".join(map(str, sifted_key))

#  E91 Protocol
def e91_protocol(n, backend):
    print(" E91 Protocol started ✅")
    alice_angles = [0, np.pi/4]
    bob_angles = [np.pi/4, np.pi/8, -np.pi/8]
    key = []

    for _ in range(n):
        theta_a = np.random.choice(alice_angles)
        theta_b = np.random.choice(bob_angles)

        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.ry(2 * theta_a, 0)
        qc.ry(2 * theta_b, 1)
        qc.measure([0, 1], [0, 1])

        transpiled = transpile(qc, backend)
        result = backend.run(transpiled, shots=1).result()
        counts = result.get_counts()

        try:
            outcome = extract_outcome(counts)
            key.append("0" if outcome in ["00", "11"] else "1")
        except:
            continue

    return "".join(key)

#  E92 Protocol
def e92_protocol(n, backend):
    print(" E92 Protocol started ✅")
    angles = [0, np.pi/4, np.pi/2]
    key = []

    for _ in range(n):
        theta = np.random.choice(angles)
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.ry(2 * theta, 0)
        qc.measure(0, 0)

        transpiled = transpile(qc, backend)
        result = backend.run(transpiled, shots=1).result()
        counts = result.get_counts()

        try:
            outcome = extract_outcome(counts)
            key.append(outcome[-1])
        except:
            key.append("0")

    return "".join(key)

#  Six-State Protocol
def six_state_protocol(n, backend):
    print(" Six-State Protocol started ✅")
    states = [(0, 0), (1, 0), (0, 1), (1, 1), (0, 2), (1, 2)]
    key = []

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
        transpiled = transpile(qc, backend)
        result = backend.run(transpiled, shots=1).result()
        counts = result.get_counts()

        try:
            outcome = extract_outcome(counts)
            key.append(outcome[-1])
        except:
            key.append("0")

    return "".join(key)

#  Enhanced Visualization
def plot_key_stats(protocol_keys):
    lengths = {k: len(v) for k, v in protocol_keys.items()}

    #  Bar Chart
    plt.figure(figsize=(10, 5))
    plt.bar(lengths.keys(), lengths.values(), color='cornflowerblue')
    plt.title("QKD Key Lengths per Protocol")
    plt.xlabel("Protocol")
    plt.ylabel("Key Length (bits)")
    plt.grid(True)
    plt.tight_layout()
    plt.show()

    #  Bit Distribution
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

    #  Overall Histogram
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

    #  Entropy
    print("\n🧠 Entropy per Protocol:")
    for protocol, key in protocol_keys.items():
        bits = [int(b) for b in key if b in ['0', '1']]
        counts = np.bincount(bits, minlength=2)
        probs = counts / np.sum(counts) if np.sum(counts) > 0 else [0.5, 0.5]
        ent = entropy(probs, base=2)
        print(f"  • {protocol}: {ent:.4f} bits")

    #  Show Keys
    print("\n🔐 Generated Keys:")
    for k, v in protocol_keys.items():
        print(f"  • {k}: {v}")

#  Main Execution
def run_qkd():
    n = 100 # can increase this for more analysis
    protocol_keys = {
        'BB84': bb84_protocol(n, backend),
        'E91': e91_protocol(n, backend),
        'E92': e92_protocol(n, backend),
        'Six-State': six_state_protocol(n, backend),
    }
    plot_key_stats(protocol_keys)

# Run the QKD simulation
run_qkd()

