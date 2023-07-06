import { Component, Inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-error-snack-bar',
  templateUrl: './error-snack-bar.component.html',
  styleUrls: ['./error-snack-bar.component.css'],
})
export class ErrorSnackBarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { errorMessage: string },
    @Inject(MatSnackBarRef) public ref: MatSnackBarRef<TextOnlySnackBar>
  ) {}
}
