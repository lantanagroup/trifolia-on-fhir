import {Component, DoCheck, Input, OnDestroy, OnInit} from '@angular/core';
import {OperationOutcome, Questionnaire, QuestionnaireItemComponent} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RecentItemService} from '../shared/recent-item.service';
import {FileService} from '../shared/file.service';
import {FhirService} from '../shared/fhir.service';
import {QuestionnaireService} from '../shared/questionnaire.service';
import {ConfigService} from '../shared/config.service';
import {QuestionnaireItemModalComponent} from './questionnaire-item-modal.component';
import {AuthService} from '../shared/auth.service';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';

export class ItemModel {
  public item: QuestionnaireItemComponent;
  public expanded = false;
  public level = 1;
  public parent?: ItemModel;

  constructor(parent?: ItemModel, item?: QuestionnaireItemComponent, level?: number) {
    this.parent = parent;
    this.item = item;
    this.level = level || 1;
  }

  public getSpaces() {
    let spaces = '';

    for (let i = 1; i < this.level; i++) {
      spaces += '    ';
    }

    return spaces;
  }

  public hasChildren(): boolean {
    return this.item.item && this.item.item.length > 0;
  }
}

@Component({
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit, OnDestroy, DoCheck {
  @Input() public questionnaire: Questionnaire;
  public message: string;
  public validation: any;
  public flattenedItems: ItemModel[];
  public qNotFound = false;
  private navSubscription: any;

  constructor(
    public route: ActivatedRoute,
    public configService: ConfigService,
    private authService: AuthService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private modalService: NgbModal,
    private recentItemService: RecentItemService,
    private fileService: FileService,
    private fhirService: FhirService) {

    this.questionnaire = new Questionnaire({ meta: this.authService.getDefaultMeta() });
  }

  public get isNew(): boolean {
    const id = this.route.snapshot.paramMap.get('id');
    return !id || id === 'new';
  }

  public get isFile(): boolean {
    return this.route.snapshot.paramMap.get('id') === 'from-file';
  }

  public revert() {
    if (!confirm('Are you sure you want to revert your changes to the questionnaire?')) {
      return;
    }

    this.getQuestionnaire();
  }

  public save() {
    if (!this.validation.valid && !confirm('This questionnaire is not valid, are you sure you want to save?')) {
      return;
    }

    if (this.isFile) {
      this.fileService.saveFile();
      return;
    }

    this.questionnaireService.save(this.questionnaire)
      .subscribe((results: Questionnaire) => {
        if (this.isNew) {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate([`${this.configService.baseSessionUrl}/questionnaire/${results.id}`]);
        } else {
          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentQuestionnaires,
            results.id,
            results.name || results.title);
          this.message = 'Your changes have been saved!';
          setTimeout(() => {
            this.message = '';
          }, 3000);
        }
      }, (err) => {
        this.message = `An error occurred while saving the questionnaire: ${err.message}`;
      });
  }

  private getQuestionnaire() {
    const questionnaireId = this.route.snapshot.paramMap.get('id');

    if (this.isFile) {
      if (this.fileService.file) {
        this.questionnaire = <Questionnaire>this.fileService.file.resource;
        this.nameChanged();
      } else {
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigate([this.configService.baseSessionUrl]);
        return;
      }
    }

    if (!this.isNew) {
      this.questionnaireService.get(questionnaireId)
        .subscribe((questionnaire: Questionnaire | OperationOutcome) => {
          if (questionnaire.resourceType !== 'Questionnaire') {
            this.message = 'The specified questionnaire either does not exist or was deleted';
            return;
          }

          this.questionnaire = <Questionnaire>questionnaire;
          this.nameChanged();
          this.initFlattenedItems();

          this.recentItemService.ensureRecentItem(
            Globals.cookieKeys.recentQuestionnaires,
            questionnaire.id,
            this.questionnaire.name || this.questionnaire.title);
        }, (err) => {
          this.qNotFound = err.status === 404;
          this.message = getErrorString(err);
          this.recentItemService.removeRecentItem(Globals.cookieKeys.recentQuestionnaires, questionnaireId);
        });
    }
  }

  private initFlattenedItems() {
    this.flattenedItems = (this.questionnaire.item || []).map((item) => {
      const newItemModel = new ItemModel();
      newItemModel.item = item;
      newItemModel.level = 1;
      return newItemModel;
    });
  }

  public toggleItems() {
    const newItems = [{
      linkId: Math.floor(1000 + Math.random() * 9000).toString()
    }];
    Globals.toggleProperty(this.questionnaire, 'item', newItems, () => {
      this.initFlattenedItems();
    });
  }

  public removeItem(itemModel: ItemModel) {
    if (itemModel.expanded) {
      this.toggleExpandItem(itemModel);       // Make sure the item is closed so that children can be more-easily removed
    }

    if (itemModel.parent) {
      const parentItem = itemModel.parent.item;
      const itemIndex = parentItem.item.indexOf(itemModel.item);
      parentItem.item.splice(itemIndex, 1);
    } else {
      const itemIndex = this.questionnaire.item.indexOf(itemModel.item);
      this.questionnaire.item.splice(itemIndex, 1);
    }

    const itemModelIndex = this.flattenedItems.indexOf(itemModel);
    this.flattenedItems.splice(itemModelIndex, 1);
  }

  public editItem(itemModel: ItemModel) {
    const modalRef = this.modalService.open(QuestionnaireItemModalComponent, {size: 'lg'});
    modalRef.componentInstance.item = itemModel.item;
    modalRef.componentInstance.questionnaire = this.questionnaire;
  }

  public addItem(parent?: ItemModel) {
    if (parent && !parent.expanded) {       // Make sure the parent is expanded before adding the new child
      this.toggleExpandItem(parent);
    }

    const newItem = {
      linkId: Math.floor(1000 + Math.random() * 9000).toString()
    };

    if (parent) {
      if (!parent.item.item) {
        parent.item.item = [];
      }

      const childItemModels = this.flattenedItems.filter((itemModel) => itemModel.parent === parent);
      let lastIndex = this.flattenedItems.indexOf(parent);

      if (childItemModels.length > 0) {
        lastIndex = this.flattenedItems.indexOf(childItemModels[childItemModels.length - 1]);
      }

      parent.item.item.push(newItem);
      this.flattenedItems.splice(lastIndex + 1, 0, new ItemModel(parent, newItem, parent.level + 1));

      if (!parent.item.type) {
        parent.item.type = 'group';
      }
    } else {
      this.questionnaire.item.push(newItem);
      this.flattenedItems.push(new ItemModel(null, newItem, 1));
    }
  }

  private findDescendentItems(itemModel: ItemModel): ItemModel[] {
    const children = this.flattenedItems.filter((next) => next.parent === itemModel);
    let all = [].concat(children);
    children.forEach((child) => {
      const next = this.findDescendentItems(child);
      all = all.concat(next);
    });
    return all;
  }

  public toggleExpandItem(itemModel: ItemModel) {
    if (itemModel.expanded) {
      const descendentItems = this.findDescendentItems(itemModel);

      for (let i = descendentItems.length - 1; i >= 0; i--) {
        const index = this.flattenedItems.indexOf(descendentItems[i]);
        this.flattenedItems.splice(index, 1);
      }

      itemModel.expanded = false;
    } else {
      let startingIndex = this.flattenedItems.indexOf(itemModel) + 1;

      (itemModel.item.item || []).forEach((item) => {
        const newItemModel = new ItemModel(itemModel, item, itemModel.level + 1);
        this.flattenedItems.splice(startingIndex, 0, newItemModel);
        startingIndex++;
      });

      itemModel.expanded = true;
    }
  }

  public canMoveItemUp(itemModel: ItemModel): boolean {
    const parentItem = itemModel.parent ? itemModel.parent.item : null;
    let itemIndex;

    if (parentItem) {
      itemIndex = parentItem.item.indexOf(itemModel.item);
    } else {
      itemIndex = this.questionnaire.item.indexOf(itemModel.item);
    }

    return itemIndex > 0;
  }

  public canMoveItemDown(itemModel: ItemModel): boolean {
    const parentItem = itemModel.parent ? itemModel.parent.item : null;

    if (parentItem) {
      const itemIndex = parentItem.item.indexOf(itemModel.item);
      return itemIndex < parentItem.item.length - 1;
    } else {
      const itemIndex = this.questionnaire.item.indexOf(itemModel.item);
      return itemIndex < this.questionnaire.item.length - 1;
    }
  }

  public moveItem(up: boolean, itemModel: ItemModel) {
    const wasExpanded = itemModel.expanded;
    const parentItem = itemModel.parent ? itemModel.parent.item : null;
    const itemModelIndex = this.flattenedItems.indexOf(itemModel);

    // Make sure the item is collapsed before we muck with the order of it
    if (wasExpanded) {
      this.toggleExpandItem(itemModel);
    }

    if (parentItem) {
      const itemIndex = parentItem.item.indexOf(itemModel.item);
      const newItemIndex = up ? itemIndex - 1 : itemIndex + 1;
      const newItemModelIndex = up ? itemModelIndex - 1 : itemModelIndex + 1;

      // remove the item and the itemModel from its parent
      parentItem.item.splice(itemIndex, 1);
      this.flattenedItems.splice(itemModelIndex, 1);

      // add the item in its new position to both the parent item and the flattened items
      parentItem.item.splice(newItemIndex, 0, itemModel.item);
      this.flattenedItems.splice(newItemModelIndex, 0, itemModel);
    } else {
      const itemIndex = this.questionnaire.item.indexOf(itemModel.item);
      const newItemIndex = up ? itemIndex - 1 : itemIndex + 1;
      const newItemModelIndex = up ? itemModelIndex - 1 : itemModelIndex + 1;

      // remove the item and the itemModel from its parent
      this.questionnaire.item.splice(itemIndex, 1);
      this.flattenedItems.splice(itemModelIndex, 1);

      // add the item in its new position to both the parent item and the flattened items
      this.questionnaire.item.splice(newItemIndex, 0, itemModel.item);
      this.flattenedItems.splice(newItemModelIndex, 0, itemModel);
    }

    // Re-expand the item if it was originally expanded
    if (wasExpanded) {
      this.toggleExpandItem(itemModel);
    }
  }

  ngOnInit() {
    this.navSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd && e.url.startsWith('/questionnaire/')) {
        this.getQuestionnaire();
      }
    });
    this.getQuestionnaire();
  }

  ngOnDestroy() {
    this.navSubscription.unsubscribe();
    this.configService.setTitle(null);
  }

  nameChanged() {
    this.configService.setTitle(`Questionnaire - ${this.questionnaire.title || this.questionnaire.name || 'no-name'}`);
  }

  ngDoCheck() {
    if (this.questionnaire) {
      this.validation = this.fhirService.validate(this.questionnaire);
    }
  }
}
