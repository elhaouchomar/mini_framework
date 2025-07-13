# MINI‑FRAMEWORK DOCUMENTATION

A small, dependency‑free toolkit for building reactive web interfaces in less than 5 KB.

---

## TABLE OF CONTENTS

1 Introduction\
2 Core Concepts\
 2.1 Virtual DOM Engine (`core.js`)\
 2.2 Event Manager (`event.js`)\
 2.3 Global Store (`state.js`)\
 2.4 Router (`router.js`)\
3 Project Structure & Setup\
4 API Reference\
5 Hands‑On Tutorials\
 5.1 Hello World\
 5.2 Counter\
 5.3 Stopwatch\
 5.4 TodoMVC (Full Walk‑through)\
 5.5 Multi‑Page App with Router\
6 Diff / Patch Algorithm – Deep Dive\
7 Performance Tips\
8 Testing Strategies\
9 Extending the Framework\
10 Roadmap & Limitations\
11 Glossary

---

## 1 INTRODUCTION

The goal of this mini‑framework is to teach Virtual‑DOM ideas without the weight of industrial tooling.  Every feature is written in plain ES2020 so you can open `index.html` in a browser and start coding.  Build one‑page widgets, full SPAs, or embed components into an existing app – the library stays out of your way.

Key features at a glance:

- Tiny footprint: ≈1.8 KB (VDOM + Store) and ≈4 KB with Router/Examples (gzip).
- Declarative UI with JSX‑like factory (`createVNode`).
- Automatic DOM updates via keyed diffing.
- Global, subscription‑based state store.
- Hand‑rolled router using the History API.
- No build step required (but plays nicely with Vite/Parcel).

---

## 2 CORE CONCEPTS

### 2.1 Virtual DOM Engine – `core.js`

| Function                                   | Description                                                                                              |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `createVNode(tag, attrs?, children?)`      | Returns a plain JS object `{ tag, attrs, children }`. Text nodes are represented by raw strings/numbers. |
| `render(vnode, container = document.body)` | First call mounts; subsequent calls diff and patch.                                                      |
| Internals                                  | `createDOM`, `diff`, `diffAttrs`, `diffChildren`, `applyPatches`                                         |

Supported attribute flavours:

- Standard attributes: `class`, `id`, `data‑*`, …
- DOM properties: `value`, `checked`, `disabled` (set as properties, not attributes).
- Event handlers: keys beginning with `on` are attached directly (`onclick`, `oninput`).
- `ref`: callback receiving the live element.
- `key`: unique id for list diffing.

Patch object types: `REPLACE`, `REMOVE`, `TEXT`, `UPDATE`.

### 2.2 Event Manager – `event.js`

A minimal helper that future‑proofs the codebase.  Currently all events are bound directly (`el["on"+type] = fn`).  The `cleanupElement` hook is called by the renderer before a node is removed; this will matter when a delegated strategy is introduced.

### 2.3 Global Store – `state.js`

A 30‑line state container reminiscent of Redux’s core idea:

```javascript
store.getState()              // safe clone
store.setState(partial)       // shallow merge + notify
const unsubscribe = store.subscribe(fn)
store.reset(newState)         // replace wholesale
```

Subscriptions are simple functions; each call to `setState` invokes *all* subscribers, so expensive work should be memoised when necessary.

### 2.4 Router – `router.js`

The router keeps URL ↔ component mapping with no external dependency.

```javascript
const routes = [
  { path: '/',      component: Home },
  { path: '/about', component: About },
  { path: '*',      component: NotFound }
];

const r = new Router(routes, document.querySelector('#root'));
```

`Router.link(path, text, attrs)` is a helper to create `<a>` nodes that do `pushState` instead of full reload.

---

## 3 PROJECT STRUCTURE & SETUP

```
my‑app/
├─ framework/           # cloned or symlinked
│  ├─ core.js
│  ├─ state.js
│  ├─ event.js
│  └─ router.js
├─ index.html
├─ app.js               # entry point
└─ components/
   └─ …
```

The framework files are drop‑in – no NPM install needed.  For modern bundlers, simply `import` the modules.  To scaffold quickly:

```bash
cp -r path/to/framework ./framework
cp path/to/examples/index.html .
code .
```

Open `index.html` directly in a browser or run a static server (`python -m http.server`).

---

## 4 API REFERENCE

