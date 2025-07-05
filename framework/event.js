// Simple Event Manager with delegation
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.rootListeners = new Set();
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
    if (!element || !eventType || !handler) return;
    // 1. attach one global property-hook per *eventType*
    if (element !== document && element !== window && !this.rootListeners.has(eventType)) {
      document['on' + eventType] = (e) => this.handleDelegatedEvent(e);
      this.rootListeners.add(eventType);
    }

    // 2. special case: root-level events that never bubble (popstate, load, etc.)
    if ((element === window || element === document) && !this.rootListeners.has('root:' + eventType)) {
      const prev = element['on' + eventType];             // preserve an existing handler if any
      element['on' + eventType] = (e) => {
        if (prev) prev.call(element, e);                  // run user code first
        handler.call(element, e);
      };
      this.rootListeners.add('root:' + eventType);
      return;                                             // nothing else to record
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
    if (!element._eventId) return;

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
    if (element._eventId) {
      this.handlers.delete(element._eventId);
      delete element._eventId;
    }
  }

  // Generate unique event ID
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Setup header events
  setupHeaderEvents(store) {
    const input = document.querySelector('.new-todo');
    if (input) {
      console.log('Setting up header events for input:', input);

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
    } else {
      console.log('Header input not found');
    }
  }

  // Setup app events
  setupAppEvents(store) {
    console.log('Setting up app events...');

    const toggleAllInput = document.getElementById('toggle-all');

    if (toggleAllInput) {
      this.on(toggleAllInput, 'click', () => {
        const { todos } = store.getState();
        const shouldCompleteAll = todos.some(t => !t.completed);

        store.setState({
          ...store.getState(),
          todos: todos.map(todo => ({ ...todo, completed: shouldCompleteAll }))
        });
      });
      console.log('Toggle all event setup complete');
    } else {
      console.log('Toggle all input not found');
    }
  }

  // Setup footer events
  setupFooterEvents(store, updateFilter) {
    console.log('Setting up footer events...');

    // Filter links
    const allLink = document.querySelector('a[data-filter="all"]');
    const activeLink = document.querySelector('a[data-filter="active"]');
    const completedLink = document.querySelector('a[data-filter="completed"]');
    const clearButton = document.querySelector('.clear-completed');

    if (allLink) {
      this.on(allLink, 'click', (e) => {
        e.preventDefault();
        updateFilter('all');
      });
    }

    if (activeLink) {
      this.on(activeLink, 'click', (e) => {
        e.preventDefault();
        updateFilter('active');
      });
    }

    if (completedLink) {
      this.on(completedLink, 'click', (e) => {
        e.preventDefault();
        updateFilter('completed');
      });
    }

    if (clearButton) {
      this.on(clearButton, 'click', () => {
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.filter(t => !t.completed)
        });
      });
    }

    console.log('Footer events setup complete');
  }

  // Setup todo list events
  setupTodoListEvents(todos, store) {
    console.log('Setting up todo list events for', todos.length, 'todos');

    todos.forEach(todo => {
      this.setupTodoItemEvents(todo, store);
    });

    console.log('Todo list events setup complete');
  }

  // Setup individual todo item events
  setupTodoItemEvents(todo, store) {
    // TO be FIXED
    const todoElement = document.querySelector(`[data-todo-id="${todo.id}"]`);
    if (!todoElement) {
      console.log('Todo element not found for ID:', todo.id);
      return;
    }

    const viewDiv = todoElement.querySelector('.view');
    const toggleInput = todoElement.querySelector('.toggle');
    const label = todoElement.querySelector('label');
    const destroyButton = todoElement.querySelector('.destroy');
    const editInput = todoElement.querySelector('.edit');

    // Double click to edit
    if (viewDiv) {
      this.on(viewDiv, 'dblclick', () => {
        if (e.target.classList?.contains('toggle')) return;
        const current = store.getState();
        store.setState({ ...current, editingId: todo.id, editingValue: todo.text });
      });
    }

    // Toggle checkbox
    if (toggleInput) {
      this.on(toggleInput, 'change', () => {
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.map(t =>
            t.id === todo.id ? { ...t, completed: !t.completed } : t
          )
        });
      });
    }

    // Click label to edit
    if (label) {
      this.on(label, 'click', () => {
        this.editingState.editingId = todo.id;
        this.editingState.editValue = todo.text;
        const currentState = store.getState();
        store.setState({ ...currentState });
      });
    }

    // Delete button
    if (destroyButton) {
      this.on(destroyButton, 'click', () => {
        const currentState = store.getState();
        store.setState({
          ...currentState,
          todos: currentState.todos.filter(t => t.id !== todo.id)
        });
      });
    }

    // Edit input events
    if (editInput) {
      this.on(editInput, 'input', (e) => {
        const current = store.getState();
        store.setState({ ...current, editingValue: e.target.value });
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

  // Handle save for todo editing
  handleSave(store) {
    const { editingId, editingValue, todos } = store.getState();
    const trimmed = editingValue.trim();

    if (editingId && trimmed) {
      store.setState({
        ...store.getState(),
        todos: todos.map(t => (t.id === editingId ? { ...t, text: trimmed } : t)),
      });
    } else if (editingId && !trimmed) {
      // empty → delete (TodoMVC behaviour)
      store.setState({
        ...store.getState(),
        todos: todos.filter(t => t.id !== editingId),
      });
    }

    store.setState({ ...store.getState(), editingId: null, editingValue: '' });
  }

  // Handle cancel for todo editing
  handleCancel(store) {
    store.setState({ ...store.getState(), editingId: null, editingValue: '' });
  }

  // Initialize editing state
  editingState = {
    editingId: null,
    editValue: ''
  };
}

// Create global instance
export const events = new EventManager();