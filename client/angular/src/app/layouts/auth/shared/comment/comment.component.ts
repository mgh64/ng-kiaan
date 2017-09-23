import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  @Input() comment: string;
  @Output() commentChange = new EventEmitter();
  change(newValue) {
    this.comment = newValue;
    this.commentChange.emit(newValue);
  }
}
