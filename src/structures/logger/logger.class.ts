export class LoggerEnum {
    static INFO: string = 'info';
    static DEBUG: string = 'debug';
    static ERROR: string = 'error';
}

/*
 * Logger class
 */
export class Logger {

    static infoFile: string = 'info.log';
    static debugFile: string = 'debug.log';
    static errorFile: string = 'error.log';
    static pathToLog: string = './logs/';

    /**
     * @description Logs a message to the console
     * @param {string} message
     * @param {string} [type]
     * @returns {void}
     * @memberof Logger
     * @static
     * @example
     * Logger.log("Hello world!");
     * // => [2021-01-01 00:00:00] [LOG] Hello world!
     * Logger.log("Hello world!", "debug");
     * // => [2021-01-01 00:00:00] [DEBUG] Hello world!
     * Logger.log("Hello world!", "error");
     * // => [2021-01-01 00:00:00] [ERROR] Hello world!
     */

    static log(message: string, type?: string, toFile?: boolean): void {
        if (type) console.log(`[${type.toUpperCase()}] ${message}`);
        else console.log(`LOG] ${message}`);

        if (toFile)
            this.logToFile(message, type);
    }

    /**
     * @description Logs a message to a file
     * @param {string} message
     * @param {string} [type]
     * @returns {void}
     * @memberof Logger
     * @static
     * @example
     * Logger.logToFile("Hello world!");
     * // => [2021-01-01 00:00:00] [LOG] Hello world!
     * Logger.logToFile("Hello world!", "debug");
     * // => [2021-01-01 00:00:00] [DEBUG] Hello world!
     */
    static logToFile(message: string, type?: string): void {
        const fs = require('fs');
        const path = require('path');
        let filePath = path.join(Logger.pathToLog, Logger.infoFile);
        if (type) filePath = path.join(Logger.pathToLog, `${type}.log`)
        const dir = path.join(Logger.pathToLog);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        fs.appendFile(filePath, message + '\n', (err: Error) => {
            if (err) throw err;
        });
    }
}