### 4.1 `createVNode`

```javascript
createVNode(tag, attrs?, children?)
```

- `tag`   String or custom element name (`'div'`, `'my‑card'`).
- `attrs` Object of attributes/props/handlers.
- `children` Array or single child; falsy values are filtered out.

Return: a VNode tree node.

### 4.2 `render`

```javascript
render(vnode, container?)
```

Mounts or updates the UI.  **Important:** call `render` from a stable subscription (e.g. store listener) rather than scatter calls across app logic.

### 4.3 EventManager

```
events.on(el, 'click', handler)
events.cleanupElement(el)
```

The public surface is minimal by design; more helpers can be layered on top.

### 4.4 Store API (`state.js`)

| Method          | Purpose                                                             |
| --------------- | ------------------------------------------------------------------- |
| `getState()`    | Returns a *cloned* copy so callers cannot mutate accidentally.      |
| `setState(obj)` | Shallow‑merges `obj` with current state; then notifies subscribers. |
| `subscribe(fn)` | Adds listener and returns an unsubscribe function.                  |
| `reset(obj)`    | Replaces whole state; mostly for tests.                             |

### 4.5 Router

| Method                    | Purpose                                   |
| ------------------------- | ----------------------------------------- |
| `navigateTo(path)`        | Programmatic navigation.                  |
| `handleRouteChange()`     | Internal; listens to `popstate` & `load`. |
| `link(path, text, attrs)` | Factory for navigation `<a>` nodes.       |

---

## 5 HANDS‑ON TUTORIALS

### 5.1 Hello World

```javascript
import { createVNode, render } from './framework/core.js';

const Hello = () => createVNode('h1', {}, 'Hello, VDOM!');
render(Hello(), document.body);
```

### 5.2 Counter (with Store)

```javascript
import { createVNode, render } from './framework/core.js';
import { store } from './framework/state.js';

store.setState({ n: 0 });

const Counter = () => {
  const { n } = store.getState();
  return createVNode('div', {}, [
    createVNode('h2', {}, `n = ${n}`),
    createVNode('button', {
      onclick: () => store.setState({ n: n + 1 })
    }, '+1'),
    createVNode('button', {
      onclick: () => store.setState({ n: n - 1 })
    }, '-1')
  ]);
};

function mount() { render(Counter(), document.body); }
mount();
store.subscribe(mount);
```

### 5.3 Stopwatch (Timer + Refs)

```javascript
import { createVNode, render } from './framework/core.js';
import { store } from './framework/state.js';

store.setState({ ms: 0, running: false });
let interval = null;

function start() {
  if (interval) return;
  store.setState({ running: true });
  interval = setInterval(() => {
    const { ms } = store.getState();
    store.setState({ ms: ms + 10 });
  }, 10);
}
function stop() {
  clearInterval(interval); interval = null;
  store.setState({ running: false });
}
function reset() { stop(); store.setState({ ms: 0 }); }

const pad = n => n.toString().padStart(2, '0');

const Stopwatch = () => {
  const { ms, running } = store.getState();
  const s  = Math.floor(ms / 1000) % 60;
  const m  = Math.floor(ms / 60000);
  const cs = Math.floor((ms % 1000) / 10);
  return createVNode('div', { class: 'stopwatch' }, [
    createVNode('h1', {}, `${pad(m)}:${pad(s)}.${pad(cs)}`),
    createVNode('button', { onclick: running ? stop : start }, running ? 'Stop' : 'Start'),
    createVNode('button', { onclick: reset }, 'Reset'),
    createVNode('input', {
      type: 'range', min: 0, max: 60000, value: ms,
      oninput: e => store.setState({ ms: Number(e.target.value) })
    })
  ]);
};

function mount() { render(Stopwatch(), document.body); }
mount();
store.subscribe(mount);
```

### 5.4 TodoMVC Walk‑through

The full TodoMVC example demonstrates *all* framework features.  Source is in `/example/todomvc`.  Key learning points:

- Dynamic list diffing with `key`.
- Controlled edits with inline `ref` for focusing.
- Global store for todos, filter, edit draft.
- URL hash sync via imperative `window.onhashchange`.
- Separation between pure view functions and noisy event handlers.

### 5.5 Multi‑Page App with Router

