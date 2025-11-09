// Main application logic

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sequent-input');
    const errorMessage = document.getElementById('error-message');
    const canvas = document.getElementById('derivation-canvas');
    const helpToggle = document.getElementById('help-toggle');
    const helpContent = document.getElementById('help-content');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const zoomResetBtn = document.getElementById('zoom-reset');

    const renderer = new DerivationRenderer(canvas);
    let currentDerivation = null;

    // Help toggle
    helpToggle.addEventListener('click', () => {
        helpContent.classList.toggle('show');
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', () => {
        renderer.setZoom(renderer.zoom + 0.1);
        if (currentDerivation) {
            renderer.render(currentDerivation);
        }
    });

    zoomOutBtn.addEventListener('click', () => {
        renderer.setZoom(renderer.zoom - 0.1);
        if (currentDerivation) {
            renderer.render(currentDerivation);
        }
    });

    zoomResetBtn.addEventListener('click', () => {
        renderer.setZoom(1);
        if (currentDerivation) {
            renderer.render(currentDerivation);
        }
    });

    // Input handler
    input.addEventListener('input', (e) => {
        const text = e.target.value.trim();
        
        if (text === '') {
            errorMessage.textContent = '';
            input.classList.remove('error');
            renderer.clear();
            currentDerivation = null;
            return;
        }

        try {
            const sequente = parse(text);
            
            if (sequente === null) {
                errorMessage.textContent = 'Errore: Input non valido. Controlla la sintassi.';
                input.classList.add('error');
                renderer.clear();
                currentDerivation = null;
                return;
            }

            // Successful parse
            errorMessage.textContent = '';
            input.classList.remove('error');

            // Derive and render
            currentDerivation = deriveSequente(sequente);
            renderer.setZoom(1); // Reset zoom on new input
            renderer.render(currentDerivation);

        } catch (error) {
            console.error('Error processing input:', error);
            errorMessage.textContent = 'Errore: Si è verificato un errore nel processamento.';
            input.classList.add('error');
            renderer.clear();
            currentDerivation = null;
        }
    });

    // Example input on load
    setTimeout(() => {
        input.value = 'A -> B, B -> C |- A -> C';
        input.dispatchEvent(new Event('input'));
    }, 100);
});
