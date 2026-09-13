const alicePages = ['home', 'lab', 'english', 'memories'];
const aliceStorageKey = 'upptb-alice-characters-v1';
const alicePlane = document.querySelector('#random-asset-plane');
const alicePage = document.documentElement.dataset.page || 'home';

const gatoIdeias = [
  'Alice, e se o próximo passo estiver na página errada?',
  'Alice, talvez o bug seja a porta.',
  'E se você fizer exatamente o contrário?',
  'Alice, essa ideia é ruim o suficiente para funcionar.',
  'Talvez você não esteja perdida. Talvez o mapa esteja errado.',
  'E se isso virar requisito?',
  'Alice, testa antes de confiar.',
  'Talvez o caminho correto seja o que ninguém documentou.',
  'E se a página souber mais que o usuário?',
  'Alice, uma ideia absurda ainda pode sobreviver ao Gate.'
];

const chapeleiroFrases = [
  'A reunião começou ontem e termina antes de começar.',
  'O chá está pronto. O requisito não.',
  'Robin venceu. Favor não validar a evidência.',
  'A tartaruga aprovou. Ninguém perguntou nada.',
  'Hoje é terça-feira em produção e sábado no backend.',
  'O bug foi promovido a comportamento esperado.',
  'A documentação está correta. Portanto, provavelmente está desatualizada.',
  'O deploy passou. Isso é extremamente suspeito.',
  'Se tudo faz sentido, alguma coisa deu errado.',
  'O relógio está atrasado porque chegou cedo demais.',
  'O PO aprovou. O QA começou a desconfiar.',
  'A regressão voltou para verificar se você sentiu saudade.',
  'Não mexa nessa variável. Ela está emocionalmente instável.',
  'A Alice apertou F5. Agora ninguém trabalha aqui.',
  'Bem-vindo à UPPTB. A saída mudou de lugar.'
];

const aliceStyle = document.createElement('style');
aliceStyle.textContent = `
  .alice-character {
    width: clamp(7rem, 14vw, 11rem) !important;
    opacity: .88;
  }
  .alice-character img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  .alice-character figcaption {
    width: min(15rem, 42vw) !important;
    max-width: 15rem !important;
    margin-top: .25rem !important;
    padding: .55rem .7rem !important;
    border: 1px solid rgba(53,255,102,.45);
    border-radius: 14px;
    background: rgba(7,18,10,.94) !important;
    color: #f4fff6 !important;
    font: 800 .72rem/1.35 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
    white-space: normal;
  }
  .alice-gato figcaption::before {
    content: 'GATO → ALICE\\A';
    white-space: pre;
    color: var(--green);
  }
  .alice-chapeleiro figcaption::before {
    content: 'CHAPELEIRO // CAOS\\A';
    white-space: pre;
    color: var(--warning);
  }
  @media (max-width: 700px) {
    .alice-character {
      width: clamp(4.8rem, 20vw, 6.5rem) !important;
      max-width: 6.5rem !important;
      opacity: .72;
    }
    .alice-character figcaption {
      width: min(8.5rem, 38vw) !important;
      max-width: 8.5rem !important;
      padding: .4rem .5rem !important;
      font-size: .57rem !important;
      line-height: 1.3 !important;
    }
  }
`;
document.head.append(aliceStyle);

function aliceRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function aliceRandomPage() {
  return alicePages[Math.floor(Math.random() * alicePages.length)];
}

function makeAliceState() {
  return {
    gato: {
      visible: Math.random() < 0.58,
      page: aliceRandomPage(),
      phrase: aliceRandomItem(gatoIdeias)
    },
    chapeleiro: {
      visible: Math.random() < 0.58,
      page: aliceRandomPage(),
      phrase: aliceRandomItem(chapeleiroFrases)
    },
    generatedAt: Date.now()
  };
}

function loadAliceState() {
  const navigation = performance.getEntriesByType('navigation')[0];
  const isReload = navigation?.type === 'reload';

  try {
    const stored = localStorage.getItem(aliceStorageKey);
    if (!stored || isReload) {
      const fresh = makeAliceState();
      localStorage.setItem(aliceStorageKey, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(stored);
  } catch {
    return makeAliceState();
  }
}

function placeAliceCharacter(config) {
  if (!alicePlane || !config.visible || config.page !== alicePage) return;

  const figure = document.createElement('figure');
  const image = document.createElement('img');
  const caption = document.createElement('figcaption');

  figure.className = `random-asset random-character alice-character ${config.className}`;
  image.src = config.src;
  image.alt = '';
  image.loading = 'lazy';
  caption.textContent = config.phrase;
  figure.append(image, caption);
  alicePlane.append(figure);

  const pageHeight = Math.max(document.querySelector('main')?.scrollHeight ?? 2400, 2400);
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const maxTop = Math.max(pageHeight - (mobile ? 260 : 420), 700);
  figure.style.top = `${Math.floor(120 + Math.random() * (maxTop - 120))}px`;
  figure.style.left = `${(Math.random() * (mobile ? 72 : 82)).toFixed(1)}%`;
  figure.style.transform = `rotate(${(Math.random() * 20 - 10).toFixed(1)}deg)`;
  figure.style.zIndex = '7';
}

const aliceState = loadAliceState();

placeAliceCharacter({
  ...aliceState.gato,
  src: 'assets/gato.png',
  className: 'alice-gato'
});

placeAliceCharacter({
  ...aliceState.chapeleiro,
  src: 'assets/chapeleiro.png',
  className: 'alice-chapeleiro'
});
