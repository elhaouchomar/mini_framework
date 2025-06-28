import { h } from '../../../framework/core.js';
import { TodoItem } from './TodoItem.js';

export const TodoList = (todos) =>
  h('ul', { class: 'todo-list' }, todos.map(todo => TodoItem(todo)));
