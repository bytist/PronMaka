import { HttpErrorResponse } from '@angular/common/http';
import { ErrorModel, HttpErrorModel } from '@spartacus/core';
import { isObject } from 'lodash';

/**
 * Moved this file from OOTB Spartacus because is not being exported
 */
export const UNKNOWN_ERROR = {
  error: 'unknown error',
};

const circularReplacer = () => {
  const seen = new WeakSet();
  // tslint:disable-next-line:variable-name
  return (_key: any, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export function makeErrorSerializable(
  error: HttpErrorResponse | ErrorModel | any
): HttpErrorModel | Error | any {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: error.name,
      reason: error.stack,
    } as ErrorModel;
  }

  if (error instanceof HttpErrorResponse) {
    let serializableError = error.error;
    if (isObject(error.error)) {
      serializableError = JSON.stringify(error.error, circularReplacer());
    }

    return {
      message: error.message,
      error: serializableError,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
    } as HttpErrorModel;
  }

  return isObject(error) ? UNKNOWN_ERROR : error;
}
