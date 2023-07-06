import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogSettingsComponent } from './dialog-settings/dialog-settings.component';
import { getSettings } from './utilies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TodoList';
  constructor(private matDialog: MatDialog) {}
  openDialogSettings() {
    this.matDialog.open(DialogSettingsComponent, { data: getSettings() });
  }
}
