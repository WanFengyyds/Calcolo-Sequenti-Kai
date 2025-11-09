// Parser class (ported from Kotlin)

function parse(input) {
    const parser = new Parser(input);
    return parser.sequente();
}

class Parser {
    constructor(input) {
        this.input = input;
        this.index = 0;
    }

    readChar() {
        if (this.index >= this.input.length) return null;
        return this.input[this.index++];
    }

    peekChar() {
        if (this.index >= this.input.length) return null;
        return this.input[this.index];
    }

    tryParse(func) {
        const savedIndex = this.index;
        const result = func.call(this);
        if (result === null || result === undefined) {
            this.index = savedIndex;
            return null;
        }
        return result;
    }

    matchString(string) {
        return this.tryParse(() => {
            for (let char of string) {
                if (char !== this.readChar()) {
                    return null;
                }
            }
            return true;
        }) !== null;
    }

    matchStrings(...strings) {
        return strings.some(s => this.matchString(s));
    }

    whitespaces() {
        while (this.peekChar() === ' ') {
            this.index++;
        }
    }

    simboloNot() {
        return this.matchStrings("¬", "!", "~");
    }

    simboloAnd() {
        return this.matchStrings("&", "∧");
    }

    simboloOr() {
        return this.matchStrings("V", "∨");
    }

    simboloImplica() {
        return this.matchStrings("->", "→");
    }

    simboloSequente() {
        return this.matchStrings("|-", "⊢");
    }

    vero() {
        return this.matchStrings("1", "tt") ? new Vero() : null;
    }

    falso() {
        return this.matchStrings("0", "⊥") ? new Falso() : null;
    }

    atomo() {
        return this.tryParse(() => {
            if (this.peekChar() === 'V') return null;
            
            const charCode = this.peekChar()?.charCodeAt(0);
            if (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0)) {
                const char = this.readChar();
                return new Atomo(char);
            }
            return null;
        });
    }

    not() {
        return this.tryParse(() => {
            if (!this.simboloNot()) return null;
            this.whitespaces();
            const operando = this.operando();
            if (!operando) return null;
            return new Not(operando);
        });
    }

    and() {
        return this.tryParse(() => {
            const operando1 = this.operando();
            if (!operando1) return null;
            this.whitespaces();
            if (!this.simboloAnd()) return null;
            this.whitespaces();
            const operando2 = this.operando();
            if (!operando2) return null;
            return new And(operando1, operando2);
        });
    }

    or() {
        return this.tryParse(() => {
            const operando1 = this.operando();
            if (!operando1) return null;
            this.whitespaces();
            if (!this.simboloOr()) return null;
            this.whitespaces();
            const operando2 = this.operando();
            if (!operando2) return null;
            return new Or(operando1, operando2);
        });
    }

    implica() {
        return this.tryParse(() => {
            const operando1 = this.tryParse(() => this.and())
                || this.tryParse(() => this.or())
                || this.tryParse(() => this.operando());
            if (!operando1) return null;
            this.whitespaces();
            if (!this.simboloImplica()) return null;
            this.whitespaces();
            const operando2 = this.tryParse(() => this.and())
                || this.tryParse(() => this.or())
                || this.tryParse(() => this.operando());
            if (!operando2) return null;
            return new Implica(operando1, operando2);
        });
    }

    operando() {
        return this.tryParse(() => {
            if (!this.matchString("(")) return null;
            this.whitespaces();
            const proposizione = this.proposizione();
            if (!proposizione) return null;
            this.whitespaces();
            if (!this.matchString(")")) return null;
            return proposizione;
        })
        || this.tryParse(() => this.vero())
        || this.tryParse(() => this.falso())
        || this.tryParse(() => this.atomo())
        || this.tryParse(() => this.not());
    }

    proposizione() {
        return this.tryParse(() => this.implica())
            || this.tryParse(() => this.and())
            || this.tryParse(() => this.or())
            || this.tryParse(() => this.operando());
    }

    listaProposizioni() {
        const proposizioni = [];
        const firstProp = this.proposizione();
        if (!firstProp) return proposizioni;
        
        proposizioni.push(firstProp);
        
        while (true) {
            const nextProp = this.tryParse(() => {
                this.whitespaces();
                if (!this.matchString(",")) return null;
                this.whitespaces();
                const prop = this.proposizione();
                if (!prop) return null;
                return prop;
            });
            
            if (!nextProp) break;
            proposizioni.push(nextProp);
        }
        
        return proposizioni;
    }

    sequente() {
        this.whitespaces();
        if (this.peekChar() === null) return null;
        
        return this.tryParse(() => {
            const propsSx = this.listaProposizioni();
            this.whitespaces();
            if (!this.simboloSequente()) return null;
            this.whitespaces();
            const propsDx = this.listaProposizioni();
            propsDx.reverse();
            this.whitespaces();
            if (this.readChar() !== null) return null;
            return new Sequente(propsSx, propsDx);
        })
        || this.tryParse(() => {
            const prop = this.proposizione();
            if (!prop) return null;
            this.whitespaces();
            if (this.readChar() !== null) return null;
            return new Sequente([], [prop]);
        });
    }
}
