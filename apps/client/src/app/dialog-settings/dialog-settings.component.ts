import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-dialog-settings',
  templateUrl: './dialog-settings.component.html',
  styleUrls: ['./dialog-settings.component.css'],
})
export class DialogSettingsComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogSettingsComponent>,
    private taskService: TaskService
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      sortBy: this.data.sortBy ? this.data.sortBy : 'createdAt',
      order: this.data.order ? this.data.order : '1',
    });
  }

  saveSettings(): void {
    localStorage.setItem('sortBy', this.form.value.sortBy);
    localStorage.setItem('order', this.form.value.order);
    this.dialogRef.close();
    this.taskService.notifyChanges();
  }
}
