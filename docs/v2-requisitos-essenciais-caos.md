# UPPTB V2 - Requisitos essenciais de caos

Status: requisito de produto preservado para V2.

## V2-CHAOS-01 - Gato pelado migratorio

O gato Sphynx com notebook/computador deve participar do sistema de caos visual entre todas as paginas institucionais da UPPTB.

Criterios:
- o gato nao pertence permanentemente a uma unica pagina;
- em um novo reload/F5, a pagina onde ele aparece pode mudar;
- ao navegar entre paginas sem novo reload, a distribuicao sorteada deve ser preservada;
- o comportamento nao pode comprometer navegacao, leitura minima ou responsividade.

## V2-CHAOS-02 - Elementos migratorios do efeito Alice

O efeito Alice continua distribuindo elementos decorativos pelo campus inteiro, mas nem todo elemento precisa migrar de pagina.

Criterios:
- imagens comuns, personagens, Beyblade, Multi e arquivos visuais continuam podendo migrar entre Home, Laboratorio Beyblade, Desenvolvimento de Ingles e Memorias;
- as tartarugas pequenas continuam migratorias;
- o gato pelado continua migratorio;
- cada novo reload/F5 pode gerar nova distribuicao para os elementos migratorios;
- a navegacao entre paginas preserva a distribuicao atual ate o proximo reload;
- o caos visual e requisito de identidade, mas nao justifica quebra de viewport, overflow horizontal ou perda de legibilidade basica.

## V2-CHAOS-03 - Logos e tartarugas grandes fixas por pagina

As imagens de identidade da UPPTB e as quatro tartarugas grandes deixam de migrar entre paginas.

Criterios:
- cada tartaruga grande pertence permanentemente a uma das quatro paginas do campus;
- a tartaruga grande 28 pertence a Home;
- a tartaruga grande 29 pertence ao Laboratorio Beyblade;
- a tartaruga grande 30 pertence ao Desenvolvimento de Ingles;
- a tartaruga grande 31 pertence a Memorias;
- a logo manifesto permanece vinculada a Home;
- o styleboard de identidade permanece vinculado a Memorias;
- esses elementos continuam podendo receber posicao e rotacao aleatorias dentro da propria pagina;
- reload/F5 nao deve transferir esses elementos para outra pagina.

## Principio de UX preservado

A UPPTB pode ser deliberadamente caotica, mas deve continuar funcional em mobile e desktop. O efeito Alice pode mudar posicoes e distribuicao dos elementos decorativos migratorios, nunca invalidar a leitura e a navegacao essenciais.