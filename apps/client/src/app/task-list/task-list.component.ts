import { TaskService } from '../task.service';
import { ITask } from '@fst/shared/domain';
import {
  BehaviorSubject,
  Subscription,
  catchError,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { getErrorMessage, getSettings, openErrorSnackBar } from '../utilies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  @Input()
  set filter(f: string | null | undefined) {
    this.filterSubject.next(f);
  }

  tasks: ITask[] = [];
  isLoading: boolean;

  private filterSubject = new BehaviorSubject<string | null | undefined>('all');

  private subscription = Subscription.EMPTY;

  constructor(
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {
    this.filter = 'all';
    this.isLoading = false;
  }

  ngOnInit() {
    this.subscription = this.filterSubject
      .pipe(
        switchMap((filter) => {
          return this.taskService.changes$.pipe(
            startWith(null),
            tap(() => {
              console.log('LOADING TRUE');
              this.isLoading = true;
            }),
            map(() => filter)
          );
        }),
        switchMap((filter) => {
          console.log('');
          return this.taskService.getTasks(filter, getSettings());
        }),
        catchError((err) => {
          console.log('LoADING FALSE');
          this.isLoading = false;
          openErrorSnackBar(
            getErrorMessage(err),
            this._snackBar,
            ErrorSnackBarComponent
          );
          return of([]);
        })
      )
      .subscribe((tasks) => {
        console.log('LoADING FALSE');
        this.isLoading = false;
        this.tasks = tasks;
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
