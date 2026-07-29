#!/bin/bash
# Configura o caminho completo para ferramentas do sistema e Node
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/home/leydson/.local/bin:/home/leydson/.nvm/versions/node/v22.23.1/bin:$PATH"

# Navega para a pasta do projeto
cd "/home/leydson/development/COA/dashboard-cgb"

# Inicia o servidor web Vite
npm run dev
