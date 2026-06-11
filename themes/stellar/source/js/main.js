function createStars() {
    const field = document.getElementById('starfield');
    if (!field) return;
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        star.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
            --dur: ${Math.random() * 3 + 1}s;
            animation-delay: ${Math.random() * 3}s;
        `;
        field.appendChild(star);
    }
}

function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

function initNavScroll() {
    let lastScroll = 0;
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        if (current > 100) {
            nav.style.background = 'rgba(0,0,0,0.9)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, transparent 100%)';
            nav.style.backdropFilter = 'blur(10px)';
        }
        lastScroll = current;
    });
}

function initCardHover() {
    document.querySelectorAll('.post-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-3px) perspective(500px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) perspective(500px) rotateY(0) rotateX(0)';
        });
    });
}

function initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-card, .archive-item, .tag-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initCursorGlow();
    initNavScroll();
    initCardHover();
    initScrollReveal();
});
