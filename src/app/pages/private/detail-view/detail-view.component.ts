import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { formatTimestamp } from 'src/app/shared/utils/functions';

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
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
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

  prettyPrint(content: string | null): SafeHtml {
    if (!content) {
      return 'NA';
    }
    try {
      // Handle JSON formatting
      if (this.isJson(content)) {
        return this.sanitizer.bypassSecurityTrustHtml(
          '<pre>' + JSON.stringify(JSON.parse(content), null, 2) + '</pre>'
        );
      }
      // Handle XML formatting (indentation)
      return this.sanitizer.bypassSecurityTrustHtml(
        '<pre>' + this.formatXml(content) + '</pre>'
      );
    } catch (error) {
      console.error('Error formatting content:', error);
      return content; // Fallback to raw content
    }
  }

  private isJson(content: string): boolean {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }

  private formatXml(xml: string): string {
    const formatted = xml
      .replace(/(>)(<)(\/*)/g, '$1\n$2$3')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    let pad = 0;
    return formatted
      .split('\n')
      .map((line) => {
        let indent = 0;
        if (line.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (line.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (line.match(/^<\w([^>]*[^/])?>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }
        pad += indent;
        return '  '.repeat(pad - indent) + line;
      })
      .join('\n');
  }
}
