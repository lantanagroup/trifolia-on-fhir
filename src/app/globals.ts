import {Coding} from './models/stu3/fhir';
import * as _ from 'underscore';

export class Globals {
    static readonly regexPatterns = {
        namePattern: '^[A-Z][A-Za-z0-9_]+$'
    };

    static readonly extensionUrls = {
        'ig-depends-on-name': 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-name',
        'ig-depends-on-location': 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/extension-ig-depends-on-location',
        'stu3-github-path': 'https://trifolia-fhir.lantanagroup.com/stu3/StructureDefinition/github-path',
        'stu3-github-branch': 'https://trifolia-fhir.lantanagroup.com/stu3/StructureDefinition/github-branch',
        'r4-github-path': 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/github-path',
        'r4-github-branch': 'https://trifolia-fhir.lantanagroup.com/r4/StructureDefinition/github-branch',
        'extension-ig-dependency': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency',
        'extension-ig-dependency-name': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name',
        'extension-ig-dependency-version': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version',
        'extension-ig-dependency-location': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location',
        'extension-ig-page-content': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content',
        'extension-ig-page-auto-generate-toc': 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc',
        'extension-ig-package-id': 'https://trifolia-fhir.lantanagroup.com/stu3/StructureDefinition/extension-ig-package-id'
    };

    static readonly introText = {
        'sd.general-tab': 'The general tab contains the basic meta data of the profile/extension, such as the canonical URL, name and any implementation guide(s) that the profile belongs to.',
        'sd.narrative-tab': 'The narrative tab contains rich-text enabled fields that contain narrative content, such as the description, purpose and copyright.',
        'sd.additional-tab': 'The additional tab contains properties that are less commonly used in profiles, such as identifiers and use context.',
        'sd.mappings-tab': 'The mappings tab includes fields that indicate external specifications that the content is mapped to.',
        'sd.elements-tab': 'The elements tab is where you define the elements that are to be constrained by the profile.',
        'sd.general.implementation-guides': 'This is where you can specify what implementation guide you profile/extension belongs to.',
        'sd.general.implementation-guides.add': 'Click the add (plus) button to add this profile/extension to an implementation guide. When adding, don\'t forget to click the "Done" (check-mark) icon to confirm your selection, prior to saving the profile/extension.',
        'sd.elements.constrain': 'Click this button to constrain the element.',
        'sd.elements.slice': 'If the element can be repeated, you can slice the element using this icon.',
        'sd.elements.remove': 'Click this button to remove the constraint from the element.',
        'sd.elements.row-constrained': 'Constrained elements will show as bold.',
        'sd.element-panel.narrative-tab': 'The narrative tab has properties that have narrative in them, such as the \'definition\' of the element, or the \'short\' name for the element.',
        'sd.element-panel.binding-tab': 'The binding tab includes properties related to bindings, such as a value set binding.',
        'sd.element-panel.json-tab': 'The JSON tab shows the current selected element\'s raw JSON representation.',
        'sd.element-panel.slicing-tab': 'The Slicing tab includes properties related to slicing. It is only available when having selected a sliced element.',
        'sd.element-panel.general-tab': 'The general tab has properties that are commonly modified for elements, such as cardinality, type and max length.',
        'browse.edit': 'Click here to edit the resource.',
        'browse.ig.view': 'Click here to view the most recently published version of the implementation guide.',
        'browse.remove': 'Click here to remove the resource. You will be prompted to confirm your decision before it is deleted.',
        'browse.changeid': 'Click here to change the ID of the resource.',
        'browse.paging': 'A limited number of items are shown on this screen. Here you can navigate between multiple pages of items.',
        'browse.search': 'Here you can search for items based on specific criteria.',
        'browse.add': 'Click this button to create a new resource.',
        'browse.vs.expand': 'Click here to expand the value set to see the calculated/enumerated list of codes.'
    };

