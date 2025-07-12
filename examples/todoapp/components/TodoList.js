/* components/TodoList.js --------------------------------------- */
import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/* ───────────────── TodoItem ───────────────── */
export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  /* view (toggle-label-destroy) */
  const viewDiv = createVNode('div', {
    class: 'view',
    ondblclick: e => {
      if (e.target.type === 'checkbox') return;
      store.setState({
        ...store.getState(),
        editingId: todo.id,
        editingValue: todo.text
      });
    }
  }, [
    createVNode('input', {
      class: 'toggle',
      type: 'checkbox',
      checked: todo.completed,
      onchange: () => {
        const { todos } = store.getState();
        store.setState({
          ...store.getState(),
          todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
        });
      }
    }),
    createVNode('label', {}, todo.text),
    createVNode('button', {
      class: 'destroy',
      onclick: () => {
        const { todos } = store.getState();
        store.setState({
          ...store.getState(),
          todos: todos.filter(t => t.id !== todo.id)
        });
      }
    })
  ]);

  /* edit input (always in DOM, only visible while editing) */
  const editInput = createVNode('input', {
    class: 'edit',
    value: isEditing ? editingValue : todo.text,
    key: 'edit',
    oninput: e => store.setState({ ...store.getState(), editingValue: e.target.value }),
    onkeydown: e => { if (e.key === 'Enter') commit(todo); },
    onblur: () => commit(todo),
    ref: el => { if (isEditing && el) { el.focus(); el.selectionStart = el.value.length; } }
  });

  return createVNode('li', {
    class: `${todo.completed ? 'completed ' : ''}${isEditing ? 'editing' : ''}`,
    key: todo.id,
    'data-todo-id': 'todo-item'
  }, [viewDiv, editInput]);
};

/* commit helper */
function commit(todo) {
  const { editingId, editingValue, todos } = store.getState();
  if (editingId !== todo.id) return;

  const text = editingValue.trim();
  store.setState({
    ...store.getState(),
    todos: text
      ? todos.map(t => t.id === todo.id ? { ...t, text } : t)
      : todos.filter(t => t.id !== todo.id),
    editingId: null,
    editingValue: ''
  });
}

/* ─────────── TodoList wrapper ─────────── */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

export default TodoList;
