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
import express from 'express';
import HttpStatus from 'http-status-codes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsOptions, readEnvironmentVariable } from 'server/utils';
import { readSessionMiddleware } from 'server/session-controller';

export const changePasswordController = express();

const ALEPH_CHANGE_PASSWORD_API_URL = readEnvironmentVariable('ALEPH_CHANGE_PASSWORD_API_URL');

const illegalCharacters = '#';
const maxLength = 10;

changePasswordController.use(cookieParser());
changePasswordController.use(bodyParser.json());
changePasswordController.use(readSessionMiddleware);
changePasswordController.set('etag', false);

changePasswordController.options('/', cors(corsOptions)); // enable pre-flight

changePasswordController.post('/', cors(corsOptions), requireSession, (req, res) => {
  const { username, password } = req.session;

  if (req.body.password !== req.body.password_verify) {
    return res.status(400).send({
      status: 'Bad Request',
      error: 'Salasanat eivät täsmää'
    });
  } 

  const validation = validatePassword(req.body.password);

  if (!validation.valid) {
    return res.status(400).send({
      status: 'Bad Request',
      error: validation.error
    });
  } 

  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      new_password: req.body.password
    }),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    credentials: 'include'
  };

  return fetch(ALEPH_CHANGE_PASSWORD_API_URL, fetchOptions)
    .then(validateResponseStatus)
    .then(() => {
      res.sendStatus(200);
    }).catch((error) => {
      res.status(error.status).send({
        status: error.response.statusText
      });
    });
});

function validatePassword(password) {
  if (password.length === 0) {
    return {
      valid: false,
      error: 'Salasana ei saa olla tyhjä'
    };
  }

  if (password.match(new RegExp(illegalCharacters))) {
    return {
      valid: false,
      error: `Salasanassa kiellettyjä merkkejä (${illegalCharacters})`
    };
  }

  if (password.length > maxLength) {
    return {
      valid: false,
      error: `Salasanan pituus ei saa ylittää ${maxLength} merkkiä`
    };
  }

  return {
    valid: true
  };
}

function requireSession(req, res, next) {
  const username = req.session.username;
  const password = req.session.password;

  if (username && password) {
    return next();
  } else {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}

function validateResponseStatus(response) {
  if (response.status !== HttpStatus.OK) {
    throw new FetchNotOkError(response);
  }
  return response;
}

export function FetchNotOkError(response) {
  var temp = Error.apply(this, [response.statusText]);
  temp.name = this.name = 'FetchNotOkError';
  this.stack = temp.stack;
  this.message = temp.message;
  this.response = response;
  this.status = response.status;
}

FetchNotOkError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: FetchNotOkError,
    writable: true,
    configurable: true
  }
});
