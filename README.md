# WEBESCENO · Plataforma de Prototipado Rápido Escenográfico 3D y Vestuario

Plataforma web interactiva profesional diseñada para directores de escena, escenógrafos, vestuaristas y diseñadores teatrales. Permite prototipar, simular y evaluar en tiempo real el espacio escenográfico y las propuestas de vestuario sobre figurines, generando fichas técnicas y dossieres de producción.

---

## 🎭 Módulos Principales de la Plataforma

### 1. Módulo de Simulación Escenográfica 3D (`Espacio Escenográfico 3D`)
- **Espacio Teatral Virtual (Caja Negra)**: Escenario configurable de 12x10x6m con tablado métrico, marcas de centro de escena, patas negras laterales (calles) y ciclorama de fondo.
- **Cuerpos Volumétricos Teatrales**:
  * 🔲 **Cubo / Prisma Practicable**: Cajas y elevaciones modulares practicables.
  * 🪜 **Tarima Escénica Elevada**: Tableros de madera con patas de hierro estructural.
  * 🪜 **Escalera Modular**: 3 a 5 peldaños con proporciones huella/contrahuella escénicas.
  * 🖼️ **Bastidor / Panel Escénico**: Paredes y fondos con bastidor perimetral.
  * 📐 **Rampa / Plano Inclinado**: Cuña geométrica para desniveles escénicos.
  * 🔘 **Columna Cilíndrica**: Pilares y elementos de arquitectura clásica/moderna.
  * 🧍 **Figurín / Actor 3D a Escala Humana (1.75m)**: Referencia antropométrica inmediata en escena.
- **Manipulación Interactiva 3D**:
  * Gizmo de transformación interactivo con modos **Mover (W)**, **Rotar (E)** y **Escalar (R)**.
  * Ajuste magnético a la cuadrícula (**Snap to Grid**: 0.25m, 0.50m, 1.00m).
  * Atajos de teclado: `W`, `E`, `R`, `Ctrl+D` (duplicar), `Supr` (eliminar), `F` (enfocar), `Esc` (deseleccionar).
- **Panel de Control Lateral (Inspector 3D)**:
  * Dimensiones físicas exactas en **metros** (Ancho X, Alto Y, Profundidad Z).
  * Posición y giro escénico.
  * Selector de color RGB / HEX con paleta de gelatinas teatrales (Ámbar Lee, Azul noche, Carmesí, etc.).
  * Materialidades procedurales simuladas: **Madera**, **Metal**, **Tela/Terciopelo**, **Ladrillo**, **Hormigón**, **Malla/Estructura** y **Neón Emisivo**.
  * Controles de rugosidad, metalicidad y opacidad.
- **Parrilla de Iluminación y Cámaras**:
  * Vistas predefinidas: **Platea / Frontal**, **Planta / Cenital**, **Lateral**, **Director** y **Órbita Libre**.
  * Presets lumínicos: Caja Negra Equilibrada, Ensayo Cálido (Tungsteno), Claroscuro Expresionista, Foco Cenital Dramático y Atardecer.

---

### 2. Módulo de Diseño de Vestuario sobre Figurines (`Taller de Vestuario 2D`)
- **Siluetas Anatómicas Teatrales (Proporción 9 Cabezas)**:
  * Figurín Femenino en pose teatral elegante.
  * Figurín Masculino en pose erguida dramática.
  * Figurín Andrógino / Neutral de línea pura.
- **Catálogo Modular de Prendas Teatrales**:
  * 🎩 **Sombreros & Tocados**: Sombrero de copa alta, corona real con gemas, birretes.
  * 🧥 **Abrigos & Capas**: Capa larga con vuelo amplio, chaqueta militar / frac con faldón.
  * 👔 **Prendas Superiores**: Camisa de época con chorrera y volados, corsé renacentista con varillas.
  * 👖 **Prendas Inferiores**: Pantalones sastre rectos con raya planchada, falda acampanada con amplio vuelo.
  * 👗 **Vestidos Completos**: Vestido largo de gala con can-can y cenefa ornamental.
  * 👢 **Calzado**: Botas altas de montar/bucanero con hebillas doradas.
  * 🧣 **Accesorios**: Gorguera / golilla renacentista de cuello, fajín de gala con flecos.
- **Sistema de Capas Textiles (Z-Index)**:
  * Reordenamiento de prendas por capas (subir/bajar nivel).
  * Toggle de visibilidad independiente (ojo).
  * Regulación de opacidad y escala de tejido.
- **Motor Procedural de Telas (Fabric Engine)**:
  * 🌾 **Algodón / Lino**: Hilado orgánico mate.
  * ✨ **Seda / Satén**: Brillo especular y lustroso diagonal.
  * 🐂 **Cuero / Vinilo**: Grano curtido celular denso.
  * 👖 **Jean / Denim**: Sarga diagonal de 45° twill weave.
  * 🌫️ **Gasa / Voile**: Semitransparencia etérea (40-60%).
  * 🍷 **Terciopelo Teatral**: Pelo profundo con borde iluminado.
  * ⚜️ **Brocado / Damasco**: Motivos ornamentales barrocos dorados.
  * 🪩 **Lentejuela / Metalizado**: Malla de discos reflectivos brillantes.
