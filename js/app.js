/**
 * Punto de Entrada Principal de WEBESCENO
 * Orquesta la interfaz de usuario, navegación por pestañas y comunicación entre módulos.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el Escenario 3D
    const stageContainer = document.getElementById('stage-canvas-container');
    const stageInspectorEl = document.getElementById('stage-inspector-panel');

    const stageManager = new StageManager(
        stageContainer,
        (selectedObj) => {
            if (stageInspector) stageInspector.inspect(selectedObj);
        },
        (updatedObj) => {
            if (stageInspector) stageInspector.inspect(updatedObj);
        }
    );

    const stageInspector = new StageInspector(stageInspectorEl, stageManager);

    // 2. Inicializar el Taller de Vestuario 2D
    const costumeCanvas = document.getElementById('costume-canvas');
    const costumeInspectorEl = document.getElementById('costume-inspector-panel');

    const figurineStudio = new FigurineStudio(
        costumeCanvas,
        (layers, activeIndex) => {
            // Callback opcional al cambiar capas
        }
    );

    const costumeInspector = new CostumeInspector(costumeInspectorEl, figurineStudio, stageManager);

    // 3. Inicializar Módulos de Síntesis y Dossier
    const synthesisContainer = document.getElementById('synthesis-container');
    const synthesisView = new SynthesisView(synthesisContainer, stageManager, figurineStudio);

    const dossierContainer = document.getElementById('dossier-container');
    const dossierExporter = new DossierExporter(dossierContainer, stageManager, figurineStudio);

    // 4. Configurar barra de herramientas superior del Escenario 3D
    setupStageToolbar(stageManager);

    // 5. Configurar navegación por pestañas principales
    setupTabNavigation(synthesisView, dossierExporter, stageManager);

    // 6. Configurar carga de composición inicial teatral (Demo)
    loadInitialStageDemo(stageManager);

    // 7. Enlazar título del proyecto editable
    const projectTitleInput = document.getElementById('project-title-input');
    if (projectTitleInput) {
        projectTitleInput.value = window.appState.project.title;
        projectTitleInput.addEventListener('input', (e) => {
            window.appState.setProjectTitle(e.target.value);
        });
    }

    // 8. Botón de importación rápida de JSON
    const fileImportInput = document.getElementById('input-file-import');
    if (fileImportInput) {
        fileImportInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        loadProjectFromJson(data, stageManager, figurineStudio, costumeInspector);
                    } catch (err) {
                        alert('Error al leer el archivo JSON: ' + err.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    window.addEventListener('resize', () => {
        stageManager.onWindowResize();
    });
});

/**
 * Configura los botones de la barra de herramientas del escenario 3D
 */
function setupStageToolbar(stage) {
    // Añadir primitivas
    document.querySelectorAll('.btn-add-primitive').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-primitive');
            stage.addObject(type);
        });
    });

    // Modos de Gizmo
    const btnTranslate = document.getElementById('tool-translate');
    const btnRotate = document.getElementById('tool-rotate');
    const btnScale = document.getElementById('tool-scale');

    const setModeActive = (activeBtn, mode) => {
        [btnTranslate, btnRotate, btnScale].forEach(b => b && b.classList.remove('active'));
        if (activeBtn) activeBtn.classList.add('active');
        stage.setTransformMode(mode);
    };

    if (btnTranslate) btnTranslate.addEventListener('click', () => setModeActive(btnTranslate, 'translate'));
    if (btnRotate) btnRotate.addEventListener('click', () => setModeActive(btnRotate, 'rotate'));
    if (btnScale) btnScale.addEventListener('click', () => setModeActive(btnScale, 'scale'));

    // Snap to grid
    const snapToggle = document.getElementById('tool-snap-toggle');
    const snapSelect = document.getElementById('tool-snap-step');
    if (snapToggle && snapSelect) {
        const updateSnap = () => {
            const enabled = snapToggle.checked;
            const step = parseFloat(snapSelect.value);
            stage.setSnap(enabled, step);
        };
        snapToggle.addEventListener('change', updateSnap);
        snapSelect.addEventListener('change', updateSnap);
    }

    // Vistas de Cámara
    document.querySelectorAll('.btn-cam-view').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.btn-cam-view').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const view = btn.getAttribute('data-cam');
            stage.setCameraPreset(view);
        });
    });

    // Presets de Iluminación Teatral
    const lightingSelect = document.getElementById('select-lighting-preset');
    if (lightingSelect) {
        lightingSelect.addEventListener('change', (e) => {
            stage.lighting.applyPreset(e.target.value);
        });
    }
}

/**
 * Navegación fluida entre pestañas principales
 */
