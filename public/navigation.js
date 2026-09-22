const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const navGroups = [...document.querySelectorAll('.nav-group')];
const header = document.querySelector('.site-header');

function closeMenus({ closeMobile = false } = {}) {
  navGroups.forEach((group) => { group.open = false; });

  if (closeMobile && nav && menuButton) {
    nav.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
  }
}

/* O app.js continua responsável por abrir/fechar o menu mobile.
   Este arquivo só complementa o comportamento dos submenus. */
closeMenus();

navGroups.forEach((group) => {
  group.addEventListener('toggle', () => {
    if (!group.open) return;
    navGroups.forEach((other) => {
      if (other !== group) other.open = false;
    });
  });
});

document.addEventListener('pointerdown', (event) => {
  if (!header?.contains(event.target)) closeMenus();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeMenus({ closeMobile: true });
  menuButton?.focus();
});

window.addEventListener('pageshow', () => closeMenus({ closeMobile: true }));
window.addEventListener('hashchange', () => closeMenus({ closeMobile: true }));
window.addEventListener('pagehide', () => closeMenus({ closeMobile: true }));

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 701px)').matches) {
    closeMenus({ closeMobile: true });
  }
});


function normalizePageEntry() {
  if (window.location.hash) return;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

normalizePageEntry();
window.addEventListener('pageshow', (event) => {
  closeMenus({ closeMobile: true });
  if (!window.location.hash) {
    requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
  }
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return;
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const targetFile = url.pathname.split('/').pop() || 'index.html';
  if (currentFile !== targetFile && !link.dataset.preserveHash) {
    url.hash = '';
    link.href = url.href;
  }
});
