import {Component, OnInit} from '@angular/core';
import {HumanName, Practitioner} from '../../models/stu3/fhir';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Globals} from '../../globals';
import {PractitionerService} from '../../shared/practitioner.service';
import {AuthService} from '../../shared/auth.service';
import {Route, Router} from '@angular/router';
import {FhirService} from '../../shared/fhir.service';

@Component({
    selector: 'app-new-user-modal',
    templateUrl: './new-user-modal.component.html',
    styleUrls: ['./new-user-modal.component.css']
})
export class NewUserModalComponent implements OnInit {
    public practitioner = new Practitioner();
    public message: string;

    constructor(
        private router: Router,
        private activeModal: NgbActiveModal,
        private fhirService: FhirService,
        private practitionerService: PractitionerService) {
        this.practitioner.name = [new HumanName()];
    }

    public ok() {
        this.practitionerService.updateMe(this.practitioner)
            .subscribe((newPractitioner) => {
                this.activeModal.close(newPractitioner);
                this.router.navigate(['/home']);
            }, (err) => {
                this.message = this.fhirService.getErrorString(err);
            });
    }

    ngOnInit() {
    }

    public get okDisabled(): boolean {
        return !(this.practitioner &&
            this.practitioner.name &&
            this.practitioner.name.length > 0 &&
            this.practitioner.name[0].given &&
            this.practitioner.name[0].given.length > 0 &&
            this.practitioner.name[0].given[0] &&
            this.practitioner.name[0].family);
    }
}
