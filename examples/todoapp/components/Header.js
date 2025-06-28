import { h } from '../../../framework/core.js';
import { store } from '../../../framework/store.js';

export const Header = () => {
  // Track input value using component state
  let inputValue = '';

  return h('header', { class: 'header' }, [
    h('h1', {}, 'todos'),
    h('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      value: inputValue, // Controlled component
      onInput: (e) => {
        inputValue = e.target.value;
      },
      onKeydown: (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
          const newTodo = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false
          };
          const currentTodos = store.getState().todos;
          store.setState({
            ...store.getState(),
            todos: [...currentTodos, newTodo]
          });
          inputValue = ''; // Reset input value
          e.target.value = ''; // Clear the input field
        }
      }
    })
  ]);
};