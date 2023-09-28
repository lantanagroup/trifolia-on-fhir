import { Coding } from './stu3/fhir';

export class Globals {
  static readonly securityDelim = '^';
  static readonly securitySystem = 'https://trifolia-fhir.lantanagroup.com/security';
  static readonly regexPatterns = {
    namePattern: '^[A-Z][A-Za-z0-9_]+$',
    fhirIdValidRegex: '^[A-Za-z0-9\\-\\.]{1,64}$'
  };

  static readonly authNamespace = 'https://auth0.com';
  static readonly defaultAuthNamespace = 'https://trifolia-fhir.lantanagroup.com';

  static readonly profileTypes = ['ImplementationGuide', 'StructureDefinition', 'CapabilityStatement', 'OperationDefinition', 'SearchParameter', 'Media'];
  static readonly terminologyTypes = ['ValueSet', 'CodeSystem', 'ConceptMap'];

  static readonly igResourceFormatExtensionUrl = 'http://hl7.org/fhir/StructureDefinition/implementationguide-resource-format';

  static readonly extensionUrls = {
    'resource-meta-source': 'http://hapifhir.io/fhir/StructureDefinition/resource-meta-source',
    'github-path': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/github-path',
    'github-branch': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/github-branch',
    'extension-ig-dependency': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency',
    'extension-ig-dependency-name': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-name',
    'extension-ig-dependency-version': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-version',
    'extension-ig-dependency-location': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-location',
    'extension-ig-dependency-id': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-dependency-id',
    'extension-ig-package-id': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-package-id',
    'extension-coding-inactive': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-coding-inactive',
    'extension-group-manager': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-group-manager',
    'extension-ig-resource-file-path': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-resource-file-path',
    'extension-cs-expectation': 'http://hl7.org/fhir/StructureDefinition/capabilitystatement-expectation',
    'extension-ig-page-nav-menu': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-nav-menu',
    'extension-sd-notes': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-notes',
    'extension-sd-intro': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-sd-intro',
    'extension-ig-parameter': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-parameter',
    'extension-practitioner-announcements': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-practitioner-announcements',
    'elementdefinition-profile-element': 'http://hl7.org/fhir/StructureDefinition/elementdefinition-profile-element',
    'extension-ig-package-list': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-package-list',
    'extension-ig-publication-request': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-publication-request',
    'extension-ig-page-content': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content',
    'extension-ig-page-filename': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-filename',
    'extension-ig-page-reuse-description': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-reuse-description',
    'extension-ig-ignore-warnings': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-ignore-warnings',
    'extension-ig-jira-spec': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-jira-spec',
    'extension-ig-custom-menu': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-custom-menu',
    'extension-ig-pub-template': 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-pub-template'
  };

