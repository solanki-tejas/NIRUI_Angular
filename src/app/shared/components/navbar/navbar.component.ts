// import { Component, SimpleChanges } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth.service';
// import { ButtonModule } from 'primeng/button';
// import { AvatarModule } from 'primeng/avatar';
// import { MenuModule } from 'primeng/menu';
// import { MenuItem } from 'primeng/api';
// import { MenubarModule } from 'primeng/menubar';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ApiService } from 'src/app/core/services/api.service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [
//     AvatarModule,
//     ButtonModule,
//     CommonModule,
//     FormsModule,
//     MenuModule,
//     MenubarModule,
//   ],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.scss',
// })
// export class NavbarComponent {
//   items: MenuItem[] = [];
//   lastVersion: any;

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private apiService: ApiService
//   ) {
//     this.items = [
//       {
//         label: 'Message Search',
//         route: 'messages',
//         command: () => {
//           this.routeToPage('messages');
//           this.updateActiveClasses();
//         },
//       },

//       {
//         label: 'Monitoring',
//         route: 'monitoring',
//         items: [
//           {
//             label: 'Change Log',
//             route: 'monitoring/change-logs',
//             command: () => {
//               this.routeToPage('monitoring/change-logs')
//               this.updateActiveClasses();
//             },

//           },
//           {
//             label: 'Application Log',
//             route: 'monitoring/application-logs',
//             command: () => {
//               this.routeToPage('monitoring/application-logs')
//               this.updateActiveClasses();
//             },
//           },
//         ],
//       },
//       {
//         label: 'Settings',
//         route: 'settings',
//         items: [
//           {
//             label: 'API Configuration',
//             route: 'settings/api-configuration',
//             command: () => {
//               this.routeToPage('settings/api-configuration');
//               this.updateActiveClasses();
//             },
//           },
//         ],
//       },
//     ];
//   }

//   ngOnInit() {
//     this.updateActiveClasses(); // Initial setup
//     this.router.events.subscribe((event) => {
//       if (event instanceof NavigationEnd) {
//         this.updateActiveClasses(); // Update on route change
//       }
//     });

//     const urlToPass = 'changelog/search';
//     this.apiService.getData(urlToPass).subscribe({
//       next: (data) => {
//         if (Array.isArray(data) && data.length) {
//           // Sort by `changeDate` in descending order
//           const sortedData = data.sort((a, b) => {
//             const dateA = new Date(a.changeDate).getTime();
//             const dateB = new Date(b.changeDate).getTime();
//             return dateB - dateA; // Descending order
//           });

//           // Assign the latest version based on sorted order
//           this.lastVersion = sortedData[0];
//         }
//       },
//       error: (error) => console.error('Error fetching data:', error),
//     });
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     // if (changes['data']) {
//     // Side effect when data input changes
//     console.log('Data changed:', changes);
//     // }
//   }

//   updateActiveMenuItem() {
//     // const currentUrl = this.router.url;

//     // this.items.forEach((item: any) => {
//     //   const isParentActive = currentUrl.startsWith(`/${item.route}`);
//     //   item.styleClass = isParentActive ? 'active-link' : '';

//     //   item.items?.forEach((subItem) => {
//     //     const isSubItemActive = currentUrl.startsWith(`/${subItem.route}`);
//     //     subItem.styleClass = isSubItemActive ? 'active-link' : '';

//     //     // If any child is active, ensure the parent is active
//     //     if (isSubItemActive) {
//     //       item.styleClass = 'active-link';
//     //     }
//     //   });
//     // });
//   }

//   updateActiveClasses() {
//     this.items.forEach((item: any) => {
//       if (this.router.url.includes(item.route)) {
//         item.styleClass = 'active-route'; // Add 'active' class or use any relevant class for active route
//       } else {
//         item.styleClass = ''; // Remove any class for inactive routes
//       }

//       // For nested items
//       if (item.items) {
//         item.items.forEach(subItem => {
//           if (this.router.url.includes(subItem.route)) {
//             subItem.styleClass = 'active-route'; // Add 'active' class for nested routes
//           } else {
//             subItem.styleClass = ''; // Remove class for inactive nested routes
//           }
//         });
//       }
//     });
//   }

//   routeToPage(path: string) {
//     this.router.navigateByUrl(path);
//   }

//   logout(): void {
//     this.authService.logout();
//   }

//   navigateVersion(): void {
//     this.router.navigate(['/monitoring/change-logs']);
//   }

//   navigateHome() {
//     this.router.navigate(['/home']);
//   }

//   // log(item: any) {
//   //   console.log(item)
//   // }
// }

import { Component, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    MenuModule,
    MenubarModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  items: MenuItem[] = [];
  lastVersion: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {
    this.initializeMenuItems();
  }

  private initializeMenuItems() {
    this.items = [
      {
        label: 'Message Search',
        route: 'messages',
        command: () => {
          this.routeToPage('messages');
        },
      },
      {
        label: 'Monitoring',
        route: 'monitoring',
        items: [
          {
            label: 'Change Log',
            route: 'monitoring/change-logs',
            command: () => {
              this.routeToPage('monitoring/change-logs');
            },
          },
          {
            label: 'Application Log',
            route: 'monitoring/application-logs',
            command: () => {
              this.routeToPage('monitoring/application-logs');
            },
          },
        ],
      },
      {
        label: 'Settings',
        route: 'settings',
        items: [
          {
            label: 'API Configuration',
            route: 'settings/api-configuration',
            command: () => {
              this.routeToPage('settings/api-configuration');
            },
          },
        ],
      },
    ];
  }

  ngOnInit() {
    this.updateActiveClasses(); // Initial setup
    
    // Subscribe to router events
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Important: Reset items and reinitialize them before updating active classes
        this.initializeMenuItems();
        this.updateActiveClasses();
      }
    });

    this.fetchLastVersion();
  }

  private fetchLastVersion() {
    const urlToPass = 'changelog/search';
    this.apiService.getData(urlToPass).subscribe({
      next: (data) => {
        if (Array.isArray(data) && data.length) {
          const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.changeDate).getTime();
            const dateB = new Date(b.changeDate).getTime();
            return dateB - dateA;
          });
          this.lastVersion = sortedData[0];
        }
      },
      error: (error) => console.error('Error fetching data:', error),
    });
  }

  updateActiveClasses() {
    const currentUrl = this.router.url;
    
    const updateItem = (item: any) => {
      // Remove existing style class
      item.styleClass = '';
      
      // Check if current URL matches the route
      if (currentUrl.includes(item.route)) {
        item.styleClass = 'active-route';
      }
      
      // Process nested items
      if (item.items) {
        item.items.forEach(subItem => {
          // Remove existing style class
          subItem.styleClass = '';
          
          if (currentUrl.includes(subItem.route)) {
            subItem.styleClass = 'active-route';
            // Also mark parent as active if child is active
            item.styleClass = 'active-route';
          }
        });
      }
    };

    // Update all menu items
    this.items.forEach(updateItem);
  }

  routeToPage(path: string) {
    this.router.navigateByUrl(path);
  }

  logout(): void {
    this.authService.logout();
  }

  navigateVersion(): void {
    this.router.navigate(['/monitoring/change-logs']);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
}