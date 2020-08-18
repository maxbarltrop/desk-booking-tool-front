/**
 * reducer for the Restriction info.
 */
export default (state = {currentContinuous: 0, currentAhead: 0}, action) => {
    switch (action.type) {
      case 'CURRENTRESTRICTIONS':
        return action.payload;
      default:
        return state;
    }
  };
  