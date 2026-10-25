/**
 * Gestor del Escenario Virtual 3D (Three.js)
 * Controla la escena teatral, cámaras, manipulación con TransformControls,
 * selección por raycasting y gestión de objetos volumétricos.
 */
class StageManager {
    constructor(containerElement, onObjectSelectedCallback, onObjectChangedCallback) {
        this.container = containerElement;
        this.onObjectSelected = onObjectSelectedCallback;
        this.onObjectChanged = onObjectChangedCallback;

        this.stageWidth = 12.0;   // Metros de boca de escena
        this.stageDepth = 10.0;   // Metros de profundidad de escena
        this.stageHeight = 6.0;   // Metros de altura de embocadura

        this.objects = [];        // Lista de elementos escenográficos en escena
        this.selectedObject = null;
        this.snapGrid = 0.25;     // Snap magnético en metros (0 para libre)
        this.isSnapEnabled = true;

        this.init();
    }

    init() {
        // 1. Escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0c10);
        this.scene.fog = new THREE.FogExp2(0x0a0c10, 0.025);

        // 2. Cámara
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(0, 4.5, 12.5);

        // 3. Renderizador WebGL de alta fidelidad
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.container.appendChild(this.renderer.domElement);

        // 4. Controles de Órbita
        this.orbitControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.maxPolarAngle = Math.PI / 2 + 0.02; // No descender bajo el piso
        this.orbitControls.minDistance = 2;
        this.orbitControls.maxDistance = 35;
        this.orbitControls.target.set(0, 1.2, 0);

        // 5. Controles de Transformación (Gizmo 3D)
        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.size = 0.85;
        this.transformControls.setTranslationSnap(this.snapGrid);
        this.transformControls.setRotationSnap(THREE.MathUtils.degToRad(15));
        this.transformControls.setScaleSnap(0.1);

        // Deshabilitar orbitControls mientras se arrastra el gizmo
        this.transformControls.addEventListener('dragging-changed', (event) => {
            this.orbitControls.enabled = !event.value;
        });

        // Actualizar inspector en tiempo real durante la manipulación
        this.transformControls.addEventListener('change', () => {
            if (this.selectedObject) {
                this.updateSelectionBox();
                if (this.onObjectChanged) {
                    this.onObjectChanged(this.selectedObject);
                }
            }
        });

        this.scene.add(this.transformControls);

        // 6. Iluminación Teatral
        this.lighting = new StageLightingManager(this.scene);

        // 7. Construcción del Espacio Teatral (Caja Negra)
        this.buildStageArchitecture();

        // 8. Resaltador de Selección (Bounding Box)
        this.selectionBox = new THREE.BoxHelper();
        this.selectionBox.material.color.setHex(0xe5a93c); // Ámbar dorado teatral
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.material.opacity = 0.9;
        this.selectionBox.visible = false;
        this.scene.add(this.selectionBox);

        // 9. Raycasting para interacción con el ratón
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.setupEventListeners();
        this.animate();
    }

