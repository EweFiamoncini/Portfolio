// Revela elementos ao entrar na tela (usa as classes .js-reveal / .visible do CSS)
const SELECTOR = [
    'section:not(#home) h2',
    '#sobre p',
    '.skill-card',
    '.project-card',
].join(',');

let observer;

function getObserver() {
    if (observer || !('IntersectionObserver' in window)) return observer;

    observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    return observer;
}

// Pode ser chamada novamente após inserir conteúdo dinâmico (ex.: cards do GitHub)
export function initReveal(root = document) {
    const io = getObserver();

    root.querySelectorAll(SELECTOR).forEach((el) => {
        if (el.classList.contains('js-reveal')) return;
        el.classList.add('js-reveal');

        // Sem suporte a IntersectionObserver: mostra direto
        if (io) io.observe(el);
        else el.classList.add('visible');
    });
}

const reveals = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      reveals.unobserve(entry.target);
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
);

// chame de novo depois de renderizar os projetos, se eles vierem de uma API
function observeReveals(root = document) {
  const groups = new Map();
  root
    .querySelectorAll("section:not(#home) h2, #sobre p, .skill-card, .project-card")
    .forEach((el) => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = "1";
      el.classList.add("reveal");
      // stagger por grupo, limitado a 0.4s
      const i = groups.get(el.parentElement) ?? 0;
      groups.set(el.parentElement, i + 1);
      el.style.setProperty("--delay", `${Math.min(i * 0.06, 0.4)}s`);
      reveals.observe(el);
    });
}
observeReveals();