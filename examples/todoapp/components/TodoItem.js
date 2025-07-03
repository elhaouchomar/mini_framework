import { h } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  const children = [];

  children.push(
    h('div', {
      class: 'view'
    }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed
      }),
      h('label', {}, todo.text),
      h('button', {
        class: 'destroy'
      })
    ])
  );

  if (isEditing) {
    children.push(
      h('input', {
        class: 'edit',
        value: editingValue,
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
