# 🚀 Mini Framework - Quick Reference

## 📦 Core Imports

```javascript
import { h, render, events } from './framework/core.js';
import { store } from './framework/store.js';
import { Router } from './framework/routers.js';
```

## 🎯 Essential Functions

### Creating Elements
```javascript
// Basic element
h('div', { class: 'container' }, 'Content');

// Element with children
h('div', {}, [
    h('h1', {}, 'Title'),
    h('p', {}, 'Text')
]);

// Element with events
h('button', {
    onClick: () => console.log('clicked'),
    onKeyDown: (e) => console.log(e.key)
}, 'Click me');
```

### Rendering
```javascript
// Render to DOM
render(App(), document.getElementById('app'));

// Re-render on state changes
store.subscribe(() => render(App(), document.getElementById('app')));
```

## 🎮 State Management

### Global State
```javascript
// Set state
store.setState({
    todos: [],
    user: null
});

// Get state
const state = store.getState();

// Subscribe to changes
store.subscribe(() => {
    console.log('State changed:', store.getState());
});
```

### Immutable Updates
```javascript
// ✅ Good
store.setState({
    ...store.getState(),
    todos: [...store.getState().todos, newTodo]
});

// ❌ Bad
const state = store.getState();
state.todos.push(newTodo);
```

## 🎪 Event Handling

### Automatic Events (on* props)
```javascript
h('button', {
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onMouseOver: handleMouseOver
}, 'Button');
```

### Manual Event Setup
```javascript
// Setup events after rendering
const setupEvents = () => {
    const element = document.querySelector('.my-element');
    events.on(element, 'click', handleClick);
    events.on(element, 'keydown', handleKeyDown);
};

// Clean up
events.cleanupElement(element);
```

## 🧩 Component Patterns

### Functional Component
```javascript
const Header = (props) => {
    return h('header', { class: 'header' }, [
        h('h1', {}, props.title),
        h('nav', {}, props.children)
    ]);
};
```

### List Component with Keys
```javascript
const TodoList = (todos) => {
    return h('ul', {}, 
        todos.map(todo => 
            h('li', { key: todo.id }, todo.text)
        )
    );
};
```

### Component with Local State
```javascript
const Counter = () => {
    const [count, setCount] = useState(0);
    
    return h('div', {}, [
        h('span', {}, `Count: ${count}`),
        h('button', {
            onClick: () => setCount(count + 1)
        }, 'Increment')
    ]);
};
```

## 🛣️ Routing

### Router Setup
```javascript
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '*', component: NotFound }
];

const router = new Router(routes, document.getElementById('app'));
```

### Navigation
```javascript
// Programmatic
router.navigateTo('/about');

// Link component
const link = router.link('/about', 'About', { class: 'nav-link' });
```

## 📝 Common Patterns

### Form Handling
```javascript
const Form = () => {
    const [data, setData] = useState({ name: '', email: '' });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted:', data);
    };
    
    const handleInput = (field) => (e) => {
        setData({ ...data, [field]: e.target.value });
    };
    
    return h('form', { onSubmit: handleSubmit }, [
        h('input', {
            value: data.name,
            onInput: handleInput('name')
        }),
        h('button', { type: 'submit' }, 'Submit')
    ]);
};
```

### Conditional Rendering
```javascript
const Component = (props) => {
    return h('div', {}, [
        props.showHeader && h('h1', {}, 'Header'),
        props.items.length > 0 && h('ul', {}, 
            props.items.map(item => h('li', { key: item.id }, item.text))
        )
    ]);
};
```

### Event Delegation Setup
```javascript
// Component
const TodoItem = (todo) => {
    return h('li', {
        'data-todo-id': todo.id,
        key: todo.id
    }, [
        h('span', {}, todo.text),
        h('button', { class: 'delete' }, 'Delete')
    ]);
};

// Event setup
const setupTodoEvents = (todo) => {
    const element = document.querySelector(`[data-todo-id="${todo.id}"]`);
    const deleteBtn = element.querySelector('.delete');
    
    events.on(deleteBtn, 'click', () => deleteTodo(todo.id));
};
```

## 🔧 Performance Tips

### Use Keys for Lists
```javascript
// ✅ Good
todos.map(todo => h('li', { key: todo.id }, todo.text));

// ❌ Bad
todos.map((todo, index) => h('li', { key: index }, todo.text));
```

### Avoid Unnecessary Re-renders
```javascript
// ✅ Good: Memoize expensive calculations
const expensiveValue = useMemo(() => heavyCalculation(data), [data]);

// ✅ Good: Use keys for efficient diffing
h('div', { key: uniqueId }, content);
```

### Clean Up Events
```javascript
// Always clean up when removing elements
events.cleanupElement(element);
```

## 🐛 Common Issues & Solutions

### Events Not Working
```javascript
// ✅ Solution: Setup events after rendering
render(App(), container);
setTimeout(setupEvents, 0);
```

### State Not Updating
```javascript
// ✅ Solution: Use immutable updates
store.setState({
    ...store.getState(),
    newData: value
});
```

### Components Not Re-rendering
```javascript
// ✅ Solution: Subscribe to store changes
store.subscribe(() => {
    render(App(), document.getElementById('app'));
});
```

## 📚 Event Types

### Mouse Events
- `onClick`, `onDblClick`
- `onMouseDown`, `onMouseUp`, `onMouseMove`
- `onMouseOver`, `onMouseOut`

### Keyboard Events
- `onKeyDown`, `onKeyUp`, `onKeyPress`

### Form Events
- `onInput`, `onChange`, `onSubmit`
- `onFocus`, `onBlur`

### Other Events
- `onScroll`, `onResize`, `onLoad`

## 🎨 Attributes

### Common Attributes
```javascript
h('div', {
    class: 'container',
    id: 'main',
    style: 'color: red;',
    'data-test': 'value'
}, 'Content');
```

### Boolean Attributes
```javascript
h('input', {
    type: 'checkbox',
    checked: true,
    disabled: false,
    required: true
});
```

---

*This quick reference covers the most commonly used features. For detailed documentation, see the main README.md file.* 