import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';
import * as moment from 'moment';
import { catchError, of } from 'rxjs';
import { getErrorMessage, openErrorSnackBar } from '../utilies';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorSnackBarComponent } from '../error-snack-bar/error-snack-bar.component';

export interface Details {
  attribute: string;
  value: number;
}
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css'],
})
export class TaskDetailComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private _snackBar: MatSnackBar
  ) {
    this.isLoading = true;
    this.isError = false;
  }
  displayedColumns: string[] = ['attribute', 'value'];
  data: Details[] = [];
  isLoading: boolean;
  isError: boolean;

  ngOnInit(): void {
    const id: string | null = this.getId();
    if (id) {
      this.taskService
        .getTask(id)
        .pipe(
          catchError((err) => {
            console.log('LoADING FALSE');
            this.isError = true;
            this.isLoading = false;
            openErrorSnackBar(
              getErrorMessage(err),
              this._snackBar,
              ErrorSnackBarComponent
            );
            return of({});
          })
        )
        .subscribe((data) => {
          this.isLoading = false;
          console.log('DATAs');
          console.log(data);
          this.data = this.transformObjectToDisplayData(data);
          this.isLoading = false;
        });
    }
  }

  getId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  transformObjectToDisplayData(object: any): any[] {
    let data: any[] = [];
    for (let key in object) {
      if (key !== '__v') {
        //remove version keys
        if (key === 'createdAt' || key === 'updatedAt') {
          object[key] = moment(object[key]).format('DD.MM.YYYY hh:mm:ss');
        } else if (key === 'endDate') {
          object[key] = moment(object[key]).format('DD.MM.YYYY');
        } else if (key === 'endDate') {
        }
        data.push({ attribute: key, value: object[key] });
      }
    }

    return data;
  }
}
