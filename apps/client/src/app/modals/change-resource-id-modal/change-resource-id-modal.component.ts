import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FhirService} from '../../shared/fhir.service';
import {RecentItemService} from '../../shared/recent-item.service';
import {getErrorString} from '../../../../../../libs/tof-lib/src/lib/helper';
import {ConfigService} from '../../shared/config.service';
import {Router} from '@angular/router';

@Component({
  templateUrl: './change-resource-id-modal.component.html',
  styleUrls: ['./change-resource-id-modal.component.css']
})
export class ChangeResourceIdModalComponent implements OnInit {
  @Input() resourceType: string;
  @Input() originalId: string;
  public newId: string;
  public message: string;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    private configService: ConfigService,
    private fhirService: FhirService,
    private recentItemService: RecentItemService) {
  }

  public ok() {
    this.fhirService.changeResourceId(this.resourceType, this.originalId, this.newId)
      .subscribe(() => {
        const cookieKey = this.recentItemService.getCookieKey(this.resourceType);
        if (cookieKey) {
          this.recentItemService.changeId(cookieKey, this.originalId, this.newId);
        }

        if (this.resourceType === 'ImplementationGuide' && this.originalId === this.configService.project.implementationGuideId) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.fhirServer}/${this.newId}/implementation-guide`]);
        }

        this.activeModal.close(this.newId);
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  ngOnInit() {
    this.newId = this.originalId;
  }
}
