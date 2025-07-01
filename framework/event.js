// Simple Event Manager with delegation
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.setupGlobalDelegation();
  }

  setupGlobalDelegation() {
    // Common events that we'll delegate globally
    const eventTypes = [
      'click', 'dblclick', 'keydown', 'keyup', 'input',
      'change', 'blur', 'focus', 'submit'
    ];

    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, (e) => {
        this.handleDelegatedEvent(e);
      }, true);
    });
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
      this.on(toggleAllInput, 'change', () => {
        const { todos } = store.getState();
        const activeTodoCount = todos.filter(t => !t.completed).length;
        const shouldCompleteAll = activeTodoCount > 0;

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
        this.editingState.editingId = todo.id;
        this.editingState.editValue = todo.text;
        const currentState = store.getState();
        store.setState({ ...currentState });
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
        this.editingState.editValue = e.target.value;
      });

      this.on(editInput, 'keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSave(e.target.value, store);
        } else if (e.key === 'Escape') {
          this.handleCancel(store);
        }
      });

      this.on(editInput, 'blur', (e) => {
        this.handleSave(e.target.value, store);
      });
    }
  }

  // Handle save for todo editing
  handleSave(value, store) {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.map(t =>
          t.id === this.editingState.editingId ? { ...t, text: trimmedValue } : t
        )
      });
    }
    this.editingState.editingId = null;
    this.editingState.editValue = '';
    const currentState = store.getState();
    store.setState({ ...currentState });
  }

  // Handle cancel for todo editing
  handleCancel(store) {
    this.editingState.editingId = null;
    this.editingState.editValue = '';
    const currentState = store.getState();
    store.setState({ ...currentState });
  }

  // Initialize editing state
  editingState = {
    editingId: null,
    editValue: ''
  };
}

// Create global instance
export const events = new EventManager();