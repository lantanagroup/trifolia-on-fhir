import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImplementationGuide} from '../../../../../../libs/tof-lib/src/lib/r4/fhir';

@Component({
  selector: 'trifolia-fhir-custom-publish-settings',
  templateUrl: './custom-publish-settings.component.html',
  styleUrls: ['./custom-publish-settings.component.css']
})
export class CustomPublishSettingsComponent implements OnInit {
  @Input() selectedImplementationGuide: ImplementationGuide;
  @Input() packageId;
  @Input() readOnly = false;

  @Output() change: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

}
