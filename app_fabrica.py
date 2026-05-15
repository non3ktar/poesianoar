import os
import json
import uuid
import asyncio
import edge_tts
import subprocess
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AUDIO_DIR = os.path.join(BASE_DIR, 'audio')
DATA_FILE = os.path.join(BASE_DIR, 'data', 'poemas.json')

# Garante que as pastas existam
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, 'data'), exist_ok=True)

if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as f:
        json.dump([], f)

# Vozes confirmadas e funcionando (3 Femininas, 3 Masculinas)
VOICES = {
    'Francisca': 'pt-BR-FranciscaNeural',
    'Thalita': 'pt-BR-ThalitaMultilingualNeural',
    'Ava': 'en-US-AvaMultilingualNeural',
    'Antonio': 'pt-BR-AntonioNeural',
    'Andrew': 'en-US-AndrewMultilingualNeural',
    'Brian': 'en-US-BrianMultilingualNeural'
}

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/api/vozes', methods=['GET'])
def get_vozes():
    return jsonify(list(VOICES.keys()))

@app.route('/api/poemas', methods=['GET'])
def get_poemas():
    with open(DATA_FILE, 'r') as f:
        return jsonify(json.load(f))

@app.route('/api/gerar', methods=['POST'])
def gerar_audio():
    data = request.json
    titulo = data.get('titulo')
    texto = data.get('texto')
    voz_nome = data.get('voz', 'Francisca')
    velocidade = data.get('velocidade', '+0%')
    
    if not titulo or not texto:
        return jsonify({'error': 'Título e texto são obrigatórios'}), 400

    voz_id = VOICES.get(voz_nome, VOICES['Francisca'])

    # Nome do arquivo único (.mp3 porque é o padrão do edge-tts)
    filename = f"audio_{uuid.uuid4().hex[:8]}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    try:
        # Usando Edge TTS via asyncio
        async def run_tts():
            communicate = edge_tts.Communicate(texto, voz_id, rate=velocidade)
            await communicate.save(filepath)

        asyncio.run(run_tts())

        # Salva no JSON
        novo_poema = {
            'id': str(uuid.uuid4()),
            'titulo': titulo,
            'texto': texto,
            'voz': voz_nome,
            'caminhoAudio': f"audio/{filename}"
        }

        with open(DATA_FILE, 'r+') as f:
            poemas = json.load(f)
            # Coloca o mais novo no início
            poemas.insert(0, novo_poema)
            f.seek(0)
            json.dump(poemas, f, indent=4)
            f.truncate()

        return jsonify(novo_poema)
    
    except Exception as e:
        print(f"❌ ERRO NO TTS: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/sincronizar', methods=['POST'])
def sincronizar():
    try:
        # Executa os comandos git
        subprocess.run(["git", "add", "."], check=True, cwd=BASE_DIR)
        # Tenta fazer o commit, ignora se não houver mudanças
        try:
            subprocess.run(["git", "commit", "-m", "🎙️ add: novos audios via interface"], check=True, cwd=BASE_DIR)
        except subprocess.CalledProcessError:
            pass # Nada para commitar
            
        subprocess.run(["git", "push"], check=True, cwd=BASE_DIR)
        return jsonify({'success': True, 'message': 'Sincronização concluída!'})
    except Exception as e:
        print(f"❌ ERRO NA SINCRONIZAÇÃO: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(BASE_DIR, path)

if __name__ == '__main__':
    print(f"🚀 Fábrica de Áudios rodando em http://localhost:5005")
    app.run(host='0.0.0.0', port=5005, debug=True)
