import { h } from '../../../framework/core.js';

export const TodoItem = (todo) => {
  console.log("ToDoItem", todo);

  const isEditing = false; // This will be managed by the Event Manager

  const children = [];

  // في وضع العرض (non editing mode)
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

  // Add edit input if editing (managed by Event Manager)
  if (isEditing) {
    children.push(
      h('input', {
        class: 'edit',
        value: todo.text,
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
    key: todo.id // Add key for proper Virtual DOM diffing
  }, children);
};