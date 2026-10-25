/**
 * Generador de Reporte y Dossier Técnico de Producción Escénica (Production Rider)
 * Genera especificaciones técnicas de medidas, materiales, colores y capturas
 * listas para presentar a equipos de carpintería, utilería y sastrería teatral.
 */
class DossierExporter {
    constructor(containerElement, stageManager, figurineStudio) {
        this.container = containerElement;
        this.stage = stageManager;
        this.studio = figurineStudio;
    }

    render() {
        const meta = window.appState.project;
        const stageImg = this.stage.captureHighResScreenshot();
        const costumeImg = this.studio.captureFigurinePlate();

        const stageObjects = this.stage.objects;
        const costumeLayers = this.studio.layers.filter(l => l.visible);

        this.container.innerHTML = `
            <div class="dossier-document" id="printable-dossier">
                <!-- ENCABEZADO DE PRODUCCIÓN TEATRAL -->
                <header class="dossier-header">
                    <div class="header-main-info">
                        <div class="dossier-logo-badge">🎭 WEBESCENO · DOSSIER TÉCNICO</div>
                        <h1 class="dossier-title">${meta.title}</h1>
                        <div class="dossier-meta-row">
                            <span><strong>Responsable:</strong> ${meta.author}</span>
                            <span><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            <span><strong>Espacio:</strong> Caja Negra (12.00m x 10.00m x 6.00m)</span>
                        </div>
                    </div>
                    <div class="header-export-actions no-print">
                        <button id="btn-print-pdf" class="btn-export-dossier primary">
                            <span>🖨️ Imprimir / Exportar PDF</span>
                        </button>
                        <button id="btn-download-stage-png" class="btn-export-dossier">
                            <span>📸 Guardar Imagen 3D</span>
                        </button>
                        <button id="btn-download-costume-png" class="btn-export-dossier">
                            <span>👗 Guardar Lámina Vestuario</span>
                        </button>
                        <button id="btn-save-project-json" class="btn-export-dossier success">
                            <span>💾 Guardar Archivo JSON</span>
                        </button>
                    </div>
                </header>

                <!-- LÁMINAS VISUALES DE PRESENTACIÓN -->
                <section class="dossier-section">
                    <h2 class="section-heading">1. Registro Visual de la Propuesta</h2>
                    <div class="dossier-plates-grid">
                        <div class="dossier-plate">
                            <div class="plate-title">Planimetría y Espacio Escenográfico 3D</div>
                            <img src="${stageImg}" alt="Perspectiva del Escenario">
                            <span class="plate-caption">Vista general de implantación con iluminación: ${this.stage.lighting.currentPreset}</span>
                        </div>
                        <div class="dossier-plate">
                            <div class="plate-title">Figurín de Vestuario y Patronaje 2D</div>
                            <img src="${costumeImg}" alt="Figurín de Vestuario">
                            <span class="plate-caption">Lámina de personaje sobre silueta: ${this.studio.currentFigurineId}</span>
                        </div>
                    </div>
                </section>

                <!-- TABLA TÉCNICA DE ELEMENTOS ESCENOGRÁFICOS -->
                <section class="dossier-section">
                    <h2 class="section-heading">2. Especificaciones de Cuerpos Escenográficos y Carpintería</h2>
                    <p class="section-intro">Desglose de practicables, tarimas, bastidores y rampas para el equipo de realización escenotécnica:</p>
                    
                    <table class="dossier-table">
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Elemento</th>
                                <th>Ancho (X)</th>
                                <th>Alto (Y)</th>
                                <th>Profund. (Z)</th>
                                <th>Volumen</th>
                                <th>Materialidad Asignada</th>
                                <th>Color / Tinte</th>
                                <th>Ubicación (X, Y, Z)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${stageObjects.length === 0 ? `
                                <tr><td colspan="9" class="td-empty">No se han incorporado elementos escenográficos al tablado.</td></tr>
                            ` : stageObjects.map((obj, i) => {
                                const u = obj.userData;
                                const dims = u.dimensions || { width: 1, height: 1, depth: 1 };
                                const vol = (dims.width * dims.height * dims.depth).toFixed(2);
                                const pos = obj.position;
                                return `
                                    <tr>
                                        <td><strong>ESC-${(i + 1).toString().padStart(2, '0')}</strong></td>
                                        <td><strong>${u.name || 'Cuerpo Escénico'}</strong></td>
                                        <td>${dims.width.toFixed(2)} m</td>
                                        <td>${dims.height.toFixed(2)} m</td>
                                        <td>${dims.depth.toFixed(2)} m</td>
                                        <td>${vol} m³</td>
                                        <td><span class="mat-badge">${this.getMaterialLabel(u.materialType)}</span></td>
                                        <td>
                                            <div class="table-color-cell">
                                                <span class="color-sample" style="background: ${u.baseColor || '#b5835a'}"></span>
                                                <span>${(u.baseColor || '#b5835a').toUpperCase()}</span>
                                            </div>
                                        </td>
                                        <td>(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}) m</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </section>

