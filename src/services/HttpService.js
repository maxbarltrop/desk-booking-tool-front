import axios from 'axios';
/**
 * http service to backend
 */
class HttpService {
  /**
   * get request
   */
  getRequest = async(url, header, params) => axios({
      method: 'get',
      url,
      params,
    })
      .then((response) => response.data)
      .catch(() => null);

  /**
   * post request
   */
  postRequest = async(url, header, params, body) => axios({
      method: 'post',
      header,
      params,
      url,
      data: body,
    })
      .then((response) => response.data)
      .catch(() => null);

  /**
   * put request
   */
  putRequest = async(url, header, params, body) => axios({
      method: 'put',
      header,
      params,
      url,
      data: body,
    })
      .then((response) => response.data)
      .catch((error) => error);

  /**
   * delete request
   */
  deleteRequest = async(url, header, params, body) => axios({
      method: 'delete',
      header,
      params,
      url,
      data: body,
    })
      .then((response) => response.status)
      .catch((error) => error);
}

export default HttpService;
