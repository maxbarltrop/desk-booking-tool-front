/**
 * reducer for the View info.
 */
export default (state = null, action) => {
  switch (action.type) {
    case 'USER':
      return action.payload;
    default:
      return state;
  }
};
