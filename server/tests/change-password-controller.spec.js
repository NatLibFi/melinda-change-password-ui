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
* melinda-eresource-tool is distributed in the hope that it will be useful,
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

import request from 'supertest';
import HttpStatus from 'http-status-codes';
import { changePasswordController } from '../change-password-controller';
import { createSessionToken } from 'server/session-crypt';

const sessionToken = createSessionToken('test-user', 'test-pass');

describe('Change Password Controller', () => {
  it('returns 200', (done) => {

    request(changePasswordController)
      .post('/')
      .set('Cookie', `sessionToken=${sessionToken}`)
      .expect(HttpStatus.OK, done);
      
  });
});
