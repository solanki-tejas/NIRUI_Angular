import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
// import { Observable } from 'rxjs';
// import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '1s 0.2s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class HomeComponent {
  // userProfile$: Observable<any>;
  // userName: String

  // constructor(private auth: AuthService) {
  //   this.userProfile$ = this.auth.user$;
  // }

  // ngOnInit() {
  //   // Optional: Additional user data handling
  //   this.auth.user$.subscribe(user => {
  //     this.userName = user.name;
  //     console.log('Full User Data:', this.userProfile$);
  //   });
  // }
}
