/**
 * reducer for the View info.
 */
export default (state = null, action) => {
  switch (action.type) {
    case 'BOOKINGINFO':
      return action.payload;
    default:
      return state;
  }
};
