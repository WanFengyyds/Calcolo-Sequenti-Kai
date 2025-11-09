// Derivazione (Derivation) classes and logic

class Derivazione {
    constructor(sequente, regola, albero) {
        this.sequente = sequente;
        this.regola = regola;
        this.albero = albero;
        this.sequenteText = sequente.toString();
        this.regolaText = regola;
    }
}

class Albero {
    // Base class for tree nodes
}

class Ramo extends Albero {
    constructor(ramo) {
        super();
        this.ramo = ramo;
    }
}

class Rami extends Albero {
    constructor(ramoSx, ramoDx) {
        super();
        this.ramoSx = ramoSx;
        this.ramoDx = ramoDx;
    }
}

class Stop extends Albero {
    // Leaf node
}

// Main derivation function
function deriveSequente(sequente) {
    const propsSx = sequente.propsSx;
    const propsDx = sequente.propsDx;

    // Helper function to remove last element
    function removeLast(arr) {
        return arr.slice(0, -1);
    }

    // Assiomi (Axioms)
    for (let propSx of propsSx) {
        // ax-⊥
        if (propSx instanceof Falso) {
            return new Derivazione(sequente, Regola.AxF, new Stop());
        }
        // ax-id
        for (let propDx of propsDx) {
            if (Sequente.propsEqual(propSx, propDx)) {
                return new Derivazione(sequente, Regola.AxId, new Stop());
            }
        }
    }

    // ax-tt
    for (let propDx of propsDx) {
        if (propDx instanceof Vero) {
            return new Derivazione(sequente, Regola.AxT, new Stop());
        }
    }

    const lastSx = propsSx[propsSx.length - 1] || null;
    const lastDx = propsDx[propsDx.length - 1] || null;

    // &-S
    if (lastSx instanceof And) {
        const newPropsSx = [...removeLast(propsSx), lastSx.propSx, lastSx.propDx];
        const newSequente = new Sequente(newPropsSx, propsDx);
        return new Derivazione(sequente, Regola.AndS, new Ramo(deriveSequente(newSequente)));
    }

    // ∨-D
    if (lastDx instanceof Or) {
        const newPropsDx = [...removeLast(propsDx), lastDx.propDx, lastDx.propSx];
        const newSequente = new Sequente(propsSx, newPropsDx);
        return new Derivazione(sequente, Regola.OrD, new Ramo(deriveSequente(newSequente)));
    }

    // ¬-S
    if (lastSx instanceof Not) {
        const newPropsSx = removeLast(propsSx);
        const newPropsDx = [...propsDx, lastSx.prop];
        const newSequente = new Sequente(newPropsSx, newPropsDx);
        return new Derivazione(sequente, Regola.NotS, new Ramo(deriveSequente(newSequente)));
    }

    // ¬-D
    if (lastDx instanceof Not) {
        const newPropsSx = [...propsSx, lastDx.prop];
        const newPropsDx = removeLast(propsDx);
        const newSequente = new Sequente(newPropsSx, newPropsDx);
        return new Derivazione(sequente, Regola.NotD, new Ramo(deriveSequente(newSequente)));
    }

    // →-D
    if (lastDx instanceof Implica) {
        const newPropsSx = [...propsSx, lastDx.propSx];
        const newPropsDx = [...removeLast(propsDx), lastDx.propDx];
        const newSequente = new Sequente(newPropsSx, newPropsDx);
        return new Derivazione(sequente, Regola.ImplicaD, new Ramo(deriveSequente(newSequente)));
    }

    // &-D
    if (lastDx instanceof And) {
        const newPropsDx1 = [...removeLast(propsDx), lastDx.propSx];
        const newPropsDx2 = [...removeLast(propsDx), lastDx.propDx];
        const sequente1 = new Sequente(propsSx, newPropsDx1);
        const sequente2 = new Sequente(propsSx, newPropsDx2);
        return new Derivazione(
            sequente,
            Regola.AndD,
            new Rami(deriveSequente(sequente1), deriveSequente(sequente2))
        );
    }

    // ∨-S
    if (lastSx instanceof Or) {
        const newPropsSx1 = [...removeLast(propsSx), lastSx.propSx];
        const newPropsSx2 = [...removeLast(propsSx), lastSx.propDx];
        const sequente1 = new Sequente(newPropsSx1, propsDx);
        const sequente2 = new Sequente(newPropsSx2, propsDx);
        return new Derivazione(
            sequente,
            Regola.OrS,
            new Rami(deriveSequente(sequente1), deriveSequente(sequente2))
        );
    }

    // →-S
    if (lastSx instanceof Implica) {
        const newPropsSx1 = removeLast(propsSx);
        const newPropsDx1 = [...propsDx, lastSx.propSx];
        const newPropsSx2 = [...removeLast(propsSx), lastSx.propDx];
        const sequente1 = new Sequente(newPropsSx1, newPropsDx1);
        const sequente2 = new Sequente(newPropsSx2, propsDx);
        return new Derivazione(
            sequente,
            Regola.ImplicaS,
            new Rami(deriveSequente(sequente1), deriveSequente(sequente2))
        );
    }

    // sc-sx (exchange left)
    for (let i = 0; i < propsSx.length; i++) {
        const propSx = propsSx[i];
        if (propSx instanceof Not || propSx instanceof And || 
            propSx instanceof Or || propSx instanceof Implica) {
            const newPropsSx = [...propsSx];
            newPropsSx[i] = propsSx[propsSx.length - 1];
            newPropsSx[newPropsSx.length - 1] = propSx;
            const newSequente = new Sequente(newPropsSx, propsDx);
            return new Derivazione(sequente, Regola.ScSx, new Ramo(deriveSequente(newSequente)));
        }
    }

    // sc-dx (exchange right)
    for (let i = 0; i < propsDx.length; i++) {
        const propDx = propsDx[i];
        if (propDx instanceof Not || propDx instanceof And || 
            propDx instanceof Or || propDx instanceof Implica) {
            const newPropsDx = [...propsDx];
            newPropsDx[i] = propsDx[propsDx.length - 1];
            newPropsDx[newPropsDx.length - 1] = propDx;
            const newSequente = new Sequente(propsSx, newPropsDx);
            return new Derivazione(sequente, Regola.ScDx, new Ramo(deriveSequente(newSequente)));
        }
    }

    // Non derivabile (not derivable)
    return new Derivazione(sequente, Regola.NonDerivabile, new Stop());
}
