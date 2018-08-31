const assert = require('assert');
const FhirHelper = require('../fhirHelper');

describe('FhirHelper', () => {
    describe('joinUrl', () => {
        it('should join correct urls', () => {
            const a1 = FhirHelper.joinUrl('http://test.com', 'a1');
            const a2 = FhirHelper.joinUrl('http://test.com/', 'a2');
            const a3 = FhirHelper.joinUrl('http://test.com', '/a3');
            const a4 = FhirHelper.joinUrl('http://test.com/', '/a4');
            const a5 = FhirHelper.joinUrl('http://test.com/', '/a5', 'b1');
            
            assert(a1 === 'http://test.com/a1');
            assert(a2 === 'http://test.com/a2');
            assert(a3 === 'http://test.com/a3');
            assert(a4 === 'http://test.com/a4');
            assert(a5 === 'http://test.com/a5/b1');
        });
    });

    describe('buildUrl', () => {
        it('should build correct urls', () => {
            const actual1 = FhirHelper.buildUrl('http://test.com/base');
            const actual2 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition');
            const actual3 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', 'id');
            const actual4 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', 'id', '$operation');
            const actual5 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', 'id', '$operation', { param1: 'test' });
            const actual6 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', 'id', '$operation', { param1: 'http://test.com' });
            const actual7 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', null, null, { param1: 'test' });
            const actual8 = FhirHelper.buildUrl('http://test.com/base', 'StructureDefinition', null, '$operation', { param1: 'test' });

            assert(actual1 === 'http://test.com/base');
            assert(actual2 === 'http://test.com/base/StructureDefinition');
            assert(actual3 === 'http://test.com/base/StructureDefinition/id');
            assert(actual4 === 'http://test.com/base/StructureDefinition/id/$operation');
            assert(actual5 === 'http://test.com/base/StructureDefinition/id/$operation?param1=test');
            assert(actual6 === 'http://test.com/base/StructureDefinition/id/$operation?param1=' + encodeURIComponent('http://test.com'));
            assert(actual7 === 'http://test.com/base/StructureDefinition?param1=test');
            assert(actual8 === 'http://test.com/base/StructureDefinition/$operation?param1=test');
        });
    });
});