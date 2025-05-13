import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [],
  templateUrl: './chat-dialog.component.html',
  styleUrl: './chat-dialog.component.css'
})
export class ChatDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recipientId: string; recipientName: string }
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
