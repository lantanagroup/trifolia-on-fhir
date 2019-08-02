import {HumanName} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export class PersonListModel {
  public name?: HumanName[] = [];

  constructor(obj?: any) {
    if (obj) {
      for (let name of obj.name) {
        const newName = new HumanName(name);
        this.name.push(newName);
      }
    }
  }

  public getDisplayName(): string {
    if (this.name && this.name.length > 0) {
      return this.name[0].getDisplay();
    }

    return 'Unspecified Name';
  }
}
