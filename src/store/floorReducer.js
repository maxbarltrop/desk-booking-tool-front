/**
 * reducer for the Identification info.
 */
export default (state = null, action) => {
  switch (action.type) {
    case 'FLOOR':
      return action.payload;
    default:
      return state;
  }
};
