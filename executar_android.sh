#!/bin/bash
# Configura o caminho completo para ferramentas do sistema, Node e Android SDK
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/home/leydson/.local/bin:/home/leydson/.nvm/versions/node/v22.23.1/bin:/home/leydson/Android/Sdk/platform-tools:/home/leydson/Android/Sdk/emulator:$PATH"
export ANDROID_HOME="/home/leydson/Android/Sdk"

# Resolve o conflito de variáveis que trava o build do Android Gradle Plugin
unset ANDROID_PREFS_ROOT

# Navega para a pasta do projeto
cd "/home/leydson/development/COA/dashboard-cgb"

echo "--- Sincronizando arquivos Web ---"
npx cap copy android

echo "--- Compilando APK Personalizado ---"
cd android && ./gradlew assembleDebug
cd ..

APK_PATH="android/app/build/outputs/apk/debug/Patio-CGB-v1.1.0-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo "--- Instalando APK no dispositivo/emulador ---"
    adb install -r "$APK_PATH"

    echo "--- Iniciando Aplicativo ---"
    adb shell am start -n com.coa.pousoscgb/.MainActivity
else
    echo "ERRO: APK não encontrado em $APK_PATH"
    exit 1
fi
