import { h } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const Header = () => {
  return h('header', { class: 'header' }, [
    h('h1', {}, 'todos'),
    h('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      onKeyDown: (e) => {
        if (e.key === 'Enter') {
          const value = e.target.value.trim();
          if (value) {
            const newTodo = {
              id: Date.now(),
              text: value,
              completed: false
            };
            const currentState = store.getState();
            store.setState({
              ...currentState,
              todos: [...currentState.todos, newTodo]
            });
            e.target.value = '';
          }
        }
      }
    })
  ]);
};