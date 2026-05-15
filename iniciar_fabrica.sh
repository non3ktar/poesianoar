#!/bin/bash
cd "/home/sergio/Área de trabalho/pipe"
source venv/bin/activate

# Tenta matar instâncias antigas da fábrica que possam ter ficado presas em segundo plano
pkill -f app_fabrica.py || true

echo "============================================="
echo "   Iniciando a Fábrica de Áudio...           "
echo "   Aguarde a página abrir no navegador.      "
echo "============================================="

# Abre o navegador em segundo plano após 2 segundos
(sleep 2 && xdg-open "http://localhost:5005") &

# Roda o servidor. Se der erro, segura a janela aberta para você ver o que foi.
python3 app_fabrica.py || {
    echo ""
    echo "============================================="
    echo "❌ Ops, ocorreu um erro ao iniciar o servidor!"
    echo "Veja o erro acima."
    echo "============================================="
    read -p "Pressione ENTER para sair..."
}
