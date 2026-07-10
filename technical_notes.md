# Notas Técnicas - Integração EA Sports FC 26

## Problema Identificado
A API oficial da EA (`proclubs.ea.com`) está retornando erro **403 Forbidden** quando acessada a partir dos servidores do Vercel. 
- O bloqueio persiste mesmo sem headers customizados.
- O bloqueio parece ser baseado na faixa de IPs do Vercel.

## Solução Implementada
1. **Agregador de Dados**: Criado um sistema de agregação no backend (`api/trpc.ts`) que tenta buscar dados de múltiplas fontes.
2. **Resiliência (Fallback)**: Caso a API da EA retorne 403, o sistema redireciona automaticamente a requisição para a API do **OurProClub**, garantindo que o site nunca fique sem dados.
3. **Cache**: Implementado cache de 5 minutos no servidor para evitar excesso de requisições e possíveis novos bloqueios.
4. **Tipagem**: Corrigidas as interfaces no frontend para suportar os dados retornados por ambas as APIs.

## Status Atual
- Deploy concluído com sucesso.
- Site live e funcional usando o sistema de fallback.
- Backend resiliente a bloqueios da EA.
