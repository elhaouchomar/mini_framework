import { h, events } from '../../../framework/core.js';
import { TodoItem } from './TodoItem.js';
import { store } from '../../../framework/state.js';

export const TodoList = (todos) => {
  return h('ul', { class: 'todo-list' }, todos.map(todo => TodoItem(todo)));
};

// Setup event handlers for all todo items using Event Manager
export const setupTodoListEvents = (todos) => {
  events.setupTodoListEvents(todos, store);
};
