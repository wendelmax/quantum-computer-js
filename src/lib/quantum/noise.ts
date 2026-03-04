import { Complex, mul, add, C, norm2 } from './complex'

/**
 * Applies various quantum noise channels to a state vector.
 */
export class NoiseModel {
    /**
     * Bit-flip noise (X error)
     */
    static applyBitFlip(state: Complex[], target: number, p: number): Complex[] {
        if (p <= 0) return state
        if (Math.random() >= p) return state

        const size = state.length
        const stride = 1 << target
        const period = stride << 1
        const out = [...state]

        for (let i = 0; i < size; i += period) {
            for (let j = 0; j < stride; j++) {
                const i0 = i + j
                const i1 = i + j + stride
                    ;[out[i0], out[i1]] = [out[i1], out[i0]]
            }
        }
        return out
    }

    /**
     * Phase-flip noise (Z error)
     */
    static applyPhaseFlip(state: Complex[], target: number, p: number): Complex[] {
        if (p <= 0) return state
        if (Math.random() >= p) return state

        const size = state.length
        const stride = 1 << target
        const out = [...state]

        for (let i = 0; i < size; i++) {
            if ((i & stride) !== 0) {
                out[i] = mul(out[i], C(-1, 0))
            }
        }
        return out
    }

    /**
     * Depolarizing channel: with probability p, replace the qubit state with a maximally mixed state.
     * This can be modeled as applying X, Y, or Z errors each with probability p/4 (plus I with 1-3p/4).
     */
    static applyDepolarizing(state: Complex[], target: number, p: number): Complex[] {
        if (p <= 0) return state
        const r = Math.random()
        if (r < p / 4) return this.applyBitFlip(state, target, 1) // Force X
        if (r < p / 2) return this.applyPhaseFlip(state, target, 1) // Force Z
        if (r < 3 * p / 4) {
            // Apply Y error (X and Z)
            let out = this.applyBitFlip(state, target, 1)
            return this.applyPhaseFlip(out, target, 1)
        }
        return state
    }

    /**
     * Amplitude damping (T1 decay): represents energy loss from |1> to |0>.
     * Probability gamma of decaying from 1 to 0.
     * This is more complex on state vectors (stochastic kraus op application).
     */
    static applyAmplitudeDamping(state: Complex[], target: number, gamma: number): Complex[] {
        if (gamma <= 0) return state
        const size = state.length
        const stride = 1 << target
        const out = [...state]

        for (let i = 0; i < size; i++) {
            // If the qubit is '1' (at index i & stride)
            if ((i & stride) !== 0) {
                if (Math.random() < gamma) {
                    const partner = i ^ stride
                    // Add the amplitude to the |0> state and zero out the |1> state
                    // Note: For state vectors, this is a "jump" or measurement-like effect.
                    out[partner] = add(out[partner], out[i])
                    out[i] = C(0, 0)
                }
            }
        }

        // Renormalize
        const norm = Math.sqrt(out.reduce((sum, c) => sum + norm2(c), 0))
        if (norm > 0) {
            for (let i = 0; i < size; i++) {
                out[i] = C(out[i].r / norm, out[i].i / norm)
            }
        }

        return out
    }
}
