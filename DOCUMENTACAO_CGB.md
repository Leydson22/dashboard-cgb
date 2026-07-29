# Especificação Técnica do App: Sistema de Controle de Aeronaves CGB
## 📱 Arquitetura Low-Code & Banco de Dados Híbrido (SQLite ➔ Google Sheets ➔ Relacional)

Este documento atua como o manual oficial de engenharia de software e blueprint para implementação do aplicativo no **Google AppSheet** (antigo AppSheet do ecossistema Google Workspace) integrado ao **Google Looker Studio** para relatórios e inteligência de negócios no Aeroporto Internacional de Cuiabá (CGB - SBCG).

---

## 📑 1. MODELAGEM DO BANCO DE DADOS (SQLITE & GOOGLE SHEETS)

Para permitir que o aplicativo funcione perfeitamente em modo local (SQLite) ou integrado de forma nativa na nuvem Google (Google Sheets) mantendo compatibilidade futura integral com bancos relacionais (PostgreSQL, MySQL, SQL Server), a modelagem adota a terceira forma normal (3FN) para as tabelas essenciais.

### 1.1 Esquema Físico SQL (SQLite)
Copie e execute este script no seu gerenciador SQLite para inicializar a estrutura local do dispositivo móvel:

```sql
-- Habilitar suporte a chaves estrangeiras no SQLite
PRAGMA foreign_keys = ON;

-- ==========================================
-- TABELA A: COMPANHIAS AÉREAS (PRINCIPAIS BRASIL)
-- ==========================================
CREATE TABLE tb_companhias (
    id_companhia INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_companhia TEXT NOT NULL,
    icao VARCHAR(3) UNIQUE NOT NULL,
    iata VARCHAR(2) UNIQUE NOT NULL,
    status_operacao TEXT DEFAULT 'Ativo' CHECK(status_operacao IN ('Ativo', 'Inativo'))
);

-- Inserção das Principais Companhias Operantes no Mercado Brasileiro
INSERT INTO tb_companhias (nome_companhia, icao, iata) VALUES 
('Latam Airlines Brasil', 'TAM', 'LA'),
('Gol Linhas Aéreas', 'GLO', 'G3'),
('Azul Linhas Aéreas', 'AZU', 'AD'),
('Voepass Linhas Aéreas', 'PTB', '2Z'),
('Total Linhas Aéreas', 'TTL', 'L1'),
('Modern Logistics (Carga)', 'MWM', 'WD'),
('Sideral Linhas Aéreas', 'SID', '0S');

-- ==========================================
-- TABELA B: MOVIMENTAÇÕES E REGISTRO DE AERONAVES
-- ==========================================
CREATE TABLE tb_movimentacoes (
    id_registro INTEGER PRIMARY KEY AUTOINCREMENT,
    matricula VARCHAR(7) NOT NULL, -- Ex: PR-YQD, PT-MBU
    id_companhia INTEGER,
    desembarque_hibrido TEXT NOT NULL CHECK(desembarque_hibrido IN ('Sim', 'Não')),
    horario_cadastro DATETIME DEFAULT (datetime('now', 'localtime')),
    data_cadastro DATE DEFAULT (date('now', 'localtime')),
    status_edicao TEXT DEFAULT 'Pendente' CHECK(status_edicao IN ('Pendente', 'Auditado')),
    FOREIGN KEY (id_companhia) REFERENCES tb_companhias(id_companhia) ON DELETE SET NULL
);
```

### 1.2 Dicionário de Dados para o Google Sheets (Sincronização)
Caso utilize a planilha Google Sheets como a ponte direta para o AppSheet e o Looker Studio, crie as abas exatas com as seguintes colunas e regras de validação:

#### Aba: `tb_companhias`
*   **`id_companhia`** (Tipo: Número) -> ID incremental único.
*   **`nome_companhia`** (Tipo: Texto) -> Razão social ou nome fantasia.
*   **`icao`** (Tipo: Texto) -> Código de 3 letras da Organização de Aviação Civil Internacional.
*   **`iata`** (Tipo: Texto) -> Código de 2 letras da Associação Internacional de Transportes Aéreos.

#### Aba: `tb_movimentacoes`
*   **`id_registro`** (Tipo: Texto/Código) -> Chave primária gerada via AppSheet `UNIQUEID()`.
*   **`matricula`** (Tipo: Texto) -> Prefixo e matrícula nacional/internacional da aeronave.
*   **`id_companhia`** (Tipo: Referência) -> Relacionado à aba anterior.
*   **`desembarque_hibrido`** (Tipo: Texto) -> Valores restritos a `Sim` ou `Não`.
*   **`horario_cadastro`** (Tipo: Hora) -> Armazena a estampa de tempo automática do clique (HH:MM:SS).
*   **`data_cadastro`** (Tipo: Data) -> Armazena o dia civil da operação (DD/MM/AAAA).

---

## 📱 2. ENGENHARIA DO APLICATIVO NO GOOGLE APPSHEET

Para construir a interface do celular de forma eficiente e garantir as regras de negócio de **escolha manual do desembarque**, **registro automático de horário** e **permissão de edição após o salvamento**, configure as colunas no editor do AppSheet conforme as regras abaixo:

### 2.1 Configuração da Tabela `tb_movimentacoes` no Painel AppSheet
Configure as propriedades das colunas exatamente assim no menu **Data > Columns**:

