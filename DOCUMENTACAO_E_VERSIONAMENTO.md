# Documentação do Painel e Versionamento (CGB Dashboard)

**Sistema:** Gestão e Acompanhamento de Pátio - COA  
**Aeroporto:** Aeroporto Internacional de Cuiabá / Marechal Rondon (CGB - SBCY)  
**Versão Atual:** `v1.3.1`  
**Data:** 09 de Agosto de 2026  
**Linguagem & Frameworks:** React 19, TypeScript, Tailwind CSS v4, Recharts, Lucide Icons  

---

## 1. Visão Geral do Projeto

Este dashboard foi projetado sob medida para a equipe de fiscalização de pátio, administração aeroportuária e executivos de operações do **Aeroporto Internacional de Cuiabá (CGB)**. A aplicação consome e sincroniza os dados provenientes da planilha do Google Sheets (integrada via AppSheet) para monitoramento em tempo real dos pousos, companhias operantes e modalidade de desembarque.

---

## 2. Estrutura da Base de Dados (Híbrida)

O sistema opera com três camadas de dados para garantir máxima resiliência:
1. **LocalStorage:** Cache de alta performance para operação diária e offline.
2. **Capacitor Filesystem:** Armazenamento de snapshots permanentes (Máquina do Tempo) na memória física do dispositivo.
3. **Exportação Externa:** Geração de arquivos JSON e CSV para arquivamento anual em nuvem (Google Drive).

---

## 3. Fórmulas e Regras de Negócio

### A. Taxa de Desembarque Híbrido (%)
- **Lógica:** Razão entre voos com status "Sim" e o total de registros filtrados.
- **Formatação:** Percentual com 1 casa decimal.

### B. Filtro ISO 8601 (Comercial)
- **Padrão:** O filtro de "Semana" inicia obrigatoriamente na **Segunda-feira** e termina no Domingo, seguindo a norma internacional de calendários corporativos.

---

## 4. Historico de Versões e Versionamento

### Versão 1.3.1 — (09/08/2026)
- **Nova Identidade Visual:** Sistema renomeado para **"Gestão e Acompanhamento de Pátio - COA"**.
- **Header Unificado:** Versão do sistema e nome oficial agora integrados diretamente na faixa azul superior, liberando espaço na tela inicial.
- **Otimização de PDF:** Implementada compressão de arquivos PDF (mudança para JPEG 75% e escala 1.5). Redução de até 70% no peso dos arquivos para compartilhamento.
- **Inclusão da FAB:** Adicionada a "Forças Armadas Brasileiras" à lista oficial com identidade visual militar dedicada.
- **BI Refinado:** Novo filtro "Somente Companhias Aéreas" na administração para excluir aviação geral e militar das métricas de performance comercial.
- **Correção de UI:** Resolvido erro de telas brancas através da correção de importações de ícones e ordem de carregamento de estados.

### Versão 1.3.0 — (09/08/2026)
- **Gestão Total de Ativos:** Capacidade de Adicionar, Editar e Excluir **Empresas**, **Prefixos** e **Posições** diretamente pelo celular.
- **Filtros Rápidos:** Botões Hoje, Semana e Mês com lógica de autolimpeza de conflitos.
- **Grid Simétrico:** Reorganização dos números de pátio em grade fixa centralizada para melhor experiência de toque.

### Versão 1.1.2 — (30/07/2026)
- **Central de Segurança & Backup:** Nova tela independente para gestão de resiliência.
- **Máquina do Tempo:** Sistema de snapshots internos no celular.
- **Salvaguarda de Saída:** Pergunta automática de backup antes de fechar o aplicativo.

### Versão 1.1.0 — (29/07/2026)
- **Exportação Nativa:** Implementação de compartilhamento via Capacitor Share no Android.
- **Correção 'oklch':** Sanitização de CSS para compatibilidade de cores em dispositivos antigos.

### Versão 1.0.0 — (22/07/2026)
- **Lançamento Inicial:** Dashboards executivos, gráficos Recharts e tabela analítica.
