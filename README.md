# Quantum Computer JS

**An interactive quantum computing simulator library with fully typed TypeScript support.**

> **Note:** This is the library-only distribution for [Quantum Computer JS](https://github.com/wendelmax/quantum-computer-js). For the full interactive web application, visual circuit studio, and comprehensive tutorials, please visit the [Main Repository](https://github.com/wendelmax/quantum-computer-js) or the [Live Web App](https://quantum-computer-js.vercel.app).

---

## Installation

Install via npm:

```bash
npm install quantum-computer-js
```

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
  const result = await runSimulation(myCircuit);
  
  // 3. Output the results
  console.log('Probabilities:', result.probabilities);
  // Example output: { '00': 0.499, '01': 0, '10': 0, '11': 0.499 }
}

main();
```

## OpenQASM 2.0 Support

Integrate seamlessly with the academic quantum ecosystem (like IBM Qiskit) by importing and exporting OpenQASM string formats.

```javascript
import { parseQASM, circuitToQASM } from 'quantum-computer-js';

// Parse OpenQASM into the QuantumComputerJS Circuit object
const qasmString = `
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];
`;

const circuit = parseQASM(qasmString);

// Convert Circuit object back to OpenQASM
const exportedQasm = circuitToQASM(circuit);
```

## Circuit Interface

A circuit is a simple object containing the number of qubits and an array of sequential gates.

```typescript
type Circuit = {
  numQubits: number
  gates: Gate[]
  initialStates?: Record<number, '0' | '1'>
}

type Gate = {
  type: string      // 'H', 'X', 'Y', 'Z', 'CNOT', 'RX', 'RY', 'RZ', 'SWAP', 'Toffoli'
  target: number    // Target qubit index
  control?: number  // Control qubit (for CNOT/Toffoli)
  control2?: number // Second control (for Toffoli)
  target2?: number  // Second target (for SWAP)
  angle?: number    // Angle in radians (for RZ, RY, RX rotations)
}
```

## Available Exports

The package exports out-of-the-box functions for standard quantum logic without requiring react or the studio UI:
- **Simulator**: `runSimulation(Circuit, SimulatorOptions)`, `clearCache()`
- **Math/Complex**: `C`, `add`, `sub`, `mul`, `scale`, `conj`, `norm2`
- **Bloch Sphere**: `stateToBloch`, `toBlochPoint`
- **OpenQASM**: `parseQASM`, `circuitToQASM`
- **Utilities**: `validateCircuit`, `circuitDepth`

And full TypeScript definitions!

## Links

- **Full Documentation & UI**: [GitHub Repository](https://github.com/wendelmax/quantum-computer-js)
- **Interactive Web Simulator**: [quantum-computer-js.vercel.app](https://quantum-computer-js.vercel.app)
- **License**: MIT
