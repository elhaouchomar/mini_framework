// Simple Event Manager with delegation
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.globalEventsSetup = false;
    this.setupGlobalDelegation();
  }

  setupGlobalDelegation() {
    if (this.globalEventsSetup) return;
    
    // We'll use the framework's own event system instead of addEventListener
    this.globalEventsSetup = true;
  }

  handleDelegatedEvent(event) {
    let target = event.target;

    // Find the element with an event handler
    while (target && target !== document) {
      const elementId = target._eventId;
      if (elementId && this.handlers.has(elementId)) {
        const elementHandlers = this.handlers.get(elementId);
        const handler = elementHandlers.get(event.type);

        if (handler) {
          handler.call(target, event);
          break;
        }
      }
      target = target.parentElement;
    }
  }

  // Register an event handler for a specific element
  on(element, eventType, handler) {
    if (!element || !eventType || !handler) {
      return;
    }

    if (!element._eventId) {
      element._eventId = this.generateEventId();
    }

    if (!this.handlers.has(element._eventId)) {
      this.handlers.set(element._eventId, new Map());
    }

    const elementHandlers = this.handlers.get(element._eventId);
    elementHandlers.set(eventType, handler);
  }

  // Remove event handler
  off(element, eventType) {
    if (!element || !element._eventId) return;

    const elementHandlers = this.handlers.get(element._eventId);
    if (elementHandlers) {
      elementHandlers.delete(eventType);

      // Clean up if no more handlers
      if (elementHandlers.size === 0) {
        this.handlers.delete(element._eventId);
        delete element._eventId;
      }
    }
  }

  // Clean up all handlers for an element
  cleanupElement(element) {
    if (!element || !element._eventId) return;
    
    this.handlers.delete(element._eventId);
    delete element._eventId;
    
    // Also clean up child elements
    if (element.children) {
      Array.from(element.children).forEach(child => {
        this.cleanupElement(child);
      });
    }
  }

  // Generate unique event ID
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup header events
  setupHeaderEvents(store) {
    const input = document.querySelector('.new-todo');
    if (input && !input._eventId) {
      const handleNewTodo = (e) => {
        if (e.key === 'Enter') {
          const value = e.target.value.trim();
          if (value) {
            const newTodo = {
              id: Date.now(),
              text: value,
              completed: false
            };
            const currentState = store.getState();
            store.setState({
              ...currentState,
              todos: [...currentState.todos, newTodo]
            });
            e.target.value = '';
          }
        }
      };

      this.on(input, 'keydown', handleNewTodo);
    }
  }

  // Setup app events
  setupAppEvents(store) {
    const toggleAllInput = document.getElementById('toggle-all');

    if (toggleAllInput && !toggleAllInput._eventId) {
      this.on(toggleAllInput, 'change', (e) => {
        const { todos } = store.getState();
        const shouldCompleteAll = e.target.checked;

        store.setState({
          ...store.getState(),
          todos: todos.map(todo => ({ ...todo, completed: shouldCompleteAll }))
        });
      });
    }
  }

  // Setup footer events
  setupFooterEvents(store, updateFilter) {
    // Filter links
    const filterLinks = document.querySelectorAll('a[data-filter]');
    
    filterLinks.forEach(link => {
      if (!link._eventId) {
        const filter = link.getAttribute('data-filter');
        
        this.on(link, 'click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          updateFilter(filter);
        });
      }
    });

    // Clear completed button
    const clearButton = document.querySelector('.clear-completed');
    if (clearButton && !clearButton._eventId) {
      this.on(clearButton, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.filter(t => !t.completed)
        });
      });
    }
  }

  // Setup todo list events with proper delegation
  setupTodoListEvents(todos, store) {
    // Set up individual todo item events
    todos.forEach(todo => {
      this.setupTodoItemEvents(todo, store);
    });
  }

  // Setup individual todo item events
  setupTodoItemEvents(todo, store) {
    const todoElement = document.querySelector(`[data-todo-id="${todo.id}"]`);
    if (!todoElement) return;

    // Toggle checkbox
    const toggleInput = todoElement.querySelector('.toggle');
    if (toggleInput && !toggleInput._eventId) {
      this.on(toggleInput, 'change', (e) => {
        e.stopPropagation();
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        });
      });
    }

    // Edit on double click
    const label = todoElement.querySelector('label');
    if (label && !label._eventId) {
      this.on(label, 'dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentState = store.getState();
        store.setState({
          ...currentState,
          editingId: todo.id,
          editingValue: todo.text
        });
      });
    }

    // Delete button
    const destroyButton = todoElement.querySelector('.destroy');
    if (destroyButton && !destroyButton._eventId) {
      this.on(destroyButton, 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.filter(t => t.id !== todo.id)
        });
      });
    }

    // Edit input events
    const editInput = todoElement.querySelector('.edit');
    if (editInput && !editInput._eventId) {
      this.on(editInput, 'input', (e) => {
        const currentState = store.getState();
        store.setState({
          ...currentState,
          editingValue: e.target.value
        });
      });

      this.on(editInput, 'keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSave(store);
        } else if (e.key === 'Escape') {
          this.handleCancel(store);
        }
      });

      this.on(editInput, 'blur', () => {
        this.handleSave(store);
      });
    }
  }

  handleSave(store) {
    const { editingId, editingValue, todos } = store.getState();
    const trimmedValue = editingValue.trim();

    if (editingId && trimmedValue) {
      store.setState({
        ...store.getState(),
        todos: todos.map(t =>
          t.id === editingId ? { ...t, text: trimmedValue } : t
        ),
        editingId: null,
        editingValue: '',
      });
    } else if (editingId && !trimmedValue) {
      // If empty, delete the todo (TodoMVC behavior)
      store.setState({
        ...store.getState(),
        todos: todos.filter(t => t.id !== editingId),
        editingId: null,
        editingValue: '',
      });
    } else {
      // Cancel editing
      store.setState({
        ...store.getState(),
        editingId: null,
        editingValue: '',
      });
    }
  }

  handleCancel(store) {
    store.setState({
      ...store.getState(),
      editingId: null,
      editingValue: '',
    });
  }
}

// Create global instance
export const events = new EventManager();