    static readonly tooltips = {
        'implementationguide.description': 'An implementation guide (IG) is a set of rules about how FHIR resources are used (or should be used) to solve a particular problem, with associated documentation to support and clarify the usage. Classically, FHIR implementation guides are published on the web after they are generated using the FHIR Implementation Guide Publisher.\nThe ImplementationGuide resource is a single resource that defines the logical content of the IG, along with the important entry pages into the publication, so that the logical package that the IG represents, so that the contents are computable.\nIn particular, validators are able to use the ImplementationGuide resource to validate content against the implementation guide as a whole. The significant conformance expectation introduced by the ImplementationGuide resource is the idea of Default Profiles. Implementations may conform to multiple implementation guides at once, but this requires that the implementation guides are compatible.',
        'structuredefinition.description': 'A definition of a FHIR structure. This resource is used to describe the underlying resources, data types defined in FHIR, and also for describing extensions and constraints on resources and data types.\nThe StructureDefinition resource describes a structure - a set of data element definitions, and their associated rules of usage. These structure definitions are used to describe both the content defined in the FHIR specification itself - Resources, data types, the underlying infrastructural types, and also are used to describe how these structures are used in implementations. This allows the definitions of the structures to be shared and published through repositories of structure definitions, compared with each other, and used as the basis for code, report and UI generation.',
        'operationdefinition.description': 'A formal computable definition of an operation (on the RESTful interface) or a named query (using the search interaction).\nOperationDefinitions are published to define operations that servers can implement in a common fashion. The FHIR specification itself describes some (see below), and other organizations (including IHE, national programs, jurisdictions and vendors) are able to publish additional OperationDefinitions.',
        'capabilitystatement.description': 'A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server that may be used as a statement of actual server functionality or a statement of required or desired server implementation.\nThe capability statement is a key part of the overall conformance framework in FHIR. It is used as a statement of the features of actual software, or of a set of rules for an application to provide. This statement connects to all the detailed statements of functionality, such as StructureDefinitions and ValueSets. This composite statement of application capability may be used for system compatibility testing, code generation, or as the basis for a conformance assessment.',
        'valueset.description': 'A ValueSet resource instances specifies a set of codes drawn from one or more code systems, intended for use in a particular context. Value sets link between [[[CodeSystem]]] definitions and their use in [coded elements](terminologies.html).\nWhen using value sets, proper differentiation between a code system and a value set is important. This is one very common area where significant clinical safety risks occur in practice.',
        'codesystem.description': 'The CodeSystem resource is used to declare the existence of and describe a code system or code system supplement and its key properties, and optionally define a part or all of its content.\nCode systems define which codes (symbols and/or expressions) exist, and how they are understood. Value sets select a set of codes from one or more code systems to specify which codes can be used in a particular context.\nThe CodeSystem resource may list some or all of the concepts in the code system, along with their basic properties (code, display, definition), designations, and additional properties. Code System resources may also be used to define supplements, that extend an existing code system with additional designations and properties.',
        'questionnaire.description': 'A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection.\nA Questionnaire is an organized collection of questions intended to solicit information from patients, providers or other individuals involved in the healthcare domain. They may be simple flat lists of questions or can be hierarchically organized in groups and sub-groups, each containing questions. The Questionnaire defines the questions to be asked, how they are ordered and grouped, any intervening instructional text and what the constraints are on the allowed answers. The results of a Questionnaire can be communicated using the QuestionnaireResponse resource.',
        'ed.type.targetProfile': 'Profile (StructureDefinition) to apply to reference target (or IG). This field is a URI, and should be the StructureDefinition.url of the target profile. This is used to indicate that this type (typically a Reference) should be validated against the selected target profile',
        'ed.type.profile': 'Profile (StructureDefinition) to apply (or IG). This field is a URL, and should be the StructureDefinition.url of the profile selected',
        'implementationguide.page.auto-generate': 'When "Yes", Trifolia-on-FHIR will automatically populate this page with links to the other pages in the implementation guide.',
        'external.terminology.server': 'When left unspecified, terminology services built into the selected FHIR server will be used. When specified, indicates an external terminology server to use for the expansion. Assumes the server is unsecured. The value of this field should be the base url of the FHIR terminology server (ex: "http://tx.fhir.org/r4").',
        'ig.dependsOn.location': 'This is used to populate the IG publisher control file\'s dependencyList.location property',
        'ig.dependsOn.name': 'This is used to populate the IG publisher control file\'s dependencyList.name property',
        'support.button.clicked': 'A separate window/tab will be opened to bring you to Atlassian\'s JIRA Service Desk. An Atlassian account is required to submit support requests. If you have not registered or logged into Atlassian already, you will be prompted to do so, first.',
        'name.validation.failed': 'Name should be usable as an identifier for the module by machine processing applications such as code generation. The name must start with a capital letter, have at least two characters, and cannot contain spaces or special characters.'
    };

    static readonly cookieKeys = {
        recentImplementationGuides: 'recentImplementationGuides',
        recentStructureDefinitions: 'recentStructureDefinitions',
        recentCapabilityStatements: 'recentCapabilityStatements',
        recentOperationDefinitions: 'recentOperationDefinitions',
        recentValueSets: 'recentValueSets',
        recentCodeSystems: 'recentCodeSystems',
        recentQuestionnaires: 'recentQuestionnaires',
        exportLastImplementationGuideId: 'exportLastImplementationGuideId',
        exportLastUseTerminologyServer: 'exportLastUseTerminologyServer',
        exportLastIncludeFhirIgPublisher: 'exportLastIncludeFhirIgPublisher',
        exportLastDownloadOutput: 'exportLastDownloadOutput',
        exportLastUseLatestIgPublisher: 'exportLastUseLatestIgPublisher',
        atlassianAccountConfirmed: 'atlassian_account_confirmed',
        lastResponseFormat: 'lastResponseFormat'
    };

    static readonly FHIRUrls = {
        ImplementationGuide: 'http://hl7.org/fhir/StructureDefinition/ImplementationGuide',
        StructureDefinition: 'http://hl7.org/fhir/StructureDefinition/StructureDefinition'
    };