| Nome da Coluna | Tipo de Dado (Type) | Valor Inicial (Initial Value) | Editável (Editable) | Validação / Configurações Adicionais |
| :--- | :--- | :--- | :--- | :--- |
| `id_registro` | **Key** (Text) | `UNIQUEID()` | Não | Ocultar da tela do usuário. |
| `matricula` | **Text** | *Vazio* | Sim | Configurar `Searchable` como ativado. |
| `id_companhia` | **Ref** | *Vazio* | Sim | Apontar para a tabela `tb_companhias`. Exibe dropdown. |
| `desembarque_hibrido` | **Enum** | *Vazio* | Sim | Adicionar valores permitidos: `Sim`, `Não`. Configurar como **Buttons**. |
| `horario_cadastro` | **Time** | `TIMENOW()` | Não | Trava o horário exato do preenchimento da ficha. |
| `data_cadastro` | **Date** | `TODAY()` | Não | Trava o dia civil da operação. |

### 2.2 Controle de Ciclo de Vida do Dado e Fluxo de Edição
Para garantir que o usuário consiga escolher os dados na entrada e editá-los livremente através da Área Administrativa:

1.  **Modo de Edição da Tabela:** Nas configurações da tabela dentro do AppSheet, certifique-se de que a permissão esteja marcada como `ADDS_AND_UPDATES`. Isso concede ao app o poder de criar novas linhas e modificar linhas existentes pelo celular.
2.  **Visualizações (Views) Customizadas:**
    *   **View 1: `Cadastrar_Voo` (Tipo: Form):** Formulário focado, limpo e otimizado para preenchimento em pista ou torre. Ao abrir, o `TIMENOW()` captura os milissegundos. O usuário insere a Matrícula, seleciona o Dropdown da Companhia e toca no botão grande de `Sim` ou `Não` no campo Híbrido. Ao clicar em "Salvar", o registro é persistido localmente e enfileirado para envio em nuvem.
    *   **View 2: `Painel_Administrativo` (Tipo: Deck ou Table):** Exibe a listagem histórica cronológica de todas as aeronaves que passaram pelo CGB. Possui um campo de busca no topo para pesquisar por matrícula rápida.
    *   **Ação de Edição:** Ao tocar em qualquer linha da View administrativa, o AppSheet renderiza automaticamente o ícone de lápis (Editar). Como a coluna `desembarque_hibrido` está configurada como `Editable: TRUE`, o administrador pode trocar o status de "Sim" para "Não" caso identifique erro operacional e salvar novamente.

---

## 📊 3. ARQUITETURA DE RELATÓRIOS OPERACIONAIS NO GOOGLE LOOKER STUDIO

Após os dados saírem do dispositivo móvel e serem consolidados na nuvem via Google Sheets (ou via conexão com o banco de dados final), o **Google Looker Studio** lerá a base de dados para gerar os relatórios estratégicos demandados pela gerência do CGB.

### 3.1 Métricas Calculadas Fundamentais (Campos Customizados)
Dentro do Looker Studio, adicione os seguintes campos calculados para enriquecer seus gráficos sem alterar a planilha base:

#### Métrica A: Taxa de Desembarque Híbrido (% Híbrido)
Mede o percentual de aeronaves que adotaram o método misto de desembarque em relação ao total de voos catalogados.
```sql
COUNT_DISTINCT(CASE WHEN desembarque_hibrido = 'Sim' THEN id_registro ELSE NULL END) / COUNT_DISTINCT(id_registro)
```
*Configure o tipo de dado exibido nesta métrica como: **Numérico > Percentual**.*

#### Métrica B: Volumetria Mensal de Operações por Empresa
Permite categorizar o ranking de movimentação de pátio.
```sql
COUNT(id_registro)
```

### 3.2 Grade de Dashboards Recomendada para Montagem no Looker Studio
Para criar uma visão administrativa executiva de alta legibilidade, estruture a tela em três seções visuais:

1.  **Painel de Scorecards (KPIs de Topo):**
    *   Cartão 1: Total de Movimentações Registradas no Mês.
    *   Cartão 2: Índice Geral de Desembarques Híbridos (Métrica A).
    *   Cartão 3: Companhia Líder em Volume Operacional no CGB.
2.  **Gráfico de Tendência Temporal (Linha/Barras Empilhadas):**
    *   **Eixo X:** `data_cadastro` (Agrupado por Dia ou Semana).
    *   **Eixo Y:** Total de registros.
    *   **Dimensão de Detalhamento:** `desembarque_hibrido`. 
    *   *Objetivo:* Monitorar os picos de desembarque híbrido ao longo do dia/semana para planejamento de equipes de solo.
3.  **Tabela Dinâmica Analítica (Detalhamento Geral):**
    *   **Dimensões:** `nome_companhia`, `matricula`, `data_cadastro`, `horario_cadastro`, `desembarque_hibrido`.
    *   Ative o recurso de ordenação decrescente por data e horário, criando uma auditoria em tempo real integrada.

---

## 📱 5. DASHBOARD REACT (INTERFACE WEB/MOBILE)

Para complementar a operação via AppSheet, foi desenvolvido um Dashboard em React 19 que permite visualização analítica profunda e geração de relatórios PDF profissionais.

### 5.1 Funcionalidades Chave
- **Sincronização Local:** Armazenamento resiliente de dados de movimentação.
- **Exportação Nativa:** Geração de relatórios PDF (Operacional, BI, Turno) com compartilhamento direto via sistema operacional.
- **Interface Otimizada:** Design responsivo focado em dispositivos de campo (ex: Galaxy S8) e centrais de controle.
- **Segurança de Saída:** Botão de encerramento de sessão com confirmação.
