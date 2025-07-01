# 🚀 Getting Started with Mini Framework

A step-by-step guide to building your first application with the Mini Framework.

## 📋 Prerequisites

- Basic knowledge of JavaScript (ES6+)
- Understanding of HTML and CSS
- A modern web browser
- A text editor (VS Code, Sublime Text, etc.)

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/mini_framework.git
cd mini_framework
```

### 2. Project Structure

```
mini_framework/
├── framework/
│   ├── core.js          # Core Virtual DOM and rendering
│   ├── store.js         # State management
│   ├── routers.js       # Client-side routing
│   └── event.js         # Event delegation system
├── examples/
│   └── todoapp/         # Complete todo application
├── README.md            # Main documentation
├── API.md              # Detailed API reference
├── QUICK_REFERENCE.md  # Quick reference guide
└── GETTING_STARTED.md  # This file
```

## 🎯 Your First Application

### Step 1: Create the HTML File

Create a new file called `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Mini Framework App</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .counter {
            text-align: center;
            margin: 20px 0;
        }
        .counter button {
            padding: 10px 20px;
            margin: 0 10px;
            font-size: 16px;
            cursor: pointer;
        }
        .counter span {
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        // Your application code will go here
    </script>
</body>
</html>
```

### Step 2: Import the Framework

Add the imports to your script tag:

```javascript
import { h, render } from './framework/core.js';
import { store } from './framework/store.js';
```

### Step 3: Create Your First Component

Create a simple counter component:

```javascript
const Counter = () => {
    const state = store.getState();
    const count = state.count || 0;
    
    return h('div', { class: 'counter' }, [
        h('h1', {}, 'My First Mini Framework App'),
        h('div', {}, [
            h('button', {
                onClick: () => {
                    store.setState({
                        ...store.getState(),
                        count: count - 1
                    });
                }
            }, 'Decrease'),
            h('span', {}, `Count: ${count}`),
            h('button', {
                onClick: () => {
                    store.setState({
                        ...store.getState(),
                        count: count + 1
                    });
                }
            }, 'Increase')
        ])
    ]);
};
```

### Step 4: Create the Main App Component

```javascript
const App = () => {
    return h('div', { class: 'container' }, [
        Counter()
    ]);
};
```

### Step 5: Initialize State and Render

```javascript
// Initialize the application state
store.setState({
    count: 0
});

// Subscribe to state changes to re-render
store.subscribe(() => {
    render(App(), document.getElementById('app'));
});

// Initial render
render(App(), document.getElementById('app'));
```

### Step 6: Complete Application

Your complete `index.html` should look like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Mini Framework App</title>
    <style>
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .counter {
            text-align: center;
            margin: 20px 0;
        }
        .counter button {
            padding: 10px 20px;
            margin: 0 10px;
            font-size: 16px;
            cursor: pointer;
        }
        .counter span {
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div id="app"></div>
    
    <script type="module">
        import { h, render } from './framework/core.js';
        import { store } from './framework/store.js';
        
        const Counter = () => {
            const state = store.getState();
            const count = state.count || 0;
            
            return h('div', { class: 'counter' }, [
                h('h1', {}, 'My First Mini Framework App'),
                h('div', {}, [
                    h('button', {
                        onClick: () => {
                            store.setState({
                                ...store.getState(),
                                count: count - 1
                            });
                        }
                    }, 'Decrease'),
                    h('span', {}, `Count: ${count}`),
                    h('button', {
                        onClick: () => {
                            store.setState({
                                ...store.getState(),
                                count: count + 1
                            });
                        }
                    }, 'Increase')
                ])
            ]);
        };
        
        const App = () => {
            return h('div', { class: 'container' }, [
                Counter()
            ]);
        };
        
        // Initialize the application state
        store.setState({
            count: 0
        });
        
        // Subscribe to state changes to re-render
        store.subscribe(() => {
            render(App(), document.getElementById('app'));
        });
        
        // Initial render
        render(App(), document.getElementById('app'));
    </script>
</body>
</html>
```

### Step 7: Run Your Application

Open the HTML file in your browser or serve it using a local server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if installed)
npx serve .

# Or simply open the file directly in your browser
```

Visit `http://localhost:8000` (or open the file directly) to see your application running!

## 🎨 Building a Todo App

Now let's build something more complex - a todo application.

### Step 1: Create Todo Components

```javascript
// TodoItem component
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

// TodoList component
const TodoList = () => {
    const state = store.getState();
    const todos = state.todos || [];
    
    return h('ul', { class: 'todo-list' }, 
        todos.map(todo => TodoItem(todo))
    );
};

// TodoForm component
const TodoForm = () => {
    return h('form', {
        onSubmit: (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            const text = input.value.trim();
            
            if (text) {
                addTodo(text);
                input.value = '';
            }
        }
    }, [
        h('input', {
            type: 'text',
            placeholder: 'What needs to be done?',
            required: true
        }),
        h('button', { type: 'submit' }, 'Add Todo')
    ]);
};
```

### Step 2: Create Action Functions

