/**
 * reducer for the navbar tab.
 */
export default (state = 'view', action) => {
  switch (action.type) {
    case 'TAB':
      return action.payload;
    default:
      return state;
  }
};
