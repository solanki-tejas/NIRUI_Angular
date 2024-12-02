import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { formatTimestamp } from 'src/app/shared/utils/functions';

// import ResponseData from '../../../shared/utils/response.json'; // Static fallback
// import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.scss',
  providers: [DatePipe],
})
export class DetailViewComponent implements OnInit {
  itemId: string | null = null;
  details: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');

    if (this.itemId) {
      // Check if the data is stored in localStorage
      const storedData = JSON.parse(
        localStorage.getItem('selectedRecord') || '{}'
      );

      // Validate the stored data's requestId matches the current itemId
      if (storedData && storedData.requestId === this.itemId) {
        this.details = storedData; // Use the localStorage data
      } else {
        this.router.navigateByUrl('/home');
      }
    }

    // Handle case if `itemId` or `details` is invalid (optional logging or error handling)
    if (!this.details) {
      console.error(`Details not found for requestId: ${this.itemId}`);
    }
  }

  goBack(): void {
    this.router.navigateByUrl('/home');
  }

  getFormatDate(data: any) {
    return formatTimestamp(data);
  }
}
