import {Logger} from '@nestjs/common';
import {ConfigService} from './config.service';
import * as path from 'path';
import * as fs from 'fs-extra';
import Timer = NodeJS.Timer;

export class TofLogger extends Logger {
  private static loggedFileError = false;
  private static configService = ConfigService.create();
  private static rotateTimeout: Timer;
  private serverConfig = TofLogger.configService.server;

  constructor(name?: string) {
    super(name);

    // Make sure the path to the log files exists
    if (this.serverConfig.logFileName) {
      const dirPath = this.logFileDirectory;

      if (dirPath && dirPath !== '.') {
        try {
          fs.ensureDirSync(dirPath);
        } catch (ex) {
          this.error(`Failed to ensure that the log directory "${dirPath}" exists: ${ex.message}`, ex.stack);
        }
      }
    }
  }

  private get logFileDirectory(): string {
    if (!this.serverConfig.logFileName) {
      return;
    }

    return this.serverConfig.logFileName.indexOf('/') > 0 ?
      this.serverConfig.logFileName.substring(0, this.serverConfig.logFileName.lastIndexOf('/')) :
      '.';
  }

  private get logFileName(): string {
    if (!this.serverConfig.logFileName) {
      return;
    }

    return this.serverConfig.logFileName.indexOf('/') ?
      this.serverConfig.logFileName.substr(this.serverConfig.logFileName.lastIndexOf('/') + 1) :
      this.serverConfig.logFileName;
  }

  private rotateLogs() {
    if (!this.serverConfig.logFileName || !fs.existsSync(this.serverConfig.logFileName)) {
      return;
    }

    const rotate = () => {
      try {
        const stats = fs.statSync(this.serverConfig.logFileName);
        const sizeInKb = stats.size / 1024;

        if (sizeInKb > this.serverConfig.maxLogSizeKB) {
          const dateStamp = new Date().toISOString().replace(/[-:]/g, '').substring(0, 15);
          let newFileName = this.logFileName;

          // If there's an extension, put the date stamp before the extension
          if (newFileName.indexOf('.') > 0) {
            newFileName = newFileName.substring(0, newFileName.lastIndexOf('.')) + '-' + dateStamp + '.' + newFileName.substring(newFileName.lastIndexOf('.') + 1);
          } else {
            newFileName = newFileName + '-' + dateStamp;
          }

          const newLogLocation = this.logFileDirectory ?
            path.join(this.logFileDirectory || '', newFileName) :
            newFileName;

          fs.moveSync(this.serverConfig.logFileName, newLogLocation);
        }
      } catch (ex) {
        this.error(`Failed to determine what the size of the log file is: ${ex.message}`, ex.stack);
      }
    };

    // Use a debounce/timer to make sure we aren't checking the stats on the
    // log file multiple times per second when writing a bunch of logs.
    if (TofLogger.rotateTimeout) {
      clearTimeout(TofLogger.rotateTimeout);
      TofLogger.rotateTimeout = null;
    }

    TofLogger.rotateTimeout = setTimeout(rotate, 1000);
  }

  trace(message: string, context?: string) {
    if (this.serverConfig.logLevel && this.serverConfig.logLevel !== 'trace') {
      return;
    }

    super.log(`[TRACE] ${message}`, context);

    if (this.serverConfig.logFileName) {
      this.rotateLogs();

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
      this.rotateLogs();

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
      this.rotateLogs();

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

  verbose(message: string, context?: string) {
    super.verbose(message, context);

    if (this.serverConfig.logFileName) {
      this.rotateLogs();

      try {
        fs.appendFileSync(this.serverConfig.logFileName, `VERBOSE - ${new Date().toUTCString()} - ${message}\r\n`);
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
      this.rotateLogs();

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
