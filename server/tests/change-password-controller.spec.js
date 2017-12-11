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
import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import request from 'supertest';
import HttpStatus from 'http-status-codes';
import { changePasswordController } from '../change-password-controller';
import { __RewireAPI__ as changePasswordControllerRewireAPI } from '../change-password-controller';
import { createSessionToken } from 'server/session-crypt';

chai.use(sinonChai);

const sessionToken = createSessionToken('test-user', 'test-pass');

describe('changePasswordController', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub();

    changePasswordControllerRewireAPI.__Rewire__('fetch', fetchStub);
  });

  afterEach(() => {
    changePasswordControllerRewireAPI.__ResetDependency__('fetch');
  });

  describe('fetch', () => {

    it('returns 200', (done) => {
      fetchStub.returns(Promise.resolve({status: HttpStatus.OK}));

      request(changePasswordController)
        .post('/')
        .send({
          password: 'test',
          password_verify: 'test'
        })
        .set('Cookie', `sessionToken=${sessionToken}`)
        .expect(HttpStatus.OK, done);
    });

    it('returns 500', (done) => {
      fetchStub.returns(Promise.resolve({status: HttpStatus.INTERNAL_SERVER_ERROR}));

      request(changePasswordController)
        .post('/')
        .send({
          password: 'test',
          password_verify: 'test'
        })
        .set('Cookie', `sessionToken=${sessionToken}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR, done);
    });
  });

  it('returns 400 when password dont match', (done) => {
    request(changePasswordController)
      .post('/')
      .send({
        password: 'test',
        password_verify: 'testt'
      })
      .set('Cookie', `sessionToken=${sessionToken}`)
      .expect(HttpStatus.BAD_REQUEST, done);
  });

  describe('validatePassword', () => {
    it('returns 400 when when password is empty', (done) => {
      request(changePasswordController)
        .post('/')
        .send({
          password: '',
          password_verify: ''
        })
        .set('Cookie', `sessionToken=${sessionToken}`)
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it('returns 400 when when password is too long', (done) => {
      request(changePasswordController)
        .post('/')
        .send({
          password: '12345678901',
          password_verify: '12345678901'
        })
        .set('Cookie', `sessionToken=${sessionToken}`)
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it('returns 400 when when password is contains illegal characters', (done) => {
      request(changePasswordController)
        .post('/')
        .send({
          password: 'test#',
          password_verify: 'test#'
        })
        .set('Cookie', `sessionToken=${sessionToken}`)
        .expect(HttpStatus.BAD_REQUEST, done);
    });
  });
});