  static readonly introText = {
    'export.implementationGuide': 'Select the implementation guide you wish to export here by using the typeahead bar.',
    'export.igPublisher': 'This tab exports a published version of the implementation guide.',
    'export.igPublisherOutput': 'You can select the type of output the published IG will take here.',
    'export.igPublisherJAR': 'You can also choose whether the FHIR IG Publisher JAR will be included in the export package here.',
    'export.bundle': 'This tab exports a FHIR Bundle that contains the resources referenced by the selected implementation guide.',
    'export.msword': 'This tab exports a MsWord document that contains the resources referenced by the selected implementation guide.',
    'export.bundleOutput': 'You can select the type of output the Bundle will take here.',
    'export.mswordOutput': 'You can select the type of output the Document will take here.',
    'export.github': 'This tab exports the implementation guide to a GitHub repository.',
    'export.githubMessage': 'Write the commit message that you\'d like to be associated with this IG on GitHub',
    'export.githubLogin': 'Click here to login to GitHub.',
    'export.exportButton': 'After you\'ve selected a tab and the appropriate options for your export, click here to complete the export process.',
    'resource.permissions-tab': 'This tab lets you specify who can read and edit this resource. By default, only you are allowed to view/edit the resource.',
    'resource.validation-tab': 'This tab provides real-time validation of the resource. This is only basic validation to ensure that required properties are specified correctly. More advanced validation occurs during the "Publish" process/screen.',
    'resource.raw-tab': 'This tab allows you to view the resource\'s JSON and XML representations. You may also download the various representations of the resource to your computer from here.',
    'resource.history-tab': 'This tab shows the history of the resource that the FHIR server is aware of. If the resource was exported from another server and imported into Trifolia-on-FHIR, the history of the resource from the previous server will not be known to Trifolia-on-FHIR.',
    'resource.save-btn': 'Don\'t forget to press this "Save" button. If you don\'t, you will lose your changes (includes changes from pop-up windows that don\'t expressly have a "Save" button).',
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
    'browse.vs.expand': 'Click here to expand the value set to see the calculated/enumerated list of codes.',
    'import.file-tab': 'The "Files" tab is where you can upload FHIR resources and excel-based value sets directly from your computer to Trifolia-on-FHIR.',
    'import.file.drag-and-drop': 'You can drag-and-drop files from your computer\'s file explorer here, or you may select the "Click to select" link to select the files you wish to upload.',
    'import.file.list': 'A list of the files that will be imported are shown here.',
    'import.file.delete': 'Clicking the trash icon will remove the file from the list of files that will be uploaded.',
    'import.file.formats': 'When uploading, the data will be sent to the Trifolia-on-FHIR FHIR server as a <a href="http://www.hl7.org/fhir/http.html#transaction" target="_new">transaction bundle</a>. This shows a glance of what the transaction bundle looks like prior to uploading. <strong>This is typically only important to advanced users.</strong>',
    'import.file.formats.json': 'You may click this button to download the JSON representation of the transaction bundle.',
    'import.import-btn': 'Once you are satisfied with the settings for your import, click the "Import" button to send everything to Trifolia-on-FHIR and have it persisted.',
    'import.text-tab': 'The "Text" tab allows you to copy/paste JSON or XML content directly into Trifolia-on-FHIR to have it imported.',
    'import.text.content': 'The content in this tab should represent a FHIR resource in either JSON or XML format. This content <em>should not</em> be a <a href="http://www.hl7.org/fhir/http.html#transaction" target="_new">transaction bundle</a>.',
    'import.vsac-tab': 'The "VSAC" tab allows you to import value sets and code systems directly from VSAC into Trifolia-on-FHIR, so those value sets and code systems may be referenced by and included in your implementation guide.',
    'import.vsac.id': 'Specify the OID of the value set or code system here. Ex: "2.16.840.1.113883.1.11.1" for the Administrative Gender value set',
    'import.vsac.credentials': 'You must specify your username and password for the Value Set Authority Center (VSAC) so that Trifolia-on-FHIR can retrieve the content on your behalf. <a href="https://uts.nlm.nih.gov//license.html" target="_new">Click here</a> to register for a VSAC account.',
    'import.github-tab': 'The "GitHub" tab allows you to import resources directly from GitHub. After clicking the "GitHub" tab you will be prompted to login to GitHub.',
    'import.github.repository': 'Select the repository in GitHub which you want to import files from',
    'import.github.files': 'Select the files that you want to import from the GitHub repository.',
    'import.results': 'The results of importing from the "Files" tab are shown here.',
    'publish.implementation-guide': 'Select the implementation guide that you would like to publish. This is a type-ahead field, so begin typing the name of the implementation guide you would like and the field will show you matching options.',
    'publish.options': 'Specify options you would like to use for the export.',
    'publish.validation': 'This lists any validation issues that were returned by the FHIR server\'s $validate operation. These validation issues may vary depending on the implementation of the FHIR server.',
    'publish.status': 'The publication process takes a little while to finish... While it runs, you can monitor the status of the publication process (the <a href="http://wiki.hl7.org/index.php?title=IG_Publisher_Documentation" target="_new">FHIR IG Publisher</a>) in the "Status" tab.',
    'publish.publish-btn': 'When you are satisfied with the options, press this button to start the publication process.',
    'publish.cancel-btn': 'When you\'re placed in queue and wish to cancel the publication process, press this button.',
    'ig.general-tab': 'This tab includes the most generic and high-level fields for an implementation guide, such as the name, title, version, etc.',
    'ig.narrative-tab': 'This tab includes fields to specify custom narrative for the implementation guide that may not be expressed in directly in the profiles within the implementation guide.',
    'ig.other-tab': 'This tab lets you to specify profiles that should be globally applied to the implementation guide based on a resource type. For example, you may specify a profile for Person that should be minimally required for <em>all</em> Person profiles in the implementation guide.',
    'ig.packages-tab': 'This tab lets you to define packages that are used to categorize/group resources included in the implementation guide. These packages are not commonly used and are for more advanced implementation guide authors.',
    'ig.resources-tab': 'This tab lets you indicate which profiles are included in the implementation guide. Resources referenced here <strong>SHOULD NOT</strong> be referenced by other implementation guides in the same way.',
    'other.open-resource-tab': 'Each resource that you open will show in a separate tab like this.',
    'other.search-results-tab': 'After you click the search button, the results are shown here.',
    'other.search-results-paging': 'A limited number of items are shown on this screen. Here you can navigate between multiple pages of items.',
    'other.search-criteria': 'Specify your search criteria in this tab.',
    'other.search.resource-type': 'A resource type must be selected before searching.',
    'other.search.search-btn': 'Click this button to start the search.',
    'other.resource.save': 'Click this button to save changes to permissions.',
    'other.resource.download': 'Click this button to download the resource in the format you are viewing.',
    'other.resource.upload': 'Click this button to upload changes to the resource in the format you are viewing.',
    'resource-permisisons.remove-write': 'Click this X icon to remove only write/edit permissions for this user/entity.',
    'resource-permissions.remove-both': 'Click this button to remove both read/view and write/edit permissions for this user/entity.',
    'resource-permissions.copy': 'You can specify a resource that you would like to copy permissions from to this resource.',
    'resource-permissions.copy.resource-type': 'Specify the resource type of the resource you would like to copy.',
    'resource-permissions.copy.criteria': 'This is a type-ahead field. Begin typing the name/title/id of the resource you would like to select. A drop-down should appear with matching results (if there are any).',
    'resource-permissions.copy.copy-btn': 'Once a resource has been selected to copy permissions from, click this button to copy the permissions.',
    'resource-permissions.copy.select': 'You may select a resource using more advanced searching methods with this button.'
  };

