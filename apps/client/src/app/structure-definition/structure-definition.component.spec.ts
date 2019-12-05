import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StructureDefinitionComponent} from './structure-definition.component';
import {BrowserModule} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {ConfigService} from '../shared/config.service';
import {StructureDefinitionService} from '../shared/structure-definition.service';
import {RecentItemService} from '../shared/recent-item.service';
import {FhirService} from '../shared/fhir.service';
import {FileService} from '../shared/file.service';
import {CookieService} from 'angular2-cookie/core';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {DiffMatchPatchModule} from 'ng-diff-match-patch';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {AuthService} from '../shared/auth.service';

describe('StructureDefinitionComponent', () => {
  let component: StructureDefinitionComponent;
  let fixture: ComponentFixture<StructureDefinitionComponent>;
  let httpClient: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StructureDefinitionComponent],
      imports: [
        DiffMatchPatchModule,
        AngularEditorModule,
        BrowserModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NgbModule,
        FormsModule
      ],
      providers: [
        ConfigService,
        StructureDefinitionService,
        RecentItemService,
        FhirService,
        FileService,
        CookieService,
        AuthService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: 'test' })
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    httpClient = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(StructureDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const getSdRequest = httpClient.expectOne('/api/structureDefinition/test');
    expect(getSdRequest.request.method).toBe('GET');
    getSdRequest.flush({
      resource: {
        resourceType: 'StructureDefinition',
        id: 'test',
        type: 'Composition',
        baseDefinition: 'http://hl7.org/fhir/StructureDefinition/Composition'
      }
    });

    const getBaseRequest = httpClient.expectOne('/api/structureDefinition/base');
    expect(getBaseRequest.request.method).toBe('GET');
    getBaseRequest.flush({
      resourceType: 'StructureDefinition',
      id: 'Composition'
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
  });

  afterEach(() => {
    httpClient.verify();
  })
});
