/**
 * Panel de Control del Taller de Vestuario (Costume Inspector)
 * Permite seleccionar figurines base, agregar prendas, ordenar capas textiles,
 * elegir telas procedimentales y tinturas escénicas.
 */
class CostumeInspector {
    constructor(panelElement, figurineStudio, stageManager) {
        this.panel = panelElement;
        this.studio = figurineStudio;
        this.stage = stageManager;

        this.init();
    }

    init() {
        this.render();
    }

    render() {
        const layers = this.studio.layers;
        const activeIdx = this.studio.selectedLayerIndex;
        const activeLayer = (activeIdx >= 0 && activeIdx < layers.length) ? layers[activeIdx] : null;

        this.panel.innerHTML = `
            <!-- SELECCIÓN DE SILUETA DE FIGURÍN -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>🧍 Silueta Base de Figurín</span>
                </div>
                <div class="figurine-select-grid">
                    <button class="btn-fig-type ${this.studio.currentFigurineId === 'female' ? 'active' : ''}" data-fig="female">
                        <span class="fig-icon">💃</span>
                        <span>Femenino</span>
                    </button>
                    <button class="btn-fig-type ${this.studio.currentFigurineId === 'male' ? 'active' : ''}" data-fig="male">
                        <span class="fig-icon">🕺</span>
                        <span>Masculino</span>
                    </button>
                    <button class="btn-fig-type ${this.studio.currentFigurineId === 'neutral' ? 'active' : ''}" data-fig="neutral">
                        <span class="fig-icon">🧍</span>
                        <span>Andrógino</span>
                    </button>
                </div>
            </div>

            <!-- AGREGAR PRENDA DEL CATÁLOGO -->
            <div class="inspector-group">
                <div class="group-title">
                    <span>➕ Añadir Prenda de Vestuario</span>
                </div>
                <div class="add-garment-control">
                    <select id="select-new-garment" class="select-clean">
                        <option value="" disabled selected>Selecciona una prenda para añadir...</option>
                        <optgroup label="🎩 Sombreros y Tocados">
                            <option value="hat_tophat">Sombrero de Copa Teatral</option>
                            <option value="hat_crown">Corona / Tiara Real</option>
                        </optgroup>
                        <optgroup label="🧥 Abrigos, Chaquetas y Capas">
                            <option value="outer_cape">Capa Larga con Vuelo</option>
                            <option value="outer_jacket">Chaqueta Militar / Frac</option>
                        </optgroup>
                        <optgroup label="👔 Prendas Superiores">
                            <option value="top_blouse">Camisa con Volados y Chorrera</option>
                            <option value="top_corset">Corsé Renacentista</option>
                        </optgroup>
                        <optgroup label="👖 Prendas Inferiores">
                            <option value="bottom_trousers">Pantalones Sastre Rectos</option>
                            <option value="bottom_skirt">Falda Acampanada Teatral</option>
                        </optgroup>
                        <optgroup label="👗 Vestidos Completos">
                            <option value="dress_ballgown">Vestido Largo de Gala / Época</option>
                        </optgroup>
                        <optgroup label="👢 Calzado">
                            <option value="shoes_boots">Botas Altas de Montar</option>
                        </optgroup>
                        <optgroup label="🧣 Accesorios Teatrales">
                            <option value="acc_ruff">Gorguera Renacentista (Golilla)</option>
                            <option value="acc_sash">Fajín con Caída y Flecos</option>
                        </optgroup>
                    </select>
                    <button id="btn-add-garment" class="btn-primary-action">Añadir Capa</button>
                </div>
            </div>

            <!-- SISTEMA DE CAPAS ORDENABLES (Z-INDEX) -->
            <div class="inspector-group">
                <div class="group-title-row">
                    <span>📑 Sistema de Capas (${layers.length})</span>
                    <span class="layer-hint">Superposición de telas</span>
                </div>
                <div class="layers-stack-container" id="layers-stack">
                    ${this.renderLayersStack(layers, activeIdx)}
                </div>
            </div>

            <!-- EDITOR DE LA CAPA ACTIVA -->
            ${activeLayer ? this.renderActiveLayerEditor(activeLayer) : `
                <div class="layer-none-selected">
                    <p>Haz clic en una capa arriba para configurar su tipo de tela, color y opacidad.</p>
                </div>
            `}

            <!-- ACCIÓN DE SINCRONIZACIÓN CON EL ESCENARIO 3D -->
            <div class="inspector-group">
                <button id="btn-sync-to-stage" class="btn-sync-stage">
                    <span>🎭 Proyectar Vestuario en Escenario 3D</span>
                </button>
                <p class="sync-desc">Transfiere la paleta de colores y el estilo del figurín a los actores/maniquíes del escenario virtual.</p>
            </div>
        `;

        this.attachEventListeners();
    }

