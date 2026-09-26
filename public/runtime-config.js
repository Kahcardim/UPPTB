// Contratos de domínio compartilhados; alterações exigem regressão.
export const campusPages = ['home', 'lab', 'english', 'memories'];
export const turtleCount = 31;
export const fixedLargeTurtles = { 28: 'home', 29: 'lab', 30: 'english', 31: 'memories' };
export const labOnlyImages = [
  { src: 'assets/pretend-were-the-in-universe-general-public-who-do-you-v0-mejb5ymxzwkg1.webp', caption: 'ROBIN.EXE // 01', classes: '' },
  { src: 'assets/ekusu-remade.webp', caption: 'ROBIN.EXE // 02', classes: '' },
  { src: 'assets/Beyblade_X_-_Ekusu_Kurosu.webp', caption: 'CAPACETE REMOVIDO EM PRODUÇÃO', classes: '' },
  { src: 'assets/multi-nanairo-from-beyblade-x-v0-sg3enaxuhy8f1.webp', caption: 'MULTI REBORN // REITORIA', classes: '' }
];
export const storageKeys = Object.freeze({ campus: 'upptb-campus-distribution-v10', alice: 'upptb-alice-characters-v3' });
export const labOnlyAssets = labOnlyImages.map(({src}) => src.split('/').pop());
export const canonicalName = 'Universidade publica turtles and bleys';
export const breakpoints = Object.freeze({mobile:700, tablet:1024});