                <!-- TABLA TÉCNICA DE VESTUARIO Y TELAS -->
                <section class="dossier-section">
                    <h2 class="section-heading">3. Ficha Técnica de Vestuario y Muestrario Textil</h2>
                    <p class="section-intro">Desglose de piezas de vestuario, tipos de tela y tinturas para el taller de sastrería:</p>

                    <table class="dossier-table">
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Pieza de Ropa</th>
                                <th>Categoría</th>
                                <th>Textura Textil</th>
                                <th>Colorimetría HEX</th>
                                <th>Opacidad</th>
                                <th>Observaciones Escénicas</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${costumeLayers.length === 0 ? `
                                <tr><td colspan="7" class="td-empty">No hay prendas configuradas en el taller de vestuario.</td></tr>
                            ` : costumeLayers.map((l, i) => `
                                <tr>
                                    <td><strong>VES-${(i + 1).toString().padStart(2, '0')}</strong></td>
                                    <td><strong>${l.name}</strong></td>
                                    <td><span class="cat-badge">${l.category}</span></td>
                                    <td><span class="fabric-badge">${this.getFabricLabel(l.fabricType)}</span></td>
                                    <td>
                                        <div class="table-color-cell">
                                            <span class="color-sample" style="background: ${l.color}"></span>
                                            <span>${l.color.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td>${Math.round(l.opacity * 100)}%</td>
                                    <td>${this.getFabricAdvice(l.fabricType)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </section>

                <!-- ESPECIFICACIÓN DE ILUMINACIÓN TEATRAL -->
                <section class="dossier-section">
                    <h2 class="section-heading">4. Planteamiento Lumínico y Atmósfera Teatral</h2>
                    <div class="lighting-summary-card">
                        <div class="lighting-preset-info">
                            <h3>Parrilla de Iluminación: <span class="preset-name">${this.getLightingLabel(this.stage.lighting.currentPreset)}</span></h3>
                            <p>Configuración diseñada para resaltar los volúmenes de los practicables y potenciar la cromática de los textiles seleccionados.</p>
                        </div>
                        <div class="lighting-cues-list">
                            <div class="cue-item"><strong>Foco de Proscenio (Key Light):</strong> Luz frontal a 45° cálida para modelado de actores.</div>
                            <div class="cue-item"><strong>Calles Laterales (Fill Light):</strong> Relleno lateral frío para despegar planos y texturas.</div>
                            <div class="cue-item"><strong>Contraluz Escénico (Back Light):</strong> Recorte de siluetas contra el ciclorama de fondo.</div>
                            <div class="cue-item"><strong>Foco Cenital Dramático:</strong> Cono vertical sobre el centro de escena para clímax dramáticos.</div>
                        </div>
                    </div>
                </section>

                <!-- FIRMAS DE APROBACIÓN DE PRODUCCIÓN -->
                <footer class="dossier-footer">
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <span>Dirección Escénica</span>
                    </div>
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <span>Diseño de Escenografía</span>
                    </div>
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <span>Diseño de Vestuario</span>
                    </div>
                    <div class="signature-box">
                        <div class="sig-line"></div>
                        <span>Dirección Técnica / Producción</span>
                    </div>
                </footer>
            </div>
        `;

        this.attachEventListeners();
    }

    getMaterialLabel(type) {
        switch (type) {
            case 'wood': return 'Madera Escénica (Pino / Fenólico)';
            case 'metal': return 'Metal Industrial (Tubo estructural)';
            case 'fabric': return 'Tela / Terciopelo Teatral';
            case 'brick': return 'Mampostería / Ladrillo rústico';
            case 'concrete': return 'Hormigón / Cemento alisado';
            case 'grid': return 'Malla Estructural / Rejilla';
            case 'emissive': return 'Caja de Luz / Pantalla Neón';
            default: return type || 'Estándar';
        }
    }

    getFabricLabel(type) {
        switch (type) {
            case 'cotton': return 'Algodón / Lino rústico';
            case 'silk': return 'Seda / Raso / Satén';
            case 'leather': return 'Cuero / Cuerina';
            case 'denim': return 'Jean / Denim sarga';
            case 'chiffon': return 'Gasa / Voile semitransparente';
            case 'velvet': return 'Terciopelo / Pana';
            case 'brocade': return 'Brocado / Jacquard damasco';
            case 'sequin': return 'Lentejuela / Metalizado';
            default: return type;
        }
    }

    getFabricAdvice(type) {
        switch (type) {
            case 'cotton': return 'Lavado previo para encogimiento, caída natural opaca.';
            case 'silk': return 'Manipulación delicada, brillo reactivo a la luz lateral.';
            case 'leather': return 'Refuerzo de costuras, acabado satinado.';
            case 'denim': return 'Costura reforzada con hilo ocre, lavado a la piedra.';
            case 'chiffon': return 'Borde rematado con rulote, vuelo liviano etéreo.';
            case 'velvet': return 'Corte con la felpa en sentido ascendente para mayor profundidad.';
            case 'brocade': return 'Planchado con paño protector, forro interno requerido.';
            case 'sequin': return 'Cosido con aguja especial, efecto reflectivo de escenario.';
            default: return 'Confección estándar de sastrería teatral.';
        }
    }

    getLightingLabel(preset) {
        switch (preset) {
            case 'classic': return 'Caja Negra Teatral Equilibrada';
            case 'warm': return 'Ensayo Cálido / Tungsteno';
            case 'expressionist': return 'Claroscuro Expresionista Frío';
            case 'spotlight': return 'Foco Cenital Solista Dramático';
            case 'sunset': return 'Atardecer / Gualda Teatral';
            default: return preset;
        }
    }

    attachEventListeners() {
        // Imprimir PDF
        const btnPrint = this.container.querySelector('#btn-print-pdf');
        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                window.print();
            });
        }

        // Descargar Captura 3D
        const btnStagePng = this.container.querySelector('#btn-download-stage-png');
        if (btnStagePng) {
            btnStagePng.addEventListener('click', () => {
                const url = this.stage.captureHighResScreenshot();
                const a = document.createElement('a');
                a.href = url;
                a.download = `WEBESCENO_Escenario_3D_${Date.now()}.png`;
                a.click();
            });
        }

        // Descargar Lámina Vestuario
        const btnCostumePng = this.container.querySelector('#btn-download-costume-png');
        if (btnCostumePng) {
            btnCostumePng.addEventListener('click', () => {
                const url = this.studio.captureFigurinePlate();
                const a = document.createElement('a');
                a.href = url;
                a.download = `WEBESCENO_Figurin_Vestuario_${Date.now()}.png`;
                a.click();
            });
        }

        // Guardar archivo JSON
        const btnSaveJson = this.container.querySelector('#btn-save-project-json');
        if (btnSaveJson) {
            btnSaveJson.addEventListener('click', () => {
                this.exportProjectJson();
            });
        }
    }

    /**
     * Exporta el estado completo del proyecto en un archivo JSON descargable
     */
    exportProjectJson() {
        const projectData = {
            version: '1.0.0',
            exportedAt: new Date().toISOString(),
            meta: window.appState.project,
            stage: {
                lightingPreset: this.stage.lighting.currentPreset,
                objects: this.stage.objects.map(obj => ({
                    type: obj.userData.type,
                    name: obj.userData.name,
                    dimensions: obj.userData.dimensions,
                    materialType: obj.userData.materialType,
                    baseColor: obj.userData.baseColor,
                    roughness: obj.userData.roughness,
                    metalness: obj.userData.metalness,
                    opacity: obj.userData.opacity,
                    position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                    rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
                    scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }
                }))
            },
            costume: {
                figurineId: this.studio.currentFigurineId,
                skinColor: this.studio.skinColor,
                layers: this.studio.layers
            }
        };

        const jsonStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${window.appState.project.title.replace(/[^a-zA-Z0-9]/g, '_')}_WEBESCENO.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

window.DossierExporter = DossierExporter;