- **Sincronización 2D -> 3D**:
  * Botón **"Proyectar Vestuario en Escenario 3D"**: Aplica instantáneamente la paleta de color y estilo del figurín al actor/maniquí del escenario virtual.

---

### 3. Módulo de Síntesis y Armonía Visual (`Síntesis & Armonía`)
- **Comparativa Lado a Lado**: Visualización sincrónica del espacio escenográfico 3D y la lámina de vestuario 2D.
- **Extractor de Paletas Cromáticas**: Desglose automático de colores dominantes de la escenografía y del vestuario.
- **Analizador de Contraste y Legibilidad Escénica**:
  * Cálculo algorítmico del ratio de contraste entre la vestimenta del personaje y el decorado.
  * Diagnóstico en tres niveles: *Excelente Contraste (actor recorta nítidamente)*, *Armonía Moderada*, o *Bajo Contraste (riesgo de camuflaje contra el fondo)*.
  * Recomendaciones directas de dirección de arte e iluminación escénica.

---

### 4. Dossier Técnico de Producción (`Dossier Técnico & Rider`)
- **Ficha Maestra de Producción**: Título de la obra, autor, fecha y dimensiones del teatro.
- **Láminas de Presentación de Alta Calidad**: Capturas automáticas del escenario 3D y del figurín 2D.
- **Tabla de Carpintería y Cuerpos Escenográficos**:
  * Código (`ESC-01`, `ESC-02`...), Elemento, Ancho x Alto x Profundidad (m), Volumen (m³), Material, Tinte y Coordenadas relativas en metros.
- **Tabla de Sastrería Teatral**:
  * Código (`VES-01`...), Pieza, Categoría, Textura textil asignada, Colorimetría HEX, Opacidad y notas para taller de confección.
- **Parrilla de Iluminación Teatral**: Criterios de proscenio, calles laterales, contraluz y foco cenital.
- **Firmas de Aprobación**: Bloque para dirección escénica, escenografía, vestuario y dirección técnica.
- **Exportación Versátil**:
  * 🖨️ **Imprimir / Guardar en PDF** (optimizado con hoja de estilos `@media print`).
  * 📸 **Guardar Captura 3D (.png)** en alta resolución.
  * 👗 **Guardar Lámina de Vestuario (.png)**.
  * 💾 **Guardar Archivo de Proyecto (.webesceno JSON)** para compartir con el equipo.
  * 📂 **Importar Archivo JSON** para reanudar el proyecto en cualquier navegador.

---

## 🚀 Cómo Iniciar la Aplicación

### Opción 1: Ejecutar el Servidor Local (Recomendado)
Haz doble clic sobre el archivo:
```
start-server.bat
```
O desde PowerShell en esta carpeta:
```powershell
.\server.ps1 -Port 8080
```
Y abre tu navegador web en: **`http://localhost:8080/`**

### Opción 2: Abrir Directamente en el Navegador
También puedes hacer doble clic en **`index.html`** para abrirlo en Chrome, Edge u Opera sin necesidad de servidor externo, ya que las librerías Three.js se encuentran incorporadas localmente en la carpeta `vendor/`.

---

## 📁 Estructura del Código Fuente

```
WEBESCENO/
├── index.html                   # Interfaz principal semántica
├── start-server.bat             # Lanzador rápido para Windows
├── server.ps1                   # Servidor HTTP estático nativo PowerShell
├── README.md                    # Documentación del proyecto
├── css/
│   ├── style.css                # Sistema de diseño teatral dark mode
│   ├── costume.css              # Estilos del taller de vestuario y capas
│   └── dossier.css              # Estilos de síntesis, rider y print PDF
├── js/
│   ├── app.js                   # Orquestador y bootstrap de la app
│   ├── state.js                 # Manejador reactivo de estado y almacenamiento
│   ├── three/
│   │   ├── stageManager.js      # Escena 3D, cámaras, TransformControls y picking
│   │   ├── stagePrimitives.js   # Generador paramétrico de cuerpos volumétricos
│   │   ├── stageLighting.js     # Iluminación de proscenio, cenitales y presets
│   │   └── proceduralTextures.js# Generador de texturas de madera, metal, ladrillo, tela
│   ├── costume/
│   │   ├── figurineStudio.js    # Lienzo 2D interactivo y gestor de capas
│   │   ├── garmentLibrary.js    # Catálogo de prendas y siluetas (9 cabezas)
│   │   └── fabricTextures.js    # Motor de texturas visuales de telas
│   └── ui/
│       ├── stageInspector.js    # Panel lateral de propiedades del objeto 3D
│       ├── costumeInspector.js  # Panel lateral de vestuario y capas
│       ├── synthesisView.js     # Analizador de armonía y contraste visual
│       └── dossierExporter.js   # Generador de dossier técnico y exportaciones
└── vendor/
    ├── three.min.js             # Three.js r128
    ├── OrbitControls.js         # Controles orbitales
    └── TransformControls.js     # Gizmo 3D (Traslación, Rotación, Escala)
```
