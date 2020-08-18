import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AdminRouter from './routers/AdminRouter';
import UserRouter from './routers/UserRouter';
import AppRouter from './routers/AppRouter';
import configureStore from './store/configureStore';
import Login from './components/Login';
import AdalConfig from './config/AdalConfig';
import AuthContext from './services/auth';
import 'normalize.css/normalize.css';
import './styles/styles.scss';

//   getRequest = async(url, header, params)

const store = configureStore();

AuthContext.handleWindowCallback();

// if (window === window.parent && window === window.top && !AuthContext.isCallback(window.location.hash)) {
//   if (!AuthContext.getCachedToken(AdalConfig.clientId) || !AuthContext.getCachedUser()) {
//       ReactDOM.render(<Login />, document.getElementById('app'));
//   } else if (AuthContext._user.profile.roles.find( elm => elm == 'Desk-Booking-Tool-Admin-Role')) {  // If theyre an admin
//       AuthContext.acquireToken(
//           AdalConfig.endpoints.api, (message, token) => {
//               if (token) {
//                   ReactDOM.render(
//                   <Provider store={store}>
//                     <AppRouter />
//                   </Provider>,
//                   document.getElementById('app')
//                   );
//               }
//           },
//       );
//   } else {  // If theyre an admin
//     AuthContext.acquireToken(
//         AdalConfig.endpoints.api, (message, token) => {
//             if (token) {
//                 ReactDOM.render(
//                 <Provider store={store}>
//                   <UserRouter />
//                 </Provider>,
//                 document.getElementById('app')
//                 );
//             }
//         },
//     );
// }
// }

if (
  window === window.parent &&
  window === window.top &&
  !AuthContext.isCallback(window.location.hash)
) {
  if (
    !AuthContext.getCachedToken(AdalConfig.clientId) ||
    !AuthContext.getCachedUser()
  ) {
    ReactDOM.render(<Login />, document.getElementById('app'));
  } else {
    AuthContext.acquireToken(AdalConfig.endpoints.api, (message, token) => {
      if (token) {
        if (
          AuthContext._user.profile.roles.find(
            (elm) => elm == 'Desk-Booking-Tool-Admin-Role'
          )
        ) {
          ReactDOM.render(
            <Provider store={store}>
              <AdminRouter user={AuthContext._user} />
            </Provider>,
            document.getElementById('app')
          );
        } else {
          ReactDOM.render(
            <Provider store={store}>
              <UserRouter user={AuthContext._user} />
            </Provider>,
            document.getElementById('app')
          );
        }
      }
    });
  }
}
