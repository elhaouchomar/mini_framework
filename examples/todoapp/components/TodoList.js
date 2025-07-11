import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  /* children are ALWAYS length 2, just toggled via style */
  const children = [
    createVNode('div', { class: 'view', ondblclick: (e) => editeView(e, todo) }, [
      createVNode('input', { class: 'toggle', onchange: () => checkbox(todo), type: 'checkbox', checked: todo.completed }),
      createVNode('label', {}, todo.text),
      createVNode('button', { class: 'destroy', onclick: () => destroy(todo) })
    ]),

    createVNode('input', {
      class: 'edit',
      oninput: (e) => editInput(e, todo),
      key: 'edit',
      value: isEditing ? editingValue : todo.text,
      style: { display: isEditing ? '' : 'none' },
      onkeydown: (e) => editInp(e, todo),
      onblur: () => editInpblur(todo),
      ref: isEditing
        ? (el) => {
          if (el) {
            el.focus();
            // el.setSelectionRange(el.value.length, el.value.length);
          }
        }
        : null
    })
  ];

  return createVNode('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-testid': 'todo-item',
    key: todo.id                       // helps the diff algorithm
  }, children);
};

/* ---------- UI ---------- */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

/* ---------- behaviour ---------- */
const editeView = (e, todo) => {
  if (e.target.type === 'checkbox') return;
  store.setState({ ...store.getState(), editingId: todo.id, editingValue: todo.text });
}
const editInput = e => {
  store.setState({ ...store.getState(), editingValue: e.target.value });
}

const checkbox = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
  });
}

/* destroy */
const destroy = (todo) => {
  const { todos } = store.getState();
  store.setState({ ...store.getState(), todos: todos.filter(t => t.id !== todo.id) })
}


const editInp = (e, todo) => {
  if (e.key === 'Enter') saveEdit(todo);
}
const editInpblur = (todo) => {
  const { editingId } = store.getState();
  if (editingId === todo.id) cancelEdit();
}


function saveEdit(todo) {
  const { editingValue, todos } = store.getState();
  const text = editingValue.trim();

  if (!text) {            // empty → delete
    store.setState({
      ...store.getState(),
      todos: todos.filter(t => t.id !== todo.id),
      editingId: null, editingValue: ''
    });
    return;
  }

  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, text } : t),
    editingId: null, editingValue: ''
  });
}


function cancelEdit() {
  store.setState({ ...store.getState(), editingId: null, editingValue: '' });
}