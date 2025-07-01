# 📚 Mini Framework API Documentation

## Core Module (`framework/core.js`)

### `h(tag, attrs, children)`
Creates a virtual DOM element.

**Parameters:**
- `tag` (string): HTML tag name
- `attrs` (object, optional): Element attributes and event handlers
- `children` (any, optional): Child elements or text content

**Returns:** Virtual DOM node object

**Example:**
```javascript
import { h } from './framework/core.js';

// Basic element
h('div', { class: 'container' }, 'Hello World');

// Element with children
h('div', {}, [
    h('h1', {}, 'Title'),
    h('p', {}, 'Content')
]);

// Element with events
h('button', {
    onClick: () => console.log('clicked'),
    onKeyDown: (e) => console.log(e.key)
}, 'Click me');
```

### `render(vnode, container)`
Renders a virtual DOM tree into a real DOM container.

**Parameters:**
- `vnode` (object): Virtual DOM node to render
- `container` (HTMLElement): DOM element to render into

**Returns:** void

**Example:**
```javascript
import { render } from './framework/core.js';

const app = h('div', {}, 'Hello World');
render(app, document.getElementById('app'));
```

### `events`
Event Manager instance for handling events.

#### `events.on(element, eventType, handler)`
Registers an event handler for an element.

**Parameters:**
- `element` (HTMLElement): DOM element to attach event to
- `eventType` (string): Event type (click, keydown, etc.)
- `handler` (function): Event handler function

**Returns:** void

**Example:**
```javascript
import { events } from './framework/core.js';

const button = document.querySelector('button');
events.on(button, 'click', (e) => {
    console.log('Button clicked!');
});
```

#### `events.off(element, eventType)`
Removes an event handler from an element.

**Parameters:**
- `element` (HTMLElement): DOM element to remove event from
- `eventType` (string): Event type to remove

**Returns:** void

**Example:**
```javascript
events.off(button, 'click');
```

#### `events.cleanupElement(element)`
Cleans up all event handlers for an element.

**Parameters:**
- `element` (HTMLElement): DOM element to clean up

**Returns:** void

**Example:**
```javascript
events.cleanupElement(button);
```

#### `events.setupHeaderEvents(store)`
Sets up event handlers for header component.

**Parameters:**
- `store` (object): State store instance

**Returns:** void

**Example:**
```javascript
events.setupHeaderEvents(store);
```

#### `events.setupAppEvents(store)`
Sets up event handlers for app component.

**Parameters:**
- `store` (object): State store instance

**Returns:** void

**Example:**
```javascript
events.setupAppEvents(store);
```

#### `events.setupFooterEvents(store, updateFilter)`
Sets up event handlers for footer component.

**Parameters:**
- `store` (object): State store instance
- `updateFilter` (function): Filter update function

**Returns:** void

**Example:**
```javascript
events.setupFooterEvents(store, updateFilter);
```

#### `events.setupTodoListEvents(todos, store)`
Sets up event handlers for todo list.

**Parameters:**
- `todos` (array): Array of todo items
- `store` (object): State store instance

**Returns:** void

**Example:**
```javascript
events.setupTodoListEvents(todos, store);
```

### `Component` Class
Base class for creating components.

#### `new Component(props)`
Creates a new component instance.

**Parameters:**
- `props` (object, optional): Component props

**Example:**
```javascript
import { Component } from './framework/core.js';

class MyComponent extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return h('div', {}, 'My Component');
    }
}
```

#### `setState(updater)`
Updates component state and triggers re-render.

**Parameters:**
- `updater` (object|function): New state or state updater function

**Example:**
```javascript
// Object update
this.setState({ count: this.state.count + 1 });

// Function update
this.setState(prevState => ({
    count: prevState.count + 1
}));
```

#### `render()`
Abstract method that must be implemented by subclasses.

**Returns:** Virtual DOM node

## Store Module (`framework/store.js`)

### `store`
Global state store instance.

#### `store.setState(newState)`
Updates the global state.

**Parameters:**
- `newState` (object): New state object

**Returns:** void

**Example:**
```javascript
import { store } from './framework/store.js';

store.setState({
    todos: [],
    filter: 'all'
});
```

