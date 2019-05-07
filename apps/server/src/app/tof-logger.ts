import {Logger} from '@nestjs/common';
import {ConfigService} from './config.service';
import * as fs from 'fs';

export class TofLogger extends Logger {
  private static loggedFileError = false;
  private static configService = new ConfigService();
  private serverConfig = TofLogger.configService.server;

  trace(message: string, context?: string) {
    if (this.serverConfig.logLevel && this.serverConfig.logLevel !== 'trace') {
      return;
    }

    super.log(`[TRACE] ${message}`, context);

    if (this.serverConfig.logFileName) {
      try {
        fs.appendFileSync(this.serverConfig.logFileName, `TRACE - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }

  log(message: string, context?: string) {
    if (this.serverConfig.logLevel && this.serverConfig.logLevel !== 'all' && this.serverConfig.logLevel !== 'trace') {
      return;
    }

    super.log(message, context);

    if (this.serverConfig.logFileName) {
      try {
        fs.appendFileSync(this.serverConfig.logFileName, `INFO - ${new Date().toUTCString()} - ${message}\r\n`);
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

    if (this.serverConfig.logFileName) {
      try {
        fs.appendFileSync(this.serverConfig.logFileName, `ERROR - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }

  warn(message: string, context?: string) {
    if (this.serverConfig.logLevel && this.serverConfig.logLevel === 'error') {
      return;
    }

    super.warn(message, context);

    if (this.serverConfig.logFileName) {
      try {
        fs.appendFileSync(this.serverConfig.logFileName, `WARN - ${new Date().toUTCString()} - ${message}\r\n`);
      } catch (ex) {
        if (!TofLogger.loggedFileError) {
          super.error(`Could not write logs to file: ${ex.message}`);
          TofLogger.loggedFileError = true;
        }
      }
    }
  }
}
