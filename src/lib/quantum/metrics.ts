import { Complex } from './complex'

/**
 * Advanced quantum metrics for state analysis.
 */
export class QuantumMetrics {
    /**
     * Calculates the fidelity between two pure states: F = |<psi|phi>|^2
     */
    static calculateFidelity(state1: Complex[], state2: Complex[]): number {
        if (state1.length !== state2.length) return 0
        let dotR = 0
        let dotI = 0

        for (let i = 0; i < state1.length; i++) {
            // state1[i]* . state2[i] => (r1 - i1j) * (r2 + i2j) = (r1r2 + i1i2) + (r1i2 - i1r2)j
            dotR += state1[i].r * state2[i].r + state1[i].i * state2[i].i
            dotI += state1[i].r * state2[i].i - state1[i].i * state2[i].r
        }

        return dotR * dotR + dotI * dotI
    }

    /**
     * Computes the reduced density matrix for a subset of qubits.
     * This is a simplified version for small systems.
     */
    static partialTrace(state: Complex[], numQubits: number, traceOutIndices: number[]): Complex[][] {
        const keepIndices = Array.from({ length: numQubits }, (_, i) => i).filter(i => !traceOutIndices.includes(i))
        const dimKeep = 1 << keepIndices.length
        const dimTrace = 1 << traceOutIndices.length

        const densityMatrix: Complex[][] = Array.from({ length: dimKeep }, () => Array.from({ length: dimKeep }, () => ({ r: 0, i: 0 })))

        // rho = |psi><psi|
        // Tr_B(rho)_ij = sum_k <i,k|psi><psi|j,k>
        for (let i = 0; i < dimKeep; i++) {
            for (let j = 0; j < dimKeep; j++) {
                let sumR = 0
                let sumI = 0

                for (let k = 0; k < dimTrace; k++) {
                    const idxI = this.constructIndex(i, k, keepIndices, traceOutIndices)
                    const idxJ = this.constructIndex(j, k, keepIndices, traceOutIndices)

                    const ampI = state[idxI]
                    const ampJ = state[idxJ]

                    // ampI * ampJ*
                    sumR += ampI.r * ampJ.r + ampI.i * ampJ.i
                    sumI += ampI.i * ampJ.r - ampI.r * ampJ.i
                }

                densityMatrix[i][j] = { r: sumR, i: sumI }
            }
        }

        return densityMatrix
    }

    /**
     * Calculates the Von Neumann entropy from a density matrix.
     */
    static calculateEntropy(densityMatrix: Complex[][]): number {
        // For a 2x2 matrix (single qubit reduced state), we can find eigenvalues directly
        if (densityMatrix.length === 2) {
            const a = densityMatrix[0][0].r
            const d = densityMatrix[1][1].r
            const b = densityMatrix[0][1] // complex

            // Characteristic equation: det(M - LI) = 0
            // (a-L)(d-L) - |b|^2 = 0
            // L^2 - (a+d)L + ad - |b|^2 = 0
            const tr = a + d
            const det = a * d - (b.r * b.r + b.i * b.i)

            const disc = Math.sqrt(Math.max(0, tr * tr - 4 * det))
            const l1 = (tr + disc) / 2
            const l2 = (tr - disc) / 2

            return this.vonNeumannSum([l1, l2])
        }

        // For larger matrices, we'd need a proper eigensolver. 
        // For now, we return 0 for unsupported sizes or implement a basic one.
        return 0
    }

    private static vonNeumannSum(eigenvalues: number[]): number {
        let entropy = 0
        for (const l of eigenvalues) {
            if (l > 1e-10) {
                entropy -= l * Math.log2(l)
            }
        }
        return Math.max(0, entropy)
    }

    private static constructIndex(keepIdx: number, traceIdx: number, keepPos: number[], tracePos: number[]): number {
        let fullIdx = 0
        for (let i = 0; i < keepPos.length; i++) {
            if ((keepIdx & (1 << i)) !== 0) {
                fullIdx |= (1 << keepPos[i])
            }
        }
        for (let i = 0; i < tracePos.length; i++) {
            if ((traceIdx & (1 << i)) !== 0) {
                fullIdx |= (1 << tracePos[i])
            }
        }
        return fullIdx
    }
}
