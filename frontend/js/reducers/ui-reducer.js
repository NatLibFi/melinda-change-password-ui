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

import { Map } from 'immutable';
import { EXECUTE_CHANGE_PASSWORD, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE } from '../ui-actions';

const INITIAL_STATE = Map({
  state: 'READY'
});

export default function ui(state = INITIAL_STATE, action) {

  switch(action.type) {
    case EXECUTE_CHANGE_PASSWORD: 
      return state.set('state', 'LOADING');

    case CHANGE_PASSWORD_SUCCESS:
      return state.set('state', 'SUCCESS');

    case CHANGE_PASSWORD_FAILURE:
      return state
        .set('state', 'FAILURE')
        .set('error', action.error);
  } 

  return state;
}