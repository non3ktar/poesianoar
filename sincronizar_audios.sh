#!/bin/bash
cd "/home/sergio/Área de trabalho/pipe"

echo "================================================="
echo "   Sincronizando seus Áudios com o GitHub...     "
echo "================================================="

git add .
git commit -m "🎙️ add: novos audios gerados pelo Edge TTS"
git push

echo ""
echo "================================================="
echo "   Sincronização Concluída com Sucesso! 🚀       "
echo "   Seus áudios estarão online em ~1 minutinho.   "
echo "================================================="
sleep 4
