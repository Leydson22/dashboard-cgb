# Gestão e Acompanhamento de Pátio - COA

Sistema executivo e operacional para monitoramento de movimentações de aeronaves no **Aeroporto Internacional de Cuiabá (CGB - SBCY)**.

![Versão](https://img.shields.io/badge/vers%C3%A3o-1.3.1-blue)
![React](https://img.shields.io/badge/React-19-blue)
![Capacitor](https://img.shields.io/badge/Capacitor-6-emerald)

## ✈️ Visão Geral
Este aplicativo foi desenvolvido para auxiliar a fiscalização de pátio e a gerência aeroportuária na coleta de dados de pousos, análise de performance (BI) e geração de relatórios oficiais. O sistema opera de forma híbrida, integrando-se opcionalmente ao ecossistema Google (AppSheet/Sheets) e mantendo uma base de dados local resiliente com ferramentas de backup profissional.

## 🚀 Funcionalidades Principais
- **Lançamento de Pátio:** Fluxo de cadastro rápido e simplificado em 5 etapas otimizado para celulares.
- **Business Intelligence:** Gráficos interativos de Market Share, Volumetria e Tendência de Performance.
- **Relatórios Profissionais:** Geração de PDFs (Turno, BI, Operacional) e planilhas CSV com compartilhamento nativo.
- **Segurança de Dados:** Sistema de "Máquina do Tempo" com snapshots internos e backups externos para Google Drive.
- **Modo Offline:** Funciona totalmente sem internet, sincronizando dados localmente no dispositivo.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons.
- **Gráficos:** Recharts.
- **Mobile:** Ionic Capacitor (Filesystem, Share, App APIs).
- **PDF:** jsPDF & html2canvas com sanitização nuclear de cores.

## 📂 Documentação Detalhada
Para detalhes técnicos sobre o banco de dados, fórmulas e histórico de mudanças, consulte:
- [Documentação Técnica e Modelagem](DOCUMENTACAO_CGB.md)
- [Histórico de Versões e Mudanças](DOCUMENTACAO_E_VERSIONAMENTO.md)

## 💻 Desenvolvimento Local
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Gere o APK de Debug:
   ```bash
   ./executar_android.sh
   ```

---
*© 2026 Centro-Oeste Airports (COA) - Área de Operações CGB*
