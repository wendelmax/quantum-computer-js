import type { Circuit, CircuitGate } from '../types/Circuit'

/**
 * Decomposes high-level gates into a universal gate set {CNOT, H, T, T†, S, S†, X, Y, Z}.
 */
export function decomposeCircuit(circuit: Circuit): Circuit {
    const decomposedGates: CircuitGate[] = []

    for (const gate of circuit.gates) {
        if (gate.type === 'SWAP') {
            decomposedGates.push(...decomposeSWAP(gate.target, gate.target2!))
        } else if (gate.type === 'Toffoli') {
            decomposedGates.push(...decomposeToffoli(gate.control!, gate.control2!, gate.target))
        } else {
            decomposedGates.push(gate)
        }
    }

    return {
        ...circuit,
        gates: decomposedGates
    }
}

/**
 * SWAP(a, b) = CNOT(a, b) + CNOT(b, a) + CNOT(a, b)
 */
function decomposeSWAP(q1: number, q2: number): CircuitGate[] {
    return [
        { type: 'CNOT', control: q1, target: q2 },
        { type: 'CNOT', control: q2, target: q1 },
        { type: 'CNOT', control: q1, target: q2 }
    ]
}

/**
 * Toffoli(c1, c2, t) decomposition using 6 CNOTs and several one-qubit gates.
 * This is a standard decomposition from Nielsen & Chuang.
 */
function decomposeToffoli(c1: number, c2: number, t: number): CircuitGate[] {
    return [
        { type: 'H', target: t },
        { type: 'CNOT', control: c2, target: t },
        { type: 'T_DAG', target: t }, // T dagger
        { type: 'CNOT', control: c1, target: t },
        { type: 'T', target: t },
        { type: 'CNOT', control: c2, target: t },
        { type: 'T_DAG', target: t },
        { type: 'CNOT', control: c1, target: t },
        { type: 'T', target: c2 },
        { type: 'T', target: t },
        { type: 'CNOT', control: c1, target: c2 },
        { type: 'H', target: t },
        { type: 'T', target: c1 },
        { type: 'T_DAG', target: c2 },
        { type: 'CNOT', control: c1, target: c2 }
    ]
}
