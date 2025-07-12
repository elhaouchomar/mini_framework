/* components/TodoList.js --------------------------------------- */
import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ────────── module-scoped helpers ────────── */
let currentEditingLi = null;   // <li> that’s currently in edit mode
let outsideHandler = null;   // singleton outside-click listener

/* ───────────────── TodoItem ───────────────── */
export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  /* normal “view” block (always present) */
  const viewDiv = createVNode('div', {
    class: 'view',
    ondblclick: e => startEdit(e, todo)
  }, [
    createVNode('input', {
      class: 'toggle',
      type: 'checkbox',
      checked: todo.completed,
      onchange: () => toggle(todo)
    }),
    createVNode('label', {}, todo.text),
    createVNode('button', {
      class: 'destroy',
      onclick: () => destroy(todo)
    })
  ]);

  /* edit field – only rendered while editing */
  const editInput = isEditing && createVNode('input', {
    class: 'edit',
    key: 'edit',
    value: editingValue,
    onkeydown: e => { if (e.key === 'Enter') save(todo); },
    oninput: e => store.setState({ ...store.getState(), editingValue: e.target.value }),

    ref: (el) => {
      if (!el) return;               // ref callback fires twice: mount & unmount
      
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
      currentEditingLi = el.closest('li');
    }
  });

  return createVNode('li', {
    class: `${todo.completed ? 'completed ' : ''}${isEditing ? 'editing' : ''}`,
    key: todo.id,
    'data-testid': 'todo-item'
  }, [viewDiv, editInput].filter(Boolean));
};

/* ─────────── behaviour helpers ─────────── */
const toggle = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
  });
};

const destroy = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.filter(t => t.id !== todo.id)
  });
};

const startEdit = (e, todo) => {
  if (e.target.type === 'checkbox') return;   // ignore dbl-click on checkbox
  store.setState({
    ...store.getState(),
    editingId: todo.id,
    editingValue: todo.text
  });
  attachOutsideHandler();
};

const save = (todo) => {
  const { editingValue, todos } = store.getState();
  const text = editingValue.trim();

  store.setState({
    ...store.getState(),
    todos: text
      ? todos.map(t => t.id === todo.id ? { ...t, text } : t)
      : todos.filter(t => t.id !== todo.id),
    editingId: null,
    editingValue: ''
  });
  detachOutsideHandler();
};

const cancel = () => {
  store.setState({ ...store.getState(), editingId: null, editingValue: '' });
  detachOutsideHandler();
};

/* ───────── outside-click logic (single listener) ───────── */
function attachOutsideHandler() {
  if (outsideHandler) return;           // already registered
  outsideHandler = (ev) => {
    if (currentEditingLi && !currentEditingLi.contains(ev.target)) cancel();
  };
  events.on(document, 'mousedown', outsideHandler);
}

function detachOutsideHandler() {
  if (!outsideHandler) return;
  events.on(document, 'mousedown', null);   // unregister
  outsideHandler = null;
  currentEditingLi = null;
}

/* ─────────── TodoList wrapper ─────────── */
export const TodoList = (items) =>
  createVNode(
    'ul',
    { class: 'todo-list', 'data-testid': 'todo-list' },
    items.map(TodoItem)
  );

/* default export so `import TodoList …` and `import { TodoList } …` both work */
export default TodoList;
