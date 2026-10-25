/**
 * Panel de Control Lateral del Escenario 3D (Inspector Escenográfico)
 * Permite modificar en tiempo real dimensiones exactas, colores, materiales
 * y operaciones de duplicar, eliminar y agrupar.
 */
class StageInspector {
    constructor(panelElement, stageManager) {
        this.panel = panelElement;
        this.stage = stageManager;
        this.selectedObject = null;

        this.init();
    }

    init() {
        this.renderEmptyState();
    }

    /**
     * Muestra mensaje cuando no hay ningún objeto seleccionado
     */
    renderEmptyState() {
        this.panel.innerHTML = `
            <div class="inspector-empty">
                <div class="empty-icon">🎭</div>
                <h3>Ningún cuerpo escenográfico seleccionado</h3>
                <p>Haz clic sobre un elemento del escenario 3D para editar sus dimensiones exactas, materialidad y color, o añade uno nuevo desde la barra superior.</p>
                
                <div class="quick-add-section">
                    <span class="section-label">Añadir elemento rápido:</span>
                    <div class="quick-add-grid">
                        <button class="btn-quick-add" data-type="cube">🔲 Prisma</button>
                        <button class="btn-quick-add" data-type="platform">🪜 Tarima</button>
                        <button class="btn-quick-add" data-type="panel">🖼️ Bastidor</button>
                        <button class="btn-quick-add" data-type="ramp">📐 Rampa</button>
                        <button class="btn-quick-add" data-type="stairs">🪜 Escalera</button>
                        <button class="btn-quick-add" data-type="mannequin">🧍 Figurín 3D</button>
                    </div>
                </div>

                <div class="theatrical-shortcuts-tip">
                    <span class="tip-title">⚡ Atajos de teclado:</span>
                    <ul>
                        <li><kbd>W</kbd> Trasladar</li>
                        <li><kbd>E</kbd> Rotar</li>
                        <li><kbd>R</kbd> Escalar</li>
                        <li><kbd>Ctrl+D</kbd> Duplicar</li>
                        <li><kbd>Supr</kbd> Eliminar</li>
                        <li><kbd>F</kbd> Enfocar</li>
                    </ul>
                </div>
            </div>
        `;

        this.panel.querySelectorAll('.btn-quick-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-type');
                this.stage.addObject(type);
            });
        });
    }

    /**
     * Actualiza el panel con las propiedades del objeto seleccionado
     */
    inspect(object) {
        this.selectedObject = object;
        if (!object) {
            this.renderEmptyState();
            return;
        }

        const uData = object.userData;
        const dims = uData.dimensions || { width: 1, height: 1, depth: 1 };
        const pos = object.position;
        const rotY = Math.round(THREE.MathUtils.radToDeg(object.rotation.y));

        this.panel.innerHTML = `
            <div class="inspector-header">
                <div class="header-title">
                    <span class="object-badge">${this.getIconForType(uData.type)}</span>
                    <input type="text" id="prop-object-name" class="input-text-clean" value="${uData.name || 'Cuerpo Escénico'}">
                </div>
                <div class="header-actions">
                    <button id="btn-snap-floor" class="btn-icon" title="Bajar al tablado (Y = 0)">⬇️</button>
                    <button id="btn-duplicate-obj" class="btn-icon" title="Duplicar elemento (Ctrl+D)">📋</button>
                    <button id="btn-delete-obj" class="btn-icon btn-danger" title="Eliminar elemento (Supr)">🗑️</button>
                </div>
            </div>

            <!-- DIMENSIONES EXACTAS EN METROS -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>📏 Dimensiones Reales (Metros)</span>
                </div>
                
                <div class="dimension-row">
                    <label>Ancho (X):</label>
                    <div class="input-unit-wrapper">
                        <input type="number" id="dim-width" step="0.1" min="0.1" max="20" value="${dims.width.toFixed(2)}">
                        <span class="unit-label">m</span>
                    </div>
                </div>

                <div class="dimension-row">
                    <label>Alto (Y):</label>
                    <div class="input-unit-wrapper">
                        <input type="number" id="dim-height" step="0.1" min="0.1" max="20" value="${dims.height.toFixed(2)}">
                        <span class="unit-label">m</span>
                    </div>
                </div>

                <div class="dimension-row">
                    <label>Profundidad (Z):</label>
                    <div class="input-unit-wrapper">
                        <input type="number" id="dim-depth" step="0.1" min="0.1" max="20" value="${dims.depth.toFixed(2)}">
                        <span class="unit-label">m</span>
                    </div>
                </div>
            </div>

            <!-- POSICIÓN Y ORIENTACIÓN ESCÉNICA -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>📍 Coordenadas en Escena</span>
                </div>
                <div class="coords-grid">
                    <div class="coord-box">
                        <span class="coord-lbl">X (Lateral)</span>
                        <input type="number" id="pos-x" step="0.25" value="${pos.x.toFixed(2)}">
                    </div>
                    <div class="coord-box">
                        <span class="coord-lbl">Y (Altura)</span>
                        <input type="number" id="pos-y" step="0.1" value="${pos.y.toFixed(2)}">
                    </div>
                    <div class="coord-box">
                        <span class="coord-lbl">Z (Fondo)</span>
                        <input type="number" id="pos-z" step="0.25" value="${pos.z.toFixed(2)}">
                    </div>
                    <div class="coord-box">
                        <span class="coord-lbl">Giro (Y°)</span>
                        <input type="number" id="rot-y" step="15" value="${rotY}">
                    </div>
                </div>
            </div>

            <!-- MATERIALIDADES Y TEXTURAS SIMULADAS -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>🪵 Materialidad y Textura Teatral</span>
                </div>
                <div class="materials-grid">
                    ${this.renderMaterialOptions(uData.materialType)}
                </div>

                <div class="slider-prop-row">
                    <label>Rugosidad:</label>
                    <input type="range" id="prop-roughness" min="0" max="1" step="0.05" value="${uData.roughness ?? 0.6}">
                </div>
                <div class="slider-prop-row">
                    <label>Metalicidad:</label>
                    <input type="range" id="prop-metalness" min="0" max="1" step="0.05" value="${uData.metalness ?? 0.1}">
                </div>
                <div class="slider-prop-row">
                    <label>Opacidad:</label>
                    <input type="range" id="prop-opacity" min="0.1" max="1" step="0.05" value="${uData.opacity ?? 1.0}">
                </div>
            </div>

            <!-- COLORIMETRÍA Y GELATINAS TEATRALES -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>🎨 Color / Tinte Escenográfico</span>
                </div>
                <div class="color-picker-row">
                    <input type="color" id="prop-color-picker" value="${uData.baseColor || '#b5835a'}">
                    <input type="text" id="prop-color-hex" class="input-hex" value="${(uData.baseColor || '#b5835a').toUpperCase()}">
                </div>

                <div class="theatrical-swatches">
                    <span class="swatches-label">Gelatinas y tonos teatrales:</span>
                    <div class="swatches-grid">
                        <button class="swatch-btn" style="background: #ffffff" data-color="#ffffff" title="Blanco Neutro"></button>
                        <button class="swatch-btn" style="background: #18181b" data-color="#18181b" title="Negro Mate"></button>
                        <button class="swatch-btn" style="background: #b5835a" data-color="#b5835a" title="Madera Natural"></button>
                        <button class="swatch-btn" style="background: #854d0e" data-color="#854d0e" title="Ámbar Lee 101"></button>
                        <button class="swatch-btn" style="background: #dc2626" data-color="#dc2626" title="Rojo Dramático"></button>
                        <button class="swatch-btn" style="background: #2563eb" data-color="#2563eb" title="Azul Noche"></button>
                        <button class="swatch-btn" style="background: #059669" data-color="#059669" title="Verde Escénico"></button>
                        <button class="swatch-btn" style="background: #7c3aed" data-color="#7c3aed" title="Púrpura Teatral"></button>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    renderMaterialOptions(currentMat) {
        const materials = [
            { id: 'wood', label: 'Madera', icon: '🪵' },
            { id: 'metal', label: 'Metal', icon: '⚙️' },
            { id: 'fabric', label: 'Terciopelo', icon: '🧵' },
            { id: 'brick', label: 'Ladrillo', icon: '🧱' },
            { id: 'concrete', label: 'Hormigón', icon: '🏛️' },
            { id: 'grid', label: 'Estructura', icon: '🕸️' },
            { id: 'emissive', label: 'Neón / Luz', icon: '✨' }
        ];

        return materials.map(m => `
            <button class="btn-material-card ${m.id === currentMat ? 'active' : ''}" data-material="${m.id}">
                <span class="mat-icon">${m.icon}</span>
                <span class="mat-label">${m.label}</span>
            </button>
        `).join('');
    }

    attachEventListeners() {
        if (!this.selectedObject) return;
        const obj = this.selectedObject;

        // Nombre
        const nameInput = this.panel.querySelector('#prop-object-name');
        nameInput.addEventListener('input', (e) => {
            obj.userData.name = e.target.value;
        });

        // Dimensiones
        const wInput = this.panel.querySelector('#dim-width');
        const hInput = this.panel.querySelector('#dim-height');
        const dInput = this.panel.querySelector('#dim-depth');

        const applyDims = () => {
            const w = parseFloat(wInput.value) || 0.5;
            const h = parseFloat(hInput.value) || 0.5;
            const d = parseFloat(dInput.value) || 0.5;
            this.stage.updateObjectDimensions(w, h, d);
        };

        wInput.addEventListener('change', applyDims);
        hInput.addEventListener('change', applyDims);
        dInput.addEventListener('change', applyDims);

        // Coordenadas
        const posX = this.panel.querySelector('#pos-x');
        const posY = this.panel.querySelector('#pos-y');
        const posZ = this.panel.querySelector('#pos-z');
        const rotY = this.panel.querySelector('#rot-y');

        posX.addEventListener('change', (e) => {
            obj.position.x = parseFloat(e.target.value) || 0;
            this.stage.updateSelectionBox();
        });
        posY.addEventListener('change', (e) => {
            obj.position.y = parseFloat(e.target.value) || 0;
            this.stage.updateSelectionBox();
        });
        posZ.addEventListener('change', (e) => {
            obj.position.z = parseFloat(e.target.value) || 0;
            this.stage.updateSelectionBox();
        });
        rotY.addEventListener('change', (e) => {
            obj.rotation.y = THREE.MathUtils.degToRad(parseFloat(e.target.value) || 0);
            this.stage.updateSelectionBox();
        });

        // Materiales
        this.panel.querySelectorAll('.btn-material-card').forEach(btn => {
            btn.addEventListener('click', () => {
                this.panel.querySelectorAll('.btn-material-card').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const matType = btn.getAttribute('data-material');
                const color = obj.userData.baseColor || '#b5835a';
                this.stage.updateObjectMaterial(matType, color, obj.userData.roughness, obj.userData.metalness, obj.userData.opacity);
            });
        });

        // Sliders de rugosidad, metalicidad, opacidad
        const rInput = this.panel.querySelector('#prop-roughness');
        const mInput = this.panel.querySelector('#prop-metalness');
        const oInput = this.panel.querySelector('#prop-opacity');

        const updateMatProps = () => {
            const roughness = parseFloat(rInput.value);
            const metalness = parseFloat(mInput.value);
            const opacity = parseFloat(oInput.value);
            this.stage.updateObjectMaterial(obj.userData.materialType, obj.userData.baseColor, roughness, metalness, opacity);
        };

        rInput.addEventListener('input', updateMatProps);
        mInput.addEventListener('input', updateMatProps);
        oInput.addEventListener('input', updateMatProps);

        // Color Picker & Hex
        const colorPicker = this.panel.querySelector('#prop-color-picker');
        const colorHex = this.panel.querySelector('#prop-color-hex');

        colorPicker.addEventListener('input', (e) => {
            const color = e.target.value;
            colorHex.value = color.toUpperCase();
            this.stage.updateObjectMaterial(obj.userData.materialType, color, obj.userData.roughness, obj.userData.metalness, obj.userData.opacity);
        });

        colorHex.addEventListener('change', (e) => {
            let color = e.target.value;
            if (!color.startsWith('#')) color = '#' + color;
            colorPicker.value = color;
            this.stage.updateObjectMaterial(obj.userData.materialType, color, obj.userData.roughness, obj.userData.metalness, obj.userData.opacity);
        });

        // Swatches teatrales rápidos
        this.panel.querySelectorAll('.swatch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                colorPicker.value = color;
                colorHex.value = color.toUpperCase();
                this.stage.updateObjectMaterial(obj.userData.materialType, color, obj.userData.roughness, obj.userData.metalness, obj.userData.opacity);
            });
        });

        // Acciones rápidas del encabezado
        this.panel.querySelector('#btn-snap-floor').addEventListener('click', () => {
            this.stage.snapToFloor();
            posY.value = "0.00";
        });

        this.panel.querySelector('#btn-duplicate-obj').addEventListener('click', () => {
            this.stage.duplicateSelected();
        });

        this.panel.querySelector('#btn-delete-obj').addEventListener('click', () => {
            this.stage.deleteSelected();
        });
    }

    getIconForType(type) {
        switch (type) {
            case 'cube': return '🔲';
            case 'cylinder': return '🔘';
            case 'panel': return '🖼️';
            case 'ramp': return '📐';
            case 'platform': return '🪜';
            case 'stairs': return '🪜';
            case 'mannequin': return '🧍';
            default: return '🎭';
        }
    }
}

window.StageInspector = StageInspector;
