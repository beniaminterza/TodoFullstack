import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, distinctUntilChanged } from 'rxjs/operators';
import { TaskService } from '../task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITask } from '@fst/shared/domain';
import * as moment from 'moment';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { Subscription, of } from 'rxjs';
import { getErrorMessage, openErrorSnackBar } from '../utilies';

@Component({
  selector: 'app-dialog-add-task',
  templateUrl: './dialog-add-task.component.html',
  styleUrls: ['./dialog-add-task.component.css'],
})
export class DialogAddTaskComponent implements OnInit {
  form: FormGroup;
  formIsValid: boolean;
  isLoading: boolean;
  private subscription = Subscription.EMPTY;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    @Inject(MAT_DIALOG_DATA) public data: { task: ITask },
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogAddTaskComponent>
  ) {
    this.form = this.formBuilder.group({});
    this.formIsValid = false;
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: this.isEditMode() ? this.data.task.name : '',
      date: this.isEditMode() ? this.data.task?.endDate : '',
    });

    if (!this.isEditMode()) {
      this.form.valueChanges
        .pipe(distinctUntilChanged((a, b) => a.name === b.name))
        .subscribe((obj) => {
          if (obj.name === '') {
            this.formIsValid = false;
          } else {
            this.formIsValid = true;
          }
        });
    } else {
      this.form.valueChanges.pipe().subscribe((obj) => {
        if (
          obj.name === '' ||
          (this.isEditMode() && this.isTaskNameDateSame(obj, this.data.task))
        ) {
          this.formIsValid = false;
        } else {
          if (
            this.isEditMode() &&
            !this.isTaskNameDateSame(obj, this.data.task)
          ) {
            this.formIsValid = true;
          }
        }
      });
    }
  }

  submit(): void {
    console.log('SUBMIT');
  }

  addTask(): void {
    this.isLoading = true;
    this.subscription = this.taskService
      .addTasks({
        taskName: this.form.value.name,
        taskEndDate: this.form.value.date,
      })
      .pipe(
        catchError((err) => {
          openErrorSnackBar(
            getErrorMessage(err),
            this._snackBar,
            ErrorSnackBarComponent
          );
          return of(null);
        })
      )
      .subscribe((task) => {
        if (task) {
          this.dialogRef.close();
        } else {
          this.isLoading = false;
        }
      });
  }

  isEditMode(): boolean {
    return this.data ? true : false;
  }

  editTask(): void {
    this.isLoading = true;
    this.subscription = this.taskService
      .editTask({
        ...this.data.task,
        name: this.form.value.name,
        endDate: this.form.value.date,
      })
      .pipe(
        catchError((err) => {
          openErrorSnackBar(
            getErrorMessage(err),
            this._snackBar,
            ErrorSnackBarComponent
          );
          return of(null);
        })
      )
      .subscribe((task) => {
        console.log(task);
        if (task) {
          this.dialogRef.close();
        } else {
          this.isLoading = false;
        }
      });
  }

  cancel() {
    this.subscription.unsubscribe();
    this.dialogRef.close();
  }

  isTaskNameDateSame(a: { name: string; date: Date }, b: ITask): boolean {
    console.table(a);
    console.table(b);
    console.log(a.date === b.endDate);
    if (a.name === b.name) {
      if ((a.date && !b.endDate) || !this.isValidDate(a.date)) return false;
      if (
        (!a.date && !b.endDate) ||
        a.date.toLocaleDateString('en-US') ==
          b.endDate?.toLocaleDateString('en-US')
      )
        return true;
    }
    return false;
  }

  isValidDate(d: Date) {
    return moment(d).isValid();
  }
}
