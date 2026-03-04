import type { Circuit, CircuitGate } from '../types/Circuit'

/**
 * Optimizes a quantum circuit by removing redundant gates and merging rotations.
 */
export function optimizeCircuit(circuit: Circuit): Circuit {
    let gates = [...circuit.gates]
    let optimized = true

    // Loop until no more optimizations can be made
    while (optimized) {
        const prevCount = gates.length
        gates = cancelRedundantGates(gates)
        gates = foldRotations(gates)
        optimized = gates.length < prevCount
    }

    return {
        ...circuit,
        gates
    }
}

/**
 * Removes consecutive gates that cancel each other out (e.g., H followed by H).
 */
function cancelRedundantGates(gates: CircuitGate[]): CircuitGate[] {
    const result: CircuitGate[] = []

    for (const gate of gates) {
        if (result.length === 0) {
            result.push(gate)
            continue
        }

        const last = result[result.length - 1]

        // Check if gates are on the same target and have the same type
        // This simple version only cancels identical gates that are involutionary (G*G = I)
        const involutionaryGates = ['H', 'X', 'Y', 'Z', 'CNOT', 'SWAP']

        if (
            involutionaryGates.includes(gate.type) &&
            gate.type === last.type &&
            gate.target === last.target &&
            gate.control === last.control &&
            gate.control2 === last.control2 &&
            gate.target2 === last.target2 &&
            gate.angle === last.angle
        ) {
            result.pop() // Cancel out
        } else {
            result.push(gate)
        }
    }

    return result
}

/**
 * Merges consecutive rotations of the same type on the same qubit.
 */
function foldRotations(gates: CircuitGate[]): CircuitGate[] {
    const result: CircuitGate[] = []
    const rotationalGates = ['RX', 'RY', 'RZ']

    for (const gate of gates) {
        if (result.length === 0) {
            result.push(gate)
            continue
        }

        const last = result[result.length - 1]

        if (
            rotationalGates.includes(gate.type) &&
            gate.type === last.type &&
            gate.target === last.target &&
            gate.angle !== undefined &&
            last.angle !== undefined
        ) {
            // Merge rotations: R(a) * R(b) = R(a + b)
            const newAngle = (last.angle + gate.angle) % (2 * Math.PI)

            // If the new angle is approximately zero, remove the gate
            if (Math.abs(newAngle) < 1e-10) {
                result.pop()
            } else {
                result[result.length - 1] = { ...last, angle: newAngle }
            }
        } else {
            result.push(gate)
        }
    }

    return result
}
