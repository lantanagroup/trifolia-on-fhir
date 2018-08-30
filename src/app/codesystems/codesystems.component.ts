import {Component, OnInit} from '@angular/core';
import {CodeSystemService} from '../services/code-system.service';
import {CodeSystem} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {ChangeResourceIdModalComponent} from '../change-resource-id-modal/change-resource-id-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-codesystems',
    templateUrl: './codesystems.component.html',
    styleUrls: ['./codesystems.component.css']
})
export class CodesystemsComponent implements OnInit {
    public codeSystems: CodeSystem[];
    public contentText: string;

    constructor(
        private codeSystemService: CodeSystemService,
        private modalService: NgbModal) {

    }

    public contentTextChanged(value: string) {

    }

    public remove(codeSystem: CodeSystem) {

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
