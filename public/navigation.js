const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const navGroups = [...document.querySelectorAll('.nav-group')];

function closeMenus({ closeMobile = true } = {}) {
  navGroups.forEach((group) => { group.open = false; });

  if (closeMobile && nav && menuButton) {
    nav.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
  }
}

function openMobileMenu() {
  if (!nav || !menuButton) return;
  nav.dataset.open = 'true';
  menuButton.setAttribute('aria-expanded', 'true');
}

function toggleMobileMenu() {
  if (!nav || !menuButton) return;
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) closeMenus();
  else openMobileMenu();
}

/* Estado inicial sempre fechado, inclusive se alguma página antiga vier com <details open>. */
closeMenus();

menuButton?.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMobileMenu();
});

navGroups.forEach((group) => {
  group.addEventListener('toggle', () => {
    if (!group.open) return;
    navGroups.forEach((other) => {
      if (other !== group) other.open = false;
    });
  });
});

nav?.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link) return;
  closeMenus();
});

document.addEventListener('pointerdown', (event) => {
  const header = document.querySelector('.site-header');
  if (!header?.contains(event.target)) closeMenus({ closeMobile: false });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeMenus();
  menuButton?.focus();
});

window.addEventListener('pageshow', closeMenus);
window.addEventListener('hashchange', closeMenus);

window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 701px)').matches) closeMenus();
});