    static readonly designationUseCodes: Coding[] = [
        { code: '900000000000003001', display: 'Fully specified name', system: 'http://snomed.info/sct' },
        { code: '900000000000013009', display: 'Synonym', system: 'http://snomed.info/sct' },
        { code: '900000000000550004', display: 'Definition', system: 'http://snomed.info/sct' }
    ];

    static readonly codeSystemHierarchyMeaningCodes: Coding[] = [
        { code: 'grouped-by', display: 'Grouped By', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'is-a', display: 'Is-A', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'part-of', display: 'Part Of', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'classified-with', display: 'Classified With', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' }
    ];

    static readonly mimeTypeCodes: Coding[] = [
        { code: 'application/json', display: 'JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/fhir+json', display: 'FHIR JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/xml', display: 'XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/fhir+xml', display: 'FHIR XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/xml', display: 'Text XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/plain', display: 'Plain Text', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/css', display: 'CSS', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'image/png', display: 'PNG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'image/jpeg', display: 'JPEG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/pdf', display: 'PDF', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/octet-stream', display: 'Octet Stream', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' }
    ];

    static readonly dataTypes = [
        'instant',
        'time',
        'date',
        'dateTime',
        'decimal',
        'integer',
        'unsignedInt',
        'base64Binary',
        'string',
        'positiveInt',
        'code',
        'id',
        'oid',
        'uri',
        'boolean',
        'markdown',
        'Ratio',
        'Period',
        'Range',
        'Attachment',
        'Identifier',
        'HumanName',
        'Annotation',
        'Address',
        'ContactPoint',
        'SampledData',
        'Money',
        'Count',
        'Duration',
        'SimpleQuantity',
        'Quantity',
        'Distance',
        'Age',
        'CodeableConcept',
        'Signature',
        'Coding',
        'Timing'
    ];

    static toggleProperty(parent, propertyName, defaultValue, callback?: any, caller?: any) {
        if (!parent) {
            return;
        }

        if (parent.hasOwnProperty(propertyName)) {
            delete parent[propertyName];
        } else {
            parent[propertyName] = defaultValue;

            if (callback) {
                if (caller) {
                    callback.call(caller);
                } else {
                    callback();
                }
            }
        }
    }

    static getChoiceProperty(parent, propertyName, choices) {
        let foundChoice;

        if (propertyName.lastIndexOf('[x]') === propertyName.length - 4) {
            propertyName = propertyName.substring(0, propertyName.length - 4);
        }

        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i].substring(0, 1).toUpperCase() + choices[i].substring(1);
            if (parent.hasOwnProperty(propertyName + choice)) {
                foundChoice = choice;
            }
        }

        return foundChoice;
    }

    /**
     * Returns a code from the options that matches the code
     * For use within select/drop-downs when it has to match an object in the options by reference
     * @param {Coding} code
     * @param {Coding[]} options
     * @param {boolean} matchSystem Whether to match based on the system
     * @param {boolean} matchCode Whether to match based on the code
     * @returns {any}
     */
    static getSelectCoding(code: Coding, options: Coding[], matchSystem = true, matchCode = true) {
        if (!matchSystem && !matchCode) {
            throw new Error('At least one of matchSystem or matchCode must be true');
        }

        return _.find(options, (next) => {
            const isSystemMatch = !matchSystem || code.system === next.system;
            const isCodeMatch = !matchCode || code.code === next.code;
            return isSystemMatch && isCodeMatch;
        });
    }

    static getChoiceSelectionName(obj: any, propertyName: string, choices?: Coding[]): string {
        const keys = Object.keys(obj);

        if (choices) {
            const foundProperties = _.filter(keys, (key: string) => {
                const foundChoice = _.find(choices, (choice: Coding) => {
                    return choice.code === propertyName + key;
                });
                return !!foundChoice;
            });

            if (foundProperties.length > 0) {
                return foundProperties[0];
            } else {
                return;
            }
        }

        const foundProperties = _.filter(keys, (key: string) => key.startsWith(propertyName));

        if (foundProperties.length > 0) {
            return foundProperties[0];
        } else {
            return;
        }
    }

    static generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getShortString(theString: string, pre: boolean = true, length: number = 20): string {
        if (theString && theString.length > length) {
            if (pre) {
                return theString.substring(0, length) + '...';
            } else {
                return '...' + theString.substring(theString.length - length);
            }
        }

        return theString;
    }

    static toggleChoiceProperty(parent, property, choices, defaultValue) {
        const foundChoice = this.getChoiceProperty(parent, property, choices);

        if (foundChoice) {
            delete parent[property + foundChoice];
        } else {
            const defaultChoice = choices[0].substring(0, 1).toUpperCase() + choices[0].substring(1);
            parent[property + defaultChoice] = defaultValue;
        }
    }

    static trackByFn(index, item) {
        return index;
    }
}
