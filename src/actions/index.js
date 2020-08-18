export const setBookingInfo = (obj) => ({
  type: 'BOOKINGINFO',
  payload: obj,
});

export const setIdentification = (obj) => ({
  type: 'IDENTIFICATION',
  payload: obj,
});

export const setDesk = (desk) => ({
  type: 'DESK',
  payload: desk,
});

export const setFloor = (floor) => ({
  type: 'FLOOR',
  payload: floor,
});
export const setLimit = (limit) => ({
  type: 'LIMIT',
  payload: limit,
});

export const setEmail = (email) => ({
  type: 'EMAIL',
  payload: email,
});

export const setBookingView = (obj) => ({
  type: 'BOOKINGVIEW',
  payload: obj,
});

/**
 * @param {object} obj contains the data for what floor you want to view the info for
 */
export const setViewInfo = (obj) => ({
  type: 'VIEW',
  payload: obj,
});

/**
 * @param {string} tab contains thetab to set the navbar to
 */
export const setTab = (tab) => ({
  type: 'TAB',
  payload: tab,
});

/** What floor/office you want to set restrictions for*/
export const setRestInfo = (obj) => ({
  type: 'RESTRICT',
  payload: obj,
});

/** bPublish some restrictions*/
export const setBookingRestrictions = (obj) => ({
  type: 'CURRENTRESTRICTIONS',
  payload: obj,
});

/** Image for adding a floor */
export const setImage = (img) => ({ type: 'IMAGE', payload: img });

/** Image for adding a floor */
export const setUser = (user) => ({ type: 'USER', payload: user });