  static readonly tooltips = {
    'ImplementationGuide.resource.resourceFormatExt': 'The format of the resource, typically only used by examples of logical models, such as in CDA',
    'ElementDefinition.representation': 'This describes how the element or attribute is represented in XML. For example, a CDA model defined as a FHIR StructureDefinition might use typeAttr as a representation to indicate that xsi:type should be used to determine the type of the element.',
    'ElementDefinition.maxLength': 'Max length of string. Can only be set when the element type is Primitive (but not Boolean). Unlike cardinality, the max length can be loosened or expanded regardless of the base definition.',
    'StructureDefinition.context.type': 'The type of context provided within the StructureDefinition. Can be either a FHIR path, an Element, or an Extension.',
    'StructureDefinition.context.expression': 'Text describing the context of the StructureDefinition.',
    'implementationguide.description': 'An implementation guide (IG) is a set of rules about how FHIR resources are used (or should be used) to solve a particular problem, with associated documentation to support and clarify the usage. Classically, FHIR implementation guides are published on the web after they are generated using the FHIR Implementation Guide Publisher.\nThe ImplementationGuide resource is a single resource that defines the logical content of the IG, along with the important entry pages into the publication, so that the logical package that the IG represents, so that the contents are computable.\nIn particular, validators are able to use the ImplementationGuide resource to validate content against the implementation guide as a whole. The significant fhirResources expectation introduced by the ImplementationGuide resource is the idea of Default Profiles. Implementations may conform to multiple implementation guides at once, but this requires that the implementation guides are compatible.',
    'structuredefinition.description': 'A definition of a FHIR structure. This resource is used to describe the underlying resources, data types defined in FHIR, and also for describing extensions and constraints on resources and data types.\nThe StructureDefinition resource describes a structure - a set of data element definitions, and their associated rules of usage. These structure definitions are used to describe both the content defined in the FHIR specification itself - Resources, data types, the underlying infrastructural types, and also are used to describe how these structures are used in implementations. This allows the definitions of the structures to be shared and published through repositories of structure definitions, compared with each other, and used as the basis for code, report and UI generation.',
    'operationdefinition.description': 'A formal computable definition of an operation (on the RESTful interface) or a named query (using the search interaction).\nOperationDefinitions are published to define operations that servers can implement in a common fashion. The FHIR specification itself describes some (see below), and other organizations (including IHE, national programs, jurisdictions and vendors) are able to publish additional OperationDefinitions.',
    'capabilitystatement.description': 'A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server that may be used as a statement of actual server functionality or a statement of required or desired server implementation.\nThe capability statement is a key part of the overall fhirResources framework in FHIR. It is used as a statement of the features of actual software, or of a set of rules for an application to provide. This statement connects to all the detailed statements of functionality, such as StructureDefinitions and ValueSets. This composite statement of application capability may be used for system compatibility testing, code generation, or as the basis for a fhirResources assessment.',
    'valueset.description': 'A ValueSet resource instances specifies a set of codes drawn from one or more code systems, intended for use in a particular context. Value sets link between [[[CodeSystem]]] definitions and their use in [coded elements](terminologies.html).\nWhen using value sets, proper differentiation between a code system and a value set is important. This is one very common area where significant clinical safety risks occur in practice.',
    'codesystem.description': 'The CodeSystem resource is used to declare the existence of and describe a code system or code system supplement and its key properties, and optionally define a part or all of its content.\nCode systems define which codes (symbols and/or expressions) exist, and how they are understood. Value sets select a set of codes from one or more code systems to specify which codes can be used in a particular context.\nThe CodeSystem resource may list some or all of the concepts in the code system, along with their basic properties (code, display, definition), designations, and additional properties. Code System resources may also be used to define supplements, that extend an existing code system with additional designations and properties.',
    'questionnaire.description': 'A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection.\nA Questionnaire is an organized collection of questions intended to solicit information from patients, providers or other individuals involved in the healthcare domain. They may be simple flat lists of questions or can be hierarchically organized in groups and sub-groups, each containing questions. The Questionnaire defines the questions to be asked, how they are ordered and grouped, any intervening instructional text and what the constraints are on the allowed answers. The results of a Questionnaire can be communicated using the QuestionnaireResponse resource.',
    'ed.type.targetProfile': 'Profile (StructureDefinition) to apply to reference target (or IG). This field is a URI, and should be the StructureDefinition.url of the target profile. This is used to indicate that this type (typically a Reference) should be validated against the selected target profile',
    'ed.type.profile': 'Profile (StructureDefinition) to apply (or IG). This field is a URL, and should be the StructureDefinition.url of the profile selected',
    'implementationguide.page.auto-generate': 'When "Yes", Trifolia-on-FHIR will automatically populate this page with links to the other pages in the implementation guide.',
    'external.terminology.server': 'When left unspecified, terminology services built into the selected FHIR server will be used. When specified, indicates an external terminology server to use for the expansion. Assumes the server is unsecured. The value of this field should be the base url of the FHIR terminology server (ex: "http://tx.fhir.org/r4").',
    'ig.dependsOn.location': 'This is used to populate the IG publisher control file\'s dependencyList.location property',
    'ig.dependsOn.name': 'This is used to populate the IG publisher control file\'s dependencyList.name property',
    'ig.dependsOn':'This field represents "ImplementationGuide.dependsOn" from the core FHIR specification.',
    'support.button.clicked': 'A separate window/tab will be opened to bring you to Atlassian\'s JIRA Service Desk. An Atlassian account is required to submit support requests. If you have not registered or logged into Atlassian already, you will be prompted to do so, first.',
    'name.validation.failed': 'Name should be usable as an identifier for the module by machine processing applications such as code generation. The name must start with a capital letter, have at least two characters, and cannot contain spaces or special characters.',
    'resource.move': 'To change the ID of this resource, go back to the browse screen for the resource and click the "Change ID" button.',
    'sd.baseDefinition': 'Definition that this type is constrained/specialized from. This cannot be changed from this screen because the elements defined in the profile may be invalid with a different base definition and/or type.',
    'sd.type': 'Type defined or constrained by this structure. This cannot be changed from this screen because the elements defined in the profile may be invalid with a different type and/or base definition.',
    'sd.no-mappings': 'You must specify mappings for the profile in the "Mappings" tab, first.',
    'ig.resource.filePath': 'This file path indicates where the resource will be exported within the HTML package. The file path is relative to the "resources" directory. The resource reference should match case-sensitivity with the file path, or the FHIR IG Publisher may encounter errors. The extension of this file must be either .xml or .json and may change at the time of the export depending on the export options selected.',
    'ig.resource.exampleCanonical': 'The URL of a profile (StructureDefinition) that this is an example of can be specified here when the "Example?" field is "Unspecified".',
    'ig.resource.exampleBoolean': 'Asserts whether this resource is an example of a profile in the implementation guide. If you wish to indicate which profile this resource is an example of, set this field to "Unspecified" and select/specify the URL of the profile in the "Example of Profile" field.',
    'ig.groups': 'Groups are used during publication to group together resources in the "Artifacts Summary" page.',
    'ig.parameter': 'Defines how IG is built by tools, such as the HL7 IG Publisher. Some parameters are required by the IG Publisher, and if they are not specified here, will be automatically set by ToF during the publication process. More information about parameters and how they affect the publication template can be found <a href="https://confluence.hl7.org/display/FHIR/Implementation+Guide+Parameters" target="_blank">here</a>.',
    'github.repository.onlypush': 'Only repositories that you have the permissions to commit/push to are shown. If the repository you are looking for does not show in this list, you may need to contact the admin of the repository and ask for permissions to contribute/push/write.',
    'vsac.remember': 'If checked, these credentials will be stored in your browser\'s cookies. These credentials are never stored on the server, and are only used to authenticate requests to the VSAC on your behalf.',
    'ig.page.fileName': 'The file name of the page is the name of the file that page gets exported as in the HTML export.',
    'ig.page.name': 'The name URL/reference is a FHIR field that is used by the IG publisher to determine where the source of the content for the page should be found. It is suggested to keep this as a URL type, and reference the file name with the extension based on the "generation" type selected.',
    'ig.page.generation': 'This indicates the syntax of the page content, such as "Markdown" or "HTML". Currently, Trifolia-on-FHIR only supports specifying Markdown content. It is recommended that you leave the "Generation" field as "Markdown".',
    'ig.page.showTopNavMenu': 'This indicates if the page should be shown as a button in the top navigation menu. The value of this field should be the text you want displayed in the menu. If the same value is used for multiple pages, it will as a drop-down menu with the titles of the pages within the drop-down menu.',
    'ig.page.format': 'The format of the content for the page. It is suggested that this be left to "markdown", as this is the only format currently supported by ToF.',
    'ig.ignoreWarnings': 'The content of this file is exported as "input/ignoreWarnings.txt" when exporting as a publisher package. Each line should represent a warning copy-and-pasted from the IG Publisher\'s QA report that should be ignored by future publish operations.',
    'ig.customMenu': 'Set the structure of the main menu of the IG to a customized construction here. This will expect fully formed XML in the future.',
    'ig.publishing.template': 'This is the template that should be used by the FHIR IG publisher. It is used to pre-populate the "Template" field on the "Export" and "Publish" screens.',
    'ig.publishing.template.custom': 'It is suggested that you use the link to "Download ZIP" from a GitHub repository; it is expected that the template be in a ZIP file that is correctly structured/formatted.',
    'ig.publishing.template.custom.example': 'i.e. https://github.com/lantanagroup/ig-template-base/archive/refs/heads/master.zip',
    'ig.definition.resource.description': 'Reason why included in guide. This text will appear in the right column of the the Artifact Index page within the rendered IG',
    'structureDefinition.description': 'Natural language description of the structure definition. This text will appear on the Profile/StructureDefinition page in the Description field within the top table',
    'vsac.apikey': 'To find your API KEY, login to <a href="https://uts.nlm.nih.gov/uts/" target="_new">UMLS Terminology Services</a>, select "Visit Your Profile" under "UTF Profile" (on the right), and copy/paste the value from the "API KEY" field.'
  };

