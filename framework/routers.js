import { h, render, events } from './core.js';

export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.currentRoute = null;

    // Listen for hash changes
    events.on(window, 'hashchange', () => this.handleRouteChange());
    events.on(window, 'load', () => this.handleRouteChange());
  }

  getHash() {
    let hash = window.location.hash.slice(2) || '/';
    return hash === '/' ? 'all' : hash;
  }

  navigateTo(path) {
    window.location.hash = '/' + (path === 'all' ? '' : path);
  }

  handleRouteChange() {
    const path = this.getHash();
    const route = this.routes.find(r => r.path === path) || 
                 this.routes.find(r => r.path === '*');

    if (route && route !== this.currentRoute) {
      this.currentRoute = route;
      render(route.component(), this.rootElement);
    }
  }

  link(path, text, attrs = {}) {
    return h('a', {
      ...attrs,
      href: '#/' + (path === 'all' ? '' : path),
      onclick: (e) => {
        e.preventDefault();
        this.navigateTo(path);
      }
    }, text);
  }
}