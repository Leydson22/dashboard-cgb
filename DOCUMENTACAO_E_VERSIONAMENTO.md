# Documentação do Painel e Versionamento (CGB Dashboard)

**Sistema:** Dashboard Executivo e Operacional de Movimentações de Aeronaves  
**Aeroporto:** Aeroporto Internacional de Cuiabá / Marechal Rondon (CGB - SBCY)  
**Versão Atual:** `v1.1.1`  
**Data:** 29 de Julho de 2026  
**Linguagem & Frameworks:** React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide Icons  

---

## 1. Visão Geral do Projeto

Este dashboard foi projetado sob medida para a equipe de fiscalização de pátio, administração aeroportuária e executivos de operações do **Aeroporto Internacional de Cuiabá (CGB)**. A aplicação consome e sincroniza os dados provenientes da planilha do Google Sheets (integrada via AppSheet) para monitoramento em tempo real dos pousos, companhias operantes e modalidade de desembarque.

---

## 2. Estrutura da Base de Dados (AppSheet / Google Sheets)

A base de dados do sistema possui os seguintes campos principais por registro de pouso:

| Nome do Campo | Tipo de Dado | Descrição / Exemplo |
| :--- | :--- | :--- |
| `id_registro` | Texto (Chave Única) | Identificador interno do pouso (ex: `CGB-20260722-001`) |
| `matricula` | Texto | Prefixo da aeronave registrada (ex: `PR-YQD`, `PS-AEU`, `PT-MSL`) |
| `id_companhia` | Texto | Código IATA/ICAO da empresa (ex: `AZU`, `TAM`, `GLO`, `VOE`, `TTL`, `MOD`, `SID`) |
| `nome_companhia` | Texto | Nome comercial da companhia aérea (`Azul`, `Latam`, `Gol`, `Voepass`, `Total`, `Modern Logistics`, `Sideral`) |
| `desembarque_hibrido` | Texto ('Sim' / 'Não') | Indicador se o desembarque envolveu processo misto/híbrido por ônibus remotos ou posição especial de pátio |
| `horario_cadastro` | Hora (HH:MM:SS) | Horário de registro automático do pouso em Cuiabá |
| `data_cadastro` | Data (DD/MM/AAAA) | Data do registro da movimentação |
| `observacoes` | Texto (Opcional) | Notas operacionais registradas pelo fiscal de pátio |

---

## 3. Fórmulas e Regras de Negócio Implementadas

### A. Total de Movimentações
- **Fórmula:** `COUNT_DISTINCT(id_registro)`
- **Descrição:** Métrica absoluta de contagem de aeronaves que pousaram no CGB no período selecionado.

### B. Taxa de Desembarque Híbrido (%)
- **Fórmula de Campo Calculado:**
  $$\text{Taxa Híbrida} = \frac{\text{COUNT\_DISTINCT}(\text{CASE WHEN desembarque\_hibrido} = \text{'Sim'} \text{ THEN id\_registro ELSE NULL END})}{\text{COUNT\_DISTINCT}(\text{id\_registro})}$$
- **Formatação:** Percentual com 1 casa decimal (ex: `24.5%`).
- **Meta Operacional Recomendada:** $\le 15\%$ para o pátio central do CGB.

### C. Top Market Share Operacional
- **Lógica:** Identifica dinamicamente a companhia aérea com o maior número absoluto de pousos na janela de tempo filtrada e calcula o seu percentual representativo frente ao volume total.

### D. Ordenação Padrão Administrativa
- A Tabela Operacional exibe por padrão a lista ordenada em ordem **Decrescente (DESC)** combinando os campos `data_cadastro` + `horario_cadastro`. Isso garante que os pousos mais recentes em Cuiabá fiquem sempre visíveis no topo da tela para a fiscalização de pátio.

---

## 4. Estilização e Design System (Tailwind CSS)

O layout adota o tema **Clean/Light - Technical Dashboard / Data Grid**:
- **Cores Principais:** Azul Aeronáutico Escuro (`bg-sky-900`, `text-sky-950`), Azul Celeste para Destaques (`text-sky-800`), Cinza Neutro (`bg-slate-50`, `border-slate-200`) e Âmbar Alerta para Desembarque Híbrido (`bg-amber-500`, `text-amber-800`).
- **Acessibilidade:** Textos de alto contraste e fontes monoespaçadas para códigos de matrículas aeronáuticas.
- **Responsividade:** Layout adaptável para telas desktop de central de operações e dispositivos móveis/tablets de fiscais de pátio em solo.

---

## 5. Historico de Versões e Versionamento

### Versão 1.1.1 — (29/07/2026)
- **Gestão de Modelos de Aeronave:** Adicionado campo "Modelo/Equipamento" opcional no fluxo de cadastro de pátio.
- **Persistência de Dados:** Implementado `aircraftModelService` para salvar modelos personalizados no `localStorage`.
- **Interface de Cadastro Expandida:** Removida a barra azul interna e o estilo de "janela" no cadastro, ocupando 100% da tela para melhor ergonomia mobile.
- **CRUD de Modelos:** Adicionada capacidade de Adicionar, Editar e Excluir modelos de aeronaves diretamente na interface de cadastro, com diálogos de confirmação.
- **Atualização de Resumos:** O modelo da aeronave agora é exibido no cartão de sucesso do cadastro e na tabela operacional.

### Versão 1.1.0 — (29/07/2026)
- **Unificação de Design e Navegação:** Conversão do modal de exportação em tela cheia integrada para melhor experiência mobile.
- **Correção de Exportação PDF (Mobile):** Implementação de exportação nativa via Capacitor Share e Filesystem.
- **Resolução do Erro 'oklch':** Sanitização agressiva de CSS durante a captura do PDF, eliminando falhas de cores modernas no Android.
- **Fluxo Automatizado:** Gatilho de geração de PDF automático ao navegar da tela de Pousos para Relatórios.
- **Otimização de Responsividade:** Ajustes específicos para Samsung Galaxy S8 (360px), incluindo grids, fontes e travas de largura.
- **Botão de Saída:** Adicionado botão "Sair" na Home com caixa de confirmação e encerramento nativo do app.
- **Correção de Build:** Resolvido conflito de variáveis de ambiente do Gradle no Android Studio.

### Versão 1.0.0 — (22/07/2026)
- **Lançamento Inicial do Dashboard de Cuiabá (CGB)**.
- Implementação dos 3 cartões de scorecards executivos (Total de Movimentações, Taxa de Desembarque Híbrido e Top Market Share).
- Implementação dos gráficos Recharts (Empilhado temporal por tipo de desembarque e Market Share de companhias).
- Implementação da tabela analítica com ordenação DESC por horário, paginação e filtros rápidos.
- Modal para cadastro/edição de novos pousos em tempo real pelos fiscais de pátio.
- Exportação de relatórios em formato CSV compatível com Google Sheets e AppSheet.
