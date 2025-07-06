import { h } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

/**
 * One Todo list item
 * – shows a checkbox, label, destroy button in view mode
 * – when its id === store.editingId it switches to an <input class="edit">
 */
export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  /* children are ALWAYS length 2, just toggled via style */
  const children = [
    h('div', { class: 'view', key: 'view' }, [
      h('input', { class: 'toggle', type: 'checkbox', checked: todo.completed }),
      h('label', {}, todo.text),
      h('button', { class: 'destroy' })
    ]),

    h('input', {
      class: 'edit',
      key: 'edit',
      value: isEditing ? editingValue : todo.text,
      style: { display: isEditing ? '' : 'none' },
      ref: isEditing
        ? (el) => {
          if (el) {
            el.focus();
            el.setSelectionRange(el.value.length, el.value.length);
          }
        }
        : null
    })
  ];

  return h('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-todo-id': todo.id,
    key: todo.id                       // helps the diff algorithm
  }, children);
};
