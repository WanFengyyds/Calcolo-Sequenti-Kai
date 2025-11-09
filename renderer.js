// Canvas renderer for derivation tree

class DerivationRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.zoom = 1;
        this.padding = 20;
        this.lineHeight = 60;
        this.horizontalGap = 40;
    }

    setZoom(zoom) {
        this.zoom = Math.max(0.5, Math.min(2, zoom));
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    measureText(text, fontSize) {
        this.ctx.font = `${fontSize}px monospace`;
        return this.ctx.measureText(text);
    }

    // Calculate tree dimensions (bottom-up)
    calculateDimensions(derivazione, fontSize = 16) {
        if (!derivazione) return { width: 0, height: 0 };

        const sequenteWidth = this.measureText(derivazione.sequenteText, fontSize).width;
        const regolaWidth = this.measureText(derivazione.regolaText, fontSize).width;
        const nodeWidth = Math.max(sequenteWidth, regolaWidth) + 40;

        if (derivazione.albero instanceof Stop) {
            return { width: nodeWidth, height: this.lineHeight };
        }

        if (derivazione.albero instanceof Ramo) {
            const childDim = this.calculateDimensions(derivazione.albero.ramo, fontSize);
            return {
                width: Math.max(nodeWidth, childDim.width),
                height: this.lineHeight + childDim.height
            };
        }

        if (derivazione.albero instanceof Rami) {
            const leftDim = this.calculateDimensions(derivazione.albero.ramoSx, fontSize);
            const rightDim = this.calculateDimensions(derivazione.albero.ramoDx, fontSize);
            return {
                width: Math.max(nodeWidth, leftDim.width + rightDim.width + this.horizontalGap),
                height: this.lineHeight + Math.max(leftDim.height, rightDim.height)
            };
        }

        return { width: nodeWidth, height: this.lineHeight };
    }

    // Draw the derivation tree (bottom-up: conclusion at bottom, axioms at top)
    drawDerivation(derivazione, x, y, width, height, fontSize = 16) {
        if (!derivazione) return;

        const ctx = this.ctx;
        const scaledFontSize = fontSize * this.zoom;
        
        // Calculate current node position (bottom of this subtree)
        const nodeY = y + height - this.lineHeight * this.zoom / 2;
        
        ctx.font = `${scaledFontSize}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw sequente at the bottom of this node
        ctx.fillStyle = '#333';
        ctx.fillText(derivazione.sequenteText, x + width / 2, nodeY);

        // Draw horizontal line above the sequente
        const lineY = nodeY - scaledFontSize * 0.7;
        const lineWidth = Math.min(width * 0.8, 
            this.measureText(derivazione.sequenteText, fontSize).width * this.zoom + 20);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2 * this.zoom;
        ctx.beginPath();
        ctx.moveTo(x + (width - lineWidth) / 2, lineY);
        ctx.lineTo(x + (width + lineWidth) / 2, lineY);
        ctx.stroke();

        // Draw regola (rule name) above the line
        ctx.font = `${scaledFontSize * 0.8}px monospace`;
        ctx.fillStyle = '#667eea';
        ctx.fillText(derivazione.regolaText, x + width / 2, lineY - scaledFontSize * 0.5);

        // Draw children above (if any)
        if (derivazione.albero instanceof Ramo) {
            const childDim = this.calculateDimensions(derivazione.albero.ramo, fontSize);
            const childHeight = childDim.height * this.zoom;
            const childWidth = childDim.width * this.zoom;
            this.drawDerivation(
                derivazione.albero.ramo, 
                x + (width - childWidth) / 2, 
                y,
                childWidth,
                childHeight,
                fontSize
            );
        } else if (derivazione.albero instanceof Rami) {
            const leftDim = this.calculateDimensions(derivazione.albero.ramoSx, fontSize);
            const rightDim = this.calculateDimensions(derivazione.albero.ramoDx, fontSize);
            
            const leftWidth = leftDim.width * this.zoom;
            const rightWidth = rightDim.width * this.zoom;
            const leftHeight = leftDim.height * this.zoom;
            const rightHeight = rightDim.height * this.zoom;
            const gap = this.horizontalGap * this.zoom;
            const totalChildWidth = leftWidth + rightWidth + gap;

            const leftX = x + (width - totalChildWidth) / 2;
            const rightX = leftX + leftWidth + gap;

            // Both children start at the same y position
            const childrenY = y;

            this.drawDerivation(derivazione.albero.ramoSx, leftX, childrenY, leftWidth, leftHeight, fontSize);
            this.drawDerivation(derivazione.albero.ramoDx, rightX, childrenY, rightWidth, rightHeight, fontSize);
        }
    }

    render(derivazione) {
        if (!derivazione) {
            this.clear();
            return;
        }

        const fontSize = 16;
        const dim = this.calculateDimensions(derivazione, fontSize);
        
        const canvasWidth = (dim.width + this.padding * 2) * this.zoom;
        const canvasHeight = (dim.height + this.padding * 2) * this.zoom;

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw from bottom-up: start at top of canvas, tree grows downward visually but logically upward
        this.drawDerivation(
            derivazione,
            this.padding * this.zoom,
            this.padding * this.zoom,
            dim.width * this.zoom,
            dim.height * this.zoom,
            fontSize
        );
    }
}
