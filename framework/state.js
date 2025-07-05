// State Managment

let state = {
  todos: [],
  filter: 'all'
};

let subscribers = [];

export const store = {
  getState() {
    // return shallow copy
    console.log("Get State", state);
    
    return { ...state };
  },

  setState(newState) {
    // Create a new state object to ensure change detection
   
    console.log("STATE", state);
    console.log("NEW STATE", newState);
    
    state = {
      // ...state,
      ...newState,
      // todos: newState.todos ? [...newState.todos] : state.todos
    };


    // Notify all subscribers
    console.log("subscribers", subscribers);

    subscribers.forEach(subscriber => subscriber());
  },

  subscribe(callback) {
    subscribers.push(callback);
    return () => {
      subscribers = subscribers.filter(sub => sub !== callback);
    };
  }
};
