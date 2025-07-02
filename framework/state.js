// state.js

let state = {
  todos: [],
  filter: 'all',
  editingId: null,   
  editingValue: '',  
};

let subscribers = [];

export const store = {
  getState() {
    return { ...state };
  },

  setState(newState) {
    state = { ...state, ...newState };
    subscribers.forEach(subscriber => subscriber());
  },

  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  }
};
