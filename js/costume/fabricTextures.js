/**
 * Generador de Texturas Visuales de Telas Teatrales (2D Fabric Engine)
 * Produce patrones visuales procedimentales de alta fidelidad para el taller de vestuario.
 */
class FabricTextureFactory {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Retorna una textura de tela como CanvasPattern o Canvas renderizado
     */
    getFabricCanvas(type, baseColor = '#2563eb', scale = 1.0) {
        const key = `${type}_${baseColor}_${scale}`;
        if (this.cache.has(key)) return this.cache.get(key);

        const size = Math.round(128 * scale);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(64, size);
        canvas.height = Math.max(64, size);
        const ctx = canvas.getContext('2d');

        switch (type) {
            case 'cotton': // Algodón / Lino rústico
                this.renderCotton(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'silk': // Seda / Satén brillante
                this.renderSilk(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'leather': // Cuero curtido
                this.renderLeather(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'denim': // Jean / Denim con sarga diagonal
                this.renderDenim(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'chiffon': // Gasa / Voile translúcido
                this.renderChiffon(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'velvet': // Terciopelo / Pana teatral
                this.renderVelvet(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'brocade': // Brocado / Damasco ornamental barroco
                this.renderBrocade(ctx, canvas.width, canvas.height, baseColor);
                break;
            case 'sequin': // Lentejuelas / Malla metálica
                this.renderSequin(ctx, canvas.width, canvas.height, baseColor);
                break;
            default:
                ctx.fillStyle = baseColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        this.cache.set(key, canvas);
        return canvas;
    }

    renderCotton(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Trama cruzada de hilado orgánico
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let x = 0; x < w; x += 3) {
            ctx.fillRect(x, 0, 1, h);
        }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        for (let y = 0; y < h; y += 3) {
            ctx.fillRect(0, y, w, 1);
        }

        // Piqueteado de fibra textil
        for (let i = 0; i < 80; i++) {
            ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
    }

    renderSilk(ctx, w, h, baseColor) {
        // Fondo base
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Brillo especular diagonal satinado característico de la seda
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.0)');
        grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.35)');
        grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        grad.addColorStop(0.75, 'rgba(255, 255, 255, 0.40)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Suavizado lustroso
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for (let y = 0; y < h; y += 4) {
            ctx.fillRect(0, y, w, 1);
        }
    }

    renderLeather(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Grano curtido celular del cuero
        const cells = 16;
        const cellW = w / cells;
        for (let x = 0; x < cells; x++) {
            for (let y = 0; y < cells; y++) {
                const cx = x * cellW + cellW * 0.5 + (Math.random() - 0.5) * 3;
                const cy = y * cellW + cellW * 0.5 + (Math.random() - 0.5) * 3;
                const r = cellW * 0.45;

                ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
                ctx.beginPath();
                ctx.arc(cx - 1, cy - 1, r * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    renderDenim(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Sarga diagonal de 45 grados (Twill weave)
        ctx.strokeStyle = 'rgba(235, 245, 255, 0.22)';
        ctx.lineWidth = 1.5;
        const spacing = 4;

        for (let d = -w; d < w + h; d += spacing) {
            ctx.beginPath();
            ctx.moveTo(d, 0);
            ctx.lineTo(d + h, h);
            ctx.stroke();
        }

        // Hilos oscuros perpendiculares
        ctx.strokeStyle = 'rgba(0, 10, 30, 0.35)';
        ctx.lineWidth = 1;
        for (let d = -w; d < w + h; d += spacing * 2) {
            ctx.beginPath();
            ctx.moveTo(d, h);
            ctx.lineTo(d + h, 0);
            ctx.stroke();
        }
    }

    renderChiffon(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Velo etéreo con micronubes
        const grad = ctx.createRadialGradient(w/2, h/2, 5, w/2, h/2, w/2);
        grad.addColorStop(0, 'rgba(255,255,255,0.25)');
        grad.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Micro rejilla semitransparente
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < w; i += 2) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, h);
            ctx.stroke();
        }
    }

    renderVelvet(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Suave pelo vertical con gradiente de profundidad aterciopelada
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.25)');
        grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
        grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.20)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Textura fina de pelo
        for (let i = 0; i < 200; i++) {
            ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)';
            ctx.fillRect(Math.random() * w, Math.random() * h, 1, 3);
        }
    }

    renderBrocade(ctx, w, h, baseColor) {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);

        // Motivos ornamentales de damasco/brocado dorado
        ctx.fillStyle = '#e5a93c';
        ctx.globalAlpha = 0.45;

        const drawFlower = (cx, cy, r) => {
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
            ctx.fill();

            for (let a = 0; a < 6; a++) {
                const angle = (a * Math.PI) / 3;
                const px = cx + Math.cos(angle) * r * 0.8;
                const py = cy + Math.sin(angle) * r * 0.8;
                ctx.beginPath();
                ctx.arc(px, py, r * 0.35, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        drawFlower(w * 0.25, h * 0.25, 12);
        drawFlower(w * 0.75, h * 0.25, 12);
        drawFlower(w * 0.25, h * 0.75, 12);
        drawFlower(w * 0.75, h * 0.75, 12);
        drawFlower(w * 0.5,  h * 0.5,  16);

        ctx.globalAlpha = 1.0;
    }

    renderSequin(ctx, w, h, baseColor) {
        ctx.fillStyle = '#10141a';
        ctx.fillRect(0, 0, w, h);

        // Lentejuelas en círculos reflectivos facetados
        const cols = 8;
        const rad = (w / cols) * 0.46;
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < cols; y++) {
                const cx = (x + 0.5) * (w / cols);
                const cy = (y + 0.5) * (h / cols);

                // Disco base
                ctx.fillStyle = baseColor;
                ctx.beginPath();
                ctx.arc(cx, cy, rad, 0, Math.PI * 2);
                ctx.fill();

                // Reflejo metálico brillante
                ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                ctx.beginPath();
                ctx.arc(cx - rad * 0.3, cy - rad * 0.3, rad * 0.3, 0, Math.PI * 2);
                ctx.fill();

                // Orificio central de costura teatral
                ctx.fillStyle = '#000000';
                ctx.beginPath();
                ctx.arc(cx, cy, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

window.fabricTextureFactory = new FabricTextureFactory();
