import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../services/code-system.service';
import {CodeSystem} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfigService} from '../services/config.service';

@Component({
    selector: 'app-codesystems',
    templateUrl: './codesystems.component.html',
    styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent implements OnInit {
    public codeSystems: CodeSystem[];
    public contentText: string;

    constructor(
        private configService: ConfigService,
        private codeSystemService: CodeSystemService,
        private modalService: NgbModal) {

    }

    public contentTextChanged(value: string) {

    }

    public remove(codeSystem: CodeSystem) {
        if (!confirm(`Are you sure you want to delete the code system ${codeSystem.title || codeSystem.name || codeSystem.id}`)) {
            return;
        }

        this.codeSystemService.delete(codeSystem.id)
            .subscribe(() => {
                const index = this.codeSystems.indexOf(codeSystem);
                this.codeSystems.splice(index, 1);
            }, (err) => {
                this.configService.handleError(err, 'An error occurred while deleting the code system');
            });
    }

    public changeId(codeSystem: CodeSystem) {
        const modalRef = this.modalService.open(ChangeResourceIdModalComponent);
        modalRef.componentInstance.resourceType = codeSystem.resourceType;
        modalRef.componentInstance.originalId = codeSystem.id;
        modalRef.result.then((newId) => {
            codeSystem.id = newId;
        });
    }

    public getCodeSystems() {
        this.codeSystemService.search()
            .subscribe((results) => {
                this.codeSystems = _.map(results.entry, (entry) => <CodeSystem> entry.resource);
            });
    }

    ngOnInit() {
        this.getCodeSystems();
    }
}
