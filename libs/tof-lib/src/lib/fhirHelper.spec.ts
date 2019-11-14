import {generateId} from './fhirHelper';

describe('fhirHelper', () => {
  describe('generateId', () => {
    it('should not contain special characters', () => {
      const ids = [];

      for (let i = 0; i < 5000; i++) {
        const generatedId = generateId();
        const invalidCharacters = generatedId.match(/[^0-9A-z]/);
        expect(invalidCharacters).toBeFalsy();

        const foundExisting = ids.indexOf(generatedId) >= 0;
        expect(foundExisting).toBeFalsy();

        ids.push(generatedId);
      }
    });
  });
});
