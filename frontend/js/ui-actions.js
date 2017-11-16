import fetch from 'isomorphic-fetch';
import HttpStatus from 'http-status-codes';

import { FetchNotOkError } from './errors';
import { exceptCoreErrors } from './utils';

export function changePassword(password, password_verify) {
  const APIBasePath = __DEV__ ? 'http://localhost:3001/change_password': '/change_password';

  return function(dispatch) {
    
    dispatch(executeChangePassword());

    const fetchOptions = {
      method: 'POST',
      body: JSON.stringify({
        password,
        password_verify
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      credentials: 'include'
    };

    return fetch(`${APIBasePath}`, fetchOptions)
      .then(validateResponseStatus)
      .then(() => {
        dispatch(changePasswordSuccess());
      }).catch(exceptCoreErrors((error) => {
        if (error instanceof FetchNotOkError) {
          switch (error.response.status) {
            case HttpStatus.INTERNAL_SERVER_ERROR: return dispatch(changePasswordFailure('Salasanan vaihdossa tapahtui virhe.'));
          }
        }
              
        dispatch(changePasswordFailure('There has been a problem with change operation: ' + error.message));
      }));
  };
}

export const EXECUTE_CHANGE_PASSWORD = 'EXECUTE_CHANGE_PASSWORD';

export function executeChangePassword() {
  return {
    type: EXECUTE_CHANGE_PASSWORD
  };
}

export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';

export function changePasswordSuccess() {
  return {
    type: CHANGE_PASSWORD_SUCCESS
  };
}

export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE';

export function changePasswordFailure(error) {
  return {
    type: CHANGE_PASSWORD_FAILURE,
    error
  };
}

function validateResponseStatus(response) {
  if (response.status !== HttpStatus.OK) {
    throw new FetchNotOkError(response);
  }
  return response;
}