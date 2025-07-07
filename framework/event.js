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

    /* Direct-attach for non-reliable bubbling events */
    if (['blur', 'focus', 'focusout', 'focusin'].includes(type)) {
      const prev = el['on' + type];
      el['on' + type] = e => { if (prev) prev.call(el, e); fn.call(el, e); };
      return;                     // nothing else to delegate/store
    }

    /* Attach ONE property-hook per bubbling eventType */
    if (el !== window && el !== document && !this.rootListeners.has(type)) {
      document['on' + type] = e => this.handleDelegatedEvent(e);
      this.rootListeners.add(type);
    }

    /* Special case: root-level events that do **not** bubble */
    if ((el === window || el === document) &&
      !this.rootListeners.has('root:' + type)) {
      const prev = el['on' + type];
      el['on' + type] = e => { if (prev) prev.call(el, e); fn.call(el, e); };
      this.rootListeners.add('root:' + type);
      return;
    }

    /* Normal element → store its handler map */
    if (!el._eventId) el._eventId = this._genId();
    if (!this.handlers.has(el._eventId))
      this.handlers.set(el._eventId, new Map());
    this.handlers.get(el._eventId).set(type, fn);
  }

  off(el, type) {
    if (!el?._eventId) return;
    const map = this.handlers.get(el._eventId);
    if (map) {
      map.delete(type);
      if (!map.size) { this.handlers.delete(el._eventId); delete el._eventId; }
    }
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