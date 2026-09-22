# Escopo de Regressão Automatizada | UPPTB

## Objetivo
Impedir que alterações de UX, caos visual ou navegação quebrem contratos já aceitos da UPPTB. A suíte é um gate técnico: falhou teste, o deploy não deve executar.

## Gate CI
O workflow regression.yml roda em push e pull request para feature/home-v1-requirements, além de execução manual. Ambiente: Node.js 24 + pnpm 11.19.0. Comando oficial: pnpm test.

## Matriz de regressão

| ID | Área | Risco coberto | Evidência |
| --- | --- | --- | --- |
| REG-001 | Backend | contrato de health e 404 | tests/app.test.js |
| REG-002 | Home | identidade e fóssil fundador | app.test.js + regression.test.js |
| REG-003 | Assets | 31 tartarugas e assets críticos | tests/app.test.js |
| REG-004 | Estrutura | páginas normais carregam plano aleatório e navegação | regression.test.js |
| REG-005 | Alice | não recebe plano global/tartarugas | regression.test.js |
| REG-006 | Alice | frase/estado não rotacionam por timer | regression.test.js |
| REG-007 | Alice | borboletas no frame e gato no diálogo | regression.test.js |
| REG-008 | Beyblade | bladers/Beys globais ficam no Lab | regression.test.js |
| REG-009 | UX caos | dispersão tenta evitar conteúdo | regression.test.js |
| REG-010 | Gato pelado | continua migratório no campus normal | regression.test.js |

## Critérios de aprovação
1. 100% dos testes automatizados verdes.
2. Nenhum teste ignorado para liberar deploy.
3. Regressão executada antes do deploy de Pages.
4. Mudança em requisito protegido exige primeiro mudar o requisito e depois o teste. O teste não deve ser adaptado silenciosamente a um bug.

## Regressão manual obrigatória
- Desktop e mobile: nenhuma tartaruga cobre título, parágrafo, botão, menu, código ou card.
- Repetir F5 várias vezes para exercitar posições aleatórias.
- Nenhum blader/Beyblade fora do Laboratório.
- Nenhuma tartaruga na Alice.
- Recorte da Alice em 360, 390, 768, 1024 e desktop.
- Gato da Alice inteiro durante a rota e sem sair do bloco da frase.
- As 15 borboletas permanecem confinadas à foto.
- Alice troca estado apenas no F5 ou seleção manual.
- Gato pelado migra entre páginas normais.
- Menu validado por mouse, teclado, Escape e mobile.

## Fora do escopo automático atual
Pixel-perfect, screenshot diff, contraste calculado, browser real, Lighthouse e auditoria visual completa. Permanecem manuais até existir suíte E2E/browser.

## Severidade
P0: página indisponível, deploy quebrado ou contrato principal removido.
P1: Alice violando isolamento/F5, Beyblade fora do Lab ou tartaruga bloqueando interação.
P2: recorte, desalinhamento responsivo, overflow ou menu inconsistente.
P3: detalhe cosmético sem impacto de leitura/interação.
