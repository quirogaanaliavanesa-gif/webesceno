/**
 * Vista de Síntesis y Armonía Visual (Stage & Costume Visual Synthesis)
 * Evalúa visualmente la convivencia estética, contraste cromático y legibilidad
 * entre la arquitectura escenográfica 3D y el diseño de vestuario 2D.
 */
class SynthesisView {
    constructor(containerElement, stageManager, figurineStudio) {
        this.container = containerElement;
        this.stage = stageManager;
        this.studio = figurineStudio;
    }

    render() {
        // Capturar instantáneas de ambos módulos
        const stageImg = this.stage.captureHighResScreenshot();
        const costumeImg = this.studio.captureFigurinePlate();

        // Extraer paletas cromáticas de ambos
        const stageColors = this.extractStageColors();
        const costumeColors = this.extractCostumeColors();
        const contrastEvaluation = this.evaluateVisualContrast(stageColors, costumeColors);

        this.container.innerHTML = `
            <div class="synthesis-workspace">
                <div class="synthesis-header">
                    <h2>🎭 Síntesis y Armonía Escénica</h2>
                    <p class="subtitle">Evaluación visual en conjunto del espacio escenográfico 3D y el vestuario de los personajes.</p>
                </div>

                <!-- COMPARATIVA VISUAL LADO A LADO -->
                <div class="synthesis-dual-preview">
                    <div class="preview-card">
                        <div class="preview-badge">📐 Espacio Escenográfico 3D</div>
                        <div class="img-frame">
                            <img src="${stageImg}" alt="Escenario Virtual 3D" id="syn-stage-img">
                        </div>
                        <div class="preview-footer">
                            <span>${this.stage.objects.length} cuerpos escenográficos en escena</span>
                            <span class="lighting-tag">💡 Luz: ${this.stage.lighting.currentPreset}</span>
                        </div>
                    </div>

                    <div class="preview-card">
                        <div class="preview-badge">👗 Figurín de Vestuario 2D</div>
                        <div class="img-frame">
                            <img src="${costumeImg}" alt="Figurín de Vestuario 2D" id="syn-costume-img">
                        </div>
                        <div class="preview-footer">
                            <span>${this.studio.layers.filter(l => l.visible).length} capas textiles superpuestas</span>
                            <span class="fig-tag">🧍 Silueta: ${this.studio.currentFigurineId}</span>
                        </div>
                    </div>
                </div>

                <!-- EVALUADOR DE ARMONÍA CROMÁTICA Y CONTRASTE -->
                <div class="synthesis-analysis-grid">
                    <!-- Paleta de la Escenografía -->
                    <div class="analysis-box">
                        <h3>🎨 Paleta Escenográfica</h3>
                        <p class="analysis-hint">Colores dominantes de practicables, tarimas y bastidores:</p>
                        <div class="palette-swatches-row">
                            ${stageColors.map(c => `
                                <div class="palette-swatch-chip">
                                    <span class="chip-color" style="background: ${c.color}"></span>
                                    <span class="chip-name">${c.name}</span>
                                    <span class="chip-hex">${c.color.toUpperCase()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Paleta del Vestuario -->
                    <div class="analysis-box">
                        <h3>🧵 Paleta de Vestuario</h3>
                        <p class="analysis-hint">Telas y tinturas aplicadas sobre las prendas:</p>
                        <div class="palette-swatches-row">
                            ${costumeColors.map(c => `
                                <div class="palette-swatch-chip">
                                    <span class="chip-color" style="background: ${c.color}"></span>
                                    <span class="chip-name">${c.name}</span>
                                    <span class="chip-hex">${c.color.toUpperCase()}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Dictamen de Legibilidad Escénica y Contraste -->
                    <div class="analysis-box highlight-box">
                        <h3>⚖️ Diagnóstico de Legibilidad Escenotécnica</h3>
                        <div class="contrast-score-row">
                            <div class="contrast-gauge ${contrastEvaluation.level}">
                                <span class="gauge-value">${contrastEvaluation.ratio}:1</span>
                                <span class="gauge-label">Ratio de Contraste</span>
                            </div>
                            <div class="contrast-verdict">
                                <h4>${contrastEvaluation.title}</h4>
                                <p>${contrastEvaluation.description}</p>
                            </div>
                        </div>

                        <div class="scenic-advice-box">
                            <strong>💡 Sugerencia de Dirección de Arte:</strong>
                            <p>${contrastEvaluation.advice}</p>
                        </div>
                    </div>
                </div>

                <!-- BOTÓN PARA PASAR AL DOSSIER -->
                <div class="synthesis-bottom-actions">
                    <button id="btn-goto-dossier" class="btn-primary-action large">
                        <span>📋 Generar Dossier Técnico Completo de Producción ➔</span>
                    </button>
                </div>
            </div>
        `;

        const btnDossier = this.container.querySelector('#btn-goto-dossier');
        if (btnDossier) {
            btnDossier.addEventListener('click', () => {
                window.appState.setView('dossier');
            });
        }
    }

    extractStageColors() {
        const colors = [];
        this.stage.objects.forEach(obj => {
            const u = obj.userData;
            if (u.baseColor && !colors.some(c => c.color.toLowerCase() === u.baseColor.toLowerCase())) {
                colors.push({
                    name: u.name,
                    color: u.baseColor
                });
            }
        });
        if (colors.length === 0) {
            colors.push({ name: 'Tablado Escénico', color: '#121418' });
        }
        return colors.slice(0, 5);
    }

    extractCostumeColors() {
        const colors = [];
        this.studio.layers.filter(l => l.visible).forEach(l => {
            if (l.color && !colors.some(c => c.color.toLowerCase() === l.color.toLowerCase())) {
                colors.push({
                    name: l.name,
                    color: l.color
                });
            }
        });
        return colors.slice(0, 5);
    }

    /**
     * Calcula ratio de contraste entre vestuario principal y fondo escenográfico
     */
    evaluateVisualContrast(stageColors, costumeColors) {
        const stageColor = (stageColors[0] && stageColors[0].color) || '#141820';
        const costumeColor = (costumeColors[0] && costumeColors[0].color) || '#dc2626';

        const lum1 = this.getLuminance(stageColor);
        const lum2 = this.getLuminance(costumeColor);

        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        const ratio = ((brightest + 0.05) / (darkest + 0.05)).toFixed(1);

        if (ratio >= 4.5) {
            return {
                ratio,
                level: 'high',
                title: 'Excelente Contraste y Recorte Escénico',
                description: 'El figurín se recorta con gran nitidez visual contra la arquitectura del decorado. Los actores serán plenamente visibles desde las filas posteriores de la platea.',
                advice: 'La relación lumínica actual garantiza que las acciones corporales y la gestualidad de los intérpretes tengan protagonismo sin ser absorbidas por el fondo.'
            };
        } else if (ratio >= 2.5) {
            return {
                ratio,
                level: 'medium',
                title: 'Armonía y Contraste Moderado',
                description: 'Existe una convivencia tonal elegante. El vestuario comparte matices con la escenografía, creando una atmósfera cohesiva y homogénea.',
                advice: 'Si se busca un impacto dramático mayor en momentos clave, se recomienda reforzar el foco cenital o contraluz para perfilar la silueta del personaje.'
            };
        } else {
            return {
                ratio,
                level: 'low',
                title: 'Bajo Contraste (Riesgo de Camuflaje)',
                description: 'El color del vestuario se asemeja excesivamente a los practicables o al telón de fondo, lo que puede provocar que la figura se funda visualmente con el decorado.',
                advice: 'Considera aclarar la capa exterior de vestuario, o bien añadir una gelatina de contraste cromático complementario en los proyectores laterales.'
            };
        }
    }

    getLuminance(hex) {
        const rgb = this.hexToRgb(hex);
        const a = [rgb.r, rgb.g, rgb.b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    hexToRgb(hex) {
        let clean = hex.replace('#', '');
        if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
        const num = parseInt(clean, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }
}

window.SynthesisView = SynthesisView;
