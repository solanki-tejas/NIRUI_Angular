import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { formatTimestamp } from 'src/app/shared/utils/functions';
import { animate, style, transition, trigger } from '@angular/animations';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-detail-view',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.scss',
  providers: [DatePipe],
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
export class DetailViewComponent implements OnInit {
  itemId: string | null = null;
  details: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) { }

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
    this.router.navigateByUrl('/messages');
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

  inputDialogVisible = false;
  outputDialogVisible = false;

  // Add these properties and methods to your component
  showInputDialog() {
    this.inputDialogVisible = true;
  }

  showOutputDialog() {
    this.outputDialogVisible = true;
  }

  truncateMessage(message: string): string {
    if (!message) return 'NA';
    const maxLength = 500; // Adjust this value to change the preview length
    if (message.length <= maxLength) return message;
    return `${message.substring(0, maxLength)}...`;
  }

  getTruncatedMessage(message: string | null): SafeHtml {
    if (!message) return this.sanitizer.bypassSecurityTrustHtml('NA');

    try {
      let formatted: string;

      // Format the message first
      if (this.isJson(message)) {
        formatted = JSON.stringify(JSON.parse(message), null, 2);
      } else {
        formatted = this.formatXml(message);
      }

      // Truncate the formatted message
      const maxLength = 500;
      const truncated = formatted.length > maxLength
        ? `${formatted.substring(0, maxLength)}...`
        : formatted;

      // Return sanitized HTML
      return this.sanitizer.bypassSecurityTrustHtml(`<pre>${truncated}</pre>`);
    } catch (error) {
      console.error('Error formatting content:', error);
      return this.sanitizer.bypassSecurityTrustHtml(message);
    }
  }

  showToast = false;

  showNotification() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000); // Hide toast after 3 seconds
  }

  copyRequestId() {
    const requestId = this.details.requestId;
    if (requestId) {
      // Create a temporary input element to hold the text
      const tempInput = document.createElement('input');
      tempInput.value = requestId;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.setSelectionRange(0, 99999); // Select for mobile devices

      // Copy the text to the clipboard
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      this.showNotification();
    }
  }

  downloadInputMessage() {
    // Get the pretty-printed content as a string (not SafeHtml)
    const prettyMessage = this.details.inputMessage;

    // Extract plain text if SafeHtml is used
    let messageContent: string;
    if (typeof prettyMessage === 'string') {
      messageContent = prettyMessage;
    } else {
      // If it's SafeHtml, we can extract the raw text (sanitize if needed)
      messageContent = this.sanitizer.sanitize(1, prettyMessage) || '';
    }

    // Check if the content exists
    if (!messageContent) {
      console.error('No content available to download');
      return;
    }

    // Create a Blob object with the content
    const blob = new Blob([messageContent], { type: 'text/plain' });

    // Create a temporary anchor tag to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'input-message.txt'; // Customize the file name if needed
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the temporary anchor tag
  }

  
  downloadOutputMessage() {
    // Get the pretty-printed content as a string (not SafeHtml)
    const prettyMessage = this.details.outputMessage;

    // Extract plain text if SafeHtml is used
    let messageContent: string;
    if (typeof prettyMessage === 'string') {
      messageContent = prettyMessage;
    } else {
      // If it's SafeHtml, we can extract the raw text (sanitize if needed)
      messageContent = this.sanitizer.sanitize(1, prettyMessage) || '';
    }

    // Check if the content exists
    if (!messageContent) {
      console.error('No content available to download');
      return;
    }

    // Create a Blob object with the content
    const blob = new Blob([messageContent], { type: 'text/plain' });

    // Create a temporary anchor tag to trigger the download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'output-message.txt'; // Customize the file name if needed
    document.body.appendChild(a);
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the temporary anchor tag
  }


}
