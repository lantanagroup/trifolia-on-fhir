import * as zipdir from 'zip-dir';
import * as fs from 'fs-extra';

export const zip = (path): Promise<any> => {
    return new Promise((resolve, reject) => {
        zipdir(path, (err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

export const emptydir = (path): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.emptyDir(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const rmdir = (path): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};