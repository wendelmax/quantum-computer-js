import type { Circuit, CircuitGate } from '../types/Circuit'

/**
 * Converts a Circuit object into an OpenQASM 2.0 strictly valid string.
 */
export function circuitToQASM(circuit: Circuit): string {
    const n = circuit.numQubits
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n'

    qasm += `qreg q[${n}];\n`
    qasm += `creg c[${n}];\n\n`

    if (circuit.initialStates) {
        for (const [q, state] of Object.entries(circuit.initialStates)) {
            if (state === '1') {
                qasm += `x q[${q}];\n`
            }
        }
    }

    for (const gate of circuit.gates) {
        const tStr = `q[${gate.target}]`
        const cStr = gate.control != null ? `q[${gate.control}]` : ''
        const c2Str = gate.control2 != null ? `q[${gate.control2}]` : ''
        const t2Str = gate.target2 != null ? `q[${gate.target2}]` : ''

        const angleStr = gate.angle != null ? `(${gate.angle.toPrecision(6)})` : ''

        switch (gate.type) {
            case 'H': qasm += `h ${tStr};\n`; break;
            case 'X': qasm += `x ${tStr};\n`; break;
            case 'Y': qasm += `y ${tStr};\n`; break;
            case 'Z': qasm += `z ${tStr};\n`; break;
            case 'S': qasm += `s ${tStr};\n`; break;
            case 'T': qasm += `t ${tStr};\n`; break;
            case 'RX': qasm += `rx${angleStr} ${tStr};\n`; break;
            case 'RY': qasm += `ry${angleStr} ${tStr};\n`; break;
            case 'RZ': qasm += `rz${angleStr} ${tStr};\n`; break;
            case 'CNOT': qasm += `cx ${cStr},${tStr};\n`; break;
            case 'SWAP': qasm += `swap ${tStr},${t2Str};\n`; break;
            case 'Toffoli': qasm += `ccx ${cStr},${c2Str},${tStr};\n`; break;
            case 'M':
            case 'MEASURE':
                qasm += `measure ${tStr} -> c[${gate.target}];\n`;
                break;
            default:
                // Ignore custom or unknown gates
                qasm += `// ignored unknown gate: ${gate.type}\n`
        }
    }

    return qasm
}

/**
 * Parses an OpenQASM 2.0 string into a Circuit object.
 * Note: Features a fundamental parsing (h, x, y, z, cx, rx, ry, rz, measure, etc.)
 */
export function parseQASM(qasm: string): Circuit {
    const lines = qasm.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'))
    const circuit: Circuit = { numQubits: 1, gates: [] }

    // Basic Regex matchers
    const qregRegex = /qreg\s+[a-zA-Z0-9_]+\s*\[\s*(\d+)\s*\]\s*;/
    const gateRegex = /^([a-z]+)(?:\(([^)]+)\))?\s+([^;]+);/

    for (const line of lines) {
        const qregMatch = line.match(qregRegex)
        if (qregMatch) {
            circuit.numQubits = Math.max(circuit.numQubits, parseInt(qregMatch[1], 10))
            continue
        }

        const gateMatch = line.match(gateRegex)
        if (!gateMatch) continue

        const gateName = gateMatch[1].toLowerCase()
        if (['openqasm', 'include', 'qreg', 'creg'].includes(gateName)) continue

        const paramStr = gateMatch[2]
        const argsStr = gateMatch[3].replace(/\s/g, '') // e.g. "q[0],q[1]"
        const argsRegex = /\[(\d+)\]/g
        const targets: number[] = []
        let tMatch
        while ((tMatch = argsRegex.exec(argsStr)) !== null) {
            targets.push(parseInt(tMatch[1], 10))
        }

        if (targets.length === 0) continue

        const gate: CircuitGate = { type: 'I', target: targets[0] }

        if (paramStr != null) {
            // Evaluate basic math expressions in params like pi/2
            let valStr = paramStr.replace(/pi/gi, 'Math.PI')
            try {
                gate.angle = new Function(`return ${valStr}`)()
            } catch (e) {
                gate.angle = 0
            }
        }

        switch (gateName) {
            case 'h': gate.type = 'H'; break;
            case 'x': gate.type = 'X'; break;
            case 'y': gate.type = 'Y'; break;
            case 'z': gate.type = 'Z'; break;
            case 's': gate.type = 'S'; break;
            case 't': gate.type = 'T'; break;
            case 'rx': gate.type = 'RX'; break;
            case 'ry': gate.type = 'RY'; break;
            case 'rz': gate.type = 'RZ'; break;
            case 'cx':
                if (targets.length >= 2) {
                    gate.type = 'CNOT'
                    gate.control = targets[0]
                    gate.target = targets[1]
                }
                break;
            case 'ccx':
                if (targets.length >= 3) {
                    gate.type = 'Toffoli'
                    gate.control = targets[0]
                    gate.control2 = targets[1]
                    gate.target = targets[2]
                }
                break;
            case 'swap':
                if (targets.length >= 2) {
                    gate.type = 'SWAP'
                    gate.target = targets[0]
                    gate.target2 = targets[1]
                }
                break;
            case 'measure':
                gate.type = 'M'
                break;
        }

        if (gate.type !== 'I') {
            circuit.gates.push(gate as any)
        }
    }

    return circuit
}