    /**
     * Construye el tablado, proscenio, bambalinas y ciclorama de la Caja Negra
     */
    buildStageArchitecture() {
        this.stageGroup = new THREE.Group();
        this.stageGroup.name = 'stage_architecture';

        // Tablado de escenario
        const floorGeom = new THREE.PlaneGeometry(this.stageWidth, this.stageDepth);
        floorGeom.rotateX(-Math.PI / 2);
        
        const floorMat = new THREE.MeshStandardMaterial({
            roughness: 0.85,
            metalness: 0.1,
            map: window.proceduralTextures.createStageFloorTexture()
        });

        this.stageFloor = new THREE.Mesh(floorGeom, floorMat);
        this.stageFloor.receiveShadow = true;
        this.stageGroup.add(this.stageFloor);

        // Cuadrícula métrica sobre el tablado
        const gridHelper = new THREE.GridHelper(this.stageWidth, Math.round(this.stageWidth), 0xe5a93c, 0x272c36);
        gridHelper.position.y = 0.002;
        this.stageGroup.add(gridHelper);

        // Patas laterales negras (Bambalinones / Teatros a la italiana)
        const legMat = new THREE.MeshStandardMaterial({ color: 0x111317, roughness: 0.95 });
        const legGeom = new THREE.BoxGeometry(0.2, this.stageHeight, 1.8);
        legGeom.translate(0, this.stageHeight / 2, 0);

        const legPositions = [
            [-this.stageWidth / 2 - 0.1, -this.stageDepth * 0.3],
            [-this.stageWidth / 2 - 0.1, 0],
            [-this.stageWidth / 2 - 0.1, this.stageDepth * 0.3],
            [ this.stageWidth / 2 + 0.1, -this.stageDepth * 0.3],
            [ this.stageWidth / 2 + 0.1, 0],
            [ this.stageWidth / 2 + 0.1, this.stageDepth * 0.3]
        ];

        legPositions.forEach(pos => {
            const leg = new THREE.Mesh(legGeom, legMat);
            leg.position.set(pos[0], 0, pos[1]);
            leg.receiveShadow = true;
            this.stageGroup.add(leg);
        });

        // Bambalina superior de proscenio (Arco de embocadura)
        const headerGeom = new THREE.BoxGeometry(this.stageWidth + 1.2, 1.2, 0.3);
        headerGeom.translate(0, this.stageHeight + 0.6, this.stageDepth / 2);
        const headerMesh = new THREE.Mesh(headerGeom, legMat);
        this.stageGroup.add(headerMesh);

        // Ciclorama / Fondo del escenario
        const cycGeom = new THREE.PlaneGeometry(this.stageWidth + 2.0, this.stageHeight + 1.5);
        cycGeom.translate(0, (this.stageHeight + 1.5) / 2, -this.stageDepth / 2 - 0.1);
        const cycMat = new THREE.MeshStandardMaterial({
            color: 0x141820,
            roughness: 0.95,
            metalness: 0.0
        });
        const cyclorama = new THREE.Mesh(cycGeom, cycMat);
        cyclorama.receiveShadow = true;
        this.stageGroup.add(cyclorama);

        this.scene.add(this.stageGroup);
    }

    /**
     * Añade un nuevo elemento volumétrico a la escena
     */
    addObject(type, customOptions = {}) {
        let object = null;
        const options = {
            baseColor: customOptions.baseColor || '#c29b68',
            materialType: customOptions.materialType || 'wood',
            ...customOptions
        };

        switch (type) {
            case 'cube':
                object = StagePrimitiveFactory.createCube(options);
                break;
            case 'cylinder':
                object = StagePrimitiveFactory.createCylinder(options);
                break;
            case 'panel':
                object = StagePrimitiveFactory.createPanel(options);
                break;
            case 'ramp':
                object = StagePrimitiveFactory.createRamp(options);
                break;
            case 'platform':
                object = StagePrimitiveFactory.createPlatform(options);
                break;
            case 'stairs':
                object = StagePrimitiveFactory.createStairs(options);
                break;
            case 'mannequin':
                object = StagePrimitiveFactory.createMannequin(options);
                break;
            default:
                console.warn(`Tipo de primitiva no reconocido: ${type}`);
                return null;
        }

        // Posicionar en centro o ligeramente desplazado para no superponer
        const count = this.objects.length;
        const offsetX = (count % 4 - 1.5) * 1.4;
        const offsetZ = (Math.floor(count / 4) - 0.5) * 1.4;
        object.position.set(offsetX, 0, offsetZ);

        this.scene.add(object);
        this.objects.push(object);

        this.selectObject(object);
        return object;
    }

    /**
     * Selección de objeto en escena
     */
    selectObject(object) {
        if (this.selectedObject === object) return;

        this.selectedObject = object;

        if (object && !object.userData.isLocked) {
            this.transformControls.attach(object);
            this.selectionBox.setFromObject(object);
            this.selectionBox.visible = true;
        } else {
            this.transformControls.detach();
            this.selectionBox.visible = false;
        }

        if (this.onObjectSelected) {
            this.onObjectSelected(this.selectedObject);
        }
    }

    deselect() {
        this.selectObject(null);
    }

    updateSelectionBox() {
        if (this.selectedObject && this.selectionBox.visible) {
            this.selectionBox.setFromObject(this.selectedObject);
        }
    }

