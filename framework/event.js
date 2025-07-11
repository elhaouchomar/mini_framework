export class EventManager {
  constructor() {
    this.handlers = new Map(); // elementId ➜ Map(eventType ➜ handler)
    this.rootListeners = new Set(); // eventType already delegated?
  }

  /* Delegation root → bubbles up until matching _eventId */
  handleDelegatedEvent(e) {
    let node = e.target;
    while (node && node !== document) {
      const id = node._eventId;
      if (id && this.handlers.has(id)) {
        const map = this.handlers.get(id);
        const fn = map.get(e.type);
        if (fn) { fn.call(node, e); return; }
      }
      node = node.parentElement;
    }
  }

  /* Public helpers ------------------------------------------------ */
  on(el, type, fn) {
    if (!el || !type || !fn) return;
    el["on" + type] = fn
  }


  cleanupElement(el) {               // called by the VDOM diff on removal
    if (el?._eventId) {
      this.handlers.delete(el._eventId);
      delete el._eventId;
    }
  }

  /* -------------------------------------------------------------- */
  _genId() {
    return `ev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }
}

export const events = new EventManager();