# Regras canônicas - rascunho para estudo

Este documento não é a lista final de regras canônicas da UPPTB. Ele registra apenas regras já formalizadas antes da Auditoria 02 que não podem ficar sem proteção enquanto o estudo de AUD-23 continua.

| ID | Regra existente | Cobertura mínima esperada |
| --- | --- | --- |
| AL-CT01 | Alice mantém 15 borboletas e as quatro famílias visuais: rosa, azul, branca e preta. | node:test + smoke |
| AL-CT02 | Carrossel do Efeito Alice respeita prefers-reduced-motion. | smoke runtime |
| AL-CT03 | Carrossel de Regras respeita prefers-reduced-motion. | smoke runtime |
| AL-CT05 | Mural "não alimente as tartarugas" permanece na página Alice. | node:test + smoke |
| EP2-CT02 | Gato pelado permanece migratório entre os quatro campi normais. | smoke runtime |

## Pendente

A lista final de AUD-23 ainda precisa separar identidade, regra de negócio, comportamento aceito e detalhe de implementação. Remover cobertura de uma regra desta tabela exige decisão explícita do PO.
