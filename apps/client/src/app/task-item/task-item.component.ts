import { Component, Inject, Input } from '@angular/core';
import { ITask } from '@fst/shared/domain';
import * as moment from 'moment';
import { DialogDeleteTaskComponent } from '../dialog-delete-task/dialog-delete-task.component';
import { DialogAddTaskComponent } from '../dialog-add-task/dialog-add-task.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../task.service';
import { catchError, of } from 'rxjs';
import { getErrorMessage, openErrorSnackBar } from '../utilies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent {
  @Input() task: ITask;
  isLoading: boolean;

  constructor(
    private matDialog: MatDialog,
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {
    this.task = { _id: '', name: '', isDone: false };
    this.isLoading = false;
  }

  isDateExpired(): boolean {
    if (!this.task.endDate) return false;
    let result = moment().isAfter(this.task.endDate);
    return result;
  }

  openDeleteDialog() {
    this.matDialog.open(DialogDeleteTaskComponent, {
      data: {
        _id: this.task._id,
      },
    });
  }

  openEditDialog() {
    this.matDialog.open(DialogAddTaskComponent, {
      data: {
        task: {
          ...this.task,
          endDate: this.task.endDate ? new Date(this.task.endDate) : null,
        },
        isLoading: this.isLoading,
      },
    });
  }

  toggleChange($event?: Event) {
    $event && $event.preventDefault();
    console.log('toggle');
    this.changeCheckBox();
  }

  changeCheckBox() {
    this.isLoading = true;
    this.taskService
      .editTask({ ...this.task, isDone: !this.task.isDone })
      .pipe(
        catchError((err) => {
          this.isLoading = false;
          openErrorSnackBar(
            getErrorMessage(err),
            this._snackBar,
            ErrorSnackBarComponent
          );
          return of(null);
        })
      )
      .subscribe((task) => {
        this.isLoading = false;
        console.log(task);
      });
  }

  updateTaskStatus() {}
}
