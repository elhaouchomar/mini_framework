import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  const children = [
    /* normal view ------------------------------------------------ */
    createVNode('div', { class: 'view', ondblclick: (e) => editeView(e, todo) }, [
      createVNode('input', { class: 'toggle', onchange: () => checkbox(todo), type: 'checkbox', checked: todo.completed }),
      createVNode('label', {}, todo.text),
      createVNode('button', { class: 'destroy', onclick: () => destroy(todo) })
    ]),

    /* edit input ------------------------------------------------- */
    createVNode('input', {
      onfocus: (e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length),
      class: 'edit',
      key: 'edit',
      value: isEditing ? editingValue : todo.text,
      style: { display: isEditing ? '' : 'none' },
      onkeydown: (e) => editInp(e, todo),
      onblur: () => editInpblur(todo),
      ref: isEditing ? (el) => { if (el) el.focus(); } : null
    })
  ];

  return createVNode('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-testid': 'todo-item',
    key: todo.id
  }, children);
};

/* ---------- UI ---------- */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

/* ---------- behaviour ---------- */
const editeView = (e, todo) => {
  if (e.target.type === 'checkbox') return;

  store.setState({ ...store.getState(), editingId: todo.id, editingValue: todo.text });

  /* focus after DOM flips to editing */
  const input = document.querySelector('li.editing .edit');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  attachOutsideClickHandler(todo);
};

const checkbox = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
  });
};

/* destroy */
const destroy = (todo) => {
  const { todos } = store.getState();
  store.setState({ ...store.getState(), todos: todos.filter(t => t.id !== todo.id) });
};

const editInp = (e, todo) => {
  if (e.key === 'Enter') {
    saveEdit(todo);
    return;
  }
  store.setState({ ...store.getState(), editingValue: e.target.value });
};

const editInpblur = (todo) => {
  const { editingId } = store.getState();
  if (editingId === todo.id) cancelEdit();
};

/* save / cancel helpers ---------------------------------------- */
function saveEdit(todo) {
  const { editingValue, todos } = store.getState();
  const text = editingValue.trim();

  if (!text) { // empty → delete
    store.setState({
      ...store.getState(),
      todos: todos.filter(t => t.id !== todo.id),
      editingId: null, editingValue: ''
    });
    detachOutsideClickHandler();
    return;
  }

  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, text } : t),
    editingId: null, editingValue: ''
  });
  detachOutsideClickHandler();
}

function cancelEdit() {
  store.setState({ ...store.getState(), editingId: null, editingValue: '' });
  detachOutsideClickHandler();
}

/* ---------- outside-click logic ---------- */
let outsideClickHandler = null;
let previousDocHandler = null;

function attachOutsideClickHandler(todo) {
  if (outsideClickHandler) return; // already active

  outsideClickHandler = (ev) => {
    const editingLi = document.querySelector('li.editing');
    if (editingLi && !editingLi.contains(ev.target)) {
      cancelEdit();                // discard on outside click
    }
  };

  /* remember any existing handler so we can restore it */
  previousDocHandler = document.onmousedown || null;
  events.on(document, 'mousedown', outsideClickHandler);
}

function detachOutsideClickHandler() {
  if (!outsideClickHandler) return;
  if (document.onmousedown === outsideClickHandler) {
    document.onmousedown = previousDocHandler;
  }
  outsideClickHandler = null;
  previousDocHandler = null;
}
