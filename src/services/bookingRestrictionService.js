require('dotenv').config();
import HttpService from './HttpService';
/** URL for API */
const URL = process.env.REACT_APP_API;

/**
 * favourite service class
 */
class BookingRestrictionService {
  /**
   * constructor
   */
  constructor() {
    /**
     * http service
     */
    this.httpService = new HttpService();
  }

  /**
   * call http service to get Restrictions
   */
  getRestrictions() {
    const url = `http://${URL}/restrictions`;
    const result = this.httpService.getRequest(url, {}, {});
    return result || null;
  }

  /**
   * call http service to post a new restrictio
   */
  postRestrictions(continuous, ahead) {
    const url = `http://${URL}/restrictions`;
    const body = {
      continuous,
      ahead,
    };
    return this.httpService.postRequest(url, {}, {}, body);
  }
}

export default BookingRestrictionService;
