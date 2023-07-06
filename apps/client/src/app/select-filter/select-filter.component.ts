import { Component } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css'],
})
export class SelectFilterComponent {
  selected = 'all';

  constructor(private taskService: TaskService) {}

  onChange(value: string): any {
    console.log('Change VALUE' + value);
    //this.taskService.notifyChanges();
  }
}
