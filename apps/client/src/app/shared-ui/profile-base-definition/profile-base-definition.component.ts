import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {StructureDefinitionService} from '../../shared/structure-definition.service';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile-base-definition',
  templateUrl: './profile-base-definition.component.html',
  styleUrls: ['./profile-base-definition.component.css']
})
export class ProfileBaseDefinitionComponent implements OnInit, OnChanges {
  @Input() profileType: string;
  @Input() parentObject: any;
  @Input() propertyName: string;
  public baseProfileUrls = [];
  private changeTrigger: Subject<void> = new Subject();

  @ViewChild('selectBaseDefinitionModal', { static: true })
  private selectBaseDefinitionModal;

  constructor(
    private sdService: StructureDefinitionService,
    private modalService: NgbModal) {

    this.changeTrigger.pipe(debounceTime(500)).subscribe(() => {
      this.sdService.getBaseStructureDefinitions(this.profileType).toPromise()
        .then((results) => this.baseProfileUrls = results);
    });
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(debounceTime(300), distinctUntilChanged(), map(term => {
      return term.length < 2 ?
        [] :
        this.baseProfileUrls.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
    }));
  }

  selectBaseDefinition(url: string, modal: NgbActiveModal) {
    this.parentObject[this.propertyName] = url;
    modal.close();
  }

  openSelectBaseDefinitionModal() {
    this.modalService.open(this.selectBaseDefinitionModal, { size: 'lg' }).result.then(() => {

    });
  }

  async ngOnInit() {
    this.changeTrigger.next();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profileType']) {
      this.changeTrigger.next();
    }
  }
}
