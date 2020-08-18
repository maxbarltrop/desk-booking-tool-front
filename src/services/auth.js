import AuthenticationContext from 'adal-angular';
import AdalConfig from '../config/AdalConfig';

window.Logging.log = (message) => {
    // eslint-disable-next-line no-console
    console.log(message);
};
window.Logging.level = 2;

export default new AuthenticationContext(AdalConfig);