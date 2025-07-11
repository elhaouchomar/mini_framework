import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  const children = [
    /* normal view ------------------------------------------------ */
    createVNode('div',
      { class: 'view', ondblclick: (e) => editeView(e, todo) }, [
      createVNode('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onchange: () => toggle(todo)
      }),
      createVNode('label', {}, todo.text),
      createVNode('button', { class: 'destroy', onclick: () => destroy(todo) })
    ]),

    /* edit input ------------------------------------------------- */
    createVNode('input', {
      class: 'edit',
      key: 'edit',
      value: isEditing ? editingValue : todo.text,
      style: { display: isEditing ? '' : 'none' },
      oninput: editInput,
      onkeydown: (e) => editKey(e, todo),
      onblur: () => editBlur(todo)
    })
  ];

  return createVNode('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    key: todo.id,
    'data-testid': 'todo-item'
  }, children);
};

/* list wrapper -------------------------------------------------- */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

/* behaviour ----------------------------------------------------- */
const editeView = (e, todo) => {
  if (e.target.type === 'checkbox') return;

  store.setState({
    ...store.getState(),
    editingId: todo.id,
    editingValue: todo.text
  });

  /* focus after DOM flips to editing */
  const input = document.querySelector('li.editing .edit');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  attachOutsideClickHandler(todo);
};

const editInput = (e) =>
  store.setState({ ...store.getState(), editingValue: e.target.value });

const toggle = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.map(t =>
      t.id === todo.id ? { ...t, completed: !t.completed } : t)
  });
};

const destroy = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.filter(t => t.id !== todo.id)
  });
};

const editKey = (e, todo) => {
  if (e.key === 'Enter') saveEdit(todo);
};

const editBlur = (todo) => {
  if (store.getState().editingId === todo.id) cancelEdit();
};

/* save / cancel helpers ---------------------------------------- */
function saveEdit(todo) {
  const { editingValue, todos } = store.getState();
  const text = editingValue.trim();

  if (!text) {
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
  store.setState({
    ...store.getState(),
    editingId: null, editingValue: ''
  });
  detachOutsideClickHandler();
}

let outsideClickHandler = null;
let previousDocHandler = null;

function attachOutsideClickHandler(todo) {
  if (outsideClickHandler) return;          // already active

  outsideClickHandler = (ev) => {
    const editingLi = document.querySelector('li.editing');
    if (editingLi && !editingLi.contains(ev.target)) {
      cancelEdit(todo);  
      detachOutsideClickHandler();
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
