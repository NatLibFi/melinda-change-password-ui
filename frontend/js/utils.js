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

export function exceptCoreErrors(fn) {

  return (error) => {
    if ([TypeError, SyntaxError, ReferenceError].find(errorType => error instanceof errorType)) {
      throw error;
    } else {
      return fn(error);
    }
  };
}

export function isControlField(field) {
  return field.subfields === undefined;
}

export function isCoreError(error) {
  return ([EvalError, RangeError, URIError, TypeError, SyntaxError, ReferenceError].some(errorType => error instanceof errorType));
}
