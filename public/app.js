import { storageKeys, labOnlyAssets } from './runtime-config.js';
import './alice.js';
import { initRouter } from './router.js';
import { initRandomizer } from './randomizer.js';

const activeStorageKeys = new Set(Object.values(storageKeys));

function pruneLegacyStorage() {
  try {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      const isUpptbRuntimeRecord = key?.startsWith('upptb-campus-distribution-') ||
        key?.startsWith('upptb-alice-characters-');
      if (isUpptbRuntimeRecord && !activeStorageKeys.has(key)) localStorage.removeItem(key);
    }
  } catch {
    // Storage indisponível não pode bloquear a interface.
  }
}

pruneLegacyStorage();




// Navegação é funcionalidade crítica: inicializa antes de qualquer caos visual.
initRouter();

// Guard de domínio: Beyblade e Multi nunca sobrevivem fora do laboratório.
if (document.documentElement.dataset.page !== 'lab') {
  const labOnly = labOnlyAssets;
  document.querySelectorAll('img').forEach((image) => {
    if (labOnly.some((asset) => image.src.includes(asset))) image.closest('figure')?.remove();
  });
}

let randomizer = { scatterAssets() {} };
const bootRandomizer = () => { randomizer = initRandomizer(); };
if ('requestIdleCallback' in window) {
  window.requestIdleCallback(bootRandomizer, { timeout: 450 });
} else {
  window.setTimeout(bootRandomizer, 60);
}

const chaosButton = document.querySelector('#chaos-button');
const terminalOutput = document.querySelector('#terminal-output');
const audits = [
  '$ upptb audit\nresultado ............ 0 bugs encontrados\nqa ................... recusou acreditar\nstatus ................ executar novamente',
  '$ upptb audit --deep\nrobinWins ............. 0\nregression ............ consistente\nmetodologia ........... turtle step\nstatus ................ suspeitamente estável',
  '$ upptb audit --institutional\npaginas ............... 4\ntartarugas pequenas ... migratorias\ntartarugas grandes .... fixas por pagina\nlogos .................. fixas por pagina\nimagens ................ migratorias\ngato pelado ........... migratorio\nproduto ................ caos responsivo'
];
let auditIndex = 0;

chaosButton?.addEventListener('click', () => {
  if (!terminalOutput) return;
  const form = document.querySelector('[data-terminal-form]');
  if (form?.querySelector('input')?.value.trim()) { form.requestSubmit(); return; }
  terminalOutput.textContent = audits[auditIndex % audits.length];
  auditIndex += 1;
  randomizer.scatterAssets();
});

