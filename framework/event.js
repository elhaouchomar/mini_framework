// Enhanced event handling system
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.globalHandlers = new Map();
    this.delegatedEvents = new Set();
    this.setupGlobalDelegation();
  }

  setupGlobalDelegation() {
    // Common events that we'll delegate globally
    const delegatedEventTypes = [
      'click', 'dblclick', 'keydown', 'keyup', 'input', 
      'change', 'blur', 'focus', 'submit', 'mouseenter', 
      'mouseleave', 'mousedown', 'mouseup'
    ];

    delegatedEventTypes.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        this.handleDelegatedEvent(e);
      }, true); // Use capture phase for better performance
    });
  }

  handleDelegatedEvent(event) {
    let target = event.target;
    
    // Traverse up the DOM tree to find handlers
    while (target && target !== document) {
      const elementId = target._eventId;
      if (elementId && this.handlers.has(elementId)) {
        const elementHandlers = this.handlers.get(elementId);
        const handler = elementHandlers.get(event.type);
        
        if (handler) {
          // Call the handler with proper context
          handler.call(target, event);
          
          // Stop propagation if handler returns false
          if (handler.stopPropagation) {
            event.stopPropagation();
          }
          
          if (handler.preventDefault) {
            event.preventDefault();
          }
          
          break; // Stop looking for more handlers
        }
      }
      target = target.parentElement;
    }

    // Check for global handlers
    const globalHandler = this.globalHandlers.get(event.type);
    if (globalHandler) {
      globalHandler(event);
    }
  }onDblClick

  // Register an event handler for a specific element
  on(element, eventType, handler, options = {}) {
    if (!element._eventId) {
      element._eventId = this.generateEventId();
    }

    if (!this.handlers.has(element._eventId)) {
      this.handlers.set(element._eventId, new Map());
    }

    const elementHandlers = this.handlers.get(element._eventId);
    
    // Store handler with options
    const wrappedHandler = (event) => {
      if (options.once) {
        this.off(element, eventType);
      }
      
      if (options.condition && !options.condition(event)) {
        return;
      }
      
      return handler(event);
    };

    wrappedHandler.stopPropagation = options.stopPropagation;
    wrappedHandler.preventDefault = options.preventDefault;
    
    elementHandlers.set(eventType, wrappedHandler);
    
    return this; // For chaining
  }

  // Remove event handler
  off(element, eventType) {
    if (!element._eventId) return this;
    
    const elementHandlers = this.handlers.get(element._eventId);
    if (elementHandlers) {
      elementHandlers.delete(eventType);
      
      // Clean up if no more handlers
      if (elementHandlers.size === 0) {
        this.handlers.delete(element._eventId);
        delete element._eventId;
      }
    }
    
    return this;
  }

  // Register global event handler
  onGlobal(eventType, handler) {
    this.globalHandlers.set(eventType, handler);
    return this;
  }

  // Remove global event handler
  offGlobal(eventType) {
    this.globalHandlers.delete(eventType);
    return this;
  }

  // Emit custom events
  emit(element, eventType, detail = {}) {
    const customEvent = new CustomEvent(eventType, {
      detail,
      bubbles: true,
      cancelable: true
    });
    
    element.dispatchEvent(customEvent);
    return this;
  }

  // Helper method to handle common patterns
  onClick(element, handler, options = {}) {
    return this.on(element, 'click', handler, options);
  }

  onKeyDown(element, handler, options = {}) {
    return this.on(element, 'keydown', handler, options);
  }

  onInput(element, handler, options = {}) {
    return this.on(element, 'input', handler, options);
  }

  onChange(element, handler, options = {}) {
    return this.on(element, 'change', handler, options);
  }

  onSubmit(element, handler, options = {}) {
    return this.on(element, 'submit', handler, { preventDefault: true, ...options });
  }

  onDoubleClick(element, handler, options = {}) {
    return this.on(element, 'dblclick', handler, options);
  }

  onBlur(element, handler, options = {}) {
    return this.on(element, 'blur', handler, options);
  }

  onFocus(element, handler, options = {}) {
    return this.on(element, 'focus', handler, options);
  }

  // Utility method to handle Enter key specifically
  onEnterKey(element, handler, options = {}) {
    return this.onKeyDown(element, (e) => {
      if (e.key === 'Enter') {
        handler(e);
      }
    }, options);
  }

  // Utility method to handle Escape key specifically
  onEscapeKey(element, handler, options = {}) {
    return this.onKeyDown(element, (e) => {
      if (e.key === 'Escape') {
        handler(e);
      }
    }, options);
  }

  // Clean up all handlers for an element
  cleanupElement(element) {
    if (element._eventId) {
      this.handlers.delete(element._eventId);
      delete element._eventId;
    }
    return this;
  }

  // Generate unique event ID
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Method to handle form validation
  onValidSubmit(element, validator, handler, options = {}) {
    return this.onSubmit(element, (e) => {
      if (validator(e.target)) {
        handler(e);
      }
    }, options);
  }
}

// Create global instance
export const events = new EventManager();

// Export for custom instances if needed
export { EventManager };