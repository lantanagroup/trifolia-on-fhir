import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-markdown-modal',
  templateUrl: './markdown-modal.component.html',
  styleUrls: ['./markdown-modal.component.css']
})
export class MarkdownModalComponent implements OnInit {
  @Input() parentObject: any;
  @Input() propertyName: string;
  @Input() title = 'Edit Markdown';

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }
}
