/**
 * Sistema de Iluminación Teatral para Three.js
 * Configura parrillas de luces, spots de proscenio, cenitales y contraluces.
 */
class StageLightingManager {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
        this.currentPreset = 'classic';
        this.init();
    }

    init() {
        // 1. Luz Ambiental base (suave para no aplanar el volumen dramático)
        const ambient = new THREE.AmbientLight(0x222630, 0.4);
        this.scene.add(ambient);
        this.lights.ambient = ambient;

        // 2. Luz de Proscenio Principal (Key Light frontal cálida 3200K)
        const keyLight = new THREE.DirectionalLight(0xffecd1, 0.85);
        keyLight.position.set(0, 10, 14);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 35;
        keyLight.shadow.camera.left = -12;
        keyLight.shadow.camera.right = 12;
        keyLight.shadow.camera.top = 12;
        keyLight.shadow.camera.bottom = -4;
        keyLight.shadow.bias = -0.0005;
        this.scene.add(keyLight);
        this.lights.keyLight = keyLight;

        // 3. Luz de Relleno Lateral (Calle lateral izquierda - fría 5400K)
        const fillLight = new THREE.DirectionalLight(0x8ec5fc, 0.4);
        fillLight.position.set(-10, 8, 4);
        this.scene.add(fillLight);
        this.lights.fillLight = fillLight;

        // 4. Contraluz Teatral (Backlight para separar siluetas del fondo negro)
        const backLight = new THREE.DirectionalLight(0xffe4b5, 0.5);
        backLight.position.set(0, 9, -10);
        this.scene.add(backLight);
        this.lights.backLight = backLight;

        // 5. Foco Cenital Teatral (Spotlight cenital dramático con cono de penumbra)
        const spotLight = new THREE.SpotLight(0xffffff, 1.2, 25, Math.PI / 5, 0.45, 1);
        spotLight.position.set(0, 11, 0);
        spotLight.target.position.set(0, 0, 0);
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        this.scene.add(spotLight);
        this.scene.add(spotLight.target);
        this.lights.spotLight = spotLight;
    }

    /**
     * Aplica un ambiente lumínico predefinido
     */
    applyPreset(presetName) {
        this.currentPreset = presetName;
        switch (presetName) {
            case 'classic': // Caja Negra Teatral Equilibrada
                this.lights.ambient.color.setHex(0x222630);
                this.lights.ambient.intensity = 0.4;
                this.lights.keyLight.color.setHex(0xffecd1);
                this.lights.keyLight.intensity = 0.85;
                this.lights.fillLight.color.setHex(0x8ec5fc);
                this.lights.fillLight.intensity = 0.35;
                this.lights.backLight.color.setHex(0xffe4b5);
                this.lights.backLight.intensity = 0.5;
                this.lights.spotLight.intensity = 0.8;
                this.lights.spotLight.color.setHex(0xffffff);
                break;

            case 'warm': // Ensayo Cálido / Tungsteno
                this.lights.ambient.color.setHex(0x3d281a);
                this.lights.ambient.intensity = 0.6;
                this.lights.keyLight.color.setHex(0xffb86c);
                this.lights.keyLight.intensity = 1.0;
                this.lights.fillLight.color.setHex(0xf39c12);
                this.lights.fillLight.intensity = 0.45;
                this.lights.backLight.color.setHex(0xf1c40f);
                this.lights.backLight.intensity = 0.6;
                this.lights.spotLight.intensity = 0.5;
                break;

            case 'expressionist': // Claroscuro Expresionista / Frío
                this.lights.ambient.color.setHex(0x0a1018);
                this.lights.ambient.intensity = 0.15;
                this.lights.keyLight.color.setHex(0xdbeafe);
                this.lights.keyLight.intensity = 1.2;
                this.lights.fillLight.color.setHex(0x1e3a8a);
                this.lights.fillLight.intensity = 0.2;
                this.lights.backLight.color.setHex(0x38bdf8);
                this.lights.backLight.intensity = 0.9;
                this.lights.spotLight.intensity = 1.4;
                this.lights.spotLight.color.setHex(0x93c5fd);
                break;

            case 'spotlight': // Foco Cenital Solista Dramático
                this.lights.ambient.color.setHex(0x05070a);
                this.lights.ambient.intensity = 0.1;
                this.lights.keyLight.intensity = 0.15;
                this.lights.fillLight.intensity = 0.05;
                this.lights.backLight.intensity = 0.2;
                this.lights.spotLight.intensity = 2.2;
                this.lights.spotLight.color.setHex(0xfff8ee);
                break;

            case 'sunset': // Tonalidad Gualda / Crepúsculo
                this.lights.ambient.color.setHex(0x2d121c);
                this.lights.ambient.intensity = 0.35;
                this.lights.keyLight.color.setHex(0xf97316);
                this.lights.keyLight.intensity = 1.1;
                this.lights.fillLight.color.setHex(0xa855f7);
                this.lights.fillLight.intensity = 0.4;
                this.lights.backLight.color.setHex(0xfacc15);
                this.lights.backLight.intensity = 0.8;
                this.lights.spotLight.intensity = 0.7;
                break;
        }
    }

    setSpotLightColor(hexColor) {
        if (this.lights.spotLight) {
            this.lights.spotLight.color.set(hexColor);
        }
    }

    setKeyLightIntensity(val) {
        if (this.lights.keyLight) {
            this.lights.keyLight.intensity = val;
        }
    }
}

window.StageLightingManager = StageLightingManager;
