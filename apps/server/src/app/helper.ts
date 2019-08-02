import * as zipdir from 'zip-dir';
import * as fs from 'fs-extra';
import {BadRequestException} from '@nestjs/common';

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

export interface ParsedFhirUrl {
  resourceType?: string;
  id?: string;
  operation?: string;
  query?: { [key: string]: string|boolean };
  versionId?: string;
  isHistory: boolean;
}

export function parseFhirUrl(url: string) {
  const parsed: ParsedFhirUrl = {
    isHistory: false
  };

  if (!url || url === '/') {
    return parsed;
  }

  if (url.startsWith('/')) {
    url = url.substring(1);
  }

  let parts;

  if (url.indexOf('?') >= 0) {
    const query = url.substring(url.indexOf('?') + 1);
    const queryParts = query.split('&');

    parsed.query = {};

    queryParts.forEach((queryPart) => {
      if (queryPart.indexOf('=') >= 0) {
        parsed.query[queryPart.split('=')[0]] = queryPart.split('=')[1];
      } else {
        parsed.query[queryPart] = true;
      }
    });

    parts = url.substring(0, url.indexOf('?')).split('/');
  } else  {
    parts = url.split('/');
  }

  if (parts.length > 0) {
    parsed.resourceType = parts[0];
  }

  if (parts.length > 1) {
    if (parts[1].startsWith('$')) {
      parsed.operation = parts[1];
    } else if (parts[1] === '_search') {
      // do nothing
    } else {
      parsed.id = parts[1];
    }
  }

  if (parts.length > 2) {
    if (parts[2].startsWith('$')) {
      parsed.operation = parts[2];
    } else if (parts[2] === '_history' && parts.length > 3) {
      parsed.isHistory = true;
      parsed.versionId = parts[3];
    } else if (parts[2] === '_history') {
      parsed.isHistory = true;
    } else {
      throw new BadRequestException();
    }

    if (parts.length > 4) {
      if (parsed.versionId && parts[4].startsWith('$')) {
        parsed.operation = parts[4];
      } else {
        throw new BadRequestException();
      }
    }
  }

  if (parts.length > 5) {
    throw new BadRequestException();
  }

  return parsed;
}
