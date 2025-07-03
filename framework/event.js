// Simple Event Manager with delegation
class EventManager {
  constructor() {
    this.handlers = new Map();
    this.globalEventsSetup = false;
    this.setupGlobalDelegation();
  }

  setupGlobalDelegation() {
    if (this.globalEventsSetup) return;
    
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
    
    // Don't register the same event type twice
    if (!elementHandlers.has(eventType)) {
      elementHandlers.set(eventType, handler);
    }
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
    const clearButton = document.querySelector('[data-action="clear-completed"]');
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

  // Setup todo list events
  setupTodoListEvents(todos, store) {
    // Use event delegation for todo items
    const todoList = document.querySelector('.todo-list');
    if (todoList && !todoList._eventId) {
      this.on(todoList, 'click', (e) => {
        this.handleTodoListClick(e, store);
      });
      
      this.on(todoList, 'dblclick', (e) => {
        this.handleTodoListDblClick(e, store);
      });
      
      this.on(todoList, 'change', (e) => {
        this.handleTodoListChange(e, store);
      });
      
      this.on(todoList, 'keydown', (e) => {
        this.handleTodoListKeydown(e, store);
      });
      
      this.on(todoList, 'input', (e) => {
        this.handleTodoListInput(e, store);
      });
      
      this.on(todoList, 'blur', (e) => {
        this.handleTodoListBlur(e, store);
      });
    }
  }

  handleTodoListClick(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'destroy' && todoId) {
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.filter(t => t.id !== todoId)
      });
    }
  }

  handleTodoListDblClick(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'edit' && todoId) {
      const currentState = store.getState();
      const todo = currentState.todos.find(t => t.id === todoId);
      if (todo) {
        store.setState({
          ...currentState,
          editingId: todoId,
          editingValue: todo.text
        });
      }
    }
  }

  handleTodoListChange(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'toggle' && todoId) {
      const currentState = store.getState();
      store.setState({
        ...currentState,
        todos: currentState.todos.map(t =>
          t.id === todoId ? { ...t, completed: !t.completed } : t
        )
      });
    }
  }

  handleTodoListKeydown(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'edit-input' && todoId) {
      if (e.key === 'Enter') {
        this.handleSave(store);
      } else if (e.key === 'Escape') {
        this.handleCancel(store);
      }
    }
  }

  handleTodoListInput(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'edit-input' && todoId) {
      const currentState = store.getState();
      store.setState({
        ...currentState,
        editingValue: e.target.value
      });
    }
  }

  handleTodoListBlur(e, store) {
    const action = e.target.getAttribute('data-action');
    const todoId = parseInt(e.target.getAttribute('data-todo-id'));
    
    if (action === 'edit-input' && todoId) {
      this.handleSave(store);
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