```javascript
import { Router } from './framework/router.js';
import { createVNode } from './framework/core.js';

const Home = () => createVNode('h2', {}, 'Welcome');
const About = () => createVNode('h2', {}, 'About Us');
const NotFound = () => createVNode('h2', {}, '404');

const routes = [
  { path: '/',      component: Home },
  { path: '/about', component: About },
  { path: '*',      component: NotFound }
];

const router = new Router(routes, document.querySelector('#root'));

const Nav = () => createVNode('nav', {}, [
  router.link('/', 'Home'), ' | ',
  router.link('/about', 'About')
]);
```

Embed `Nav()` at the top of every page or inside a layout component; clicking links does not reload the document, yet the address bar updates correctly.

---

## 6 DIFF / PATCH ALGORITHM – DEEP DIVE

The algorithm is conceptually similar to React pre‑Fiber.

1. **Entry** – `diff(oldVNode, newVNode)` returns a patch object or `null`.
2. **Primitives** – if either node is a string/number, compare values.
3. **Tag change** – different `tag` or `key` → `REPLACE` entire subtree.
4. **Attributes** – `diffAttrs` builds a delta object:
   - added/updated → `out[k] = v`
   - removed        → `out[k] = undefined`
5. **Children** – two‑pointer walk of `oldChildren` and `newChildren`.
   - Matching keys ⇒ recurse.
   - Orphaned old key ⇒ `REMOVE`.
   - New key not in old list ⇒ `REPLACE`.
6. **Patch Application** – depth‑first in `applyPatches`.

Flow chart:

```
oldVNode ─┐                  REPLACE ───► createDOM
          ├─ same type? ──► TEXT diff ─► update text
          │                ATTR diff ─► set/remove attrs
          │                CHILD diff ─► recurse
          ▼
       RETURN null (no changes)
```

Edge cases:

- Trailing children: after patch traversal, any extra DOM nodes are removed.
- Controlled form fields: `value`, `checked`, `disabled` always update via property assignment.

Complexities:

- Attributes: O(A) where A = number of attrs.
- Children: O(max(M, N)).
- Overall: linear in size of tree unless heavy key mismatches force repeated `some()` scans.

---

## 7 PERFORMANCE TIPS

- Batch state updates in a single `setState` to avoid redundant renders.
- Use stable `key` values – random keys on every render defeat diffing.
- Avoid arrow functions inside attribute objects when not needed; define handlers once and reuse.
- Defer expensive computations (e.g. list filtering) until right before `createVNode` construction.
- Service‑worker / caching can keep bundle small & fast; no framework involvement required.

---

## 8 TESTING STRATEGIES

1. **Pure functions** – Render functions are deterministic; unit‑test them by comparing generated VNode trees.
2. **DOM snapshot** – After `render`, query the DOM and assert against expected HTML.
3. **Integration** – Simulate events (`button.click()`) and verify store state.
4. **Store isolation** – Reset store with `store.reset()` between tests.
5. **CI** – Headless browsers (Playwright, Vitest + jsdom) work because the framework has no browser‑specific globals except `document`.

---

## 9 EXTENDING THE FRAMEWORK

- **Delegated events** – replace direct `on` binding with a single root listener per event type in `event.js`.
- **Derived state hooks** – add `useSelector(fn)` that runs selector and subscribes only if its slice changes.
- **Component local state** – implement `useState` via per‑component context array.
- **Fragments** – allow `createVNode(null, null, children)` to return only its children.
- **Portal** – render subtree into external container with special tag.

---

## 10 ROADMAP & LIMITATIONS

See Section 9 for proposed features.  Current known issues:

- No diff algorithm for moves – items reordered by drag‑drop incur `REPLACE` ops.
- No hydration for SSR.
- Works only in XSS‑free trusted templates; sanitise external HTML.
- Router lacks query‑string awareness.
- EventManager does not support passive options.

---

## 11 GLOSSARY

| Term       | Meaning                                                       |
| ---------- | ------------------------------------------------------------- |
| VNode      | Virtual DOM node – plain object describing an element.        |
| Patch      | Instruction for how to mutate the real DOM.                   |
| Key        | Stable identifier for diffing list children.                  |
| Controlled | Input whose value is driven by state, not DOM.                |
| Ref        | Callback receiving the underlying DOM node.                   |
| Store      | Central state container with pub/sub.                         |
| SPA        | Single‑Page Application – navigates without full page reload. |

---