function setupTabNavigation(synthesisView, dossierExporter, stageManager) {
    const tabBtns = document.querySelectorAll('.nav-tab-btn');
    const viewContainers = {
        'stage3d': document.getElementById('view-stage-3d'),
        'costume2d': document.getElementById('view-costume-2d'),
        'synthesis': document.getElementById('view-synthesis'),
        'dossier': document.getElementById('view-dossier')
    };

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetView = btn.getAttribute('data-view');
            switchView(targetView);
        });
    });

    window.appState.subscribe('viewChanged', (viewName) => {
        switchView(viewName);
    });

    function switchView(viewName) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-view') === viewName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        Object.keys(viewContainers).forEach(key => {
            const container = viewContainers[key];
            if (container) {
                if (key === viewName) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            }
        });

        // Trigger hooks al entrar en cada vista
        if (viewName === 'stage3d') {
            setTimeout(() => stageManager.onWindowResize(), 50);
        } else if (viewName === 'synthesis') {
            synthesisView.render();
        } else if (viewName === 'dossier') {
            dossierExporter.render();
        }
    }
}

/**
 * Carga un montaje teatral inicial para visualización inmediata
 */
function loadInitialStageDemo(stage) {
    // Tarima central elevada practicable
    const platform = stage.addObject('platform', {
        name: 'Tarima Central Practicable',
        width: 4.0,
        height: 0.6,
        depth: 3.0,
        materialType: 'wood',
        baseColor: '#6e4423'
    });
    if (platform) platform.position.set(0, 0, -1.0);

    // Escalera de acceso frontal a la tarima
    const stairs = stage.addObject('stairs', {
        name: 'Escalinata de Proscenio',
        width: 2.0,
        height: 0.6,
        depth: 1.2,
        steps: 3,
        materialType: 'wood',
        baseColor: '#5a3418'
    });
    if (stairs) stairs.position.set(0, 0, 1.1);

    // Bastidor escénico izquierdo (fondo)
    const flatL = stage.addObject('panel', {
        name: 'Bastidor Lateral Izquierdo',
        width: 2.8,
        height: 4.2,
        depth: 0.08,
        materialType: 'brick',
        baseColor: '#7a3b30'
    });
    if (flatL) {
        flatL.position.set(-3.8, 0, -3.2);
        flatL.rotation.y = THREE.MathUtils.degToRad(25);
    }

    // Bastidor escénico derecho (fondo) con cortinado de terciopelo
    const flatR = stage.addObject('panel', {
        name: 'Telón / Bastidor Derecho',
        width: 3.2,
        height: 4.2,
        depth: 0.08,
        materialType: 'fabric',
        baseColor: '#4c0519'
    });
    if (flatR) {
        flatR.position.set(3.6, 0, -3.0);
        flatR.rotation.y = THREE.MathUtils.degToRad(-20);
    }

    // Figurín / Actor de escala humana (1.75m) sobre la tarima
    const actor = stage.addObject('mannequin', {
        name: 'Actor Protagonista (1.75m)',
        baseColor: '#e2b38f',
        clothesColor: '#1e3a8a'
    });
    if (actor) {
        actor.position.set(0, 0.6, -1.0);
    }

    // Deseleccionar inicialmente para mostrar la vista limpia
    stage.deselect();
}

/**
 * Carga completa desde archivo JSON exportado
 */
function loadProjectFromJson(data, stage, studio, costumeInspector) {
    if (!data) return;

    if (data.meta) {
        window.appState.project = Object.assign(window.appState.project, data.meta);
        const titleEl = document.getElementById('project-title-input');
        if (titleEl) titleEl.value = window.appState.project.title;
    }

    if (data.stage && data.stage.objects) {
        // Limpiar objetos actuales
        while (stage.objects.length > 0) {
            stage.selectObject(stage.objects[0]);
            stage.deleteSelected();
        }

        // Cargar nuevos objetos
        data.stage.objects.forEach(objData => {
            const dims = objData.dimensions || { width: 1, height: 1, depth: 1 };
            const newObj = stage.addObject(objData.type, {
                name: objData.name,
                width: dims.width,
                height: dims.height,
                depth: dims.depth,
                materialType: objData.materialType,
                baseColor: objData.baseColor,
                roughness: objData.roughness,
                metalness: objData.metalness,
                opacity: objData.opacity
            });

            if (newObj && objData.position) {
                newObj.position.set(objData.position.x, objData.position.y, objData.position.z);
                if (objData.rotation) newObj.rotation.set(objData.rotation.x, objData.rotation.y, objData.rotation.z);
                if (objData.scale) newObj.scale.set(objData.scale.x, objData.scale.y, objData.scale.z);
            }
        });

        if (data.stage.lightingPreset) {
            stage.lighting.applyPreset(data.stage.lightingPreset);
            const lightSel = document.getElementById('select-lighting-preset');
            if (lightSel) lightSel.value = data.stage.lightingPreset;
        }
    }

    if (data.costume) {
        if (data.costume.figurineId) studio.setFigurine(data.costume.figurineId);
        if (data.costume.layers) {
            studio.layers = data.costume.layers;
            studio.selectedLayerIndex = studio.layers.length - 1;
            studio.render();
            if (costumeInspector) costumeInspector.render();
        }
    }

    stage.deselect();
    alert('¡Proyecto cargado exitosamente!');
}
