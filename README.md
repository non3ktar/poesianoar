# 🌊 Salinas em Versos - Audiolivro PWA

Aplicativo web responsivo e minimalista para exibição e audição da coleção de poemas sobre Salinas da Margarida.

## 🚀 Objetivo
Transformar poemas locais em uma experiência de audiolivro digital acessível, funcionando offline via tecnologia PWA (Progressive Web App).

## 🛠️ Tech Stack
- **Core**: HTML5, Vanilla CSS, JavaScript (ES6+).
- **Design**: Google Fonts (Lora & Playfair Display), Lucide Icons.
- **Áudio**: Arquivos `.wav` pré-renderizados localmente.
- **PWA**: Service Workers e Web Manifest.

## 📂 Estrutura de Pastas
```text
/pipe
├── /audio        # Coloque seus arquivos .wav aqui
├── index.html    # Estrutura principal
├── style.css     # Estilização Premium (Off-white/Violeta)
├── app.js        # Lógica de busca, áudio e fonte
├── manifest.json # Configuração de PWA
└── sw.js         # Service Worker (Cache Offline)
```

## 📖 Como usar
1. Coloque seus áudios na pasta `/audio` seguindo os nomes definidos no `app.js` (ou atualize o array `poemas` no JS).
2. Para gerar novos áudios via Piper TTS, use o comando sugerido:
   ```bash
   echo "Seu poema" | ./piper --model pt_BR-voz-escolhida.onnx --output_file audio/nome-do-poema.wav
   ```
3. Abra o `index.html` em um servidor local (ou suba para GitHub Pages/Netlify).

## 📝 Registro de Modificações (Changelog)
- **v1.0.0**: Lançamento inicial com design "UI Pro Max", busca, ajuste de fonte e lógica de áudio exclusivo.

---
*Desenvolvido com carinho para Salinas da Margarida.*
