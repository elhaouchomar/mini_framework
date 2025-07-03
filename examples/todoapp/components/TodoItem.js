import { h } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  const children = [];

  // View mode
  if (!isEditing) {
    children.push(
      h('div', {
        class: 'view'
      }, [
        h('input', {
          class: 'toggle',
          type: 'checkbox',
          checked: todo.completed,
          'data-todo-id': todo.id,
          'data-action': 'toggle'
        }),
        h('label', {
          'data-todo-id': todo.id,
          'data-action': 'edit'
        }, todo.text),
        h('button', {
          class: 'destroy',
          'data-todo-id': todo.id,
          'data-action': 'destroy'
        })
      ])
    );
  }

  // Edit mode
  if (isEditing) {
    children.push(
      h('input', {
        class: 'edit',
        value: editingValue,
        'data-todo-id': todo.id,
        'data-action': 'edit-input',
        ref: (el) => {
          if (el) {
            el.focus();
            el.setSelectionRange(el.value.length, el.value.length);
          }
        }
      })
    );
  }

  return h('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-todo-id': todo.id,
    key: todo.id 
  }, children);
};