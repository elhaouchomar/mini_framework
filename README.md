# 🚀 Mini Framework Documentation

A lightweight JavaScript framework with Virtual DOM, event delegation, and state management - inspired by React but built from scratch.

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Components](#components)
- [State Management](#state-management)
- [Event Handling](#event-handling)
- [Routing](#routing)
- [Examples](#examples)
- [Best Practices](#best-practices)

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mini_framework.git
cd mini_framework

# No build process required - just include the framework files
```

## ⚡ Quick Start

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App</title>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import { h, render } from './framework/core.js';
        import { store } from './framework/store.js';
        
        // Create a simple component
        const App = () => {
            return h('div', { class: 'app' }, [
                h('h1', {}, 'Hello World!'),
                h('button', {
                    onClick: () => alert('Clicked!')
                }, 'Click me')
            ]);
        };
        
        // Render the app
        render(App(), document.getElementById('app'));
    </script>
</body>
</html>
```

---

## 🧠 Core Concepts

### Virtual DOM
The framework uses a Virtual DOM for efficient updates. Instead of directly manipulating the DOM, you create virtual representations of your UI.

### Event Delegation
All events are handled through a centralized event delegation system, similar to React's synthetic events.

### State Management
A simple but powerful state management system with subscriptions for reactive updates.

---

## 📚 API Reference

### Core Functions

#### `h(tag, attrs, children)`
Creates a virtual DOM element (similar to React's `createElement`).

```javascript
import { h } from './framework/core.js';

// Basic element
h('div', { class: 'container' }, 'Hello World');

// Element with children
h('div', { class: 'parent' }, [
    h('h1', {}, 'Title'),
    h('p', {}, 'Content')
]);

// Element with event handlers
h('button', {
    onClick: () => console.log('clicked'),
    onKeyDown: (e) => console.log('key pressed:', e.key)
}, 'Click me');
```

#### `render(vnode, container)`
Renders a virtual DOM tree into a real DOM container.

```javascript
import { render } from './framework/core.js';

const app = h('div', {}, 'Hello World');
render(app, document.getElementById('app'));
```

### State Management

#### `store.setState(newState)`
Updates the global state and triggers re-renders.

```javascript
import { store } from './framework/store.js';

store.setState({
    todos: [],
    filter: 'all'
});
```

#### `store.getState()`
Gets the current state.

```javascript
const currentState = store.getState();
console.log(currentState.todos);
```

#### `store.subscribe(callback)`
Subscribes to state changes.

```javascript
store.subscribe(() => {
    console.log('State changed:', store.getState());
    renderApp(); // Re-render your app
});
```

### Event Manager

#### `events.on(element, eventType, handler)`
Registers an event handler for an element.

```javascript
import { events } from './framework/core.js';

const button = document.querySelector('button');
events.on(button, 'click', (e) => {
    console.log('Button clicked!');
});
```

#### `events.off(element, eventType)`
Removes an event handler.

```javascript
events.off(button, 'click');
```

#### `events.cleanupElement(element)`
Cleans up all event handlers for an element.

```javascript
events.cleanupElement(button);
```

---

## 🧩 Components

### Functional Components
Components are just functions that return virtual DOM elements.

```javascript
const Header = (props) => {
    return h('header', { class: 'header' }, [
        h('h1', {}, props.title),
        h('nav', {}, props.children)
    ]);
};

// Usage
const app = h('div', {}, [
    Header({ title: 'My App' }, [
        h('a', { href: '/' }, 'Home')
    ])
]);
```

### Component with State
```javascript
const Counter = () => {
    const [count, setCount] = useState(0);
    
    return h('div', {}, [
        h('h2', {}, `Count: ${count}`),
        h('button', {
            onClick: () => setCount(count + 1)
        }, 'Increment')
    ]);
};
```

### Component Lifecycle
```javascript
const MyComponent = () => {
    // Component logic here
    return h('div', {}, 'My Component');
};

// Setup events after component renders
const setupComponentEvents = () => {
    const element = document.querySelector('.my-component');
    if (element) {
        events.on(element, 'click', handleClick);
    }
};
```

---

## 🎯 State Management

### Global State
```javascript
import { store } from './framework/store.js';

// Initialize state
store.setState({
    user: null,
    todos: [],
    filter: 'all'
});

// Update state
store.setState({
    ...store.getState(),
    user: { name: 'John', id: 1 }
});

// Subscribe to changes
store.subscribe(() => {
    renderApp();
});
```

### Local Component State
```javascript
const TodoItem = (todo) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(todo.text);
    
    return h('li', {
        class: isEditing ? 'editing' : ''
    }, [
        h('input', {
            value: editValue,
            onInput: (e) => setEditValue(e.target.value)
        })
    ]);
};
```

---

## 🎮 Event Handling

### Event Delegation
The framework uses event delegation for better performance. Events are automatically handled through the Event Manager.

```javascript
// Events are automatically registered when using on* props
h('button', {
    onClick: (e) => console.log('clicked'),
    onKeyDown: (e) => console.log('key pressed:', e.key),
    onMouseOver: (e) => console.log('mouse over')
}, 'Interactive Button');
```

### Custom Event Setup
```javascript
// For complex event handling, use the Event Manager directly
const setupCustomEvents = () => {
    const element = document.querySelector('.custom-element');
    
    events.on(element, 'click', handleClick);
    events.on(element, 'keydown', handleKeyDown);
    events.on(element, 'focus', handleFocus);
};
```

### Event Object
Events receive a normalized event object with the following properties:

```javascript
const handleEvent = (e) => {
    console.log(e.target);        // DOM element that triggered the event
    console.log(e.type);          // Event type (click, keydown, etc.)
    console.log(e.key);           // Key pressed (for keyboard events)
    console.log(e.value);         // Input value (for form events)
    console.log(e.checked);       // Checkbox state (for checkbox events)
    
    // Methods
    e.preventDefault();           // Prevent default behavior
    e.stopPropagation();         // Stop event bubbling
};
```

---

## 🛣️ Routing

### Basic Router Setup
```javascript
import { Router } from './framework/routers.js';

const routes = [
    {
        path: '/',
        component: () => h('div', {}, 'Home Page')
    },
    {
        path: '/about',
        component: () => h('div', {}, 'About Page')
    },
    {
        path: '*',
        component: () => h('div', {}, '404 - Not Found')
    }
];

const router = new Router(routes, document.getElementById('app'));
```

### Navigation
```javascript
// Programmatic navigation
router.navigateTo('/about');

// Link component
const link = router.link('/about', 'About Us', {
    class: 'nav-link'
});
```

---

## 📝 Examples

### Todo App Component
```javascript
const TodoApp = () => {
    const { todos, filter } = store.getState();
    
    const visibleTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });
    
    return h('div', { class: 'todoapp' }, [
        h('h1', {}, 'Todo App'),
        h('input', {
            class: 'new-todo',
            placeholder: 'What needs to be done?',
            onKeyDown: (e) => {
                if (e.key === 'Enter') {
                    addTodo(e.target.value);
                    e.target.value = '';
                }
            }
        }),
        h('ul', { class: 'todo-list' }, 
            visibleTodos.map(todo => TodoItem(todo))
        )
    ]);
};

const TodoItem = (todo) => {
    return h('li', {
        class: todo.completed ? 'completed' : '',
        key: todo.id
    }, [
        h('input', {
            type: 'checkbox',
            checked: todo.completed,
            onChange: () => toggleTodo(todo.id)
        }),
        h('span', {}, todo.text),
        h('button', {
            onClick: () => deleteTodo(todo.id)
        }, 'Delete')
    ]);
};
```

### Form Component
```javascript
const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };
    
    const handleInput = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
    };
    
    return h('form', {
        onSubmit: handleSubmit
    }, [
        h('input', {
            type: 'text',
            placeholder: 'Name',
            value: formData.name,
            onInput: handleInput('name')
        }),
        h('input', {
            type: 'email',
            placeholder: 'Email',
            value: formData.email,
            onInput: handleInput('email')
        }),
        h('textarea', {
            placeholder: 'Message',
            value: formData.message,
            onInput: handleInput('message')
        }),
        h('button', { type: 'submit' }, 'Send')
    ]);
};
```

---

## 🎯 Best Practices

### 1. Component Structure
```javascript
// ✅ Good: Pure functional components
const UserCard = (user) => {
    return h('div', { class: 'user-card' }, [
        h('img', { src: user.avatar }),
        h('h3', {}, user.name),
        h('p', {}, user.email)
    ]);
};

// ✅ Good: Separate event setup
const setupUserCardEvents = (user) => {
    const card = document.querySelector(`[data-user-id="${user.id}"]`);
    events.on(card, 'click', () => selectUser(user.id));
};
```

### 2. State Management
```javascript
// ✅ Good: Immutable state updates
const addTodo = (text) => {
    const currentState = store.getState();
    store.setState({
        ...currentState,
        todos: [...currentState.todos, { id: Date.now(), text, completed: false }]
    });
};

// ❌ Bad: Mutating state directly
const addTodo = (text) => {
    const state = store.getState();
    state.todos.push({ id: Date.now(), text, completed: false }); // Don't do this!
};
```

### 3. Event Handling
```javascript
// ✅ Good: Use keys for list items
const TodoList = (todos) => {
    return h('ul', {}, 
        todos.map(todo => h('li', { key: todo.id }, todo.text))
    );
};

// ✅ Good: Clean up event handlers
const cleanup = () => {
    events.cleanupElement(element);
};
```

### 4. Performance
```javascript
// ✅ Good: Use keys for efficient diffing
h('li', { key: todo.id }, todo.text);

// ✅ Good: Avoid unnecessary re-renders
const expensiveComponent = () => {
    const memoizedValue = useMemo(() => expensiveCalculation(), [deps]);
    return h('div', {}, memoizedValue);
};
```

---

## 🔧 Advanced Features

### Custom Hooks
```javascript
const useState = (initialValue) => {
    const [state, setState] = useState(initialValue);
    return [state, setState];
};

const useEffect = (callback, deps) => {
    // Implementation for side effects
};
```

### Error Boundaries
```javascript
const ErrorBoundary = (children) => {
    try {
        return children;
    } catch (error) {
        return h('div', { class: 'error' }, 'Something went wrong');
    }
};
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Events not working**
   - Make sure to call setup functions after rendering
   - Check that elements exist in the DOM before setting up events

2. **State not updating**
   - Use immutable state updates
   - Make sure to call `store.setState()` with the full state object

3. **Components not re-rendering**
   - Subscribe to store changes
   - Call render function when state changes

4. **Performance issues**
   - Use keys for list items
   - Avoid unnecessary re-renders
   - Clean up event handlers

---

## 📄 License

MIT License - feel free to use this framework in your projects!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

*This documentation covers the core functionality of the mini framework. For more examples, check out the `examples/` directory in the repository.* 