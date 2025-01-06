import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { LogsService, Log } from 'src/app/core/services/log.service';
import { formatTimestamp } from 'src/app/shared/utils/functions';
import * as XLSX from 'xlsx';  // Import xlsx library

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent {
  logs: Log[] = [];
  loading = false;
  visible: boolean = false;
  currentLog: Log = {
    datetime: '',
    log: '',
    logtype: '',
  };

  constructor(private logService: LogsService) { }

  fetchLogs() {
    this.loading = true;
    this.logService.getLogs().subscribe((data) => {
      console.log(data);
      this.logs = data.reverse();
      this.loading = false;
    });
  }

  ngOnInit() {
    this.fetchLogs();
  }

  getFormatDate(data: any) {
    return formatTimestamp(data);
  }

  showDialog() {
    this.visible = true;
    this.currentLog = {
      datetime: '',
      log: '',
      logtype: '',
    }; // Reset form
  }

  onRowSelect(event: any) {
    // this.currentLog = { ...event.data }; // Populate form with selected row's data
    // this.visible = true;
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.logs.map(log => ({
      Date: log.datetime ? this.getFormatDate(log.datetime) : '-',
      Type: log.logtype,
      Description: log.log,
    })));
    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Logs');

    // Export the file
    XLSX.writeFile(wb, 'logs.xlsx');
  }
}
