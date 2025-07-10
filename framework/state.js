// State Managment

let state = {
  todos: [],
  filter: 'all',
  editingId: null,
  editingValue: null
};

let subscribers = [];

export const store = {
  getState() {
    // return shallow copy
    
    return { ...state };
  },

  setState(newState) {
    // Create a new state object to ensure change detection
   
    state = {
      // ...state,
      ...newState,
      // todos: newState.todos ? [...newState.todos] : state.todos
    };


    // Notify all subscribers
    subscribers.forEach(subscriber => {
      subscriber()});
  },
  
  subscribe(callback) {
    // we have just mount function in the app.js
    subscribers.push(callback);
    return () => {
      // we gonna need it in the Bomberman game to unmount
       subscribers = subscribers.filter(sub => sub !== callback);
     };
  }
};
