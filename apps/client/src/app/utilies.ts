import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export const getErrorMessage = (error: HttpErrorResponse): string => {
  if (error.error.message) {
    return error.error.message;
  } else {
    return error.message;
  }
};

export const openErrorSnackBar = (
  message: string,
  _snackBar: MatSnackBar,
  SnackBarComponent: any
) => {
  _snackBar.openFromComponent(SnackBarComponent, {
    duration: 6 * 1000,
    data: { errorMessage: message },
  });
};

export const getSettings = (): {} => {
  let result: any = {};
  result.sortBy = localStorage.getItem('sortBy');
  result.order = localStorage.getItem('order');
  console.log('RESULT ' + result);
  console.log(result);
  return result;
};
