/**
 * Catálogo de Figurines y Prendas de Vestuario Teatral
 * Define siluetas anatómicas escénicas y piezas de vestuario dibujables mediante canvas.
 */
const GarmentCatalog = {
    // -------------------------------------------------------------
    // SILUETAS BASE DE FIGURINES ANATÓMICOS (9 Cabezas)
    // -------------------------------------------------------------
    figurines: {
        female: {
            id: 'female',
            name: 'Figurín Femenino (Pose Teatral)',
            draw: (ctx, w, h, skinColor = '#e2b38f') => {
                const cx = w * 0.5;
                ctx.save();
                ctx.fillStyle = skinColor;
                ctx.strokeStyle = '#c49575';
                ctx.lineWidth = 1.5;

                // 1. Cabeza y rostro estilizado
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.12, 22, 30, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Cabello recogido base
                ctx.fillStyle = '#3a2215';
                ctx.beginPath();
                ctx.arc(cx, h * 0.10, 24, Math.PI * 0.8, Math.PI * 2.2);
                ctx.fill();

                // 2. Cuello esbelto
                ctx.fillStyle = skinColor;
                ctx.beginPath();
                ctx.moveTo(cx - 8, h * 0.155);
                ctx.lineTo(cx + 8, h * 0.155);
                ctx.lineTo(cx + 12, h * 0.20);
                ctx.lineTo(cx - 12, h * 0.20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 3. Torso superior, hombros y cintura
                ctx.beginPath();
                ctx.moveTo(cx - 38, h * 0.20); // Hombro izq
                ctx.quadraticCurveTo(cx - 40, h * 0.26, cx - 22, h * 0.32); // Cintura
                ctx.quadraticCurveTo(cx - 36, h * 0.38, cx - 34, h * 0.44); // Cadera
                ctx.lineTo(cx + 34, h * 0.44); // Cadera der
                ctx.quadraticCurveTo(cx + 36, h * 0.38, cx + 22, h * 0.32); // Cintura der
                ctx.quadraticCurveTo(cx + 40, h * 0.26, cx + 38, h * 0.20); // Hombro der
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 4. Brazos elegantes en pose escénica
                // Brazo izquierdo (levemente separado)
                ctx.beginPath();
                ctx.moveTo(cx - 38, h * 0.20);
                ctx.quadraticCurveTo(cx - 52, h * 0.32, cx - 44, h * 0.46); // Antebrazo
                ctx.lineTo(cx - 36, h * 0.46);
                ctx.quadraticCurveTo(cx - 42, h * 0.32, cx - 32, h * 0.23);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Brazo derecho (mano a la cintura)
                ctx.beginPath();
                ctx.moveTo(cx + 38, h * 0.20);
                ctx.quadraticCurveTo(cx + 56, h * 0.30, cx + 24, h * 0.34); // Codo y mano
                ctx.lineTo(cx + 22, h * 0.31);
                ctx.quadraticCurveTo(cx + 48, h * 0.28, cx + 32, h * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 5. Piernas estilizadas
                // Pierna izquierda
                ctx.beginPath();
                ctx.moveTo(cx - 32, h * 0.44);
                ctx.quadraticCurveTo(cx - 28, h * 0.60, cx - 20, h * 0.70); // Rodilla
                ctx.quadraticCurveTo(cx - 18, h * 0.82, cx - 14, h * 0.94); // Tobillo
                ctx.lineTo(cx - 8, h * 0.94);
                ctx.quadraticCurveTo(cx - 12, h * 0.82, cx - 10, h * 0.70);
                ctx.quadraticCurveTo(cx - 8, h * 0.58, cx - 4, h * 0.45);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Pierna derecha
                ctx.beginPath();
                ctx.moveTo(cx + 4, h * 0.45);
                ctx.quadraticCurveTo(cx + 8, h * 0.58, cx + 12, h * 0.70); // Rodilla
                ctx.quadraticCurveTo(cx + 14, h * 0.82, cx + 16, h * 0.94); // Tobillo
                ctx.lineTo(cx + 22, h * 0.94);
                ctx.quadraticCurveTo(cx + 22, h * 0.82, cx + 22, h * 0.70);
                ctx.quadraticCurveTo(cx + 30, h * 0.60, cx + 32, h * 0.44);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Pies estilizados
                ctx.beginPath();
                ctx.moveTo(cx - 14, h * 0.94);
                ctx.lineTo(cx - 16, h * 0.985);
                ctx.lineTo(cx - 7, h * 0.985);
                ctx.lineTo(cx - 8, h * 0.94);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(cx + 16, h * 0.94);
                ctx.lineTo(cx + 14, h * 0.985);
                ctx.lineTo(cx + 23, h * 0.985);
                ctx.lineTo(cx + 22, h * 0.94);
                ctx.fill();

                ctx.restore();
            }
        },

        male: {
            id: 'male',
            name: 'Figurín Masculino (Pose Erguida)',
            draw: (ctx, w, h, skinColor = '#d9a67e') => {
                const cx = w * 0.5;
                ctx.save();
                ctx.fillStyle = skinColor;
                ctx.strokeStyle = '#b8825c';
                ctx.lineWidth = 1.6;

                // 1. Cabeza
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.12, 23, 31, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Pelo corto
                ctx.fillStyle = '#2c1e16';
                ctx.beginPath();
                ctx.arc(cx, h * 0.10, 25, Math.PI * 0.85, Math.PI * 2.15);
                ctx.fill();

                // 2. Cuello fuerte
                ctx.fillStyle = skinColor;
                ctx.beginPath();
                ctx.moveTo(cx - 12, h * 0.155);
                ctx.lineTo(cx + 12, h * 0.155);
                ctx.lineTo(cx + 16, h * 0.20);
                ctx.lineTo(cx - 16, h * 0.20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 3. Torso robusto en V
                ctx.beginPath();
                ctx.moveTo(cx - 48, h * 0.20); // Hombro izq ancho
                ctx.lineTo(cx - 28, h * 0.34); // Cintura
                ctx.lineTo(cx - 32, h * 0.44); // Cadera
                ctx.lineTo(cx + 32, h * 0.44);
                ctx.lineTo(cx + 28, h * 0.34);
                ctx.lineTo(cx + 48, h * 0.20); // Hombro der ancho
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 4. Brazos a los costados
                ctx.beginPath();
                ctx.moveTo(cx - 48, h * 0.20);
                ctx.lineTo(cx - 52, h * 0.46);
                ctx.lineTo(cx - 40, h * 0.46);
                ctx.lineTo(cx - 38, h * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx + 48, h * 0.20);
                ctx.lineTo(cx + 52, h * 0.46);
                ctx.lineTo(cx + 40, h * 0.46);
                ctx.lineTo(cx + 38, h * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // 5. Piernas rectas
                ctx.beginPath();
                ctx.moveTo(cx - 30, h * 0.44);
                ctx.lineTo(cx - 24, h * 0.70);
                ctx.lineTo(cx - 18, h * 0.94);
                ctx.lineTo(cx - 8, h * 0.94);
                ctx.lineTo(cx - 12, h * 0.70);
                ctx.lineTo(cx - 4, h * 0.45);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx + 4, h * 0.45);
                ctx.lineTo(cx + 12, h * 0.70);
                ctx.lineTo(cx + 8, h * 0.94);
                ctx.lineTo(cx + 18, h * 0.94);
                ctx.lineTo(cx + 24, h * 0.70);
                ctx.lineTo(cx + 30, h * 0.44);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        },

        neutral: {
            id: 'neutral',
            name: 'Figurín Neutral / Andrógino (Línea Pura)',
            draw: (ctx, w, h, skinColor = '#e0c2ab') => {
                const cx = w * 0.5;
                ctx.save();
                ctx.fillStyle = skinColor;
                ctx.strokeStyle = '#9e8574';
                ctx.lineWidth = 1.5;

                // Cabeza
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.12, 21, 29, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Torso estilizado minimalista
                ctx.beginPath();
                ctx.moveTo(cx - 40, h * 0.20);
                ctx.lineTo(cx - 24, h * 0.33);
                ctx.lineTo(cx - 30, h * 0.44);
                ctx.lineTo(cx + 30, h * 0.44);
                ctx.lineTo(cx + 24, h * 0.33);
                ctx.lineTo(cx + 40, h * 0.20);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Brazos
                ctx.beginPath();
                ctx.moveTo(cx - 40, h * 0.20);
                ctx.lineTo(cx - 46, h * 0.45);
                ctx.lineTo(cx - 36, h * 0.45);
                ctx.lineTo(cx - 32, h * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx + 40, h * 0.20);
                ctx.lineTo(cx + 46, h * 0.45);
                ctx.lineTo(cx + 36, h * 0.45);
                ctx.lineTo(cx + 32, h * 0.22);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Piernas
                ctx.beginPath();
                ctx.moveTo(cx - 28, h * 0.44);
                ctx.lineTo(cx - 20, h * 0.70);
                ctx.lineTo(cx - 15, h * 0.94);
                ctx.lineTo(cx - 7, h * 0.94);
                ctx.lineTo(cx - 10, h * 0.70);
                ctx.lineTo(cx - 3, h * 0.45);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx + 3, h * 0.45);
                ctx.lineTo(cx + 10, h * 0.70);
                ctx.lineTo(cx + 7, h * 0.94);
                ctx.lineTo(cx + 15, h * 0.94);
                ctx.lineTo(cx + 20, h * 0.70);
                ctx.lineTo(cx + 28, h * 0.44);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        }
    },

    // -------------------------------------------------------------
    // CATÁLOGO DE PRENDAS MODULARES POR CAPAS
    // -------------------------------------------------------------
    items: [
        // --- 1. SOMBREROS & TOCADOS ---
        {
            id: 'hat_tophat',
            name: 'Sombrero de Copa Teatral',
            category: 'head',
            defaultColor: '#1c1c24',
            defaultFabric: 'velvet',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;

                // Ala del sombrero
                ctx.fillStyle = fabricPattern;
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.088, 38, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = 'rgba(0,0,0,0.6)';
                ctx.stroke();

                // Copa alta cilíndrica
                ctx.beginPath();
                ctx.moveTo(cx - 24, h * 0.086);
                ctx.lineTo(cx - 28, h * 0.015);
                ctx.lineTo(cx + 28, h * 0.015);
                ctx.lineTo(cx + 24, h * 0.086);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Tapa superior
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.015, 28, 5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Cinta de seda brillante alrededor
                ctx.fillStyle = '#e5a93c';
                ctx.beginPath();
                ctx.rect(cx - 25, h * 0.070, 50, 7);
                ctx.fill();

                ctx.restore();
            }
        },
        {
            id: 'hat_crown',
            name: 'Corona / Tiara Real Escénica',
            category: 'head',
            defaultColor: '#f59e0b',
            defaultFabric: 'sequin',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#b45309';
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(cx - 26, h * 0.085);
                ctx.lineTo(cx - 26, h * 0.045);
                ctx.lineTo(cx - 14, h * 0.065);
                ctx.lineTo(cx, h * 0.030); // Punta central más alta
                ctx.lineTo(cx + 14, h * 0.065);
                ctx.lineTo(cx + 26, h * 0.045);
                ctx.lineTo(cx + 26, h * 0.085);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Gemas teatrales
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.arc(cx, h * 0.055, 3.5, 0, Math.PI * 2);
                ctx.arc(cx - 16, h * 0.070, 2.5, 0, Math.PI * 2);
                ctx.arc(cx + 16, h * 0.070, 2.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        },

        // --- 2. PRENDAS SUPERIORES (Camisas, Blusas, Corsés) ---
        {
            id: 'top_corset',
            name: 'Corsé Renacentista Estructurado',
            category: 'top',
            defaultColor: '#7f1d1d',
            defaultFabric: 'brocade',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#3b0707';
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(cx - 30, h * 0.22); // Escote
                ctx.quadraticCurveTo(cx, h * 0.25, cx + 30, h * 0.22);
                ctx.lineTo(cx + 22, h * 0.33); // Cintura
                ctx.lineTo(cx, h * 0.36); // Punta inferior corsé
                ctx.lineTo(cx - 22, h * 0.33);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Ballenas estructurales (varillas doradas)
                ctx.strokeStyle = 'rgba(229, 169, 60, 0.6)';
                ctx.lineWidth = 1;
                [-14, -7, 0, 7, 14].forEach(off => {
                    ctx.beginPath();
                    ctx.moveTo(cx + off * 1.5, h * 0.23);
                    ctx.lineTo(cx + off, h * 0.34);
                    ctx.stroke();
                });

                ctx.restore();
            }
        },
        {
            id: 'top_blouse',
            name: 'Camisa con Volados y Chorrera',
            category: 'top',
            defaultColor: '#f8fafc',
            defaultFabric: 'cotton',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 1.5;

                // Cuerpo de la camisa
                ctx.beginPath();
                ctx.moveTo(cx - 38, h * 0.20);
                ctx.lineTo(cx + 38, h * 0.20);
                ctx.lineTo(cx + 28, h * 0.34);
                ctx.lineTo(cx - 28, h * 0.34);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Mangas abullonadas
                ctx.beginPath();
                ctx.ellipse(cx - 42, h * 0.26, 15, 24, -0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.ellipse(cx + 42, h * 0.26, 15, 24, 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                // Chorrera de volados centrales de época
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    const y = h * 0.20 + i * 14;
                    ctx.arc(cx, y + 8, 10 - i * 1.2, 0, Math.PI);
                }
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        },

        // --- 3. ABRIGOS, FRAC & CAPAS ---
        {
            id: 'outer_cape',
            name: 'Capa Larga Teatral con Vuelo',
            category: 'outer',
            defaultColor: '#4c0519',
            defaultFabric: 'velvet',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#1a0006';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.moveTo(cx - 20, h * 0.19); // Broche de cuello
                ctx.lineTo(cx + 20, h * 0.19);
                ctx.quadraticCurveTo(cx + 65, h * 0.45, cx + 75, h * 0.90); // Vuelo derecho amplio
                ctx.quadraticCurveTo(cx, h * 0.95, cx - 75, h * 0.90); // Base con caída
                ctx.quadraticCurveTo(cx - 65, h * 0.45, cx - 20, h * 0.19); // Vuelo izquierdo
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Forro interno satinado visible en el revés
                ctx.fillStyle = 'rgba(229, 169, 60, 0.3)';
                ctx.beginPath();
                ctx.moveTo(cx + 45, h * 0.60);
                ctx.lineTo(cx + 75, h * 0.90);
                ctx.lineTo(cx + 50, h * 0.88);
                ctx.closePath();
                ctx.fill();

                // Broche o fíbula dorada
                ctx.fillStyle = '#e5a93c';
                ctx.beginPath();
                ctx.arc(cx - 15, h * 0.195, 4, 0, Math.PI * 2);
                ctx.arc(cx + 15, h * 0.195, 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        },
        {
            id: 'outer_jacket',
            name: 'Chaqueta Militar / Frac con Solapa',
            category: 'outer',
            defaultColor: '#1e3a8a',
            defaultFabric: 'cotton',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 1.6;

                // Torso de la chaqueta
                ctx.beginPath();
                ctx.moveTo(cx - 44, h * 0.19);
                ctx.lineTo(cx + 44, h * 0.19);
                ctx.lineTo(cx + 34, h * 0.36);
                ctx.lineTo(cx + 40, h * 0.65); // Faldón trasero derecho
                ctx.lineTo(cx + 20, h * 0.40);
                ctx.lineTo(cx - 20, h * 0.40);
                ctx.lineTo(cx - 40, h * 0.65); // Faldón trasero izquierdo
                ctx.lineTo(cx - 34, h * 0.36);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Solapas en V
                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                ctx.moveTo(cx - 18, h * 0.19);
                ctx.lineTo(cx - 30, h * 0.28);
                ctx.lineTo(cx - 6, h * 0.32);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(cx + 18, h * 0.19);
                ctx.lineTo(cx + 30, h * 0.28);
                ctx.lineTo(cx + 6, h * 0.32);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Botonadura doble dorada
                ctx.fillStyle = '#e5a93c';
                for (let r = 0; r < 3; r++) {
                    const by = h * 0.23 + r * 14;
                    ctx.beginPath();
                    ctx.arc(cx - 10, by, 3, 0, Math.PI * 2);
                    ctx.arc(cx + 10, by, 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        },

        // --- 4. PRENDAS INFERIORES & FALDAS ---
        {
            id: 'bottom_trousers',
            name: 'Pantalones Sastre Rectos',
            category: 'bottom',
            defaultColor: '#1e293b',
            defaultFabric: 'cotton',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#020617';
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                ctx.moveTo(cx - 32, h * 0.34); // Cintura
                ctx.lineTo(cx + 32, h * 0.34);
                ctx.lineTo(cx + 26, h * 0.92); // Bota derecha
                ctx.lineTo(cx + 8, h * 0.92);
                ctx.lineTo(cx, h * 0.46); // Tiro central
                ctx.lineTo(cx - 8, h * 0.92);
                ctx.lineTo(cx - 26, h * 0.92); // Bota izquierda
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Raya sastre planchada
                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx - 17, h * 0.40);
                ctx.lineTo(cx - 17, h * 0.90);
                ctx.moveTo(cx + 17, h * 0.40);
                ctx.lineTo(cx + 17, h * 0.90);
                ctx.stroke();

                ctx.restore();
            }
        },
        {
            id: 'bottom_skirt',
            name: 'Falda Teatral Acampanada con Vuelo',
            category: 'bottom',
            defaultColor: '#047857',
            defaultFabric: 'silk',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#064e3b';
                ctx.lineWidth = 1.8;

                ctx.beginPath();
                ctx.moveTo(cx - 24, h * 0.33); // Cintura ceñida
                ctx.lineTo(cx + 24, h * 0.33);
                ctx.quadraticCurveTo(cx + 70, h * 0.55, cx + 64, h * 0.88); // Vuelo
                ctx.quadraticCurveTo(cx, h * 0.92, cx - 64, h * 0.88);
                ctx.quadraticCurveTo(cx - 70, h * 0.55, cx - 24, h * 0.33);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Pliegues y sombras del vuelo
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.lineWidth = 1.5;
                [-35, -15, 0, 15, 35].forEach(xOff => {
                    ctx.beginPath();
                    ctx.moveTo(cx + xOff * 0.3, h * 0.35);
                    ctx.quadraticCurveTo(cx + xOff * 0.7, h * 0.60, cx + xOff * 1.3, h * 0.88);
                    ctx.stroke();
                });

                ctx.restore();
            }
        },

        // --- 5. VESTIDOS COMPLETOS ---
        {
            id: 'dress_ballgown',
            name: 'Vestido Largo de Época / Gala',
            category: 'dress',
            defaultColor: '#6d28d9',
            defaultFabric: 'velvet',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#3b0764';
                ctx.lineWidth = 1.8;

                // Corpiño + Falda de Cancán entera
                ctx.beginPath();
                ctx.moveTo(cx - 32, h * 0.21); // Escote
                ctx.lineTo(cx + 32, h * 0.21);
                ctx.lineTo(cx + 22, h * 0.33); // Cintura
                ctx.quadraticCurveTo(cx + 82, h * 0.55, cx + 78, h * 0.94); // Falda monumental
                ctx.quadraticCurveTo(cx, h * 0.97, cx - 78, h * 0.94);
                ctx.quadraticCurveTo(cx - 82, h * 0.55, cx - 22, h * 0.33);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Cenefa o bordado en el ruedo
                ctx.fillStyle = '#e5a93c';
                ctx.beginPath();
                ctx.ellipse(cx, h * 0.93, 72, 7, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        },

        // --- 6. CALZADO ---
        {
            id: 'shoes_boots',
            name: 'Botas Altas de Montar / Bucanero',
            category: 'footwear',
            defaultColor: '#451a03',
            defaultFabric: 'leather',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#1f0d02';
                ctx.lineWidth = 1.5;

                // Bota izquierda con vuelta de caña
                ctx.beginPath();
                ctx.moveTo(cx - 24, h * 0.70);
                ctx.lineTo(cx - 6, h * 0.70);
                ctx.lineTo(cx - 8, h * 0.94);
                ctx.lineTo(cx - 4, h * 0.985); // Puntera
                ctx.lineTo(cx - 22, h * 0.985); // Talón
                ctx.lineTo(cx - 20, h * 0.94);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Bota derecha con vuelta de caña
                ctx.beginPath();
                ctx.moveTo(cx + 6, h * 0.70);
                ctx.lineTo(cx + 24, h * 0.70);
                ctx.lineTo(cx + 20, h * 0.94);
                ctx.lineTo(cx + 22, h * 0.985);
                ctx.lineTo(cx + 4, h * 0.985);
                ctx.lineTo(cx + 8, h * 0.94);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Hebillas doradas
                ctx.fillStyle = '#e5a93c';
                ctx.fillRect(cx - 18, h * 0.78, 6, 4);
                ctx.fillRect(cx + 12, h * 0.78, 6, 4);

                ctx.restore();
            }
        },

        // --- 7. ACCESORIOS ESCÉNICOS ---
        {
            id: 'acc_ruff',
            name: 'Gorguera Renacentista (Golilla)',
            category: 'accessory',
            defaultColor: '#ffffff',
            defaultFabric: 'chiffon',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = '#f8fafc';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1.2;

                // Rueda de encaje plisado en forma de abanico 360
                const folds = 16;
                ctx.beginPath();
                for (let i = 0; i <= folds; i++) {
                    const angle = (i / folds) * Math.PI;
                    const r = 26 + (i % 2 === 0 ? 6 : 0);
                    const px = cx + Math.cos(angle) * r;
                    const py = h * 0.18 + Math.sin(angle) * 12;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.restore();
            }
        },
        {
            id: 'acc_sash',
            name: 'Fajín Teatral de Gala con Flecos',
            category: 'accessory',
            defaultColor: '#dc2626',
            defaultFabric: 'silk',
            draw: (ctx, w, h, fabricPattern, color, opacity) => {
                const cx = w * 0.5;
                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.fillStyle = fabricPattern;
                ctx.strokeStyle = '#991b1b';
                ctx.lineWidth = 1.5;

                // Banda en cintura
                ctx.beginPath();
                ctx.rect(cx - 26, h * 0.325, 52, 10);
                ctx.fill();
                ctx.stroke();

                // Lazo y caída lateral
                ctx.beginPath();
                ctx.moveTo(cx + 14, h * 0.33);
                ctx.lineTo(cx + 26, h * 0.58);
                ctx.lineTo(cx + 16, h * 0.58);
                ctx.lineTo(cx + 6, h * 0.33);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                // Flecos dorados
                ctx.fillStyle = '#e5a93c';
                ctx.fillRect(cx + 16, h * 0.58, 10, 5);

                ctx.restore();
            }
        }
    ]
};

window.GarmentCatalog = GarmentCatalog;
