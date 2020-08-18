require('dotenv').config();
import HttpService from './HttpService';
/** URL for API */
const URL = process.env.REACT_APP_API;

class FloorService {
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
   * call http service to post a new restrictio
   */
  async editFloors(body) {
    const url = `http://${URL}/floors`;
    return await this.httpService.putRequest(url, {}, {}, body);
  }
  
  /**
   * call http service to get Restrictions
   */
  async getFloors(body) {
    const url = `http://${URL}/floors`;
    const result = await this.httpService.getRequest(url, {}, body);
    return result || null;
  }
}

export default FloorService;
