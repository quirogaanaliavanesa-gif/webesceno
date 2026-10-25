/**
 * Gestor de Estado Central (State Management)
 * Mantiene la reactividad y persistencia del proyecto escenográfico y de vestuario.
 */
class AppState {
    constructor() {
        this.project = {
            id: 'proj_' + Date.now(),
            title: 'Proyecto Escénico: La Vida es Sueño',
            author: 'Diseño Escenográfico y Vestuario',
            theaterType: 'caja_negra', // 'caja_negra', 'italiana', 'arena', 'alternativa'
            stageDimensions: { width: 12.0, depth: 10.0, height: 6.0 },
            createdAt: new Date().toISOString()
        };

        this.currentView = 'stage3d'; // 'stage3d', 'costume2d', 'synthesis', 'dossier'
        this.subscribers = new Map();

        // Cargar desde LocalStorage si existe
        this.loadFromStorage();
    }

    subscribe(event, callback) {
        if (!this.subscribers.has(event)) {
            this.subscribers.set(event, []);
        }
        this.subscribers.get(event).push(callback);
    }

    emit(event, data) {
        if (this.subscribers.has(event)) {
            this.subscribers.get(event).forEach(cb => cb(data));
        }
    }

    setView(viewName) {
        this.currentView = viewName;
        this.emit('viewChanged', viewName);
    }

    setProjectTitle(title) {
        this.project.title = title;
        this.saveToStorage();
        this.emit('projectUpdated', this.project);
    }

    saveToStorage() {
        try {
            localStorage.setItem('webesceno_project_meta', JSON.stringify(this.project));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage', e);
        }
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem('webesceno_project_meta');
            if (data) {
                this.project = Object.assign(this.project, JSON.parse(data));
            }
        } catch (e) {
            console.warn('Error leyendo de localStorage', e);
        }
    }
}

window.appState = new AppState();
