import { translations } from './translations.js';
import { resetTyping, setTexts } from './typing.js';

const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem('portfolio-settings') || '{}');
  } catch {
    return {};
  }
};

export let currentLanguage = getSettings().lang || 'pt';

const langToggle = document.getElementById('language-toggle');
const langMenu = document.getElementById('lang-menu');
const currentFlag = document.getElementById('current-flag');
const currentLangLabel = document.getElementById('current-lang');

// Atualiza o visual do botão e marca a opção selecionada no menu
function updateDropdownUI(lang) {
  const option = langMenu?.querySelector(`[data-lang="${lang}"]`);
  if (!option) return;

  if (currentFlag) {
    currentFlag.src = `https://flagcdn.com/w40/${option.dataset.flag}.png`;
    currentFlag.alt = option.textContent.trim();
  }
  if (currentLangLabel) currentLangLabel.textContent = option.dataset.code;

  langMenu.querySelectorAll('li').forEach((li) => {
    li.setAttribute('aria-selected', li === option);
  });
}

function toggleMenu(open) {
  if (!langMenu || !langToggle) return;
  const isOpen = open ?? !langMenu.classList.contains('open');
  langMenu.classList.toggle('open', isOpen);
  langToggle.setAttribute('aria-expanded', isOpen);
}

export function updateLanguage(lang) {
  // Garante que o idioma existe no dicionário
  if (!translations[lang]) lang = 'pt';
  currentLanguage = lang;

  const settings = getSettings();
  settings.lang = lang;
  localStorage.setItem('portfolio-settings', JSON.stringify(settings));

  document.documentElement.lang = lang === 'pt' ? 'pt-br' : lang;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    const translation = translations[lang][key];

    if (translation) {
      element.innerHTML = translation;
    }

    const linkKey = `${key}-link`;
    if (translations[lang][linkKey] && element.tagName === 'A') {
      element.href = translations[lang][linkKey];
    }
  });

  updateDropdownUI(lang);

  setTexts(translations[lang]['typing-texts']);
  resetTyping();
}

export function initLanguage() {
  langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  langMenu?.addEventListener('click', (e) => {
    const item = e.target.closest('li[data-lang]');
    if (!item) return;
    updateLanguage(item.dataset.lang);
    toggleMenu(false);
  });

  // Fecha ao clicar fora ou apertar ESC
  document.addEventListener('click', () => toggleMenu(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  updateLanguage(currentLanguage);
}