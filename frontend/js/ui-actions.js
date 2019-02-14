/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for changing passwords
*
* Copyright (C) 2015-2019 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-change-password-ui
*
* melinda-change-password-ui program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-change-password-ui is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* @licend  The above is the entire license notice
* for the JavaScript code in this file.
*
*/

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