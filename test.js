import { parseQASM, circuitToQASM, runSimulation } from './dist/index.es.js';

async function run() {
    console.log('--- Testing quantum-computer-js standalone library ---');

    const qasm = `
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];
`;

    console.log('1. Parsing OpenQASM...');
    const circuit = parseQASM(qasm);
    console.log('Parsed Circuit:', JSON.stringify(circuit, null, 2));

    console.log('\n2. Compiling back to OpenQASM...');
    const compiled = circuitToQASM(circuit);
    console.log(compiled);

    console.log('\n3. Running Simulation Worker...');
    const result = await runSimulation(circuit);
    console.log('Probabilities:', result.probabilities);

    if (result.probabilities['00'] > 0.4 && result.probabilities['11'] > 0.4) {
        console.log('✅ Simulation Success: Bell state achieved.');
    } else {
        console.error('❌ Simulation Failed: Unexpected probabilities.');
        process.exit(1);
    }
}

run().catch(console.error);
