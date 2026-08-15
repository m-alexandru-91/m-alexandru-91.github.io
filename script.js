document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 2. LOGICĂ CONTOR VIZUALIZĂRI (SIMPLĂ - AFIȘEAZĂ DOAR CIFRA 1 DUPĂ 3 SECUNDE)
    // ==========================================================================
    const viewsCountElement = document.getElementById('views-count');

    async function handleViewsCounter() {
        if (!viewsCountElement) return;

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));
            viewsCountElement.textContent = "1";
        } catch (err) {
            console.error('A apărut o eroare la contor:', err);
            viewsCountElement.textContent = "1";
        } finally {
            viewsCountElement.className = "loaded";
            viewsCountElement.style.opacity = "1";
        }
    }

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

    // Funcția principală de scroll fluid compatibilă 100% cu iOS
    const smartScroll = (targetElement) => {
        if (!targetElement) return;

        // Pasul 1: Forțăm deblocarea temporară a containerului în caz că Safari l-a înghețat
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        // Pasul 2: Calculăm precis distanța fizică până la secțiune
        const elementTop = targetElement.getBoundingClientRect().top;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        let targetPosition = elementTop + currentScroll;

        // Centrare pe desktop, aliniere sus pe mobil
        if (window.innerWidth > 768) {
            const elementHeight = targetElement.offsetHeight;
            const windowHeight = window.innerHeight;
            targetPosition = targetPosition - (windowHeight / 2) + (elementHeight / 2);
        }

        // Pasul 3: Executăm scroll-ul nativ pe fereastră (metoda optimă pentru iOS)
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    // Aplicăm logica pe butoane
    toPage2Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
    toPage3Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec3)));
    toPage1Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec1)));
    toPage2BackButtons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));

    // ==========================================================================
    // 4. SOLUȚIA DE SALVARE PENTRU IPHONE (DEBLOCARE SCROLL MANUAL + MAGNET)
    // ==========================================================================
    // Detectăm dacă utilizatorul este pe iPhone/iPad
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
        // Pasul A: Eliminăm complet proprietatea CSS de snap nativă pe iOS deoarece dă crash
        document.documentElement.style.scrollSnapType = 'none';
        document.body.style.scrollSnapType = 'none';
        
        // Pasul B: Forțăm interpretarea gesturilor fizice de către browser
        document.documentElement.style.webkitOverflowScrolling = 'touch';
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Pasul C: Corectăm bug-ul de înălțime din Safari (100vh care blochează ecranul)
        const sections = [sec1, sec2, sec3];
        sections.forEach(sec => {
            if (sec) {
                sec.style.minHeight = '-webkit-fill-available';
                sec.style.scrollSnapAlign = 'none'; // Dezactivăm snap-ul problematic din CSS
            }
        });
    }
});
