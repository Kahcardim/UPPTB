const campusPages = ['home', 'lab', 'english', 'memories'];
const turtleCount = 31;
const campusStorageKey = 'upptb-campus-distribution-v8';

const fixedLargeTurtles = { 28: 'home', 29: 'lab', 30: 'english', 31: 'memories' };

const beybladeAssets = [
  'pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp',
  'ekusu-remade.webp',
  'Beyblade_X_-_Ekusu_Kurosu.webp',
  'multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'
];

const roamingImages = [
  { src: 'assets/upptb-styleboard.webp', caption: 'MANUAL QUE O CAOS IGNOROU', classes: 'random-identity', fixedPage: 'memories' },
  { src: 'assets/pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp', caption: 'ROBIN.EXE // 01', classes: '', fixedPage: 'lab' },
  { src: 'assets/ekusu-remade.webp', caption: 'ROBIN.EXE // 02', classes: '', fixedPage: 'lab' },
  { src: 'assets/Beyblade_X_-_Ekusu_Kurosu.webp', caption: 'CAPACETE REMOVIDO EM PRODUÇÃO', classes: '', fixedPage: 'lab' },
  { src: 'assets/multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp', caption: 'MULTI REBORN // REITORIA', classes: '', fixedPage: 'lab' },
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
  // Regra de negócio: uma ocorrência nasce no carregamento inicial/F5 e
  // permanece consistente durante a navegação entre os campi.
  // Só um reload real cria um novo mapa.
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

function randomBetween(min, max) { return Math.random() * (max - min) + min; }

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
    // Fallbacks antigos não podem disputar leitura com o conteúdo real.
    randomAssetPlane.querySelectorAll('.random-asset').forEach((asset) => asset.remove());
    purgeBeybladeOutsideLab();
  }

  function createHairlessCat() {
    if (hairlessCatCreated || campusDistribution.catPage !== currentPage) return;
    const figure = document.createElement('figure');
    const cat = document.createElement('img');
    const caption = document.createElement('figcaption');
    figure.className = 'random-asset random-character random-hairless-cat';
    cat.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sphynx_kitten.JPG';
    cat.alt = ''; cat.loading = 'lazy'; cat.decoding = 'async'; cat.referrerPolicy = 'no-referrer';
    caption.textContent = 'GATO PELADO DO TI // COMPUTADOR OCUPADO';
    figure.append(cat, caption); randomAssetPlane.append(figure); hairlessCatCreated = true;
  }

  function createRoamingImages() {
    if (roamingImagesCreated) return;
    roamingImages.forEach((asset, index) => {
      const targetPage = asset.fixedPage || campusDistribution.images?.[index];
      if (targetPage !== currentPage) return;
      if (currentPage !== 'lab' && beybladeAssets.some((name) => asset.src.includes(name))) return;
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const caption = document.createElement('figcaption');
      figure.className = ('random-asset random-character ' + asset.classes).trim();
      image.src = asset.src; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
      caption.textContent = asset.caption; figure.append(image, caption); randomAssetPlane.append(figure);
    });
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
      turtle.alt = ''; turtle.loading = 'lazy'; turtle.decoding = 'async'; figure.append(turtle); randomAssetPlane.append(figure);
    }
    turtlesCreated = true;
  }

  // EPIC performance: assets decorativos ficam abaixo do conteúdo, portanto não
  // precisam executar dezenas de medições de layout por item. O posicionamento
  // usa faixas seguras e nunca oculta uma ocorrência válida.
  function placeAsset(asset, index, pageHeight) {
    const isLarge = asset.classList.contains('large-turtle') || asset.classList.contains('random-character');
    const isMobile = window.innerWidth <= 700;
    const assetHeight = isLarge ? (isMobile ? 150 : 320) : (isMobile ? 96 : 180);
    const hero = currentPage === 'home' ? document.querySelector('.hero') : null;
    const safeTop = hero ? Math.ceil(hero.offsetTop + hero.offsetHeight + 48) : 120;
    const topLimit = Math.max(pageHeight - assetHeight, safeTop + 140);
    const isCat = asset.classList.contains('random-hairless-cat');
    const homeLanes = isMobile ? [1, 75] : [.5, 89];
    const defaultLanes = isMobile ? [1, 73] : [1.5, 12, 76, 86];
    const lanes = currentPage === 'home' ? homeLanes : defaultLanes;
    const lane = isCat ? lanes[index % lanes.length] : lanes[index % lanes.length];
    const usableHeight = Math.max(topLimit - safeTop, 140);
    const bandCount = Math.max(1, Math.floor(usableHeight / (isLarge ? 340 : 220)));
    const band = index % bandCount;
    const bandSize = usableHeight / bandCount;
    const jitter = Math.min(bandSize * .55, isMobile ? 90 : 150);

    asset.hidden = false;
    asset.style.top = Math.round(safeTop + band * bandSize + randomBetween(0, Math.max(12, jitter))) + 'px';
    asset.style.left = lane + '%';
    asset.style.transform = 'rotate(' + randomBetween(-12, 12).toFixed(1) + 'deg)';
    asset.style.zIndex = String(index % 2);
  }

  function scatterAssets() {
    const main = document.querySelector('main');
    const pageHeight = Math.max(main?.scrollHeight ?? 2200, 2200);
    const assets = [...randomAssetPlane.querySelectorAll('.random-asset')];
    assets.forEach((asset, index) => placeAsset(asset, index, pageHeight));
  }

  clearLegacyRandomAssets();
  createHairlessCat(); createRoamingImages(); createTurtles();
  purgeBeybladeOutsideLab();
  window.addEventListener('load', purgeBeybladeOutsideLab, { once: true });
  randomAssetPlane.dataset.randomizerReady = 'true';
  // Um passe imediato mantém o efeito Alice instantâneo. Um segundo passe no
  // próximo frame absorve dimensões já conhecidas sem bloquear navegação.
  scatterAssets();
  requestAnimationFrame(scatterAssets);

  let resizeTimer;
  const scheduleLayout = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(scatterAssets, 180);
  };
  window.addEventListener('resize', scheduleLayout, { passive: true });

  return { scatterAssets };
}
