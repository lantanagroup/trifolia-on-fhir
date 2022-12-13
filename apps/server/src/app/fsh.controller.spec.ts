import * as profile from '../../../../test/data/shareableplandefinition.profile.json';
import { FshController } from './fsh.controller';

describe('FSH', () => {
  describe('JSON Object -> FSH', () => {
    it('should convert', async () => {
      const fshController = new FshController();
      const res = await fshController.convertToFSH(profile);
      expect(res).toBeTruthy();
      expect(res.fsh).toBeTruthy();
      expect(res.fsh.indexOf('Profile: observation-resprate') > 0).toBeTruthy();
    });
  });

  describe('FSH -> JSON Object', () => {
    it('should convert', async () => {
      const fsh = 'Profile: Shareable_PlanDefinition\n' +
        'Parent: PlanDefinition\n' +
        'Id: shareableplandefinition\n' +
        'Description: "Enforces the minimum information set for the plan definition metadata required by HL7 and other organizations that share and publish plan definitions"\n' +
        '* ^name = "Shareable PlanDefinition"\n' +
        '* ^status = #draft';

      const fshController = new FshController();
      const resource = await fshController.convertFromFSH(fsh);
      expect(resource).toBeTruthy();
    });
  });
});