```javascript
// Todo actions
const addTodo = (text) => {
    const state = store.getState();
    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    store.setState({
        ...state,
        todos: [...state.todos, newTodo]
    });
};

const toggleTodo = (id) => {
    const state = store.getState();
    const todos = state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    store.setState({
        ...state,
        todos: todos
    });
};

const deleteTodo = (id) => {
    const state = store.getState();
    const todos = state.todos.filter(todo => todo.id !== id);
    
    store.setState({
        ...state,
        todos: todos
    });
};
```

### Step 3: Create the Main App

```javascript
const TodoApp = () => {
    return h('div', { class: 'todoapp' }, [
        h('h1', {}, 'Todo App'),
        TodoForm(),
        TodoList()
    ]);
};

// Initialize state
store.setState({
    todos: []
});

// Subscribe and render
store.subscribe(() => {
    render(TodoApp(), document.getElementById('app'));
});

render(TodoApp(), document.getElementById('app'));
```

## 🛣️ Adding Routing

### Step 1: Import Router

```javascript
import { Router } from './framework/routers.js';
```

### Step 2: Create Page Components

```javascript
const Home = () => {
    return h('div', {}, [
        h('h1', {}, 'Home Page'),
        h('p', {}, 'Welcome to our application!')
    ]);
};

const About = () => {
    return h('div', {}, [
        h('h1', {}, 'About Page'),
        h('p', {}, 'This is a simple application built with Mini Framework.')
    ]);
};

const NotFound = () => {
    return h('div', {}, [
        h('h1', {}, '404 - Page Not Found'),
        h('p', {}, 'The page you are looking for does not exist.')
    ]);
};
```

### Step 3: Setup Routes

```javascript
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '*', component: NotFound }
];

const router = new Router(routes, document.getElementById('app'));
```

### Step 4: Add Navigation

```javascript
const Navigation = () => {
    return h('nav', {}, [
        router.link('/', 'Home', { class: 'nav-link' }),
        router.link('/about', 'About', { class: 'nav-link' })
    ]);
};

const App = () => {
    return h('div', { class: 'app' }, [
        Navigation(),
        h('main', {}, [
            // Router will render the current page here
        ])
    ]);
};
```

## 🎯 Next Steps

Now that you have the basics, here are some ideas to expand your application:

1. **Add Local Storage**: Persist todos between page reloads
2. **Add Filtering**: Filter todos by completed/active status
3. **Add Categories**: Group todos by categories
4. **Add Animations**: Use CSS transitions for smooth interactions
5. **Add Form Validation**: Validate todo input
6. **Add Search**: Search through todos
7. **Add Drag and Drop**: Reorder todos by dragging

## 🔧 Development Tips

### 1. Use Browser DevTools

Open the browser's developer tools to:
- Check for JavaScript errors
- Inspect the DOM structure
- Monitor network requests
- Debug your application

### 2. Console Logging

Use `console.log()` to debug your application:

```javascript
const TodoItem = (todo) => {
    console.log('Rendering todo:', todo);
    return h('li', {}, todo.text);
};
```

### 3. Component Structure

Keep your components small and focused:

```javascript
// ✅ Good: Small, focused components
const TodoItem = (todo) => { /* ... */ };
const TodoList = (todos) => { /* ... */ };
const TodoForm = () => { /* ... */ };

// ❌ Bad: Large, complex components
const TodoApp = () => {
    // Too much logic in one component
};
```

### 4. State Management

Keep your state structure simple and predictable:

```javascript
// ✅ Good: Flat state structure
store.setState({
    todos: [],
    filter: 'all',
    user: null
});

// ❌ Bad: Nested state structure
store.setState({
    app: {
        todos: {
            items: [],
            loading: false
        }
    }
});
```

## 🐛 Common Issues

### 1. Events Not Working

**Problem**: Click events don't trigger
**Solution**: Make sure you're using the correct event names (onClick, not onclick)

```javascript
// ✅ Good
h('button', { onClick: handleClick }, 'Click me');

// ❌ Bad
h('button', { onclick: handleClick }, 'Click me');
```

### 2. State Not Updating

**Problem**: Component doesn't re-render when state changes
**Solution**: Make sure you're subscribed to state changes

```javascript
// ✅ Good
store.subscribe(() => {
    render(App(), document.getElementById('app'));
});

// ❌ Bad
// Missing subscription
```

### 3. Elements Not Found

**Problem**: Event setup fails because elements don't exist
**Solution**: Add retry logic or ensure DOM is ready

```javascript
const setupEvents = () => {
    const element = document.querySelector('.my-element');
    if (element) {
        events.on(element, 'click', handleClick);
    } else {
        // Retry after a short delay
        setTimeout(setupEvents, 10);
    }
};
```

## 📚 Resources

- [Main Documentation](README.md)
- [API Reference](API.md)
- [Quick Reference](QUICK_REFERENCE.md)
- [Todo App Example](../examples/todoapp/)

## 🤝 Getting Help

If you run into issues:

1. Check the browser console for errors
2. Review the API documentation
3. Look at the todo app example
4. Check the troubleshooting section in the main README

---

*Congratulations! You've built your first Mini Framework application. Keep experimenting and building more complex features!* 