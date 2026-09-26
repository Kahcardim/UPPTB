import { campusPages, turtleCount, fixedLargeTurtles, labOnlyImages, labOnlyAssets, storageKeys } from './runtime-config.js';
import { collectProtectedRects, placeDecorativeAsset } from './decorative-safety.js';



const campusStorageKey = storageKeys.campus;



const beybladeAssets = labOnlyAssets;



const roamingImages = [
  { src: 'assets/upptb-styleboard.webp', caption: 'MANUAL QUE O CAOS IGNOROU', classes: 'random-identity', fixedPage: 'memories' },
  { src: 'assets/images-2-.jpg', caption: 'DEPARTAMENTO DESCONHECIDO', classes: 'random-photo', fixedPage: 'memories' },
  { src: 'assets/images-1-.jpg', caption: 'ARQUIVO LEGADO', classes: 'random-photo', fixedPage: 'memories' },
  { src: 'assets/images.jpg', caption: 'A MESMA FOTO MENOR', classes: 'random-photo tiny-evidence', fixedPage: 'memories' }
];

function shuffled(values) {
  const clone = [...values];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

function distributeIds(ids) {
  const pageOrder = shuffled(campusPages);
  const assignments = {};
  shuffled(ids).forEach((id, index) => { assignments[id] = pageOrder[index % pageOrder.length]; });
  return assignments;
}

export function makeCampusDistribution() {
  const smallTurtleIds = Array.from({ length: 27 }, (_, index) => index + 1);
  const roamingImageIds = roamingImages.map((asset, index) => ({ asset, index }))
    .filter(({ asset }) => !asset.fixedPage).map(({ index }) => index);

  return {
    turtles: { ...distributeIds(smallTurtleIds), ...fixedLargeTurtles },
    images: distributeIds(roamingImageIds),
    catPage: campusPages[Math.floor(Math.random() * campusPages.length)],
    generatedAt: Date.now()
  };
}

function loadCampusDistribution() {
  try {
    const navigationEntry = performance.getEntriesByType?.('navigation')?.[0];
    const isReload = navigationEntry?.type === 'reload';
    const stored = localStorage.getItem(campusStorageKey);

    if (!stored || isReload) {
      const fresh = makeCampusDistribution();
      localStorage.setItem(campusStorageKey, JSON.stringify(fresh));
      return fresh;
    }

    const parsed = JSON.parse(stored);
    const valid = parsed?.turtles && parsed?.images && campusPages.includes(parsed?.catPage);
    if (valid) return parsed;

    const fresh = makeCampusDistribution();
    localStorage.setItem(campusStorageKey, JSON.stringify(fresh));
    return fresh;
  } catch {
    return makeCampusDistribution();
  }
}

export function initRandomizer() {
  const currentPage = document.documentElement.dataset.page || 'home';
  const randomAssetPlane = document.querySelector('#random-asset-plane');
  if (!randomAssetPlane || currentPage === 'alice') return { scatterAssets() {} };

  const campusDistribution = loadCampusDistribution();
  let turtlesCreated = false;
  let roamingImagesCreated = false;
  let hairlessCatCreated = false;

  function purgeBeybladeOutsideLab() {
    if (currentPage === 'lab') return;
    document.querySelectorAll('img').forEach((image) => {
      if (beybladeAssets.some((asset) => image.src.includes(asset))) {
        image.closest('figure')?.remove();
      }
    });
  }

  function clearLegacyRandomAssets() {
    randomAssetPlane.querySelectorAll('.random-asset:not(.alice-character)').forEach((asset) => asset.remove());
    purgeBeybladeOutsideLab();
  }

  function createHairlessCat() {
    if (hairlessCatCreated || campusDistribution.catPage !== currentPage) return;

    const figure = document.createElement('figure');
    const cat = document.createElement('img');
    const caption = document.createElement('figcaption');

    figure.className = 'random-asset random-character random-hairless-cat';
    cat.src = 'assets/sphynx-cat.svg';
    cat.alt = '';
    cat.loading = 'lazy';
    cat.decoding = 'async';
    caption.textContent = 'GATO PELADO DO TI // COMPUTADOR OCUPADO';

    figure.append(cat, caption);
    randomAssetPlane.append(figure);
    hairlessCatCreated = true;
  }

  function appendRoamingImage(asset) {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    const caption = document.createElement('figcaption');

    figure.className = ('random-asset random-character ' + asset.classes).trim();
    image.src = asset.src;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    caption.textContent = asset.caption;

    figure.append(image, caption);
    randomAssetPlane.append(figure);
  }

  function createRoamingImages() {
    if (roamingImagesCreated) return;

    roamingImages.forEach((asset, index) => {
      const targetPage = asset.fixedPage || campusDistribution.images?.[index];
      if (targetPage !== currentPage) return;
      appendRoamingImage(asset);
    });

    if (currentPage === 'lab') labOnlyImages.forEach(appendRoamingImage);
    roamingImagesCreated = true;
  }

  function createTurtles() {
    if (turtlesCreated) return;

    for (let index = 1; index <= turtleCount; index += 1) {
      if (campusDistribution.turtles?.[index] !== currentPage) continue;

      const figure = document.createElement('figure');
      const turtle = document.createElement('img');
      figure.className = 'random-asset random-turtle' + (index >= 28 ? ' large-turtle' : '');
      turtle.src = 'assets/turtles/turtle-' + String(index).padStart(2, '0') + '.webp';
      turtle.alt = '';
      turtle.loading = 'lazy';
      turtle.decoding = 'async';
      figure.append(turtle);
      randomAssetPlane.append(figure);
    }

    turtlesCreated = true;
  }

  function performLayout() {
    const main = document.querySelector('main');
    const pageHeight = Math.max(main?.scrollHeight ?? 2200, 2200);
    const hero = currentPage === 'home' ? document.querySelector('.hero') : null;
    const topStart = hero ? Math.ceil(hero.offsetTop + hero.offsetHeight + 40) : 100;
    const protectedRects = collectProtectedRects();
    const assets = [...randomAssetPlane.querySelectorAll('.random-asset:not(.alice-character)')];

    assets.forEach((asset, index) => {
      asset.style.zIndex = String(index % 2);
      placeDecorativeAsset(asset, {
        index,
        pageHeight,
        topStart,
        protectedRects,
        rotation: 12
      });
    });
  }

  clearLegacyRandomAssets();
  createHairlessCat();
  createRoamingImages();
  createTurtles();
  purgeBeybladeOutsideLab();
  performLayout();
  randomAssetPlane.dataset.randomizerReady = 'true';

  let frame = null;
  function scatterAssets() {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => { frame = null; performLayout(); });
  }
  randomAssetPlane.querySelectorAll('.random-asset img').forEach((image) => {
    image.addEventListener('load', scatterAssets, { once: true });
  });
  const mainObserver = new ResizeObserver(scatterAssets);
  const mainElement = document.querySelector('main');
  if (mainElement) mainObserver.observe(mainElement);
  scatterAssets();
  window.addEventListener('load', scatterAssets, { once: true });
  document.fonts?.ready?.then(scatterAssets).catch(() => {});
  window.addEventListener('resize', scatterAssets, { passive: true });
  return { scatterAssets };
}
