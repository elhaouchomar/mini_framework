import { createVNode, events } from '../../../framework/core.js';
import { store } from '../../../framework/state.js';

export const TodoItem = (todo) => {
  const { editingId, editingValue } = store.getState();
  const isEditing = editingId === todo.id;

  const children = [
    createVNode('div', { class: 'view', ondblclick: (e) => editeView(e, todo) }, [
      createVNode('input', { class: 'toggle', onchange: () => checkbox(todo), type: 'checkbox', checked: todo.completed }),
      createVNode('label', {}, todo.text),
      createVNode('button', { class: 'destroy', onclick: () => destroy(todo) })
    ]),

    createVNode('input', {
      onfocus: (e) => {
        e.target.setSelectionRange(e.target.value.length, e.target.value.length)
      },
      class: 'edit',
      key: 'edit',
      value: isEditing ? editingValue : todo.text,
      style: { display: isEditing ? '' : 'none' },
      onkeydown: (e) => editInp(e, todo),
      onblur: () => editInpblur(todo),
       ref: isEditing
        ? (el) => {
          if (el) {                        
            el.focus();
          }
        }
        : null 
    })
  ];

  return createVNode('li', {
    class: `${todo.completed ? 'completed' : ''}${isEditing ? ' editing' : ''}`,
    'data-testid': 'todo-item',
    key: todo.id                       // helps the diff algorithm
  }, children);
};

/* ---------- UI ---------- */
export const TodoList = (items) =>
  createVNode('ul', { class: 'todo-list' }, items.map(TodoItem));

/* ---------- behaviour ---------- */
const editeView = (e, todo) => {
  if (e.target.type === 'checkbox') return;
  store.setState({ ...store.getState(), editingId: todo.id, editingValue: todo.text });
  
}


const checkbox = (todo) => {
  const { todos } = store.getState();
  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
  });
}

/* destroy */
const destroy = (todo) => {
  const { todos } = store.getState();
  store.setState({ ...store.getState(), todos: todos.filter(t => t.id !== todo.id) })
}


const editInp = (e, todo) => {
  if (e.key === 'Enter') {
    saveEdit(todo);
    return
  } 
  store.setState({ ...store.getState(), editingValue: e.target.value });
}
const editInpblur = (todo) => {
  const { editingId } = store.getState();
  if (editingId === todo.id) cancelEdit();
}


function saveEdit(todo) {
  const { editingValue, todos } = store.getState();
  const text = editingValue.trim();

  if (!text) {            // empty → delete
    store.setState({
      ...store.getState(),
      todos: todos.filter(t => t.id !== todo.id),
      editingId: null, editingValue: ''
    });
    return;
  }

  store.setState({
    ...store.getState(),
    todos: todos.map(t => t.id === todo.id ? { ...t, text } : t),
    editingId: null, editingValue: ''
  });
}


function cancelEdit() {
  store.setState({ ...store.getState(), editingId: null, editingValue: '' });
}