# UPPTB | Gate 1 — Benchmark

**Status:** aprovado pelo PO/QA  
**Data:** 9 de setembro de 2026  
**Branch:** `feature/home-v1-requirements`

## Objetivo

Registrar as referências e, principalmente, as decisões de produto extraídas do benchmark antes de qualquer implementação visual. Este gate não autoriza a criação da Home; ele orienta o escopo e a arquitetura dos próximos gates.

## Referências observadas

Foram usadas como referência universidades e laboratórios com forte organização de informação, acessibilidade e apresentação de projetos, incluindo MIT, MIT Media Lab, Harvard e Stanford. O objetivo não é copiar estética ou estrutura acadêmica formal, mas entender padrões úteis de navegação, hierarquia, acessibilidade, descoberta progressiva e apresentação de trabalho.

## Decisão BM-01 — Recrutador não governa a experiência

A UPPTB não será simplificada para que um recrutador entenda toda a proposta em poucos segundos. Recrutadores podem visitar o projeto, mas não são o usuário prioritário da experiência.

Quando houver avaliação profissional, o valor deve estar verificável no código, arquitetura, testes, documentação, histórico de decisões e qualidade da implementação. A identidade da UPPTB não deve ser diluída para se adequar a uma expectativa de RH.

**Consequência:** clareza estrutural continua obrigatória, mas não deve eliminar a descoberta, a lore, o humor ou a personalidade do produto.

## Decisão BM-02 — A dimensão acadêmica é parte real do produto

A metáfora de universidade não é apenas embalagem visual. A UPPTB possui uma camada acadêmica informal baseada em metodologias, modos de estudo, laboratórios e projetos reais.

A V1 deve prever arquitetura capaz de acomodar essa camada sem fingir credenciamento, diploma reconhecido ou formação acadêmica oficial.

Conteúdos já existentes que precisam caber nessa estrutura incluem:

- Turtle Step V1 — Learning
- Turtle Step V2 — Projects
- Turtle Step V3 — Life
- Turtle Drill
- Turtle Talk
- Negation and Negation
- Turtle Suicide
- Beyblade Lab
- QA Lab
- Projects Lab

Esses itens não precisam virar automaticamente dez entradas no menu principal. O Gate 3, Arquitetura de Informação, definirá como se relacionam com graduação informal, laboratórios, áreas, módulos e navegação.

## Decisão BM-03 — Universidade por fora, laboratório por dentro

A UPPTB combina quatro fontes de referência:

**Universidades:** arquitetura de informação, acessibilidade, navegação e organização institucional.  
**Laboratórios:** experimentação, projetos e liberdade criativa.  
**Portfólios técnicos:** evidência de código, decisões, testes e documentação.  
**Identidade UPPTB:** Turtle Step, Beyblade, Robin, Multi, Army Turtle, New Tamar World, humor e caos controlado.

A definição de produto adotada para orientar os próximos gates é:

> A UPPTB é uma universidade informal e fictícia que funciona como laboratório pessoal de aprendizado, tecnologia, QA e projetos, com uma identidade própria deliberadamente peculiar.

## Decisão BM-04 — Descoberta progressiva sem esterilizar o caos

O benchmark valida o uso de hierarquia e descoberta progressiva para impedir que todo o conteúdo seja despejado na Home. Isso não significa tornar a Home convencional.

A navegação deve permitir que o visitante avance de uma visão geral para áreas, conteúdos, laboratórios, documentos e lore sem perder a identidade do projeto.

## Decisão BM-05 — Acessibilidade é requisito transversal

Os padrões observados reforçam requisitos já previstos: navegação por teclado, foco visível, landmarks semânticos, hierarquia de títulos, contraste, alternativa textual, prevenção de keyboard traps, suporte a movimento reduzido e mecanismo de pular navegação repetitiva quando aplicável.

Esses critérios serão formalizados no Gate 6, Requisitos Não Funcionais, antes da implementação da Home.

## Riscos identificados

1. Crescimento descontrolado da navegação ao adicionar graduação, laboratórios, modos de estudo, lore e projetos.
2. Transformar a metáfora acadêmica em aparência institucional demais e apagar a personalidade do produto.
3. Fazer o inverso e usar o caos como justificativa para navegação ruim ou conteúdo inacessível.
4. Confundir graduação informal com formação acadêmica reconhecida.
5. Criar páginas e itens de menu antes de definir relações entre graduação, labs, metodologias e áreas existentes.

## Bugs de interpretação corrigidos durante o Gate 1

**BUG-BM01:** o recrutador foi tratado como usuário prioritário da experiência.  
**Correção:** recrutador não governa UX; engenharia e evidências técnicas continuam acessíveis sem descaracterizar o produto.

**BUG-BM02:** a dimensão acadêmica da UPPTB foi subestimada como mera metáfora visual.  
**Correção:** graduação informal, Turtle Step, modos de inglês e laboratórios passam a ser considerados componentes reais da arquitetura de produto.

## Critério de saída

Gate 1 aprovado pelo PO/QA após incorporação das correções BM-01 e BM-02.

**Próximo gate permitido:** Gate 2 — Escopo V1.  
**Frontend/Home:** continua bloqueado.
