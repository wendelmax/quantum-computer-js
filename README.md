# Quantum Computer JS

**An interactive quantum computing simulator library with fully typed TypeScript support.**

> **Note:** This is the core library engine powering the [Quantum Computer Studio](https://github.com/wendelmax/quantum-computer-studio). For the full interactive web application, visit the [Studio UI Repository](https://github.com/wendelmax/quantum-computer-studio) or the [Live Site](https://quantum-computer-studio.vercel.app/).

---

## Installation

Install via npm:

```bash
npm install quantum-computer-js
```

## Features (v2.1.0)

- **Optimized Engine**: Circuit transpiler with gate cancellation and rotation folding.
- **Realistic Simulation**: Advanced Noise Models (Depolarizing, Phase Flip, Amplitude Damping).
- **Gate Decomposition**: Decompose complex gates (SWAP, Toffoli) into hardware-native sets {CNOT, H, T, S}.
- **Advanced Metrics**: State analysis tools including Fidelity, Partial Trace, and Von Neumann Entropy.
- **QNLP Support**: Integrated Quantum Natural Language Processing primitives.
- **OpenQASM 2.0**: Full support for importing and exporting OpenQASM strings.

## Quick Start

The library exposes a complete web-worker powered quantum circuit simulator, gate logic, and math utilities.

```javascript
import { runSimulation } from 'quantum-computer-js';

// 1. Define your circuit
const myCircuit = { 
  numQubits: 2, 
  gates: [
    { type: 'H', target: 0 }, 
    { type: 'CNOT', target: 1, control: 0 }
  ] 
};

// 2. Run the simulation
async function main() {
  const result = await runSimulation(myCircuit, { optimize: true });
  
  // 3. Output the results
  console.log('Probabilities:', result.probabilities);
}

main();
```

## OpenQASM 2.0 Support

Integrate seamlessly with the academic quantum ecosystem (like IBM Qiskit) by importing and exporting OpenQASM string formats.

```javascript
import { parseQASM, circuitToQASM } from 'quantum-computer-js';

const qasmString = `
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
`;

const circuit = parseQASM(qasmString);
const exportedQasm = circuitToQASM(circuit);
```

## Available Exports

- **Simulator**: `runSimulation(Circuit, SimulatorOptions)`, `clearCache()`
- **Transpiler**: `optimizeCircuit(Circuit)`, `decomposeCircuit(Circuit)`
- **Metrics**: `QuantumMetrics` (Fidelity, Entropy, PartialTrace)
- **QNLP**: `QNLPService` (Phrase parsing and sentiment analysis)
- **Math/Complex**: `C`, `add`, `sub`, `mul`, `scale`, `conj`, `norm2`
- **Bloch Sphere**: `stateToBloch`, `toBlochPoint`
- **OpenQASM**: `parseQASM`, `circuitToQASM`

## Links

- **Main Engine**: [GitHub](https://github.com/wendelmax/quantum-computer-js)
- **Studio UI**: [GitHub](https://github.com/wendelmax/quantum-computer-studio)
- **Live Web App**: [quantum-computer-studio.vercel.app](https://quantum-computer-studio.vercel.app/)
- **License**: MIT
