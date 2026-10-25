/**
 * Fábrica de Cuerpos Volumétricos Escenográficos para Three.js
 * Crea mallas paramétricas con dimensiones teatrales reales en metros.
 */
class StagePrimitiveFactory {
    /**
     * Crea un Cubo / Prisma Practicable
     */
    static createCube(options = {}) {
        const { width = 2.0, height = 1.0, depth = 1.0 } = options;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        // Desplazamos el punto de pivote a la base inferior del objeto
        // para que descanse naturalmente sobre el tablado
        geometry.translate(0, height / 2, 0);

        const material = this.createDefaultMaterial(options);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        mesh.userData = {
            type: 'cube',
            name: options.name || 'Prisma Practicable',
            dimensions: { width, height, depth },
            materialType: options.materialType || 'wood',
            baseColor: options.baseColor || '#b5835a',
            roughness: 0.6,
            metalness: 0.1,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return mesh;
    }

    /**
     * Crea un Cilindro / Columna Teatral
     */
    static createCylinder(options = {}) {
        const { radius = 0.5, height = 3.0, radialSegments = 32 } = options;
        const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
        geometry.translate(0, height / 2, 0);

        const material = this.createDefaultMaterial(options);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
            type: 'cylinder',
            name: options.name || 'Columna Cilíndrica',
            dimensions: { width: radius * 2, height, depth: radius * 2 },
            materialType: options.materialType || 'concrete',
            baseColor: options.baseColor || '#8a939e',
            roughness: 0.7,
            metalness: 0.1,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return mesh;
    }

    /**
     * Crea un Bastidor / Panel Escénico de Fondo
     */
    static createPanel(options = {}) {
        const { width = 2.4, height = 3.6, depth = 0.08 } = options;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        geometry.translate(0, height / 2, 0);

        const material = this.createDefaultMaterial(options);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
            type: 'panel',
            name: options.name || 'Bastidor Escénico',
            dimensions: { width, height, depth },
            materialType: options.materialType || 'fabric',
            baseColor: options.baseColor || '#232938',
            roughness: 0.8,
            metalness: 0.0,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return mesh;
    }

    /**
     * Crea una Rampa / Plano Inclinado Teatral (Wedge geometry)
     */
    static createRamp(options = {}) {
        const { width = 2.0, height = 1.0, depth = 3.0 } = options;
        
        // Creamos una cuña triangular extruida
        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(depth, 0);
        shape.lineTo(0, height);
        shape.closePath();

        const extrudeSettings = {
            steps: 1,
            depth: width,
            bevelEnabled: false
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        // Alinear para que la base quede sobre Y=0 y orientada hacia el proscenio
        geometry.rotateY(-Math.PI / 2);
        geometry.translate(0, height / 2, 0);

        const material = this.createDefaultMaterial(options);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
            type: 'ramp',
            name: options.name || 'Rampa Inclinada',
            dimensions: { width, height, depth },
            materialType: options.materialType || 'wood',
            baseColor: options.baseColor || '#c29b68',
            roughness: 0.7,
            metalness: 0.1,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return mesh;
    }

    /**
     * Crea una Plataforma / Tarima con patas estructurales
     */
    static createPlatform(options = {}) {
        const { width = 3.0, height = 0.8, depth = 2.0, topThickness = 0.12 } = options;
        const group = new THREE.Group();

        // Tablero superior
        const topGeom = new THREE.BoxGeometry(width, topThickness, depth);
        topGeom.translate(0, height - topThickness / 2, 0);
        const topMat = this.createDefaultMaterial({
            baseColor: options.baseColor || '#5c3a21',
            materialType: 'wood'
        });
        const topMesh = new THREE.Mesh(topGeom, topMat);
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        group.add(topMesh);

        // Patas de caño de hierro estructural en las 4 esquinas
        const legRadius = 0.04;
        const legHeight = height - topThickness;
        const legGeom = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
        legGeom.translate(0, legHeight / 2, 0);
        const legMat = new THREE.MeshStandardMaterial({
            color: 0x22252a,
            roughness: 0.4,
            metalness: 0.8
        });

        const offsetX = width / 2 - 0.1;
        const offsetZ = depth / 2 - 0.1;
        const legPositions = [
            [-offsetX, 0, -offsetZ],
            [ offsetX, 0, -offsetZ],
            [-offsetX, 0,  offsetZ],
            [ offsetX, 0,  offsetZ]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeom, legMat);
            leg.position.set(pos[0], pos[1], pos[2]);
            leg.castShadow = true;
            group.add(leg);
        });

        group.userData = {
            type: 'platform',
            name: options.name || 'Tarima Escénica',
            dimensions: { width, height, depth },
            materialType: options.materialType || 'wood',
            baseColor: options.baseColor || '#5c3a21',
            roughness: 0.6,
            metalness: 0.2,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return group;
    }

    /**
     * Crea una Escalera Modular Practicable (3-5 peldaños)
     */
    static createStairs(options = {}) {
        const { width = 1.6, height = 1.2, depth = 1.8, steps = 4 } = options;
        const group = new THREE.Group();

        const stepH = height / steps;
        const stepD = depth / steps;
        const stepMat = this.createDefaultMaterial({
            baseColor: options.baseColor || '#784d28',
            materialType: 'wood'
        });

        for (let i = 0; i < steps; i++) {
            const currentStepH = (i + 1) * stepH;
            const geom = new THREE.BoxGeometry(width, currentStepH, stepD);
            // Posicionamos cada escalón escalonado desde el frente al fondo
            const posY = currentStepH / 2;
            const posZ = (i * stepD) - (depth / 2) + (stepD / 2);
            geom.translate(0, posY, posZ);

            const stepMesh = new THREE.Mesh(geom, stepMat);
            stepMesh.castShadow = true;
            stepMesh.receiveShadow = true;
            group.add(stepMesh);
        }

        group.userData = {
            type: 'stairs',
            name: options.name || 'Escalera Modular',
            dimensions: { width, height, depth },
            stepsCount: steps,
            materialType: options.materialType || 'wood',
            baseColor: options.baseColor || '#784d28',
            roughness: 0.7,
            metalness: 0.1,
            opacity: 1.0,
            isLocked: false,
            createdAt: Date.now()
        };

        return group;
    }

    /**
     * Crea un Figurín / Maniquí 3D Teatral a Escala Humana (1.75m)
     */
    static createMannequin(options = {}) {
        const height = options.height || 1.75;
        const group = new THREE.Group();
        const baseColor = options.baseColor || '#e2b38f';
        const clothesColor = options.clothesColor || '#2563eb';

        const skinMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(baseColor),
            roughness: 0.7,
            metalness: 0.05
        });