    /**
     * Duplicar el objeto seleccionado
     */
    duplicateSelected() {
        if (!this.selectedObject) return null;

        const src = this.selectedObject;
        const uData = src.userData;
        const dims = uData.dimensions;

        const newObj = this.addObject(uData.type, {
            name: `${uData.name} (Copia)`,
            width: dims.width,
            height: dims.height,
            depth: dims.depth,
            materialType: uData.materialType,
            baseColor: uData.baseColor,
            roughness: uData.roughness,
            metalness: uData.metalness,
            opacity: uData.opacity
        });

        if (newObj) {
            newObj.position.copy(src.position).add(new THREE.Vector3(0.5, 0, 0.5));
            newObj.rotation.copy(src.rotation);
            newObj.scale.copy(src.scale);
            this.selectObject(newObj);
        }

        return newObj;
    }

    /**
     * Eliminar el objeto seleccionado
     */
    deleteSelected() {
        if (!this.selectedObject) return;

        const obj = this.selectedObject;
        this.deselect();

        this.scene.remove(obj);
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }

        // Liberar geometrías y materiales
        this.disposeObject(obj);

        if (this.onObjectSelected) {
            this.onObjectSelected(null);
        }
    }

    disposeObject(obj) {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => m.dispose());
            } else {
                obj.material.dispose();
            }
        }
        if (obj.children) {
            obj.children.forEach(child => this.disposeObject(child));
        }
    }

    /**
     * Actualiza dimensiones del objeto seleccionado
     */
    updateObjectDimensions(width, height, depth) {
        if (!this.selectedObject) return;
        const obj = this.selectedObject;
        const uData = obj.userData;

        uData.dimensions = { width, height, depth };

        // Recrear geometría según el tipo
        if (uData.type === 'cube' || uData.type === 'panel') {
            if (obj.geometry) obj.geometry.dispose();
            const newGeom = new THREE.BoxGeometry(width, height, depth);
            newGeom.translate(0, height / 2, 0);
            obj.geometry = newGeom;
        } else if (uData.type === 'cylinder') {
            if (obj.geometry) obj.geometry.dispose();
            const radius = width / 2;
            const newGeom = new THREE.CylinderGeometry(radius, radius, height, 32);
            newGeom.translate(0, height / 2, 0);
            obj.geometry = newGeom;
        } else if (uData.type === 'ramp') {
            if (obj.geometry) obj.geometry.dispose();
            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.lineTo(depth, 0);
            shape.lineTo(0, height);
            shape.closePath();
            const newGeom = new THREE.ExtrudeGeometry(shape, { steps: 1, depth: width, bevelEnabled: false });
            newGeom.center();
            newGeom.rotateY(-Math.PI / 2);
            newGeom.translate(0, height / 2, 0);
            obj.geometry = newGeom;
        } else {
            // Para grupos complejos como tarimas o maniquíes, ajustar escala
            obj.scale.set(width / 2, height / 1.75, depth / 2);
        }

        this.updateSelectionBox();
    }

    /**
     * Actualiza color y material del objeto seleccionado
     */
    updateObjectMaterial(materialType, baseColor, roughness = 0.6, metalness = 0.1, opacity = 1.0) {
        if (!this.selectedObject) return;
        const obj = this.selectedObject;
        const uData = obj.userData;

        uData.materialType = materialType;
        uData.baseColor = baseColor;
        uData.roughness = roughness;
        uData.metalness = metalness;
        uData.opacity = opacity;

        const newMat = StagePrimitiveFactory.createDefaultMaterial({
            materialType,
            baseColor,
            roughness,
            metalness,
            opacity
        });

        if (obj.material) {
            obj.material = newMat;
        } else {
            // Es un grupo (recorrer hijos)
            obj.traverse(child => {
                if (child.isMesh && child.material) {
                    child.material = newMat;
                }
            });
        }

        this.updateSelectionBox();
    }

    /**
     * Cambiar modo de transformación del Gizmo
     */
    setTransformMode(mode) {
        if (['translate', 'rotate', 'scale'].includes(mode)) {
            this.transformControls.setMode(mode);
        }
    }

    /**
     * Alternar espacio del gizmo (world vs local)
     */
    toggleTransformSpace() {
        const current = this.transformControls.space;
        const next = (current === 'world') ? 'local' : 'world';
        this.transformControls.setSpace(next);
        return next;
    }

    /**
     * Configurar ajuste magnético (Snap to Grid)
     */
    setSnap(enabled, step = 0.25) {
        this.isSnapEnabled = enabled;
        this.snapGrid = step;
        if (enabled) {
            this.transformControls.setTranslationSnap(step);
            this.transformControls.setRotationSnap(THREE.MathUtils.degToRad(15));
        } else {
            this.transformControls.setTranslationSnap(null);
            this.transformControls.setRotationSnap(null);
        }
    }

    /**
     * Vistas de Cámara Teatral Predefinidas
     */
    setCameraPreset(preset) {
        const target = new THREE.Vector3(0, 1.2, 0);
        this.orbitControls.target.copy(target);

        switch (preset) {
            case 'front': // Vista Platea / Frontal
                this.camera.position.set(0, 2.4, 12.0);
                break;
            case 'top': // Vista Planta / Cenital
                this.camera.position.set(0, 16.0, 0.001);
                this.orbitControls.target.set(0, 0, 0);
                break;
            case 'side': // Vista Lateral / Hombro izquierdo
                this.camera.position.set(-11.0, 2.5, 0);
                break;
            case 'director': // Vista Cabina de Dirección (elevada frontal)
                this.camera.position.set(0, 5.0, 11.0);
                break;
            case 'iso': // Perspectiva Isométrica Libre
                this.camera.position.set(8.5, 7.0, 9.5);
                break;
        }
        this.orbitControls.update();
    }

    /**
     * Ajustar elemento al suelo (Y = 0)
     */
    snapToFloor() {
        if (!this.selectedObject) return;
        this.selectedObject.position.y = 0;
        this.updateSelectionBox();
    }

    /**
     * Captura de pantalla de alta resolución del escenario 3D
     */
    captureHighResScreenshot(callback) {
        // Deseleccionar temporalmente para no capturar el Gizmo 3D ni el BoundingBox
        const currentSelection = this.selectedObject;
        this.transformControls.detach();
        this.selectionBox.visible = false;

        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');

        // Restaurar selección
        if (currentSelection) {
            this.selectObject(currentSelection);
        }

        if (callback) callback(dataURL);
        return dataURL;
    }

    /**
     * Manejadores de eventos (Mouse Picking & Resize)
     */
    setupEventListeners() {
        const dom = this.renderer.domElement;

        // Selección por clic
        dom.addEventListener('pointerdown', (e) => {
            // Si el transformControls está activo y se hace clic en él, no deseleccionar
            if (this.transformControls.dragging) return;
        });

        dom.addEventListener('pointerup', (e) => {
            // Calcular coordenadas normalizadas
            const rect = dom.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            // Intersectar con los objetos escenográficos
            const intersects = this.raycaster.intersectObjects(this.objects, true);

            if (intersects.length > 0) {
                // Encontrar el objeto raíz de la selección
                let rootObj = intersects[0].object;
                while (rootObj.parent && rootObj.parent !== this.scene && rootObj.parent !== this.stageGroup) {
                    rootObj = rootObj.parent;
                }
                this.selectObject(rootObj);
            }
        });

        // Doble clic para deseleccionar
        dom.addEventListener('dblclick', (e) => {
            if (e.target === dom) {
                this.deselect();
            }
        });

        // Resize automático
        window.addEventListener('resize', () => this.onWindowResize());

        // Atajos de teclado
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

            switch (e.key.toLowerCase()) {
                case 'w':
                    this.setTransformMode('translate');
                    break;
                case 'e':
                    this.setTransformMode('rotate');
                    break;
                case 'r':
                    this.setTransformMode('scale');
                    break;
                case 'delete':
                case 'backspace':
                    this.deleteSelected();
                    break;
                case 'd':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.duplicateSelected();
                    }
                    break;
                case 'escape':
                    this.deselect();
                    break;
                case 'f':
                    if (this.selectedObject) {
                        this.orbitControls.target.copy(this.selectedObject.position);
                    }
                    break;
            }
        });
    }

    onWindowResize() {
        if (!this.container) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        if (width === 0 || height === 0) return;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.orbitControls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.StageManager = StageManager;
