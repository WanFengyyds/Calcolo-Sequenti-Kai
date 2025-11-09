// Proposizione classes (equivalent to Kotlin sealed class)

class Proposizione {
    toString() {
        throw new Error("toString must be implemented by subclass");
    }
}

class Vero extends Proposizione {
    toString() {
        return "tt";
    }
}

class Falso extends Proposizione {
    toString() {
        return "⊥";
    }
}

class Atomo extends Proposizione {
    constructor(char) {
        super();
        this.char = char;
    }

    toString() {
        return this.char;
    }

    equals(other) {
        return other instanceof Atomo && other.char === this.char;
    }
}

class Not extends Proposizione {
    constructor(prop) {
        super();
        this.prop = prop;
    }

    toString() {
        if (this.prop instanceof Vero || 
            this.prop instanceof Falso || 
            this.prop instanceof Atomo || 
            this.prop instanceof Not) {
            return `¬${this.prop}`;
        } else {
            return `¬(${this.prop})`;
        }
    }
}

class And extends Proposizione {
    constructor(propSx, propDx) {
        super();
        this.propSx = propSx;
        this.propDx = propDx;
    }

    toString() {
        let left, right;
        
        if (this.propSx instanceof Vero || 
            this.propSx instanceof Falso || 
            this.propSx instanceof Atomo || 
            this.propSx instanceof Not) {
            left = `${this.propSx}`;
        } else {
            left = `(${this.propSx})`;
        }

        if (this.propDx instanceof Vero || 
            this.propDx instanceof Falso || 
            this.propDx instanceof Atomo || 
            this.propDx instanceof Not) {
            right = `${this.propDx}`;
        } else {
            right = `(${this.propDx})`;
        }

        return `${left}&${right}`;
    }
}

class Or extends Proposizione {
    constructor(propSx, propDx) {
        super();
        this.propSx = propSx;
        this.propDx = propDx;
    }

    toString() {
        let left, right;
        
        if (this.propSx instanceof Vero || 
            this.propSx instanceof Falso || 
            this.propSx instanceof Atomo || 
            this.propSx instanceof Not) {
            left = `${this.propSx}`;
        } else {
            left = `(${this.propSx})`;
        }

        if (this.propDx instanceof Vero || 
            this.propDx instanceof Falso || 
            this.propDx instanceof Atomo || 
            this.propDx instanceof Not) {
            right = `${this.propDx}`;
        } else {
            right = `(${this.propDx})`;
        }

        return `${left}∨${right}`;
    }
}

class Implica extends Proposizione {
    constructor(propSx, propDx) {
        super();
        this.propSx = propSx;
        this.propDx = propDx;
    }

    toString() {
        let left = this.propSx instanceof Implica ? `(${this.propSx})` : `${this.propSx}`;
        let right = this.propDx instanceof Implica ? `(${this.propDx})` : `${this.propDx}`;
        return `${left}→${right}`;
    }
}
