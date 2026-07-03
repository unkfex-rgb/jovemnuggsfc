# Status do Projeto Jovem Nuggs FC

## API
- URL: `https://api.ourproclub.app/api/match/history?clubId=8044401`
- Estrutura: Retorna um array de objetos contendo `match_data` e `player_data`.
- Implementado processamento para extrair estatísticas de partidas e jogadores.

## Melhorias Implementadas
1. **Goleiros:** 
   - Lógica de `calculatePlayerScore` ajustada para valorizar `cleanSheets`, `saves` e dar um peso maior ao `rating` para compensar a API.
   - Adicionado campo `saves` no processamento do serviço.
2. **Campo Tático:**
   - Expandido para mostrar os 11 jogadores (1 GK, 4 DEF, 3 MID, 3 FWD).
   - Lógica de seleção baseada no score técnico customizado.
3. **Elenco:**
   - Corrigido bug de filtros que limpava a lista.
   - Adicionada `AnimatePresence` para transições fluidas.
   - Lógica de categorias de posição robusta para diferentes nomes vindos da API.

## Design
- Estilo: Cyber UI / Esports Premium.
- Cores: Preto, Branco, Cinza com Glows.
- Animações: Framer Motion (Reveal, Hover, Spring).

## Repositório
- GitHub: `unkfex-rgb/jovemnuggsfc`
- Deploy: Vercel
