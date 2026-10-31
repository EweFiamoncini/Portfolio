import { initMenu } from './menu.js';
import { initLanguage } from './i18n.js';
import { initTheme } from './theme.js';
import { initTyping } from './typing.js';
import { initScroll } from './scroll.js';
import { translations } from './translations.js';
import { loadGitHubProjects } from './github.js';
import { initReveal } from './reveal.js';

function init() {
  initReveal();
  initMenu();
  initTheme();
  initScroll();
  initTyping([]);
  initLanguage();
  loadGitHubProjects('EweFiamoncini');
}

init();