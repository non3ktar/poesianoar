document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    const voicesGrid = document.getElementById('voicesGrid');
    const listaAudios = document.getElementById('listaAudios');
    const btnGerar = document.getElementById('btnGerar');
    const loading = document.getElementById('loading');
    
    let selectedVoice = 'Francisca'; // Default

    // Carrega vozes
    async function loadVoices() {
        try {
            const resp = await fetch('/api/vozes');
            const voices = await resp.json();
            
            voicesGrid.innerHTML = voices.map(v => {
                const isFemale = ['Francisca', 'Brenda', 'Yara'].includes(v);
                const icon = isFemale ? 'user' : 'user';
                const genderClass = isFemale ? 'female' : 'male';
                
                return `
                    <button class="voice-btn ${v === selectedVoice ? 'active' : ''} ${genderClass}" data-voice="${v}">
                        <i data-lucide="${icon}"></i>
                        ${v}
                    </button>
                `;
            }).join('');
            
            lucide.createIcons();

            document.querySelectorAll('.voice-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    selectedVoice = btn.getAttribute('data-voice');
                });
            });
        } catch(e) {
            console.error("Erro ao carregar vozes:", e);
        }
    }

    // Carrega Áudios
    async function loadAudios() {
        try {
            const resp = await fetch('/api/poemas');
            const audios = await resp.json();
            
            if(audios.length === 0) {
                listaAudios.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhum áudio gerado ainda.</p>`;
                return;
            }

            listaAudios.innerHTML = audios.map(a => `
                <div class="audio-item">
                    <div class="audio-header">
                        <span class="audio-title">${a.titulo}</span>
                        <span class="audio-badge">Voz: ${a.voz || 'Desconhecida'}</span>
                    </div>
                    <audio src="${a.caminhoAudio}" controls></audio>
                    <button class="btn-copy" onclick="copiarLink('${a.caminhoAudio}', this)">
                        <i data-lucide="link"></i> Copiar Link MP3
                    </button>
                </div>
            `).join('');
            
            lucide.createIcons();
        } catch(e) {
            console.error("Erro ao carregar áudios", e);
        }
    }

    window.copiarLink = function(caminhoRelativo, btnElement) {
        let baseUrl = document.getElementById('githubUrl').value.trim();
        if(!baseUrl.endsWith('/')) baseUrl += '/';
        
        const fullUrl = baseUrl + caminhoRelativo;
        
        navigator.clipboard.writeText(fullUrl).then(() => {
            const originalHTML = btnElement.innerHTML;
            btnElement.classList.add('copied');
            btnElement.innerHTML = `<i data-lucide="check"></i> Copiado!`;
            lucide.createIcons();
            
            setTimeout(() => {
                btnElement.classList.remove('copied');
                btnElement.innerHTML = originalHTML;
                lucide.createIcons();
            }, 2000);
        });
    }

    // Gerar Áudio
    btnGerar.addEventListener('click', async () => {
        const titulo = document.getElementById('titulo').value.trim();
        const texto = document.getElementById('texto').value.trim();

        if(!titulo || !texto) {
            alert('Por favor, preencha o título e o texto!');
            return;
        }

        btnGerar.disabled = true;
        btnGerar.style.display = 'none';
        loading.style.display = 'flex';

        try {
            const resp = await fetch('/api/gerar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, texto, voz: selectedVoice })
            });

            if(resp.ok) {
                document.getElementById('titulo').value = '';
                document.getElementById('texto').value = '';
                loadAudios();
            } else {
                const err = await resp.json();
                alert('Erro ao gerar: ' + (err.error || 'Desconhecido'));
            }
        } catch(e) {
            alert('Erro de conexão com o servidor local.');
        } finally {
            btnGerar.disabled = false;
            btnGerar.style.display = 'flex';
            loading.style.display = 'none';
        }
    });

    loadVoices();
    loadAudios();
});
