/**
 * reducer for the user's floorplan .
 */
export default (state = null, action) => {
  switch (action.type) {
    case 'IMAGE':
      return action.payload;
    default:
      return state;
  }
};
