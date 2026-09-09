# UPPTB | Home V1 — Implementação

**Branch:** `feature/home-v1-requirements`  
**Status:** implementada para validação manual do PO/QA  
**Identidade:** HIGH  
**Severidade de regressão:** ULTRA TURTLE

## Escopo implementado

1. Hero com logo completa da UPPTB, identidade institucional peculiar e texto sobre o fundador.
2. Origem da UPPTB com Turtle Step, Beyblade, QA e governança do projeto.
3. Fóssil fundador preservado literalmente.
4. Carrossel Turtle/Bey com marcas minimalistas e frases/easter eggs.
5. Beyblade Lab com exemplos de `const`, `let`, `if`, `else` e `console.log()`.
6. English Department com Turtle Drill, Turtle Talk, Negation and Negation e Turtle Suicide.
7. Exemplos de erros reais de inglês transformados em material didático.
8. Forbidden Turtle Archive com links para documentos do projeto.
9. Terminal institucional com interações de caos controlado.
10. Navegação responsiva, skip link, foco visível, reduced motion e controles acessíveis do carrossel.

## Arquivos principais

- `public/index.html`
- `public/styles.css`
- `public/app.js`
- `public/assets/upptb-logo.svg`
- `public/assets/turtle-mark.svg`
- `public/assets/bey-mark.svg`
- `docs/UPPTB-Arquivo-Proibido-Turtle.md`
- `src/app.js`
- `tests/app.test.js`

## Requisitos de identidade que não podem ser removidos

O seguinte HTML é fóssil fundador e deve permanecer visível:

```html
<h2>Let's rip, dude. Turtle Step. Robin loses. Multi reborn. Site created.</h2>
```

A Home não deve ser simplificada para parecer um template corporativo ou para facilitar entendimento de recrutadores. Clareza estrutural continua obrigatória, mas Turtle Step, Beyblade, QA, inglês, lore, humor e caos controlado são parte do produto.

## Checklist de QA manual

### Desktop

- [ ] Hero carrega com logo completa sem distorção.
- [ ] Header permanece legível durante scroll.
- [ ] Todos os links de âncora levam à seção correta.
- [ ] Carrossel avança e volta pelos botões.
- [ ] Carrossel responde às setas esquerda/direita quando focado.
- [ ] Exemplos de JavaScript não quebram layout horizontalmente.
- [ ] Quatro modos de inglês aparecem completos.
- [ ] Downloads apontam para arquivos existentes.
- [ ] Terminal troca de mensagem ao executar auditoria.

### Mobile

- [ ] Menu fechado por padrão.
- [ ] Botão Menu abre e fecha navegação.
- [ ] Selecionar um link fecha o menu.
- [ ] Nenhum conteúdo gera scroll horizontal indesejado.
- [ ] Cards, código e tabela de erros permanecem legíveis.
- [ ] Carrossel continua navegável por toque.

### Acessibilidade

- [ ] Tab percorre links e botões em ordem lógica.
- [ ] Foco é claramente visível.
- [ ] Skip link aparece ao receber foco e leva ao conteúdo.
- [ ] Logo possui descrição útil.
- [ ] Ícones decorativos não geram ruído desnecessário.
- [ ] Heading hierarchy permanece lógica.
- [ ] Modo reduced motion não depende de animações.
- [ ] Menu mobile expõe `aria-expanded` corretamente.

### Identidade

- [ ] Fóssil fundador está literal e visível.
- [ ] “Identidade HIGH · Severidade ULTRA TURTLE” está presente.
- [ ] Robin perdeu de novo em pelo menos um ponto da experiência.
- [ ] Turtle Step está explicitamente representado.
- [ ] Todos os quatro modos de inglês estão presentes.
- [ ] O site deixa claro que a universidade é informal/fictícia.
- [ ] A Home parece UPPTB, não template genérico.

## Validação automatizada planejada

`tests/app.test.js` foi ampliado para cobrir:

- contrato de health check;
- entrega da Home;
- preservação do fóssil fundador;
- presença dos modos de inglês e do Forbidden Turtle Archive;
- disponibilidade dos assets principais;
- entrega do documento proibido;
- fallback JSON 404;
- integridade do catálogo de 255 frases.

**Observação:** os testes foram escritos e versionados, mas não foram executados neste ambiente. Não considerar `build/test passed` sem execução real.
