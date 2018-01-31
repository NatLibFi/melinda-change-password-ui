/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for changing passwords
*
* Copyright (C) 2015-2017 University Of Helsinki (The National Library Of Finland)
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
import { combineReducers } from 'redux-immutable';
import { RESET_STATE } from 'commons/constants/action-type-constants';
import session from 'commons/reducers/session-reducer';
import ui from './reducers/ui-reducer';

export default function reducer(state = Map(), action) {
  if (action.type === RESET_STATE) {
    state = Map();
  }

  return combinedRootReducer(state, action);
}

export const combinedRootReducer = combineReducers({
  session,
  ui
});
