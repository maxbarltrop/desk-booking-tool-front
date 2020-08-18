/**
 * reducer for the Restriction info.
 */
export default (state = null, action) => {
  switch (action.type) {
    case 'RESTRICT':
      return action.payload;
    default:
      return state;
  }
};