  static readonly igParameters = ['apply', 'copyrightyear', 'expansion-parameter', 'generate-json', 'generate-turtle', 'generate-xml', 'html-template', 'path-pages', 'path-resource', 'path-tx-cache', 'releaselabel', 'rule-broken-links', 'jira-code', 'path-expansion-params'];

  static readonly hl7WorkGroups = [
    { name: 'Administrative Steering Division', url: 'http://www.hl7.org/Special/committees/ssdsd' },
    { name: 'Affiliate Due Diligence', url: 'http://www.hl7.org/Special/committees/affildued' },
    { name: 'Anesthesia', url: 'http://www.hl7.org/Special/committees/gas' },
    { name: 'Architectural Review', url: 'http://www.hl7.org/Special/committees/arb' },
    { name: 'Arden Syntax', url: 'http://www.hl7.org/Special/committees/arden' },
    { name: 'Biomedical Research and Regulation', url: 'http://www.hl7.org/Special/committees/rcrim' },
    { name: 'Board Motions', url: 'http://www.hl7.org/Special/committees/boardmotions' },
    { name: 'CDA Management Group', url: 'http://www.hl7.org/Special/committees/cdamg' },
    { name: 'Clinical Decision Support', url: 'http://www.hl7.org/Special/committees/dss' },
    { name: 'Clinical Genomics', url: 'http://www.hl7.org/Special/committees/clingenomics' },
    { name: 'Clinical Information Modeling Initiative', url: 'http://www.hl7.org/Special/committees/cimi' },
    { name: 'Clinical Interoperability Council', url: 'http://www.hl7.org/Special/committees/cic' },
    { name: 'Clinical Quality Information', url: 'http://www.hl7.org/Special/committees/cqi' },
    { name: 'Clinical Steering Division', url: 'http://www.hl7.org/Special/committees/desd' },
    { name: 'Community-Based Care and Privacy (CBCP)', url: 'http://www.hl7.org/Special/committees/homehealth' },
    { name: 'Conformance', url: 'http://www.hl7.org/Special/committees/ictc' },
    { name: 'Cross-Group Projects', url: 'http://www.hl7.org/Special/committees/cgp' },
    { name: 'Education', url: 'http://www.hl7.org/Special/committees/education' },
    { name: 'Electronic Health Records', url: 'http://www.hl7.org/Special/committees/ehr' },
    { name: 'Electronic Services and Tools', url: 'http://www.hl7.org/Special/committees/esTools' },
    { name: 'Emergency Care', url: 'http://www.hl7.org/Special/committees/emergencycare' },
    { name: 'FHIR Infrastructure', url: 'http://www.hl7.org/Special/committees/fiwg' },
    { name: 'FHIR Management Group', url: 'http://www.hl7.org/Special/committees/fhirmg' },
    { name: 'Financial Management', url: 'http://www.hl7.org/Special/committees/fm' },
    { name: 'Governance and Operations', url: 'http://www.hl7.org/Special/committees/gno' },
    { name: 'Health Care Devices', url: 'http://www.hl7.org/Special/committees/healthcaredevices' },
    { name: 'HL7 Foundation Task Force / Advisory Council', url: 'http://www.hl7.org/Special/committees/foundtf' },
    { name: 'Human and Social Services', url: 'http://www.hl7.org/Special/committees/hsswg' },
    { name: 'Imaging Integration', url: 'http://www.hl7.org/Special/committees/imagemgt' },
    { name: 'Implementable Technology Specifications', url: 'http://www.hl7.org/Special/committees/xml' },
    { name: 'Infrastructure and Messaging', url: 'http://www.hl7.org/Special/committees/inm' },
    { name: 'Infrastructure Steering Division', url: 'http://www.hl7.org/Special/committees/ftsd' },
    { name: 'International Council', url: 'http://www.hl7.org/Special/committees/international' },
    { name: 'Leadership Development and Nomination Committee', url: 'http://www.hl7.org/Special/committees/nominate' },
    { name: 'Learning Health Systems', url: 'http://www.hl7.org/Special/committees/lhs' },
    { name: 'Mobile Health', url: 'http://www.hl7.org/Special/committees/mobile' },
    { name: 'Modeling and Methodology', url: 'http://www.hl7.org/Special/committees/mmm' },
    { name: 'Orders and Observations', url: 'http://www.hl7.org/Special/committees/orders' },
    { name: 'Organizational Support Steering Division', url: 'http://www.hl7.org/Special/committees/t3sd' },
    { name: 'Patient Administration', url: 'http://www.hl7.org/Special/committees/pafm' },
    { name: 'Patient Care', url: 'http://www.hl7.org/Special/committees/patientare' },
    { name: 'Patient Empowerment', url: 'http://www.hl7.org/Special/committees/patientempowerment' },
    { name: 'Payer/Provider Information Exchange Work Group', url: 'http://www.hl7.org/Special/committees/claims' },
    { name: 'Pharmacy', url: 'http://www.hl7.org/Special/committees/medication' },
    { name: 'Policy Advisory Committee', url: 'http://www.hl7.org/Special/committees/policy' },
    { name: 'Process Improvement', url: 'http://www.hl7.org/Special/committees/pi' },
    { name: 'Project Services', url: 'http://www.hl7.org/Special/committees/projectServices' },
    { name: 'Public Health', url: 'http://www.hl7.org/Special/committees/pher' },
    { name: 'Publishing', url: 'http://www.hl7.org/Special/committees/publishing' },
    { name: 'Recognition and Awards', url: 'http://www.hl7.org/Special/committees/awards' },
    { name: 'Security', url: 'http://www.hl7.org/Special/committees/secure' },
    { name: 'Services Oriented Architecture', url: 'http://www.hl7.org/Special/committees/soa' },
    { name: 'Standards Governance Board', url: 'http://www.hl7.org/Special/committees/sgb' },
    { name: 'Structured Documents', url: 'http://www.hl7.org/Special/committees/structure' },
    { name: 'Technical Steering Committee', url: 'http://www.hl7.org/Special/committees/tsc' },
    { name: 'Terminology Authority', url: 'http://www.hl7.org/Special/committees/termauth' },
    { name: 'US Realm Steering Committee', url: 'http://www.hl7.org/Special/committees/usrealm' },
    { name: 'V2 Management Group', url: 'http://www.hl7.org/Special/committees/v2management' },
    { name: 'Vocabulary', url: 'http://www.hl7.org/Special/committees/vocab' }
  ];

