import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ImplementationGuideService } from '../../shared/implementation-guide.service';
import { CookieService } from 'angular2-cookie/core';
import { Globals } from '../../../../../../libs/tof-lib/src/lib/globals';
import { ConfigService } from '../../shared/config.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ImplementationGuide } from '../../../../../../libs/tof-lib/src/lib/stu3/fhir';

@Component({
  selector: 'app-implementation-guide-typeahead',
  templateUrl: './implementation-guide-typeahead.component.html',
  styleUrls: ['./implementation-guide-typeahead.component.css']
})
export class ImplementationGuideTypeaheadComponent implements OnInit, OnChanges {
  @Input() implementationGuideId;
  @Output() implementationGuideIdChange = new EventEmitter();
  public searching = false;
  public selectedImplementationGuide: ImplementationGuide;

  constructor(private implementationGuideService: ImplementationGuideService,
              private cookieService: CookieService,
              private configService: ConfigService) {
    this.implementationGuideId = this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer);

  }

  public searchImplementationGuide = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) => {
        return this.implementationGuideService.getImplementationGuides(1, term).pipe(
          map((bundle) => {
            return (bundle.responses || []).map((entry) => <ImplementationGuide> entry.data.resource);
          })
        );
      }),
      tap(() => this.searching = false)
    );
  };

  public searchFormatter = (ig: ImplementationGuide) => {
    return `${ig.name} (id: ${ig.id})`;
  };

  public implementationGuideChanged(implementationGuide: ImplementationGuide) {
    this.selectedImplementationGuide = implementationGuide;
    this.implementationGuideId = implementationGuide ? implementationGuide.id : undefined;
    if(this.implementationGuideId !== undefined){
      this.implementationGuideIdChange.emit(this.implementationGuideId);
    }


    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

    if (implementationGuide && implementationGuide.id) {
      this.cookieService.put(cookieKey, implementationGuide.id);
    } else if (this.cookieService.get(cookieKey)) {
      this.cookieService.remove(cookieKey);
    }
  }

  async ngOnInit() {
    if (this.implementationGuideId) {
      this.selectedImplementationGuide = <ImplementationGuide> await this.implementationGuideService.getImplementationGuide(this.implementationGuideId).toPromise();
    }
  }

  async ngOnChanges() {
    if (!this.implementationGuideId) {
      this.selectedImplementationGuide = null;
    } else {
      this.selectedImplementationGuide = <ImplementationGuide> await this.implementationGuideService.getImplementationGuide(this.implementationGuideId).toPromise();
    }
  }
}
