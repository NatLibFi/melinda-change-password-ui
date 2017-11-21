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
import HttpStatus from 'http-status-codes';
import * as actions from '../js/ui-actions';
import { __RewireAPI__ as ActionsRewireAPI } from '../js/ui-actions';

require('sinon-as-promised');

chai.use(sinonChai);
const expect = chai.expect;

describe('ui actions', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub();

    ActionsRewireAPI.__Rewire__('fetch', fetchStub);
  });

  afterEach(() => {
    ActionsRewireAPI.__ResetDependency__('fetch');
  });

  describe('changePassword', () => {
    it('should dispatch changePasswordSuccess', () => {   
      fetchStub.returns(Promise.resolve({status: HttpStatus.OK}));

      const calledActions = [];

      const dispatchSpy = (action) => {
        calledActions.push(action);
      };

      actions.changePassword()(dispatchSpy).then(() => {
        expect(calledActions).to.eql([
          actions.executeChangePassword(),
          actions.changePasswordSuccess()
        ]);
      });
    });

    it('should dispatch changePasswordFailure on 500', () => {   
      fetchStub.returns(Promise.resolve({status: HttpStatus.INTERNAL_SERVER_ERROR}));

      const calledActions = [];

      const dispatchSpy = (action) => {
        calledActions.push(action);
      };

      actions.changePassword()(dispatchSpy).then(() => {
        expect(calledActions).to.eql([
          actions.executeChangePassword(),
          actions.changePasswordFailure('Salasanan vaihdossa tapahtui virhe.')
        ]);
      });       
    });

    it('should dispatch changePasswordFailure on system error', () => {   
      fetchStub.returns(Promise.reject({message: 'something'}));

      const calledActions = [];

      const dispatchSpy = (action) => {
        calledActions.push(action);
      };

      actions.changePassword()(dispatchSpy).then(() => {
        expect(calledActions).to.eql([
          actions.executeChangePassword(),
          actions.changePasswordFailure('There has been a problem with change operation: something')
        ]);
      });       
    });
  });
});
