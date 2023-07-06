import { Injectable } from '@angular/core';
import { ITask } from '@fst/shared/domain';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private changesSubject = new Subject<void>();
  public changes$: Observable<void>;
  private domain: string;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {
    this.changes$ = this.changesSubject.asObservable();
    this.domain = environment.domain;
    console.log(this.domain);
  }

  getTasks(
    filter: string | undefined | null,
    settings?: any
  ): Observable<ITask[]> {
    let params: string = '';
    if (settings.order) params += `?order=${settings.order}`;
    if (settings.sortBy)
      if (params !== '') {
        params += `&sortBy=${settings.sortBy}`;
      } else {
        params += `?sortBy=${settings.sortBy}`;
      }
    if (filter)
      if (params !== '') {
        params += `&filter=${filter}`;
      } else {
        params += `?filter=${filter}`;
      }

    return this.http.get<ITask[]>(`${this.domain}/api/tasks/${params}`);
  }

  getTask(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.domain}/api/tasks/${id}`);
  }

  addTasks({
    taskName,
    taskEndDate,
  }: {
    taskName: string;
    taskEndDate?: Date;
  }): Observable<ITask> {
    let bodyData: any = { name: taskName };
    if (taskEndDate) {
      bodyData = { ...bodyData, endDate: taskEndDate };
    }

    return this.http
      .post<ITask>(`${this.domain}/api/tasks`, bodyData, this.httpOptions)
      .pipe(tap(() => this.notifyChanges()));
  }

  editTask(newTask: ITask): Observable<ITask> {
    return this.http
      .put<ITask>(
        `${this.domain}/api/tasks/${newTask._id}`,
        newTask,
        this.httpOptions
      )
      .pipe(tap(() => this.notifyChanges()));
  }

  deleteTask(_id: number): Observable<number> {
    return this.http
      .delete<number>(`${this.domain}/api/tasks/${_id}`)
      .pipe(tap(() => this.notifyChanges()));
  }

  notifyChanges() {
    this.changesSubject.next();
  }
}
