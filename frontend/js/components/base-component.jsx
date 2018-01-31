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

import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { removeSession } from 'commons/action-creators/session-actions';
import { changePassword } from '../ui-actions';
import { SigninFormPanelContainer } from 'commons/components/signin-form-panel';
import { NavBar } from './navbar';
import { ChangePasswordFormPanel } from './change-password-form-panel';


export class BaseComponent extends React.Component {

  static propTypes = {
    sessionState: PropTypes.string,
    removeSession: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    state: PropTypes.string,
    error: PropTypes.string
  }

  executeSave(password, password_verify) {
    this.props.changePassword(password, password_verify);
  }

  renderValidationIndicator() {
    return null;
  }

  renderSignin() {   
    return this.props.sessionState === 'VALIDATION_ONGOING' ? this.renderValidationIndicator() : <SigninFormPanelContainer title='Salasanan vaihto' />;
  }

  renderMainPanel() {
    return (
      <div>
        <NavBar removeSession={this.props.removeSession}/>
        <ChangePasswordFormPanel title="Salasanan vaihto" onSave={this.executeSave.bind(this)} removeSession={this.props.removeSession} state={this.props.state} error={this.props.error} />
      </div>
    );
  }

  render() {

    if (this.props.sessionState == 'SIGNIN_OK') {
      return this.renderMainPanel();
    } else if (this.props.sessionState == 'VALIDATION_ONGOING') {
      return this.renderValidationIndicator();
    } else {
      return this.renderSignin();
    }

  }
}

function mapStateToProps(state) {
  return {
    sessionState: state.getIn(['session', 'state']),
    state: state.getIn(['ui', 'state']),
    error: state.getIn(['ui', 'error'])
  };
}

export const BaseComponentContainer = connect(
  mapStateToProps, { removeSession, changePassword }
)(BaseComponent);

