import { h } from '../../../framework/core.js';
import { store } from '../../../framework/store.js';

export const TodoItem = (todo) => {
  return h('li', {
    class: todo.completed ? 'completed' : '',
    'data-id': todo.id
  }, [
    h('div', { class: 'view' }, [
      h('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onChange: () => {
          store.setState({
            todos: store.getState().todos.map(t =>
              t.id === todo.id ? { ...t, completed: !t.completed } : t
            )
          });
        }
      }),
      h('label', {}, todo.text),
      h('button', {
        class: 'destroy',
        onClick: () => {
          store.setState({
            todos: store.getState().todos.filter(t => t.id !== todo.id)
          });
        }
      })
    ])
  ]);
};
