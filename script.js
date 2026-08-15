document.addEventListener('DOMContentLoaded', () => {
    const sec1 = document.getElementById('sec1');
    const sec2 = document.getElementById('sec2');
    const sec3 = document.getElementById('sec3');

    const toPage2Buttons = document.querySelectorAll('.btn-next-p2');
    const toPage3Buttons = document.querySelectorAll('.btn-next-p3');
    const toPage1Buttons = document.querySelectorAll('.btn-prev-p1');
    const toPage2BackButtons = document.querySelectorAll('.btn-prev-p2');

    toPage2Buttons.forEach(btn => btn.addEventListener('click', () => sec2.scrollIntoView({ behavior: 'smooth' })));
    toPage3Buttons.forEach(btn => btn.addEventListener('click', () => sec3.scrollIntoView({ behavior: 'smooth' })));
    toPage1Buttons.forEach(btn => btn.addEventListener('click', () => sec1.scrollIntoView({ behavior: 'smooth' })));
    toPage2BackButtons.forEach(btn => btn.addEventListener('click', () => sec2.scrollIntoView({ behavior: 'smooth' })));
});
