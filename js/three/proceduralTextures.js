/**
 * Generador de Texturas Procedurales Teatrales para Three.js
 * Genera texturas ricas y optimizadas directamente sobre HTML5 Canvas sin dependencias externas.
 */
class ProceduralTextureFactory {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Textura de Madera para tablados, tarimas y bastidores de escenografía
     */
    createWoodTexture(options = {}) {
        const {
            width = 512,
            height = 512,
            baseColor = '#8b5a2b',
            plankColor2 = '#6e431c',
            planks = 6
        } = options;

        const key = `wood_${baseColor}_${planks}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fondo base de madera
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, width, height);

        // Vetas finas de madera longitudinales
        const plankH = height / planks;
        for (let p = 0; p < planks; p++) {
            const py = p * plankH;
            
            // Variación sutil de color entre tablones
            ctx.fillStyle = (p % 2 === 0) ? baseColor : plankColor2;
            ctx.globalAlpha = 0.35;
            ctx.fillRect(0, py, width, plankH);

            // Líneas de vetas orgánicas
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#2b1704';
            for (let i = 0; i < 40; i++) {
                const y = py + Math.random() * plankH;
                const h = 1 + Math.random() * 2.5;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.bezierCurveTo(
                    width * 0.3, y + (Math.random() - 0.5) * 8,
                    width * 0.7, y + (Math.random() - 0.5) * 8,
                    width, y
                );
                ctx.lineWidth = h;
                ctx.strokeStyle = '#231202';
                ctx.stroke();
            }

            // Nudos de madera ocasionales
            if (p % 2 === 0) {
                const kx = (p * 137 + 73) % (width - 60) + 30;
                const ky = py + plankH * 0.5;
                const rad = 6 + (p * 3) % 10;
                ctx.fillStyle = '#200f01';
                ctx.globalAlpha = 0.4;
                ctx.beginPath();
                ctx.ellipse(kx, ky, rad * 1.5, rad * 0.8, 0.1, 0, Math.PI * 2);
                ctx.fill();
            }

            // Separación de tablón (junta de dilatación teatral)
            ctx.globalAlpha = 0.85;
            ctx.fillStyle = '#110701';
            ctx.fillRect(0, py + plankH - 2, width, 2);
            
            // Clavos / tornillos de fijación escenográfica en los extremos
            ctx.fillStyle = '#3a2b20';
            ctx.beginPath();
            ctx.arc(24, py + plankH * 0.5, 2.5, 0, Math.PI * 2);
            ctx.arc(width - 24, py + plankH * 0.5, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1.0;
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Metal Industrial (acero cepillado / estructura tubular)
     */
    createMetalTexture(options = {}) {
        const { width = 512, height = 512, color = '#606a75' } = options;
        const key = `metal_${color}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Base metálica
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        // Cepillado lineal metálico
        ctx.globalAlpha = 0.08;
        for (let y = 0; y < height; y += 1) {
            const val = Math.random() * 255;
            ctx.fillStyle = `rgb(${val},${val},${val})`;
            ctx.fillRect(0, y, width, 1);
        }

        // Rayones y desgaste de taller teatral
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 25; i++) {
            ctx.beginPath();
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + (Math.random() - 0.5) * 80, sy + (Math.random() - 0.5) * 20);
            ctx.stroke();
        }

        ctx.globalAlpha = 1.0;
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Terciopelo / Cortinado Escénico (telón de fondo, bambalina)
     */
    createVelvetTexture(options = {}) {
        const { width = 512, height = 512, baseColor = '#500714', folds = 10 } = options;
        const key = `velvet_${baseColor}_${folds}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Gradientes verticales que simulan pliegues de tela pesante
        const foldW = width / folds;
        for (let f = 0; f < folds; f++) {
            const fx = f * foldW;
            const grad = ctx.createLinearGradient(fx, 0, fx + foldW, 0);
            grad.addColorStop(0.0, '#100004');
            grad.addColorStop(0.25, baseColor);
            grad.addColorStop(0.5, '#8c162c'); // Brillo del lomo del pliegue
            grad.addColorStop(0.8, baseColor);
            grad.addColorStop(1.0, '#100004');

            ctx.fillStyle = grad;
            ctx.fillRect(fx, 0, foldW, height);
        }

        // Ruido de textura aterciopelada
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 14;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
        }
        ctx.putImageData(imgData, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Ladrillo / Mampostería Escénica
     */
    createBrickTexture(options = {}) {
        const { width = 512, height = 512, brickColor = '#8c3d2e', mortarColor = '#3a3430' } = options;
        const key = `brick_${brickColor}_${mortarColor}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Fondo de mortero
        ctx.fillStyle = mortarColor;
        ctx.fillRect(0, 0, width, height);

        const rows = 16;
        const rowH = height / rows;
        const brickW = width / 4;

        for (let r = 0; r < rows; r++) {
            const y = r * rowH;
            const offset = (r % 2 === 0) ? 0 : -brickW / 2;
            
            for (let x = offset; x < width + brickW; x += brickW) {
                // Tono de ladrillo con variación orgánica
                const colorVariation = (Math.random() - 0.5) * 30;
                ctx.fillStyle = brickColor;
                ctx.fillRect(x + 3, y + 3, brickW - 6, rowH - 6);

                // Granulado sobre el ladrillo
                ctx.fillStyle = `rgba(0,0,0,0.15)`;
                for (let s = 0; s < 25; s++) {
                    const sx = x + 4 + Math.random() * (brickW - 8);
                    const sy = y + 4 + Math.random() * (rowH - 8);
                    ctx.fillRect(sx, sy, 2, 2);
                }
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Hormigón / Cemento Brutalista
     */
    createConcreteTexture(options = {}) {
        const { width = 512, height = 512, color = '#555a60' } = options;
        const key = `concrete_${color}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        // Agregados y poros del cemento
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
            const n = (Math.random() - 0.5) * 28;
            data[i]   = Math.min(255, Math.max(0, data[i] + n));
            data[i+1] = Math.min(255, Math.max(0, data[i+1] + n));
            data[i+2] = Math.min(255, Math.max(0, data[i+2] + n));
        }
        ctx.putImageData(imgData, 0, 0);

        // Manchas y pátinas de agua
        ctx.fillStyle = 'rgba(0,0,0,0.06)';
        for (let p = 0; p < 8; p++) {
            ctx.beginPath();
            ctx.arc(Math.random() * width, Math.random() * height, 30 + Math.random() * 80, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Malla / Rejilla Estructural Teatral
     */
    createGridTexture(options = {}) {
        const { width = 256, height = 256, gridColor = '#00ffff', bgColor = '#0f172a' } = options;
        const key = `grid_${gridColor}_${bgColor}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);

        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        const step = width / 8;
        for (let i = step; i < width; i += step) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        this.cache.set(key, texture);
        return texture;
    }

    /**
     * Textura de Tablado Escénico Negro de Fondo (Floor Grid con marcas escenográficas)
     */
    createStageFloorTexture() {
        const key = 'stage_floor_master';
        if (this.cache.has(key)) return this.cache.get(key);

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Color del tablado negro mate teatral
        ctx.fillStyle = '#121418';
        ctx.fillRect(0, 0, 1024, 1024);

        // Tablones longitudinales de escenario
        const planks = 32;
        const plankH = 1024 / planks;
        ctx.fillStyle = '#0d0f12';
        for (let p = 0; p < planks; p += 2) {
            ctx.fillRect(0, p * plankH, 1024, plankH);
        }

        // Cuadrícula métrica escénica (marcas de cinta de carrocero / spikes teatrales)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 2;
        const gridStep = 1024 / 8;
        for (let x = 0; x <= 1024; x += gridStep) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 1024);
            ctx.stroke();
        }
        for (let y = 0; y <= 1024; y += gridStep) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(1024, y);
            ctx.stroke();
        }

        // Marcas de centro de escena (Center Stage crosshairs)
        ctx.strokeStyle = 'rgba(230, 175, 46, 0.4)'; // Ámbar de cinta escénica
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(512 - 20, 512);
        ctx.lineTo(512 + 20, 512);
        ctx.moveTo(512, 512 - 20);
        ctx.lineTo(512, 512 + 20);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        this.cache.set(key, texture);
        return texture;
    }
}

// Instancia global del generador de texturas
window.proceduralTextures = new ProceduralTextureFactory();
