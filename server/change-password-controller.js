/**
*
* @licstart  The following is the entire license notice for the JavaScript code in this file.
*
* UI for merging MARC records
*
* Copyright (C) 2015-2017 University Of Helsinki (The National Library Of Finland)
*
* This file is part of marc-merge-ui
*
* marc-merge-ui program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* oai-pmh-server-backend-module-melinda is distributed in the hope that it will be useful,
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

import express from 'express';
import HttpStatus from 'http-status-codes';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsOptions } from 'server/utils';
import { readSessionMiddleware } from 'server/session-controller';

export const changePasswordController = express();

changePasswordController.use(cookieParser());
changePasswordController.use(bodyParser.json());
changePasswordController.use(readSessionMiddleware);
changePasswordController.set('etag', false);

changePasswordController.options('/', cors(corsOptions)); // enable pre-flight

changePasswordController.post('/', cors(corsOptions), requireSession, (req, res) => {
  setTimeout(() => {
    res.sendStatus(200);
  }, 1000);
});


function requireSession(req, res, next) {
  const username = req.session.username;
  const password = req.session.password;

  if (username && password) {
    return next();
  } else {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
  }
}
