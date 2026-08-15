// CONFIGURARE SUPABASE - Înlocuiește cu datele din proiectul tău Supabase
const SUPABASE_URL = "https://uwqqirvtrzubvndpxnem.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_cUhrn5DS2KD7pzpzpSMv0A_dJ7v7tZC";

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 2. LOGICĂ CONTOR VIZUALIZĂRI (CU ÎNTÂRZIERE DE 3 SECUNDE ȘI RPC)
    // ==========================================================================
    const viewsCountElement = document.getElementById('views-count');

    async function handleViewsCounter() {
        const hasVisitedThisSession = sessionStorage.getItem('has_visited');
        
        const headers = {
            "apikey": SUPABASE_ANON_KEY,
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json"
        };

        try {
            // AȘTEPTĂM EXACT 3 SECUNDE (3000 ms) înainte de a rula logica
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Pasul A: Dacă este o deschidere nouă în sesiune, apelăm funcția Stored Procedure din server
            if (!hasVisitedThisSession) {
                const responseIncrement = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_views`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({}) // Trimitem un obiect gol, funcția știe ce are de făcut pe server
                });

                if (responseIncrement.ok) {
                    sessionStorage.setItem('has_visited', 'true');
                }
            }

            // O mică pauză tehnică de siguranță (100 milisecunde) pentru a asigura sincronizarea bazei de date
            await new Promise(resolve => setTimeout(resolve, 100));

            // Pasul B: Citim valoarea finală actualizată din baza de date
            const responseData = await fetch(`${SUPABASE_URL}/rest/v1/views_counter?id=eq.homepage&select=count_value`, {
                method: 'GET',
                headers: headers
            });

            if (responseData.ok) {
                const data = await responseData.json();
                
                if (data && data.length > 0) {
                    // Verificăm dacă valoarea citită este 0. Dacă serverul a întârziat, afișăm direct 1 ca plasă de siguranță
                    const finalCount = parseInt(data[0].count_value);
                    viewsCountElement.textContent = finalCount === 0 ? "1" : finalCount;
                } else {
                    viewsCountElement.textContent = "1";
                }
            } else {
                viewsCountElement.textContent = "1";
            }

        } catch (err) {
            console.error('Conexiunea la Supabase a întâmpinat o eroare:', err);
            viewsCountElement.textContent = "1";
        } finally {
            // Forțăm eliminarea animației de încărcare și afișăm numărul corect pe ecran
            if (viewsCountElement) {
                viewsCountElement.className = "loaded";
                viewsCountElement.style.opacity = "1";
            }
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

    const smartScroll = (targetElement) => {
        if (window.innerWidth <= 768) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    toPage2Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
    toPage3Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec3)));
    toPage1Buttons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec1)));
    toPage2BackButtons.forEach(btn => btn.addEventListener('click', () => smartScroll(sec2)));
});
