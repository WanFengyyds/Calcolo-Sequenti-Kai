// Sequente class

class Sequente {
    constructor(propsSx, propsDx) {
        this.propsSx = propsSx; // Left side propositions
        this.propsDx = propsDx; // Right side propositions (reversed order)
    }

    toString() {
        let result = '';
        
        if (this.propsSx.length > 0) {
            result += this.propsSx.map(p => p.toString()).join(', ');
            result += ' ';
        }
        
        result += '⊢';
        
        if (this.propsDx.length > 0) {
            result += ' ';
            const reversed = [...this.propsDx].reverse();
            result += reversed.map(p => p.toString()).join(', ');
        }
        
        return result;
    }

    // Helper to compare propositions
    static propsEqual(prop1, prop2) {
        if (prop1.constructor !== prop2.constructor) return false;
        
        if (prop1 instanceof Vero || prop1 instanceof Falso) return true;
        
        if (prop1 instanceof Atomo) {
            return prop1.char === prop2.char;
        }
        
        if (prop1 instanceof Not) {
            return Sequente.propsEqual(prop1.prop, prop2.prop);
        }
        
        if (prop1 instanceof And || prop1 instanceof Or || prop1 instanceof Implica) {
            return Sequente.propsEqual(prop1.propSx, prop2.propSx) &&
                   Sequente.propsEqual(prop1.propDx, prop2.propDx);
        }
        
        return false;
    }
}
