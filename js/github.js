import { translations } from './translations.js';
import { currentLanguage } from './i18n.js';
import { initReveal } from './reveal.js';

const getLanguageIcon = (lang) => {
  const icons = {
    'JavaScript': '<i class="fab fa-js" style="color: #f7df1e;"></i>',
    'TypeScript': '<i class="fab fa-js-square" style="color: #3178c6;"></i>',
    'HTML': '<i class="fab fa-html5" style="color: #e34f26;"></i>',
    'CSS': '<i class="fab fa-css3-alt" style="color: #1572b6;"></i>',
    'Java': '<i class="fab fa-java" style="color: #007396;"></i>',
    'Python': '<i class="fab fa-python" style="color: #3776ab;"></i>',
    'PHP': '<i class="fab fa-php" style="color: #777bb4;"></i>',
  };
  return icons[lang] || '<i class="fas fa-code"></i>';
};

export async function loadGitHubProjects(username) {
  const container = document.getElementById('github-projects');
  if (!container) return;

  try {
    // Busca repositórios públicos ordenados por atualização
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);

    if (!response.ok) throw new Error('Erro ao carregar dados do GitHub');

    const repos = await response.json();

    container.innerHTML = repos
      .filter(repo => !repo.fork && repo.description)
      .slice(0, 6)
      .map(repo => {
        return `
          <div class="project-card">
            
            <h3>${repo.name.replace(/-/g, ' ')} ${repo.language ? `<span>${getLanguageIcon(repo.language)}</span>` : ''}</h3>
            
            <p>${repo.description}</p>            
            
            <div class="project-links">
              <a href="${repo.html_url}" title="Repository" target="_blank" data-i18n="view-repo">
                ${translations[currentLanguage]['view-repo']}
              </a>
              ${repo.homepage ? `
                <a href="${repo.homepage}" title="Visit Website" target="_blank" data-i18n="view-online">
                  ${translations[currentLanguage]['view-online']}
                </a>` : ''}
            </div>
          
            </div>
        `;
      })
      .join('');

    // Anima os cards recém-criados
    initReveal(container);

  } catch (error) {
    console.error('GitHub API Error:', error);
    container.innerHTML = '<p>Não foi possível carregar os projetos no momento.</p>';
  }
}