        const garmentMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(clothesColor),
            roughness: 0.6,
            metalness: 0.1
        });

        // 1. Cabeza
        const headGeom = new THREE.SphereGeometry(0.11, 24, 24);
        headGeom.translate(0, height - 0.14, 0);
        const head = new THREE.Mesh(headGeom, skinMat);
        head.castShadow = true;
        group.add(head);

        // 2. Cuello
        const neckGeom = new THREE.CylinderGeometry(0.045, 0.05, 0.08, 16);
        neckGeom.translate(0, height - 0.26, 0);
        group.add(new THREE.Mesh(neckGeom, skinMat));

        // 3. Torso / Pecho (Prenda superior)
        const torsoGeom = new THREE.CylinderGeometry(0.18, 0.15, 0.45, 16);
        torsoGeom.translate(0, height - 0.52, 0);
        const torso = new THREE.Mesh(torsoGeom, garmentMat);
        torso.castShadow = true;
        group.add(torso);

        // 4. Cadera / Pelvis
        const hipGeom = new THREE.CylinderGeometry(0.15, 0.17, 0.22, 16);
        hipGeom.translate(0, height - 0.82, 0);
        const hip = new THREE.Mesh(hipGeom, garmentMat);
        hip.castShadow = true;
        group.add(hip);

        // 5. Piernas (Pierna izquierda y derecha)
        const legGeom = new THREE.CylinderGeometry(0.065, 0.045, 0.85, 16);
        legGeom.translate(0, 0.425, 0);

        const legL = new THREE.Mesh(legGeom, garmentMat);
        legL.position.set(-0.10, 0, 0);
        legL.castShadow = true;
        group.add(legL);

        const legR = new THREE.Mesh(legGeom, garmentMat);
        legR.position.set(0.10, 0, 0);
        legR.castShadow = true;
        group.add(legR);

        // 6. Pies / Zapatos
        const footGeom = new THREE.BoxGeometry(0.09, 0.06, 0.22);
        footGeom.translate(0, 0.03, 0.05);
        const shoeMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
        
        const footL = new THREE.Mesh(footGeom, shoeMat);
        footL.position.set(-0.10, 0, 0);
        group.add(footL);

        const footR = new THREE.Mesh(footGeom, shoeMat);
        footR.position.set(0.10, 0, 0);
        group.add(footR);

        // 7. Brazos
        const armGeom = new THREE.CylinderGeometry(0.045, 0.038, 0.65, 16);
        armGeom.translate(0, -0.30, 0);

        const armL = new THREE.Mesh(armGeom, skinMat);
        armL.position.set(-0.25, height - 0.35, 0);
        armL.rotation.z = 0.1;
        armL.castShadow = true;
        group.add(armL);

        const armR = new THREE.Mesh(armGeom, skinMat);
        armR.position.set(0.25, height - 0.35, 0);
        armR.rotation.z = -0.1;
        armR.castShadow = true;
        group.add(armR);

        group.userData = {
            type: 'mannequin',
            name: options.name || 'Figurín de Escala (1.75m)',
            dimensions: { width: 0.6, height: 1.75, depth: 0.4 },
            materialType: 'fabric',
            baseColor: clothesColor,
            skinColor: baseColor,
            isLocked: false,
            createdAt: Date.now()
        };

        return group;
    }

    /**
     * Genera el material estándar con textura procedural adecuada
     */
    static createDefaultMaterial(options = {}) {
        const {
            materialType = 'wood',
            baseColor = '#b5835a',
            roughness = 0.6,
            metalness = 0.1,
            opacity = 1.0
        } = options;

        let map = null;
        let bumpMap = null;

        if (window.proceduralTextures) {
            switch (materialType) {
                case 'wood':
                    map = window.proceduralTextures.createWoodTexture({ baseColor });
                    break;
                case 'metal':
                    map = window.proceduralTextures.createMetalTexture({ color: baseColor });
                    break;
                case 'fabric':
                    map = window.proceduralTextures.createVelvetTexture({ baseColor });
                    break;
                case 'brick':
                    map = window.proceduralTextures.createBrickTexture({ brickColor: baseColor });
                    break;
                case 'concrete':
                    map = window.proceduralTextures.createConcreteTexture({ color: baseColor });
                    break;
                case 'grid':
                    map = window.proceduralTextures.createGridTexture({ gridColor: baseColor });
                    break;
            }
        }

        const materialConfig = {
            color: new THREE.Color(baseColor),
            roughness: roughness,
            metalness: metalness,
            transparent: opacity < 1.0,
            opacity: opacity
        };

        if (map) {
            materialConfig.map = map;
            materialConfig.bumpMap = map;
            materialConfig.bumpScale = 0.02;
        }

        if (materialType === 'emissive') {
            materialConfig.emissive = new THREE.Color(baseColor);
            materialConfig.emissiveIntensity = 0.8;
            materialConfig.roughness = 0.1;
        }

        return new THREE.MeshStandardMaterial(materialConfig);
    }
}

window.StagePrimitiveFactory = StagePrimitiveFactory;
