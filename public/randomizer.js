const campusPages = ['home', 'lab', 'english', 'memories'];
const turtleCount = 31;
const campusStorageKey = 'upptb-campus-distribution-v5';

const fixedLargeTurtles = { 28: 'home', 29: 'lab', 30: 'english', 31: 'memories' };

const roamingImages = [
  { src: 'assets/upptb-collage.webp', caption: 'IDENTIDADE ULTRA TURTLE', classes: 'random-identity', fixedPage: 'home' },
  { src: 'assets/upptb-styleboard.webp', caption: 'MANUAL QUE O CAOS IGNOROU', classes: 'random-identity', fixedPage: 'memories' },
  { src: 'assets/pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp', caption: 'ROBIN.EXE // 01', classes: '', fixedPage: 'lab' },
  { src: 'assets/ekusu-remade.webp', caption: 'ROBIN.EXE // 02', classes: '', fixedPage: 'lab' },
  { src: 'assets/Beyblade_X_-_Ekusu_Kurosu.webp', caption: 'CAPACETE REMOVIDO EM PRODUÇÃO', classes: '', fixedPage: 'lab' },
  { src: 'assets/multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp', caption: 'MULTI REBORN // REITORIA', classes: '', fixedPage: 'lab' },
  { src: 'assets/images-2-.jpg', caption: 'DEPARTAMENTO DESCONHECIDO', classes: 'random-photo' },
  { src: 'assets/images-1-.jpg', caption: 'ARQUIVO LEGADO', classes: 'random-photo' },
  { src: 'assets/images.jpg', caption: 'A MESMA FOTO MENOR', classes: 'random-photo tiny-evidence' }
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
  const navigation = performance.getEntriesByType('navigation')[0];
  const isReload = navigation?.type === 'reload';
  try {
    const stored = localStorage.getItem(campusStorageKey);
    if (!stored || isReload) {
      const fresh = makeCampusDistribution();
      localStorage.setItem(campusStorageKey, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(stored);
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

  function clearLegacyRandomAssets() {
    randomAssetPlane.querySelectorAll('.random-asset').forEach((asset) => asset.remove());
    if (currentPage !== 'lab') {
      const beybladeAssets = ['pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp','ekusu-remade.webp','Beyblade_X_-_Ekusu_Kurosu.webp','multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp'];
      document.querySelectorAll('img').forEach((image) => {
        if (beybladeAssets.some((asset) => image.src.includes(asset))) image.closest('figure')?.remove();
      });
    }
  }

  function createHairlessCat() {
    if (hairlessCatCreated || campusDistribution.catPage !== currentPage) return;
    const figure = document.createElement('figure');
    const cat = document.createElement('img');
    const caption = document.createElement('figcaption');
    figure.className = 'random-asset random-character random-photo random-hairless-cat';
    cat.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Sphynx_kitten.JPG';
    cat.alt = ''; cat.loading = 'lazy'; cat.referrerPolicy = 'no-referrer';
    caption.textContent = 'GATO PELADO DO TI // COMPUTADOR OCUPADO';
    figure.append(cat, caption); randomAssetPlane.append(figure); hairlessCatCreated = true;
  }

  function createRoamingImages() {
    if (roamingImagesCreated) return;
    roamingImages.forEach((asset, index) => {
      const targetPage = asset.fixedPage || campusDistribution.images?.[index];
      if (targetPage !== currentPage) return;
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const caption = document.createElement('figcaption');
      figure.className = ('random-asset random-character ' + asset.classes).trim();
      image.src = asset.src; image.alt = ''; image.loading = 'lazy';
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
      turtle.alt = ''; turtle.loading = 'lazy'; figure.append(turtle); randomAssetPlane.append(figure);
    }
    turtlesCreated = true;
  }

  function overlapsContent(asset) {
    const rect = asset.getBoundingClientRect();
    const probes = [[rect.left+rect.width*.2,rect.top+rect.height*.2],[rect.left+rect.width*.5,rect.top+rect.height*.5],[rect.right-rect.width*.2,rect.bottom-rect.height*.2]];
    return probes.some(([x,y]) => document.elementsFromPoint(x,y).some((element) =>
      element.closest('main > section, article, pre, .hero-copy, .hero-actions, .nav-panel') && !element.closest('.random-asset-plane')));
  }

  function scatterAssets() {
    const main = document.querySelector('main');
    const pageHeight = Math.max(main?.scrollHeight ?? 2400, 2400);
    randomAssetPlane.querySelectorAll('.random-asset').forEach((asset, index) => {
      const isLarge = asset.classList.contains('large-turtle') || asset.classList.contains('random-character');
      const topLimit = Math.max(pageHeight - (isLarge ? 440 : 220), 600);
      let attempts = 0;
      do {
        asset.style.top = randomBetween(90, topLimit).toFixed(0) + 'px';
        asset.style.left = randomBetween(0, isLarge ? 78 : 88).toFixed(1) + '%';
        asset.style.transform = 'rotate(' + randomBetween(-20, 20).toFixed(1) + 'deg)';
        attempts += 1;
      } while (overlapsContent(asset) && attempts < 24);
      if (overlapsContent(asset)) asset.style.opacity = '.18';
      asset.style.zIndex = String(index % 2);
    });
  }

  clearLegacyRandomAssets();
  createHairlessCat(); createRoamingImages(); createTurtles(); scatterAssets();
  window.addEventListener('load', scatterAssets, { once: true });
  return { scatterAssets };
}
