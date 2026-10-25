/**
 * Taller de Diseño de Vestuario sobre Figurines (2D Studio)
 * Gestiona el lienzo interactivo, la superposición de capas textiles y la paleta de telas.
 */
class FigurineStudio {
    constructor(canvasElement, onLayersUpdatedCallback) {
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        this.onLayersUpdated = onLayersUpdatedCallback;

        this.currentFigurineId = 'female';
        this.skinColor = '#e2b38f';
        this.layers = []; // [{ id, itemId, name, category, fabricType, color, opacity, visible, scale }]
        this.selectedLayerIndex = -1;

        // Dimensiones base de alta resolución para nitidez en Retina
        this.width = 600;
        this.height = 800;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.initDefaultOutfit();
        this.render();
    }

    /**
     * Inicializa un atuendo teatral completo de demostración
     */
    initDefaultOutfit() {
        this.layers = [
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'top_blouse',
                name: 'Camisa con Volados y Chorrera',
                category: 'top',
                fabricType: 'cotton',
                color: '#f8fafc',
                opacity: 1.0,
                visible: true,
                scale: 1.0
            },
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'top_corset',
                name: 'Corsé Renacentista',
                category: 'top',
                fabricType: 'brocade',
                color: '#7f1d1d',
                opacity: 1.0,
                visible: true,
                scale: 1.0
            },
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'bottom_skirt',
                name: 'Falda Acampanada Teatral',
                category: 'bottom',
                fabricType: 'velvet',
                color: '#15803d',
                opacity: 1.0,
                visible: true,
                scale: 1.0
            },
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'outer_cape',
                name: 'Capa Larga con Vuelo',
                category: 'outer',
                fabricType: 'velvet',
                color: '#4c0519',
                opacity: 0.95,
                visible: true,
                scale: 1.0
            },
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'shoes_boots',
                name: 'Botas Altas de Bucanero',
                category: 'footwear',
                fabricType: 'leather',
                color: '#451a03',
                opacity: 1.0,
                visible: true,
                scale: 1.0
            },
            {
                uid: 'layer_' + Math.random().toString(36).substr(2, 9),
                itemId: 'hat_tophat',
                name: 'Sombrero de Copa Teatral',
                category: 'head',
                fabricType: 'velvet',
                color: '#18181b',
                opacity: 1.0,
                visible: true,
                scale: 1.0
            }
        ];
        this.selectedLayerIndex = this.layers.length - 1;
    }

    /**
     * Renderizado en capas del figurín y sus prendas superpuestas
     */
    render() {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;

        ctx.clearRect(0, 0, w, h);

        // Fondo de papel de dibujo teatral / estudio
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#161922');
        bgGrad.addColorStop(1, '#0e1117');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Cuadrícula sutil de patronaje / proporción de moda (Línea de 9 cabezas)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const headH = h / 9;
        for (let i = 1; i <= 9; i++) {
            const y = i * headH;
            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(w - 30, y);
            ctx.stroke();

            // Etiqueta de proporción
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.font = '10px monospace';
            ctx.fillText(`C${i}`, 10, y - 4);
        }

        // Sombra de pie escénica en el suelo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.98, 80, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // 1. Dibujar silueta base del figurín seleccionado
        const figurine = GarmentCatalog.figurines[this.currentFigurineId] || GarmentCatalog.figurines.female;
        if (figurine && figurine.draw) {
            figurine.draw(ctx, w, h, this.skinColor);
        }

        // 2. Dibujar prendas superpuestas según el orden de capas (z-index)
        this.layers.forEach((layer, idx) => {
            if (!layer.visible) return;

            const itemDef = GarmentCatalog.items.find(it => it.id === layer.itemId);
            if (!itemDef || !itemDef.draw) return;

            // Generar o recuperar la textura procedural de la tela
            const fabricCanvas = window.fabricTextureFactory.getFabricCanvas(
                layer.fabricType,
                layer.color,
                layer.scale || 1.0
            );
            const fabricPattern = ctx.createPattern(fabricCanvas, 'repeat');

            // Dibujar la prenda
            itemDef.draw(ctx, w, h, fabricPattern, layer.color, layer.opacity);

            // Si es la capa seleccionada, dibujar un borde sutil de enfoque
            if (idx === this.selectedLayerIndex) {
                // Sutil resplandor de selección en interfaz
            }
        });

        // 3. Notificar a los oyentes de actualización
        if (this.onLayersUpdated) {
            this.onLayersUpdated(this.layers, this.selectedLayerIndex);
        }
    }

    /**
     * Cambia el figurín base
     */
    setFigurine(id) {
        if (GarmentCatalog.figurines[id]) {
            this.currentFigurineId = id;
            this.render();
        }
    }

    /**
     * Añade una nueva prenda al sistema de capas
     */
    addLayer(itemId) {
        const itemDef = GarmentCatalog.items.find(it => it.id === itemId);
        if (!itemDef) return;

        const newLayer = {
            uid: 'layer_' + Math.random().toString(36).substr(2, 9),
            itemId: itemDef.id,
            name: itemDef.name,
            category: itemDef.category,
            fabricType: itemDef.defaultFabric || 'cotton',
            color: itemDef.defaultColor || '#3b82f6',
            opacity: 1.0,
            visible: true,
            scale: 1.0
        };

        this.layers.push(newLayer);
        this.selectedLayerIndex = this.layers.length - 1;
        this.render();
    }

    /**
     * Elimina una capa por índice
     */
    removeLayer(index) {
        if (index >= 0 && index < this.layers.length) {
            this.layers.splice(index, 1);
            if (this.selectedLayerIndex >= this.layers.length) {
                this.selectedLayerIndex = this.layers.length - 1;
            }
            this.render();
        }
    }

    /**
     * Reordenar capa (Mover hacia adelante / atrás)
     */
    moveLayer(fromIndex, toIndex) {
        if (toIndex < 0 || toIndex >= this.layers.length) return;
        const [moved] = this.layers.splice(fromIndex, 1);
        this.layers.splice(toIndex, 0, moved);
        this.selectedLayerIndex = toIndex;
        this.render();
    }

    /**
     * Alternar visibilidad de capa
     */
    toggleVisibility(index) {
        if (this.layers[index]) {
            this.layers[index].visible = !this.layers[index].visible;
            this.render();
        }
    }

    /**
     * Actualiza propiedades de la capa activa
     */
    updateActiveLayer(updates) {
        if (this.selectedLayerIndex >= 0 && this.layers[this.selectedLayerIndex]) {
            Object.assign(this.layers[this.selectedLayerIndex], updates);
            this.render();
        }
    }

    selectLayer(index) {
        this.selectedLayerIndex = index;
        this.render();
    }

    /**
     * Exporta la lámina de figurín como imagen de alta resolución
     */
    captureFigurinePlate() {
        return this.canvas.toDataURL('image/png');
    }

    /**
     * Extrae colores y materiales dominantes para sincronizar con el Maniquí 3D y el Dossier
     */
    getCostumeSummary() {
        const activeLayers = this.layers.filter(l => l.visible);
        const palette = activeLayers.map(l => ({
            name: l.name,
            fabric: l.fabricType,
            color: l.color
        }));

        const primary = activeLayers.find(l => l.category === 'outer' || l.category === 'dress' || l.category === 'top');
        const primaryColor = primary ? primary.color : '#2563eb';

        return {
            figurineType: this.currentFigurineId,
            layersCount: activeLayers.length,
            layers: activeLayers,
            palette,
            primaryColor
        };
    }
}

window.FigurineStudio = FigurineStudio;
