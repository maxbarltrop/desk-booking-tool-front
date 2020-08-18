require('dotenv').config();
import HttpService from './HttpService';
/** URL for API */
const URL = process.env.REACT_APP_API;

class BookingService {
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
  async getBookings(body) {
    const url = `http://${URL}/bookings`;
    const result = await this.httpService.getRequest(url, {}, body);
    return result || null;
  }

  async getBooking(body) {
    const url = `http://${URL}/booking`;
    const result = await this.httpService.getRequest(url, {}, body);
    return result || null;
  }

  /**
   * call http service to post a new restrictio
   */
  async postBooking(body) {
    const url = `http://${URL}/booking`;
    return this.httpService.postRequest(url, {}, {}, body);
  }
}

export default BookingService;
