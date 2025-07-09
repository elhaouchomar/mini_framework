import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';
import { TodoItem } from './TodoItem.js';

/* ---------- UI ---------- */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

/* ---------- behaviour ---------- */
export const setupTodoListEvents = (todos) => {
  todos.forEach(setupTodoItemEvents);
};

function setupTodoItemEvents(todo) {
  const root = document.querySelector(`[data-todo-id="${todo.id}"]`);
  if (!root) return;

  const view = root.querySelector('.view');
  const checkbox = root.querySelector('.toggle');
  const destroy = root.querySelector('.destroy');
  const editInp = root.querySelector('.edit');

  /* dbl-click label → edit mode */
  events.on(view, 'dblclick', (e) => {
    if (e.target.type === 'checkbox') return;
    store.setState({ ...store.getState(), editingId: todo.id, editingValue: todo.text });
  });

  /* checkbox toggle */
  events.on(checkbox, 'change', () => {
    const { todos } = store.getState();
    store.setState({
      ...store.getState(),
      todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
    });
  });

  /* destroy */
  events.on(destroy, 'click', () => {
    const { todos } = store.getState();
    store.setState({ ...store.getState(), todos: todos.filter(t => t.id !== todo.id) });
  });

  /* edit field */
  events.on(editInp, 'input', e => {
    store.setState({ ...store.getState(), editingValue: e.target.value });
  });

  events.on(editInp, 'keydown', e => {
    if (e.key === 'Enter') saveEdit();
  });
  events.on(editInp, 'blur', () => {
    const { editingId } = store.getState();
    if (editingId === todo.id) cancelEdit();
  });

  function saveEdit() {
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
}
