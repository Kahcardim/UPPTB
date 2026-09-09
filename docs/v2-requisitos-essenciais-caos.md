# UPPTB V2 - Requisitos essenciais de caos

Status: requisito de produto preservado para V2.

## V2-CHAOS-01 - Gato pelado migratorio

O gato Sphynx com notebook/computador deve participar do sistema de caos visual entre todas as paginas institucionais da UPPTB.

Criterios:
- o gato nao pertence permanentemente a uma unica pagina;
- em um novo reload/F5, a pagina onde ele aparece pode mudar;
- ao navegar entre paginas sem novo reload, a distribuicao sorteada deve ser preservada;
- o comportamento nao pode comprometer navegacao, leitura minima ou responsividade.

## V2-CHAOS-02 - Imagens migratorias entre paginas

As imagens aleatorias do efeito Alice devem pertencer ao campus inteiro, e nao a uma pagina fixa.

Criterios:
- imagens de identidade, personagens, Beyblade, Multi e arquivos visuais devem ser distribuidas entre Home, Laboratorio Beyblade e Memorias;
- cada novo reload/F5 gera uma nova distribuicao;
- a navegacao entre paginas preserva a distribuicao atual ate o proximo reload;
- as tartarugas seguem a mesma regra de migracao;
- o caos visual e requisito de identidade, mas nao justifica quebra de viewport, overflow horizontal ou perda de legibilidade basica.

## Principio de UX preservado

A UPPTB pode ser deliberadamente caotica, mas deve continuar funcional em mobile e desktop. O efeito Alice pode mudar posicoes e distribuicao dos elementos decorativos, nunca invalidar a leitura e a navegacao essenciais.