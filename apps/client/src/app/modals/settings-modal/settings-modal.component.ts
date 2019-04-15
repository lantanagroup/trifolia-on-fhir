import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/config.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    public configService: ConfigService) {

  }

  public get authCode(): string {
    return localStorage.getItem('token');
  }

  ngOnInit() {
  }
}