    renderLayersStack(layers, activeIdx) {
        if (layers.length === 0) {
            return `<div class="empty-layers">No hay prendas agregadas. Selecciona una arriba.</div>`;
        }

        // Mostramos las capas en orden inverso (las superiores arriba en la lista)
        return layers.map((layer, idx) => {
            const isActive = idx === activeIdx;
            return `
                <div class="layer-item ${isActive ? 'active' : ''}" data-index="${idx}">
                    <div class="layer-drag-handle">⋮⋮</div>
                    <button class="layer-vis-btn ${layer.visible ? '' : 'hidden-layer'}" title="Visibilidad de capa" data-index="${idx}">
                        ${layer.visible ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <div class="layer-info" data-index="${idx}">
                        <span class="layer-swatch" style="background: ${layer.color}"></span>
                        <span class="layer-name">${layer.name}</span>
                        <span class="layer-fabric-badge">${this.getFabricLabel(layer.fabricType)}</span>
                    </div>
                    <div class="layer-actions">
                        <button class="btn-layer-nav" data-action="up" data-index="${idx}" title="Subir nivel" ${idx === layers.length - 1 ? 'disabled' : ''}>▲</button>
                        <button class="btn-layer-nav" data-action="down" data-index="${idx}" title="Bajar nivel" ${idx === 0 ? 'disabled' : ''}>▼</button>
                        <button class="btn-layer-nav btn-danger" data-action="delete" data-index="${idx}" title="Eliminar capa">✕</button>
                    </div>
                </div>
            `;
        }).reverse().join('');
    }

    renderActiveLayerEditor(layer) {
        const fabrics = [
            { id: 'cotton', label: 'Algodón / Lino', icon: '🌾' },
            { id: 'silk', label: 'Seda / Satén', icon: '✨' },
            { id: 'leather', label: 'Cuero / Vinilo', icon: '🐂' },
            { id: 'denim', label: 'Jean / Denim', icon: '👖' },
            { id: 'chiffon', label: 'Gasa / Voile', icon: '🌫️' },
            { id: 'velvet', label: 'Terciopelo Teatral', icon: '🍷' },
            { id: 'brocade', label: 'Brocado / Damasco', icon: '⚜️' },
            { id: 'sequin', label: 'Lentejuela / Metal', icon: '🪩' }
        ];

        return `
            <div class="inspector-group active-layer-box">
                <div class="group-title">
                    <span>🧵 Configuración de Tela: ${layer.name}</span>
                </div>

                <!-- SELECTOR DE TIPO DE TELA VISUAL -->
                <div class="fabrics-grid">
                    ${fabrics.map(f => `
                        <button class="btn-fabric-card ${f.id === layer.fabricType ? 'active' : ''}" data-fabric="${f.id}">
                            <span class="fabric-icon">${f.icon}</span>
                            <span class="fabric-label">${f.label}</span>
                        </button>
                    `).join('')}
                </div>

                <!-- COLORIMETRÍA DE LA PRENDA -->
                <div class="color-picker-row">
                    <label>Tinte de Tela:</label>
                    <input type="color" id="layer-color-picker" value="${layer.color}">
                    <input type="text" id="layer-color-hex" class="input-hex" value="${layer.color.toUpperCase()}">
                </div>

                <!-- SWATCHES TEATRALES RÁPIDOS -->
                <div class="theatrical-swatches">
                    <span class="swatches-label">Paleta de vestuario escénico:</span>
                    <div class="swatches-grid">
                        <button class="swatch-btn" style="background: #f8fafc" data-color="#f8fafc" title="Lino Natural"></button>
                        <button class="swatch-btn" style="background: #1e293b" data-color="#1e293b" title="Negro Época"></button>
                        <button class="swatch-btn" style="background: #7f1d1d" data-color="#7f1d1d" title="Carmesí"></button>
                        <button class="swatch-btn" style="background: #4c0519" data-color="#4c0519" title="Borgoña"></button>
                        <button class="swatch-btn" style="background: #1e3a8a" data-color="#1e3a8a" title="Azul Real"></button>
                        <button class="swatch-btn" style="background: #047857" data-color="#047857" title="Verde Esmeralda"></button>
                        <button class="swatch-btn" style="background: #e5a93c" data-color="#e5a93c" title="Gualda / Dorado"></button>
                        <button class="swatch-btn" style="background: #6d28d9" data-color="#6d28d9" title="Púrpura Cardenal"></button>
                    </div>
                </div>

                <!-- SLIDERS DE OPACIDAD Y ESCALA DE TRAMA -->
                <div class="slider-prop-row">
                    <label>Opacidad de prenda:</label>
                    <input type="range" id="layer-opacity" min="0.1" max="1.0" step="0.05" value="${layer.opacity}">
                    <span class="slider-val">${Math.round(layer.opacity * 100)}%</span>
                </div>

                <div class="slider-prop-row">
                    <label>Escala de tejido:</label>
                    <input type="range" id="layer-scale" min="0.5" max="2.0" step="0.1" value="${layer.scale || 1.0}">
                    <span class="slider-val">${(layer.scale || 1.0).toFixed(1)}x</span>
                </div>
            </div>
        `;
    }

    getFabricLabel(type) {
        switch (type) {
            case 'cotton': return 'Algodón';
            case 'silk': return 'Seda';
            case 'leather': return 'Cuero';
            case 'denim': return 'Jean';
            case 'chiffon': return 'Gasa';
            case 'velvet': return 'Terciopelo';
            case 'brocade': return 'Brocado';
            case 'sequin': return 'Lentejuela';
            default: return type;
        }
    }

