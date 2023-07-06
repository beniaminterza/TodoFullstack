import { Component, Inject } from '@angular/core';
import { TaskService } from '../task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, catchError, of, tap } from 'rxjs';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-delete-task',
  templateUrl: './dialog-delete-task.component.html',
  styleUrls: ['./dialog-delete-task.component.css'],
})
export class DialogDeleteTaskComponent {
  isLoading: boolean;
  private subscription = Subscription.EMPTY;

  constructor(
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { _id: number },
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogDeleteTaskComponent>
  ) {
    this.isLoading = false;
  }

  deleteTask(): void {
    console.log(this.data);
    this.isLoading = true;
    this.subscription = this.taskService
      .deleteTask(this.data._id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.openErrorSnackBar(err.message);
          return of(null);
        })
      )
      .subscribe((_id) => {
        console.log(_id);
        this.dialogRef.close();
      });
  }

  cancel() {
    this.subscription.unsubscribe();
    this.dialogRef.close();
  }

  openErrorSnackBar(message: string) {
    this._snackBar.openFromComponent(ErrorSnackBarComponent, {
      duration: 6 * 1000,
      data: { errorMessage: message },
    });
  }
}
