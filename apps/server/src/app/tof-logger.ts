import {Logger} from '@nestjs/common';
import * as config from 'config';
import * as fs from 'fs';
import {IServerConfig} from './models/server-config';

const serverConfig: IServerConfig = config.get('server');

export class TofLogger extends Logger {
  private static loggedFileError = false;

  log(message: string, context?: string) {
    if (serverConfig.logLevel && serverConfig.logLevel !== 'all') {
      return;
    }

    super.log(message, context);

    if (serverConfig.logFileName) {
      try {
        fs.appendFileSync(serverConfig.logFileName, `INFO - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }

  error(message: string, trace?: string) {
    super.error(message, trace);

    if (serverConfig.logFileName) {
      try {
        fs.appendFileSync(serverConfig.logFileName, `ERROR - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }

  warn(message: string, context?: string) {
    if (serverConfig.logLevel && serverConfig.logLevel === 'error') {
      return;
    }

    super.warn(message, context);

    if (serverConfig.logFileName) {
      try {
        fs.appendFileSync(serverConfig.logFileName, `WARN - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }
}
