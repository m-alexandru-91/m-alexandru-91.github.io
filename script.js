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

    // Selectăm containerul principal de scroll definit în CSS-ul tău
    const scrollContainer = document.querySelector('.scroll-container');

    const smartScroll = (targetElement) => {
        if (!targetElement) return;

        // VERIFICARE MOBIL: Dacă suntem pe mobil (sub 768px), folosim scroll global stabil pe fereastră
        if (window.innerWidth <= 768) {
            // Calculăm poziția secțiunii relativ la documentul global
            const elementTop = targetElement.getBoundingClientRect().top;
            const currentGlobalScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // Lăsăm un spațiu de 70px în partea de sus pentru a nu intra sub header-ul tău fix (var(--bar-height))
            const targetPositionMobile = elementTop + currentGlobalScroll - 70;

            window.scrollTo({
                top: targetPositionMobile,
                behavior: 'smooth'
            });
            return;
        }

        // VERIFICARE DESKTOP: Folosim scroll-ul intern al containerului (.scroll-container)
        if (!scrollContainer) return;

        // Salvăm starea originală a magnetului pentru desktop
        const originalSnap = window.getComputedStyle(scrollContainer).scrollSnapType;
        scrollContainer.style.scrollSnapType = 'none';

        const containerTop = scrollContainer.getBoundingClientRect().top;
        const elementTop = targetElement.getBoundingClientRect().top;
        const currentScroll = scrollContainer.scrollTop;
        
        let targetPositionDesktop = elementTop - containerTop + currentScroll;

        // Centrare perfectă a colii A4 pe mijlocul ecranului (Desktop)
        const elementHeight = targetElement.offsetHeight;
        const containerHeight = scrollContainer.offsetHeight;
        targetPositionDesktop = targetPositionDesktop - (containerHeight / 2) + (elementHeight / 2);

        scrollContainer.scrollTo({
            top: targetPositionDesktop,
            behavior: 'smooth'
        });

        // Reactivăm magnetul structural pe desktop după finalizarea animației
        setTimeout(() => {
            scrollContainer.style.scrollSnapType = originalSnap;
        }, 600);
    };

    // Alocare evenimente butoane
    toPage2Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
    toPage3Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec3)));
    toPage1Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec1)));
    toPage2BackButtons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));

    // ==========================================================================
    // 4. RESETARE DINAMICĂ ȘI DEBLOCARE FIZICĂ STRUCTURĂ MOBIL (iOS / Android)
    // ==========================================================================
    const aplicaDeblocareMobila = () => {
        if (window.innerWidth <= 768) {
            // Forțăm eliminarea blocajului general din body nativ pe mobil
            document.body.style.overflow = 'visible';
            document.documentElement.style.overflow = 'visible';
            
            // Anulăm înălțimea fixă a containerului ca să poată culisa pe documentul principal
            if (scrollContainer) {
                scrollContainer.style.height = 'auto';
                scrollContainer.style.overflow = 'visible';
                scrollContainer.style.webkitOverflowScrolling = 'touch';
            }
        } else {
            // Revenim la setările tale originale pe desktop dacă ecranul este mare
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            if (scrollContainer) {
                scrollContainer.style.height = '100vh';
                scrollContainer.style.overflowY = 'scroll';
            }
        }
    };

    // Rulăm instant la citirea DOM-ului și la orice modificare a ecranului (schimbare orientare telefon)
    aplicaDeblocareMobila();
    window.addEventListener('resize', aplicaDeblocareMobila);
});
