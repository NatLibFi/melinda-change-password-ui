/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* Common modules for Melinda UI applications
*
* Copyright (C) 2016-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of melinda-ui-commons
*
* melinda-ui-commons program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* melinda-ui-commons is distributed in the hope that it will be useful,
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
import { connect } from 'react-redux';
import classNames from 'classnames';

import '../../styles/components/change-password-form-panel.scss';

export class ChangePasswordFormPanel extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired,
  }

  constructor() {
    super();

    this.state = {
      password: '',
      password_verify: '',
      password_active: false,
      password_verify_active: false,
      passwords_match: true,
      form_valid: false
    };
  }

  updatePassword(event) {
    event.persist();

    this.setState((state) => {
      const { id, value } = event.target;

      const newState = {
        ...{
          password: state.password,
          password_verify: state.password_verify
        },
        [id]: value,
        [id + "_active"]: true,
      };

      newState.passwords_match = this.verifyPasswords(newState);
      newState.form_valid = this.validateForm(newState);

      return newState;
    })
  }

  blurInput(event) {
    event.persist();

    this.setState((state) => {
      const { id } = event.target;

      const newState = {
        [id + "_active"]: false
      };

      return newState;
    });
  }

  verifyPasswords(state = this.state) {
    return state.password.length === 0 || state.password_verify.length === 0 || state.password === state.password_verify;
  }

  validateForm(state = this.state) {
    return state.password.length > 0 && state.password_verify.length > 0 && state.password === state.password_verify;
  }


  executeSave(event) {
    event.preventDefault();
    
    const { password, password_verify } = this.state;

    this.props.onSave(password, password_verify);
  }

  renderPreloader() {
    return (
      <div className="progress">
        <div className="indeterminate" />
      </div>
    );
  }

  isSaveButtonDisabled() {
    return !this.state.form_valid ? 'disabled': '';
  }

  render() {
    const { title } = this.props;

    const passwordLabel = 'Salasana';
    const passwordVerifyLabel = 'Salasana uudelleen';
    const saveButtonLabel = 'Tallenna';

    const { password, password_verify, passwords_match, password_active, password_verify_active } = this.state;

    return (

      <div className="card change-password-form-panel valign">
      
        <div className="card-panel teal lighten-2">
          <h4>{title}</h4>
        </div>

        <div className="card-content">
         
          <form>
            <div className="col s2 offset-s1 input-field">
              <input id="password" type="password" value={password} onChange={this.updatePassword.bind(this)} onBlur={this.blurInput.bind(this)} />
              <label htmlFor="password">{passwordLabel}</label>
            </div>

            <div className="col s2 offset-s1 input-field">
              <input id="password_verify" type="password" className={classNames({'invalid': !password_verify_active && !passwords_match})} value={password_verify} onChange={this.updatePassword.bind(this)} onBlur={this.blurInput.bind(this)} />
              <label htmlFor="password_verify">{passwordVerifyLabel}</label>
            </div>

            <div className="spacer" />
            {!password_active && !password_verify_active && !passwords_match ? 'Salasanat eivät täsmää' : null}
            <div className="spacer" />

            <div className="right-align">
              <button className="btn waves-effect waves-light" type="submit" disabled={this.isSaveButtonDisabled()} name="action" onClick={this.executeSave.bind(this)}>{saveButtonLabel}
                <i className="material-icons right">send</i>
              </button>
            </div>
          </form>
        
        </div>

        {this.props.sessionState === 'SIGNIN_ONGOING' ? this.renderPreloader():''}
          
      </div>

    );
  }
}