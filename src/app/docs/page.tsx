import React, { useState } from 'react'
import SidebarDocs from './components/SidebarDocs'
import MarkdownViewer from './components/MarkdownViewer'

type DocContent = {
  [key: string]: string
}

const docContents: DocContent = {
  'Getting Started': `# Getting Started with Quantum Computer JS

## Welcome

Quantum Computer JS is a quantum computing simulator and visualizer built with React and TypeScript.

## Features

- **Quantum Studio**: Build and visualize quantum circuits interactively
- **Algorithms Library**: Run and compare quantum algorithms
- **State Visualization**: View probability distributions and state vectors
- **Gates Library**: Reference for all available quantum gates
- **Data Lab**: Map classical data to quantum states
- **Oracles**: Test and understand quantum oracles

## Quick Start

1. Navigate to **Quantum Studio** to start building circuits
2. Select gates from the panel and place them on the canvas
3. Click **Run** to simulate the circuit
4. View results in the state viewer

## Building Your First Circuit

1. Go to **Circuits** page
2. Select a gate from the Gate Panel
3. Click on the circuit canvas to place it
4. Adjust parameters for rotation gates
5. Click Run to see results

## Understanding Results

- **Probabilities**: Shows the likelihood of measuring each basis state
- **State Vector**: Shows the complex amplitudes of each state
- **Histogram**: Visual representation of measurement probabilities`,
  
  'QASM': `# Quantum Assembly Language (QASM)

## Introduction

QASM is a low-level language for describing quantum circuits. While this simulator doesn't support full QASM yet, here are the equivalent gate operations:

## Basic Syntax

\`\`\`
# Single qubit gates
H q[0];      # Hadamard
X q[0];      # Pauli-X
Y q[0];      # Pauli-Y
Z q[0];      # Pauli-Z

# Rotation gates
RX(pi/2) q[0];    # Rotation X-axis
RY(pi/4) q[1];    # Rotation Y-axis
RZ(pi) q[2];      # Rotation Z-axis

# Two-qubit gates
CNOT q[0], q[1];  # Controlled NOT
\`\`\`

## Circuit Building

In this simulator, you build circuits visually:
1. Gates are placed on a grid
2. Each row represents a qubit
3. Columns represent time steps
4. CNOT gates show control-target connections

## Examples

### Bell State
\`\`\`
H q[0]
CNOT q[0], q[1]
\`\`\`

### Superposition
\`\`\`
H q[0]
\`\`\`

### Grover's Algorithm (2 qubits)
\`\`\`
H q[0]
H q[1]
CNOT q[0], q[1]
H q[0]
H q[1]
\`\`\``,

  'API': `# Quantum Computer JS API

## Interactive API Terminal

**NEW**: Try the interactive API terminal at [/api](/api)

The API terminal provides a REPL environment where you can programmatically work with quantum circuits using our core engine.

### Features

- **Interactive Console**: Write and execute code in real-time
- **Examples**: Pre-loaded circuit examples
- **Live Feedback**: See results instantly
- **Full API Access**: All core functions available

### Quick Start

1. Navigate to **API** page
2. Try an example from the sidebar
3. Modify the circuit code
4. Click **Execute**
5. View results

### What You Can Do

- Create quantum circuits
- Run simulations
- Access all gate operations
- Build custom algorithms
- Experiment with angles and parameters

> **Note**: For complete API documentation, visit the [/api](/api) page with the interactive terminal.`,

  'Algorithms': `# Quantum Algorithms

## Grover's Algorithm

**Purpose**: Search in unstructured database

**Complexity**: O(√N) for N items

**Steps**:
1. Initialize superpositions
2. Apply oracle (mark solution)
3. Apply diffusion operator
4. Repeat √N times

**Example**:
\`\`\`
H q[0]
H q[1]
CNOT q[0], q[1]  # Oracle
H q[0]
H q[1]           # Diffusion
\`\`\`

## Deutsch–Jozsa Algorithm

**Purpose**: Determine if function is constant or balanced

**Steps**:
1. Initialize target in |1⟩, apply H
2. Apply H to control
3. Apply oracle
4. Apply H to control
5. Measure control

**Result**: |0⟩ means constant, |1⟩ means balanced

## Quantum Fourier Transform (QFT)

**Purpose**: Frequency analysis

**Steps**:
1. Apply H to first qubit
2. Apply controlled rotations
3. Apply H to second qubit
4. Continue for all qubits

## Shor's Algorithm

**Purpose**: Factor integers

**Steps**:
1. Random co-prime selection
2. Period finding with QFT
3. Classical post-processing

## Quantum Phase Estimation

**Purpose**: Estimate eigenvalue of unitary

**Steps**:
1. Prepare superposition
2. Apply controlled powers of U
3. Apply inverse QFT
4. Measure to get phase`,
  
  'Best Practices': `# Best Practices

## Circuit Design

1. **Start Simple**: Begin with 1-2 qubits
2. **Use Named Gates**: Clearly label your operations
3. **Verify Incrementally**: Check results after each gate
4. **Optimize Depth**: Minimize circuit depth for efficiency

## Simulation

1. **Use Workers**: Offload heavy computation
2. **Cache Results**: Store computed states
3. **Limit Qubits**: Exponential complexity growth
4. **Batch Operations**: Group multiple runs

## Performance

- **< 10 qubits**: Real-time simulation
- **10-15 qubits**: Slower but feasible
- **> 15 qubits**: Consider approximate methods

## Common Patterns

### Bell State
\`\`\`
H → CNOT
\`\`\`

### GHZ State
\`\`\`
H → CNOT → CNOT
\`\`\`

### Quantum Teleportation
\`\`\`
Bell state prep → Measurement → Correction
\`\`\``,
  
  'Project Information': `# Project Information

## Repository

**GitHub**: [github.com/wendelmax/quantum-computer-js](https://github.com/wendelmax/quantum-computer-js)

## Author

**wendelmax**

## Version

**2.0.0**

## License

**MIT License**

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Links

- **Live Demo**: [quantum-computer-js.vercel.app](https://quantum-computer-ogt2c3gcg-wendelmaxs-projects.vercel.app)
- **Repository**: [GitHub](https://github.com/wendelmax/quantum-computer-js)
- **Issues**: [Report Issues](https://github.com/wendelmax/quantum-computer-js/issues)

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Web Workers`,
  
  'Troubleshooting': `# Troubleshooting

## Common Issues

### Circuit Not Running

**Problem**: Clicking Run does nothing

**Solutions**:
- Check that gates are placed correctly
- Verify qubit indices are valid
- Look for console errors
- Try refreshing the page

### Incorrect Results

**Problem**: Simulation gives unexpected probabilities

**Solutions**:
- Verify gate placement
- Check rotation angles
- Ensure proper initialization
- Review circuit logic

### Performance Issues

**Problem**: Slow simulation

**Solutions**:
- Reduce number of qubits
- Simplify circuit depth
- Clear browser cache
- Check worker availability

## Debug Tips

1. **Check State Vectors**: View amplitudes
2. **Verify Probabilities**: Sum should be 1.0
3. **Test Components**: Run gates individually
4. **Use Visualization**: Check Bloch sphere

## Getting Help

- Check console for errors
- Review circuit diagram
- Verify gate parameters
- Test with simple circuits
- Consult documentation`
}

export default function DocsPage() {
  const [selected, setSelected] = useState('Getting Started')
  
  const docItems = [
    'Getting Started',
    'Algorithms',
    'QASM',
    'API',
    'Best Practices',
    'Troubleshooting',
    'Project Information'
  ]
  
  const content = docContents[selected] || '# Documentation\n\nSelect a topic from the sidebar.'

  return (
    <div className="p-6 grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <SidebarDocs items={docItems} onSelect={setSelected} />
      </div>
      <div className="col-span-9">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">{selected}</h2>
          {selected === 'API' && (
            <div className="mt-2 p-3 bg-sky-900/20 border border-sky-700 rounded">
              <div className="text-sm text-sky-300">
                <strong>Interactive API Available</strong>: Try the interactive terminal at{' '}
                <a href="/api" className="underline hover:text-sky-200">/api</a>
              </div>
            </div>
          )}
        </div>
        <MarkdownViewer content={content} />
      </div>
    </div>
  )
}
