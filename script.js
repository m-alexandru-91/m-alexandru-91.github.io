document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 2. LOGICĂ CONTOR VIZUALIZĂRI (SIMPLĂ - AFIȘEAZĂ DOAR CIFRA 1 DUPĂ 3 SECUNDE)
    // ==========================================================================
    const viewsCountElement = document.getElementById('views-count');

    async function handleViewsCounter() {
        if (!viewsCountElement) return;

        try {
            // AȘTEPTĂM EXACT 3 SECUNDE (3000 ms)
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Punem direct cifra 1 pe ecran, fără să mai apelăm niciun server
            viewsCountElement.textContent = "1";

        } catch (err) {
            console.error('A apărut o eroare la contor:', err);
            viewsCountElement.textContent = "1";
        } finally {
            // Forțăm eliminarea animației de încărcare și afișăm numărul pe ecran
            viewsCountElement.className = "loaded";
            viewsCountElement.style.opacity = "1";
        }
    }

    // Pornim automat logica contorului
    handleViewsCounter();

    // ==========================================================================
    // 3. LOGICĂ SCROLL INTELIGENT PAGINI (PAGINILE FOI A4)
    // ==========================================================================
    const sec1 = document.getElementById('sec1');
    const sec2 = document.getElementById('sec2');
    const sec3 = document.getElementById('sec3');

    const toPage2Buttons = document.querySelectorAll('.btn-next-p2');
    const toPage3Buttons = document.querySelectorAll('.btn-next-p3');
    const toPage1Buttons = document.querySelectorAll('.btn-prev-p1');
    const toPage2BackButtons = document.querySelectorAll('.btn-prev-p2');

    // Funcție optimizată special pentru iPhone / Safari
    const smartScroll = (targetElement) => {
        if (!targetElement) return;

        // Calculăm poziția exactă a elementului în pagină
        const elementTop = targetElement.getBoundingClientRect().top;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        let targetPosition = elementTop + currentScroll;

        // Păstrăm logica ta de poziționare pe ecran (centrat pe desktop, sus pe mobil)
        if (window.innerWidth > 768) {
            const elementHeight = targetElement.offsetHeight;
            const windowHeight = window.innerHeight;
            targetPosition = targetPosition - (windowHeight / 2) + (elementHeight / 2);
        }

        // Executăm scroll-ul fluid stabil pe iOS
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    toPage2Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
    toPage3Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec3)));
    toPage1Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec1)));
    toPage2BackButtons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
});