#### `store.getState()`
Gets the current state.

**Returns:** Current state object

**Example:**
```javascript
const currentState = store.getState();
console.log(currentState.todos);
```

#### `store.subscribe(callback)`
Subscribes to state changes.

**Parameters:**
- `callback` (function): Function to call when state changes

**Returns:** void

**Example:**
```javascript
store.subscribe(() => {
    console.log('State changed:', store.getState());
    renderApp();
});
```

## Router Module (`framework/routers.js`)

### `Router` Class
Handles client-side routing.

#### `new Router(routes, rootElement)`
Creates a new router instance.

**Parameters:**
- `routes` (array): Array of route objects
- `rootElement` (HTMLElement): DOM element to render routes into

**Example:**
```javascript
import { Router } from './framework/routers.js';

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
];

const router = new Router(routes, document.getElementById('app'));
```

#### `navigateTo(path)`
Navigates to a specific path.

**Parameters:**
- `path` (string): Path to navigate to

**Returns:** void

**Example:**
```javascript
router.navigateTo('/about');
```

#### `link(path, text, attrs)`
Creates a link component.

**Parameters:**
- `path` (string): Path to link to
- `text` (string): Link text
- `attrs` (object, optional): Additional attributes

**Returns:** Virtual DOM node

**Example:**
```javascript
const link = router.link('/about', 'About Us', {
    class: 'nav-link'
});
```

## Event Module (`framework/event.js`)

### `EventManager` Class
Manages event delegation and handling.

#### `new EventManager()`
Creates a new event manager instance.

**Example:**
```javascript
import { EventManager } from './framework/event.js';

const eventManager = new EventManager();
```

#### `setupGlobalDelegation()`
Sets up global event delegation for common events.

**Returns:** void

#### `handleDelegatedEvent(event)`
Handles delegated events.

**Parameters:**
- `event` (Event): Native DOM event

**Returns:** void

#### `generateEventId()`
Generates a unique event ID.

**Returns:** string

## Virtual DOM Structure

### VNode Object
```javascript
{
    tag: string,           // HTML tag name
    attrs: object,         // Element attributes and event handlers
    children: array        // Child elements
}
```

### Attributes Object
```javascript
{
    // HTML attributes
    class: string,
    id: string,
    style: string,
    'data-*': string,
    
    // Event handlers
    onClick: function,
    onKeyDown: function,
    onInput: function,
    
    // Special attributes
    key: string,           // For list diffing
    ref: function          // DOM element reference
}
```

## Event Object Properties

### Normalized Event Object
```javascript
{
    // Native event properties
    target: HTMLElement,
    type: string,
    key: string,
    value: string,
    checked: boolean,
    
    // Methods
    preventDefault: function,
    stopPropagation: function
}
```

## Route Object Structure

### Route Configuration
```javascript
{
    path: string,          // URL path
    component: function    // Component function to render
}
```

## State Object Structure

### Global State
```javascript
{
    // Application state
    todos: array,
    filter: string,
    user: object,
    
    // Any other state properties
    [key: string]: any
}
```

## Error Handling

### Common Errors

1. **Component not implementing render()**
   ```javascript
   // Error: Component must implement render()
   // Solution: Implement render() method in your component
   ```

2. **Invalid virtual DOM node**
   ```javascript
   // Error: Invalid VNode
   // Solution: Use h() function to create valid VNodes
   ```

3. **Event handler not found**
   ```javascript
   // Error: Element not found for event setup
   // Solution: Ensure element exists before setting up events
   ```

## Performance Considerations

### Best Practices

1. **Use keys for list items**
   ```javascript
   // Good
   todos.map(todo => h('li', { key: todo.id }, todo.text));
   
   // Bad
   todos.map((todo, index) => h('li', { key: index }, todo.text));
   ```

2. **Clean up event handlers**
   ```javascript
   // Always clean up when removing elements
   events.cleanupElement(element);
   ```

3. **Avoid unnecessary re-renders**
   ```javascript
   // Use immutable state updates
   store.setState({
       ...store.getState(),
       newData: value
   });
   ```

---

*This API documentation covers all public methods and their usage. For examples and best practices, see the main README.md file.* 