class SimpleRouter {
    constructor() {
        this.routes = {
            'Página inicial': { page: 'pagina-inicial.html', js: 'pagina-inicial.js', css: 'pagina-inicial.css' },
            'Escalas ordinárias': { page: 'escalas-ordinarias.html', js: 'escalas-ordinarias.js', css: 'escalas-ordinarias.css' },
            'Guarnições': { page: 'guarnicoes.html', js: 'guarnicoes.js', css: 'guarnicoes.css' },
            'Viaturas': { page: 'viaturas.html', js: 'viaturas.js' },
            'Escalas extrajornadas': { page: 'escalas-extrajornadas.html', js: 'escalas-extrajornadas.js' },
            'Escalas sobreaviso': { page: 'escalas-sobreaviso.html', js: 'escalas-sobreaviso.js' },
            'Trocas de escalas': { page: 'trocas-escalas.html', js: 'trocas-escalas.js' },
            'Folgas': { page: 'folgas.html', js: 'folgas.js' },
            'Efetivo': { page: 'efetivo.html', js: 'efetivo.js', css: 'efetivo.css' },
            'Feriados': { page: 'feriados.html', js: 'feriados.js' },
            'Férias': { page: 'ferias.html', js: 'ferias.js' }
        };
        this.currentRoute = null;
        this.contentArea = null;
        this.loadedStyles = new Set();
        this.init();
    }
    init() {
        this.contentArea = document.getElementById('content-area');
        if (this.supportsHistoryAPI()) {
            this.initHistoryAPI();
        } else {
            this.initHashRouting();
        }
    }
    supportsHistoryAPI() {
        return !!(window.history && window.history.pushState) && !this.isLocalFile();
    }
    isLocalFile() {
        return window.location.protocol === 'file:';
    }
    initHistoryAPI() {
        window.addEventListener('popstate', (e) => {
            const route = e.state?.route || this.getRouteFromPath();
            if (route && this.routes[route]) {
                this.loadPage(route, false);
            }
        });
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const initialRoute = this.getRouteFromPath();
                this.loadPage(initialRoute, true);
            });
        } else {
            const initialRoute = this.getRouteFromPath();
            this.loadPage(initialRoute, true);
        }
    }
    initHashRouting() {
        window.addEventListener('hashchange', () => {
            const route = this.getRouteFromHash();
            if (route && this.routes[route]) {
                this.loadPage(route, false);
            }
        });
        // Aguardar o DOM estar pronto antes de carregar a página inicial
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const initialRoute = this.getRouteFromHash();
                if (initialRoute && this.routes[initialRoute]) {
                    this.loadPage(initialRoute, false);
                }
            });
        } else {
            const initialRoute = this.getRouteFromHash();
            if (initialRoute && this.routes[initialRoute]) {
                this.loadPage(initialRoute, false);
            }
        }
    }
    getRouteFromPath() {
        const path = window.location.pathname;
        const routeMap = {
            '/navegacao/main.html': 'Página inicial',
            '/': 'Página inicial',
            '/efetivo': 'Efetivo',
            '/escalas-ordinarias': 'Escalas ordinárias',
            '/guarnicoes': 'Guarnições',
            '/viaturas': 'Viaturas',
            '/escalas-extrajornadas': 'Escalas extrajornadas',
            '/escalas-sobreaviso': 'Escalas sobreaviso',
            '/trocas-escalas': 'Trocas de escalas',
            '/folgas': 'Folgas',
            '/feriados': 'Feriados',
            '/ferias': 'Férias'
        };
        return routeMap[path] || 'Página inicial';
    }
    getRouteFromHash() {
        const hash = window.location.hash.slice(1);
        const routeMap = {
            'pagina-inicial': 'Página inicial',
            'efetivo': 'Efetivo',
            'escalas-ordinarias': 'Escalas ordinárias',
            'guarnicoes': 'Guarnições',
            'viaturas': 'Viaturas',
            'escalas-extrajornadas': 'Escalas extrajornadas',
            'escalas-sobreaviso': 'Escalas sobreaviso',
            'trocas-escalas': 'Trocas de escalas',
            'folgas': 'Folgas',
            'feriados': 'Feriados',
            'ferias': 'Férias'
        };
        return routeMap[hash] || 'Página inicial';
    }
    navigateTo(routeName) {
        if (!this.routes[routeName]) return;
        if (this.supportsHistoryAPI()) {
            const urlMap = {
                'Página inicial': '/',
                'Efetivo': '/efetivo',
                'Escalas ordinárias': '/escalas-ordinarias',
                'Guarnições': '/guarnicoes',
                'Viaturas': '/viaturas',
                'Escalas extrajornadas': '/escalas-extrajornadas',
                'Escalas sobreaviso': '/escalas-sobreaviso',
                'Trocas de escalas': '/trocas-escalas',
                'Folgas': '/folgas',
                'Feriados': '/feriados',
                'Férias': '/ferias'
            };
            const url = urlMap[routeName];
            window.history.pushState({ route: routeName }, '', url);
        } else {
            const hashMap = {
                'Página inicial': '#pagina-inicial',
                'Efetivo': '#efetivo',
                'Escalas ordinárias': '#escalas-ordinarias',
                'Guarnições': '#guarnicoes',
                'Viaturas': '#viaturas',
                'Escalas extrajornadas': '#escalas-extrajornadas',
                'Escalas sobreaviso': '#escalas-sobreaviso',
                'Trocas de escalas': '#trocas-escalas',
                'Folgas': '#folgas',
                'Feriados': '#feriados',
                'Férias': '#ferias'
            };
            window.location.hash = hashMap[routeName];
        }
        this.loadPage(routeName, true);
    }
    async loadPage(routeName, updateHistory = true) {
        if (this.currentRoute === routeName) return;
        const route = this.routes[routeName];
        if (!route) return;
        try {
            if (this.contentArea) {
                this.contentArea.innerHTML = '<div class="loading">Carregando...</div>';
            }
            const htmlResponse = await fetch(`navegacao/${route.page}`);
            if (!htmlResponse.ok) throw new Error(`Erro ao carregar ${route.page}`);
            const htmlContent = await htmlResponse.text();
            if (this.contentArea) {
                this.contentArea.innerHTML = htmlContent;
            }
            if (route.css) {
                await this.loadStyle(`css/${route.css}`);
            }
            if (route.js) {
                await this.loadScript(`js/${route.js}`);
            }
            this.currentRoute = routeName;
            this.updateSidebarActive(routeName);
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            if (this.contentArea) {
                this.contentArea.innerHTML = `
                    <div class="error-page">
                        <h2>Erro ao carregar página</h2>
                        <p>Não foi possível carregar a página "${routeName}".</p>
                        <p class="error-details">${error.message}</p>
                    </div>
                `;
            }
        }
    }
    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const existingScript = document.querySelector(`script[src="${src}"]`);
            if (existingScript) {
                existingScript.remove();
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    async loadStyle(src) {
        return new Promise((resolve, reject) => {
            // Não recarregar se já foi carregado
            if (this.loadedStyles.has(src)) {
                resolve();
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            link.onload = () => {
                this.loadedStyles.add(src);
                resolve();
            };
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
    updateSidebarActive(routeName) {
        const buttons = document.querySelectorAll('.sidebar-button');
        buttons.forEach(btn => btn.classList.remove('active'));
        const activeButton = document.querySelector(`[data-menu="${routeName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }
}
