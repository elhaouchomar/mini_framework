import { h, render } from './core.js';

export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    this.currentRoute = null;

    window.addEventListener('popstate', () => this.handleRouteChange());
    window.addEventListener('load', () => this.handleRouteChange());
  }

  navigateTo(path) {
    window.history.pushState({}, '', path);
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
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
      href: path,
      onclick: (e) => {
        e.preventDefault();
        this.navigateTo(path);
      }
    }, text);
  }
}