    attachEventListeners() {
        // Silueta base
        this.panel.querySelectorAll('.btn-fig-type').forEach(btn => {
            btn.addEventListener('click', () => {
                const fig = btn.getAttribute('data-fig');
                this.studio.setFigurine(fig);
                this.render();
            });
        });

        // Añadir prenda
        const selectGarment = this.panel.querySelector('#select-new-garment');
        const btnAdd = this.panel.querySelector('#btn-add-garment');
        if (btnAdd) {
            btnAdd.addEventListener('click', () => {
                const val = selectGarment.value;
                if (val) {
                    this.studio.addLayer(val);
                    this.render();
                }
            });
        }

        // Selección de capa
        this.panel.querySelectorAll('.layer-info').forEach(info => {
            info.addEventListener('click', () => {
                const idx = parseInt(info.getAttribute('data-index'), 10);
                this.studio.selectLayer(idx);
                this.render();
            });
        });

        // Visibilidad de capa
        this.panel.querySelectorAll('.layer-vis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.getAttribute('data-index'), 10);
                this.studio.toggleVisibility(idx);
                this.render();
            });
        });

        // Reordenamiento y eliminación de capas
        this.panel.querySelectorAll('.btn-layer-nav').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.getAttribute('data-action');
                const idx = parseInt(btn.getAttribute('data-index'), 10);

                if (action === 'up') {
                    this.studio.moveLayer(idx, idx + 1);
                } else if (action === 'down') {
                    this.studio.moveLayer(idx, idx - 1);
                } else if (action === 'delete') {
                    this.studio.removeLayer(idx);
                }
                this.render();
            });
        });

        // Editor de capa activa
        const layer = (this.studio.selectedLayerIndex >= 0) ? this.studio.layers[this.studio.selectedLayerIndex] : null;
        if (layer) {
            // Telas
            this.panel.querySelectorAll('.btn-fabric-card').forEach(card => {
                card.addEventListener('click', () => {
                    const fabric = card.getAttribute('data-fabric');
                    this.studio.updateActiveLayer({ fabricType: fabric });
                    this.render();
                });
            });

            // Color picker & hex
            const colPick = this.panel.querySelector('#layer-color-picker');
            const colHex = this.panel.querySelector('#layer-color-hex');
            if (colPick && colHex) {
                colPick.addEventListener('input', (e) => {
                    const c = e.target.value;
                    colHex.value = c.toUpperCase();
                    this.studio.updateActiveLayer({ color: c });
                });
                colHex.addEventListener('change', (e) => {
                    let c = e.target.value;
                    if (!c.startsWith('#')) c = '#' + c;
                    colPick.value = c;
                    this.studio.updateActiveLayer({ color: c });
                });
            }

            // Swatches
            this.panel.querySelectorAll('.swatch-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const c = btn.getAttribute('data-color');
                    if (colPick) colPick.value = c;
                    if (colHex) colHex.value = c.toUpperCase();
                    this.studio.updateActiveLayer({ color: c });
                });
            });

            // Sliders
            const opacSlider = this.panel.querySelector('#layer-opacity');
            if (opacSlider) {
                opacSlider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    this.studio.updateActiveLayer({ opacity: val });
                });
            }

            const scaleSlider = this.panel.querySelector('#layer-scale');
            if (scaleSlider) {
                scaleSlider.addEventListener('input', (e) => {
                    const val = parseFloat(e.target.value);
                    this.studio.updateActiveLayer({ scale: val });
                });
            }
        }

        // Sincronizar vestuario hacia el escenario 3D
        const btnSync = this.panel.querySelector('#btn-sync-to-stage');
        if (btnSync) {
            btnSync.addEventListener('click', () => {
                const summary = this.studio.getCostumeSummary();
                this.syncCostumeTo3DStage(summary);
            });
        }
    }

    /**
     * Sincroniza el diseño de vestuario con los maniquíes del escenario 3D
     */
    syncCostumeTo3DStage(summary) {
        if (!this.stage) return;

        // Buscar si ya existe un maniquí en el escenario o crear uno nuevo
        let mannequin = this.stage.objects.find(obj => obj.userData.type === 'mannequin');
        if (!mannequin) {
            mannequin = this.stage.addObject('mannequin', {
                clothesColor: summary.primaryColor,
                name: 'Figurín Actriz Principal'
            });
        } else {
            // Actualizar color de la ropa del maniquí existente
            mannequin.traverse(child => {
                if (child.isMesh && child.material && child.geometry.type !== 'SphereGeometry') {
                    child.material.color.set(summary.primaryColor);
                }
            });
            mannequin.userData.baseColor = summary.primaryColor;
        }

        // Feedback al usuario
        alert(`¡Vestuario proyectado con éxito en el Escenario 3D!\n\nColor dominante: ${summary.primaryColor}\nCapas aplicadas: ${summary.layersCount}`);
    }
}

window.CostumeInspector = CostumeInspector;
