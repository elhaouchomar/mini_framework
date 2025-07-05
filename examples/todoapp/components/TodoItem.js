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

  /* ---------- normal view ------------- */
  const children = [
    h('div', { class: 'view' }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed
      }),
      h('label', {}, todo.text),
      h('button', { class: 'destroy' })
    ])
  ];

  /* ---------- edit mode --------------- */
  if (isEditing) {
    children.push(
      h('input', {
        class: 'edit',
        value: editingValue,
        ref: (el) => {
          if (el) {
            el.focus();
            // put cursor at end
            el.setSelectionRange(el.value.length, el.value.length);
          }
        }
      })
    );
  }

  return h('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-todo-id': todo.id,
    key: todo.id                       // helps the diff algorithm
  }, children);
};
