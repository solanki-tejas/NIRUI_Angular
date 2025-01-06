import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';
import { Log, LogsService } from 'src/app/core/services/log.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  submitLoading = false;

  constructor(
    private authService: AuthService,
    private logsService: LogsService
  ) {}

  onSubmit(): void {
    this.submitLoading = true;
    this.authService.login(this.username, this.password);

    const newLog: Log = {
      datetime: new Date().toISOString(),
      logtype: 'Login',
      log: 'Admin is logged in.',
    };
    this.logsService.addLog(newLog);

    setTimeout(() => {
      this.submitLoading = false;
    }, 200);
  }
}
