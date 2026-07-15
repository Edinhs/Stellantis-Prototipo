/* ==========================================
   STELLANTIS DICTIONARY - INTERATIVIDADE & DADOS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Lucide Icons
    lucide.createIcons();

    // Lógica de Scroll do Header (Cápsula Flutuante)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (header) {
            if (window.scrollY > 45) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // 1. BANCO DE DADOS DE TERMOS INICIAIS
    const defaultTerms = [
        {
            id: 'adas',
            title: 'ADAS',
            def: 'Advanced Driver Assistance Systems. Sistemas avançados de assistência ao condutor que utilizam câmeras, radares e sensores para automação parcial e segurança (ex: frenagem autônoma, leitor de faixa).',
            category: 'tecnologia',
            author: 'Sistema'
        },
        {
            id: 'bio-hybrid',
            title: 'Bio-Hybrid',
            def: 'Nova tecnologia de propulsão híbrida flex da Stellantis que combina eletrificação com biocombustíveis (etanol), otimizando eficiência energética e reduzindo emissões no mercado sul-americano.',
            category: 'motorizacao',
            author: 'Sistema'
        },
        {
            id: 't270',
            title: 'T270 Turbo Flex',
            def: 'Motor 1.3 Litros Turbo Flex de alta eficiência da Stellantis. Produz 185 cv e 270 Nm de torque, equipando modelos Jeep (Compass, Commander, Renegade) e Fiat (Toro, Fastback).',
            category: 'motorizacao',
            author: 'Sistema'
        },
        {
            id: 'hurricane4',
            title: 'Hurricane 4',
            def: 'Motor 2.0 Litros Turbo a gasolina de 272 cv de potência e 400 Nm de torque. Projetado para alto desempenho em utilitários e picapes, equipando o Jeep Wrangler, Commander e a Ram Rampage.',
            category: 'motorizacao',
            author: 'Sistema'
        },
        {
            id: 'stla-medium',
            title: 'Plataforma STLA Medium',
            def: 'Plataforma global de veículos Stellantis projetada especificamente para veículos elétricos a bateria (BEV) de tamanho médio, com autonomia projetada de até 700 km.',
            category: 'plataformas',
            author: 'Sistema'
        },
        {
            id: 'grid-jeep',
            title: 'Grade Frontal Jeep (7 Fendas)',
            def: 'Assinatura visual histórica da marca Jeep. No protótipo do Stellantis Dictionary, representa a integração entre herança estilística clássica e dutos aerodinâmicos ativos.',
            category: 'componentes',
            author: 'Sistema'
        },
        {
            id: 'cluster-digital',
            title: 'Cluster Digital ADAS',
            def: 'Painel de instrumentos digital integrado Stellantis que centraliza dados do veículo, alertas de colisão e navegação 3D para maior segurança sem distração ocular.',
            category: 'componentes',
            author: 'Sistema'
        },
        {
            id: 'etcu',
            title: 'eTCU (Electric Transmission Control)',
            def: 'Unidade inteligente de controle eletrônico da transmissão projetada especificamente para coordenar a troca suave entre tração térmica e propulsão elétrica nos modelos híbridos.',
            category: 'tecnologia',
            author: 'Sistema'
        }
    ];

    // Carregar termos do LocalStorage ou usar padrões
    let terms = JSON.parse(localStorage.getItem('stellantis_terms')) || defaultTerms;
    if (!localStorage.getItem('stellantis_terms')) {
        localStorage.setItem('stellantis_terms', JSON.stringify(defaultTerms));
    }

    // 2. SISTEMA DE NAVEGAÇÃO SPA (SINGLE PAGE APPLICATION)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.app-section');

    function switchSection(targetId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(`sec-${targetId}`);
        const targetLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);
        
        if (targetSection && targetLink) {
            targetSection.classList.add('active');
            targetLink.classList.add('active');
            // Scroll suave até o topo
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('data-target');
            switchSection(targetId);
        });
    });

    // Botão de chamada para ação na Home direciona para o Dicionário
    const btnExploreDict = document.getElementById('btn-explore-dict');
    if (btnExploreDict) {
        btnExploreDict.addEventListener('click', () => {
            switchSection('dicionario');
        });
    }


    // 3. LOGICA DO DICIONÁRIO DE TERMOS (Renderização e Filtros)
    const termsGrid = document.getElementById('termsGrid');
    const searchInput = document.getElementById('searchTerms');
    const filterButtons = document.querySelectorAll('.filter-btn');

    let currentCategory = 'all';
    let searchQuery = '';

    function renderTerms() {
        if (!termsGrid) return;
        termsGrid.innerHTML = '';

        const filtered = terms.filter(term => {
            const matchesCategory = currentCategory === 'all' || term.category === currentCategory;
            const matchesSearch = term.title.toLowerCase().includes(searchInput.value.toLowerCase()) || 
                                 term.def.toLowerCase().includes(searchInput.value.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            termsGrid.innerHTML = `
                <div class="no-results-card" style="grid-column: 1/-1; text-align: center; padding: 40px; background: var(--glass-bg); border-radius: 16px; border: 1px solid var(--glass-border);">
                    <i data-lucide="info" style="width: 40px; height: 40px; color: var(--accent); margin-bottom: 12px;"></i>
                    <p style="color: var(--text-muted);">Nenhum termo encontrado para a busca ou filtro selecionado.</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        filtered.forEach(term => {
            const card = document.createElement('div');
            card.className = 'term-card';
            card.setAttribute('data-id', term.id);
            card.innerHTML = `
                <div class="term-header">
                    <span class="term-badge">${term.category}</span>
                    <i data-lucide="book-open" style="width: 16px; height: 16px; color: var(--accent);"></i>
                </div>
                <h3 class="term-title">${term.title}</h3>
                <p class="term-def">${term.def}</p>
                <div class="term-meta">
                    <i data-lucide="user" style="width: 10px; height: 10px;"></i>
                    <span>Cadastrado por: ${term.author || 'Sistema'}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                openTermDetailsModal(term);
            });
            termsGrid.appendChild(card);
        });

        lucide.createIcons();
    }

    if (searchInput) {
        searchInput.addEventListener('input', renderTerms);
    }

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderTerms();
        });
    });

    // LÓGICA DO MODAL DE ADICIONAR NOVO TERMO
    const modalAddTerm = document.getElementById('modalAddTerm');
    const btnOpenAddTermModal = document.getElementById('btnOpenAddTermModal');
    const btnCloseAddTermModal = document.getElementById('btnCloseAddTermModal');
    const btnCancelAddTermModal = document.getElementById('btnCancelAddTermModal');
    const btnSaveNewTerm = document.getElementById('btnSaveNewTerm');
    const formAddTerm = document.getElementById('formAddTerm');

    if (btnOpenAddTermModal && modalAddTerm) {
        btnOpenAddTermModal.addEventListener('click', () => {
            modalAddTerm.classList.add('open');
        });
    }

    function closeAddTermModal() {
        if (modalAddTerm) {
            modalAddTerm.classList.remove('open');
            if (formAddTerm) formAddTerm.reset();
        }
    }

    if (btnCloseAddTermModal) {
        btnCloseAddTermModal.addEventListener('click', closeAddTermModal);
    }
    if (btnCancelAddTermModal) {
        btnCancelAddTermModal.addEventListener('click', closeAddTermModal);
    }
    if (modalAddTerm) {
        modalAddTerm.addEventListener('click', (e) => {
            if (e.target === modalAddTerm) {
                closeAddTermModal();
            }
        });
    }

    if (btnSaveNewTerm) {
        btnSaveNewTerm.addEventListener('click', () => {
            const titleInput = document.getElementById('termTitle');
            const categorySelect = document.getElementById('termCategory');
            const defTextarea = document.getElementById('termDef');
            const authorInput = document.getElementById('termAuthor');

            if (!titleInput || !defTextarea) return;

            const title = titleInput.value.trim();
            const category = categorySelect.value;
            const def = defTextarea.value.trim();
            const author = authorInput.value.trim() || 'Usuário';

            if (title === '' || def === '') {
                alert('Por favor, preencha o título e a definição do termo.');
                return;
            }

            const newTerm = {
                id: 'custom-' + Date.now(),
                title: title,
                category: category,
                def: def,
                author: author
            };

            // Adiciona no início do array de termos para que apareça primeiro na lista
            terms.unshift(newTerm);
            localStorage.setItem('stellantis_terms', JSON.stringify(terms));
            
            // Re-renderizar lista
            renderTerms();
            
            // Fechar modal e resetar
            closeAddTermModal();
        });
    }

    // LÓGICA DO MODAL DE DETALHES DE TERMO (POP-UP)
    const modalTermDetails = document.getElementById('modalTermDetails');
    const termDetailsTitle = document.getElementById('termDetailsTitle');
    const termDetailsDef = document.getElementById('termDetailsDef');
    const termDetailsCategory = document.getElementById('termDetailsCategory');
    const termDetailsAuthor = document.getElementById('termDetailsAuthor');
    const btnCloseTermDetailsModal = document.getElementById('btnCloseTermDetailsModal');
    const btnCancelTermDetailsModal = document.getElementById('btnCancelTermDetailsModal');
    const btnAskGptAboutTerm = document.getElementById('btnAskGptAboutTerm');
    const btnCreateFlashcardFromTerm = document.getElementById('btnCreateFlashcardFromTerm');

    let activeDetailsTerm = null;

    function openTermDetailsModal(term) {
        if (!modalTermDetails || !term) return;
        activeDetailsTerm = term;

        if (termDetailsTitle) termDetailsTitle.textContent = term.title;
        if (termDetailsDef) termDetailsDef.textContent = term.def;
        if (termDetailsCategory) {
            termDetailsCategory.textContent = term.category;
            
            // Atribuir cores diferentes de acordo com a categoria
            let color = 'var(--secondary)';
            let bg = 'rgba(6, 182, 212, 0.1)';
            let border = 'rgba(6, 182, 212, 0.2)';
            
            if (term.category === 'motorizacao') {
                color = '#a855f7'; // Roxo
                bg = 'rgba(168, 85, 247, 0.1)';
                border = 'rgba(168, 85, 247, 0.2)';
            } else if (term.category === 'tecnologia') {
                color = 'var(--accent)'; // Azul
                bg = 'rgba(59, 130, 246, 0.1)';
                border = 'rgba(59, 130, 246, 0.2)';
            } else if (term.category === 'componentes') {
                color = '#f59e0b'; // Amarelo
                bg = 'rgba(245, 158, 11, 0.1)';
                border = 'rgba(245, 158, 11, 0.2)';
            } else if (term.category === 'plataformas') {
                color = '#10b981'; // Verde
                bg = 'rgba(16, 185, 129, 0.1)';
                border = 'rgba(16, 185, 129, 0.2)';
            }
            
            termDetailsCategory.style.color = color;
            termDetailsCategory.style.background = bg;
            termDetailsCategory.style.borderColor = border;
        }
        if (termDetailsAuthor) {
            termDetailsAuthor.innerHTML = `<i data-lucide="user" style="width: 14px; height: 14px; color: var(--secondary); display: inline-block; vertical-align: middle; margin-right: 4px;"></i> ${term.author || 'Sistema'}`;
        }

        modalTermDetails.classList.add('open');
        lucide.createIcons();
    }

    function closeTermDetailsModal() {
        if (modalTermDetails) {
            modalTermDetails.classList.remove('open');
        }
    }

    if (btnCloseTermDetailsModal) btnCloseTermDetailsModal.addEventListener('click', closeTermDetailsModal);
    if (btnCancelTermDetailsModal) btnCancelTermDetailsModal.addEventListener('click', closeTermDetailsModal);
    if (modalTermDetails) {
        modalTermDetails.addEventListener('click', (e) => {
            if (e.target === modalTermDetails) {
                closeTermDetailsModal();
            }
        });
    }

    // Botão de interagir com o Chat IA
    if (btnAskGptAboutTerm) {
        btnAskGptAboutTerm.addEventListener('click', () => {
            if (!activeDetailsTerm) return;
            
            closeTermDetailsModal();
            switchSection('chat-ia');

            if (chatInputGpt) {
                chatInputGpt.value = `Olá! Poderia me explicar em detalhes e fornecer exemplos práticos de aplicação sobre o termo técnico "${activeDetailsTerm.title}" no contexto da Stellantis?`;
                chatInputGpt.focus();
            }
        });
    }

    // Botão de criar flashcard a partir do termo do dicionário
    if (btnCreateFlashcardFromTerm) {
        btnCreateFlashcardFromTerm.addEventListener('click', () => {
            if (!activeDetailsTerm) return;
            
            // 1. Fechar o modal de detalhes do termo
            closeTermDetailsModal();
            
            // 2. Preencher os inputs do modal de flashcards
            const watermarkInput = document.getElementById('cardWatermark');
            const titleInput = document.getElementById('cardTitle');
            const questionInput = document.getElementById('cardQuestion');
            const answerInput = document.getElementById('cardAnswer');

            if (watermarkInput) watermarkInput.value = activeDetailsTerm.title.charAt(0).toUpperCase();
            if (titleInput) titleInput.value = activeDetailsTerm.title;
            if (questionInput) questionInput.value = `O que é ${activeDetailsTerm.title}?`;
            if (answerInput) answerInput.value = activeDetailsTerm.def;

            // 3. Mudar para a seção principal de Treinamento
            switchSection('treinamento');
            
            // 4. Mudar para a subaba de Flashcards (cards)
            const subBtn = document.querySelector(`.sub-nav-btn[data-subtarget="cards"]`);
            if (subBtn) subBtn.click();
            
            // 5. Abrir o modal de novo flashcard
            const modalAddCard = document.getElementById('modalAddCard');
            if (modalAddCard) {
                modalAddCard.classList.add('open');
            }

            // 6. Feedback visual sutil (piscar leve nos inputs)
            [watermarkInput, titleInput, questionInput, answerInput].forEach(inp => {
                if (inp) {
                    inp.style.borderColor = 'var(--secondary)';
                    setTimeout(() => {
                        inp.style.borderColor = 'var(--glass-border)';
                    }, 800);
                }
            });
        });
    }

    // Inicializar renderização de termos
    renderTerms();


    // 4. PAINEL DE GESTÃO DE IDEIAS & ANOTAÇÕES (PROTÓTIPO LOCAL)
    const ideasPanel = document.getElementById('ideasPanel');
    const btnToggleIdeasPanel = document.getElementById('btnToggleIdeasPanel');
    const ideaForm = document.getElementById('ideaForm');
    const savedIdeasList = document.getElementById('savedIdeasList');
    const ideaCountBadges = document.querySelectorAll('#ideaCount');

    // Carregar ideias do LocalStorage ou inicializar vazio
    let ideas = JSON.parse(localStorage.getItem('stellantis_ideas')) || [];

    function updateIdeaCount() {
        ideaCountBadges.forEach(badge => {
            badge.textContent = ideas.length;
        });
    }

    function renderSavedIdeas() {
        if (!savedIdeasList) return;
        savedIdeasList.innerHTML = '';

        if (ideas.length === 0) {
            savedIdeasList.innerHTML = '<p class="no-ideas">Nenhuma ideia inserida ainda. Adicione acima!</p>';
            return;
        }

        ideas.forEach((idea, index) => {
            const card = document.createElement('div');
            card.className = 'idea-card';
            card.innerHTML = `
                <div class="idea-card-header">
                    <span class="idea-card-tag ${idea.type}">${idea.type}</span>
                    <button class="btn-delete-idea" data-index="${index}" title="Excluir ideia">
                        <i data-lucide="trash" style="width: 12px; height: 12px;"></i>
                    </button>
                </div>
                <h5>${idea.title}</h5>
                <p>${idea.desc}</p>
                <div style="font-size: 8px; color: var(--text-dark); text-align: right; margin-top: 4px;">
                    ${idea.date}
                </div>
            `;
            savedIdeasList.appendChild(card);
        });

        // Evento de exclusão
        document.querySelectorAll('.btn-delete-idea').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = btn.getAttribute('data-index');
                deleteIdea(index);
            });
        });

        lucide.createIcons();
    }

    function saveIdea(type, title, desc) {
        const date = new Date().toLocaleString('pt-BR');
        ideas.push({ type, title, desc, date });
        localStorage.setItem('stellantis_ideas', JSON.stringify(ideas));
        
        // Se for um novo termo de dicionário, adicioná-lo automaticamente ao dicionário!
        if (type === 'termo') {
            const newTerm = {
                id: 'custom-' + Date.now(),
                title: title,
                def: desc,
                category: 'tecnologia',
                author: 'Usuário (Ideia)'
            };
            terms.push(newTerm);
            localStorage.setItem('stellantis_terms', JSON.stringify(terms));
            renderTerms();
        }

        updateIdeaCount();
        renderSavedIdeas();
    }

    function deleteIdea(index) {
        ideas.splice(index, 1);
        localStorage.setItem('stellantis_ideas', JSON.stringify(ideas));
        updateIdeaCount();
        renderSavedIdeas();
    }

    // Toggle para expandir/retrair painel lateral
    if (btnToggleIdeasPanel && ideasPanel) {
        btnToggleIdeasPanel.addEventListener('click', () => {
            ideasPanel.classList.toggle('open');
        });
    }

    // Submit de formulário de nova ideia
    if (ideaForm) {
        ideaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('ideaType').value;
            const title = document.getElementById('ideaTitle').value;
            const desc = document.getElementById('ideaDesc').value;

            saveIdea(type, title, desc);

            // Limpar formulário
            ideaForm.reset();
            
            // Alert visual sutil
            const btn = ideaForm.querySelector('.btn-submit-idea');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i data-lucide="check"></i> Salvo com Sucesso!';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                lucide.createIcons();
            }, 1500);
            lucide.createIcons();
        });
    }

    // Botão limpar tudo
    const btnClearIdeias = document.getElementById('btnClearIdeias');
    if (btnClearIdeias) {
        btnClearIdeias.addEventListener('click', () => {
            if (confirm('Tem certeza de que deseja apagar todas as ideias salvas no protótipo?')) {
                ideas = [];
                localStorage.removeItem('stellantis_ideas');
                updateIdeaCount();
                renderSavedIdeas();
            }
        });
    }

    // Botão exportar JSON
    const btnExportIdeias = document.getElementById('btnExportIdeias');
    if (btnExportIdeias) {
        btnExportIdeias.addEventListener('click', () => {
            if (ideas.length === 0) {
                alert('Nenhuma ideia cadastrada para exportar!');
                return;
            }
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ideas, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "stellantis_ideas_export.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    }

    // Inicializar painel de ideias
    updateIdeaCount();
    renderSavedIdeas();


    // 5. CHAT IA SIMULADO (Avançado & Contextual Estilo ChatGPT)
    const chatMessagesScroll = document.getElementById('chatMessagesScroll');
    const chatInputGpt = document.getElementById('chatInputGpt');
    const btnSendGpt = document.getElementById('btnSendGpt');
    const chatEmptyState = document.getElementById('chatEmptyState');
    const btnNewChat = document.getElementById('btnNewChat');
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const historyItems = document.querySelectorAll('.history-item');

    function appendGptMessage(sender, text) {
        if (!chatMessagesScroll) return;

        // Ocultar estado vazio e mostrar contêiner de mensagens
        if (chatEmptyState) chatEmptyState.style.display = 'none';
        if (chatMessagesScroll) chatMessagesScroll.style.display = 'flex';

        const messageEl = document.createElement('div');
        messageEl.className = `message ${sender}`;
        
        const avatarHtml = sender === 'user' 
            ? '<div class="msg-avatar"><i data-lucide="user"></i></div>' 
            : '<div class="msg-avatar"><i data-lucide="bot"></i></div>';

        messageEl.innerHTML = `
            ${avatarHtml}
            <div class="msg-content">
                <p>${text}</p>
            </div>
        `;

        chatMessagesScroll.appendChild(messageEl);
        chatMessagesScroll.scrollTop = chatMessagesScroll.scrollHeight;
        lucide.createIcons();
    }

    function processGptInput() {
        if (!chatInputGpt) return;
        const query = chatInputGpt.value.trim();
        if (query === '') return;

        appendGptMessage('user', query);
        chatInputGpt.value = '';

        // Simulação de resposta da IA
        setTimeout(() => {
            let responseText = "Desculpe, não entendi essa questão automotiva. Tente me perguntar sobre 'ADAS', 'Bio-Hybrid' ou 'motores Turbo Flex'.";
            const q = query.toLowerCase();

            if (q.includes('olá') || q.includes('oi')) {
                responseText = "Olá! Sou o assistente inteligente StellantisGPT. No que posso te ajudar hoje? Posso te explicar sobre tecnologias de propulsão ou te ajudar a criar novos verbetes.";
            } else if (q.includes('adas')) {
                responseText = "O **ADAS** (Advanced Driver Assistance Systems) engloba assistentes como Frenagem Autônoma de Emergência, Detecção de Fadiga e Piloto Automático Adaptativo. No Jeep Commander, o ADAS atinge o nível 2 de automação.";
            } else if (q.includes('bio-hybrid') || q.includes('hibrido') || q.includes('híbrido')) {
                responseText = "O **Bio-Hybrid** da Stellantis é uma tecnologia inovadora que une eletrificação a motores flex movidos a etanol, ideal para a transição energética sustentável no Brasil.";
            } else if (q.includes('t270') || q.includes('motor turbo')) {
                responseText = "O motor **T270 Turbo Flex** tem 1.3L, injeção direta de combustível e comando de válvulas MultiAir III. Produz até 185 cavalos de potência. É considerado um dos motores flex mais modernos do mundo.";
            } else if (q.includes('plataforma') || q.includes('stla')) {
                responseText = "A Stellantis possui quatro plataformas globais voltadas para BEVs (Veículos Elétricos a Bateria): STLA Small, STLA Medium, STLA Large e STLA Frame. Elas oferecem alta flexibilidade estrutural.";
            } else if (q.includes('ideia') || q.includes('prototipo') || q.includes('sugestão')) {
                responseText = "Você pode inserir qualquer ideia ou feedback usando o **Painel de Ideias** na lateral direita da sua tela! Basta preencher o tipo, título e descrição.";
            } else if (q.includes('criar') && q.includes('termo')) {
                responseText = "Claro! Para criar um novo termo, use o Painel de Ideias na direita e escolha a opção 'Novo Termo para Dicionário'. Ele aparecerá imediatamente na nossa grade de busca do Dicionário.";
            }

            appendGptMessage('system', responseText);
        }, 800);
    }

    if (btnSendGpt) {
        btnSendGpt.addEventListener('click', processGptInput);
    }
    if (chatInputGpt) {
        chatInputGpt.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                processGptInput();
            }
        });
    }

    // Botão de Novo Chat
    if (btnNewChat) {
        btnNewChat.addEventListener('click', () => {
            if (chatMessagesScroll) {
                chatMessagesScroll.innerHTML = '';
                chatMessagesScroll.style.display = 'none';
            }
            if (chatEmptyState) {
                chatEmptyState.style.display = 'flex';
            }
            historyItems.forEach(item => item.classList.remove('active'));
        });
    }

    // Ações dos cartões de sugestão
    suggestionCards.forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            if (chatInputGpt) {
                chatInputGpt.value = prompt;
                processGptInput();
            }
        });
    });

    // Simulação do histórico lateral
    historyItems.forEach(item => {
        item.addEventListener('click', () => {
            historyItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const title = item.textContent.trim();
            
            // Limpar mensagens atuais e simular carregamento
            if (chatMessagesScroll) chatMessagesScroll.innerHTML = '';
            
            appendGptMessage('user', `Carregar histórico: ${title}`);
            setTimeout(() => {
                let loadResponse = `Carregando histórico do chat sobre **${title}**. Aqui estão as últimas diretrizes discutidas...`;
                if (title.includes('ADAS')) {
                    loadResponse += "\n\nO sistema ADAS Stellantis monitora constantemente o ambiente. A câmera no para-brisa atua de forma redundante ao radar frontal.";
                } else if (title.includes('Motores')) {
                    loadResponse += "\n\nA linha de motores GSE Turbo (T270 e T200) emprega bloco em alumínio e cabeçote MultiAir para controle dinâmico de admissão.";
                } else {
                    loadResponse += "\n\nAs plataformas modulares STLA suportam carregamento rápido e eletrificação avançada.";
                }
                appendGptMessage('system', loadResponse);
            }, 400);
        });
    });

    // ========================================================
    // 6. LÓGICA DO CENTRO DE TREINAMENTO (SUBABAS, FLASHCARDS, LEITOR)
    // ========================================================
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    const trainingSubSections = document.querySelectorAll('.training-sub-section');
    const flashcards = document.querySelectorAll('.flashcard');
    const btnStartCourses = document.querySelectorAll('.btn-start-course');
    const readerEmptyState = document.getElementById('readerEmptyState');
    const readerContentArea = document.getElementById('readerContentArea');
    const courseCards = document.querySelectorAll('.course-card');

    // Troca de Subabas (Cards vs Conteúdo)
    if (subNavBtns) {
        subNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                subNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.getAttribute('data-subtarget');
                trainingSubSections.forEach(sec => {
                    sec.classList.remove('active');
                    if (sec.id === `sub-sec-${target}`) {
                        sec.classList.add('active');
                    }
                });
            });
        });
    }

    // LÓGICA DE FLASHCARDS PERSONALIZADOS (LOCALSTORAGE & ROTAÇÃO 3D)
    let customCards = JSON.parse(localStorage.getItem('stellantis_custom_flashcards')) || [];
    const flashcardsGrid = document.querySelector('.flashcards-grid');

    function renderCustomFlashcards() {
        if (!flashcardsGrid) return;
        
        // Limpar cartões personalizados anteriores
        const previouslyAdded = flashcardsGrid.querySelectorAll('.custom-flashcard-container');
        previouslyAdded.forEach(el => el.remove());

        // Injetar novos cartões
        customCards.forEach(cardData => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'flashcard-container custom-flashcard-container';
            cardWrapper.innerHTML = `
                <div class="flashcard">
                    <div class="flashcard-front">
                        <div class="card-logo-watermark">${cardData.watermark}</div>
                        <h4>${cardData.title}</h4>
                        <p>${cardData.question}</p>
                        <span class="click-hint"><i data-lucide="help-circle"></i> Revelar Resposta</span>
                    </div>
                    <div class="flashcard-back">
                        <h4>Resposta Técnica</h4>
                        <p>${cardData.answer}</p>
                        <span class="click-hint-back"><i data-lucide="rotate-ccw"></i> Voltar</span>
                    </div>
                </div>
            `;
            flashcardsGrid.appendChild(cardWrapper);
        });

        // Atualizar ícones do Lucide
        lucide.createIcons();
    }

    // Delegação de eventos para virar qualquer flashcard (estático ou dinâmico)
    if (flashcardsGrid) {
        flashcardsGrid.addEventListener('click', (e) => {
            const card = e.target.closest('.flashcard');
            if (card) {
                card.classList.toggle('flipped');
            }
        });
    }

    // Renderizar flashcards salvos ao inicializar
    renderCustomFlashcards();

    // INTERATIVIDADE DO MODAL DE NOVO FLASHCARD
    const modalAddCard = document.getElementById('modalAddCard');
    const btnOpenAddCardModal = document.getElementById('btnOpenAddCardModal');
    const btnCloseAddCardModal = document.getElementById('btnCloseAddCardModal');
    const btnCancelAddCardModal = document.getElementById('btnCancelAddCardModal');
    const btnSaveNewCard = document.getElementById('btnSaveNewCard');
    const formAddCard = document.getElementById('formAddCard');

    if (btnOpenAddCardModal && modalAddCard) {
        btnOpenAddCardModal.addEventListener('click', () => {
            modalAddCard.classList.add('open');
        });
    }

    const fcSearchDictionary = document.getElementById('fcSearchDictionary');
    const fcSearchSuggestions = document.getElementById('fcSearchSuggestions');

    function closeAddCardModal() {
        if (modalAddCard) {
            modalAddCard.classList.remove('open');
            if (formAddCard) formAddCard.reset();
            if (fcSearchDictionary) fcSearchDictionary.value = '';
            if (fcSearchSuggestions) {
                fcSearchSuggestions.innerHTML = '';
                fcSearchSuggestions.style.display = 'none';
            }
        }
    }

    if (fcSearchDictionary && fcSearchSuggestions) {
        fcSearchDictionary.addEventListener('input', () => {
            const query = fcSearchDictionary.value.trim().toLowerCase();
            fcSearchSuggestions.innerHTML = '';
            
            if (query.length < 2) {
                fcSearchSuggestions.style.display = 'none';
                return;
            }

            const matched = terms.filter(t => 
                t.title.toLowerCase().includes(query) || 
                t.def.toLowerCase().includes(query)
            );

            if (matched.length === 0) {
                fcSearchSuggestions.innerHTML = '<div style="padding: 10px 14px; font-size: 13px; color: var(--text-dark); text-align: center;">Nenhum termo correspondente</div>';
                fcSearchSuggestions.style.display = 'block';
                return;
            }

            matched.forEach(t => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: var(--text-muted); transition: all 0.2s ease; display: flex; justify-content: space-between; align-items: center;';
                item.innerHTML = `<strong>${t.title}</strong> <span style="font-size: 10px; background: rgba(6,182,212,0.15); color: var(--secondary); padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">${t.category}</span>`;
                
                item.addEventListener('mouseenter', () => {
                    item.style.background = 'rgba(59, 130, 246, 0.15)';
                    item.style.color = 'var(--text-main)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.background = 'transparent';
                    item.style.color = 'var(--text-muted)';
                });

                item.addEventListener('click', () => {
                    // Preencher o formulário do flashcard
                    const watermarkInput = document.getElementById('cardWatermark');
                    const titleInput = document.getElementById('cardTitle');
                    const questionInput = document.getElementById('cardQuestion');
                    const answerInput = document.getElementById('cardAnswer');

                    if (watermarkInput) watermarkInput.value = t.title.charAt(0).toUpperCase();
                    if (titleInput) titleInput.value = t.title;
                    if (questionInput) questionInput.value = `O que é ${t.title}?`;
                    if (answerInput) answerInput.value = t.def;

                    // Limpar e fechar
                    fcSearchDictionary.value = '';
                    fcSearchSuggestions.innerHTML = '';
                    fcSearchSuggestions.style.display = 'none';

                    // Feedback visual sutil
                    [watermarkInput, titleInput, questionInput, answerInput].forEach(inp => {
                        if (inp) {
                            inp.style.borderColor = 'var(--secondary)';
                            setTimeout(() => {
                                inp.style.borderColor = 'var(--glass-border)';
                            }, 800);
                        }
                    });
                });

                fcSearchSuggestions.appendChild(item);
            });

            fcSearchSuggestions.style.display = 'block';
        });

        document.addEventListener('click', (e) => {
            if (e.target !== fcSearchDictionary && e.target !== fcSearchSuggestions && !fcSearchSuggestions.contains(e.target)) {
                fcSearchSuggestions.innerHTML = '';
                fcSearchSuggestions.style.display = 'none';
            }
        });
    }

    if (btnCloseAddCardModal) {
        btnCloseAddCardModal.addEventListener('click', closeAddCardModal);
    }
    if (btnCancelAddCardModal) {
        btnCancelAddCardModal.addEventListener('click', closeAddCardModal);
    }
    if (modalAddCard) {
        modalAddCard.addEventListener('click', (e) => {
            if (e.target === modalAddCard) {
                closeAddCardModal();
            }
        });
    }

    if (btnSaveNewCard) {
        btnSaveNewCard.addEventListener('click', () => {
            const watermarkInput = document.getElementById('cardWatermark');
            const titleInput = document.getElementById('cardTitle');
            const questionInput = document.getElementById('cardQuestion');
            const answerInput = document.getElementById('cardAnswer');

            if (!watermarkInput || !titleInput || !questionInput || !answerInput) return;

            const watermark = watermarkInput.value.trim().toUpperCase().substring(0, 1);
            const title = titleInput.value.trim();
            const question = questionInput.value.trim();
            const answer = answerInput.value.trim();

            if (watermark === '' || title === '' || question === '' || answer === '') {
                alert('Por favor, preencha todos os campos do flashcard.');
                return;
            }

            const newCard = {
                watermark: watermark,
                title: title,
                question: question,
                answer: answer
            };

            // Salvar no array e persistir no LocalStorage
            customCards.push(newCard);
            localStorage.setItem('stellantis_custom_flashcards', JSON.stringify(customCards));

            // Re-renderizar e fechar modal
            renderCustomFlashcards();
            closeAddCardModal();
        });
    }

    // Banco de Dados de Cursos
    const coursesContent = {
        biohybrid: {
            title: "Eletrificação Bio-Hybrid Flex",
            level: "Iniciante",
            duration: "15 min",
            body: `
                <p>A tecnologia <strong>Bio-Hybrid</strong> é a resposta estratégica da Stellantis para a descarbonização inteligente nos mercados emergentes, como a América Latina. Em vez de focar exclusivamente em elétricos a bateria (BEVs) de custo elevado, o sistema combina a alta eficiência dos <strong>biocombustíveis (etanol)</strong> com diferentes níveis de assistência elétrica.</p>
                
                <h5>Arquitetura MHEV (Híbrido Leve de 48V):</h5>
                <p>Nesse sistema, o alternador e motor de partida tradicionais são substituídos por um motor elétrico multifuncional de <strong>3 kW (aprox. 4 cv)</strong> alimentado por uma bateria de íons de lítio de 48V. Esse motor elétrico auxilia o motor térmico nas arrancadas e retomadas, momento em que o consumo de combustível é maior.</p>
                
                <h5>Regeneração de Energia:</h5>
                <p>Durante as desacelerações e frenagens, o motor elétrico atua como gerador, convertendo a energia cinética que seria desperdiçada em calor nos freios em eletricidade para recarregar a bateria auxiliar.</p>
                
                <div class="reader-note">
                    <strong>Nota do Engenheiro:</strong> O sistema reduz em até 15% a emissão de CO2 quando abastecido com etanol, oferecendo a menor pegada de carbono do ciclo "poço ao roda" disponível no mercado.
                </div>
            `
        },
        adas: {
            title: "Arquitetura de Sensores ADAS",
            level: "Intermediário",
            duration: "30 min",
            body: `
                <p>O <strong>ADAS (Advanced Driver Assistance Systems)</strong> de nível 2 da Stellantis requer uma leitura tridimensional e precisa do ambiente externo do veículo. Para isso, os modelos da marca empregam uma fusão de dados baseada em múltiplos tipos de sensores.</p>
                
                <h5>Radar de Ondas Milimétricas (Frontal):</h5>
                <p>Instalado na grade frontal inferior, emite ondas de rádio milimétricas para medir com precisão milimétrica a distância e a velocidade relativa do veículo à frente. Ele é insensível às condições de iluminação, chuva ou neblina.</p>
                
                <h5>Câmera Estereoscópica de Alta Definição:</h5>
                <p>Montada na parte interna superior do para-brisa. Ela identifica marcações de faixas de rodagem na pista, pedestres, ciclistas e placas de trânsito. A fusão do radar com a câmera garante a redundância necessária para a segurança ativa.</p>
                
                <h5>Sensores Ultrassônicos e Câmeras 360°:</h5>
                <p>Usados para manobras de baixa velocidade, detecção de tráfego cruzado traseiro e monitoramento de ponto cego nos retrovisores.</p>
                
                <div class="reader-note">
                    <strong>Nota do Engenheiro:</strong> Se a câmera do para-brisa detectar obstrução por sujeira ou chuva intensa, o sistema alerta o motorista e desativa temporariamente os recursos que necessitam de leitura visual das faixas.
                </div>
            `
        },
        motores: {
            title: "Mapeamento Térmico & MultiAir III",
            level: "Avançado",
            duration: "45 min",
            body: `
                <p>O motor Stellantis <strong>T270 (1.3 Turbo Flex)</strong> destaca-se pela adoção do cabeçote com controle eletro-hidráulico de válvulas <strong>MultiAir III</strong>, patente exclusiva do grupo.</p>
                
                <h5>Controle Dinâmico de Admissão:</h5>
                <p>Diferente de um comando de válvulas mecânico rígido, o MultiAir utiliza uma câmara hidráulica entre o came de comando e a válvula de admissão. Uma válvula solenoide solta ou prende o óleo na câmara, permitindo alterar a abertura e o fechamento das válvulas de admissão em tempo real.</p>
                
                <h5>Estratégias de Carga Parcial (Ciclo Miller):</h5>
                <p>Em cargas baixas, o MultiAir fecha as válvulas de admissão antes do tempo (antecipado), forçando uma expansão que resfria a câmara e diminui perdas de bombeamento, otimizando o consumo. Em plena carga, adota abertura máxima para rendimento volumétrico total.</p>
                
                <h5>Turbocompressor Otimizado:</h5>
                <p>Emprega turbina do tipo mono-scroll de baixo volume interno. A wastegate (válvula de alívio) tem controle elétrico ultra-rápido, minimizando o lag do turbo e mantendo a pressão de sobrealimentação ideal em qualquer regime.</p>
                
                <div class="reader-note">
                    <strong>Nota do Engenheiro:</strong> O controle MultiAir III opera de forma assíncrona para cada cilindro, permitindo estratégias refinadas de aquecimento rápido do catalisador após a partida a frio.
                </div>
            `
        }
    };

    // Acessar Conteúdo do Curso
    if (btnStartCourses) {
        btnStartCourses.forEach(btn => {
            btn.addEventListener('click', () => {
                const courseKey = btn.getAttribute('data-course');
                const data = coursesContent[courseKey];
                
                if (data && readerContentArea && readerEmptyState) {
                    // Marcar card como ativo
                    courseCards.forEach(c => c.classList.remove('active'));
                    const card = document.querySelector(`.course-card[data-course="${courseKey}"]`);
                    if (card) card.classList.add('active');

                    // Preencher leitor
                    readerContentArea.innerHTML = `
                        <div class="reader-header">
                            <h3>${data.title}</h3>
                            <div class="reader-meta">
                                <span class="course-badge ${data.level.toLowerCase()}">${data.level}</span>
                                <span><i data-lucide="clock" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Duração: ${data.duration}</span>
                            </div>
                        </div>
                        <div class="reader-body">
                            ${data.body}
                            <button class="btn-primary" style="margin-top: 10px; width: fit-content;" id="btnCompleteModule" data-course="${courseKey}">
                                <i data-lucide="check-circle"></i> Concluir Módulo de Treinamento
                            </button>
                        </div>
                    `;

                    // Mostrar leitor e ocultar estado vazio
                    readerEmptyState.style.display = 'none';
                    readerContentArea.style.display = 'flex';
                    
                    lucide.createIcons();

                    // Lógica de conclusão do módulo
                    const btnComplete = document.getElementById('btnCompleteModule');
                    if (btnComplete) {
                        btnComplete.addEventListener('click', () => {
                            // Simular atualização de progresso
                            if (card) {
                                const progressFill = card.querySelector('.progress-bar-fill');
                                const progressText = card.querySelector('.progress-text');
                                if (progressFill && progressText) {
                                    progressFill.style.width = '100%';
                                    progressText.textContent = '100% Concluído';
                                    progressText.style.color = '#34d399';
                                }
                            }
                            // Adicionar XP e ativar badge de conquista
                            if (window.addXpOnCompletion) {
                                window.addXpOnCompletion(courseKey);
                            }
                            btnComplete.innerHTML = '<i data-lucide="check"></i> Módulo Concluído!';
                            btnComplete.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                            lucide.createIcons();
                        });
                    }
                }
            });
        });
    }

    // ========================================================
    // 7. LÓGICA DA ABA INFORMAÇÕES & DROPDOWNS DO MENU
    // ========================================================
    const infoSubNavBtns = document.querySelectorAll('.info-sub-nav .sub-nav-btn');
    const infoSubSections = document.querySelectorAll('.info-sub-section');
    const btnContactSpecialists = document.querySelectorAll('.btn-contact-specialist');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');

    // Troca de Subabas em Informações (Especialistas vs Diretrizes)
    if (infoSubNavBtns) {
        infoSubNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                infoSubNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.getAttribute('data-infosub');
                infoSubSections.forEach(sec => {
                    sec.classList.remove('active');
                    if (sec.id === `info-sec-${target}`) {
                        sec.classList.add('active');
                    }
                });
            });
        });
    }

    // Troca de Subabas em Onboarding
    const onboardingSubNavBtns = document.querySelectorAll('.onboarding-sub-nav .sub-nav-btn');
    const onboardingSubSections = document.querySelectorAll('.onboarding-sub-section');

    if (onboardingSubNavBtns) {
        onboardingSubNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                onboardingSubNavBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const target = btn.getAttribute('data-onboardingsub');
                onboardingSubSections.forEach(sec => {
                    sec.classList.remove('active');
                    if (sec.id === `onboarding-sec-${target}`) {
                        sec.classList.add('active');
                    }
                });
            });
        });
    }

    // Lógica para links do dropdown menu superior
    if (dropdownLinks) {
        dropdownLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita dupla ativação
                const targetId = link.getAttribute('data-target');
                const subtarget = link.getAttribute('data-sub');
                
                // Mudar seção principal
                switchSection(targetId);
                
                // Mudar subaba correspondente
                if (targetId === 'treinamento' && subtarget) {
                    const subBtn = document.querySelector(`.sub-nav-btn[data-subtarget="${subtarget}"]`);
                    if (subBtn) subBtn.click();
                } else if (targetId === 'informacoes' && subtarget) {
                    const subBtn = document.querySelector(`.sub-nav-btn[data-infosub="${subtarget}"]`);
                    if (subBtn) subBtn.click();
                } else if (targetId === 'onboarding' && subtarget) {
                    const subBtn = document.querySelector(`.sub-nav-btn[data-onboardingsub="${subtarget}"]`);
                    if (subBtn) subBtn.click();
                }
            });
        });
    }

    // Contatar Especialista (integração com Chat IA)
    if (btnContactSpecialists) {
        btnContactSpecialists.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                const dept = btn.getAttribute('data-dept');
                
                // Redireciona para o Chat IA
                switchSection('chat-ia');
                
                // Digita e foca
                if (chatInputGpt) {
                    chatInputGpt.value = `Olá! Gostaria de falar com o especialista ${name} sobre o departamento de ${dept}. Como posso tirar dúvidas sobre isso?`;
                    chatInputGpt.focus();
                }
            });
        });
    }

    // ========================================================
    // 8. SISTEMA DE AUTENTICAÇÃO E GAMIFICAÇÃO (XP & BADGES)
    // ========================================================
    const btnProfileToggle = document.getElementById('btnProfileToggle');
    const profileDropdownCard = document.getElementById('profileDropdownCard');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const userProfileMenuContainer = document.getElementById('userProfileMenuContainer');

    // Carregar Estado de Gamificação do LocalStorage
    let userXp = parseInt(localStorage.getItem('stellantis_user_xp')) || 850;
    let userLevel = parseInt(localStorage.getItem('stellantis_user_level')) || 3;
    let userBadges = JSON.parse(localStorage.getItem('stellantis_user_badges')) || {
        biohybrid: true, // Já começa ativo no protótipo como exemplo
        adas: false,
        motores: false
    };

    function updateProfileUI() {
        const xpText = document.getElementById('profileXpText');
        const xpBar = document.getElementById('profileXpBar');
        const xpLevel = document.getElementById('profileXpLevel');
        
        // Atualizar insígnias no DOM
        const badgeBio = document.getElementById('badgeBioHybrid');
        const badgeAdasDom = document.getElementById('badgeADAS');
        const badgeMot = document.getElementById('badgeMotores');

        if (xpText && xpBar && xpLevel) {
            let maxXp = 1500;
            if (userLevel === 4) maxXp = 2500; // Aumenta teto se subiu de nível
            
            xpText.textContent = `${userXp} / ${maxXp} XP`;
            xpBar.style.width = `${Math.min((userXp / maxXp) * 100, 100)}%`;
            xpLevel.textContent = userLevel === 3 ? "Nível 3 (Pleno)" : "Nível 4 (Sênior)";
        }

        // Ativar/Inativar classes
        if (badgeBio) {
            if (userBadges.biohybrid) badgeBio.classList.add('active');
            else badgeBio.classList.remove('active');
        }
        if (badgeAdasDom) {
            if (userBadges.adas) badgeAdasDom.classList.add('active');
            else badgeAdasDom.classList.remove('active');
        }
        if (badgeMot) {
            if (userBadges.motores) badgeMot.classList.add('active');
            else badgeMot.classList.remove('active');
        }
    }

    // Toggle do dropdown de perfil
    if (btnProfileToggle && profileDropdownCard) {
        btnProfileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdownCard.classList.toggle('open');
        });
    }

    // Fechar dropdown de perfil ao clicar fora
    document.addEventListener('click', (e) => {
        if (profileDropdownCard && !profileDropdownCard.contains(e.target) && btnProfileToggle && !btnProfileToggle.contains(e.target)) {
            profileDropdownCard.classList.remove('open');
        }
    });

    // Lógica de Sair (Logout)
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (userProfileMenuContainer) userProfileMenuContainer.style.display = 'none';
            if (btnLogin) btnLogin.style.display = 'block';
            profileDropdownCard.classList.remove('open');
        });
    }

    // Lógica de Entrar (Login)
    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            if (btnLogin) btnLogin.style.display = 'none';
            if (userProfileMenuContainer) userProfileMenuContainer.style.display = 'block';
            
            // Re-renderizar ícones ao logar para garantir
            lucide.createIcons();
            
            // Mensagem de boas-vindas sutil
            alert('Bem-vindo de volta, Eduardo Henrique!');
        });
    }

    // Função global para adicionar XP chamada quando um módulo é concluído
    window.addXpOnCompletion = function(courseKey) {
        let xpGained = 0;
        let badgeEarned = '';

        if (courseKey === 'biohybrid' && !userBadges.biohybrid) {
            userBadges.biohybrid = true;
            xpGained = 350;
            badgeEarned = 'Bio-H';
        } else if (courseKey === 'adas' && !userBadges.adas) {
            userBadges.adas = true;
            xpGained = 350;
            badgeEarned = 'ADAS';
        } else if (courseKey === 'motores' && !userBadges.motores) {
            userBadges.motores = true;
            xpGained = 350;
            badgeEarned = 'MultiAir';
        }

        if (xpGained > 0) {
            userXp += xpGained;
            
            // Lógica de Level Up
            let maxXp = userLevel === 3 ? 1500 : 2500;
            if (userXp >= maxXp) {
                userLevel = 4;
                userXp = userXp - maxXp; // Transfere o restante
                setTimeout(() => {
                    alert('🎉 PARABÉNS! Você subiu de nível no Stellantis Dictionary!\nAgora seu cargo foi atualizado para: Engenheiro de Produto Sênior (Nível 4)');
                    
                    // Atualizar cargo no Header do dropdown
                    const cargoLabel = document.querySelector('.profile-cargo');
                    if (cargoLabel) cargoLabel.textContent = "Engenheiro de Produto Sênior";
                }, 800);
            } else {
                setTimeout(() => {
                    alert(`⭐ +${xpGained} XP Adquirido! Insígnia "${badgeEarned}" ativada no seu perfil.`);
                }, 800);
            }

            // Salvar no LocalStorage
            localStorage.setItem('stellantis_user_xp', userXp);
            localStorage.setItem('stellantis_user_level', userLevel);
            localStorage.setItem('stellantis_user_badges', JSON.stringify(userBadges));
            
            updateProfileUI();
        }
    };

    // Inicializar interface de perfil de usuário
    updateProfileUI();

    // ========================================================
    // 9. LÓGICA DO MODAL DE DETALHES DE VERSÕES DE PROJETOS
    // ========================================================
    const projectDetailsData = {
        J3U: {
            title: "Gama de Modelos Jeep Compass",
            subtitle: "Projeto J3U - SUV Médio Líder de Vendas",
            versions: [
                {
                    name: "Compass Sport T270",
                    engine: "1.3 Turbo Flex (185 cv)",
                    transmission: "Automático 6 marchas",
                    traction: "4x2 Dianteira",
                    description: "Versão de entrada focada em excelente relação custo-benefício. Traz quadro digital, faróis Full LED e rodas de liga aro 18.",
                    highlights: ["Faróis Full LED", "Rodas de Liga Aro 18", "Ar Dual-Zone"]
                },
                {
                    name: "Compass Longitude T270 / TD380",
                    engine: "1.3 Turbo Flex (185 cv) ou 2.0 Turbo Diesel (170 cv)",
                    transmission: "Automático 6 marchas (Flex) ou 9 marchas (Diesel)",
                    traction: "4x2 (Flex) ou 4x4 Jeep Active Drive (Diesel)",
                    description: "A configuração mais vendida da linha. Soma acabamento interno premium em couro, central de 10.1 polegadas e painel digital de 10.25 polegadas.",
                    highlights: ["Couro Premium", "Multimídia 10.1\"", "Painel 10.25\""]
                },
                {
                    name: "Compass Limited T270 / TD380",
                    engine: "1.3 Turbo Flex (185 cv) ou 2.0 Turbo Diesel (170 cv)",
                    transmission: "Automático 6 marchas (Flex) ou 9 marchas (Diesel)",
                    traction: "4x2 (Flex) ou 4x4 (Diesel)",
                    description: "Foco em tecnologia e requinte superior. Oferece assistências de condução semiautônoma ADAS completas, banco elétrico e sete airbags.",
                    highlights: ["Sistemas ADAS", "Sete Airbags", "Bancos Elétricos"]
                },
                {
                    name: "Compass Série S T270 / Hurricane 4",
                    engine: "1.3 Turbo Flex (185 cv) ou 2.0 Turbo Hurricane Gasolina (272 cv)",
                    transmission: "Automático 6 marchas (Flex) ou 9 marchas (Hurricane)",
                    traction: "4x2 (Flex) ou 4x4 (Hurricane)",
                    description: "O topo do requinte urbano com apelo esportivo. Visual totalmente escurecido (black pack), teto solar panorâmico, som Beats premium de 506 Watts e motor Hurricane 4 de alta performance.",
                    highlights: ["Som Beats 506W", "Teto Solar Panorâmico", "Hurricane 4 (272 cv)"]
                },
                {
                    name: "Compass Trailhawk TD380",
                    engine: "2.0 Turbo Diesel (170 cv)",
                    transmission: "Automático 9 marchas",
                    traction: "4x4 Off-Road Trail Rated",
                    description: "Desenvolvido para transpor obstáculos off-road extremos. Possui suspensão elevada, pneus especiais para uso na lama, ganchos de reboque vermelhos e protetores metálicos.",
                    highlights: ["Selo Trail Rated", "Ganchos Vermelhos", "Suspensão Elevada Off-road"]
                },
                {
                    name: "Compass 4xe (Híbrido Plug-in)",
                    engine: "1.3 Turbo Flex + Motor Elétrico (240 cv combinado)",
                    transmission: "Automático 6 marchas",
                    traction: "4x4 E-AWD Integral Elétrica",
                    description: "Tecnologia de eletrificação plug-in importada. Roda até 44 km em modo 100% elétrico com consumo médio simulado superior a 25 km/l.",
                    highlights: ["Bateria recarregável (PHEV)", "Consumo > 25 km/l", "Modo 100% Elétrico"]
                }
            ]
        },
        T90: {
            title: "Gama de Modelos Ram Rampage",
            subtitle: "Projeto T90 - Picape Intermediária Premium",
            versions: [
                {
                    name: "Rampage Rebel",
                    engine: "2.0 Turbo Diesel (170 cv) ou 2.0 Turbo Hurricane (272 cv)",
                    transmission: "Automático 9 marchas",
                    traction: "4x4 Integral Ativa",
                    description: "Aparência off-road robusta com grade preta estilizada, pneus todo-terreno e visual agressivo ideal para terra e asfalto.",
                    highlights: ["Pneus All-Terrain", "Visual Rebel Escurecido", "Tração 4x4"]
                },
                {
                    name: "Rampage Laramie",
                    engine: "2.0 Turbo Diesel (170 cv) ou 2.0 Turbo Hurricane (272 cv)",
                    transmission: "Automático 9 marchas",
                    traction: "4x4 Integral Ativa",
                    description: "Foco no requinte com acabamento cromado na grade e molduras de janelas, além de interior revestido em couro marrom premium.",
                    highlights: ["Grade Cromada", "Couro Marrom Premium", "Rodas Aro 18 Diamantadas"]
                },
                {
                    name: "Rampage R/T",
                    engine: "2.0 Turbo Hurricane Gasolina (272 cv)",
                    transmission: "Automático 9 marchas",
                    traction: "4x4 Integral Ativa",
                    description: "Calibração esportiva com escapamento duplo ativo, suspensão rebaixada, rodas pretas aro 19 e modo de condução esportivo R/T dedicado.",
                    highlights: ["Modo R/T Esportivo", "Duplo Escapamento", "Suspensão Rebaixada"]
                }
            ]
        },
        J4U: {
            title: "Gama de Modelos Jeep Commander",
            subtitle: "Projeto J4U - D-SUV de 7 Lugares Premium",
            versions: [
                {
                    name: "Commander Longitude T270",
                    engine: "1.3 Turbo Flex (185 cv)",
                    transmission: "Automático 6 marchas",
                    traction: "4x2 Dianteira",
                    description: "Versão de entrada para o SUV de 7 lugares. Acabamento interno requintado em suede e couro preto, painel digital e ótimo espaço de bagageiro.",
                    highlights: ["7 Lugares", "Suede & Couro Preto", "Multimídia 10.1\""]
                },
                {
                    name: "Commander Limited T270 / TD380",
                    engine: "1.3 Turbo Flex (185 cv) ou 2.0 Turbo Diesel (170 cv)",
                    transmission: "Automático 6 marchas (Flex) ou 9 marchas (Diesel)",
                    traction: "4x2 (Flex) ou 4x4 (Diesel)",
                    description: "Versão clássica de luxo. Soma as assistências autônomas ADAS completas, porta-malas com abertura automática elétrica por aproximação e rodas aro 19.",
                    highlights: ["ADAS Avançado", "Abertura Elétrica Porta-malas", "Rodas Aro 19"]
                },
                {
                    name: "Commander Overland T270 / TD380 / Hurricane 4",
                    engine: "T270 Flex, TD380 Diesel ou Hurricane 4 Gasolina (272 cv)",
                    transmission: "Automático 6 marchas (Flex) ou 9 marchas (Diesel/Gasolina)",
                    traction: "4x2 (Flex) ou 4x4 (Diesel/Gasolina)",
                    description: "O máximo do luxo da marca. Teto solar panorâmico, som Harman Kardon de altíssima fidelidade, interior marrom cooper e acabamentos sofisticados.",
                    highlights: ["Som Harman Kardon", "Teto Solar Panorâmico", "Couro Cooper Premium"]
                },
                {
                    name: "Commander Blackhawk Hurricane 4",
                    engine: "2.0 Turbo Hurricane Gasolina (272 cv)",
                    transmission: "Automático 9 marchas",
                    traction: "4x4 Integral",
                    description: "A união de altíssima performance com visual sombrio. Detalhes em preto brilhante, pinças de freio vermelhas e motor de 272 cv capaz de ir de 0 a 100 km/h em 7 segundos.",
                    highlights: ["Visual Blackhawk", "Hurricane 4 (272 cv)", "Aceleração Esportiva"]
                }
            ]
        }
    };

    const modalProjectDetails = document.getElementById('modalProjectDetails');
    const projectModalTitle = document.getElementById('projectModalTitle');
    const projectModalSubtitle = document.getElementById('projectModalSubtitle');
    const projectModalBody = document.getElementById('projectModalBody');
    const btnCloseProjectModal = document.getElementById('btnCloseProjectModal');
    const btnCloseProjectModalBtn = document.getElementById('btnCloseProjectModalBtn');
    
    // Adicionar eventos de clique nos cards de projeto
    const projectCards = document.querySelectorAll('.project-card');
    if (projectCards) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const codeBadge = card.querySelector('.project-code-badge');
                if (codeBadge) {
                    const projectCode = codeBadge.textContent.trim();
                    openProjectDetailsModal(projectCode);
                }
            });
        });
    }

    function openProjectDetailsModal(code) {
        const data = projectDetailsData[code];
        if (!data || !modalProjectDetails || !projectModalTitle || !projectModalSubtitle || !projectModalBody) return;

        projectModalTitle.textContent = data.title;
        projectModalSubtitle.textContent = data.subtitle;

        // Limpar corpo e gerar HTML
        projectModalBody.innerHTML = '';
        const listGrid = document.createElement('div');
        listGrid.className = 'versions-list-grid';

        data.versions.forEach(ver => {
            const verCard = document.createElement('div');
            verCard.className = 'version-detail-card';

            // Highlights HTML
            let highlightsHtml = '';
            ver.highlights.forEach(h => {
                highlightsHtml += `<span class="highlight-tag">${h}</span>`;
            });

            verCard.innerHTML = `
                <div class="version-card-header">
                    <h4>${ver.name}</h4>
                    <span class="version-engine-badge">${ver.engine.split(' ')[0]}</span>
                </div>
                <div class="version-specs-grid">
                    <div class="spec-info-item">
                        <span>Motor</span>
                        <span>${ver.engine}</span>
                    </div>
                    <div class="spec-info-item">
                        <span>Câmbio</span>
                        <span>${ver.transmission}</span>
                    </div>
                    <div class="spec-info-item">
                        <span>Tração</span>
                        <span>${ver.traction}</span>
                    </div>
                </div>
                <p class="version-detail-desc">${ver.description}</p>
                <div class="version-highlights">
                    ${highlightsHtml}
                </div>
            `;
            listGrid.appendChild(verCard);
        });

        projectModalBody.appendChild(listGrid);
        modalProjectDetails.classList.add('open');
        lucide.createIcons();
    }

    // Fechar Modal
    if (btnCloseProjectModal) {
        btnCloseProjectModal.addEventListener('click', () => {
            modalProjectDetails.classList.remove('open');
        });
    }
    if (btnCloseProjectModalBtn) {
        btnCloseProjectModalBtn.addEventListener('click', () => {
            modalProjectDetails.classList.remove('open');
        });
    }
    
    // Fechar ao clicar no overlay
    if (modalProjectDetails) {
        modalProjectDetails.addEventListener('click', (e) => {
            if (e.target === modalProjectDetails) {
                modalProjectDetails.classList.remove('open');
            }
        });
    }

    // ========================================================
    // 10. FILTRO DE COMPONENTES DE INFOTAINMENT (DUPLO FILTRO)
    // ========================================================
    const componentFilterBtns = document.querySelectorAll('#filterBarComponent .infotainment-filter-btn');
    const supplierFilterBtns = document.querySelectorAll('#filterBarSupplier .infotainment-filter-btn');
    const infotainmentCards = document.querySelectorAll('.infotainment-card');

    let activeCategory = 'all';
    let activeSupplier = 'all';

    function applyInfotainmentFilters() {
        if (!infotainmentCards) return;

        infotainmentCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            
            setTimeout(() => {
                const cardCategory = card.getAttribute('data-infocategory');
                const cardSupplier = card.getAttribute('data-infosupplier');

                const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
                const matchesSupplier = activeSupplier === 'all' || cardSupplier === activeSupplier;

                if (matchesCategory && matchesSupplier) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            }, 200);
        });
    }

    if (componentFilterBtns) {
        componentFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                componentFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeCategory = btn.getAttribute('data-infocategory');
                applyInfotainmentFilters();
            });
        });
    }

    if (supplierFilterBtns) {
        supplierFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                supplierFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeSupplier = btn.getAttribute('data-infosupplier');
                applyInfotainmentFilters();
            });
        });
    }

    // ========================================================
    // 11. LÓGICA DO ORGANOGRAMA HIERÁRQUICO E MAPA GLOBAL
    // ========================================================
    const orgViewBtns = document.querySelectorAll('.org-view-btn');
    const orgModeContainers = document.querySelectorAll('.org-mode-container');
    const mapPins = document.querySelectorAll('.map-pin-pulse');
    
    const locEmptyState = document.getElementById('locEmptyState');
    const locContentArea = document.getElementById('locContentArea');
    
    const locTitle = document.getElementById('locTitle');
    const locSubtitle = document.getElementById('locSubtitle');
    const statLocInternal = document.getElementById('statLocInternal');
    const statLocExternal = document.getElementById('statLocExternal');
    const statLocTotal = document.getElementById('statLocTotal');
    const locTeamList = document.getElementById('locTeamList');

    const orgTreeWrapper = document.getElementById('orgTreeWrapper');
    const orgBreadcrumbs = document.getElementById('orgBreadcrumbs');

    // Estrutura de dados completa da hierarquia (Slide 1, 2, 3 e 5)
    const orgHierarchy = {
        id: "heiko",
        name: "Heiko SCHILLING",
        role: "Software Engineering Director (Global)",
        level: "N-2",
        location: "de",
        avatar: "HS",
        reports: [
            {
                id: "doug",
                name: "Doug WELLMAN",
                role: "Autonomous Driving Lead",
                level: "N-3",
                location: "na",
                avatar: "DW",
                reports: []
            },
            {
                id: "tara",
                name: "Tara VATCHER",
                role: "Core Software Platform Dev Lead",
                level: "N-3",
                location: "na",
                avatar: "TV",
                reports: []
            },
            {
                id: "anantha",
                name: "Anantha KRISHNAN",
                role: "Digital Cockpit Lead",
                level: "N-3",
                location: "in",
                avatar: "AK",
                reports: [
                    {
                        id: "fernando",
                        name: "Fernando ATAIDE",
                        role: "Entry Infotainment & SA TC Lead",
                        level: "N-4",
                        location: "sa",
                        avatar: "FA",
                        reports: [
                            {
                                id: "saulo",
                                name: "Saulo CARVALHO",
                                role: "Projection, Legacy IVI & SA Audio",
                                level: "N-5",
                                location: "sa",
                                avatar: "SC",
                                reports: [
                                    {
                                        id: "global_tech_leads",
                                        name: "Global Tech Leaders",
                                        role: "Systems & Projection Technology",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "TL",
                                        reports: [
                                            { id: "pedro_n", name: "Pedro NETO", role: "Projection & LPM", level: "N-6", location: "sa", avatar: "PN", reports: [] },
                                            { id: "pamela_c", name: "Pamela CACERES", role: "PLM Mgmt & AEE2010/Atl-Mid IVIs", level: "N-6", location: "sa", avatar: "PC", reports: [] },
                                            { id: "iuri_m", name: "Iuri MENDES", role: "SEAR2 IVIs & KP1", level: "N-6", location: "sa", avatar: "IM", reports: [] },
                                            { id: "julien_b", name: "Julien BONNET", role: "Crony 2 Part Manager (ext)", level: "N-6", location: "sa", avatar: "JB", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "dre_saulo",
                                        name: "Design Release Engineering",
                                        role: "DRE Projection & Audio",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "DE",
                                        reports: [
                                            { id: "carla_c", name: "Carla CASTRO", role: "R2EX SA DRE", level: "N-6", location: "sa", avatar: "CC", reports: [] },
                                            { id: "caio_c", name: "Caio COELHO", role: "AEE2010 & KP1 SA DRE", level: "N-6", location: "sa", avatar: "CC", reports: [] },
                                            { id: "yassine_z", name: "Yassine ZAAZOUA", role: "R2EX MEA DRE (ext)", level: "N-6", location: "mor", avatar: "YZ", reports: [] },
                                            { id: "artur_j", name: "Artur JORGE", role: "R1H Atl-Mid DRE (ext)", level: "N-6", location: "sa", avatar: "AJ", reports: [] },
                                            { id: "karen_c", name: "Karen CORREA", role: "Audio System DRE (ext)", level: "N-6", location: "sa", avatar: "KC", reports: [] },
                                            { id: "vitor_l", name: "Vitor LEMBI", role: "Projection DRE", level: "N-6", location: "sa", avatar: "VL", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "war_room_leaders",
                                        name: "War Room Leaders",
                                        role: "Crisis & Delivery Execution",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "WR",
                                        reports: [
                                            { id: "matheus_v", name: "Matheus VIEIRA", role: "SA War Room Leader (ext)", level: "N-6", location: "sa", avatar: "MV", reports: [] },
                                            { id: "mostafa_z", name: "Mostafa ZAHARI", role: "Crony 2 War Room Leader (ext)", level: "N-6", location: "mor", avatar: "MZ", reports: [] },
                                            { id: "souhail_f", name: "Souhail FADLI", role: "Crony 2 Marocco War Room (ext)", level: "N-6", location: "mor", avatar: "SF", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "breno",
                                name: "Breno TEIXEIRA",
                                role: "Core Module & SA Vehicle Project Execution Mngt",
                                level: "N-5",
                                location: "sa",
                                avatar: "BT",
                                reports: [
                                    {
                                        id: "tpm_breno",
                                        name: "Technical Program Managers",
                                        role: "TPM Release Management",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "TP",
                                        reports: [
                                            { id: "sara_c", name: "Sara CANÇADO", role: "Crony1 / Crony2 TPM", level: "N-6", location: "sa", avatar: "SC", reports: [] },
                                            { id: "laura_cot", name: "Laura COTTA", role: "Legacy's TPM", level: "N-6", location: "sa", avatar: "LC", reports: [] },
                                            { id: "luiz_a", name: "Luiz ARAUJO", role: "R1LR TPM", level: "N-6", location: "sa", avatar: "LA", reports: [] },
                                            { id: "alexandre_p_ai", name: "Alexandre PRATES (a.i)", role: "R2ex TPM", level: "N-6", location: "sa", avatar: "AP", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "sstl_breno",
                                        name: "Sub System Technical Leads",
                                        role: "SSTL Domain Leads",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "SS",
                                        reports: [
                                            { id: "luiza_c", name: "Luiza CAMPOS", role: "SSTL J3U (Compass)", level: "N-6", location: "sa", avatar: "LC", reports: [] },
                                            { id: "cecilia_e", name: "Cecilia EMANUELY", role: "SSTL 521 / J1U", level: "N-6", location: "sa", avatar: "CE", reports: [] },
                                            { id: "ronan_b", name: "Ronan BALBINO", role: "SSTL 551 / 598 / J4L", level: "N-6", location: "sa", avatar: "RB", reports: [] },
                                            { id: "lucas_m", name: "Lucas MARCATO", role: "SSTL 226 / 291 / F3P", level: "N-6", location: "sa", avatar: "LM", reports: [] },
                                            { id: "pedro_l", name: "Pedro LOURO", role: "SSTL F1H / F2U / F2X", level: "N-6", location: "sa", avatar: "PL", reports: [] },
                                            { id: "elder_l", name: "Elder LUCIO", role: "SSTL CC2X / 516 JJ", level: "N-6", location: "sa", avatar: "EL", reports: [] },
                                            { id: "ana_c", name: "Ana Carolina", role: "SSTL 363 / 376 & Go Forward", level: "N-6", location: "sa", avatar: "AC", reports: [] },
                                            { id: "mauricio_c", name: "Mauricio CARMINATE", role: "SSTL P21 / P24 / XBP", level: "N-6", location: "sa", avatar: "MC", reports: [] },
                                            { id: "igor_i", name: "Igor INACIO", role: "SSTL LPM / KP1 / K0 / X250", level: "N-6", location: "sa", avatar: "II", reports: [] },
                                            { id: "amanda_g", name: "Amanda GIORI", role: "SSTL Legacy's & Imports", level: "N-6", location: "sa", avatar: "AG", reports: [] },
                                            { id: "isaac_b", name: "Isaac BOY", role: "SSTL Advanced", level: "N-6", location: "sa", avatar: "IB", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "heber",
                                name: "Heber SANTOS",
                                role: "R1Low & Entry Info. Requirements Mgmt",
                                level: "N-5",
                                location: "sa",
                                avatar: "HS",
                                reports: [
                                    {
                                        id: "req_team",
                                        name: "Requirements Team",
                                        role: "Global Entry Infotainment SPEC",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "RT",
                                        reports: [
                                            { id: "carlos_a", name: "Carlos AQUINO", role: "Global Tech Lead SPEC", level: "N-6", location: "sa", avatar: "CA", reports: [] },
                                            { id: "antoniel_g", name: "Antoniel GRAVINA", role: "Component Leader (ext)", level: "N-6", location: "sa", avatar: "AG", reports: [] },
                                            { id: "junio_a", name: "Junio AQUINO", role: "Component Designer", level: "N-6", location: "sa", avatar: "JA", reports: [] },
                                            { id: "eduardo_b", name: "Eduardo BIANUCCI", role: "Component Designer (ext)", level: "N-6", location: "sa", avatar: "EB", reports: [] },
                                            { id: "ademir_t", name: "Ademir TOLEDO", role: "Component Designer", level: "N-6", location: "sa", avatar: "AT", reports: [] },
                                            { id: "daniel_s", name: "Daniel SANTANA", role: "Component Designer (ext)", level: "N-6", location: "sa", avatar: "DS", reports: [] },
                                            { id: "nathan_m", name: "Nathan MARQUES", role: "Component Designer (ext)", level: "N-6", location: "sa", avatar: "NM", reports: [] },
                                            { id: "giuseppe_d", name: "Giuseppe D'ALOIA", role: "Component Designer (ext)", level: "N-6", location: "sa", avatar: "GD", reports: [] },
                                            { id: "laura_c", name: "Laura COLARES", role: "Component Designer (ext)", level: "N-6", location: "sa", avatar: "LC", reports: [] },
                                            { id: "kavyasree_n", name: "Kavyasree NAMANI", role: "Component Designer", level: "N-6", location: "in", avatar: "KN", reports: [] },
                                            { id: "lakshaman_b", name: "Lakshaman B.", role: "Component Designer", level: "N-6", location: "in", avatar: "LB", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "mod_exec_team",
                                        name: "Module Execution Team",
                                        role: "Global Entry Infotainment Execution",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "ME",
                                        reports: [
                                            { id: "romulo_b", name: "Romulo BERTU", role: "Global Tech Lead Module Execution", level: "N-6", location: "sa", avatar: "RB", reports: [] },
                                            { id: "hagatha_j", name: "Hagatha JULIATO", role: "Cyber & Apps Lead", level: "N-6", location: "sa", avatar: "HJ", reports: [] },
                                            { id: "daniel_l", name: "Daniel LAGUARDIA", role: "OTA & SW Lead (ext)", level: "N-6", location: "sa", avatar: "DL", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "dre_tpm_team",
                                        name: "DRE/TPM Team",
                                        role: "Release & Project Management",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "DT",
                                        reports: [
                                            { id: "pedro_c", name: "Pedro CAIO", role: "R1L-R/R1L DRE SA (ext)", level: "N-6", location: "sa", avatar: "PC", reports: [] },
                                            { id: "alhanza_a", name: "Alhanza ALLAMILI", role: "R1L-R/R1L DRE NA", level: "N-6", location: "na", avatar: "AA", reports: [] },
                                            { id: "jason_k", name: "Jason KATO", role: "R1L TPM NA", level: "N-6", location: "na", avatar: "JK", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "gabriel",
                                name: "Gabriel ESTEVES",
                                role: "Cluster and Displays & SA SWF",
                                level: "N-5",
                                location: "sa",
                                avatar: "GE",
                                reports: [
                                    {
                                        id: "cluster_sw_mgt",
                                        name: "Cluster SW Management",
                                        role: "Project & Scrum Management",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "SM",
                                        reports: [
                                            { id: "anderson_m", name: "Anderson Morelli", role: "SW Integrator", level: "N-6", location: "sa", avatar: "AM", reports: [] },
                                            { id: "eric_l", name: "Eric Lovera", role: "Product Owner (ext)", level: "N-6", location: "sa", avatar: "EL", reports: [] },
                                            { id: "caio_p", name: "Caio Paulino", role: "Product Owner (ext)", level: "N-6", location: "sa", avatar: "CP", reports: [] },
                                            { id: "tiago_c", name: "Tiago Comin", role: "Scrum Master (ext)", level: "N-6", location: "sa", avatar: "TC", reports: [] },
                                            { id: "eron_m", name: "Eron Muniz", role: "Intern", level: "N-6", location: "sa", avatar: "EM", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "cluster_features_logic",
                                        name: "Cluster Features Logic SW",
                                        role: "SW Architecture & Validation",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "FL",
                                        reports: [
                                            { id: "bruno_s", name: "Bruno Soares", role: "SW Architect Lead", level: "N-6", location: "sa", avatar: "BS", reports: [] },
                                            { id: "guilherme_d", name: "Guilherme Doxa", role: "SW Architect", level: "N-6", location: "sa", avatar: "GD", reports: [] },
                                            { id: "mara_h", name: "Mara Hermenegildo", role: "SW Architect", level: "N-6", location: "sa", avatar: "MH", reports: [] },
                                            { id: "samuel_r", name: "Samuel Rocha", role: "SW Architect", level: "N-6", location: "sa", avatar: "SR", reports: [] },
                                            { id: "bruna_m", name: "Bruna Miskalo", role: "Issue Manager (ext)", level: "N-6", location: "sa", avatar: "BM", reports: [] },
                                            { id: "pedro_s", name: "Pedro dos Santos", role: "Issue Manager (ext)", level: "N-6", location: "sa", avatar: "PS", reports: [] },
                                            { id: "roberto_a", name: "Roberto Alves", role: "SW Unit Validation (ext)", level: "N-6", location: "sa", avatar: "RA", reports: [] },
                                            { id: "cristian_f", name: "Cristian Fernandes", role: "SW Unit Validation (ext)", level: "N-6", location: "sa", avatar: "CF", reports: [] },
                                            { id: "stenio_d", name: "Stenio Duarte", role: "SW Unit Validation (ext)", level: "N-6", location: "sa", avatar: "SD", reports: [] },
                                            { id: "filipe_l", name: "Filipe Lopes", role: "Developer (ext)", level: "N-6", location: "sa", avatar: "FL", reports: [] },
                                            { id: "giovana_v", name: "Giovana Vieira", role: "Developer (ext)", level: "N-6", location: "sa", avatar: "GV", reports: [] },
                                            { id: "igor_q", name: "Igor Quaresma", role: "Developer (ext)", level: "N-6", location: "sa", avatar: "IQ", reports: [] },
                                            { id: "lucas_n", name: "Lucas Nacif", role: "Developer (ext)", level: "N-6", location: "sa", avatar: "LN", reports: [] },
                                            { id: "marcus_sa", name: "Marcus Santos", role: "Developer (ext)", level: "N-6", location: "sa", avatar: "MS", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "cluster_graphics",
                                        name: "Cluster Graphics Features Logic",
                                        role: "Graphic Architecture & Dev",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "GF",
                                        reports: [
                                            { id: "jean_f", name: "Jean Fonseca", role: "Graphic SW Architect", level: "N-6", location: "sa", avatar: "JF", reports: [] },
                                            { id: "juliana_n", name: "Juliana Neves", role: "Graphic SW Architect", level: "N-6", location: "sa", avatar: "JN", reports: [] },
                                            { id: "gabriela_m", name: "Gabriela Matos", role: "Graphic Developer (ext)", level: "N-6", location: "sa", avatar: "GM", reports: [] },
                                            { id: "pedro_co", name: "Pedro Correa", role: "Graphic Developer (ext)", level: "N-6", location: "sa", avatar: "PC", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "cluster_module_dev",
                                        name: "Cluster Module Development",
                                        role: "DRE Module Engineering",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "MD",
                                        reports: [
                                            { id: "luis_p", name: "Luis Paulo", role: "Design Release Engineer", level: "N-6", location: "sa", avatar: "LP", reports: [] },
                                            { id: "gil_m", name: "Gil Moreira", role: "Design Release Engineer (ext)", level: "N-6", location: "sa", avatar: "GM", reports: [] },
                                            { id: "gustavo_e", name: "Gustavo Elias", role: "Design Release Engineer (ext)", level: "N-6", location: "sa", avatar: "GE", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "arthur",
                                name: "Arthur LOTT",
                                role: "Operations, VO & Compliance Lead",
                                level: "N-5",
                                location: "sa",
                                avatar: "AL",
                                reports: [
                                    {
                                        id: "operations_team",
                                        name: "Operations Team",
                                        role: "Business Operations",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "OP",
                                        reports: [
                                            { id: "thomaz_b", name: "Thomaz BRITO", role: "Operations Specialist (ext)", level: "N-6", location: "sa", avatar: "TB", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "vo_team",
                                        name: "VO Team",
                                        role: "Value Optimization & Lessons Learned",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "VO",
                                        reports: [
                                            { id: "gustavo_p", name: "Gustavo PIUZANA", role: "VO Pilot & LL (ext)", level: "N-6", location: "sa", avatar: "GP", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "compliance_team",
                                        name: "Compliance Team",
                                        role: "Part Management & Standards",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "CO",
                                        reports: [
                                            { id: "arthur_l_ai", name: "Arthur LOTT (a.i)", role: "Part Manager", level: "N-6", location: "sa", avatar: "AL", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "alexandre_p",
                                name: "Alexandre PRATES",
                                role: "HW, MEC & Legacy IVI Lead",
                                level: "N-5",
                                location: "sa",
                                avatar: "AP",
                                reports: [
                                    {
                                        id: "hardware_team",
                                        name: "Hardware Team",
                                        role: "DRE Hardware Engineering",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "HW",
                                        reports: [
                                            { id: "danien_l", name: "Danien Lopes", role: "DRE Hardware", level: "N-6", location: "sa", avatar: "DL", reports: [] },
                                            { id: "leandro_a", name: "Leandro Aguiar", role: "DRE Hardware", level: "N-6", location: "sa", avatar: "LA", reports: [] },
                                            { id: "joao_g", name: "João Vitor Guimarães", role: "Intern Hardware", level: "N-6", location: "sa", avatar: "JG", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "mechanical_team",
                                        name: "Mechanical Team",
                                        role: "DRE Mechanical & CAD",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "ME",
                                        reports: [
                                            { id: "rafael_o", name: "Rafael Oliveira", role: "DRE Mechanical (ext)", level: "N-6", location: "sa", avatar: "RO", reports: [] },
                                            { id: "marcus_si", name: "Marcus Silva", role: "CAD Specialist (ext)", level: "N-6", location: "sa", avatar: "MS", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "dre_alexandre",
                                        name: "Design Release Engineering",
                                        role: "DRE IVI & Audio Modules",
                                        level: "N-6 Group",
                                        location: "sa",
                                        avatar: "DR",
                                        reports: [
                                            { id: "maurizio_ba", name: "Maurizio Baggio", role: "DL Tech Reference", level: "N-6", location: "sa", avatar: "MB", reports: [] },
                                            { id: "enrico_g", name: "Enrico Guglielmi", role: "DRE J10 / VP2R / A7+ (ext)", level: "N-6", location: "sa", avatar: "EG", reports: [] },
                                            { id: "giuseppe_p", name: "Giuseppe Panetta", role: "DRE A7+ / A7 (ext)", level: "N-6", location: "sa", avatar: "GP", reports: [] },
                                            { id: "maurizio_bal", name: "Maurizio Ballatore", role: "DRE A7+ / A7 / Giorgio 2.5", level: "N-6", location: "sa", avatar: "MB", reports: [] },
                                            { id: "paolo_l", name: "Paolo Luppo", role: "DRE Smart Audio 1.0 / 2.0", level: "N-6", location: "sa", avatar: "PL", reports: [] },
                                            { id: "venkatesh_u", name: "Venkatesh Umapathy", role: "DRE Crony 1 / Quality IAP", level: "in", avatar: "VU", reports: [] }
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "yu",
                                name: "Yu TIAN",
                                role: "China Partners Development Mgmt Lead",
                                level: "N-5",
                                location: "cn",
                                avatar: "YT",
                                reports: [
                                    {
                                        id: "china_proj_mgt",
                                        name: "Project & Function Management",
                                        role: "Product & Feature Specification",
                                        level: "N-6 Group",
                                        location: "cn",
                                        avatar: "PM",
                                        reports: [
                                            { id: "simin_y", name: "Simin YANG", role: "Project Management", level: "N-6", location: "cn", avatar: "SY", reports: [] },
                                            { id: "qiuhan_y", name: "Qiuhan YI", role: "Function Owner Nav & VR", level: "N-6", location: "cn", avatar: "QY", reports: [] }
                                        ]
                                    },
                                    {
                                        id: "china_proj_exec",
                                        name: "Project Execution",
                                        role: "Delivery & Engineering Release",
                                        level: "N-6 Group",
                                        location: "cn",
                                        avatar: "PE",
                                        reports: [
                                            { id: "shasha_w", name: "Shasha WEN", role: "War Room Leader", level: "N-6", location: "cn", avatar: "SW", reports: [] },
                                            { id: "shengyan_z", name: "Shengyan ZENG", role: "DRE Infotainment", level: "N-6", location: "cn", avatar: "SZ", reports: [] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "pranjal",
                        name: "Pranjal CHAKRABORTY",
                        role: "Architecture Digital Cockpit Lead",
                        level: "N-4",
                        location: "in",
                        avatar: "PC",
                        reports: []
                    },
                    {
                        id: "pranay",
                        name: "Pranay NIGAM",
                        role: "Infotainment Lead",
                        level: "N-4",
                        location: "in",
                        avatar: "PN",
                        reports: []
                    },
                    {
                        id: "kannan",
                        name: "Kannan VARADHAN",
                        role: "Driver Info & Digital Cockpit IAP Lead",
                        level: "N-4",
                        location: "in",
                        avatar: "KV",
                        reports: []
                    },
                    {
                        id: "alexandra",
                        name: "Alexandra RHEUME SERT",
                        role: "Chief Modules Engineer (West Europe)",
                        level: "N-4",
                        location: "fr",
                        avatar: "AS",
                        reports: []
                    },
                    {
                        id: "daniele",
                        name: "Daniele DROCCO",
                        role: "Quality Engineering Digital Cockpit",
                        level: "N-4",
                        location: "it",
                        avatar: "DD",
                        reports: []
                    },
                    {
                        id: "walter",
                        name: "Walter HERMSEN",
                        role: "Software Platform Digital Cockpit Lead",
                        level: "N-4",
                        location: "na",
                        avatar: "WH",
                        reports: []
                    },
                    {
                        id: "akshay",
                        name: "Akshay KHANNA",
                        role: "Software Defined Audio & Acoustics",
                        level: "N-4",
                        location: "in",
                        avatar: "AK",
                        reports: []
                    },
                    {
                        id: "andrea",
                        name: "Andrea FIOCCARDI",
                        role: "Inflight Programs & Affordable Cockpit Lead",
                        level: "N-4",
                        location: "it",
                        avatar: "AF",
                        reports: []
                    },
                    {
                        id: "adinath",
                        name: "Adinath JADHAV",
                        role: "Senior Fellow - Digital Cockpit Software",
                        level: "N-4",
                        location: "in",
                        avatar: "AJ",
                        reports: []
                    },
                    {
                        id: "rajesh",
                        name: "Rajesh BISWAL",
                        role: "Self Service Feature Configuration Lead",
                        level: "N-4",
                        location: "in",
                        avatar: "RB",
                        reports: []
                    },
                    {
                        id: "souvik",
                        name: "Souvik DATTA",
                        role: "Digital Cockpit Cyber Security Lead",
                        level: "N-4",
                        location: "in",
                        avatar: "SD",
                        reports: []
                    },
                    {
                        id: "lora",
                        name: "Lora VEDDER",
                        role: "Premium Infotainment & NA TC Lead",
                        level: "N-4",
                        location: "na",
                        avatar: "LV",
                        reports: []
                    },
                    {
                        id: "laurent",
                        name: "Laurent MAURY",
                        role: "Displays & Cluster, HUD Modules Lead",
                        level: "N-4",
                        location: "fr",
                        avatar: "LM",
                        reports: []
                    },
                    {
                        id: "jesse",
                        name: "Jesse SAIER",
                        role: "Digital Cockpit NA TC Domain Lead",
                        level: "N-4",
                        location: "na",
                        avatar: "JS",
                        reports: []
                    },
                    {
                        id: "jochen",
                        name: "Jochen STOLL",
                        role: "Digital Cockpit EMEA TC Domain Lead",
                        level: "N-4",
                        location: "de",
                        avatar: "JS",
                        reports: []
                    },
                    {
                        id: "alexandre_f",
                        name: "Alexandre FROMION",
                        role: "Senior Fellow - Digital Cockpit",
                        level: "N-4",
                        location: "fr",
                        avatar: "AF",
                        reports: []
                    }
                ]
            },
            {
                id: "ankur",
                name: "Ankur VACHHANI",
                role: "Connected Services & Apps Lead",
                level: "N-3",
                location: "in",
                avatar: "AV",
                reports: []
            },
            {
                id: "teresa",
                name: "Teresa HODDER",
                role: "Software PMO & Quality Lead",
                level: "N-3",
                location: "na",
                avatar: "TH",
                reports: []
            },
            {
                id: "marco",
                name: "Marco SAENGER",
                role: "SWE Integration, Verification & DevOps Lead",
                level: "N-3",
                location: "de",
                avatar: "MS",
                reports: []
            },
            {
                id: "raj",
                name: "Raj TIWARI",
                role: "AI Platform & Developer Productivity Lead",
                level: "N-3",
                location: "in",
                avatar: "RT",
                reports: []
            },
            {
                id: "pierrick",
                name: "Pierrick PUCHOIS",
                role: "System Software Architecture & Design Lead",
                level: "N-3",
                location: "fr",
                avatar: "PP",
                reports: []
            },
            {
                id: "sylvain",
                name: "Sylvain POLES",
                role: "Solutions Systems & Tech Council Lead",
                level: "N-3",
                location: "fr",
                avatar: "SP",
                reports: []
            },
            {
                id: "tilman",
                name: "Tilman LACKO",
                role: "Navigation Lead",
                level: "N-3",
                location: "de",
                avatar: "TL",
                reports: []
            },
            {
                id: "sri",
                name: "Sri MARUNENI",
                role: "SWE North America Technical Centers Lead",
                level: "N-3",
                location: "na",
                avatar: "SM",
                reports: []
            },
            {
                id: "mauricio",
                name: "Mauricio VIANNA",
                role: "SWE South America TC Lead",
                level: "N-3",
                location: "sa",
                avatar: "MV",
                reports: []
            },
            {
                id: "alexander",
                name: "Alexander BLOBNER",
                role: "SWE EMEA Technical Centers Lead",
                level: "N-3",
                location: "de",
                avatar: "AB",
                reports: []
            },
            {
                id: "aravind",
                name: "Aravind DOSS",
                role: "SWE India Asia Pacific Technical Centers Lead",
                level: "N-3",
                location: "in",
                avatar: "AD",
                reports: []
            },
            {
                id: "zhenquan",
                name: "Zhenquan CHEN",
                role: "SWE China Technical Centers Lead",
                level: "N-3",
                location: "cn",
                avatar: "ZC",
                reports: []
            },
            {
                id: "georgia",
                name: "Georgia WESTPHAL",
                role: "SWE Technical Operations Manager",
                level: "N-3",
                location: "de",
                avatar: "GW",
                reports: []
            }
        ]
    };

    let currentFocusedNodeId = "heiko";
    const hiddenNodeIds = new Set();

    // Função recursiva para achar nó na hierarquia
    function findNodeById(node, id) {
        if (node.id === id) return node;
        for (let child of node.reports) {
            let found = findNodeById(child, id);
            if (found) return found;
        }
        return null;
    }

    // Função recursiva para achar nó pai de um nó na hierarquia
    function findParentNode(rootNode, targetId, parentNode = null) {
        if (rootNode.id === targetId) return parentNode;
        for (let child of rootNode.reports) {
            let found = findParentNode(child, targetId, rootNode);
            if (found) return found;
        }
        return null;
    }

    // Função recursiva para gerar os breadcrumbs do nó focado
    function getBreadcrumbPath(rootNode, targetId, path = []) {
        if (rootNode.id === targetId) {
            return [...path, rootNode];
        }
        for (let child of rootNode.reports) {
            let found = getBreadcrumbPath(child, targetId, [...path, rootNode]);
            if (found) return found;
        }
        return null;
    }

    // Renderizar Árvore Organizacional Drill-down
    function renderTree() {
        if (!orgTreeWrapper) return;
        orgTreeWrapper.innerHTML = '';

        const focusedNode = findNodeById(orgHierarchy, currentFocusedNodeId);
        if (!focusedNode) return;

        let parentNode = findParentNode(orgHierarchy, currentFocusedNodeId);
        // Se o pai estiver ocultado, não mostra ele no topo superior
        if (parentNode && hiddenNodeIds.has(parentNode.id)) {
            parentNode = null;
        }

        // 1. Renderizar Nível Pai (se houver)
        if (parentNode) {
            const parentContainer = document.createElement('div');
            parentContainer.className = 'tree-level-container level-parent';
            parentContainer.innerHTML = `
                <span class="level-label">Nível Superior (Clique para Subir)</span>
                <div class="tree-node parent-node clickable" data-nodeid="${parentNode.id}">
                    <div class="node-avatar bg-gray">${parentNode.avatar}</div>
                    <div class="node-info">
                        <h4>${parentNode.name}</h4>
                        <span>${parentNode.role}</span>
                    </div>
                    <button class="btn-node-hide" title="Ocultar Usuário" data-nodeid="${parentNode.id}"><i data-lucide="eye-off"></i></button>
                </div>
            `;
            orgTreeWrapper.appendChild(parentContainer);

            // Conector vertical
            const connector = document.createElement('div');
            connector.className = 'tree-connector';
            orgTreeWrapper.appendChild(connector);
        }

        // 2. Renderizar Nó Focado (Centro)
        const focusedContainer = document.createElement('div');
        focusedContainer.className = 'tree-level-container level-focused';
        focusedContainer.innerHTML = `
            <span class="level-label">Foco Atual</span>
            <div class="tree-node leader-node active" data-nodeid="${focusedNode.id}">
                <div class="node-avatar bg-blue">${focusedNode.avatar}</div>
                <div class="node-info">
                    <h4>${focusedNode.name}</h4>
                    <span>${focusedNode.role}</span>
                </div>
                <button class="btn-node-locate" data-location="${focusedNode.location}"><i data-lucide="map-pin"></i> ${focusedNode.location.toUpperCase()}</button>
                <button class="btn-node-hide" title="Ocultar Usuário" data-nodeid="${focusedNode.id}"><i data-lucide="eye-off"></i></button>
            </div>
        `;
        orgTreeWrapper.appendChild(focusedContainer);

        // 3. Renderizar Subordinados (se houver)
        // Filtramos os subordinados ocultados para que o CSS Flexbox se organize automaticamente!
        const visibleReports = (focusedNode.reports || []).filter(child => !hiddenNodeIds.has(child.id));

        if (visibleReports.length > 0) {
            // Conector vertical
            const connector2 = document.createElement('div');
            connector2.className = 'tree-connector';
            orgTreeWrapper.appendChild(connector2);

            const childContainer = document.createElement('div');
            childContainer.className = 'tree-level-container level-reports';
            childContainer.innerHTML = `<span class="level-label">Subordinados Diretos (Clique no card para aprofundar)</span>`;
            
            const row = document.createElement('div');
            row.className = 'nodes-row';
            if (visibleReports.length > 3) {
                row.classList.add('flex-four');
            }

            visibleReports.forEach(child => {
                const nodeDiv = document.createElement('div');
                const isClickable = child.reports && child.reports.length > 0;
                nodeDiv.className = `tree-node ${isClickable ? 'clickable' : ''}`;
                nodeDiv.setAttribute('data-nodeid', child.id);

                nodeDiv.innerHTML = `
                    <div class="node-avatar bg-gray">${child.avatar}</div>
                    <div class="node-info">
                        <h4>${child.name}</h4>
                        <span>${child.role}</span>
                    </div>
                    ${isClickable ? '<span class="node-expand-tag">Ver Equipe</span>' : ''}
                    <button class="btn-node-locate" data-location="${child.location}"><i data-lucide="map-pin"></i> ${child.location.toUpperCase()}</button>
                    <button class="btn-node-hide" title="Ocultar Usuário" data-nodeid="${child.id}"><i data-lucide="eye-off"></i></button>
                `;
                row.appendChild(nodeDiv);
            });

            childContainer.appendChild(row);
            orgTreeWrapper.appendChild(childContainer);
        }

        // Registrar Eventos de cliques nos nós para drill-down
        const nodes = orgTreeWrapper.querySelectorAll('.tree-node');
        nodes.forEach(n => {
            n.addEventListener('click', (e) => {
                // Se clicou no botão de localização ou de ocultar, não fazer drill-down
                if (e.target.closest('.btn-node-locate') || e.target.closest('.btn-node-hide')) return;

                const nodeId = n.getAttribute('data-nodeid');
                // Apenas fazer drill-down se tiver reports ou for subir nível
                const targetNode = findNodeById(orgHierarchy, nodeId);
                if (targetNode && ((targetNode.reports && targetNode.reports.length > 0) || n.classList.contains('parent-node'))) {
                    currentFocusedNodeId = nodeId;
                    renderTree();
                }
            });
        });

        // Registrar eventos nos botões de localização dentro dos nodes
        const locateBtns = orgTreeWrapper.querySelectorAll('.btn-node-locate');
        locateBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const loc = btn.getAttribute('data-location');
                
                // Mudar para o modo mapa
                const mapSelectorBtn = document.querySelector('.org-view-btn[data-orgview="map"]');
                if (mapSelectorBtn) mapSelectorBtn.click();
                
                // Clicar no pin correspondente no mapa
                const targetPin = document.querySelector(`.map-pin-pulse[data-pinloc="${loc}"]`);
                if (targetPin) {
                    setTimeout(() => {
                        targetPin.click();
                        targetPin.style.transform = 'translate(-50%, -50%) scale(1.6)';
                        setTimeout(() => {
                            targetPin.style.transform = 'translate(-50%, -50%) scale(1)';
                        }, 300);
                    }, 350);
                }
            });
        });

        // Registrar eventos nos botões de ocultação (olho)
        const hideBtns = orgTreeWrapper.querySelectorAll('.btn-node-hide');
        hideBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nodeId = btn.getAttribute('data-nodeid');
                hiddenNodeIds.add(nodeId);

                // Se o nó ocultado for o focado atual, redefine o foco para o pai ou heiko
                if (currentFocusedNodeId === nodeId) {
                    const parent = findParentNode(orgHierarchy, nodeId);
                    currentFocusedNodeId = parent ? parent.id : "heiko";
                }

                renderTree();
            });
        });

        // Atualizar Breadcrumbs
        renderBreadcrumbs();
        lucide.createIcons();
    }

    // Renderizar Breadcrumbs (Caminho)
    function renderBreadcrumbs() {
        if (!orgBreadcrumbs) return;
        orgBreadcrumbs.innerHTML = '';

        const path = getBreadcrumbPath(orgHierarchy, currentFocusedNodeId);
        if (!path) return;

        // Container flexível para os itens
        const listContainer = document.createElement('div');
        listContainer.className = 'org-breadcrumbs-list';

        path.forEach((node, idx) => {
            const isLast = idx === path.length - 1;
            const item = document.createElement('span');
            item.className = `org-breadcrumb-item ${isLast ? 'active' : ''}`;
            item.textContent = node.name.split(' ')[0]; // Apenas o primeiro nome
            item.title = node.name;
            item.setAttribute('data-nodeid', node.id);

            item.addEventListener('click', () => {
                currentFocusedNodeId = node.id;
                renderTree();
            });

            listContainer.appendChild(item);

            if (!isLast) {
                const sep = document.createElement('span');
                sep.className = 'org-breadcrumb-sep';
                sep.textContent = '>';
                listContainer.appendChild(sep);
            }
        });

        orgBreadcrumbs.appendChild(listContainer);

        // Se houver nós ocultados, adiciona o botão de restaurar no lado direito
        if (hiddenNodeIds.size > 0) {
            const restoreBtn = document.createElement('button');
            restoreBtn.className = 'btn-restore-hidden';
            restoreBtn.innerHTML = `<i data-lucide="eye"></i> Restaurar Equipe (${hiddenNodeIds.size})`;
            restoreBtn.addEventListener('click', () => {
                hiddenNodeIds.clear();
                renderTree();
            });
            orgBreadcrumbs.appendChild(restoreBtn);
        }
    }

    // Dados das localidades no mapa
    const locationDetailsData = {
        sa: {
            title: "América do Sul (Brasil)",
            subtitle: "Technical Center Betim / Goiana",
            internal: 37,
            external: 38,
            total: 75,
            team: [
                { name: "Mauricio VIANNA", role: "SWE South America TC Lead", type: "Internal" },
                { name: "Fernando ATAIDE", role: "Entry Infotainment & SA TC Domain Lead", type: "Internal" },
                { name: "Saulo CARVALHO", role: "Projection Certification & Legacy IVI", type: "Internal" },
                { name: "Breno TEIXEIRA", role: "Core Module & SA Project Execution", type: "Internal" },
                { name: "Heber SANTOS", role: "R1Low Requirements Management", type: "Internal" },
                { name: "Gabriel ESTEVES", role: "Cluster and Displays & SA SWF", type: "Internal" },
                { name: "Carlos Aquino", role: "Global Tech Lead SPEC", type: "Internal" },
                { name: "Romulo BERTU", role: "Global Tech Lead Module Execution", type: "Internal" },
                { name: "Hagatha JULIATO", role: "Cyber & Apps Lead", type: "Internal" },
                { name: "Antoniel GRAVINA", role: "Component Leader", type: "External" },
                { name: "Eduardo BIANUCCI", role: "Component Designer", type: "External" },
                { name: "Daniel SANTANA", role: "Component Designer", type: "External" }
            ]
        },
        na: {
            title: "América do Norte (Detroit/EUA)",
            subtitle: "Auburn Hills Technical Center",
            internal: 2,
            external: 0,
            total: 2,
            team: [
                { name: "Sri MARUNENI", role: "SWE North America Technical Center Lead", type: "Internal" },
                { name: "Lora VEDDER", role: "Premium Infotainment Systems Lead", type: "Internal" },
                { name: "Jesse SAIER", role: "Digital Cockpit NA TC Lead", type: "Internal" }
            ]
        },
        fr: {
            title: "França (Paris)",
            subtitle: "Poissy Technical Center",
            internal: 2,
            external: 0,
            total: 2,
            team: [
                { name: "Alexandra RHEUME SERT", role: "Chief Modules Engineer & West Europe Lead", type: "Internal" },
                { name: "Alexandre FROMION", role: "Senior Fellow - Digital Cockpit", type: "Internal" }
            ]
        },
        it: {
            title: "Itália (Turim)",
            subtitle: "Mirafiori Technical Center",
            internal: 4,
            external: 0,
            total: 4,
            team: [
                { name: "Daniele DROCCO", role: "Quality Engineering Digital Cockpit", type: "Internal" },
                { name: "Andrea FIOCCARDI", role: "Inflight Programs & Affordable Cockpit", type: "Internal" }
            ]
        },
        de: {
            title: "Alemanha & Europa Central",
            subtitle: "Rüsselsheim Technical Center",
            internal: 3,
            external: 1,
            total: 4,
            team: [
                { name: "Heiko SCHILLING", role: "Software Engineering Director (Global)", type: "Internal" },
                { name: "Alexander BLOBNER", role: "SWE EMEA Technical Centers Lead", type: "Internal" },
                { name: "Jochen STOLL", role: "Digital Cockpit EMEA TC Domain Lead", type: "Internal" },
                { name: "Sylvain POLES", role: "Solutions Systems & Tech Council Lead", type: "Internal" }
            ]
        },
        mor: {
            title: "Marrocos (Casablanca)",
            subtitle: "Casablanca Engineering Hub",
            internal: 2,
            external: 0,
            total: 2,
            team: [
                { name: "SWE Morocco Team", role: "Software Platform & IVI Execution", type: "Internal" }
            ]
        },
        in: {
            title: "Índia (Pune)",
            subtitle: "Pune Technical Center",
            internal: 3,
            external: 0,
            total: 3,
            team: [
                { name: "Kannan VARADHAN", role: "Driver Info & Digital Cockpit IAP Lead", type: "Internal" },
                { name: "Aravind DOSS", role: "SWE India Asia Pacific TC Lead", type: "Internal" },
                { name: "Adinath JADHAV", role: "Senior Fellow - Digital Cockpit Software", type: "Internal" }
            ]
        },
        cn: {
            title: "China (Xangai)",
            subtitle: "Shanghai Technical Center",
            internal: 2,
            external: 3,
            total: 5,
            team: [
                { name: "Zhenquan CHEN", role: "SWE China Technical Centers Lead", type: "Internal" },
                { name: "Yu TIAN", role: "China Partners Development Mgmt", type: "Internal" },
                { name: "China SW Partners", role: "External Development Support", type: "External" }
            ]
        }
    };

    // Exibir Detalhes de Localidade no Mapa
    function showLocationDetails(locCode) {
        const data = locationDetailsData[locCode];
        if (!data || !locEmptyState || !locContentArea) return;

        locTitle.textContent = data.title;
        locSubtitle.textContent = data.subtitle;
        statLocInternal.textContent = data.internal;
        statLocExternal.textContent = data.external;
        statLocTotal.textContent = data.total;

        // Limpar e popular lista
        locTeamList.innerHTML = '';
        data.team.forEach(member => {
            const li = document.createElement('li');
            li.className = 'loc-team-member';
            li.innerHTML = `
                <div class="member-info">
                    <h6>${member.name}</h6>
                    <span>${member.role}</span>
                </div>
                <span class="member-role-badge">${member.type === 'Internal' ? 'Interno' : 'Externo'}</span>
            `;
            locTeamList.appendChild(li);
        });

        // Toggle áreas
        locEmptyState.style.display = 'none';
        locContentArea.style.display = 'flex';
    }

    // Listener para Pins do Mapa
    if (mapPins) {
        mapPins.forEach(pin => {
            pin.addEventListener('click', () => {
                const locCode = pin.getAttribute('data-pinloc');
                showLocationDetails(locCode);
            });
        });
    }

    // ========================================================
    // 10. LÓGICA DA CENTRAL DE AUTOMAÇÕES & IA
    // ========================================================
    const automationsData = {
        stellantisgpt: {
            title: "StellantisGPT",
            desc: "Assistente virtual técnico avançado que utiliza o modelo de linguagem Gemini da Google. A ferramenta foi projetada para otimizar os fluxos de consulta da engenharia Stellantis, permitindo encontrar respostas rápidas sobre a arquitetura Android Automotive, diretrizes ESG do Dare Forward 2030, regras de qualidade WCM e manuais de componentes. Conta com RAG (Geração Aumentada por Recuperação) para garantir precisão e segurança nas respostas com dados do setor.",
            techs: ["Gemini API", "Python", "LangChain", "Vector DB", "ChromaDB", "HTML5/JS"],
            owner: "Engª Ana Martins",
            ownerDept: "ADAS & AI Division",
            status: "Produção / Protótipo Funcional",
            link: "#" // Redireciona via JS para o Chat IA
        },
        testgenai: {
            title: "TestGen-AI",
            desc: "Sistema automatizado baseado em inteligência artificial generativa que varre as páginas de requisitos técnicos do Confluence. A IA mapeia fluxos de navegação e gera automaticamente roteiros de testes de QA e scripts executáveis em Python/Appium prontos para rodar nas bancadas físicas de infotainment (IVI), reduzindo o tempo de criação de testes de regressão em até 70%.",
            techs: ["OpenAI GPT-4o API", "Python", "Confluence API", "Appium", "Pytest", "Docker"],
            owner: "Breno Teixeira",
            ownerDept: "SA Project Execution",
            status: "Beta / Em Validação",
            link: "https://testgen.betim.stellantis.com"
        },
        cananalyzer: {
            title: "CAN-Analyzer AI",
            desc: "Ferramenta de análise inteligente conectada diretamente aos barramentos de rede CAN e redes Ethernet dos veículos Stellantis. Utiliza algoritmos de Machine Learning supervisionados para classificar e prever falhas de barramento, atrasos de clock no envio de mensagens de display de cluster, mensagens corrompidas e telemetria anormal durante testes de pista de protótipos em Betim.",
            techs: ["Python", "Scikit-Learn", "XGBoost", "Pandas", "Vector CANoe API", "C++"],
            owner: "Dr. Enzo Nogueira",
            ownerDept: "Bio-Hybrid Flex",
            status: "Homologado / Em Operação",
            link: "https://can-analyzer.stellantis.com"
        },
        poweroptai: {
            title: "PowerOpt-AI",
            desc: "Algoritmo de Aprendizado por Reforço (Reinforcement Learning) embarcado nos microcontroladores da eTCU (unidade de transmissão) dos modelos Bio-Hybrid. O modelo de IA analisa dinamicamente o comportamento de aceleração do motorista, prevê necessidades de torque de partida e gerencia com inteligência milimétrica quando o motor elétrico de 48V de 3 kW deve atuar ou regenerar carga para a bateria de lítio.",
            techs: ["TensorFlow Lite", "C++", "Q-Learning", "Embedded C", "Matlab Simulink"],
            owner: "Engª Ana Martins",
            ownerDept: "ADAS & AI Division",
            status: "Em Desenvolvimento",
            link: "" // Sem link
        }
    };

    const modalAutomationDetails = document.getElementById('modalAutomationDetails');
    const automationModalTitle = document.getElementById('automationModalTitle');
    const automationModalDesc = document.getElementById('automationModalDesc');
    const automationModalTechs = document.getElementById('automationModalTechs');
    const automationModalOwner = document.getElementById('automationModalOwner');
    const automationModalStatus = document.getElementById('automationModalStatus');
    const btnLinkAutomation = document.getElementById('btnLinkAutomation');
    const btnContactAutomationOwner = document.getElementById('btnContactAutomationOwner');
    const btnCloseAutomationModal = document.getElementById('btnCloseAutomationModal');
    const btnCancelAutomationModal = document.getElementById('btnCancelAutomationModal');

    let activeAutomationProj = null;

    function openAutomationModal(projId) {
        const data = automationsData[projId];
        if (!data || !modalAutomationDetails) return;

        activeAutomationProj = data;

        automationModalTitle.textContent = data.title;
        automationModalDesc.textContent = data.desc;
        
        // Renderizar tecnologias
        if (automationModalTechs) {
            automationModalTechs.innerHTML = '';
            data.techs.forEach(t => {
                const badge = document.createElement('span');
                badge.className = 'highlight-tag';
                badge.style.cssText = 'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--text-muted); font-size: 11px; padding: 4px 10px; border-radius: 6px; margin-right: 4px; margin-bottom: 4px;';
                badge.textContent = t;
                automationModalTechs.appendChild(badge);
            });
        }

        // Renderizar responsável e status
        if (automationModalOwner) {
            automationModalOwner.innerHTML = `<i data-lucide="user" style="width: 14px; height: 14px; color: var(--secondary); display: inline-block; vertical-align: middle; margin-right: 4px;"></i> ${data.owner}`;
        }
        if (automationModalStatus) {
            let statusColor = '#eab308'; // Amarelo para Desenvolvimento
            if (data.status.includes('Produção') || data.status.includes('Operação')) {
                statusColor = '#10b981'; // Verde
            } else if (data.status.includes('Beta')) {
                statusColor = '#60a5fa'; // Azul
            }
            automationModalStatus.innerHTML = `<span style="background-color: ${statusColor}; box-shadow: 0 0 6px ${statusColor}; width:6px; height:6px; border-radius:50%; display:inline-block; vertical-align: middle; margin-right: 4px;"></span> ${data.status}`;
        }

        // Configurar botão de link
        if (btnLinkAutomation) {
            if (data.link === '') {
                btnLinkAutomation.style.display = 'none';
            } else {
                btnLinkAutomation.style.display = 'flex';
                btnLinkAutomation.href = data.link;
            }
        }

        modalAutomationDetails.classList.add('open');
        lucide.createIcons();
    }

    function closeAutomationModal() {
        if (modalAutomationDetails) {
            modalAutomationDetails.classList.remove('open');
        }
    }

    // Registrar clique nos cards de automação
    document.querySelectorAll('.automation-card').forEach(card => {
        card.addEventListener('click', () => {
            const projId = card.getAttribute('data-projid');
            openAutomationModal(projId);
        });
    });

    if (btnCloseAutomationModal) btnCloseAutomationModal.addEventListener('click', closeAutomationModal);
    if (btnCancelAutomationModal) btnCancelAutomationModal.addEventListener('click', closeAutomationModal);
    if (modalAutomationDetails) {
        modalAutomationDetails.addEventListener('click', (e) => {
            if (e.target === modalAutomationDetails) {
                closeAutomationModal();
            }
        });
    }

    // Botão de link para redirecionamento do StellantisGPT
    if (btnLinkAutomation) {
        btnLinkAutomation.addEventListener('click', (e) => {
            if (activeAutomationProj && activeAutomationProj.link === '#') {
                e.preventDefault();
                closeAutomationModal();
                switchSection('chat-ia');
            }
        });
    }

    // Botão conversar com o responsável
    if (btnContactAutomationOwner) {
        btnContactAutomationOwner.addEventListener('click', () => {
            if (!activeAutomationProj) return;

            closeAutomationModal();
            switchSection('chat-ia');

            if (chatInputGpt) {
                chatInputGpt.value = `Olá! Gostaria de conversar com o ${activeAutomationProj.owner} (${activeAutomationProj.ownerDept}) sobre o projeto de IA "${activeAutomationProj.title}". Você poderia me explicar o status e como posso colaborar?`;
                chatInputGpt.focus();
            }
        });
    }

    // Inicializar a árvore organizacional drill-down
    renderTree();

    // Exportar funções do painel de ideias globalmente para que car-interactivity possa usar
    window.openIdeaModal = function(componentName) {
        const modal = document.getElementById('modalIdea');
        const targetLabel = document.getElementById('modalComponentTarget');
        if (modal && targetLabel) {
            targetLabel.textContent = componentName;
            modal.classList.add('open');
        }
    };
});
