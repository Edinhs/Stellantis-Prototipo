/* ==========================================
   STELLANTIS DICTIONARY - INTERATIVIDADE DO CARRO & 3D (THREE.JS)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================================
    // 1. HOTSPOTS DA PÁGINA INICIAL (SIMULADOR DO PRINT JEEP)
    // ========================================================
    const hotspots = document.querySelectorAll('.hotspot');
    const hotspotInfoCard = document.getElementById('hotspotInfoCard');
    const hotspotTitle = document.getElementById('hotspotTitle');
    const hotspotDesc = document.getElementById('hotspotDesc');
    const btnCloseCard = document.getElementById('btnCloseCard');
    const btnHotspotDict = document.getElementById('btn-hotspot-dict');
    const btnHotspotIdea = document.getElementById('btn-hotspot-idea');
    
    let activeHotspotId = null;
    let activeHotspotTitle = "";

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const id = hotspot.getAttribute('data-id');
            const title = hotspot.getAttribute('data-title');
            const desc = hotspot.getAttribute('data-desc');
            
            activeHotspotId = id;
            activeHotspotTitle = title;
            
            // Atualizar conteúdo do Card
            hotspotTitle.textContent = title;
            hotspotDesc.textContent = desc;
            
            // Posicionar o card próximo ao hotspot clicado
            const rect = hotspot.getBoundingClientRect();
            const parentRect = hotspot.parentElement.getBoundingClientRect();
            
            // Posicionamento relativo elegante
            const topPercent = parseFloat(hotspot.style.top);
            const leftPercent = parseFloat(hotspot.style.left);
            
            // Ajustar o card para aparecer logo abaixo ou ao lado
            hotspotInfoCard.style.top = `${topPercent + 6}%`;
            hotspotInfoCard.style.left = `${Math.min(leftPercent - 20, 60)}%`;
            
            // Exibir o card
            hotspotInfoCard.classList.add('active');
        });
    });

    // Fechar Card
    if (btnCloseCard) {
        btnCloseCard.addEventListener('click', () => {
            hotspotInfoCard.classList.remove('active');
        });
    }

    // Fechar card ao clicar fora
    document.addEventListener('click', (e) => {
        if (hotspotInfoCard && !hotspotInfoCard.contains(e.target) && !e.target.classList.contains('hotspot')) {
            hotspotInfoCard.classList.remove('active');
        }
    });

    // Botão "Ver no Dicionário" do Card
    if (btnHotspotDict) {
        btnHotspotDict.addEventListener('click', () => {
            hotspotInfoCard.classList.remove('active');
            
            // Ir para a aba Dicionário
            const navLinkDicionario = document.querySelector('.nav-link[data-target="dicionario"]');
            if (navLinkDicionario) {
                navLinkDicionario.click();
            }
            
            // Filtrar termo no dicionário
            const searchInput = document.getElementById('searchTerms');
            if (searchInput) {
                // Remove termos como "Jeep" ou "ADAS" adicionais para busca limpa
                const cleanSearch = activeHotspotId === 'grid' ? 'Grade' : 
                                    activeHotspotId === 'dashboard' ? 'ADAS' : 'Suspensão';
                searchInput.value = cleanSearch;
                // Disparar evento para atualizar a lista
                searchInput.dispatchEvent(new Event('input'));
            }
        });
    }

    // Botão "Inserir Ideia Aqui" do Card (Abre o Modal Localizado)
    const modalIdea = document.getElementById('modalIdea');
    if (btnHotspotIdea) {
        btnHotspotIdea.addEventListener('click', () => {
            hotspotInfoCard.classList.remove('active');
            if (window.openIdeaModal) {
                window.openIdeaModal(activeHotspotTitle);
            }
        });
    }

    // Botão para alternar para a visualização 3D Real
    const btnToggle3dMode = document.getElementById('btn-toggle-3d-mode');
    if (btnToggle3dMode) {
        btnToggle3dMode.addEventListener('click', () => {
            const navLinkExplorador = document.querySelector('.nav-link[data-target="explorador"]');
            if (navLinkExplorador) {
                navLinkExplorador.click();
            }
        });
    }


    // ========================================================
    // 2. MODAL DE INSERÇÃO DE NOTAS DE IDEIAS
    // ========================================================
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnCancelModal = document.getElementById('btnCancelModal');
    const btnSaveModalIdea = document.getElementById('btnSaveModalIdea');
    const modalComponentTarget = document.getElementById('modalComponentTarget');

    function closeModal() {
        if (modalIdea) {
            modalIdea.classList.remove('open');
        }
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);
    
    // Salvar Ideia do Modal Localizado
    if (btnSaveModalIdea) {
        btnSaveModalIdea.addEventListener('click', () => {
            const titleInput = document.getElementById('modalIdeaTitle');
            const descInput = document.getElementById('modalIdeaDesc');
            
            const component = modalComponentTarget.textContent;
            const title = titleInput.value.trim();
            const desc = descInput.value.trim();
            
            if (title === '' || desc === '') {
                alert('Por favor, preencha todos os campos!');
                return;
            }

            // Acessa a lógica global para salvar a ideia
            const fullTitle = `Nota sobre ${component}: ${title}`;
            
            // Simular envio de evento ou salvar direto
            const ideas = JSON.parse(localStorage.getItem('stellantis_ideas')) || [];
            const date = new Date().toLocaleString('pt-BR');
            ideas.push({ 
                type: 'hotspot', 
                title: fullTitle, 
                desc: desc, 
                date: date 
            });
            localStorage.setItem('stellantis_ideas', JSON.stringify(ideas));
            
            // Recarregar os contadores/listas no app.js caso existam
            const ideaCountBadges = document.querySelectorAll('#ideaCount');
            ideaCountBadges.forEach(b => b.textContent = ideas.length);
            
            const savedIdeasList = document.getElementById('savedIdeasList');
            if (savedIdeasList) {
                // Aciona renderização atualizada no app.js de forma simplificada
                const customEvent = new CustomEvent('ideaAdded');
                document.dispatchEvent(customEvent);
                // Também atualiza o painel local diretamente caso o evento não propague
                location.reload(); // Recarrega para persistir visualmente tudo perfeitamente
            }

            closeModal();
            titleInput.value = '';
            descInput.value = '';
        });
    }


    // ========================================================
    // 3. RENDERIZADOR 3D PROCEDURAL REAL (THREE.JS)
    // ========================================================
    const canvas3dContainer = document.getElementById('canvas3dContainer');
    let scene, camera, renderer, carGroup, controls;
    let isWireframeMode = true;

    // Componentes e suas definições para exibição
    const componentData = {
        chassi: {
            title: "Chassi Inteligente & Estrutura Híbrida",
            desc: "Monobloco de aço de ultra-alta resistência integrado com travessas deformáveis. Projetado para acoplar tanto tanques de combustível tradicionais quanto o motor elétrico auxiliar do sistema Bio-Hybrid."
        },
        rodas: {
            title: "Rodas Aerodinâmicas & e-Motors",
            desc: "Rodas leves de liga de 19 polegadas com calotas aerodinâmicas para diminuição do arrasto. Nos eixos, sensores de regeneração convertem frenagem em eletricidade para o bloco de baterias de 48V."
        },
        sensores: {
            title: "Módulo de Sensores ADAS (LiDAR/Radar)",
            desc: "Conjunto ótico inteligente no topo do para-brisa e grade. Realiza varreduras constantes da via a até 150 metros, fornecendo inputs em milissegundos para o piloto automático adaptativo."
        },
        bateria: {
            title: "Bloco de Baterias de Lítio (48V)",
            desc: "Conjunto compacto de baterias de íons de lítio localizado sob o piso da cabine para manter o centro de gravidade baixo. Alimenta a rede auxiliar e o e-Motor no sistema híbrido flex."
        }
    };

    function init3D() {
        if (!canvas3dContainer) return;

        // Criar Cena
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x02050c, 0.015);

        // Criar Câmera
        camera = new THREE.PerspectiveCamera(60, canvas3dContainer.clientWidth / canvas3dContainer.clientHeight, 0.1, 100);
        camera.position.set(5, 3, 5);

        // Criar Renderizador
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(canvas3dContainer.clientWidth, canvas3dContainer.clientHeight);
        renderer.setClearColor(0x02050c, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        canvas3dContainer.appendChild(renderer.domElement);

        // Orbit Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.05; // Evita ir abaixo do solo
        controls.minDistance = 3;
        controls.maxDistance = 12;

        // Luzes
        const ambientLight = new THREE.AmbientLight(0x0a1e3f, 1.5);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0x3b82f6, 2.5); // Azul
        dirLight1.position.set(5, 5, 2);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 2); // Ciano
        dirLight2.position.set(-5, 3, -2);
        scene.add(dirLight2);

        // Criar Grupo do Carro
        carGroup = new THREE.Group();
        scene.add(carGroup);

        // CONSTRUÇÃO PROCEDURAL DO CARRO CONCEITUAL 3D
        buildProceduralCar();

        // Sistema de Partículas Flutuantes (Fundo)
        buildParticles();

        // Animação Loop
        animate();
    }

    function buildProceduralCar() {
        // Material do Chassi
        const chassiMat = new THREE.MeshStandardMaterial({
            color: 0x1e3a8a,
            wireframe: isWireframeMode,
            transparent: true,
            opacity: 0.8,
            roughness: 0.2,
            metalness: 0.9
        });

        // Material Detalhes Ciano
        const detailMat = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            wireframe: isWireframeMode,
            emissive: 0x0891b2,
            emissiveIntensity: 0.5
        });

        // 1. Corpo Central (Cabine/Chassi)
        const bodyGeom = new THREE.BoxGeometry(3, 0.8, 1.4);
        const bodyMesh = new THREE.Mesh(bodyGeom, chassiMat);
        bodyMesh.position.y = 0.5;
        carGroup.add(bodyMesh);

        // 2. Cabine Superior (Janelas)
        const cabGeom = new THREE.BoxGeometry(1.6, 0.6, 1.2);
        const cabMesh = new THREE.Mesh(cabGeom, new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            wireframe: isWireframeMode,
            transparent: true,
            opacity: 0.4
        }));
        cabMesh.position.set(-0.2, 1.1, 0);
        carGroup.add(cabMesh);

        // 3. Rodas (4 Cilindros)
        const wheelGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            wireframe: isWireframeMode,
            roughness: 0.5
        });

        const wheelPositions = [
            { x: 1, y: 0.4, z: 0.75 },   // Dianteira Esquerda
            { x: 1, y: 0.4, z: -0.75 },  // Dianteira Direita
            { x: -1, y: 0.4, z: 0.75 },  // Traseira Esquerda
            { x: -1, y: 0.4, z: -0.75 }  // Traseira Direita
        ];

        wheelPositions.forEach((pos, idx) => {
            const wheel = new THREE.Mesh(wheelGeom, wheelMat);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.x = Math.PI / 2;
            
            // Adicionar aro brilhante ciano na roda
            const rimGeom = new THREE.RingGeometry(0.2, 0.35, 16);
            const rimMesh = new THREE.Mesh(rimGeom, detailMat);
            rimMesh.position.y = 0.16; // desloca um pouco para fora
            rimMesh.rotation.x = -Math.PI / 2;
            wheel.add(rimMesh);

            carGroup.add(wheel);
        });

        // 4. Grade Frontal Brilhante
        const gridGeom = new THREE.BoxGeometry(0.1, 0.4, 1.2);
        const gridMesh = new THREE.Mesh(gridGeom, detailMat);
        gridMesh.position.set(1.5, 0.5, 0);
        carGroup.add(gridMesh);

        // 5. Bateria Elétrica Central (Sob o veículo)
        const batGeom = new THREE.BoxGeometry(1.8, 0.2, 1.1);
        const batMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            emissive: 0x059669,
            emissiveIntensity: 0.6,
            wireframe: isWireframeMode
        });
        const batMesh = new THREE.Mesh(batGeom, batMat);
        batMesh.position.y = 0.15;
        carGroup.add(batMesh);

        // 6. Sensor LiDAR (Teto)
        const sensorGeom = new THREE.SphereGeometry(0.1, 8, 8);
        const sensorMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
        const sensorMesh = new THREE.Mesh(sensorGeom, sensorMat);
        sensorMesh.position.set(0.2, 1.45, 0);
        carGroup.add(sensorMesh);
    }

    function buildParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 15;     // X
            positions[i + 1] = Math.random() * 5;         // Y
            positions[i + 2] = (Math.random() - 0.5) * 15; // Z
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x3b82f6,
            size: 0.05,
            transparent: true,
            opacity: 0.6
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
    }

    function animate() {
        requestAnimationFrame(animate);

        // Rotação automática suave
        if (carGroup && !controls.state === -1) {
            carGroup.rotation.y += 0.003;
        }

        controls.update();
        renderer.render(scene, camera);
    }

    // Redimensionamento do canvas 3D
    window.addEventListener('resize', () => {
        if (!camera || !renderer || !canvas3dContainer) return;
        
        camera.aspect = canvas3dContainer.clientWidth / canvas3dContainer.clientHeight;
        camera.updateProjectionMatrix();
        
        renderer.setSize(canvas3dContainer.clientWidth, canvas3dContainer.clientHeight);
    });

    // 4. INTERATIVIDADE DA UI DO CANVAS 3D
    const btn3dWireframe = document.getElementById('btn-3d-wireframe');
    const btn3dReset = document.getElementById('btn-3d-reset');
    const compButtons = document.querySelectorAll('.comp-3d-btn');
    const inspectedInfo = document.getElementById('inspectedInfo');

    if (btn3dWireframe) {
        btn3dWireframe.addEventListener('click', () => {
            isWireframeMode = !isWireframeMode;
            
            // Limpar grupo do carro
            while(carGroup.children.length > 0){ 
                carGroup.remove(carGroup.children[0]); 
            }
            
            // Reconstruir com o novo modo
            buildProceduralCar();
            
            // Trocar estilo do botão
            btn3dWireframe.innerHTML = isWireframeMode 
                ? '<i data-lucide="layout-grid"></i> Estilo Digital' 
                : '<i data-lucide="box"></i> Estilo Sólido';
            lucide.createIcons();
        });
    }

    if (btn3dReset) {
        btn3dReset.addEventListener('click', () => {
            if (controls) {
                controls.reset();
                camera.position.set(5, 3, 5);
            }
        });
    }

    compButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            compButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const componentKey = btn.getAttribute('data-comp');
            const data = componentData[componentKey];
            
            if (inspectedInfo && data) {
                inspectedInfo.innerHTML = `
                    <h4>${data.title}</h4>
                    <p>${data.desc}</p>
                    <button class="btn-card-action" style="margin-top: 12px; width: 100%;" onclick="openIdeaModal('${data.title}')">
                        💡 Anotar Ideia sobre esta parte
                    </button>
                `;
            }

            // Piscar luz direcional em resposta ao clique
            if (carGroup) {
                carGroup.rotation.y = 0; // reset
                // Focar ângulo da câmera
                if (componentKey === 'bateria') {
                    camera.position.set(0, 1.5, 4);
                } else if (componentKey === 'sensores') {
                    camera.position.set(0, 3, 3);
                } else {
                    camera.position.set(3, 2, 3);
                }
            }
        });
    });

    // Iniciar Three.js ao entrar na aba Explorador
    const linkExplorador = document.querySelector('.nav-link[data-target="explorador"]');
    if (linkExplorador) {
        linkExplorador.addEventListener('click', () => {
            // Pequeno delay para garantir que o contêiner já esteja visível
            setTimeout(() => {
                if (!renderer) {
                    init3D();
                }
            }, 100);
        });
    }
});