  static readonly cookieKeys = {
    recentImplementationGuides: 'recentImplementationGuides',
    recentStructureDefinitions: 'recentStructureDefinitions',
    recentCapabilityStatements: 'recentCapabilityStatements',
    recentSearchParameters: 'recentSearchParameters',
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
    lastResponseFormat: 'lastResponseFormat',
    lastTemplateType: 'lastTemplateType',
    lastTemplate: 'lastTemplate',
    lastTemplateVersion: 'lastTemplateVersion',
  };

  static readonly FHIRUrls = {
    ImplementationGuide: 'http://hl7.org/fhir/StructureDefinition/ImplementationGuide',
    StructureDefinition: 'http://hl7.org/fhir/StructureDefinition/StructureDefinition'
  };

  static readonly designationUseCodes: Coding[] = [
    {code: '900000000000003001', display: 'Fully specified name', system: 'http://snomed.info/sct'},
    {code: '900000000000013009', display: 'Synonym', system: 'http://snomed.info/sct'},
    {code: '900000000000550004', display: 'Definition', system: 'http://snomed.info/sct'}
  ];

  static readonly codeSystemHierarchyMeaningCodes: Coding[] = [
    {code: 'grouped-by', display: 'Grouped By', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning'},
    {code: 'is-a', display: 'Is-A', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning'},
    {code: 'part-of', display: 'Part Of', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning'},
    {code: 'classified-with', display: 'Classified With', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning'}
  ];

  static readonly mimeTypeCodes: Coding[] = [
    {code: 'application/json', display: 'JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'application/fhir+json', display: 'FHIR JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'application/xml', display: 'XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'application/fhir+xml', display: 'FHIR XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'text/xml', display: 'Text XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'text/plain', display: 'Plain Text', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'text/css', display: 'CSS', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'image/png', display: 'PNG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'image/jpeg', display: 'JPEG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'application/pdf', display: 'PDF', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'},
    {code: 'application/octet-stream', display: 'Octet Stream', system: 'http://www.rfc-editor.org/bcp/bcp13.txt'}
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

    return options.find((next) => {
      const isSystemMatch = !matchSystem || code.system === next.system;
      const isCodeMatch = !matchCode || code.code === next.code;
      return isSystemMatch && isCodeMatch;
    });
  }

  static getChoiceSelectionName(obj: any, propertyName: string, choices?: Coding[]): string {
    const keys = Object.keys(obj);

    if (choices) {
      const foundChoiceProperties = keys.filter((key: string) => {
        const foundChoice = choices.find((choice: Coding) => {
          return choice.code === propertyName + key;
        });
        return !!foundChoice;
      });

      if (foundChoiceProperties.length > 0) {
        return foundChoiceProperties[0];
      } else {
        return;
      }
    }

    const foundProperties = keys.filter((key: string) => key.startsWith(propertyName));

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

  static trackByFn(index) {
    return index;
  }

  static getCleanFileName(value: string) {
    if (!value) {
      return '';
    }

    return value
      .trim()
      .replace(/[^\w\-\\.]/gm, '');
  }
}
