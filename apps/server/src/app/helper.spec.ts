import {parseFhirUrl} from './helper';

describe('helper', () => {
  describe('parseFhirUrl', () => {
    it('should parse a complete fhir url', () => {
      const parsed = parseFhirUrl('/ImplementationGuide/test/$op?query1=value1&query2=value2');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBe('test');
      expect(parsed.operation).toBe('$op');
      expect(parsed.query).toBeTruthy();
      expect(parsed.query.query1).toBe('value1');
      expect(parsed.query.query2).toBe('value2');
    });

    it('should parse a fhir url without an id', () => {
      const parsed = parseFhirUrl('/ImplementationGuide/$op?query1=value1&query2=value2');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBeFalsy();
      expect(parsed.operation).toBe('$op');
      expect(parsed.query).toBeTruthy();
      expect(parsed.query.query1).toBe('value1');
      expect(parsed.query.query2).toBe('value2');
    });

    it('should parse a fhir url with _search instead of id', () => {
      const parsed = parseFhirUrl('/ImplementationGuide/_search/$op?query1=value1&query2=value2');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBeFalsy();
      expect(parsed.operation).toBe('$op');
      expect(parsed.query).toBeTruthy();
      expect(parsed.query.query1).toBe('value1');
      expect(parsed.query.query2).toBe('value2');
    });

    it('should parse a fhir url without id or _search', () => {
      const parsed = parseFhirUrl('/ImplementationGuide?query1=value1&query2=value2');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBeFalsy();
      expect(parsed.operation).toBeFalsy();
      expect(parsed.query).toBeTruthy();
      expect(parsed.query.query1).toBe('value1');
      expect(parsed.query.query2).toBe('value2');
    });

    it('should parse a fhir url without id or _search or query params', () => {
      let parsed = parseFhirUrl('/ImplementationGuide?');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBeFalsy();
      expect(parsed.operation).toBeFalsy();

      parsed = parseFhirUrl('/ImplementationGuide');
      expect(parsed).toBeTruthy();
      expect(parsed.resourceType).toBe('ImplementationGuide');
      expect(parsed.id).toBeFalsy();
      expect(parsed.operation).toBeFalsy();
    });
  });
});
