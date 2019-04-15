import {StructureDefinitionListItemModel} from './structure-definition-list-item-model';

export class StructureDefinitionListModel {
  public pages: number;
  public total: number;
  public items: StructureDefinitionListItemModel[];
}
