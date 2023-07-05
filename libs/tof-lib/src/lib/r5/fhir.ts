import * as IFhir from '../fhirInterfaces';
import {Globals} from '../globals';

declare type AddressUse1 = 'home'|'work'|'temp'|'old'|'billing';
declare type AddressType1 = 'postal'|'physical'|'both';
declare type QuantityComparator1 = '<'|'<='|'>='|'>';
declare type ReferenceType1 = 'Resource';
declare type IdentifierUse1 = 'usual'|'official'|'temp'|'secondary'|'old';
declare type ContactPointSystem1 = 'phone'|'fax'|'email'|'pager'|'url'|'sms'|'other';
declare type ContactPointUse1 = 'home'|'work'|'temp'|'old'|'mobile';
declare type ContributorType1 = 'author'|'editor'|'reviewer'|'endorser';
declare type DataRequirementType1 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource'|'Type'|'Any';
declare type DataRequirementDirection1 = 'ascending'|'descending';
declare type TimingDayOfWeek1 = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';
declare type TimingWhen1 = 'MORN'|'MORN.early'|'MORN.late'|'NOON'|'AFT'|'AFT.early'|'AFT.late'|'EVE'|'EVE.early'|'EVE.late'|'NIGHT'|'PHS';
declare type ElementDefinitionRepresentation1 = 'xmlAttr'|'xmlText'|'typeAttr'|'cdaText'|'xhtml';
declare type ElementDefinitionType1 = 'value'|'exists'|'pattern'|'type'|'profile';
declare type ElementDefinitionRules1 = 'closed'|'open'|'openAtEnd';
declare type ElementDefinitionCode1 = 'http://hl7.org/fhirpath/System.String'|'http://hl7.org/fhirpath/System.Boolean'|'http://hl7.org/fhirpath/System.Date'|'http://hl7.org/fhirpath/System.DateTime'|'http://hl7.org/fhirpath/System.Decimal'|'http://hl7.org/fhirpath/System.Integer'|'http://hl7.org/fhirpath/System.Time'|'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type ElementDefinitionAggregation1 = 'contained'|'referenced';
declare type ElementDefinitionVersioning1 = 'either'|'independent'|'specific';
declare type HumanNameUse1 = 'usual'|'official'|'temp'|'nickname'|'anonymous'|'old';
declare type ExpressionLanguage1 = 'text/cql'|'text/fhirpath'|'application/x-fhir-query'|'text/cql-identifier'|'text/cql-expression';
declare type ParameterDefinitionUse1 = 'in'|'out';
declare type ParameterDefinitionType1 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource'|'Type'|'Any';
declare type RelatedArtifactType1 = 'documentation'|'justification'|'citation'|'predecessor'|'successor'|'derived-from'|'depends-on'|'composed-of';
declare type TriggerDefinitionType1 = 'named-event'|'periodic'|'data-changed'|'data-accessed'|'data-access-ended';
declare type ElementDefinitionSeverity1 = 'error'|'warning';
declare type ElementDefinitionStrength1 = 'required'|'extensible'|'preferred'|'example';
declare type NarrativeStatus1 = 'generated'|'extensions'|'additional'|'empty';
declare type AccountStatus1 = 'active'|'inactive'|'entered-in-error'|'on-hold'|'unknown';
declare type ActivityDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ActivityDefinitionKind1 = 'Appointment'|'AppointmentResponse'|'CarePlan'|'Claim'|'CommunicationRequest'|'Contract'|'DeviceRequest'|'EnrollmentRequest'|'ImmunizationRecommendation'|'MedicationRequest'|'NutritionOrder'|'ServiceRequest'|'SupplyRequest'|'Task'|'VisionPrescription';
declare type ActivityDefinitionIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type ActivityDefinitionPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type ActivityDefinitionType1 = 'patient'|'practitioner'|'related-person'|'device';
declare type AdministrableProductDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type AdverseEventActuality1 = 'actual'|'potential';
declare type AllergyIntoleranceType1 = 'allergy'|'intolerance';
declare type AllergyIntoleranceCategory1 = 'food'|'medication'|'environment'|'biologic';
declare type AllergyIntoleranceCriticality1 = 'low'|'high'|'unable-to-assess';
declare type AllergyIntoleranceSeverity1 = 'mild'|'moderate'|'severe';
declare type AppointmentStatus1 = 'proposed'|'pending'|'booked'|'arrived'|'fulfilled'|'cancelled'|'noshow'|'entered-in-error'|'checked-in'|'waitlist';
declare type AppointmentRequired1 = 'required'|'optional'|'information-only';
declare type AppointmentStatus2 = 'accepted'|'declined'|'tentative'|'needs-action';
declare type AppointmentResponseParticipantStatus1 = 'accepted'|'declined'|'tentative'|'needs-action';
declare type AuditEventAction1 = 'C'|'R'|'U'|'D'|'E';
declare type AuditEventOutcome1 = '0'|'4'|'8'|'12';
declare type AuditEventType1 = '1'|'2'|'3'|'4'|'5';
declare type BiologicallyDerivedProductProductCategory1 = 'organ'|'tissue'|'fluid'|'cells'|'biologicalAgent';
declare type BiologicallyDerivedProductStatus1 = 'available'|'unavailable';
declare type BiologicallyDerivedProductScale1 = 'farenheit'|'celsius'|'kelvin';
declare type BundleType1 = 'document'|'message'|'transaction'|'transaction-response'|'batch'|'batch-response'|'history'|'searchset'|'collection';
declare type BundleMode1 = 'match'|'include'|'outcome';
declare type BundleMethod1 = 'GET'|'HEAD'|'POST'|'PUT'|'DELETE'|'PATCH';
declare type CapabilityStatementStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type CapabilityStatementKind1 = 'instance'|'capability'|'requirements';
declare type CapabilityStatementFhirVersion1 = '0.01'|'0.05'|'0.06'|'0.11'|'0.0.80'|'0.0.81'|'0.0.82'|'0.4.0'|'0.5.0'|'1.0.0'|'1.0.1'|'1.0.2'|'1.1.0'|'1.4.0'|'1.6.0'|'1.8.0'|'3.0.0'|'3.0.1'|'3.0.2'|'3.3.0'|'3.5.0'|'4.0.0'|'4.0.1'|'4.1.0'|'4.3.0-cibuild'|'4.3.0-snapshot1'|'4.3.0';
declare type CapabilityStatementMode1 = 'client'|'server';
declare type CapabilityStatementType1 = 'Resource';
declare type CapabilityStatementCode1 = 'read'|'vread'|'update'|'patch'|'delete'|'history'|'create'|'search'|'capabilities'|'transaction'|'batch'|'operation';
declare type CapabilityStatementVersioning1 = 'no-version'|'versioned'|'versioned-update';
declare type CapabilityStatementConditionalRead1 = 'not-supported'|'modified-since'|'not-match'|'full-support';
declare type CapabilityStatementConditionalDelete1 = 'not-supported'|'single'|'multiple';
declare type CapabilityStatementReferencePolicy1 = 'literal'|'logical'|'resolves'|'enforced'|'local';
declare type CapabilityStatementType2 = 'number'|'date'|'string'|'token'|'reference'|'composite'|'quantity'|'uri'|'special';
declare type CapabilityStatementCode2 = 'read'|'vread'|'update'|'patch'|'delete'|'history'|'create'|'search'|'capabilities'|'transaction'|'batch'|'operation';
declare type CapabilityStatementMode2 = 'sender'|'receiver';
declare type CapabilityStatementMode3 = 'producer'|'consumer';
declare type CarePlanStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type CarePlanIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type CarePlanKind1 = 'Resource';
declare type CarePlanStatus2 = 'not-started'|'scheduled'|'in-progress'|'on-hold'|'completed'|'cancelled'|'unknown'|'entered-in-error';
declare type CareTeamStatus1 = 'proposed'|'active'|'suspended'|'inactive'|'entered-in-error';
declare type CatalogEntryStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type CatalogEntryRelationtype1 = 'triggers'|'is-replaced-by';
declare type ChargeItemStatus1 = 'planned'|'billable'|'not-billable'|'aborted'|'billed'|'entered-in-error'|'unknown';
declare type ChargeItemDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ChargeItemDefinitionType1 = 'base'|'surcharge'|'deduction'|'discount'|'tax'|'informational';
declare type CitationStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ClaimStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type ClaimUse1 = 'claim'|'preauthorization'|'predetermination';
declare type ClaimResponseStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type ClaimResponseUse1 = 'claim'|'preauthorization'|'predetermination';
declare type ClaimResponseOutcome1 = 'queued'|'complete'|'error'|'partial';
declare type ClaimResponseType1 = 'display'|'print'|'printoper';
declare type ClinicalImpressionStatus1 = 'preparation'|'in-progress'|'not-done'|'on-hold'|'stopped'|'completed'|'entered-in-error'|'unknown';
declare type ClinicalUseDefinitionType1 = 'indication'|'contraindication'|'interaction'|'undesirable-effect'|'warning';
declare type CodeSystemStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type CodeSystemHierarchyMeaning1 = 'grouped-by'|'is-a'|'part-of'|'classified-with';
declare type CodeSystemContent1 = 'not-present'|'example'|'fragment'|'complete'|'supplement';
declare type CodeSystemOperator1 = '='|'is-a'|'descendent-of'|'is-not-a'|'regex'|'in'|'not-in'|'generalizes'|'exists';
declare type CodeSystemType1 = 'code'|'Coding'|'string'|'integer'|'boolean'|'dateTime'|'decimal';
declare type CommunicationStatus1 = 'preparation'|'in-progress'|'not-done'|'on-hold'|'stopped'|'completed'|'entered-in-error'|'unknown';
declare type CommunicationPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type CommunicationRequestStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type CommunicationRequestPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type CompartmentDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type CompartmentDefinitionCode1 = 'Patient'|'Encounter'|'RelatedPerson'|'Practitioner'|'Device';
declare type CompartmentDefinitionCode2 = 'Resource';
declare type CompositionStatus1 = 'preliminary'|'final'|'amended'|'entered-in-error';
declare type CompositionMode1 = 'personal'|'professional'|'legal'|'official';
declare type CompositionCode1 = 'replaces'|'transforms'|'signs'|'appends';
declare type CompositionMode2 = 'working'|'snapshot'|'changes';
declare type ConceptMapStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ConceptMapEquivalence1 = 'relatedto'|'unmatched';
declare type ConceptMapMode1 = 'provided'|'fixed'|'other-map';
declare type ConsentStatus1 = 'draft'|'proposed'|'active'|'rejected'|'inactive'|'entered-in-error';
declare type ConsentType1 = 'deny'|'permit';
declare type ConsentMeaning1 = 'instance'|'related'|'dependents'|'authoredby';
declare type ContractStatus1 = 'amended'|'appended'|'cancelled'|'disputed'|'entered-in-error'|'executable'|'executed'|'negotiable'|'offered'|'policy'|'rejected'|'renewed'|'revoked'|'resolved'|'terminated';
declare type ContractPublicationStatus1 = 'amended'|'appended'|'cancelled'|'disputed'|'entered-in-error'|'executable'|'executed'|'negotiable'|'offered'|'policy'|'rejected'|'renewed'|'revoked'|'resolved'|'terminated';
declare type CoverageStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type CoverageEligibilityRequestStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type CoverageEligibilityRequestPurpose1 = 'auth-requirements'|'benefits'|'discovery'|'validation';
declare type CoverageEligibilityResponseStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type CoverageEligibilityResponsePurpose1 = 'auth-requirements'|'benefits'|'discovery'|'validation';
declare type CoverageEligibilityResponseOutcome1 = 'queued'|'complete'|'error'|'partial';
declare type DetectedIssueStatus1 = 'registered'|'preliminary'|'final'|'amended'|'cancelled'|'entered-in-error'|'unknown';
declare type DetectedIssueSeverity1 = 'high'|'moderate'|'low';
declare type DeviceEntryType1 = 'barcode'|'rfid'|'manual'|'card'|'self-reported'|'unknown';
declare type DeviceStatus1 = 'active'|'inactive'|'entered-in-error'|'unknown';
declare type DeviceType1 = 'udi-label-name'|'user-friendly-name'|'patient-reported-name'|'manufacturer-name'|'model-name'|'other';
declare type DeviceDefinitionType1 = 'udi-label-name'|'user-friendly-name'|'patient-reported-name'|'manufacturer-name'|'model-name'|'other';
declare type DeviceMetricOperationalStatus1 = 'on'|'off'|'standby'|'entered-in-error';
declare type DeviceMetricColor1 = 'black'|'red'|'green'|'yellow'|'blue'|'magenta'|'cyan'|'white';
declare type DeviceMetricCategory1 = 'measurement'|'setting'|'calculation'|'unspecified';
declare type DeviceMetricType1 = 'unspecified'|'offset'|'gain'|'two-point';
declare type DeviceMetricState1 = 'not-calibrated'|'calibration-required'|'calibrated'|'unspecified';
declare type DeviceRequestStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type DeviceRequestIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type DeviceRequestPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type DeviceUseStatementStatus1 = 'active'|'completed'|'entered-in-error'|'intended'|'stopped'|'on-hold';
declare type DiagnosticReportStatus1 = 'registered'|'partial'|'final'|'amended'|'cancelled'|'entered-in-error'|'unknown';
declare type DocumentManifestStatus1 = 'current'|'superseded'|'entered-in-error';
declare type DocumentReferenceStatus1 = 'current'|'superseded'|'entered-in-error';
declare type DocumentReferenceDocStatus1 = 'preliminary'|'final'|'amended'|'entered-in-error';
declare type DocumentReferenceCode1 = 'replaces'|'transforms'|'signs'|'appends';
declare type EncounterStatus1 = 'planned'|'arrived'|'triaged'|'in-progress'|'onleave'|'finished'|'cancelled'|'entered-in-error'|'unknown';
declare type EncounterStatus2 = 'planned'|'arrived'|'triaged'|'in-progress'|'onleave'|'finished'|'cancelled'|'entered-in-error'|'unknown';
declare type EncounterStatus3 = 'planned'|'active'|'reserved'|'completed';
declare type EndpointStatus1 = 'active'|'suspended'|'error'|'off'|'entered-in-error'|'test';
declare type EnrollmentRequestStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type EnrollmentResponseStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type EnrollmentResponseOutcome1 = 'queued'|'complete'|'error'|'partial';
declare type EpisodeOfCareStatus1 = 'planned'|'waitlist'|'active'|'onhold'|'finished'|'cancelled'|'entered-in-error';
declare type EpisodeOfCareStatus2 = 'planned'|'waitlist'|'active'|'onhold'|'finished'|'cancelled'|'entered-in-error';
declare type EventDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type EvidenceStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type EvidenceHandling1 = 'continuous'|'dichotomous'|'ordinal'|'polychotomous';
declare type EvidenceReportStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type EvidenceReportCode1 = 'replaces'|'amends'|'appends'|'transforms'|'replacedWith'|'amendedWith'|'appendedWith'|'transformedWith';
declare type EvidenceReportMode1 = 'working'|'snapshot'|'changes';
declare type EvidenceVariableStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type EvidenceVariableCharacteristicCombination1 = 'intersection'|'union';
declare type EvidenceVariableGroupMeasure1 = 'mean'|'median'|'mean-of-mean'|'mean-of-median'|'median-of-mean'|'median-of-median';
declare type EvidenceVariableHandling1 = 'continuous'|'dichotomous'|'ordinal'|'polychotomous';
declare type ExampleScenarioStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ExampleScenarioType1 = 'person'|'entity';
declare type ExampleScenarioResourceType1 = 'Resource';
declare type ExplanationOfBenefitStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type ExplanationOfBenefitUse1 = 'claim'|'preauthorization'|'predetermination';
declare type ExplanationOfBenefitOutcome1 = 'queued'|'complete'|'error'|'partial';
declare type ExplanationOfBenefitType1 = 'display'|'print'|'printoper';
declare type FamilyMemberHistoryStatus1 = 'partial'|'completed'|'entered-in-error'|'health-unknown';
declare type FlagStatus1 = 'active'|'inactive'|'entered-in-error';
declare type GoalLifecycleStatus1 = 'proposed'|'planned'|'accepted'|'cancelled'|'entered-in-error'|'rejected';
declare type GraphDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type GraphDefinitionStart1 = 'Resource';
declare type GraphDefinitionType1 = 'Resource';
declare type GraphDefinitionUse1 = 'condition'|'requirement';
declare type GraphDefinitionCode1 = 'Patient'|'Encounter'|'RelatedPerson'|'Practitioner'|'Device';
declare type GraphDefinitionRule1 = 'identical'|'matching'|'different'|'custom';
declare type GroupType1 = 'person'|'animal'|'practitioner'|'device'|'medication'|'substance';
declare type GuidanceResponseStatus1 = 'success'|'data-requested'|'data-required'|'in-progress'|'failure'|'entered-in-error';
declare type HealthcareServiceDaysOfWeek1 = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';
declare type ImagingStudyStatus1 = 'registered'|'available'|'cancelled'|'entered-in-error'|'unknown';
declare type ImmunizationStatus1 = 'preparation'|'in-progress'|'not-done'|'on-hold'|'stopped'|'completed'|'entered-in-error'|'unknown';
declare type ImmunizationEvaluationStatus1 = 'in-progress'|'not-done'|'on-hold'|'completed'|'entered-in-error'|'stopped'|'unknown';
declare type ImplementationGuideStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ImplementationGuideLicense1 = 'not-open-source'|'0BSD'|'AAL'|'Abstyles'|'Adobe-2006'|'Adobe-Glyph'|'ADSL'|'AFL-1.1'|'AFL-1.2'|'AFL-2.0'|'AFL-2.1'|'AFL-3.0'|'Afmparse'|'AGPL-1.0-only'|'AGPL-1.0-or-later'|'AGPL-3.0-only'|'AGPL-3.0-or-later'|'Aladdin'|'AMDPLPA'|'AML'|'AMPAS'|'ANTLR-PD'|'Apache-1.0'|'Apache-1.1'|'Apache-2.0'|'APAFML'|'APL-1.0'|'APSL-1.0'|'APSL-1.1'|'APSL-1.2'|'APSL-2.0'|'Artistic-1.0-cl8'|'Artistic-1.0-Perl'|'Artistic-1.0'|'Artistic-2.0'|'Bahyph'|'Barr'|'Beerware'|'BitTorrent-1.0'|'BitTorrent-1.1'|'Borceux'|'BSD-1-Clause'|'BSD-2-Clause-FreeBSD'|'BSD-2-Clause-NetBSD'|'BSD-2-Clause-Patent'|'BSD-2-Clause'|'BSD-3-Clause-Attribution'|'BSD-3-Clause-Clear'|'BSD-3-Clause-LBNL'|'BSD-3-Clause-No-Nuclear-License-2014'|'BSD-3-Clause-No-Nuclear-License'|'BSD-3-Clause-No-Nuclear-Warranty'|'BSD-3-Clause'|'BSD-4-Clause-UC'|'BSD-4-Clause'|'BSD-Protection'|'BSD-Source-Code'|'BSL-1.0'|'bzip2-1.0.5'|'bzip2-1.0.6'|'Caldera'|'CATOSL-1.1'|'CC-BY-1.0'|'CC-BY-2.0'|'CC-BY-2.5'|'CC-BY-3.0'|'CC-BY-4.0'|'CC-BY-NC-1.0'|'CC-BY-NC-2.0'|'CC-BY-NC-2.5'|'CC-BY-NC-3.0'|'CC-BY-NC-4.0'|'CC-BY-NC-ND-1.0'|'CC-BY-NC-ND-2.0'|'CC-BY-NC-ND-2.5'|'CC-BY-NC-ND-3.0'|'CC-BY-NC-ND-4.0'|'CC-BY-NC-SA-1.0'|'CC-BY-NC-SA-2.0'|'CC-BY-NC-SA-2.5'|'CC-BY-NC-SA-3.0'|'CC-BY-NC-SA-4.0'|'CC-BY-ND-1.0'|'CC-BY-ND-2.0'|'CC-BY-ND-2.5'|'CC-BY-ND-3.0'|'CC-BY-ND-4.0'|'CC-BY-SA-1.0'|'CC-BY-SA-2.0'|'CC-BY-SA-2.5'|'CC-BY-SA-3.0'|'CC-BY-SA-4.0'|'CC0-1.0'|'CDDL-1.0'|'CDDL-1.1'|'CDLA-Permissive-1.0'|'CDLA-Sharing-1.0'|'CECILL-1.0'|'CECILL-1.1'|'CECILL-2.0'|'CECILL-2.1'|'CECILL-B'|'CECILL-C'|'ClArtistic'|'CNRI-Jython'|'CNRI-Python-GPL-Compatible'|'CNRI-Python'|'Condor-1.1'|'CPAL-1.0'|'CPL-1.0'|'CPOL-1.02'|'Crossword'|'CrystalStacker'|'CUA-OPL-1.0'|'Cube'|'curl'|'D-FSL-1.0'|'diffmark'|'DOC'|'Dotseqn'|'DSDP'|'dvipdfm'|'ECL-1.0'|'ECL-2.0'|'EFL-1.0'|'EFL-2.0'|'eGenix'|'Entessa'|'EPL-1.0'|'EPL-2.0'|'ErlPL-1.1'|'EUDatagrid'|'EUPL-1.0'|'EUPL-1.1'|'EUPL-1.2'|'Eurosym'|'Fair'|'Frameworx-1.0'|'FreeImage'|'FSFAP'|'FSFUL'|'FSFULLR'|'FTL'|'GFDL-1.1-only'|'GFDL-1.1-or-later'|'GFDL-1.2-only'|'GFDL-1.2-or-later'|'GFDL-1.3-only'|'GFDL-1.3-or-later'|'Giftware'|'GL2PS'|'Glide'|'Glulxe'|'gnuplot'|'GPL-1.0-only'|'GPL-1.0-or-later'|'GPL-2.0-only'|'GPL-2.0-or-later'|'GPL-3.0-only'|'GPL-3.0-or-later'|'gSOAP-1.3b'|'HaskellReport'|'HPND'|'IBM-pibs'|'ICU'|'IJG'|'ImageMagick'|'iMatix'|'Imlib2'|'Info-ZIP'|'Intel-ACPI'|'Intel'|'Interbase-1.0'|'IPA'|'IPL-1.0'|'ISC'|'JasPer-2.0'|'JSON'|'LAL-1.2'|'LAL-1.3'|'Latex2e'|'Leptonica'|'LGPL-2.0-only'|'LGPL-2.0-or-later'|'LGPL-2.1-only'|'LGPL-2.1-or-later'|'LGPL-3.0-only'|'LGPL-3.0-or-later'|'LGPLLR'|'Libpng'|'libtiff'|'LiLiQ-P-1.1'|'LiLiQ-R-1.1'|'LiLiQ-Rplus-1.1'|'Linux-OpenIB'|'LPL-1.0'|'LPL-1.02'|'LPPL-1.0'|'LPPL-1.1'|'LPPL-1.2'|'LPPL-1.3a'|'LPPL-1.3c'|'MakeIndex'|'MirOS'|'MIT-0'|'MIT-advertising'|'MIT-CMU'|'MIT-enna'|'MIT-feh'|'MIT'|'MITNFA'|'Motosoto'|'mpich2'|'MPL-1.0'|'MPL-1.1'|'MPL-2.0-no-copyleft-exception'|'MPL-2.0'|'MS-PL'|'MS-RL'|'MTLL'|'Multics'|'Mup'|'NASA-1.3'|'Naumen'|'NBPL-1.0'|'NCSA'|'Net-SNMP'|'NetCDF'|'Newsletr'|'NGPL'|'NLOD-1.0'|'NLPL'|'Nokia'|'NOSL'|'Noweb'|'NPL-1.0'|'NPL-1.1'|'NPOSL-3.0'|'NRL'|'NTP'|'OCCT-PL'|'OCLC-2.0'|'ODbL-1.0'|'OFL-1.0'|'OFL-1.1'|'OGTSL'|'OLDAP-1.1'|'OLDAP-1.2'|'OLDAP-1.3'|'OLDAP-1.4'|'OLDAP-2.0.1'|'OLDAP-2.0'|'OLDAP-2.1'|'OLDAP-2.2.1'|'OLDAP-2.2.2'|'OLDAP-2.2'|'OLDAP-2.3'|'OLDAP-2.4'|'OLDAP-2.5'|'OLDAP-2.6'|'OLDAP-2.7'|'OLDAP-2.8'|'OML'|'OpenSSL'|'OPL-1.0'|'OSET-PL-2.1'|'OSL-1.0'|'OSL-1.1'|'OSL-2.0'|'OSL-2.1'|'OSL-3.0'|'PDDL-1.0'|'PHP-3.0'|'PHP-3.01'|'Plexus'|'PostgreSQL'|'psfrag'|'psutils'|'Python-2.0'|'Qhull'|'QPL-1.0'|'Rdisc'|'RHeCos-1.1'|'RPL-1.1'|'RPL-1.5'|'RPSL-1.0'|'RSA-MD'|'RSCPL'|'Ruby'|'SAX-PD'|'Saxpath'|'SCEA'|'Sendmail'|'SGI-B-1.0'|'SGI-B-1.1'|'SGI-B-2.0'|'SimPL-2.0'|'SISSL-1.2'|'SISSL'|'Sleepycat'|'SMLNJ'|'SMPPL'|'SNIA'|'Spencer-86'|'Spencer-94'|'Spencer-99'|'SPL-1.0'|'SugarCRM-1.1.3'|'SWL'|'TCL'|'TCP-wrappers'|'TMate'|'TORQUE-1.1'|'TOSL'|'Unicode-DFS-2015'|'Unicode-DFS-2016'|'Unicode-TOU'|'Unlicense'|'UPL-1.0'|'Vim'|'VOSTROM'|'VSL-1.0'|'W3C-19980720'|'W3C-20150513'|'W3C'|'Watcom-1.0'|'Wsuipa'|'WTFPL'|'X11'|'Xerox'|'XFree86-1.1'|'xinetd'|'Xnet'|'xpp'|'XSkat'|'YPL-1.0'|'YPL-1.1'|'Zed'|'Zend-2.0'|'Zimbra-1.3'|'Zimbra-1.4'|'zlib-acknowledgement'|'Zlib'|'ZPL-1.1'|'ZPL-2.0'|'ZPL-2.1';
declare type ImplementationGuideFhirVersion1 = '0.01'|'0.05'|'0.06'|'0.11'|'0.0.80'|'0.0.81'|'0.0.82'|'0.4.0'|'0.5.0'|'1.0.0'|'1.0.1'|'1.0.2'|'1.1.0'|'1.4.0'|'1.6.0'|'1.8.0'|'3.0.0'|'3.0.1'|'3.0.2'|'3.3.0'|'3.5.0'|'4.0.0'|'4.0.1'|'4.1.0'|'4.3.0-cibuild'|'4.3.0-snapshot1'|'4.3.0';
declare type ImplementationGuideType1 = 'Resource';
declare type ImplementationGuideFhirVersion2 = '0.01'|'0.05'|'0.06'|'0.11'|'0.0.80'|'0.0.81'|'0.0.82'|'0.4.0'|'0.5.0'|'1.0.0'|'1.0.1'|'1.0.2'|'1.1.0'|'1.4.0'|'1.6.0'|'1.8.0'|'3.0.0'|'3.0.1'|'3.0.2'|'3.3.0'|'3.5.0'|'4.0.0'|'4.0.1'|'4.1.0'|'4.3.0-cibuild'|'4.3.0-snapshot1'|'4.3.0';
declare type ImplementationGuideGeneration1 = 'html'|'markdown'|'xml'|'generated';
declare type ImplementationGuideCode1 = 'apply'|'path-resource'|'path-pages'|'path-tx-cache'|'expansion-parameter'|'rule-broken-links'|'generate-xml'|'generate-json'|'generate-turtle'|'html-template';
declare type IngredientStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type IngredientRole1 = 'allowed'|'possible'|'actual';
declare type InsurancePlanStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type InvoiceStatus1 = 'draft'|'issued'|'balanced'|'cancelled'|'entered-in-error';
declare type InvoiceType1 = 'base'|'surcharge'|'deduction'|'discount'|'tax'|'informational';
declare type LibraryStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type LinkageType1 = 'source'|'alternate'|'historical';
declare type ListStatus1 = 'current'|'retired'|'entered-in-error';
declare type ListMode1 = 'working'|'snapshot'|'changes';
declare type LocationStatus1 = 'active'|'suspended'|'inactive';
declare type LocationMode1 = 'instance'|'kind';
declare type LocationDaysOfWeek1 = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';
declare type ManufacturedItemDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type MeasureStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type MeasureReportStatus1 = 'complete'|'pending'|'error';
declare type MeasureReportType1 = 'individual'|'subject-list'|'summary'|'data-collection';
declare type MediaStatus1 = 'preparation'|'in-progress'|'not-done'|'on-hold'|'stopped'|'completed'|'entered-in-error'|'unknown';
declare type MedicationStatus1 = 'active'|'inactive'|'entered-in-error';
declare type MedicationAdministrationStatus1 = 'in-progress'|'not-done'|'on-hold'|'completed'|'entered-in-error'|'stopped'|'unknown';
declare type MedicationDispenseStatus1 = 'preparation'|'in-progress'|'cancelled'|'on-hold'|'completed'|'entered-in-error'|'stopped'|'declined'|'unknown';
declare type MedicationKnowledgeStatus1 = 'active'|'inactive'|'entered-in-error';
declare type MedicationRequestStatus1 = 'active'|'on-hold'|'cancelled'|'completed'|'entered-in-error'|'stopped'|'draft'|'unknown';
declare type MedicationRequestIntent1 = 'proposal'|'plan'|'order'|'original-order'|'reflex-order'|'filler-order'|'instance-order'|'option';
declare type MedicationRequestPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type MedicationStatementStatus1 = 'active'|'completed'|'entered-in-error'|'intended'|'stopped'|'on-hold'|'unknown'|'not-taken';
declare type MessageDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type MessageDefinitionCategory1 = 'consequence'|'currency'|'notification';
declare type MessageDefinitionCode1 = 'Resource';
declare type MessageDefinitionResponseRequired1 = 'always'|'on-error'|'never'|'on-success';
declare type MessageHeaderCode1 = 'ok'|'transient-error'|'fatal-error';
declare type MolecularSequenceType1 = 'aa'|'dna'|'rna';
declare type MolecularSequenceOrientation1 = 'sense'|'antisense';
declare type MolecularSequenceStrand1 = 'watson'|'crick';
declare type MolecularSequenceType2 = 'indel'|'snp'|'unknown';
declare type MolecularSequenceType3 = 'directlink'|'openapi'|'login'|'oauth'|'other';
declare type NamingSystemStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type NamingSystemKind1 = 'codesystem'|'identifier'|'root';
declare type NamingSystemType1 = 'oid'|'uuid'|'uri'|'other';
declare type NutritionOrderStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type NutritionOrderIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type NutritionProductStatus1 = 'active'|'inactive'|'entered-in-error';
declare type ObservationStatus1 = 'registered'|'preliminary'|'final'|'amended'|'cancelled'|'entered-in-error'|'unknown';
declare type ObservationDefinitionPermittedDataType1 = 'Quantity'|'CodeableConcept'|'string'|'boolean'|'integer'|'Range'|'Ratio'|'SampledData'|'time'|'dateTime'|'Period';
declare type ObservationDefinitionCategory1 = 'reference'|'critical'|'absolute';
declare type ObservationDefinitionGender1 = 'male'|'female'|'other'|'unknown';
declare type OperationDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type OperationDefinitionKind1 = 'operation'|'query';
declare type OperationDefinitionResource1 = 'Resource';
declare type OperationDefinitionUse1 = 'in'|'out';
declare type OperationDefinitionType1 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource'|'Type'|'Any';
declare type OperationDefinitionSearchType1 = 'number'|'date'|'string'|'token'|'reference'|'composite'|'quantity'|'uri'|'special';
declare type OperationDefinitionStrength1 = 'required'|'extensible'|'preferred'|'example';
declare type OperationOutcomeSeverity1 = 'fatal'|'error'|'warning'|'information';
declare type OperationOutcomeCode1 = 'invalid'|'security'|'processing'|'transient'|'informational';
declare type PatientGender1 = 'male'|'female'|'other'|'unknown';
declare type PatientGender2 = 'male'|'female'|'other'|'unknown';
declare type PatientType1 = 'replaced-by'|'replaces'|'refer'|'seealso';
declare type PaymentNoticeStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type PaymentReconciliationStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type PaymentReconciliationOutcome1 = 'queued'|'complete'|'error'|'partial';
declare type PaymentReconciliationType1 = 'display'|'print'|'printoper';
declare type PersonGender1 = 'male'|'female'|'other'|'unknown';
declare type PersonAssurance1 = 'level1'|'level2'|'level3'|'level4';
declare type PlanDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type PlanDefinitionPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type PlanDefinitionKind1 = 'applicability'|'start'|'stop';
declare type PlanDefinitionRelationship1 = 'before-start'|'before'|'before-end'|'concurrent-with-start'|'concurrent'|'concurrent-with-end'|'after-start'|'after'|'after-end';
declare type PlanDefinitionType1 = 'patient'|'practitioner'|'related-person'|'device';
declare type PlanDefinitionGroupingBehavior1 = 'visual-group'|'logical-group'|'sentence-group';
declare type PlanDefinitionSelectionBehavior1 = 'any'|'all'|'all-or-none'|'exactly-one'|'at-most-one'|'one-or-more';
declare type PlanDefinitionRequiredBehavior1 = 'must'|'could'|'must-unless-documented';
declare type PlanDefinitionPrecheckBehavior1 = 'yes'|'no';
declare type PlanDefinitionCardinalityBehavior1 = 'single'|'multiple';
declare type PractitionerGender1 = 'male'|'female'|'other'|'unknown';
declare type PractitionerRoleDaysOfWeek1 = 'mon'|'tue'|'wed'|'thu'|'fri'|'sat'|'sun';
declare type ProcedureStatus1 = 'preparation'|'in-progress'|'not-done'|'on-hold'|'stopped'|'completed'|'entered-in-error'|'unknown';
declare type ProvenanceRole1 = 'derivation';
declare type QuestionnaireStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type QuestionnaireSubjectType1 = 'Resource';
declare type QuestionnaireType1 = 'group'|'display'|'question';
declare type QuestionnaireOperator1 = 'exists'|'='|'!='|'>'|'<'|'>='|'<=';
declare type QuestionnaireEnableBehavior1 = 'all'|'any';
declare type QuestionnaireResponseStatus1 = 'in-progress'|'completed'|'amended'|'entered-in-error'|'stopped';
declare type RelatedPersonGender1 = 'male'|'female'|'other'|'unknown';
declare type RequestGroupStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type RequestGroupIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type RequestGroupPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type RequestGroupPriority2 = 'routine'|'urgent'|'asap'|'stat';
declare type RequestGroupKind1 = 'applicability'|'start'|'stop';
declare type RequestGroupRelationship1 = 'before-start'|'before'|'before-end'|'concurrent-with-start'|'concurrent'|'concurrent-with-end'|'after-start'|'after'|'after-end';
declare type RequestGroupGroupingBehavior1 = 'visual-group'|'logical-group'|'sentence-group';
declare type RequestGroupSelectionBehavior1 = 'any'|'all'|'all-or-none'|'exactly-one'|'at-most-one'|'one-or-more';
declare type RequestGroupRequiredBehavior1 = 'must'|'could'|'must-unless-documented';
declare type RequestGroupPrecheckBehavior1 = 'yes'|'no';
declare type RequestGroupCardinalityBehavior1 = 'single'|'multiple';
declare type ResearchDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ResearchElementDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ResearchElementDefinitionType1 = 'population'|'exposure'|'outcome';
declare type ResearchElementDefinitionVariableType1 = 'dichotomous'|'continuous'|'descriptive';
declare type ResearchElementDefinitionStudyEffectiveGroupMeasure1 = 'mean'|'median'|'mean-of-mean'|'mean-of-median'|'median-of-mean'|'median-of-median';
declare type ResearchElementDefinitionParticipantEffectiveGroupMeasure1 = 'mean'|'median'|'mean-of-mean'|'mean-of-median'|'median-of-mean'|'median-of-median';
declare type ResearchStudyStatus1 = 'active'|'administratively-completed'|'approved'|'closed-to-accrual'|'closed-to-accrual-and-intervention'|'completed'|'disapproved'|'in-review'|'temporarily-closed-to-accrual'|'temporarily-closed-to-accrual-and-intervention'|'withdrawn';
declare type ResearchSubjectStatus1 = 'candidate'|'eligible'|'follow-up'|'ineligible'|'not-registered'|'off-study'|'on-study'|'on-study-intervention'|'on-study-observation'|'pending-on-study'|'potential-candidate'|'screening'|'withdrawn';
declare type RiskAssessmentStatus1 = 'registered'|'preliminary'|'final'|'amended'|'cancelled'|'entered-in-error'|'unknown';
declare type SearchParameterStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type SearchParameterBase1 = 'Resource';
declare type SearchParameterType1 = 'number'|'date'|'string'|'token'|'reference'|'composite'|'quantity'|'uri'|'special';
declare type SearchParameterXpathUsage1 = 'normal'|'phonetic'|'nearby'|'distance'|'other';
declare type SearchParameterTarget1 = 'Resource';
declare type SearchParameterComparator1 = 'eq'|'ne'|'gt'|'lt'|'ge'|'le'|'sa'|'eb'|'ap';
declare type SearchParameterModifier1 = 'missing'|'exact'|'contains'|'not'|'text'|'in'|'not-in'|'below'|'above'|'type'|'identifier'|'ofType';
declare type ServiceRequestStatus1 = 'draft'|'active'|'on-hold'|'revoked'|'completed'|'entered-in-error'|'unknown';
declare type ServiceRequestIntent1 = 'proposal'|'plan'|'directive'|'order'|'option';
declare type ServiceRequestPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type SlotStatus1 = 'busy'|'free'|'busy-unavailable'|'busy-tentative'|'entered-in-error';
declare type SpecimenStatus1 = 'available'|'unavailable'|'unsatisfactory'|'entered-in-error';
declare type SpecimenDefinitionPreference1 = 'preferred'|'alternate';
declare type StructureDefinitionStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type StructureDefinitionFhirVersion1 = '0.01'|'0.05'|'0.06'|'0.11'|'0.0.80'|'0.0.81'|'0.0.82'|'0.4.0'|'0.5.0'|'1.0.0'|'1.0.1'|'1.0.2'|'1.1.0'|'1.4.0'|'1.6.0'|'1.8.0'|'3.0.0'|'3.0.1'|'3.0.2'|'3.3.0'|'3.5.0'|'4.0.0'|'4.0.1'|'4.1.0'|'4.3.0-cibuild'|'4.3.0-snapshot1'|'4.3.0';
declare type StructureDefinitionKind1 = 'primitive-type'|'complex-type'|'resource'|'logical';
declare type StructureDefinitionType1 = 'fhirpath'|'element'|'extension';
declare type StructureDefinitionType2 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type StructureDefinitionDerivation1 = 'specialization'|'constraint';
declare type StructureMapStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type StructureMapMode1 = 'source'|'queried'|'target'|'produced';
declare type StructureMapTypeMode1 = 'none'|'types'|'type-and-types';
declare type StructureMapMode2 = 'source'|'target';
declare type StructureMapListMode1 = 'first'|'not_first'|'last'|'not_last'|'only_one';
declare type StructureMapContextType1 = 'type'|'variable';
declare type StructureMapListMode2 = 'first'|'share'|'last'|'collate';
declare type StructureMapTransform1 = 'create'|'copy'|'truncate'|'escape'|'cast'|'append'|'translate'|'reference'|'dateOp'|'uuid'|'pointer'|'evaluate'|'cc'|'c'|'qty'|'id'|'cp';
declare type SubscriptionStatus1 = 'requested'|'active'|'error'|'off';
declare type SubscriptionType1 = 'rest-hook'|'websocket'|'email'|'sms'|'message';
declare type SubscriptionStatusStatus1 = 'requested'|'active'|'error'|'off';
declare type SubscriptionStatusType1 = 'handshake'|'heartbeat'|'event-notification'|'query-status'|'query-event';
declare type SubscriptionTopicStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type SubscriptionTopicResource1 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type SubscriptionTopicSupportedInteraction1 = 'read'|'vread'|'update'|'patch'|'delete'|'history'|'create'|'search'|'capabilities'|'transaction'|'batch'|'operation';
declare type SubscriptionTopicResultForCreate1 = 'test-passes'|'test-fails';
declare type SubscriptionTopicResultForDelete1 = 'test-passes'|'test-fails';
declare type SubscriptionTopicResource2 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type SubscriptionTopicResource3 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type SubscriptionTopicModifier1 = '='|'eq'|'ne'|'gt'|'lt'|'ge'|'le'|'sa'|'eb'|'ap'|'above'|'below'|'in'|'not-in'|'of-type';
declare type SubscriptionTopicResource4 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type SubstanceStatus1 = 'active'|'inactive'|'entered-in-error';
declare type SupplyDeliveryStatus1 = 'in-progress'|'completed'|'abandoned'|'entered-in-error';
declare type SupplyRequestStatus1 = 'draft'|'active'|'suspended'|'cancelled'|'completed'|'entered-in-error'|'unknown';
declare type SupplyRequestPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type TaskStatus1 = 'draft'|'requested'|'received'|'accepted'|'rejected'|'ready'|'cancelled'|'in-progress'|'on-hold'|'failed'|'completed'|'entered-in-error';
declare type TaskIntent1 = 'unknown'|'proposal'|'plan'|'directive'|'order'|'option';
declare type TaskPriority1 = 'routine'|'urgent'|'asap'|'stat';
declare type TerminologyCapabilitiesStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type TerminologyCapabilitiesKind1 = 'instance'|'capability'|'requirements';
declare type TerminologyCapabilitiesCodeSearch1 = 'explicit'|'all';
declare type TestReportStatus1 = 'completed'|'in-progress'|'waiting'|'stopped'|'entered-in-error';
declare type TestReportResult1 = 'pass'|'fail'|'pending';
declare type TestReportType1 = 'test-engine'|'client'|'server';
declare type TestReportResult2 = 'pass'|'skip'|'fail'|'warning'|'error';
declare type TestReportResult3 = 'pass'|'skip'|'fail'|'warning'|'error';
declare type TestScriptStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type TestScriptResource1 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type TestScriptMethod1 = 'delete'|'get'|'options'|'patch'|'post'|'put'|'head';
declare type TestScriptDirection1 = 'response'|'request';
declare type TestScriptOperator1 = 'equals'|'notEquals'|'in'|'notIn'|'greaterThan'|'lessThan'|'empty'|'notEmpty'|'contains'|'notContains'|'eval';
declare type TestScriptRequestMethod1 = 'delete'|'get'|'options'|'patch'|'post'|'put'|'head';
declare type TestScriptResource2 = 'Address'|'Age'|'Annotation'|'Attachment'|'BackboneElement'|'CodeableConcept'|'CodeableReference'|'Coding'|'ContactDetail'|'ContactPoint'|'Contributor'|'Count'|'DataRequirement'|'Distance'|'Dosage'|'Duration'|'Element'|'ElementDefinition'|'Expression'|'Extension'|'HumanName'|'Identifier'|'MarketingStatus'|'Meta'|'Money'|'MoneyQuantity'|'Narrative'|'ParameterDefinition'|'Period'|'Population'|'ProdCharacteristic'|'ProductShelfLife'|'Quantity'|'Range'|'Ratio'|'RatioRange'|'Reference'|'RelatedArtifact'|'SampledData'|'Signature'|'SimpleQuantity'|'Timing'|'TriggerDefinition'|'UsageContext'|'base64Binary'|'boolean'|'canonical'|'code'|'date'|'dateTime'|'decimal'|'id'|'instant'|'integer'|'markdown'|'oid'|'positiveInt'|'string'|'time'|'unsignedInt'|'uri'|'url'|'uuid'|'xhtml'|'Resource';
declare type TestScriptResponse1 = 'okay'|'created'|'noContent'|'notModified'|'bad'|'forbidden'|'notFound'|'methodNotAllowed'|'conflict'|'gone'|'preconditionFailed'|'unprocessable';
declare type ValueSetStatus1 = 'draft'|'active'|'retired'|'unknown';
declare type ValueSetOp1 = '='|'is-a'|'descendent-of'|'is-not-a'|'regex'|'in'|'not-in'|'generalizes'|'exists';
declare type VerificationResultStatus1 = 'attested'|'validated'|'in-process'|'req-revalid'|'val-fail'|'reval-fail';
declare type VisionPrescriptionStatus1 = 'active'|'cancelled'|'draft'|'entered-in-error';
declare type VisionPrescriptionEye1 = 'right'|'left';
declare type VisionPrescriptionBase1 = 'up'|'down'|'in'|'out';

export class Base {
  public fhir_comments?: string[];

  constructor(obj?: any) {
    if (obj) {
      if (obj.hasOwnProperty('fhir_comments')) {
        this.fhir_comments = obj.fhir_comments;
      }
    }
  }

}

export class Element extends Base {
  constructor(obj?: any) {
	super(obj);

	if (obj.hasOwnProperty('id')) {
	  this.id = obj.id;
	}

    if (obj.hasOwnProperty('extension')) {
      this.extension = [];
      for (const o of (obj.extension instanceof Array ? obj.extension : [])) {
        this.extension.push(new Extension(o));
      }
    }
  }

  public id?: string;
  public extension?: Extension[];
}

export class Address extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('line')) {
			this.line = [];
			for (const o of (obj.line instanceof Array ? obj.line : [])) {
				this.line.push(o);
			}
		}

		if (obj.hasOwnProperty('city')) {
			this.city = obj.city;
		}

		if (obj.hasOwnProperty('district')) {
			this.district = obj.district;
		}

		if (obj.hasOwnProperty('state')) {
			this.state = obj.state;
		}

		if (obj.hasOwnProperty('postalCode')) {
			this.postalCode = obj.postalCode;
		}

		if (obj.hasOwnProperty('country')) {
			this.country = obj.country;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  use?: AddressUse1;
  type?: AddressType1;
  text?: string;
  line?: string[];
  city?: string;
  district?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  period?: Period;
}

export class Period extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

	}

  start?: string;
  end?: string;
}

export class Quantity extends Element {
  constructor(obj?: any) {
		super(obj);

    if (obj.hasOwnProperty('value')) {
      this.value = obj.value;
    }

    if (obj.hasOwnProperty('comparator')) {
      this.comparator = obj.comparator;
    }

    if (obj.hasOwnProperty('unit')) {
      this.unit = obj.unit;
    }

    if (obj.hasOwnProperty('system')) {
      this.system = obj.system;
    }

    if (obj.hasOwnProperty('code')) {
      this.code = obj.code;
    }

  }

  value?: number;
  comparator?: QuantityComparator1;
  unit?: string;
  system?: string;
  code?: string;
}

export class Age extends Quantity {
	constructor(obj?: any) {
		super(obj);
	}
}

export class Annotation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('authorReference')) {
			this.authorReference = obj.authorReference;
		}

		if (obj.hasOwnProperty('authorString')) {
			this.authorString = obj.authorString;
		}

		if (obj.hasOwnProperty('time')) {
			this.time = obj.time;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export class Reference implements IFhir.IResourceReference {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

	}

  reference?: string;
  type?: ReferenceType1;
  identifier?: Identifier;
  display?: string;
}

export class Identifier implements IFhir.IIdentifier {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('assigner')) {
			this.assigner = obj.assigner;
		}

	}

  use?: IdentifierUse1;
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export class CodeableConcept implements IFhir.ICodeableConcept {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('coding')) {
			this.coding = [];
			for (const o of (obj.coding instanceof Array ? obj.coding : [])) {
				this.coding.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  coding?: Coding[];
  text?: string;
}

export class Coding implements IFhir.ICoding {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('userSelected')) {
			this.userSelected = obj.userSelected;
		}

	}

  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export class Attachment implements IFhir.IAttachment {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('contentType')) {
			this.contentType = obj.contentType;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = obj.data;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('size')) {
			this.size = obj.size;
		}

		if (obj.hasOwnProperty('hash')) {
			this.hash = obj.hash;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('creation')) {
			this.creation = obj.creation;
		}

	}

  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export class CodeableReference extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('concept')) {
			this.concept = obj.concept;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  concept?: CodeableConcept;
  reference?: Reference;
}

export class ContactDetail implements IFhir.IContactDetail {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

	}

  name?: string;
  telecom?: ContactPoint[];
}

export class ContactPoint implements IFhir.IContactPoint {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('rank')) {
			this.rank = obj.rank;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  system?: ContactPointSystem1;
  value?: string;
  use?: ContactPointUse1;
  rank?: number;
  period?: Period;
}

export class Contributor extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

	}

  type: ContributorType1;
  name: string;
  contact?: ContactDetail[];
}

export class Count extends Quantity {
	constructor(obj?: any) {
		super(obj);
	}

}

export class DataRequirementSort extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('direction')) {
			this.direction = obj.direction;
		}

	}

  path: string;
  direction: DataRequirementDirection1;
}

export class DataRequirementDateFilter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('searchParam')) {
			this.searchParam = obj.searchParam;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

	}

  path?: string;
  searchParam?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  valueDuration?: Duration;
}

export class DataRequirementCodeFilter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('searchParam')) {
			this.searchParam = obj.searchParam;
		}

		if (obj.hasOwnProperty('valueSet')) {
			this.valueSet = obj.valueSet;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new Coding(o));
			}
		}

	}

  path?: string;
  searchParam?: string;
  valueSet?: string;
  code?: Coding[];
}

export class DataRequirement extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = [];
			for (const o of (obj.profile instanceof Array ? obj.profile : [])) {
				this.profile.push(o);
			}
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('mustSupport')) {
			this.mustSupport = [];
			for (const o of (obj.mustSupport instanceof Array ? obj.mustSupport : [])) {
				this.mustSupport.push(o);
			}
		}

		if (obj.hasOwnProperty('codeFilter')) {
			this.codeFilter = [];
			for (const o of (obj.codeFilter instanceof Array ? obj.codeFilter : [])) {
				this.codeFilter.push(new DataRequirementCodeFilter(o));
			}
		}

		if (obj.hasOwnProperty('dateFilter')) {
			this.dateFilter = [];
			for (const o of (obj.dateFilter instanceof Array ? obj.dateFilter : [])) {
				this.dateFilter.push(new DataRequirementDateFilter(o));
			}
		}

		if (obj.hasOwnProperty('limit')) {
			this.limit = obj.limit;
		}

		if (obj.hasOwnProperty('sort')) {
			this.sort = [];
			for (const o of (obj.sort instanceof Array ? obj.sort : [])) {
				this.sort.push(new DataRequirementSort(o));
			}
		}

	}

  type: string;
  profile?: string[];
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  mustSupport?: string[];
  codeFilter?: DataRequirementCodeFilter[];
  dateFilter?: DataRequirementDateFilter[];
  limit?: number;
  sort?: DataRequirementSort[];
}

export class Duration extends Quantity {
	constructor(obj?: any) {
		super(obj);
	}

}

export class Distance extends Quantity {
	constructor(obj?: any) {
		super(obj);
	}

}

export class DosageDoseAndRate extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('doseRange')) {
			this.doseRange = obj.doseRange;
		}

		if (obj.hasOwnProperty('doseQuantity')) {
			this.doseQuantity = obj.doseQuantity;
		}

		if (obj.hasOwnProperty('rateRatio')) {
			this.rateRatio = obj.rateRatio;
		}

		if (obj.hasOwnProperty('rateRange')) {
			this.rateRange = obj.rateRange;
		}

		if (obj.hasOwnProperty('rateQuantity')) {
			this.rateQuantity = obj.rateQuantity;
		}

	}

  type?: CodeableConcept;
  doseRange?: Range;
  doseQuantity?: Quantity;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}

export class Dosage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('additionalInstruction')) {
			this.additionalInstruction = [];
			for (const o of (obj.additionalInstruction instanceof Array ? obj.additionalInstruction : [])) {
				this.additionalInstruction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('patientInstruction')) {
			this.patientInstruction = obj.patientInstruction;
		}

		if (obj.hasOwnProperty('timing')) {
			this.timing = obj.timing;
		}

		if (obj.hasOwnProperty('asNeededBoolean')) {
			this.asNeededBoolean = obj.asNeededBoolean;
		}

		if (obj.hasOwnProperty('asNeededCodeableConcept')) {
			this.asNeededCodeableConcept = obj.asNeededCodeableConcept;
		}

		if (obj.hasOwnProperty('site')) {
			this.site = obj.site;
		}

		if (obj.hasOwnProperty('route')) {
			this.route = obj.route;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('doseAndRate')) {
			this.doseAndRate = [];
			for (const o of (obj.doseAndRate instanceof Array ? obj.doseAndRate : [])) {
				this.doseAndRate.push(new DosageDoseAndRate(o));
			}
		}

		if (obj.hasOwnProperty('maxDosePerPeriod')) {
			this.maxDosePerPeriod = obj.maxDosePerPeriod;
		}

		if (obj.hasOwnProperty('maxDosePerAdministration')) {
			this.maxDosePerAdministration = obj.maxDosePerAdministration;
		}

		if (obj.hasOwnProperty('maxDosePerLifetime')) {
			this.maxDosePerLifetime = obj.maxDosePerLifetime;
		}

	}

  sequence?: number;
  text?: string;
  additionalInstruction?: CodeableConcept[];
  patientInstruction?: string;
  timing?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  doseAndRate?: DosageDoseAndRate[];
  maxDosePerPeriod?: Ratio;
  maxDosePerAdministration?: Quantity;
  maxDosePerLifetime?: Quantity;
}

export class TimingRepeat extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('boundsDuration')) {
			this.boundsDuration = obj.boundsDuration;
		}

		if (obj.hasOwnProperty('boundsRange')) {
			this.boundsRange = obj.boundsRange;
		}

		if (obj.hasOwnProperty('boundsPeriod')) {
			this.boundsPeriod = obj.boundsPeriod;
		}

		if (obj.hasOwnProperty('count')) {
			this.count = obj.count;
		}

		if (obj.hasOwnProperty('countMax')) {
			this.countMax = obj.countMax;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

		if (obj.hasOwnProperty('durationMax')) {
			this.durationMax = obj.durationMax;
		}

		if (obj.hasOwnProperty('durationUnit')) {
			this.durationUnit = obj.durationUnit;
		}

		if (obj.hasOwnProperty('frequency')) {
			this.frequency = obj.frequency;
		}

		if (obj.hasOwnProperty('frequencyMax')) {
			this.frequencyMax = obj.frequencyMax;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('periodMax')) {
			this.periodMax = obj.periodMax;
		}

		if (obj.hasOwnProperty('periodUnit')) {
			this.periodUnit = obj.periodUnit;
		}

		if (obj.hasOwnProperty('dayOfWeek')) {
			this.dayOfWeek = [];
			for (const o of (obj.dayOfWeek instanceof Array ? obj.dayOfWeek : [])) {
				this.dayOfWeek.push(o);
			}
		}

		if (obj.hasOwnProperty('timeOfDay')) {
			this.timeOfDay = [];
			for (const o of (obj.timeOfDay instanceof Array ? obj.timeOfDay : [])) {
				this.timeOfDay.push(o);
			}
		}

		if (obj.hasOwnProperty('when')) {
			this.when = [];
			for (const o of (obj.when instanceof Array ? obj.when : [])) {
				this.when.push(o);
			}
		}

		if (obj.hasOwnProperty('offset')) {
			this.offset = obj.offset;
		}

	}

  boundsDuration?: Duration;
  boundsRange?: Range;
  boundsPeriod?: Period;
  count?: number;
  countMax?: number;
  duration?: number;
  durationMax?: number;
  durationUnit?: string;
  frequency?: number;
  frequencyMax?: number;
  period?: number;
  periodMax?: number;
  periodUnit?: string;
  dayOfWeek?: TimingDayOfWeek1[];
  timeOfDay?: string[];
  when?: TimingWhen1[];
  offset?: number;
}

export class Timing extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('event')) {
			this.event = [];
			for (const o of (obj.event instanceof Array ? obj.event : [])) {
				this.event.push(o);
			}
		}

		if (obj.hasOwnProperty('repeat')) {
			this.repeat = obj.repeat;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

	}

  event?: string[];
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export class Range extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('low')) {
			this.low = obj.low;
		}

		if (obj.hasOwnProperty('high')) {
			this.high = obj.high;
		}

	}

  low?: Quantity;
  high?: Quantity;
}

export class Ratio extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('numerator')) {
			this.numerator = obj.numerator;
		}

		if (obj.hasOwnProperty('denominator')) {
			this.denominator = obj.denominator;
		}

	}

  numerator?: Quantity;
  denominator?: Quantity;
}

export class ElementDefinitionMapping implements IFhir.IElementDefinitionMapping {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('identity')) {
			this.identity = obj.identity;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('map')) {
			this.map = obj.map;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  identity: string;
  language?: string;
  map: string;
  comment?: string;
}

export class ElementDefinitionBinding extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('strength')) {
			this.strength = obj.strength;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('valueSet')) {
			this.valueSet = obj.valueSet;
		}

	}

  strength: ElementDefinitionStrength1;
  description?: string;
  valueSet?: string;
}

export class ElementDefinitionConstraint implements IFhir.IElementDefinitionConstraint {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('key')) {
			this.key = obj.key;
		}

		if (obj.hasOwnProperty('requirements')) {
			this.requirements = obj.requirements;
		}

		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('human')) {
			this.human = obj.human;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('xpath')) {
			this.xpath = obj.xpath;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

	}

  key: string;
  requirements?: string;
  severity: ElementDefinitionSeverity1;
  human: string;
  expression?: string;
  xpath?: string;
  source?: string;
}

export class ElementDefinitionExample extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('label')) {
			this.label = obj.label;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueCanonical')) {
			this.valueCanonical = obj.valueCanonical;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueInstant')) {
			this.valueInstant = obj.valueInstant;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueMarkdown')) {
			this.valueMarkdown = obj.valueMarkdown;
		}

		if (obj.hasOwnProperty('valueOid')) {
			this.valueOid = obj.valueOid;
		}

		if (obj.hasOwnProperty('valuePositiveInt')) {
			this.valuePositiveInt = obj.valuePositiveInt;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueUnsignedInt')) {
			this.valueUnsignedInt = obj.valueUnsignedInt;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueUrl')) {
			this.valueUrl = obj.valueUrl;
		}

		if (obj.hasOwnProperty('valueUuid')) {
			this.valueUuid = obj.valueUuid;
		}

		if (obj.hasOwnProperty('valueAddress')) {
			this.valueAddress = obj.valueAddress;
		}

		if (obj.hasOwnProperty('valueAge')) {
			this.valueAge = obj.valueAge;
		}

		if (obj.hasOwnProperty('valueAnnotation')) {
			this.valueAnnotation = obj.valueAnnotation;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueCodeableReference')) {
			this.valueCodeableReference = obj.valueCodeableReference;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueContactPoint')) {
			this.valueContactPoint = obj.valueContactPoint;
		}

		if (obj.hasOwnProperty('valueCount')) {
			this.valueCount = obj.valueCount;
		}

		if (obj.hasOwnProperty('valueDistance')) {
			this.valueDistance = obj.valueDistance;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

		if (obj.hasOwnProperty('valueHumanName')) {
			this.valueHumanName = obj.valueHumanName;
		}

		if (obj.hasOwnProperty('valueIdentifier')) {
			this.valueIdentifier = obj.valueIdentifier;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueRatioRange')) {
			this.valueRatioRange = obj.valueRatioRange;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueSignature')) {
			this.valueSignature = obj.valueSignature;
		}

		if (obj.hasOwnProperty('valueTiming')) {
			this.valueTiming = obj.valueTiming;
		}

		if (obj.hasOwnProperty('valueContactDetail')) {
			this.valueContactDetail = obj.valueContactDetail;
		}

		if (obj.hasOwnProperty('valueContributor')) {
			this.valueContributor = obj.valueContributor;
		}

		if (obj.hasOwnProperty('valueDataRequirement')) {
			this.valueDataRequirement = obj.valueDataRequirement;
		}

		if (obj.hasOwnProperty('valueExpression')) {
			this.valueExpression = obj.valueExpression;
		}

		if (obj.hasOwnProperty('valueParameterDefinition')) {
			this.valueParameterDefinition = obj.valueParameterDefinition;
		}

		if (obj.hasOwnProperty('valueRelatedArtifact')) {
			this.valueRelatedArtifact = obj.valueRelatedArtifact;
		}

		if (obj.hasOwnProperty('valueTriggerDefinition')) {
			this.valueTriggerDefinition = obj.valueTriggerDefinition;
		}

		if (obj.hasOwnProperty('valueUsageContext')) {
			this.valueUsageContext = obj.valueUsageContext;
		}

		if (obj.hasOwnProperty('valueDosage')) {
			this.valueDosage = obj.valueDosage;
		}

	}

  label: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: number;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCodeableReference?: CodeableReference;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueRatioRange?: RatioRange;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
}

export class ElementDefinitionType implements IFhir.IElementDefinitionType {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = [];
			for (const o of (obj.profile instanceof Array ? obj.profile : [])) {
				this.profile.push(o);
			}
		}

		if (obj.hasOwnProperty('targetProfile')) {
			this.targetProfile = [];
			for (const o of (obj.targetProfile instanceof Array ? obj.targetProfile : [])) {
				this.targetProfile.push(o);
			}
		}

		if (obj.hasOwnProperty('aggregation')) {
			this.aggregation = [];
			for (const o of (obj.aggregation instanceof Array ? obj.aggregation : [])) {
				this.aggregation.push(o);
			}
		}

		if (obj.hasOwnProperty('versioning')) {
			this.versioning = obj.versioning;
		}

	}

  code: ElementDefinitionCode1;
  profile?: string[];
  targetProfile?: string[];
  aggregation?: ElementDefinitionAggregation1[];
  versioning?: ElementDefinitionVersioning1;
}

export class ElementDefinitionBase extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

	}

  path: string;
  min: number;
  max: string;
}

export class ElementDefinitionSlicingDiscriminator extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

	}

  type: ElementDefinitionType1;
  path: string;
}

export class ElementDefinitionSlicing implements IFhir.IElementDefinitionSlicing {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('discriminator')) {
			this.discriminator = [];
			for (const o of (obj.discriminator instanceof Array ? obj.discriminator : [])) {
				this.discriminator.push(new ElementDefinitionSlicingDiscriminator(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('ordered')) {
			this.ordered = obj.ordered;
		}

		if (obj.hasOwnProperty('rules')) {
			this.rules = obj.rules;
		}

	}

  discriminator?: ElementDefinitionSlicingDiscriminator[];
  description?: string;
  ordered?: boolean;
  rules: ElementDefinitionRules1;
}

export class ElementDefinition extends Element implements IFhir.IElementDefinition {
	constructor(obj?: any) {
    super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('representation')) {
			this.representation = [];
			for (const o of (obj.representation instanceof Array ? obj.representation : [])) {
				this.representation.push(o);
			}
		}

		if (obj.hasOwnProperty('sliceName')) {
			this.sliceName = obj.sliceName;
		}

		if (obj.hasOwnProperty('sliceIsConstraining')) {
			this.sliceIsConstraining = obj.sliceIsConstraining;
		}

		if (obj.hasOwnProperty('label')) {
			this.label = obj.label;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('slicing')) {
			this.slicing = obj.slicing;
		}

		if (obj.hasOwnProperty('short')) {
			this.short = obj.short;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('requirements')) {
			this.requirements = obj.requirements;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = [];
			for (const o of (obj.alias instanceof Array ? obj.alias : [])) {
				this.alias.push(o);
			}
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

		if (obj.hasOwnProperty('base')) {
			this.base = obj.base;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new ElementDefinitionType(o));
			}
		}

		if (obj.hasOwnProperty('defaultValueBase64Binary')) {
			this.defaultValueBase64Binary = obj.defaultValueBase64Binary;
		}

		if (obj.hasOwnProperty('defaultValueBoolean')) {
			this.defaultValueBoolean = obj.defaultValueBoolean;
		}

		if (obj.hasOwnProperty('defaultValueCanonical')) {
			this.defaultValueCanonical = obj.defaultValueCanonical;
		}

		if (obj.hasOwnProperty('defaultValueCode')) {
			this.defaultValueCode = obj.defaultValueCode;
		}

		if (obj.hasOwnProperty('defaultValueDate')) {
			this.defaultValueDate = obj.defaultValueDate;
		}

		if (obj.hasOwnProperty('defaultValueDateTime')) {
			this.defaultValueDateTime = obj.defaultValueDateTime;
		}

		if (obj.hasOwnProperty('defaultValueDecimal')) {
			this.defaultValueDecimal = obj.defaultValueDecimal;
		}

		if (obj.hasOwnProperty('defaultValueId')) {
			this.defaultValueId = obj.defaultValueId;
		}

		if (obj.hasOwnProperty('defaultValueInstant')) {
			this.defaultValueInstant = obj.defaultValueInstant;
		}

		if (obj.hasOwnProperty('defaultValueInteger')) {
			this.defaultValueInteger = obj.defaultValueInteger;
		}

		if (obj.hasOwnProperty('defaultValueMarkdown')) {
			this.defaultValueMarkdown = obj.defaultValueMarkdown;
		}

		if (obj.hasOwnProperty('defaultValueOid')) {
			this.defaultValueOid = obj.defaultValueOid;
		}

		if (obj.hasOwnProperty('defaultValuePositiveInt')) {
			this.defaultValuePositiveInt = obj.defaultValuePositiveInt;
		}

		if (obj.hasOwnProperty('defaultValueString')) {
			this.defaultValueString = obj.defaultValueString;
		}

		if (obj.hasOwnProperty('defaultValueTime')) {
			this.defaultValueTime = obj.defaultValueTime;
		}

		if (obj.hasOwnProperty('defaultValueUnsignedInt')) {
			this.defaultValueUnsignedInt = obj.defaultValueUnsignedInt;
		}

		if (obj.hasOwnProperty('defaultValueUri')) {
			this.defaultValueUri = obj.defaultValueUri;
		}

		if (obj.hasOwnProperty('defaultValueUrl')) {
			this.defaultValueUrl = obj.defaultValueUrl;
		}

		if (obj.hasOwnProperty('defaultValueUuid')) {
			this.defaultValueUuid = obj.defaultValueUuid;
		}

		if (obj.hasOwnProperty('defaultValueAddress')) {
			this.defaultValueAddress = obj.defaultValueAddress;
		}

		if (obj.hasOwnProperty('defaultValueAge')) {
			this.defaultValueAge = obj.defaultValueAge;
		}

		if (obj.hasOwnProperty('defaultValueAnnotation')) {
			this.defaultValueAnnotation = obj.defaultValueAnnotation;
		}

		if (obj.hasOwnProperty('defaultValueAttachment')) {
			this.defaultValueAttachment = obj.defaultValueAttachment;
		}

		if (obj.hasOwnProperty('defaultValueCodeableConcept')) {
			this.defaultValueCodeableConcept = obj.defaultValueCodeableConcept;
		}

		if (obj.hasOwnProperty('defaultValueCodeableReference')) {
			this.defaultValueCodeableReference = obj.defaultValueCodeableReference;
		}

		if (obj.hasOwnProperty('defaultValueCoding')) {
			this.defaultValueCoding = obj.defaultValueCoding;
		}

		if (obj.hasOwnProperty('defaultValueContactPoint')) {
			this.defaultValueContactPoint = obj.defaultValueContactPoint;
		}

		if (obj.hasOwnProperty('defaultValueCount')) {
			this.defaultValueCount = obj.defaultValueCount;
		}

		if (obj.hasOwnProperty('defaultValueDistance')) {
			this.defaultValueDistance = obj.defaultValueDistance;
		}

		if (obj.hasOwnProperty('defaultValueDuration')) {
			this.defaultValueDuration = obj.defaultValueDuration;
		}

		if (obj.hasOwnProperty('defaultValueHumanName')) {
			this.defaultValueHumanName = obj.defaultValueHumanName;
		}

		if (obj.hasOwnProperty('defaultValueIdentifier')) {
			this.defaultValueIdentifier = obj.defaultValueIdentifier;
		}

		if (obj.hasOwnProperty('defaultValueMoney')) {
			this.defaultValueMoney = obj.defaultValueMoney;
		}

		if (obj.hasOwnProperty('defaultValuePeriod')) {
			this.defaultValuePeriod = obj.defaultValuePeriod;
		}

		if (obj.hasOwnProperty('defaultValueQuantity')) {
			this.defaultValueQuantity = obj.defaultValueQuantity;
		}

		if (obj.hasOwnProperty('defaultValueRange')) {
			this.defaultValueRange = obj.defaultValueRange;
		}

		if (obj.hasOwnProperty('defaultValueRatio')) {
			this.defaultValueRatio = obj.defaultValueRatio;
		}

		if (obj.hasOwnProperty('defaultValueRatioRange')) {
			this.defaultValueRatioRange = obj.defaultValueRatioRange;
		}

		if (obj.hasOwnProperty('defaultValueReference')) {
			this.defaultValueReference = obj.defaultValueReference;
		}

		if (obj.hasOwnProperty('defaultValueSampledData')) {
			this.defaultValueSampledData = obj.defaultValueSampledData;
		}

		if (obj.hasOwnProperty('defaultValueSignature')) {
			this.defaultValueSignature = obj.defaultValueSignature;
		}

		if (obj.hasOwnProperty('defaultValueTiming')) {
			this.defaultValueTiming = obj.defaultValueTiming;
		}

		if (obj.hasOwnProperty('defaultValueContactDetail')) {
			this.defaultValueContactDetail = obj.defaultValueContactDetail;
		}

		if (obj.hasOwnProperty('defaultValueContributor')) {
			this.defaultValueContributor = obj.defaultValueContributor;
		}

		if (obj.hasOwnProperty('defaultValueDataRequirement')) {
			this.defaultValueDataRequirement = obj.defaultValueDataRequirement;
		}

		if (obj.hasOwnProperty('defaultValueExpression')) {
			this.defaultValueExpression = obj.defaultValueExpression;
		}

		if (obj.hasOwnProperty('defaultValueParameterDefinition')) {
			this.defaultValueParameterDefinition = obj.defaultValueParameterDefinition;
		}

		if (obj.hasOwnProperty('defaultValueRelatedArtifact')) {
			this.defaultValueRelatedArtifact = obj.defaultValueRelatedArtifact;
		}

		if (obj.hasOwnProperty('defaultValueTriggerDefinition')) {
			this.defaultValueTriggerDefinition = obj.defaultValueTriggerDefinition;
		}

		if (obj.hasOwnProperty('defaultValueUsageContext')) {
			this.defaultValueUsageContext = obj.defaultValueUsageContext;
		}

		if (obj.hasOwnProperty('defaultValueDosage')) {
			this.defaultValueDosage = obj.defaultValueDosage;
		}

		if (obj.hasOwnProperty('meaningWhenMissing')) {
			this.meaningWhenMissing = obj.meaningWhenMissing;
		}

		if (obj.hasOwnProperty('orderMeaning')) {
			this.orderMeaning = obj.orderMeaning;
		}

		if (obj.hasOwnProperty('fixedBase64Binary')) {
			this.fixedBase64Binary = obj.fixedBase64Binary;
		}

		if (obj.hasOwnProperty('fixedBoolean')) {
			this.fixedBoolean = obj.fixedBoolean;
		}

		if (obj.hasOwnProperty('fixedCanonical')) {
			this.fixedCanonical = obj.fixedCanonical;
		}

		if (obj.hasOwnProperty('fixedCode')) {
			this.fixedCode = obj.fixedCode;
		}

		if (obj.hasOwnProperty('fixedDate')) {
			this.fixedDate = obj.fixedDate;
		}

		if (obj.hasOwnProperty('fixedDateTime')) {
			this.fixedDateTime = obj.fixedDateTime;
		}

		if (obj.hasOwnProperty('fixedDecimal')) {
			this.fixedDecimal = obj.fixedDecimal;
		}

		if (obj.hasOwnProperty('fixedId')) {
			this.fixedId = obj.fixedId;
		}

		if (obj.hasOwnProperty('fixedInstant')) {
			this.fixedInstant = obj.fixedInstant;
		}

		if (obj.hasOwnProperty('fixedInteger')) {
			this.fixedInteger = obj.fixedInteger;
		}

		if (obj.hasOwnProperty('fixedMarkdown')) {
			this.fixedMarkdown = obj.fixedMarkdown;
		}

		if (obj.hasOwnProperty('fixedOid')) {
			this.fixedOid = obj.fixedOid;
		}

		if (obj.hasOwnProperty('fixedPositiveInt')) {
			this.fixedPositiveInt = obj.fixedPositiveInt;
		}

		if (obj.hasOwnProperty('fixedString')) {
			this.fixedString = obj.fixedString;
		}

		if (obj.hasOwnProperty('fixedTime')) {
			this.fixedTime = obj.fixedTime;
		}

		if (obj.hasOwnProperty('fixedUnsignedInt')) {
			this.fixedUnsignedInt = obj.fixedUnsignedInt;
		}

		if (obj.hasOwnProperty('fixedUri')) {
			this.fixedUri = obj.fixedUri;
		}

		if (obj.hasOwnProperty('fixedUrl')) {
			this.fixedUrl = obj.fixedUrl;
		}

		if (obj.hasOwnProperty('fixedUuid')) {
			this.fixedUuid = obj.fixedUuid;
		}

		if (obj.hasOwnProperty('fixedAddress')) {
			this.fixedAddress = obj.fixedAddress;
		}

		if (obj.hasOwnProperty('fixedAge')) {
			this.fixedAge = obj.fixedAge;
		}

		if (obj.hasOwnProperty('fixedAnnotation')) {
			this.fixedAnnotation = obj.fixedAnnotation;
		}

		if (obj.hasOwnProperty('fixedAttachment')) {
			this.fixedAttachment = obj.fixedAttachment;
		}

		if (obj.hasOwnProperty('fixedCodeableConcept')) {
			this.fixedCodeableConcept = obj.fixedCodeableConcept;
		}

		if (obj.hasOwnProperty('fixedCodeableReference')) {
			this.fixedCodeableReference = obj.fixedCodeableReference;
		}

		if (obj.hasOwnProperty('fixedCoding')) {
			this.fixedCoding = obj.fixedCoding;
		}

		if (obj.hasOwnProperty('fixedContactPoint')) {
			this.fixedContactPoint = obj.fixedContactPoint;
		}

		if (obj.hasOwnProperty('fixedCount')) {
			this.fixedCount = obj.fixedCount;
		}

		if (obj.hasOwnProperty('fixedDistance')) {
			this.fixedDistance = obj.fixedDistance;
		}

		if (obj.hasOwnProperty('fixedDuration')) {
			this.fixedDuration = obj.fixedDuration;
		}

		if (obj.hasOwnProperty('fixedHumanName')) {
			this.fixedHumanName = obj.fixedHumanName;
		}

		if (obj.hasOwnProperty('fixedIdentifier')) {
			this.fixedIdentifier = obj.fixedIdentifier;
		}

		if (obj.hasOwnProperty('fixedMoney')) {
			this.fixedMoney = obj.fixedMoney;
		}

		if (obj.hasOwnProperty('fixedPeriod')) {
			this.fixedPeriod = obj.fixedPeriod;
		}

		if (obj.hasOwnProperty('fixedQuantity')) {
			this.fixedQuantity = obj.fixedQuantity;
		}

		if (obj.hasOwnProperty('fixedRange')) {
			this.fixedRange = obj.fixedRange;
		}

		if (obj.hasOwnProperty('fixedRatio')) {
			this.fixedRatio = obj.fixedRatio;
		}

		if (obj.hasOwnProperty('fixedRatioRange')) {
			this.fixedRatioRange = obj.fixedRatioRange;
		}

		if (obj.hasOwnProperty('fixedReference')) {
			this.fixedReference = obj.fixedReference;
		}

		if (obj.hasOwnProperty('fixedSampledData')) {
			this.fixedSampledData = obj.fixedSampledData;
		}

		if (obj.hasOwnProperty('fixedSignature')) {
			this.fixedSignature = obj.fixedSignature;
		}

		if (obj.hasOwnProperty('fixedTiming')) {
			this.fixedTiming = obj.fixedTiming;
		}

		if (obj.hasOwnProperty('fixedContactDetail')) {
			this.fixedContactDetail = obj.fixedContactDetail;
		}

		if (obj.hasOwnProperty('fixedContributor')) {
			this.fixedContributor = obj.fixedContributor;
		}

		if (obj.hasOwnProperty('fixedDataRequirement')) {
			this.fixedDataRequirement = obj.fixedDataRequirement;
		}

		if (obj.hasOwnProperty('fixedExpression')) {
			this.fixedExpression = obj.fixedExpression;
		}

		if (obj.hasOwnProperty('fixedParameterDefinition')) {
			this.fixedParameterDefinition = obj.fixedParameterDefinition;
		}

		if (obj.hasOwnProperty('fixedRelatedArtifact')) {
			this.fixedRelatedArtifact = obj.fixedRelatedArtifact;
		}

		if (obj.hasOwnProperty('fixedTriggerDefinition')) {
			this.fixedTriggerDefinition = obj.fixedTriggerDefinition;
		}

		if (obj.hasOwnProperty('fixedUsageContext')) {
			this.fixedUsageContext = obj.fixedUsageContext;
		}

		if (obj.hasOwnProperty('fixedDosage')) {
			this.fixedDosage = obj.fixedDosage;
		}

		if (obj.hasOwnProperty('patternBase64Binary')) {
			this.patternBase64Binary = obj.patternBase64Binary;
		}

		if (obj.hasOwnProperty('patternBoolean')) {
			this.patternBoolean = obj.patternBoolean;
		}

		if (obj.hasOwnProperty('patternCanonical')) {
			this.patternCanonical = obj.patternCanonical;
		}

		if (obj.hasOwnProperty('patternCode')) {
			this.patternCode = obj.patternCode;
		}

		if (obj.hasOwnProperty('patternDate')) {
			this.patternDate = obj.patternDate;
		}

		if (obj.hasOwnProperty('patternDateTime')) {
			this.patternDateTime = obj.patternDateTime;
		}

		if (obj.hasOwnProperty('patternDecimal')) {
			this.patternDecimal = obj.patternDecimal;
		}

		if (obj.hasOwnProperty('patternId')) {
			this.patternId = obj.patternId;
		}

		if (obj.hasOwnProperty('patternInstant')) {
			this.patternInstant = obj.patternInstant;
		}

		if (obj.hasOwnProperty('patternInteger')) {
			this.patternInteger = obj.patternInteger;
		}

		if (obj.hasOwnProperty('patternMarkdown')) {
			this.patternMarkdown = obj.patternMarkdown;
		}

		if (obj.hasOwnProperty('patternOid')) {
			this.patternOid = obj.patternOid;
		}

		if (obj.hasOwnProperty('patternPositiveInt')) {
			this.patternPositiveInt = obj.patternPositiveInt;
		}

		if (obj.hasOwnProperty('patternString')) {
			this.patternString = obj.patternString;
		}

		if (obj.hasOwnProperty('patternTime')) {
			this.patternTime = obj.patternTime;
		}

		if (obj.hasOwnProperty('patternUnsignedInt')) {
			this.patternUnsignedInt = obj.patternUnsignedInt;
		}

		if (obj.hasOwnProperty('patternUri')) {
			this.patternUri = obj.patternUri;
		}

		if (obj.hasOwnProperty('patternUrl')) {
			this.patternUrl = obj.patternUrl;
		}

		if (obj.hasOwnProperty('patternUuid')) {
			this.patternUuid = obj.patternUuid;
		}

		if (obj.hasOwnProperty('patternAddress')) {
			this.patternAddress = obj.patternAddress;
		}

		if (obj.hasOwnProperty('patternAge')) {
			this.patternAge = obj.patternAge;
		}

		if (obj.hasOwnProperty('patternAnnotation')) {
			this.patternAnnotation = obj.patternAnnotation;
		}

		if (obj.hasOwnProperty('patternAttachment')) {
			this.patternAttachment = obj.patternAttachment;
		}

		if (obj.hasOwnProperty('patternCodeableConcept')) {
			this.patternCodeableConcept = obj.patternCodeableConcept;
		}

		if (obj.hasOwnProperty('patternCodeableReference')) {
			this.patternCodeableReference = obj.patternCodeableReference;
		}

		if (obj.hasOwnProperty('patternCoding')) {
			this.patternCoding = obj.patternCoding;
		}

		if (obj.hasOwnProperty('patternContactPoint')) {
			this.patternContactPoint = obj.patternContactPoint;
		}

		if (obj.hasOwnProperty('patternCount')) {
			this.patternCount = obj.patternCount;
		}

		if (obj.hasOwnProperty('patternDistance')) {
			this.patternDistance = obj.patternDistance;
		}

		if (obj.hasOwnProperty('patternDuration')) {
			this.patternDuration = obj.patternDuration;
		}

		if (obj.hasOwnProperty('patternHumanName')) {
			this.patternHumanName = obj.patternHumanName;
		}

		if (obj.hasOwnProperty('patternIdentifier')) {
			this.patternIdentifier = obj.patternIdentifier;
		}

		if (obj.hasOwnProperty('patternMoney')) {
			this.patternMoney = obj.patternMoney;
		}

		if (obj.hasOwnProperty('patternPeriod')) {
			this.patternPeriod = obj.patternPeriod;
		}

		if (obj.hasOwnProperty('patternQuantity')) {
			this.patternQuantity = obj.patternQuantity;
		}

		if (obj.hasOwnProperty('patternRange')) {
			this.patternRange = obj.patternRange;
		}

		if (obj.hasOwnProperty('patternRatio')) {
			this.patternRatio = obj.patternRatio;
		}

		if (obj.hasOwnProperty('patternRatioRange')) {
			this.patternRatioRange = obj.patternRatioRange;
		}

		if (obj.hasOwnProperty('patternReference')) {
			this.patternReference = obj.patternReference;
		}

		if (obj.hasOwnProperty('patternSampledData')) {
			this.patternSampledData = obj.patternSampledData;
		}

		if (obj.hasOwnProperty('patternSignature')) {
			this.patternSignature = obj.patternSignature;
		}

		if (obj.hasOwnProperty('patternTiming')) {
			this.patternTiming = obj.patternTiming;
		}

		if (obj.hasOwnProperty('patternContactDetail')) {
			this.patternContactDetail = obj.patternContactDetail;
		}

		if (obj.hasOwnProperty('patternContributor')) {
			this.patternContributor = obj.patternContributor;
		}

		if (obj.hasOwnProperty('patternDataRequirement')) {
			this.patternDataRequirement = obj.patternDataRequirement;
		}

		if (obj.hasOwnProperty('patternExpression')) {
			this.patternExpression = obj.patternExpression;
		}

		if (obj.hasOwnProperty('patternParameterDefinition')) {
			this.patternParameterDefinition = obj.patternParameterDefinition;
		}

		if (obj.hasOwnProperty('patternRelatedArtifact')) {
			this.patternRelatedArtifact = obj.patternRelatedArtifact;
		}

		if (obj.hasOwnProperty('patternTriggerDefinition')) {
			this.patternTriggerDefinition = obj.patternTriggerDefinition;
		}

		if (obj.hasOwnProperty('patternUsageContext')) {
			this.patternUsageContext = obj.patternUsageContext;
		}

		if (obj.hasOwnProperty('patternDosage')) {
			this.patternDosage = obj.patternDosage;
		}

		if (obj.hasOwnProperty('example')) {
			this.example = [];
			for (const o of (obj.example instanceof Array ? obj.example : [])) {
				this.example.push(new ElementDefinitionExample(o));
			}
		}

		if (obj.hasOwnProperty('minValueDate')) {
			this.minValueDate = obj.minValueDate;
		}

		if (obj.hasOwnProperty('minValueDateTime')) {
			this.minValueDateTime = obj.minValueDateTime;
		}

		if (obj.hasOwnProperty('minValueInstant')) {
			this.minValueInstant = obj.minValueInstant;
		}

		if (obj.hasOwnProperty('minValueTime')) {
			this.minValueTime = obj.minValueTime;
		}

		if (obj.hasOwnProperty('minValueDecimal')) {
			this.minValueDecimal = obj.minValueDecimal;
		}

		if (obj.hasOwnProperty('minValueInteger')) {
			this.minValueInteger = obj.minValueInteger;
		}

		if (obj.hasOwnProperty('minValuePositiveInt')) {
			this.minValuePositiveInt = obj.minValuePositiveInt;
		}

		if (obj.hasOwnProperty('minValueUnsignedInt')) {
			this.minValueUnsignedInt = obj.minValueUnsignedInt;
		}

		if (obj.hasOwnProperty('minValueQuantity')) {
			this.minValueQuantity = obj.minValueQuantity;
		}

		if (obj.hasOwnProperty('maxValueDate')) {
			this.maxValueDate = obj.maxValueDate;
		}

		if (obj.hasOwnProperty('maxValueDateTime')) {
			this.maxValueDateTime = obj.maxValueDateTime;
		}

		if (obj.hasOwnProperty('maxValueInstant')) {
			this.maxValueInstant = obj.maxValueInstant;
		}

		if (obj.hasOwnProperty('maxValueTime')) {
			this.maxValueTime = obj.maxValueTime;
		}

		if (obj.hasOwnProperty('maxValueDecimal')) {
			this.maxValueDecimal = obj.maxValueDecimal;
		}

		if (obj.hasOwnProperty('maxValueInteger')) {
			this.maxValueInteger = obj.maxValueInteger;
		}

		if (obj.hasOwnProperty('maxValuePositiveInt')) {
			this.maxValuePositiveInt = obj.maxValuePositiveInt;
		}

		if (obj.hasOwnProperty('maxValueUnsignedInt')) {
			this.maxValueUnsignedInt = obj.maxValueUnsignedInt;
		}

		if (obj.hasOwnProperty('maxValueQuantity')) {
			this.maxValueQuantity = obj.maxValueQuantity;
		}

		if (obj.hasOwnProperty('maxLength')) {
			this.maxLength = obj.maxLength;
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(o);
			}
		}

		if (obj.hasOwnProperty('constraint')) {
			this.constraint = [];
			for (const o of (obj.constraint instanceof Array ? obj.constraint : [])) {
				this.constraint.push(new ElementDefinitionConstraint(o));
			}
		}

		if (obj.hasOwnProperty('mustSupport')) {
			this.mustSupport = obj.mustSupport;
		}

		if (obj.hasOwnProperty('isModifier')) {
			this.isModifier = obj.isModifier;
		}

		if (obj.hasOwnProperty('isModifierReason')) {
			this.isModifierReason = obj.isModifierReason;
		}

		if (obj.hasOwnProperty('isSummary')) {
			this.isSummary = obj.isSummary;
		}

		if (obj.hasOwnProperty('binding')) {
			this.binding = obj.binding;
		}

		if (obj.hasOwnProperty('mapping')) {
			this.mapping = [];
			for (const o of (obj.mapping instanceof Array ? obj.mapping : [])) {
				this.mapping.push(new ElementDefinitionMapping(o));
			}
		}

	}

  path: string;
  representation?: ElementDefinitionRepresentation1[];
  sliceName?: string;
  sliceIsConstraining?: boolean;
  label?: string;
  code?: Coding[];
  slicing?: ElementDefinitionSlicing;
  short?: string;
  definition?: string;
  comment?: string;
  requirements?: string;
  alias?: string[];
  min?: number;
  max?: string;
  base?: ElementDefinitionBase;
  contentReference?: string;
  type?: ElementDefinitionType[];
  defaultValueBase64Binary?: string;
  defaultValueBoolean?: boolean;
  defaultValueCanonical?: string;
  defaultValueCode?: string;
  defaultValueDate?: string;
  defaultValueDateTime?: string;
  defaultValueDecimal?: number;
  defaultValueId?: string;
  defaultValueInstant?: string;
  defaultValueInteger?: number;
  defaultValueMarkdown?: string;
  defaultValueOid?: string;
  defaultValuePositiveInt?: number;
  defaultValueString?: string;
  defaultValueTime?: string;
  defaultValueUnsignedInt?: number;
  defaultValueUri?: string;
  defaultValueUrl?: string;
  defaultValueUuid?: string;
  defaultValueAddress?: Address;
  defaultValueAge?: Age;
  defaultValueAnnotation?: Annotation;
  defaultValueAttachment?: Attachment;
  defaultValueCodeableConcept?: CodeableConcept;
  defaultValueCodeableReference?: CodeableReference;
  defaultValueCoding?: Coding;
  defaultValueContactPoint?: ContactPoint;
  defaultValueCount?: Count;
  defaultValueDistance?: Distance;
  defaultValueDuration?: Duration;
  defaultValueHumanName?: HumanName;
  defaultValueIdentifier?: Identifier;
  defaultValueMoney?: Money;
  defaultValuePeriod?: Period;
  defaultValueQuantity?: Quantity;
  defaultValueRange?: Range;
  defaultValueRatio?: Ratio;
  defaultValueRatioRange?: RatioRange;
  defaultValueReference?: Reference;
  defaultValueSampledData?: SampledData;
  defaultValueSignature?: Signature;
  defaultValueTiming?: Timing;
  defaultValueContactDetail?: ContactDetail;
  defaultValueContributor?: Contributor;
  defaultValueDataRequirement?: DataRequirement;
  defaultValueExpression?: Expression;
  defaultValueParameterDefinition?: ParameterDefinition;
  defaultValueRelatedArtifact?: RelatedArtifact;
  defaultValueTriggerDefinition?: TriggerDefinition;
  defaultValueUsageContext?: UsageContext;
  defaultValueDosage?: Dosage;
  meaningWhenMissing?: string;
  orderMeaning?: string;
  fixedBase64Binary?: string;
  fixedBoolean?: boolean;
  fixedCanonical?: string;
  fixedCode?: string;
  fixedDate?: string;
  fixedDateTime?: string;
  fixedDecimal?: number;
  fixedId?: string;
  fixedInstant?: string;
  fixedInteger?: number;
  fixedMarkdown?: string;
  fixedOid?: string;
  fixedPositiveInt?: number;
  fixedString?: string;
  fixedTime?: string;
  fixedUnsignedInt?: number;
  fixedUri?: string;
  fixedUrl?: string;
  fixedUuid?: string;
  fixedAddress?: Address;
  fixedAge?: Age;
  fixedAnnotation?: Annotation;
  fixedAttachment?: Attachment;
  fixedCodeableConcept?: CodeableConcept;
  fixedCodeableReference?: CodeableReference;
  fixedCoding?: Coding;
  fixedContactPoint?: ContactPoint;
  fixedCount?: Count;
  fixedDistance?: Distance;
  fixedDuration?: Duration;
  fixedHumanName?: HumanName;
  fixedIdentifier?: Identifier;
  fixedMoney?: Money;
  fixedPeriod?: Period;
  fixedQuantity?: Quantity;
  fixedRange?: Range;
  fixedRatio?: Ratio;
  fixedRatioRange?: RatioRange;
  fixedReference?: Reference;
  fixedSampledData?: SampledData;
  fixedSignature?: Signature;
  fixedTiming?: Timing;
  fixedContactDetail?: ContactDetail;
  fixedContributor?: Contributor;
  fixedDataRequirement?: DataRequirement;
  fixedExpression?: Expression;
  fixedParameterDefinition?: ParameterDefinition;
  fixedRelatedArtifact?: RelatedArtifact;
  fixedTriggerDefinition?: TriggerDefinition;
  fixedUsageContext?: UsageContext;
  fixedDosage?: Dosage;
  patternBase64Binary?: string;
  patternBoolean?: boolean;
  patternCanonical?: string;
  patternCode?: string;
  patternDate?: string;
  patternDateTime?: string;
  patternDecimal?: number;
  patternId?: string;
  patternInstant?: string;
  patternInteger?: number;
  patternMarkdown?: string;
  patternOid?: string;
  patternPositiveInt?: number;
  patternString?: string;
  patternTime?: string;
  patternUnsignedInt?: number;
  patternUri?: string;
  patternUrl?: string;
  patternUuid?: string;
  patternAddress?: Address;
  patternAge?: Age;
  patternAnnotation?: Annotation;
  patternAttachment?: Attachment;
  patternCodeableConcept?: CodeableConcept;
  patternCodeableReference?: CodeableReference;
  patternCoding?: Coding;
  patternContactPoint?: ContactPoint;
  patternCount?: Count;
  patternDistance?: Distance;
  patternDuration?: Duration;
  patternHumanName?: HumanName;
  patternIdentifier?: Identifier;
  patternMoney?: Money;
  patternPeriod?: Period;
  patternQuantity?: Quantity;
  patternRange?: Range;
  patternRatio?: Ratio;
  patternRatioRange?: RatioRange;
  patternReference?: Reference;
  patternSampledData?: SampledData;
  patternSignature?: Signature;
  patternTiming?: Timing;
  patternContactDetail?: ContactDetail;
  patternContributor?: Contributor;
  patternDataRequirement?: DataRequirement;
  patternExpression?: Expression;
  patternParameterDefinition?: ParameterDefinition;
  patternRelatedArtifact?: RelatedArtifact;
  patternTriggerDefinition?: TriggerDefinition;
  patternUsageContext?: UsageContext;
  patternDosage?: Dosage;
  example?: ElementDefinitionExample[];
  minValueDate?: string;
  minValueDateTime?: string;
  minValueInstant?: string;
  minValueTime?: string;
  minValueDecimal?: number;
  minValueInteger?: number;
  minValuePositiveInt?: number;
  minValueUnsignedInt?: number;
  minValueQuantity?: Quantity;
  maxValueDate?: string;
  maxValueDateTime?: string;
  maxValueInstant?: string;
  maxValueTime?: string;
  maxValueDecimal?: number;
  maxValueInteger?: number;
  maxValuePositiveInt?: number;
  maxValueUnsignedInt?: number;
  maxValueQuantity?: Quantity;
  maxLength?: number;
  condition?: string[];
  constraint?: ElementDefinitionConstraint[];
  mustSupport?: boolean;
  isModifier?: boolean;
  isModifierReason?: string;
  isSummary?: boolean;
  binding?: ElementDefinitionBinding;
  mapping?: ElementDefinitionMapping[];
}

export class HumanName implements IFhir.IHumanName {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('family')) {
			this.family = obj.family;
		}

		if (obj.hasOwnProperty('given')) {
			this.given = [];
			for (const o of (obj.given instanceof Array ? obj.given : [])) {
				this.given.push(o);
			}
		}

		if (obj.hasOwnProperty('prefix')) {
			this.prefix = [];
			for (const o of (obj.prefix instanceof Array ? obj.prefix : [])) {
				this.prefix.push(o);
			}
		}

		if (obj.hasOwnProperty('suffix')) {
			this.suffix = [];
			for (const o of (obj.suffix instanceof Array ? obj.suffix : [])) {
				this.suffix.push(o);
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  use?: HumanNameUse1;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export class Money extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('currency')) {
			this.currency = obj.currency;
		}

	}

  value?: number;
  currency?: string;
}

export class RatioRange extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('lowNumerator')) {
			this.lowNumerator = obj.lowNumerator;
		}

		if (obj.hasOwnProperty('highNumerator')) {
			this.highNumerator = obj.highNumerator;
		}

		if (obj.hasOwnProperty('denominator')) {
			this.denominator = obj.denominator;
		}

	}

  lowNumerator?: Quantity;
  highNumerator?: Quantity;
  denominator?: Quantity;
}

export class SampledData extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('origin')) {
			this.origin = obj.origin;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('lowerLimit')) {
			this.lowerLimit = obj.lowerLimit;
		}

		if (obj.hasOwnProperty('upperLimit')) {
			this.upperLimit = obj.upperLimit;
		}

		if (obj.hasOwnProperty('dimensions')) {
			this.dimensions = obj.dimensions;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = obj.data;
		}

	}

  origin: Quantity;
  period: number;
  factor?: number;
  lowerLimit?: number;
  upperLimit?: number;
  dimensions: number;
  data?: string;
}

export class Signature extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('when')) {
			this.when = obj.when;
		}

		if (obj.hasOwnProperty('who')) {
			this.who = obj.who;
		}

		if (obj.hasOwnProperty('onBehalfOf')) {
			this.onBehalfOf = obj.onBehalfOf;
		}

		if (obj.hasOwnProperty('targetFormat')) {
			this.targetFormat = obj.targetFormat;
		}

		if (obj.hasOwnProperty('sigFormat')) {
			this.sigFormat = obj.sigFormat;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = obj.data;
		}

	}

  type: Coding[];
  when: string;
  who: Reference;
  onBehalfOf?: Reference;
  targetFormat?: string;
  sigFormat?: string;
  data?: string;
}

export class Expression extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  description?: string;
  name?: string;
  language: ExpressionLanguage1;
  expression?: string;
  reference?: string;
}

export class ParameterDefinition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

	}

  name?: string;
  use: ParameterDefinitionUse1;
  min?: number;
  max?: string;
  documentation?: string;
  type: ParameterDefinitionType1;
  profile?: string;
}

export class RelatedArtifact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('label')) {
			this.label = obj.label;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('citation')) {
			this.citation = obj.citation;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('document')) {
			this.document = obj.document;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

	}

  type: RelatedArtifactType1;
  label?: string;
  display?: string;
  citation?: string;
  url?: string;
  document?: Attachment;
  resource?: string;
}

export class TriggerDefinition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('timingTiming')) {
			this.timingTiming = obj.timingTiming;
		}

		if (obj.hasOwnProperty('timingReference')) {
			this.timingReference = obj.timingReference;
		}

		if (obj.hasOwnProperty('timingDate')) {
			this.timingDate = obj.timingDate;
		}

		if (obj.hasOwnProperty('timingDateTime')) {
			this.timingDateTime = obj.timingDateTime;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = [];
			for (const o of (obj.data instanceof Array ? obj.data : [])) {
				this.data.push(new DataRequirement(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

	}

  type: string;
  name?: string;
  timingTiming?: Timing;
  timingReference?: Reference;
  timingDate?: string;
  timingDateTime?: string;
  data?: DataRequirement[];
  condition?: Expression;
}

export class UsageContext extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

	}

  code: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
}

export class Extension implements IFhir.IExtension {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueCanonical')) {
			this.valueCanonical = obj.valueCanonical;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueInstant')) {
			this.valueInstant = obj.valueInstant;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueMarkdown')) {
			this.valueMarkdown = obj.valueMarkdown;
		}

		if (obj.hasOwnProperty('valueOid')) {
			this.valueOid = obj.valueOid;
		}

		if (obj.hasOwnProperty('valuePositiveInt')) {
			this.valuePositiveInt = obj.valuePositiveInt;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueUnsignedInt')) {
			this.valueUnsignedInt = obj.valueUnsignedInt;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueUrl')) {
			this.valueUrl = obj.valueUrl;
		}

		if (obj.hasOwnProperty('valueUuid')) {
			this.valueUuid = obj.valueUuid;
		}

		if (obj.hasOwnProperty('valueAddress')) {
			this.valueAddress = obj.valueAddress;
		}

		if (obj.hasOwnProperty('valueAge')) {
			this.valueAge = obj.valueAge;
		}

		if (obj.hasOwnProperty('valueAnnotation')) {
			this.valueAnnotation = obj.valueAnnotation;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueCodeableReference')) {
			this.valueCodeableReference = obj.valueCodeableReference;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueContactPoint')) {
			this.valueContactPoint = obj.valueContactPoint;
		}

		if (obj.hasOwnProperty('valueCount')) {
			this.valueCount = obj.valueCount;
		}

		if (obj.hasOwnProperty('valueDistance')) {
			this.valueDistance = obj.valueDistance;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

		if (obj.hasOwnProperty('valueHumanName')) {
			this.valueHumanName = obj.valueHumanName;
		}

		if (obj.hasOwnProperty('valueIdentifier')) {
			this.valueIdentifier = obj.valueIdentifier;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueRatioRange')) {
			this.valueRatioRange = obj.valueRatioRange;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueSignature')) {
			this.valueSignature = obj.valueSignature;
		}

		if (obj.hasOwnProperty('valueTiming')) {
			this.valueTiming = obj.valueTiming;
		}

		if (obj.hasOwnProperty('valueContactDetail')) {
			this.valueContactDetail = obj.valueContactDetail;
		}

		if (obj.hasOwnProperty('valueContributor')) {
			this.valueContributor = obj.valueContributor;
		}

		if (obj.hasOwnProperty('valueDataRequirement')) {
			this.valueDataRequirement = obj.valueDataRequirement;
		}

		if (obj.hasOwnProperty('valueExpression')) {
			this.valueExpression = obj.valueExpression;
		}

		if (obj.hasOwnProperty('valueParameterDefinition')) {
			this.valueParameterDefinition = obj.valueParameterDefinition;
		}

		if (obj.hasOwnProperty('valueRelatedArtifact')) {
			this.valueRelatedArtifact = obj.valueRelatedArtifact;
		}

		if (obj.hasOwnProperty('valueTriggerDefinition')) {
			this.valueTriggerDefinition = obj.valueTriggerDefinition;
		}

		if (obj.hasOwnProperty('valueUsageContext')) {
			this.valueUsageContext = obj.valueUsageContext;
		}

		if (obj.hasOwnProperty('valueDosage')) {
			this.valueDosage = obj.valueDosage;
		}

	}

  url: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: number;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCodeableReference?: CodeableReference;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueRatioRange?: RatioRange;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
}

export class MarketingStatus extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('country')) {
			this.country = obj.country;
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = obj.jurisdiction;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('dateRange')) {
			this.dateRange = obj.dateRange;
		}

		if (obj.hasOwnProperty('restoreDate')) {
			this.restoreDate = obj.restoreDate;
		}

	}

  country?: CodeableConcept;
  jurisdiction?: CodeableConcept;
  status: CodeableConcept;
  dateRange?: Period;
  restoreDate?: string;
}

export class Meta implements IFhir.IMeta {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('versionId')) {
			this.versionId = obj.versionId;
		}

		if (obj.hasOwnProperty('lastUpdated')) {
			this.lastUpdated = obj.lastUpdated;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = [];
			for (const o of (obj.profile instanceof Array ? obj.profile : [])) {
				this.profile.push(o);
			}
		}

		if (obj.hasOwnProperty('security')) {
			this.security = [];
			for (const o of (obj.security instanceof Array ? obj.security : [])) {
				this.security.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('tag')) {
			this.tag = [];
			for (const o of (obj.tag instanceof Array ? obj.tag : [])) {
				this.tag.push(new Coding(o));
			}
		}

	}

  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: Coding[];
  tag?: Coding[];
}

export class Narrative extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('div')) {
			this.div = obj.div;
		}

	}

  status: string;
  div: string;
}

export class Population extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('ageRange')) {
			this.ageRange = obj.ageRange;
		}

		if (obj.hasOwnProperty('ageCodeableConcept')) {
			this.ageCodeableConcept = obj.ageCodeableConcept;
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('race')) {
			this.race = obj.race;
		}

		if (obj.hasOwnProperty('physiologicalCondition')) {
			this.physiologicalCondition = obj.physiologicalCondition;
		}

	}

  ageRange?: Range;
  ageCodeableConcept?: CodeableConcept;
  gender?: CodeableConcept;
  race?: CodeableConcept;
  physiologicalCondition?: CodeableConcept;
}

export class ProdCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('height')) {
			this.height = obj.height;
		}

		if (obj.hasOwnProperty('width')) {
			this.width = obj.width;
		}

		if (obj.hasOwnProperty('depth')) {
			this.depth = obj.depth;
		}

		if (obj.hasOwnProperty('weight')) {
			this.weight = obj.weight;
		}

		if (obj.hasOwnProperty('nominalVolume')) {
			this.nominalVolume = obj.nominalVolume;
		}

		if (obj.hasOwnProperty('externalDiameter')) {
			this.externalDiameter = obj.externalDiameter;
		}

		if (obj.hasOwnProperty('shape')) {
			this.shape = obj.shape;
		}

		if (obj.hasOwnProperty('color')) {
			this.color = [];
			for (const o of (obj.color instanceof Array ? obj.color : [])) {
				this.color.push(o);
			}
		}

		if (obj.hasOwnProperty('imprint')) {
			this.imprint = [];
			for (const o of (obj.imprint instanceof Array ? obj.imprint : [])) {
				this.imprint.push(o);
			}
		}

		if (obj.hasOwnProperty('image')) {
			this.image = [];
			for (const o of (obj.image instanceof Array ? obj.image : [])) {
				this.image.push(new Attachment(o));
			}
		}

		if (obj.hasOwnProperty('scoring')) {
			this.scoring = obj.scoring;
		}

	}

  height?: Quantity;
  width?: Quantity;
  depth?: Quantity;
  weight?: Quantity;
  nominalVolume?: Quantity;
  externalDiameter?: Quantity;
  shape?: string;
  color?: string[];
  imprint?: string[];
  image?: Attachment[];
  scoring?: CodeableConcept;
}

export class ProductShelfLife extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('specialPrecautionsForStorage')) {
			this.specialPrecautionsForStorage = [];
			for (const o of (obj.specialPrecautionsForStorage instanceof Array ? obj.specialPrecautionsForStorage : [])) {
				this.specialPrecautionsForStorage.push(new CodeableConcept(o));
			}
		}

	}

  identifier?: Identifier;
  type: CodeableConcept;
  period: Quantity;
  specialPrecautionsForStorage?: CodeableConcept[];
}

export class MoneyQuantity extends Quantity {
	constructor(obj?: any) {
		super(obj);
	}

}

export class SimpleQuantity extends Quantity {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('comparator')) {
			this.comparator = obj.comparator;
		}

	}
}

export class Resource extends Base implements IFhir.IResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('id')) {
			this.id = obj.id;
		}

		if (obj.hasOwnProperty('meta')) {
			this.meta = obj.meta;
		}

		if (obj.hasOwnProperty('implicitRules')) {
			this.implicitRules = obj.implicitRules;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

	}

  id?: string;
  meta?: Meta;
  implicitRules?: string;
  language?: string;
}

export class AccountGuarantor extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('party')) {
			this.party = obj.party;
		}

		if (obj.hasOwnProperty('onHold')) {
			this.onHold = obj.onHold;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  party: Reference;
  onHold?: boolean;
  period?: Period;
}

export class AccountCoverage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

	}

  coverage: Reference;
  priority?: number;
}

export class DomainResource extends Resource implements IFhir.IDomainResource {
  constructor(obj?: any) {
    super(obj);
    if (obj.hasOwnProperty('resourceType')) {
      this.resourceType = obj.resourceType;
    }

    if (obj.hasOwnProperty('text')) {
      this.text = obj.text;
    }

    if (obj.hasOwnProperty('contained')) {
      this.contained = [];
      for (const o of (obj.contained instanceof Array ? obj.contained : [])) {
        this.contained.push(new DomainResource(o));
      }
    }

    if (obj.hasOwnProperty('extension')) {
      this.extension = [];
      for (const o of (obj.extension instanceof Array ? obj.extension : [])) {
        this.extension.push(new Extension(o));
      }
    }

    if (obj.hasOwnProperty('modifierExtension')) {
      this.modifierExtension = [];
      for (const o of (obj.modifierExtension instanceof Array ? obj.modifierExtension : [])) {
        this.modifierExtension.push(new Extension(o));
      }
    }

  }

  resourceType: string;
  text?: Narrative;
  contained?: DomainResource[];
  extension?: Extension[];
  modifierExtension?: Extension[];
}

export class Account extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = [];
			for (const o of (obj.subject instanceof Array ? obj.subject : [])) {
				this.subject.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('servicePeriod')) {
			this.servicePeriod = obj.servicePeriod;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = [];
			for (const o of (obj.coverage instanceof Array ? obj.coverage : [])) {
				this.coverage.push(new AccountCoverage(o));
			}
		}

		if (obj.hasOwnProperty('owner')) {
			this.owner = obj.owner;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('guarantor')) {
			this.guarantor = [];
			for (const o of (obj.guarantor instanceof Array ? obj.guarantor : [])) {
				this.guarantor.push(new AccountGuarantor(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = obj.partOf;
		}

	}

  resourceType = 'Account';
  identifier?: Identifier[];
  status: AccountStatus1;
  type?: CodeableConcept;
  name?: string;
  subject?: Reference[];
  servicePeriod?: Period;
  coverage?: AccountCoverage[];
  owner?: Reference;
  description?: string;
  guarantor?: AccountGuarantor[];
  partOf?: Reference;
}

export class ActivityDefinitionDynamicValue extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  path: string;
  expression: Expression;
}

export class ActivityDefinitionParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

	}

  type: ActivityDefinitionType1;
  role?: CodeableConcept;
}

export class ActivityDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('subjectCanonical')) {
			this.subjectCanonical = obj.subjectCanonical;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('library')) {
			this.library = [];
			for (const o of (obj.library instanceof Array ? obj.library : [])) {
				this.library.push(o);
			}
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('timingTiming')) {
			this.timingTiming = obj.timingTiming;
		}

		if (obj.hasOwnProperty('timingDateTime')) {
			this.timingDateTime = obj.timingDateTime;
		}

		if (obj.hasOwnProperty('timingAge')) {
			this.timingAge = obj.timingAge;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('timingRange')) {
			this.timingRange = obj.timingRange;
		}

		if (obj.hasOwnProperty('timingDuration')) {
			this.timingDuration = obj.timingDuration;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new ActivityDefinitionParticipant(o));
			}
		}

		if (obj.hasOwnProperty('productReference')) {
			this.productReference = obj.productReference;
		}

		if (obj.hasOwnProperty('productCodeableConcept')) {
			this.productCodeableConcept = obj.productCodeableConcept;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('dosage')) {
			this.dosage = [];
			for (const o of (obj.dosage instanceof Array ? obj.dosage : [])) {
				this.dosage.push(new Dosage(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = [];
			for (const o of (obj.bodySite instanceof Array ? obj.bodySite : [])) {
				this.bodySite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specimenRequirement')) {
			this.specimenRequirement = [];
			for (const o of (obj.specimenRequirement instanceof Array ? obj.specimenRequirement : [])) {
				this.specimenRequirement.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('observationRequirement')) {
			this.observationRequirement = [];
			for (const o of (obj.observationRequirement instanceof Array ? obj.observationRequirement : [])) {
				this.observationRequirement.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('observationResultRequirement')) {
			this.observationResultRequirement = [];
			for (const o of (obj.observationResultRequirement instanceof Array ? obj.observationResultRequirement : [])) {
				this.observationResultRequirement.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('transform')) {
			this.transform = obj.transform;
		}

		if (obj.hasOwnProperty('dynamicValue')) {
			this.dynamicValue = [];
			for (const o of (obj.dynamicValue instanceof Array ? obj.dynamicValue : [])) {
				this.dynamicValue.push(new ActivityDefinitionDynamicValue(o));
			}
		}

	}

  resourceType = 'ActivityDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: ActivityDefinitionStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  subjectCanonical?: string;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  library?: string[];
  kind?: ActivityDefinitionKind1;
  profile?: string;
  code?: CodeableConcept;
  intent?: ActivityDefinitionIntent1;
  priority?: ActivityDefinitionPriority1;
  doNotPerform?: boolean;
  timingTiming?: Timing;
  timingDateTime?: string;
  timingAge?: Age;
  timingPeriod?: Period;
  timingRange?: Range;
  timingDuration?: Duration;
  location?: Reference;
  participant?: ActivityDefinitionParticipant[];
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  quantity?: Quantity;
  dosage?: Dosage[];
  bodySite?: CodeableConcept[];
  specimenRequirement?: Reference[];
  observationRequirement?: Reference[];
  observationResultRequirement?: Reference[];
  transform?: string;
  dynamicValue?: ActivityDefinitionDynamicValue[];
}

export class AdministrableProductDefinitionRouteOfAdministrationTargetSpeciesWithdrawalPeriod extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('tissue')) {
			this.tissue = obj.tissue;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = obj.supportingInformation;
		}

	}

  tissue: CodeableConcept;
  value: Quantity;
  supportingInformation?: string;
}

export class AdministrableProductDefinitionRouteOfAdministrationTargetSpecies extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('withdrawalPeriod')) {
			this.withdrawalPeriod = [];
			for (const o of (obj.withdrawalPeriod instanceof Array ? obj.withdrawalPeriod : [])) {
				this.withdrawalPeriod.push(new AdministrableProductDefinitionRouteOfAdministrationTargetSpeciesWithdrawalPeriod(o));
			}
		}

	}

  code: CodeableConcept;
  withdrawalPeriod?: AdministrableProductDefinitionRouteOfAdministrationTargetSpeciesWithdrawalPeriod[];
}

export class AdministrableProductDefinitionRouteOfAdministration extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('firstDose')) {
			this.firstDose = obj.firstDose;
		}

		if (obj.hasOwnProperty('maxSingleDose')) {
			this.maxSingleDose = obj.maxSingleDose;
		}

		if (obj.hasOwnProperty('maxDosePerDay')) {
			this.maxDosePerDay = obj.maxDosePerDay;
		}

		if (obj.hasOwnProperty('maxDosePerTreatmentPeriod')) {
			this.maxDosePerTreatmentPeriod = obj.maxDosePerTreatmentPeriod;
		}

		if (obj.hasOwnProperty('maxTreatmentPeriod')) {
			this.maxTreatmentPeriod = obj.maxTreatmentPeriod;
		}

		if (obj.hasOwnProperty('targetSpecies')) {
			this.targetSpecies = [];
			for (const o of (obj.targetSpecies instanceof Array ? obj.targetSpecies : [])) {
				this.targetSpecies.push(new AdministrableProductDefinitionRouteOfAdministrationTargetSpecies(o));
			}
		}

	}

  code: CodeableConcept;
  firstDose?: Quantity;
  maxSingleDose?: Quantity;
  maxDosePerDay?: Quantity;
  maxDosePerTreatmentPeriod?: Ratio;
  maxTreatmentPeriod?: Duration;
  targetSpecies?: AdministrableProductDefinitionRouteOfAdministrationTargetSpecies[];
}

export class AdministrableProductDefinitionProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
  status?: CodeableConcept;
}

export class AdministrableProductDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('formOf')) {
			this.formOf = [];
			for (const o of (obj.formOf instanceof Array ? obj.formOf : [])) {
				this.formOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('administrableDoseForm')) {
			this.administrableDoseForm = obj.administrableDoseForm;
		}

		if (obj.hasOwnProperty('unitOfPresentation')) {
			this.unitOfPresentation = obj.unitOfPresentation;
		}

		if (obj.hasOwnProperty('producedFrom')) {
			this.producedFrom = [];
			for (const o of (obj.producedFrom instanceof Array ? obj.producedFrom : [])) {
				this.producedFrom.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new AdministrableProductDefinitionProperty(o));
			}
		}

		if (obj.hasOwnProperty('routeOfAdministration')) {
			this.routeOfAdministration = [];
			for (const o of (obj.routeOfAdministration instanceof Array ? obj.routeOfAdministration : [])) {
				this.routeOfAdministration.push(new AdministrableProductDefinitionRouteOfAdministration(o));
			}
		}

	}

  resourceType = 'AdministrableProductDefinition';
  identifier?: Identifier[];
  status: AdministrableProductDefinitionStatus1;
  formOf?: Reference[];
  administrableDoseForm?: CodeableConcept;
  unitOfPresentation?: CodeableConcept;
  producedFrom?: Reference[];
  ingredient?: CodeableConcept[];
  device?: Reference;
  property?: AdministrableProductDefinitionProperty[];
  routeOfAdministration: AdministrableProductDefinitionRouteOfAdministration[];
}

export class AdverseEventSuspectEntityCausality extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('assessment')) {
			this.assessment = obj.assessment;
		}

		if (obj.hasOwnProperty('productRelatedness')) {
			this.productRelatedness = obj.productRelatedness;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

	}

  assessment?: CodeableConcept;
  productRelatedness?: string;
  author?: Reference;
  method?: CodeableConcept;
}

export class AdverseEventSuspectEntity extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('instance')) {
			this.instance = obj.instance;
		}

		if (obj.hasOwnProperty('causality')) {
			this.causality = [];
			for (const o of (obj.causality instanceof Array ? obj.causality : [])) {
				this.causality.push(new AdverseEventSuspectEntityCausality(o));
			}
		}

	}

  instance: Reference;
  causality?: AdverseEventSuspectEntityCausality[];
}

export class AdverseEvent extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('actuality')) {
			this.actuality = obj.actuality;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('event')) {
			this.event = obj.event;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('detected')) {
			this.detected = obj.detected;
		}

		if (obj.hasOwnProperty('recordedDate')) {
			this.recordedDate = obj.recordedDate;
		}

		if (obj.hasOwnProperty('resultingCondition')) {
			this.resultingCondition = [];
			for (const o of (obj.resultingCondition instanceof Array ? obj.resultingCondition : [])) {
				this.resultingCondition.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('seriousness')) {
			this.seriousness = obj.seriousness;
		}

		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('recorder')) {
			this.recorder = obj.recorder;
		}

		if (obj.hasOwnProperty('contributor')) {
			this.contributor = [];
			for (const o of (obj.contributor instanceof Array ? obj.contributor : [])) {
				this.contributor.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('suspectEntity')) {
			this.suspectEntity = [];
			for (const o of (obj.suspectEntity instanceof Array ? obj.suspectEntity : [])) {
				this.suspectEntity.push(new AdverseEventSuspectEntity(o));
			}
		}

		if (obj.hasOwnProperty('subjectMedicalHistory')) {
			this.subjectMedicalHistory = [];
			for (const o of (obj.subjectMedicalHistory instanceof Array ? obj.subjectMedicalHistory : [])) {
				this.subjectMedicalHistory.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('referenceDocument')) {
			this.referenceDocument = [];
			for (const o of (obj.referenceDocument instanceof Array ? obj.referenceDocument : [])) {
				this.referenceDocument.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('study')) {
			this.study = [];
			for (const o of (obj.study instanceof Array ? obj.study : [])) {
				this.study.push(new Reference(o));
			}
		}

	}

  resourceType = 'AdverseEvent';
  identifier?: Identifier;
  actuality: AdverseEventActuality1;
  category?: CodeableConcept[];
  event?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  date?: string;
  detected?: string;
  recordedDate?: string;
  resultingCondition?: Reference[];
  location?: Reference;
  seriousness?: CodeableConcept;
  severity?: CodeableConcept;
  outcome?: CodeableConcept;
  recorder?: Reference;
  contributor?: Reference[];
  suspectEntity?: AdverseEventSuspectEntity[];
  subjectMedicalHistory?: Reference[];
  referenceDocument?: Reference[];
  study?: Reference[];
}

export class AllergyIntoleranceReaction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('substance')) {
			this.substance = obj.substance;
		}

		if (obj.hasOwnProperty('manifestation')) {
			this.manifestation = [];
			for (const o of (obj.manifestation instanceof Array ? obj.manifestation : [])) {
				this.manifestation.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('onset')) {
			this.onset = obj.onset;
		}

		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('exposureRoute')) {
			this.exposureRoute = obj.exposureRoute;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string;
  severity?: AllergyIntoleranceSeverity1;
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}

export class AllergyIntolerance extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('clinicalStatus')) {
			this.clinicalStatus = obj.clinicalStatus;
		}

		if (obj.hasOwnProperty('verificationStatus')) {
			this.verificationStatus = obj.verificationStatus;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(o);
			}
		}

		if (obj.hasOwnProperty('criticality')) {
			this.criticality = obj.criticality;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('onsetDateTime')) {
			this.onsetDateTime = obj.onsetDateTime;
		}

		if (obj.hasOwnProperty('onsetAge')) {
			this.onsetAge = obj.onsetAge;
		}

		if (obj.hasOwnProperty('onsetPeriod')) {
			this.onsetPeriod = obj.onsetPeriod;
		}

		if (obj.hasOwnProperty('onsetRange')) {
			this.onsetRange = obj.onsetRange;
		}

		if (obj.hasOwnProperty('onsetString')) {
			this.onsetString = obj.onsetString;
		}

		if (obj.hasOwnProperty('recordedDate')) {
			this.recordedDate = obj.recordedDate;
		}

		if (obj.hasOwnProperty('recorder')) {
			this.recorder = obj.recorder;
		}

		if (obj.hasOwnProperty('asserter')) {
			this.asserter = obj.asserter;
		}

		if (obj.hasOwnProperty('lastOccurrence')) {
			this.lastOccurrence = obj.lastOccurrence;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('reaction')) {
			this.reaction = [];
			for (const o of (obj.reaction instanceof Array ? obj.reaction : [])) {
				this.reaction.push(new AllergyIntoleranceReaction(o));
			}
		}

	}

  resourceType = 'AllergyIntolerance';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: AllergyIntoleranceType1;
  category?: AllergyIntoleranceCategory1[];
  criticality?: AllergyIntoleranceCriticality1;
  code?: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Age;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  lastOccurrence?: string;
  note?: Annotation[];
  reaction?: AllergyIntoleranceReaction[];
}

export class AppointmentParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

		if (obj.hasOwnProperty('required')) {
			this.required = obj.required;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  type?: CodeableConcept[];
  actor?: Reference;
  required?: AppointmentRequired1;
  status: AppointmentStatus2;
  period?: Period;
}

export class Appointment extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('cancelationReason')) {
			this.cancelationReason = obj.cancelationReason;
		}

		if (obj.hasOwnProperty('serviceCategory')) {
			this.serviceCategory = [];
			for (const o of (obj.serviceCategory instanceof Array ? obj.serviceCategory : [])) {
				this.serviceCategory.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('serviceType')) {
			this.serviceType = [];
			for (const o of (obj.serviceType instanceof Array ? obj.serviceType : [])) {
				this.serviceType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('appointmentType')) {
			this.appointmentType = obj.appointmentType;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = [];
			for (const o of (obj.supportingInformation instanceof Array ? obj.supportingInformation : [])) {
				this.supportingInformation.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('minutesDuration')) {
			this.minutesDuration = obj.minutesDuration;
		}

		if (obj.hasOwnProperty('slot')) {
			this.slot = [];
			for (const o of (obj.slot instanceof Array ? obj.slot : [])) {
				this.slot.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('patientInstruction')) {
			this.patientInstruction = obj.patientInstruction;
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new AppointmentParticipant(o));
			}
		}

		if (obj.hasOwnProperty('requestedPeriod')) {
			this.requestedPeriod = [];
			for (const o of (obj.requestedPeriod instanceof Array ? obj.requestedPeriod : [])) {
				this.requestedPeriod.push(new Period(o));
			}
		}

	}

  resourceType = 'Appointment';
  identifier?: Identifier[];
  status: AppointmentStatus1;
  cancelationReason?: CodeableConcept;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  priority?: number;
  description?: string;
  supportingInformation?: Reference[];
  start?: string;
  end?: string;
  minutesDuration?: number;
  slot?: Reference[];
  created?: string;
  comment?: string;
  patientInstruction?: string;
  basedOn?: Reference[];
  participant: AppointmentParticipant[];
  requestedPeriod?: Period[];
}

export class AppointmentResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('appointment')) {
			this.appointment = obj.appointment;
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('participantType')) {
			this.participantType = [];
			for (const o of (obj.participantType instanceof Array ? obj.participantType : [])) {
				this.participantType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

		if (obj.hasOwnProperty('participantStatus')) {
			this.participantStatus = obj.participantStatus;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  resourceType = 'AppointmentResponse';
  identifier?: Identifier[];
  appointment: Reference;
  start?: string;
  end?: string;
  participantType?: CodeableConcept[];
  actor?: Reference;
  participantStatus: AppointmentResponseParticipantStatus1;
  comment?: string;
}

export class AuditEventEntityDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

	}

  type: string;
  valueString?: string;
  valueBase64Binary?: string;
}

export class AuditEventEntity extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('what')) {
			this.what = obj.what;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('lifecycle')) {
			this.lifecycle = obj.lifecycle;
		}

		if (obj.hasOwnProperty('securityLabel')) {
			this.securityLabel = [];
			for (const o of (obj.securityLabel instanceof Array ? obj.securityLabel : [])) {
				this.securityLabel.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('query')) {
			this.query = obj.query;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new AuditEventEntityDetail(o));
			}
		}

	}

  what?: Reference;
  type?: Coding;
  role?: Coding;
  lifecycle?: Coding;
  securityLabel?: Coding[];
  name?: string;
  description?: string;
  query?: string;
  detail?: AuditEventEntityDetail[];
}

export class AuditEventSource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('site')) {
			this.site = obj.site;
		}

		if (obj.hasOwnProperty('observer')) {
			this.observer = obj.observer;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new Coding(o));
			}
		}

	}

  site?: string;
  observer: Reference;
  type?: Coding[];
}

export class AuditEventAgentNetwork implements IFhir.INetworkComponent {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  address?: string;
  type?: AuditEventType1;
}

export class AuditEventAgent implements IFhir.IAgentComponent {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = [];
			for (const o of (obj.role instanceof Array ? obj.role : [])) {
				this.role.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('who')) {
			this.who = obj.who;
		}

		if (obj.hasOwnProperty('altId')) {
			this.altId = obj.altId;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('requestor')) {
			this.requestor = obj.requestor;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('policy')) {
			this.policy = [];
			for (const o of (obj.policy instanceof Array ? obj.policy : [])) {
				this.policy.push(o);
			}
		}

		if (obj.hasOwnProperty('media')) {
			this.media = obj.media;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = obj.network;
		}

		if (obj.hasOwnProperty('purposeOfUse')) {
			this.purposeOfUse = [];
			for (const o of (obj.purposeOfUse instanceof Array ? obj.purposeOfUse : [])) {
				this.purposeOfUse.push(new CodeableConcept(o));
			}
		}

	}

  type?: CodeableConcept;
  role?: CodeableConcept[];
  who?: Reference;
  altId?: string;
  name?: string;
  requestor: boolean;
  location?: Reference;
  policy?: string[];
  media?: Coding;
  network?: AuditEventAgentNetwork;
  purposeOfUse?: CodeableConcept[];
}

export class AuditEvent extends DomainResource implements IFhir.IAuditEvent {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subtype')) {
			this.subtype = [];
			for (const o of (obj.subtype instanceof Array ? obj.subtype : [])) {
				this.subtype.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = obj.action;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('recorded')) {
			this.recorded = obj.recorded;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('outcomeDesc')) {
			this.outcomeDesc = obj.outcomeDesc;
		}

		if (obj.hasOwnProperty('purposeOfEvent')) {
			this.purposeOfEvent = [];
			for (const o of (obj.purposeOfEvent instanceof Array ? obj.purposeOfEvent : [])) {
				this.purposeOfEvent.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('agent')) {
			this.agent = [];
			for (const o of (obj.agent instanceof Array ? obj.agent : [])) {
				this.agent.push(new AuditEventAgent(o));
			}
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('entity')) {
			this.entity = [];
			for (const o of (obj.entity instanceof Array ? obj.entity : [])) {
				this.entity.push(new AuditEventEntity(o));
			}
		}

	}

  resourceType = 'AuditEvent';
  type: Coding;
  subtype?: Coding[];
  action?: AuditEventAction1;
  period?: Period;
  recorded: string;
  outcome?: AuditEventOutcome1;
  outcomeDesc?: string;
  purposeOfEvent?: CodeableConcept[];
  agent: AuditEventAgent[];
  source: AuditEventSource;
  entity?: AuditEventEntity[];
}

export class Basic extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

	}

  resourceType = 'Basic';
  identifier?: Identifier[];
  code: CodeableConcept;
  subject?: Reference;
  created?: string;
  author?: Reference;
}

export class Binary extends Resource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('contentType')) {
			this.contentType = obj.contentType;
		}

		if (obj.hasOwnProperty('securityContext')) {
			this.securityContext = obj.securityContext;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = obj.data;
		}

	}

  resourceType = 'Binary';
  contentType: string;
  securityContext?: Reference;
  data?: string;
}

export class BiologicallyDerivedProductStorage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('temperature')) {
			this.temperature = obj.temperature;
		}

		if (obj.hasOwnProperty('scale')) {
			this.scale = obj.scale;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

	}

  description?: string;
  temperature?: number;
  scale?: BiologicallyDerivedProductScale1;
  duration?: Period;
}

export class BiologicallyDerivedProductManipulation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('timeDateTime')) {
			this.timeDateTime = obj.timeDateTime;
		}

		if (obj.hasOwnProperty('timePeriod')) {
			this.timePeriod = obj.timePeriod;
		}

	}

  description?: string;
  timeDateTime?: string;
  timePeriod?: Period;
}

export class BiologicallyDerivedProductProcessing extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('procedure')) {
			this.procedure = obj.procedure;
		}

		if (obj.hasOwnProperty('additive')) {
			this.additive = obj.additive;
		}

		if (obj.hasOwnProperty('timeDateTime')) {
			this.timeDateTime = obj.timeDateTime;
		}

		if (obj.hasOwnProperty('timePeriod')) {
			this.timePeriod = obj.timePeriod;
		}

	}

  description?: string;
  procedure?: CodeableConcept;
  additive?: Reference;
  timeDateTime?: string;
  timePeriod?: Period;
}

export class BiologicallyDerivedProductCollection extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('collector')) {
			this.collector = obj.collector;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('collectedDateTime')) {
			this.collectedDateTime = obj.collectedDateTime;
		}

		if (obj.hasOwnProperty('collectedPeriod')) {
			this.collectedPeriod = obj.collectedPeriod;
		}

	}

  collector?: Reference;
  source?: Reference;
  collectedDateTime?: string;
  collectedPeriod?: Period;
}

export class BiologicallyDerivedProduct extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('productCategory')) {
			this.productCategory = obj.productCategory;
		}

		if (obj.hasOwnProperty('productCode')) {
			this.productCode = obj.productCode;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = [];
			for (const o of (obj.request instanceof Array ? obj.request : [])) {
				this.request.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = [];
			for (const o of (obj.parent instanceof Array ? obj.parent : [])) {
				this.parent.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('collection')) {
			this.collection = obj.collection;
		}

		if (obj.hasOwnProperty('processing')) {
			this.processing = [];
			for (const o of (obj.processing instanceof Array ? obj.processing : [])) {
				this.processing.push(new BiologicallyDerivedProductProcessing(o));
			}
		}

		if (obj.hasOwnProperty('manipulation')) {
			this.manipulation = obj.manipulation;
		}

		if (obj.hasOwnProperty('storage')) {
			this.storage = [];
			for (const o of (obj.storage instanceof Array ? obj.storage : [])) {
				this.storage.push(new BiologicallyDerivedProductStorage(o));
			}
		}

	}

  resourceType = 'BiologicallyDerivedProduct';
  identifier?: Identifier[];
  productCategory?: BiologicallyDerivedProductProductCategory1;
  productCode?: CodeableConcept;
  status?: BiologicallyDerivedProductStatus1;
  request?: Reference[];
  quantity?: number;
  parent?: Reference[];
  collection?: BiologicallyDerivedProductCollection;
  processing?: BiologicallyDerivedProductProcessing[];
  manipulation?: BiologicallyDerivedProductManipulation;
  storage?: BiologicallyDerivedProductStorage[];
}

export class BodyStructure extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('morphology')) {
			this.morphology = obj.morphology;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('locationQualifier')) {
			this.locationQualifier = [];
			for (const o of (obj.locationQualifier instanceof Array ? obj.locationQualifier : [])) {
				this.locationQualifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('image')) {
			this.image = [];
			for (const o of (obj.image instanceof Array ? obj.image : [])) {
				this.image.push(new Attachment(o));
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

	}

  resourceType = 'BodyStructure';
  identifier?: Identifier[];
  active?: boolean;
  morphology?: CodeableConcept;
  location?: CodeableConcept;
  locationQualifier?: CodeableConcept[];
  description?: string;
  image?: Attachment[];
  patient: Reference;
}

export class BundleEntryResponse extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('etag')) {
			this.etag = obj.etag;
		}

		if (obj.hasOwnProperty('lastModified')) {
			this.lastModified = obj.lastModified;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

	}

  status: string;
  location?: string;
  etag?: string;
  lastModified?: string;
  outcome?: Resource;
}

export class BundleEntryRequest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('ifNoneMatch')) {
			this.ifNoneMatch = obj.ifNoneMatch;
		}

		if (obj.hasOwnProperty('ifModifiedSince')) {
			this.ifModifiedSince = obj.ifModifiedSince;
		}

		if (obj.hasOwnProperty('ifMatch')) {
			this.ifMatch = obj.ifMatch;
		}

		if (obj.hasOwnProperty('ifNoneExist')) {
			this.ifNoneExist = obj.ifNoneExist;
		}

	}

  method: BundleMethod1;
  url: string;
  ifNoneMatch?: string;
  ifModifiedSince?: string;
  ifMatch?: string;
  ifNoneExist?: string;
}

export class BundleEntrySearch extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('score')) {
			this.score = obj.score;
		}

	}

  mode?: BundleMode1;
  score?: number;
}

export class BundleEntry implements IFhir.IBundleEntry {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new BundleLink(o));
			}
		}

		if (obj.hasOwnProperty('fullUrl')) {
			this.fullUrl = obj.fullUrl;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('search')) {
			this.search = obj.search;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

	}

  link?: BundleLink[];
  fullUrl?: string;
  resource?: DomainResource;
  search?: BundleEntrySearch;
  request?: BundleEntryRequest;
  response?: BundleEntryResponse;
}

export class BundleLink extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relation')) {
			this.relation = obj.relation;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

	}

  relation: string;
  url: string;
}

export class Bundle extends Resource implements IFhir.IBundle {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('timestamp')) {
			this.timestamp = obj.timestamp;
		}

		if (obj.hasOwnProperty('total')) {
			this.total = obj.total;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new BundleLink(o));
			}
		}

		if (obj.hasOwnProperty('entry')) {
			this.entry = [];
			for (const o of (obj.entry instanceof Array ? obj.entry : [])) {
				this.entry.push(new BundleEntry(o));
			}
		}

		if (obj.hasOwnProperty('signature')) {
			this.signature = obj.signature;
		}

	}

  resourceType = 'Bundle';
  identifier?: Identifier;
  type: BundleType1;
  timestamp?: string;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry[];
  signature?: Signature;
}

export class CapabilityStatementDocument extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

	}

  mode: CapabilityStatementMode3;
  documentation?: string;
  profile: string;
}

export class CapabilityStatementMessagingSupportedMessage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

	}

  mode: CapabilityStatementMode2;
  definition: string;
}

export class CapabilityStatementMessagingEndpoint extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('protocol')) {
			this.protocol = obj.protocol;
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

	}

  protocol: Coding;
  address: string;
}

export class CapabilityStatementMessaging extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new CapabilityStatementMessagingEndpoint(o));
			}
		}

		if (obj.hasOwnProperty('reliableCache')) {
			this.reliableCache = obj.reliableCache;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('supportedMessage')) {
			this.supportedMessage = [];
			for (const o of (obj.supportedMessage instanceof Array ? obj.supportedMessage : [])) {
				this.supportedMessage.push(new CapabilityStatementMessagingSupportedMessage(o));
			}
		}

	}

  endpoint?: CapabilityStatementMessagingEndpoint[];
  reliableCache?: number;
  documentation?: string;
  supportedMessage?: CapabilityStatementMessagingSupportedMessage[];
}

export class CapabilityStatementRestInteraction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  code: CapabilityStatementCode2;
  documentation?: string;
}

export class CapabilityStatementRestResourceOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  name: string;
  definition: string;
  documentation?: string;
}

export class CapabilityStatementRestResourceSearchParam extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  name: string;
  definition?: string;
  type: CapabilityStatementType2;
  documentation?: string;
}

export class CapabilityStatementRestResourceInteraction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  code: CapabilityStatementCode1;
  documentation?: string;
}

export class CapabilityStatementRestResource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

		if (obj.hasOwnProperty('supportedProfile')) {
			this.supportedProfile = [];
			for (const o of (obj.supportedProfile instanceof Array ? obj.supportedProfile : [])) {
				this.supportedProfile.push(o);
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('interaction')) {
			this.interaction = [];
			for (const o of (obj.interaction instanceof Array ? obj.interaction : [])) {
				this.interaction.push(new CapabilityStatementRestResourceInteraction(o));
			}
		}

		if (obj.hasOwnProperty('versioning')) {
			this.versioning = obj.versioning;
		}

		if (obj.hasOwnProperty('readHistory')) {
			this.readHistory = obj.readHistory;
		}

		if (obj.hasOwnProperty('updateCreate')) {
			this.updateCreate = obj.updateCreate;
		}

		if (obj.hasOwnProperty('conditionalCreate')) {
			this.conditionalCreate = obj.conditionalCreate;
		}

		if (obj.hasOwnProperty('conditionalRead')) {
			this.conditionalRead = obj.conditionalRead;
		}

		if (obj.hasOwnProperty('conditionalUpdate')) {
			this.conditionalUpdate = obj.conditionalUpdate;
		}

		if (obj.hasOwnProperty('conditionalDelete')) {
			this.conditionalDelete = obj.conditionalDelete;
		}

		if (obj.hasOwnProperty('referencePolicy')) {
			this.referencePolicy = [];
			for (const o of (obj.referencePolicy instanceof Array ? obj.referencePolicy : [])) {
				this.referencePolicy.push(o);
			}
		}

		if (obj.hasOwnProperty('searchInclude')) {
			this.searchInclude = [];
			for (const o of (obj.searchInclude instanceof Array ? obj.searchInclude : [])) {
				this.searchInclude.push(o);
			}
		}

		if (obj.hasOwnProperty('searchRevInclude')) {
			this.searchRevInclude = [];
			for (const o of (obj.searchRevInclude instanceof Array ? obj.searchRevInclude : [])) {
				this.searchRevInclude.push(o);
			}
		}

		if (obj.hasOwnProperty('searchParam')) {
			this.searchParam = [];
			for (const o of (obj.searchParam instanceof Array ? obj.searchParam : [])) {
				this.searchParam.push(new CapabilityStatementRestResourceSearchParam(o));
			}
		}

		if (obj.hasOwnProperty('operation')) {
			this.operation = [];
			for (const o of (obj.operation instanceof Array ? obj.operation : [])) {
				this.operation.push(new CapabilityStatementRestResourceOperation(o));
			}
		}

	}

  type: CapabilityStatementType1;
  profile?: string;
  supportedProfile?: string[];
  documentation?: string;
  interaction?: CapabilityStatementRestResourceInteraction[];
  versioning?: CapabilityStatementVersioning1;
  readHistory?: boolean;
  updateCreate?: boolean;
  conditionalCreate?: boolean;
  conditionalRead?: CapabilityStatementConditionalRead1;
  conditionalUpdate?: boolean;
  conditionalDelete?: CapabilityStatementConditionalDelete1;
  referencePolicy?: CapabilityStatementReferencePolicy1[];
  searchInclude?: string[];
  searchRevInclude?: string[];
  searchParam?: CapabilityStatementRestResourceSearchParam[];
  operation?: CapabilityStatementRestResourceOperation[];
}

export class CapabilityStatementRestSecurity extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('cors')) {
			this.cors = obj.cors;
		}

		if (obj.hasOwnProperty('service')) {
			this.service = [];
			for (const o of (obj.service instanceof Array ? obj.service : [])) {
				this.service.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  cors?: boolean;
  service?: CodeableConcept[];
  description?: string;
}

export class CapabilityStatementRest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('security')) {
			this.security = obj.security;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = [];
			for (const o of (obj.resource instanceof Array ? obj.resource : [])) {
				this.resource.push(new CapabilityStatementRestResource(o));
			}
		}

		if (obj.hasOwnProperty('interaction')) {
			this.interaction = [];
			for (const o of (obj.interaction instanceof Array ? obj.interaction : [])) {
				this.interaction.push(new CapabilityStatementRestInteraction(o));
			}
		}

		if (obj.hasOwnProperty('searchParam')) {
			this.searchParam = [];
			for (const o of (obj.searchParam instanceof Array ? obj.searchParam : [])) {
				this.searchParam.push(new CapabilityStatementRestResourceSearchParam(o));
			}
		}

		if (obj.hasOwnProperty('operation')) {
			this.operation = [];
			for (const o of (obj.operation instanceof Array ? obj.operation : [])) {
				this.operation.push(new CapabilityStatementRestResourceOperation(o));
			}
		}

		if (obj.hasOwnProperty('compartment')) {
			this.compartment = [];
			for (const o of (obj.compartment instanceof Array ? obj.compartment : [])) {
				this.compartment.push(o);
			}
		}

	}

  mode: CapabilityStatementMode1;
  documentation?: string;
  security?: CapabilityStatementRestSecurity;
  resource?: CapabilityStatementRestResource[];
  interaction?: CapabilityStatementRestInteraction[];
  searchParam?: CapabilityStatementRestResourceSearchParam[];
  operation?: CapabilityStatementRestResourceOperation[];
  compartment?: string[];
}

export class CapabilityStatementImplementation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('custodian')) {
			this.custodian = obj.custodian;
		}

	}

  description: string;
  url?: string;
  custodian?: Reference;
}

export class CapabilityStatementSoftware extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('releaseDate')) {
			this.releaseDate = obj.releaseDate;
		}

	}

  name: string;
  version?: string;
  releaseDate?: string;
}

export class CapabilityStatement extends DomainResource implements IFhir.ICapabilityStatement {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('instantiates')) {
			this.instantiates = [];
			for (const o of (obj.instantiates instanceof Array ? obj.instantiates : [])) {
				this.instantiates.push(o);
			}
		}

		if (obj.hasOwnProperty('imports')) {
			this.imports = [];
			for (const o of (obj.imports instanceof Array ? obj.imports : [])) {
				this.imports.push(o);
			}
		}

		if (obj.hasOwnProperty('software')) {
			this.software = obj.software;
		}

		if (obj.hasOwnProperty('implementation')) {
			this.implementation = obj.implementation;
		}

		if (obj.hasOwnProperty('fhirVersion')) {
			this.fhirVersion = obj.fhirVersion;
		}

		if (obj.hasOwnProperty('format')) {
			this.format = [];
			for (const o of (obj.format instanceof Array ? obj.format : [])) {
				this.format.push(o);
			}
		}

		if (obj.hasOwnProperty('patchFormat')) {
			this.patchFormat = [];
			for (const o of (obj.patchFormat instanceof Array ? obj.patchFormat : [])) {
				this.patchFormat.push(o);
			}
		}

		if (obj.hasOwnProperty('implementationGuide')) {
			this.implementationGuide = [];
			for (const o of (obj.implementationGuide instanceof Array ? obj.implementationGuide : [])) {
				this.implementationGuide.push(o);
			}
		}

		if (obj.hasOwnProperty('rest')) {
			this.rest = [];
			for (const o of (obj.rest instanceof Array ? obj.rest : [])) {
				this.rest.push(new CapabilityStatementRest(o));
			}
		}

		if (obj.hasOwnProperty('messaging')) {
			this.messaging = [];
			for (const o of (obj.messaging instanceof Array ? obj.messaging : [])) {
				this.messaging.push(new CapabilityStatementMessaging(o));
			}
		}

		if (obj.hasOwnProperty('document')) {
			this.document = [];
			for (const o of (obj.document instanceof Array ? obj.document : [])) {
				this.document.push(new CapabilityStatementDocument(o));
			}
		}

	}

  resourceType = 'CapabilityStatement';
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status: CapabilityStatementStatus1;
  experimental?: boolean;
  date: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  kind: CapabilityStatementKind1;
  instantiates?: string[];
  imports?: string[];
  software?: CapabilityStatementSoftware;
  implementation?: CapabilityStatementImplementation;
  fhirVersion: CapabilityStatementFhirVersion1;
  format: string[];
  patchFormat?: string[];
  implementationGuide?: string[];
  rest?: CapabilityStatementRest[];
  messaging?: CapabilityStatementMessaging[];
  document?: CapabilityStatementDocument[];
}

export class CarePlanActivityDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('goal')) {
			this.goal = [];
			for (const o of (obj.goal instanceof Array ? obj.goal : [])) {
				this.goal.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('scheduledTiming')) {
			this.scheduledTiming = obj.scheduledTiming;
		}

		if (obj.hasOwnProperty('scheduledPeriod')) {
			this.scheduledPeriod = obj.scheduledPeriod;
		}

		if (obj.hasOwnProperty('scheduledString')) {
			this.scheduledString = obj.scheduledString;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('productCodeableConcept')) {
			this.productCodeableConcept = obj.productCodeableConcept;
		}

		if (obj.hasOwnProperty('productReference')) {
			this.productReference = obj.productReference;
		}

		if (obj.hasOwnProperty('dailyAmount')) {
			this.dailyAmount = obj.dailyAmount;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  kind?: CarePlanKind1;
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  code?: CodeableConcept;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  goal?: Reference[];
  status: CarePlanStatus2;
  statusReason?: CodeableConcept;
  doNotPerform?: boolean;
  scheduledTiming?: Timing;
  scheduledPeriod?: Period;
  scheduledString?: string;
  location?: Reference;
  performer?: Reference[];
  productCodeableConcept?: CodeableConcept;
  productReference?: Reference;
  dailyAmount?: Quantity;
  quantity?: Quantity;
  description?: string;
}

export class CarePlanActivity extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('outcomeCodeableConcept')) {
			this.outcomeCodeableConcept = [];
			for (const o of (obj.outcomeCodeableConcept instanceof Array ? obj.outcomeCodeableConcept : [])) {
				this.outcomeCodeableConcept.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('outcomeReference')) {
			this.outcomeReference = [];
			for (const o of (obj.outcomeReference instanceof Array ? obj.outcomeReference : [])) {
				this.outcomeReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('progress')) {
			this.progress = [];
			for (const o of (obj.progress instanceof Array ? obj.progress : [])) {
				this.progress.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = obj.detail;
		}

	}

  outcomeCodeableConcept?: CodeableConcept[];
  outcomeReference?: Reference[];
  progress?: Annotation[];
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}

export class CarePlan extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('contributor')) {
			this.contributor = [];
			for (const o of (obj.contributor instanceof Array ? obj.contributor : [])) {
				this.contributor.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('careTeam')) {
			this.careTeam = [];
			for (const o of (obj.careTeam instanceof Array ? obj.careTeam : [])) {
				this.careTeam.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('addresses')) {
			this.addresses = [];
			for (const o of (obj.addresses instanceof Array ? obj.addresses : [])) {
				this.addresses.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('goal')) {
			this.goal = [];
			for (const o of (obj.goal instanceof Array ? obj.goal : [])) {
				this.goal.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('activity')) {
			this.activity = [];
			for (const o of (obj.activity instanceof Array ? obj.activity : [])) {
				this.activity.push(new CarePlanActivity(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'CarePlan';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  partOf?: Reference[];
  status: CarePlanStatus1;
  intent: CarePlanIntent1;
  category?: CodeableConcept[];
  title?: string;
  description?: string;
  subject: Reference;
  encounter?: Reference;
  period?: Period;
  created?: string;
  author?: Reference;
  contributor?: Reference[];
  careTeam?: Reference[];
  addresses?: Reference[];
  supportingInfo?: Reference[];
  goal?: Reference[];
  activity?: CarePlanActivity[];
  note?: Annotation[];
}

export class CareTeamParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = [];
			for (const o of (obj.role instanceof Array ? obj.role : [])) {
				this.role.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('member')) {
			this.member = obj.member;
		}

		if (obj.hasOwnProperty('onBehalfOf')) {
			this.onBehalfOf = obj.onBehalfOf;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  role?: CodeableConcept[];
  member?: Reference;
  onBehalfOf?: Reference;
  period?: Period;
}

export class CareTeam extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new CareTeamParticipant(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = [];
			for (const o of (obj.managingOrganization instanceof Array ? obj.managingOrganization : [])) {
				this.managingOrganization.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'CareTeam';
  identifier?: Identifier[];
  status?: CareTeamStatus1;
  category?: CodeableConcept[];
  name?: string;
  subject?: Reference;
  encounter?: Reference;
  period?: Period;
  participant?: CareTeamParticipant[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  managingOrganization?: Reference[];
  telecom?: ContactPoint[];
  note?: Annotation[];
}

export class CatalogEntryRelatedEntry extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relationtype')) {
			this.relationtype = obj.relationtype;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = obj.item;
		}

	}

  relationtype: CatalogEntryRelationtype1;
  item: Reference;
}

export class CatalogEntry extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('orderable')) {
			this.orderable = obj.orderable;
		}

		if (obj.hasOwnProperty('referencedItem')) {
			this.referencedItem = obj.referencedItem;
		}

		if (obj.hasOwnProperty('additionalIdentifier')) {
			this.additionalIdentifier = [];
			for (const o of (obj.additionalIdentifier instanceof Array ? obj.additionalIdentifier : [])) {
				this.additionalIdentifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('validityPeriod')) {
			this.validityPeriod = obj.validityPeriod;
		}

		if (obj.hasOwnProperty('validTo')) {
			this.validTo = obj.validTo;
		}

		if (obj.hasOwnProperty('lastUpdated')) {
			this.lastUpdated = obj.lastUpdated;
		}

		if (obj.hasOwnProperty('additionalCharacteristic')) {
			this.additionalCharacteristic = [];
			for (const o of (obj.additionalCharacteristic instanceof Array ? obj.additionalCharacteristic : [])) {
				this.additionalCharacteristic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('additionalClassification')) {
			this.additionalClassification = [];
			for (const o of (obj.additionalClassification instanceof Array ? obj.additionalClassification : [])) {
				this.additionalClassification.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('relatedEntry')) {
			this.relatedEntry = [];
			for (const o of (obj.relatedEntry instanceof Array ? obj.relatedEntry : [])) {
				this.relatedEntry.push(new CatalogEntryRelatedEntry(o));
			}
		}

	}

  resourceType = 'CatalogEntry';
  identifier?: Identifier[];
  type?: CodeableConcept;
  orderable: boolean;
  referencedItem: Reference;
  additionalIdentifier?: Identifier[];
  classification?: CodeableConcept[];
  status?: CatalogEntryStatus1;
  validityPeriod?: Period;
  validTo?: string;
  lastUpdated?: string;
  additionalCharacteristic?: CodeableConcept[];
  additionalClassification?: CodeableConcept[];
  relatedEntry?: CatalogEntryRelatedEntry[];
}

export class ChargeItemPerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
}

export class ChargeItem extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('definitionUri')) {
			this.definitionUri = [];
			for (const o of (obj.definitionUri instanceof Array ? obj.definitionUri : [])) {
				this.definitionUri.push(o);
			}
		}

		if (obj.hasOwnProperty('definitionCanonical')) {
			this.definitionCanonical = [];
			for (const o of (obj.definitionCanonical instanceof Array ? obj.definitionCanonical : [])) {
				this.definitionCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new ChargeItemPerformer(o));
			}
		}

		if (obj.hasOwnProperty('performingOrganization')) {
			this.performingOrganization = obj.performingOrganization;
		}

		if (obj.hasOwnProperty('requestingOrganization')) {
			this.requestingOrganization = obj.requestingOrganization;
		}

		if (obj.hasOwnProperty('costCenter')) {
			this.costCenter = obj.costCenter;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('bodysite')) {
			this.bodysite = [];
			for (const o of (obj.bodysite instanceof Array ? obj.bodysite : [])) {
				this.bodysite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('factorOverride')) {
			this.factorOverride = obj.factorOverride;
		}

		if (obj.hasOwnProperty('priceOverride')) {
			this.priceOverride = obj.priceOverride;
		}

		if (obj.hasOwnProperty('overrideReason')) {
			this.overrideReason = obj.overrideReason;
		}

		if (obj.hasOwnProperty('enterer')) {
			this.enterer = obj.enterer;
		}

		if (obj.hasOwnProperty('enteredDate')) {
			this.enteredDate = obj.enteredDate;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = [];
			for (const o of (obj.reason instanceof Array ? obj.reason : [])) {
				this.reason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('service')) {
			this.service = [];
			for (const o of (obj.service instanceof Array ? obj.service : [])) {
				this.service.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('productReference')) {
			this.productReference = obj.productReference;
		}

		if (obj.hasOwnProperty('productCodeableConcept')) {
			this.productCodeableConcept = obj.productCodeableConcept;
		}

		if (obj.hasOwnProperty('account')) {
			this.account = [];
			for (const o of (obj.account instanceof Array ? obj.account : [])) {
				this.account.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = [];
			for (const o of (obj.supportingInformation instanceof Array ? obj.supportingInformation : [])) {
				this.supportingInformation.push(new Reference(o));
			}
		}

	}

  resourceType = 'ChargeItem';
  identifier?: Identifier[];
  definitionUri?: string[];
  definitionCanonical?: string[];
  status: ChargeItemStatus1;
  partOf?: Reference[];
  code: CodeableConcept;
  subject: Reference;
  context?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  performer?: ChargeItemPerformer[];
  performingOrganization?: Reference;
  requestingOrganization?: Reference;
  costCenter?: Reference;
  quantity?: Quantity;
  bodysite?: CodeableConcept[];
  factorOverride?: number;
  priceOverride?: Money;
  overrideReason?: string;
  enterer?: Reference;
  enteredDate?: string;
  reason?: CodeableConcept[];
  service?: Reference[];
  productReference?: Reference;
  productCodeableConcept?: CodeableConcept;
  account?: Reference[];
  note?: Annotation[];
  supportingInformation?: Reference[];
}

export class ChargeItemDefinitionPropertyGroupPriceComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  type: ChargeItemDefinitionType1;
  code?: CodeableConcept;
  factor?: number;
  amount?: Money;
}

export class ChargeItemDefinitionPropertyGroup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('applicability')) {
			this.applicability = [];
			for (const o of (obj.applicability instanceof Array ? obj.applicability : [])) {
				this.applicability.push(new ChargeItemDefinitionApplicability(o));
			}
		}

		if (obj.hasOwnProperty('priceComponent')) {
			this.priceComponent = [];
			for (const o of (obj.priceComponent instanceof Array ? obj.priceComponent : [])) {
				this.priceComponent.push(new ChargeItemDefinitionPropertyGroupPriceComponent(o));
			}
		}

	}

  applicability?: ChargeItemDefinitionApplicability[];
  priceComponent?: ChargeItemDefinitionPropertyGroupPriceComponent[];
}

export class ChargeItemDefinitionApplicability extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  description?: string;
  language?: string;
  expression?: string;
}

export class ChargeItemDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('derivedFromUri')) {
			this.derivedFromUri = [];
			for (const o of (obj.derivedFromUri instanceof Array ? obj.derivedFromUri : [])) {
				this.derivedFromUri.push(o);
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(o);
			}
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = [];
			for (const o of (obj.instance instanceof Array ? obj.instance : [])) {
				this.instance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('applicability')) {
			this.applicability = [];
			for (const o of (obj.applicability instanceof Array ? obj.applicability : [])) {
				this.applicability.push(new ChargeItemDefinitionApplicability(o));
			}
		}

		if (obj.hasOwnProperty('propertyGroup')) {
			this.propertyGroup = [];
			for (const o of (obj.propertyGroup instanceof Array ? obj.propertyGroup : [])) {
				this.propertyGroup.push(new ChargeItemDefinitionPropertyGroup(o));
			}
		}

	}

  resourceType = 'ChargeItemDefinition';
  url: string;
  identifier?: Identifier[];
  version?: string;
  title?: string;
  derivedFromUri?: string[];
  partOf?: string[];
  replaces?: string[];
  status: ChargeItemDefinitionStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  code?: CodeableConcept;
  instance?: Reference[];
  applicability?: ChargeItemDefinitionApplicability[];
  propertyGroup?: ChargeItemDefinitionPropertyGroup[];
}

export class CitationCitedArtifactContributorshipSummary extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('style')) {
			this.style = obj.style;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  type?: CodeableConcept;
  style?: CodeableConcept;
  source?: CodeableConcept;
  value: string;
}

export class CitationCitedArtifactContributorshipEntryContributionInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('time')) {
			this.time = obj.time;
		}

	}

  type: CodeableConcept;
  time?: string;
}

export class CitationCitedArtifactContributorshipEntryAffiliationInfo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('affiliation')) {
			this.affiliation = obj.affiliation;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

	}

  affiliation?: string;
  role?: string;
  identifier?: Identifier[];
}

export class CitationCitedArtifactContributorshipEntry extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('initials')) {
			this.initials = obj.initials;
		}

		if (obj.hasOwnProperty('collectiveName')) {
			this.collectiveName = obj.collectiveName;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('affiliationInfo')) {
			this.affiliationInfo = [];
			for (const o of (obj.affiliationInfo instanceof Array ? obj.affiliationInfo : [])) {
				this.affiliationInfo.push(new CitationCitedArtifactContributorshipEntryAffiliationInfo(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('contributionType')) {
			this.contributionType = [];
			for (const o of (obj.contributionType instanceof Array ? obj.contributionType : [])) {
				this.contributionType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('contributionInstance')) {
			this.contributionInstance = [];
			for (const o of (obj.contributionInstance instanceof Array ? obj.contributionInstance : [])) {
				this.contributionInstance.push(new CitationCitedArtifactContributorshipEntryContributionInstance(o));
			}
		}

		if (obj.hasOwnProperty('correspondingContact')) {
			this.correspondingContact = obj.correspondingContact;
		}

		if (obj.hasOwnProperty('listOrder')) {
			this.listOrder = obj.listOrder;
		}

	}

  name?: HumanName;
  initials?: string;
  collectiveName?: string;
  identifier?: Identifier[];
  affiliationInfo?: CitationCitedArtifactContributorshipEntryAffiliationInfo[];
  address?: Address[];
  telecom?: ContactPoint[];
  contributionType?: CodeableConcept[];
  role?: CodeableConcept;
  contributionInstance?: CitationCitedArtifactContributorshipEntryContributionInstance[];
  correspondingContact?: boolean;
  listOrder?: number;
}

export class CitationCitedArtifactContributorship extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('complete')) {
			this.complete = obj.complete;
		}

		if (obj.hasOwnProperty('entry')) {
			this.entry = [];
			for (const o of (obj.entry instanceof Array ? obj.entry : [])) {
				this.entry.push(new CitationCitedArtifactContributorshipEntry(o));
			}
		}

		if (obj.hasOwnProperty('summary')) {
			this.summary = [];
			for (const o of (obj.summary instanceof Array ? obj.summary : [])) {
				this.summary.push(new CitationCitedArtifactContributorshipSummary(o));
			}
		}

	}

  complete?: boolean;
  entry?: CitationCitedArtifactContributorshipEntry[];
  summary?: CitationCitedArtifactContributorshipSummary[];
}

export class CitationCitedArtifactClassificationWhoClassified extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('person')) {
			this.person = obj.person;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('classifierCopyright')) {
			this.classifierCopyright = obj.classifierCopyright;
		}

		if (obj.hasOwnProperty('freeToShare')) {
			this.freeToShare = obj.freeToShare;
		}

	}

  person?: Reference;
  organization?: Reference;
  publisher?: Reference;
  classifierCopyright?: string;
  freeToShare?: boolean;
}

export class CitationCitedArtifactClassification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('classifier')) {
			this.classifier = [];
			for (const o of (obj.classifier instanceof Array ? obj.classifier : [])) {
				this.classifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('whoClassified')) {
			this.whoClassified = obj.whoClassified;
		}

	}

  type?: CodeableConcept;
  classifier?: CodeableConcept[];
  whoClassified?: CitationCitedArtifactClassificationWhoClassified;
}

export class CitationCitedArtifactWebLocation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

	}

  type?: CodeableConcept;
  url?: string;
}

export class CitationCitedArtifactPublicationFormPeriodicReleaseDateOfPublication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('year')) {
			this.year = obj.year;
		}

		if (obj.hasOwnProperty('month')) {
			this.month = obj.month;
		}

		if (obj.hasOwnProperty('day')) {
			this.day = obj.day;
		}

		if (obj.hasOwnProperty('season')) {
			this.season = obj.season;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  date?: string;
  year?: string;
  month?: string;
  day?: string;
  season?: string;
  text?: string;
}

export class CitationCitedArtifactPublicationFormPeriodicRelease extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('citedMedium')) {
			this.citedMedium = obj.citedMedium;
		}

		if (obj.hasOwnProperty('volume')) {
			this.volume = obj.volume;
		}

		if (obj.hasOwnProperty('issue')) {
			this.issue = obj.issue;
		}

		if (obj.hasOwnProperty('dateOfPublication')) {
			this.dateOfPublication = obj.dateOfPublication;
		}

	}

  citedMedium?: CodeableConcept;
  volume?: string;
  issue?: string;
  dateOfPublication?: CitationCitedArtifactPublicationFormPeriodicReleaseDateOfPublication;
}

export class CitationCitedArtifactPublicationFormPublishedIn extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('publisherLocation')) {
			this.publisherLocation = obj.publisherLocation;
		}

	}

  type?: CodeableConcept;
  identifier?: Identifier[];
  title?: string;
  publisher?: Reference;
  publisherLocation?: string;
}

export class CitationCitedArtifactPublicationForm extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('publishedIn')) {
			this.publishedIn = obj.publishedIn;
		}

		if (obj.hasOwnProperty('periodicRelease')) {
			this.periodicRelease = obj.periodicRelease;
		}

		if (obj.hasOwnProperty('articleDate')) {
			this.articleDate = obj.articleDate;
		}

		if (obj.hasOwnProperty('lastRevisionDate')) {
			this.lastRevisionDate = obj.lastRevisionDate;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = [];
			for (const o of (obj.language instanceof Array ? obj.language : [])) {
				this.language.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('accessionNumber')) {
			this.accessionNumber = obj.accessionNumber;
		}

		if (obj.hasOwnProperty('pageString')) {
			this.pageString = obj.pageString;
		}

		if (obj.hasOwnProperty('firstPage')) {
			this.firstPage = obj.firstPage;
		}

		if (obj.hasOwnProperty('lastPage')) {
			this.lastPage = obj.lastPage;
		}

		if (obj.hasOwnProperty('pageCount')) {
			this.pageCount = obj.pageCount;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

	}

  publishedIn?: CitationCitedArtifactPublicationFormPublishedIn;
  periodicRelease?: CitationCitedArtifactPublicationFormPeriodicRelease;
  articleDate?: string;
  lastRevisionDate?: string;
  language?: CodeableConcept[];
  accessionNumber?: string;
  pageString?: string;
  firstPage?: string;
  lastPage?: string;
  pageCount?: string;
  copyright?: string;
}

export class CitationCitedArtifactRelatesTo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relationshipType')) {
			this.relationshipType = obj.relationshipType;
		}

		if (obj.hasOwnProperty('targetClassifier')) {
			this.targetClassifier = [];
			for (const o of (obj.targetClassifier instanceof Array ? obj.targetClassifier : [])) {
				this.targetClassifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('targetUri')) {
			this.targetUri = obj.targetUri;
		}

		if (obj.hasOwnProperty('targetIdentifier')) {
			this.targetIdentifier = obj.targetIdentifier;
		}

		if (obj.hasOwnProperty('targetReference')) {
			this.targetReference = obj.targetReference;
		}

		if (obj.hasOwnProperty('targetAttachment')) {
			this.targetAttachment = obj.targetAttachment;
		}

	}

  relationshipType: CodeableConcept;
  targetClassifier?: CodeableConcept[];
  targetUri?: string;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
  targetAttachment?: Attachment;
}

export class CitationCitedArtifactPart extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('baseCitation')) {
			this.baseCitation = obj.baseCitation;
		}

	}

  type?: CodeableConcept;
  value?: string;
  baseCitation?: Reference;
}

export class CitationCitedArtifactAbstract extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

	}

  type?: CodeableConcept;
  language?: CodeableConcept;
  text: string;
  copyright?: string;
}

export class CitationCitedArtifactTitle extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  type?: CodeableConcept[];
  language?: CodeableConcept;
  text: string;
}

export class CitationCitedArtifactStatusDate extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('activity')) {
			this.activity = obj.activity;
		}

		if (obj.hasOwnProperty('actual')) {
			this.actual = obj.actual;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  activity: CodeableConcept;
  actual?: boolean;
  period: Period;
}

export class CitationCitedArtifactVersion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('baseCitation')) {
			this.baseCitation = obj.baseCitation;
		}

	}

  value: string;
  baseCitation?: Reference;
}

export class CitationCitedArtifact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('relatedIdentifier')) {
			this.relatedIdentifier = [];
			for (const o of (obj.relatedIdentifier instanceof Array ? obj.relatedIdentifier : [])) {
				this.relatedIdentifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('dateAccessed')) {
			this.dateAccessed = obj.dateAccessed;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('currentState')) {
			this.currentState = [];
			for (const o of (obj.currentState instanceof Array ? obj.currentState : [])) {
				this.currentState.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = [];
			for (const o of (obj.statusDate instanceof Array ? obj.statusDate : [])) {
				this.statusDate.push(new CitationCitedArtifactStatusDate(o));
			}
		}

		if (obj.hasOwnProperty('title')) {
			this.title = [];
			for (const o of (obj.title instanceof Array ? obj.title : [])) {
				this.title.push(new CitationCitedArtifactTitle(o));
			}
		}

		if (obj.hasOwnProperty('abstract')) {
			this.abstract = [];
			for (const o of (obj.abstract instanceof Array ? obj.abstract : [])) {
				this.abstract.push(new CitationCitedArtifactAbstract(o));
			}
		}

		if (obj.hasOwnProperty('part')) {
			this.part = obj.part;
		}

		if (obj.hasOwnProperty('relatesTo')) {
			this.relatesTo = [];
			for (const o of (obj.relatesTo instanceof Array ? obj.relatesTo : [])) {
				this.relatesTo.push(new CitationCitedArtifactRelatesTo(o));
			}
		}

		if (obj.hasOwnProperty('publicationForm')) {
			this.publicationForm = [];
			for (const o of (obj.publicationForm instanceof Array ? obj.publicationForm : [])) {
				this.publicationForm.push(new CitationCitedArtifactPublicationForm(o));
			}
		}

		if (obj.hasOwnProperty('webLocation')) {
			this.webLocation = [];
			for (const o of (obj.webLocation instanceof Array ? obj.webLocation : [])) {
				this.webLocation.push(new CitationCitedArtifactWebLocation(o));
			}
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CitationCitedArtifactClassification(o));
			}
		}

		if (obj.hasOwnProperty('contributorship')) {
			this.contributorship = obj.contributorship;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  identifier?: Identifier[];
  relatedIdentifier?: Identifier[];
  dateAccessed?: string;
  version?: CitationCitedArtifactVersion;
  currentState?: CodeableConcept[];
  statusDate?: CitationCitedArtifactStatusDate[];
  title?: CitationCitedArtifactTitle[];
  abstract?: CitationCitedArtifactAbstract[];
  part?: CitationCitedArtifactPart;
  relatesTo?: CitationCitedArtifactRelatesTo[];
  publicationForm?: CitationCitedArtifactPublicationForm[];
  webLocation?: CitationCitedArtifactWebLocation[];
  classification?: CitationCitedArtifactClassification[];
  contributorship?: CitationCitedArtifactContributorship;
  note?: Annotation[];
}

export class CitationRelatesTo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relationshipType')) {
			this.relationshipType = obj.relationshipType;
		}

		if (obj.hasOwnProperty('targetClassifier')) {
			this.targetClassifier = [];
			for (const o of (obj.targetClassifier instanceof Array ? obj.targetClassifier : [])) {
				this.targetClassifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('targetUri')) {
			this.targetUri = obj.targetUri;
		}

		if (obj.hasOwnProperty('targetIdentifier')) {
			this.targetIdentifier = obj.targetIdentifier;
		}

		if (obj.hasOwnProperty('targetReference')) {
			this.targetReference = obj.targetReference;
		}

		if (obj.hasOwnProperty('targetAttachment')) {
			this.targetAttachment = obj.targetAttachment;
		}

	}

  relationshipType: CodeableConcept;
  targetClassifier?: CodeableConcept[];
  targetUri?: string;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
  targetAttachment?: Attachment;
}

export class CitationStatusDate extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('activity')) {
			this.activity = obj.activity;
		}

		if (obj.hasOwnProperty('actual')) {
			this.actual = obj.actual;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  activity: CodeableConcept;
  actual?: boolean;
  period: Period;
}

export class CitationClassification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('classifier')) {
			this.classifier = [];
			for (const o of (obj.classifier instanceof Array ? obj.classifier : [])) {
				this.classifier.push(new CodeableConcept(o));
			}
		}

	}

  type?: CodeableConcept;
  classifier?: CodeableConcept[];
}

export class CitationSummary extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('style')) {
			this.style = obj.style;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  style?: CodeableConcept;
  text: string;
}

export class Citation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('summary')) {
			this.summary = [];
			for (const o of (obj.summary instanceof Array ? obj.summary : [])) {
				this.summary.push(new CitationSummary(o));
			}
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CitationClassification(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('currentState')) {
			this.currentState = [];
			for (const o of (obj.currentState instanceof Array ? obj.currentState : [])) {
				this.currentState.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = [];
			for (const o of (obj.statusDate instanceof Array ? obj.statusDate : [])) {
				this.statusDate.push(new CitationStatusDate(o));
			}
		}

		if (obj.hasOwnProperty('relatesTo')) {
			this.relatesTo = [];
			for (const o of (obj.relatesTo instanceof Array ? obj.relatesTo : [])) {
				this.relatesTo.push(new CitationRelatesTo(o));
			}
		}

		if (obj.hasOwnProperty('citedArtifact')) {
			this.citedArtifact = obj.citedArtifact;
		}

	}

  resourceType = 'Citation';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  status: CitationStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  summary?: CitationSummary[];
  classification?: CitationClassification[];
  note?: Annotation[];
  currentState?: CodeableConcept[];
  statusDate?: CitationStatusDate[];
  relatesTo?: CitationRelatesTo[];
  citedArtifact?: CitationCitedArtifact;
}

export class ClaimItemDetailSubDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

	}

  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
}

export class ClaimItemDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('subDetail')) {
			this.subDetail = [];
			for (const o of (obj.subDetail instanceof Array ? obj.subDetail : [])) {
				this.subDetail.push(new ClaimItemDetailSubDetail(o));
			}
		}

	}

  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  subDetail?: ClaimItemDetailSubDetail[];
}

export class ClaimItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('careTeamSequence')) {
			this.careTeamSequence = [];
			for (const o of (obj.careTeamSequence instanceof Array ? obj.careTeamSequence : [])) {
				this.careTeamSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('diagnosisSequence')) {
			this.diagnosisSequence = [];
			for (const o of (obj.diagnosisSequence instanceof Array ? obj.diagnosisSequence : [])) {
				this.diagnosisSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('procedureSequence')) {
			this.procedureSequence = [];
			for (const o of (obj.procedureSequence instanceof Array ? obj.procedureSequence : [])) {
				this.procedureSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('informationSequence')) {
			this.informationSequence = [];
			for (const o of (obj.informationSequence instanceof Array ? obj.informationSequence : [])) {
				this.informationSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('locationCodeableConcept')) {
			this.locationCodeableConcept = obj.locationCodeableConcept;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('subSite')) {
			this.subSite = [];
			for (const o of (obj.subSite instanceof Array ? obj.subSite : [])) {
				this.subSite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = [];
			for (const o of (obj.encounter instanceof Array ? obj.encounter : [])) {
				this.encounter.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new ClaimItemDetail(o));
			}
		}

	}

  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  encounter?: Reference[];
  detail?: ClaimItemDetail[];
}

export class ClaimAccident extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

	}

  date: string;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}

export class ClaimInsurance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('focal')) {
			this.focal = obj.focal;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('businessArrangement')) {
			this.businessArrangement = obj.businessArrangement;
		}

		if (obj.hasOwnProperty('preAuthRef')) {
			this.preAuthRef = [];
			for (const o of (obj.preAuthRef instanceof Array ? obj.preAuthRef : [])) {
				this.preAuthRef.push(o);
			}
		}

		if (obj.hasOwnProperty('claimResponse')) {
			this.claimResponse = obj.claimResponse;
		}

	}

  sequence: number;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: string[];
  claimResponse?: Reference;
}

export class ClaimProcedure extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('procedureCodeableConcept')) {
			this.procedureCodeableConcept = obj.procedureCodeableConcept;
		}

		if (obj.hasOwnProperty('procedureReference')) {
			this.procedureReference = obj.procedureReference;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

	}

  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export class ClaimDiagnosis extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('diagnosisCodeableConcept')) {
			this.diagnosisCodeableConcept = obj.diagnosisCodeableConcept;
		}

		if (obj.hasOwnProperty('diagnosisReference')) {
			this.diagnosisReference = obj.diagnosisReference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('onAdmission')) {
			this.onAdmission = obj.onAdmission;
		}

		if (obj.hasOwnProperty('packageCode')) {
			this.packageCode = obj.packageCode;
		}

	}

  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export class ClaimSupportingInfo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('timingDate')) {
			this.timingDate = obj.timingDate;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

	}

  sequence: number;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: string;
  timingPeriod?: Period;
  valueBoolean?: boolean;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: Attachment;
  valueReference?: Reference;
  reason?: CodeableConcept;
}

export class ClaimCareTeam extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('qualification')) {
			this.qualification = obj.qualification;
		}

	}

  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export class ClaimPayee extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('party')) {
			this.party = obj.party;
		}

	}

  type: CodeableConcept;
  party?: Reference;
}

export class ClaimRelated extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('claim')) {
			this.claim = obj.claim;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}

export class Claim extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = obj.subType;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('billablePeriod')) {
			this.billablePeriod = obj.billablePeriod;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('enterer')) {
			this.enterer = obj.enterer;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('fundsReserve')) {
			this.fundsReserve = obj.fundsReserve;
		}

		if (obj.hasOwnProperty('related')) {
			this.related = [];
			for (const o of (obj.related instanceof Array ? obj.related : [])) {
				this.related.push(new ClaimRelated(o));
			}
		}

		if (obj.hasOwnProperty('prescription')) {
			this.prescription = obj.prescription;
		}

		if (obj.hasOwnProperty('originalPrescription')) {
			this.originalPrescription = obj.originalPrescription;
		}

		if (obj.hasOwnProperty('payee')) {
			this.payee = obj.payee;
		}

		if (obj.hasOwnProperty('referral')) {
			this.referral = obj.referral;
		}

		if (obj.hasOwnProperty('facility')) {
			this.facility = obj.facility;
		}

		if (obj.hasOwnProperty('careTeam')) {
			this.careTeam = [];
			for (const o of (obj.careTeam instanceof Array ? obj.careTeam : [])) {
				this.careTeam.push(new ClaimCareTeam(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new ClaimSupportingInfo(o));
			}
		}

		if (obj.hasOwnProperty('diagnosis')) {
			this.diagnosis = [];
			for (const o of (obj.diagnosis instanceof Array ? obj.diagnosis : [])) {
				this.diagnosis.push(new ClaimDiagnosis(o));
			}
		}

		if (obj.hasOwnProperty('procedure')) {
			this.procedure = [];
			for (const o of (obj.procedure instanceof Array ? obj.procedure : [])) {
				this.procedure.push(new ClaimProcedure(o));
			}
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new ClaimInsurance(o));
			}
		}

		if (obj.hasOwnProperty('accident')) {
			this.accident = obj.accident;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new ClaimItem(o));
			}
		}

		if (obj.hasOwnProperty('total')) {
			this.total = obj.total;
		}

	}

  resourceType = 'Claim';
  identifier?: Identifier[];
  status: ClaimStatus1;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: ClaimUse1;
  patient: Reference;
  billablePeriod?: Period;
  created: string;
  enterer?: Reference;
  insurer?: Reference;
  provider: Reference;
  priority: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: ClaimRelated[];
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ClaimPayee;
  referral?: Reference;
  facility?: Reference;
  careTeam?: ClaimCareTeam[];
  supportingInfo?: ClaimSupportingInfo[];
  diagnosis?: ClaimDiagnosis[];
  procedure?: ClaimProcedure[];
  insurance: ClaimInsurance[];
  accident?: ClaimAccident;
  item?: ClaimItem[];
  total?: Money;
}

export class ClaimResponseError extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemSequence')) {
			this.itemSequence = obj.itemSequence;
		}

		if (obj.hasOwnProperty('detailSequence')) {
			this.detailSequence = obj.detailSequence;
		}

		if (obj.hasOwnProperty('subDetailSequence')) {
			this.subDetailSequence = obj.subDetailSequence;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

	}

  itemSequence?: number;
  detailSequence?: number;
  subDetailSequence?: number;
  code: CodeableConcept;
}

export class ClaimResponseInsurance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('focal')) {
			this.focal = obj.focal;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('businessArrangement')) {
			this.businessArrangement = obj.businessArrangement;
		}

		if (obj.hasOwnProperty('claimResponse')) {
			this.claimResponse = obj.claimResponse;
		}

	}

  sequence: number;
  focal: boolean;
  coverage: Reference;
  businessArrangement?: string;
  claimResponse?: Reference;
}

export class ClaimResponseProcessNote extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('number')) {
			this.number = obj.number;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

	}

  number?: number;
  type?: ClaimResponseType1;
  text: string;
  language?: CodeableConcept;
}

export class ClaimResponsePayment extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('adjustment')) {
			this.adjustment = obj.adjustment;
		}

		if (obj.hasOwnProperty('adjustmentReason')) {
			this.adjustmentReason = obj.adjustmentReason;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

	}

  type: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: string;
  amount: Money;
  identifier?: Identifier;
}

export class ClaimResponseTotal extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  category: CodeableConcept;
  amount: Money;
}

export class ClaimResponseAddItemDetailSubDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

	}

  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
}

export class ClaimResponseAddItemDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('subDetail')) {
			this.subDetail = [];
			for (const o of (obj.subDetail instanceof Array ? obj.subDetail : [])) {
				this.subDetail.push(new ClaimResponseAddItemDetailSubDetail(o));
			}
		}

	}

  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  subDetail?: ClaimResponseAddItemDetailSubDetail[];
}

export class ClaimResponseAddItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemSequence')) {
			this.itemSequence = [];
			for (const o of (obj.itemSequence instanceof Array ? obj.itemSequence : [])) {
				this.itemSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('detailSequence')) {
			this.detailSequence = [];
			for (const o of (obj.detailSequence instanceof Array ? obj.detailSequence : [])) {
				this.detailSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('subdetailSequence')) {
			this.subdetailSequence = [];
			for (const o of (obj.subdetailSequence instanceof Array ? obj.subdetailSequence : [])) {
				this.subdetailSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = [];
			for (const o of (obj.provider instanceof Array ? obj.provider : [])) {
				this.provider.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('locationCodeableConcept')) {
			this.locationCodeableConcept = obj.locationCodeableConcept;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('subSite')) {
			this.subSite = [];
			for (const o of (obj.programCode instanceof Array ? obj.subSite : [])) {
				this.subSite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new ClaimResponseAddItemDetail(o));
			}
		}

	}

  itemSequence?: number[];
  detailSequence?: number[];
  subdetailSequence?: number[];
  provider?: Reference[];
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  detail?: ClaimResponseAddItemDetail[];
}

export class ClaimResponseItemDetailSubDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('subDetailSequence')) {
			this.subDetailSequence = obj.subDetailSequence;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

	}

  subDetailSequence: number;
  noteNumber?: number[];
  adjudication?: ClaimResponseItemAdjudication[];
}

export class ClaimResponseItemDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('detailSequence')) {
			this.detailSequence = obj.detailSequence;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('subDetail')) {
			this.subDetail = [];
			for (const o of (obj.subDetail instanceof Array ? obj.subDetail : [])) {
				this.subDetail.push(new ClaimResponseItemDetailSubDetail(o));
			}
		}

	}

  detailSequence: number;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  subDetail?: ClaimResponseItemDetailSubDetail[];
}

export class ClaimResponseItemAdjudication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: number;
}

export class ClaimResponseItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemSequence')) {
			this.itemSequence = obj.itemSequence;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new ClaimResponseItemDetail(o));
			}
		}

	}

  itemSequence: number;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  detail?: ClaimResponseItemDetail[];
}

export class ClaimResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = obj.subType;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('requestor')) {
			this.requestor = obj.requestor;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('disposition')) {
			this.disposition = obj.disposition;
		}

		if (obj.hasOwnProperty('preAuthRef')) {
			this.preAuthRef = obj.preAuthRef;
		}

		if (obj.hasOwnProperty('preAuthPeriod')) {
			this.preAuthPeriod = obj.preAuthPeriod;
		}

		if (obj.hasOwnProperty('payeeType')) {
			this.payeeType = obj.payeeType;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new ClaimResponseItem(o));
			}
		}

		if (obj.hasOwnProperty('addItem')) {
			this.addItem = [];
			for (const o of (obj.addItem instanceof Array ? obj.addItem : [])) {
				this.addItem.push(new ClaimResponseAddItem(o));
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ClaimResponseItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('total')) {
			this.total = [];
			for (const o of (obj.total instanceof Array ? obj.total : [])) {
				this.total.push(new ClaimResponseTotal(o));
			}
		}

		if (obj.hasOwnProperty('payment')) {
			this.payment = obj.payment;
		}

		if (obj.hasOwnProperty('fundsReserve')) {
			this.fundsReserve = obj.fundsReserve;
		}

		if (obj.hasOwnProperty('formCode')) {
			this.formCode = obj.formCode;
		}

		if (obj.hasOwnProperty('form')) {
			this.form = obj.form;
		}

		if (obj.hasOwnProperty('processNote')) {
			this.processNote = [];
			for (const o of (obj.processNote instanceof Array ? obj.processNote : [])) {
				this.processNote.push(new ClaimResponseProcessNote(o));
			}
		}

		if (obj.hasOwnProperty('communicationRequest')) {
			this.communicationRequest = [];
			for (const o of (obj.communicationRequest instanceof Array ? obj.communicationRequest : [])) {
				this.communicationRequest.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new ClaimResponseInsurance(o));
			}
		}

		if (obj.hasOwnProperty('error')) {
			this.error = [];
			for (const o of (obj.error instanceof Array ? obj.error : [])) {
				this.error.push(new ClaimResponseError(o));
			}
		}

	}

  resourceType = 'ClaimResponse';
  identifier?: Identifier[];
  status: ClaimResponseStatus1;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: ClaimResponseUse1;
  patient: Reference;
  created: string;
  insurer: Reference;
  requestor?: Reference;
  request?: Reference;
  outcome: ClaimResponseOutcome1;
  disposition?: string;
  preAuthRef?: string;
  preAuthPeriod?: Period;
  payeeType?: CodeableConcept;
  item?: ClaimResponseItem[];
  addItem?: ClaimResponseAddItem[];
  adjudication?: ClaimResponseItemAdjudication[];
  total?: ClaimResponseTotal[];
  payment?: ClaimResponsePayment;
  fundsReserve?: CodeableConcept;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: ClaimResponseProcessNote[];
  communicationRequest?: Reference[];
  insurance?: ClaimResponseInsurance[];
  error?: ClaimResponseError[];
}

export class ClinicalImpressionFinding extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

		if (obj.hasOwnProperty('basis')) {
			this.basis = obj.basis;
		}

	}

  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  basis?: string;
}

export class ClinicalImpressionInvestigation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new Reference(o));
			}
		}

	}

  code: CodeableConcept;
  item?: Reference[];
}

export class ClinicalImpression extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('effectiveDateTime')) {
			this.effectiveDateTime = obj.effectiveDateTime;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('assessor')) {
			this.assessor = obj.assessor;
		}

		if (obj.hasOwnProperty('previous')) {
			this.previous = obj.previous;
		}

		if (obj.hasOwnProperty('problem')) {
			this.problem = [];
			for (const o of (obj.problem instanceof Array ? obj.problem : [])) {
				this.problem.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('investigation')) {
			this.investigation = [];
			for (const o of (obj.investigation instanceof Array ? obj.investigation : [])) {
				this.investigation.push(new ClinicalImpressionInvestigation(o));
			}
		}

		if (obj.hasOwnProperty('protocol')) {
			this.protocol = [];
			for (const o of (obj.protocol instanceof Array ? obj.protocol : [])) {
				this.protocol.push(o);
			}
		}

		if (obj.hasOwnProperty('summary')) {
			this.summary = obj.summary;
		}

		if (obj.hasOwnProperty('finding')) {
			this.finding = [];
			for (const o of (obj.finding instanceof Array ? obj.finding : [])) {
				this.finding.push(new ClinicalImpressionFinding(o));
			}
		}

		if (obj.hasOwnProperty('prognosisCodeableConcept')) {
			this.prognosisCodeableConcept = [];
			for (const o of (obj.prognosisCodeableConcept instanceof Array ? obj.prognosisCodeableConcept : [])) {
				this.prognosisCodeableConcept.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('prognosisReference')) {
			this.prognosisReference = [];
			for (const o of (obj.prognosisReference instanceof Array ? obj.prognosisReference : [])) {
				this.prognosisReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'ClinicalImpression';
  identifier?: Identifier[];
  status: ClinicalImpressionStatus1;
  statusReason?: CodeableConcept;
  code?: CodeableConcept;
  description?: string;
  subject: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  date?: string;
  assessor?: Reference;
  previous?: Reference;
  problem?: Reference[];
  investigation?: ClinicalImpressionInvestigation[];
  protocol?: string[];
  summary?: string;
  finding?: ClinicalImpressionFinding[];
  prognosisCodeableConcept?: CodeableConcept[];
  prognosisReference?: Reference[];
  supportingInfo?: Reference[];
  note?: Annotation[];
}

export class ClinicalUseDefinitionWarning extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

	}

  description?: string;
  code?: CodeableConcept;
}

export class ClinicalUseDefinitionUndesirableEffect extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('symptomConditionEffect')) {
			this.symptomConditionEffect = obj.symptomConditionEffect;
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = obj.classification;
		}

		if (obj.hasOwnProperty('frequencyOfOccurrence')) {
			this.frequencyOfOccurrence = obj.frequencyOfOccurrence;
		}

	}

  symptomConditionEffect?: CodeableReference;
  classification?: CodeableConcept;
  frequencyOfOccurrence?: CodeableConcept;
}

export class ClinicalUseDefinitionInteractionInteractant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

	}

  itemReference?: Reference;
  itemCodeableConcept?: CodeableConcept;
}

export class ClinicalUseDefinitionInteraction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('interactant')) {
			this.interactant = [];
			for (const o of (obj.interactant instanceof Array ? obj.interactant : [])) {
				this.interactant.push(new ClinicalUseDefinitionInteractionInteractant(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('effect')) {
			this.effect = obj.effect;
		}

		if (obj.hasOwnProperty('incidence')) {
			this.incidence = obj.incidence;
		}

		if (obj.hasOwnProperty('management')) {
			this.management = [];
			for (const o of (obj.management instanceof Array ? obj.management : [])) {
				this.management.push(new CodeableConcept(o));
			}
		}

	}

  interactant?: ClinicalUseDefinitionInteractionInteractant[];
  type?: CodeableConcept;
  effect?: CodeableReference;
  incidence?: CodeableConcept;
  management?: CodeableConcept[];
}

export class ClinicalUseDefinitionIndication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('diseaseSymptomProcedure')) {
			this.diseaseSymptomProcedure = obj.diseaseSymptomProcedure;
		}

		if (obj.hasOwnProperty('diseaseStatus')) {
			this.diseaseStatus = obj.diseaseStatus;
		}

		if (obj.hasOwnProperty('comorbidity')) {
			this.comorbidity = [];
			for (const o of (obj.comorbidity instanceof Array ? obj.comorbidity : [])) {
				this.comorbidity.push(new CodeableReference(o));
			}
		}

		if (obj.hasOwnProperty('intendedEffect')) {
			this.intendedEffect = obj.intendedEffect;
		}

		if (obj.hasOwnProperty('durationRange')) {
			this.durationRange = obj.durationRange;
		}

		if (obj.hasOwnProperty('durationString')) {
			this.durationString = obj.durationString;
		}

		if (obj.hasOwnProperty('undesirableEffect')) {
			this.undesirableEffect = [];
			for (const o of (obj.undesirableEffect instanceof Array ? obj.undesirableEffect : [])) {
				this.undesirableEffect.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('otherTherapy')) {
			this.otherTherapy = [];
			for (const o of (obj.otherTherapy instanceof Array ? obj.otherTherapy : [])) {
				this.otherTherapy.push(new ClinicalUseDefinitionContraindicationOtherTherapy(o));
			}
		}

	}

  diseaseSymptomProcedure?: CodeableReference;
  diseaseStatus?: CodeableReference;
  comorbidity?: CodeableReference[];
  intendedEffect?: CodeableReference;
  durationRange?: Range;
  durationString?: string;
  undesirableEffect?: Reference[];
  otherTherapy?: ClinicalUseDefinitionContraindicationOtherTherapy[];
}

export class ClinicalUseDefinitionContraindicationOtherTherapy extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relationshipType')) {
			this.relationshipType = obj.relationshipType;
		}

		if (obj.hasOwnProperty('therapy')) {
			this.therapy = obj.therapy;
		}

	}

  relationshipType: CodeableConcept;
  therapy: CodeableReference;
}

export class ClinicalUseDefinitionContraindication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('diseaseSymptomProcedure')) {
			this.diseaseSymptomProcedure = obj.diseaseSymptomProcedure;
		}

		if (obj.hasOwnProperty('diseaseStatus')) {
			this.diseaseStatus = obj.diseaseStatus;
		}

		if (obj.hasOwnProperty('comorbidity')) {
			this.comorbidity = [];
			for (const o of (obj.comorbidity instanceof Array ? obj.comorbidity : [])) {
				this.comorbidity.push(new CodeableReference(o));
			}
		}

		if (obj.hasOwnProperty('indication')) {
			this.indication = [];
			for (const o of (obj.indication instanceof Array ? obj.indication : [])) {
				this.indication.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('otherTherapy')) {
			this.otherTherapy = [];
			for (const o of (obj.otherTherapy instanceof Array ? obj.otherTherapy : [])) {
				this.otherTherapy.push(new ClinicalUseDefinitionContraindicationOtherTherapy(o));
			}
		}

	}

  diseaseSymptomProcedure?: CodeableReference;
  diseaseStatus?: CodeableReference;
  comorbidity?: CodeableReference[];
  indication?: Reference[];
  otherTherapy?: ClinicalUseDefinitionContraindicationOtherTherapy[];
}

export class ClinicalUseDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = [];
			for (const o of (obj.subject instanceof Array ? obj.subject : [])) {
				this.subject.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('contraindication')) {
			this.contraindication = obj.contraindication;
		}

		if (obj.hasOwnProperty('indication')) {
			this.indication = obj.indication;
		}

		if (obj.hasOwnProperty('interaction')) {
			this.interaction = obj.interaction;
		}

		if (obj.hasOwnProperty('population')) {
			this.population = [];
			for (const o of (obj.population instanceof Array ? obj.population : [])) {
				this.population.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('undesirableEffect')) {
			this.undesirableEffect = obj.undesirableEffect;
		}

		if (obj.hasOwnProperty('warning')) {
			this.warning = obj.warning;
		}

	}

  resourceType = 'ClinicalUseDefinition';
  identifier?: Identifier[];
  type: ClinicalUseDefinitionType1;
  category?: CodeableConcept[];
  subject?: Reference[];
  status?: CodeableConcept;
  contraindication?: ClinicalUseDefinitionContraindication;
  indication?: ClinicalUseDefinitionIndication;
  interaction?: ClinicalUseDefinitionInteraction;
  population?: Reference[];
  undesirableEffect?: ClinicalUseDefinitionUndesirableEffect;
  warning?: ClinicalUseDefinitionWarning;
}

export class CodeSystemConceptProperty implements IFhir.ICodeSystemConceptProperty {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

	}

  code: string;
  valueCode?: string;
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: number;
  valueBoolean?: boolean;
  valueDateTime?: string;
  valueDecimal?: number;
}

export class CodeSystemConceptDesignation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  language?: string;
  use?: Coding;
  value: string;
}

export class CodeSystemConcept implements IFhir.ICodeSystemConcept {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('designation')) {
			this.designation = [];
			for (const o of (obj.designation instanceof Array ? obj.designation : [])) {
				this.designation.push(new CodeSystemConceptDesignation(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new CodeSystemConceptProperty(o));
			}
		}

		if (obj.hasOwnProperty('concept')) {
			this.concept = [];
			for (const o of (obj.concept instanceof Array ? obj.concept : [])) {
				this.concept.push(new CodeSystemConcept(o));
			}
		}

	}

  code: string;
  display?: string;
  definition?: string;
  designation?: CodeSystemConceptDesignation[];
  property?: CodeSystemConceptProperty[];
  concept?: CodeSystemConcept[];
}

export class CodeSystemProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  code: string;
  uri?: string;
  description?: string;
  type: CodeSystemType1;
}

export class CodeSystemFilter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('operator')) {
			this.operator = [];
			for (const o of (obj.operator instanceof Array ? obj.operator : [])) {
				this.operator.push(o);
			}
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  code: string;
  description?: string;
  operator: CodeSystemOperator1[];
  value: string;
}

export class CodeSystem extends DomainResource implements IFhir.ICodeSystem {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('caseSensitive')) {
			this.caseSensitive = obj.caseSensitive;
		}

		if (obj.hasOwnProperty('valueSet')) {
			this.valueSet = obj.valueSet;
		}

		if (obj.hasOwnProperty('hierarchyMeaning')) {
			this.hierarchyMeaning = obj.hierarchyMeaning;
		}

		if (obj.hasOwnProperty('compositional')) {
			this.compositional = obj.compositional;
		}

		if (obj.hasOwnProperty('versionNeeded')) {
			this.versionNeeded = obj.versionNeeded;
		}

		if (obj.hasOwnProperty('content')) {
			this.content = obj.content;
		}

		if (obj.hasOwnProperty('supplements')) {
			this.supplements = obj.supplements;
		}

		if (obj.hasOwnProperty('count')) {
			this.count = obj.count;
		}

		if (obj.hasOwnProperty('filter')) {
			this.filter = [];
			for (const o of (obj.filter instanceof Array ? obj.filter : [])) {
				this.filter.push(new CodeSystemFilter(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new CodeSystemProperty(o));
			}
		}

		if (obj.hasOwnProperty('concept')) {
			this.concept = [];
			for (const o of (obj.concept instanceof Array ? obj.concept : [])) {
				this.concept.push(new CodeSystemConcept(o));
			}
		}

	}

  resourceType = 'CodeSystem';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  status: CodeSystemStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  caseSensitive?: boolean;
  valueSet?: string;
  hierarchyMeaning?: CodeSystemHierarchyMeaning1;
  compositional?: boolean;
  versionNeeded?: boolean;
  content: CodeSystemContent1;
  supplements?: string;
  count?: number;
  filter?: CodeSystemFilter[];
  property?: CodeSystemProperty[];
  concept?: CodeSystemConcept[];
}

export class CommunicationPayload extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('contentString')) {
			this.contentString = obj.contentString;
		}

		if (obj.hasOwnProperty('contentAttachment')) {
			this.contentAttachment = obj.contentAttachment;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

	}

  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class Communication extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('inResponseTo')) {
			this.inResponseTo = [];
			for (const o of (obj.inResponseTo instanceof Array ? obj.inResponseTo : [])) {
				this.inResponseTo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('medium')) {
			this.medium = [];
			for (const o of (obj.medium instanceof Array ? obj.medium : [])) {
				this.medium.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = obj.topic;
		}

		if (obj.hasOwnProperty('about')) {
			this.about = [];
			for (const o of (obj.about instanceof Array ? obj.about : [])) {
				this.about.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('sent')) {
			this.sent = obj.sent;
		}

		if (obj.hasOwnProperty('received')) {
			this.received = obj.received;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = [];
			for (const o of (obj.recipient instanceof Array ? obj.recipient : [])) {
				this.recipient.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('sender')) {
			this.sender = obj.sender;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('payload')) {
			this.payload = [];
			for (const o of (obj.payload instanceof Array ? obj.payload : [])) {
				this.payload.push(new CommunicationPayload(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'Communication';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  partOf?: Reference[];
  inResponseTo?: Reference[];
  status: CommunicationStatus1;
  statusReason?: CodeableConcept;
  category?: CodeableConcept[];
  priority?: CommunicationPriority1;
  medium?: CodeableConcept[];
  subject?: Reference;
  topic?: CodeableConcept;
  about?: Reference[];
  encounter?: Reference;
  sent?: string;
  received?: string;
  recipient?: Reference[];
  sender?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  payload?: CommunicationPayload[];
  note?: Annotation[];
}

export class CommunicationRequestPayload extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('contentString')) {
			this.contentString = obj.contentString;
		}

		if (obj.hasOwnProperty('contentAttachment')) {
			this.contentAttachment = obj.contentAttachment;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

	}

  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class CommunicationRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('groupIdentifier')) {
			this.groupIdentifier = obj.groupIdentifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('medium')) {
			this.medium = [];
			for (const o of (obj.medium instanceof Array ? obj.medium : [])) {
				this.medium.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('about')) {
			this.about = [];
			for (const o of (obj.about instanceof Array ? obj.about : [])) {
				this.about.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('payload')) {
			this.payload = [];
			for (const o of (obj.payload instanceof Array ? obj.payload : [])) {
				this.payload.push(new CommunicationRequestPayload(o));
			}
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = [];
			for (const o of (obj.recipient instanceof Array ? obj.recipient : [])) {
				this.recipient.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('sender')) {
			this.sender = obj.sender;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'CommunicationRequest';
  identifier?: Identifier[];
  basedOn?: Reference[];
  replaces?: Reference[];
  groupIdentifier?: Identifier;
  status: CommunicationRequestStatus1;
  statusReason?: CodeableConcept;
  category?: CodeableConcept[];
  priority?: CommunicationRequestPriority1;
  doNotPerform?: boolean;
  medium?: CodeableConcept[];
  subject?: Reference;
  about?: Reference[];
  encounter?: Reference;
  payload?: CommunicationRequestPayload[];
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  authoredOn?: string;
  requester?: Reference;
  recipient?: Reference[];
  sender?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
}

export class CompartmentDefinitionResource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('param')) {
			this.param = [];
			for (const o of (obj.param instanceof Array ? obj.param : [])) {
				this.param.push(o);
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  code: CompartmentDefinitionCode2;
  param?: string[];
  documentation?: string;
}

export class CompartmentDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('search')) {
			this.search = obj.search;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = [];
			for (const o of (obj.resource instanceof Array ? obj.resource : [])) {
				this.resource.push(new CompartmentDefinitionResource(o));
			}
		}

	}

  resourceType = 'CompartmentDefinition';
  url: string;
  version?: string;
  name: string;
  status: CompartmentDefinitionStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  purpose?: string;
  code: CompartmentDefinitionCode1;
  search: boolean;
  resource?: CompartmentDefinitionResource[];
}

export class CompositionSection extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = obj.focus;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('orderedBy')) {
			this.orderedBy = obj.orderedBy;
		}

		if (obj.hasOwnProperty('entry')) {
			this.entry = [];
			for (const o of (obj.entry instanceof Array ? obj.entry : [])) {
				this.entry.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('emptyReason')) {
			this.emptyReason = obj.emptyReason;
		}

		if (obj.hasOwnProperty('section')) {
			this.section = [];
			for (const o of (obj.section instanceof Array ? obj.section : [])) {
				this.section.push(new CompositionSection(o));
			}
		}

	}

  title?: string;
  code?: CodeableConcept;
  author?: Reference[];
  focus?: Reference;
  text?: Narrative;
  mode?: CompositionMode2;
  orderedBy?: CodeableConcept;
  entry?: Reference[];
  emptyReason?: CodeableConcept;
  section?: CompositionSection[];
}

export class CompositionEvent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new Reference(o));
			}
		}

	}

  code?: CodeableConcept[];
  period?: Period;
  detail?: Reference[];
}

export class CompositionRelatesTo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('targetIdentifier')) {
			this.targetIdentifier = obj.targetIdentifier;
		}

		if (obj.hasOwnProperty('targetReference')) {
			this.targetReference = obj.targetReference;
		}

	}

  code: CompositionCode1;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}

export class CompositionAttester extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('time')) {
			this.time = obj.time;
		}

		if (obj.hasOwnProperty('party')) {
			this.party = obj.party;
		}

	}

  mode: CompositionMode1;
  time?: string;
  party?: Reference;
}

export class Composition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('confidentiality')) {
			this.confidentiality = obj.confidentiality;
		}

		if (obj.hasOwnProperty('attester')) {
			this.attester = [];
			for (const o of (obj.attester instanceof Array ? obj.attester : [])) {
				this.attester.push(new CompositionAttester(o));
			}
		}

		if (obj.hasOwnProperty('custodian')) {
			this.custodian = obj.custodian;
		}

		if (obj.hasOwnProperty('relatesTo')) {
			this.relatesTo = [];
			for (const o of (obj.relatesTo instanceof Array ? obj.relatesTo : [])) {
				this.relatesTo.push(new CompositionRelatesTo(o));
			}
		}

		if (obj.hasOwnProperty('event')) {
			this.event = [];
			for (const o of (obj.event instanceof Array ? obj.event : [])) {
				this.event.push(new CompositionEvent(o));
			}
		}

		if (obj.hasOwnProperty('section')) {
			this.section = [];
			for (const o of (obj.section instanceof Array ? obj.section : [])) {
				this.section.push(new CompositionSection(o));
			}
		}

	}

  resourceType = 'Composition';
  identifier?: Identifier;
  status: CompositionStatus1;
  type: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  encounter?: Reference;
  date: string;
  author: Reference[];
  title: string;
  confidentiality?: string;
  attester?: CompositionAttester[];
  custodian?: Reference;
  relatesTo?: CompositionRelatesTo[];
  event?: CompositionEvent[];
  section?: CompositionSection[];
}

export class ConceptMapGroupUnmapped extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

	}

  mode: ConceptMapMode1;
  code?: string;
  display?: string;
  url?: string;
}

export class ConceptMapGroupElementTargetDependsOn extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('property')) {
			this.property = obj.property;
		}

		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

	}

  property: string;
  system?: string;
  value: string;
  display?: string;
}

export class ConceptMapGroupElementTarget extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('equivalence')) {
			this.equivalence = obj.equivalence;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('dependsOn')) {
			this.dependsOn = [];
			for (const o of (obj.dependsOn instanceof Array ? obj.dependsOn : [])) {
				this.dependsOn.push(new ConceptMapGroupElementTargetDependsOn(o));
			}
		}

		if (obj.hasOwnProperty('product')) {
			this.product = [];
			for (const o of (obj.product instanceof Array ? obj.product : [])) {
				this.product.push(new ConceptMapGroupElementTargetDependsOn(o));
			}
		}

	}

  code?: string;
  display?: string;
  equivalence: ConceptMapEquivalence1;
  comment?: string;
  dependsOn?: ConceptMapGroupElementTargetDependsOn[];
  product?: ConceptMapGroupElementTargetDependsOn[];
}

export class ConceptMapGroupElement extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new ConceptMapGroupElementTarget(o));
			}
		}

	}

  code?: string;
  display?: string;
  target?: ConceptMapGroupElementTarget[];
}

export class ConceptMapGroup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('sourceVersion')) {
			this.sourceVersion = obj.sourceVersion;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = obj.target;
		}

		if (obj.hasOwnProperty('targetVersion')) {
			this.targetVersion = obj.targetVersion;
		}

		if (obj.hasOwnProperty('element')) {
			this.element = [];
			for (const o of (obj.element instanceof Array ? obj.element : [])) {
				this.element.push(new ConceptMapGroupElement(o));
			}
		}

		if (obj.hasOwnProperty('unmapped')) {
			this.unmapped = obj.unmapped;
		}

	}

  source?: string;
  sourceVersion?: string;
  target?: string;
  targetVersion?: string;
  element: ConceptMapGroupElement[];
  unmapped?: ConceptMapGroupUnmapped;
}

export class ConceptMap extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('sourceUri')) {
			this.sourceUri = obj.sourceUri;
		}

		if (obj.hasOwnProperty('sourceCanonical')) {
			this.sourceCanonical = obj.sourceCanonical;
		}

		if (obj.hasOwnProperty('targetUri')) {
			this.targetUri = obj.targetUri;
		}

		if (obj.hasOwnProperty('targetCanonical')) {
			this.targetCanonical = obj.targetCanonical;
		}

		if (obj.hasOwnProperty('group')) {
			this.group = [];
			for (const o of (obj.group instanceof Array ? obj.group : [])) {
				this.group.push(new ConceptMapGroup(o));
			}
		}

	}

  resourceType = 'ConceptMap';
  url?: string;
  identifier?: Identifier;
  version?: string;
  name?: string;
  title?: string;
  status: ConceptMapStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  sourceUri?: string;
  sourceCanonical?: string;
  targetUri?: string;
  targetCanonical?: string;
  group?: ConceptMapGroup[];
}

export class ConditionEvidence extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new Reference(o));
			}
		}

	}

  code?: CodeableConcept[];
  detail?: Reference[];
}

export class ConditionStage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('summary')) {
			this.summary = obj.summary;
		}

		if (obj.hasOwnProperty('assessment')) {
			this.assessment = [];
			for (const o of (obj.assessment instanceof Array ? obj.assessment : [])) {
				this.assessment.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  summary?: CodeableConcept;
  assessment?: Reference[];
  type?: CodeableConcept;
}

export class Condition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('clinicalStatus')) {
			this.clinicalStatus = obj.clinicalStatus;
		}

		if (obj.hasOwnProperty('verificationStatus')) {
			this.verificationStatus = obj.verificationStatus;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = [];
			for (const o of (obj.bodySite instanceof Array ? obj.bodySite : [])) {
				this.bodySite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('onsetDateTime')) {
			this.onsetDateTime = obj.onsetDateTime;
		}

		if (obj.hasOwnProperty('onsetAge')) {
			this.onsetAge = obj.onsetAge;
		}

		if (obj.hasOwnProperty('onsetPeriod')) {
			this.onsetPeriod = obj.onsetPeriod;
		}

		if (obj.hasOwnProperty('onsetRange')) {
			this.onsetRange = obj.onsetRange;
		}

		if (obj.hasOwnProperty('onsetString')) {
			this.onsetString = obj.onsetString;
		}

		if (obj.hasOwnProperty('abatementDateTime')) {
			this.abatementDateTime = obj.abatementDateTime;
		}

		if (obj.hasOwnProperty('abatementAge')) {
			this.abatementAge = obj.abatementAge;
		}

		if (obj.hasOwnProperty('abatementPeriod')) {
			this.abatementPeriod = obj.abatementPeriod;
		}

		if (obj.hasOwnProperty('abatementRange')) {
			this.abatementRange = obj.abatementRange;
		}

		if (obj.hasOwnProperty('abatementString')) {
			this.abatementString = obj.abatementString;
		}

		if (obj.hasOwnProperty('recordedDate')) {
			this.recordedDate = obj.recordedDate;
		}

		if (obj.hasOwnProperty('recorder')) {
			this.recorder = obj.recorder;
		}

		if (obj.hasOwnProperty('asserter')) {
			this.asserter = obj.asserter;
		}

		if (obj.hasOwnProperty('stage')) {
			this.stage = [];
			for (const o of (obj.stage instanceof Array ? obj.stage : [])) {
				this.stage.push(new ConditionStage(o));
			}
		}

		if (obj.hasOwnProperty('evidence')) {
			this.evidence = [];
			for (const o of (obj.evidence instanceof Array ? obj.evidence : [])) {
				this.evidence.push(new ConditionEvidence(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'Condition';
  identifier?: Identifier[];
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  subject: Reference;
  encounter?: Reference;
  onsetDateTime?: string;
  onsetAge?: Age;
  onsetPeriod?: Period;
  onsetRange?: Range;
  onsetString?: string;
  abatementDateTime?: string;
  abatementAge?: Age;
  abatementPeriod?: Period;
  abatementRange?: Range;
  abatementString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  stage?: ConditionStage[];
  evidence?: ConditionEvidence[];
  note?: Annotation[];
}

export class ConsentProvisionData extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('meaning')) {
			this.meaning = obj.meaning;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  meaning: ConsentMeaning1;
  reference: Reference;
}

export class ConsentProvisionActor extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  role: CodeableConcept;
  reference: Reference;
}

export class ConsentProvision extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = [];
			for (const o of (obj.actor instanceof Array ? obj.actor : [])) {
				this.actor.push(new ConsentProvisionActor(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('securityLabel')) {
			this.securityLabel = [];
			for (const o of (obj.securityLabel instanceof Array ? obj.securityLabel : [])) {
				this.securityLabel.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = [];
			for (const o of (obj.purpose instanceof Array ? obj.purpose : [])) {
				this.purpose.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('class')) {
			this.class = [];
			for (const o of (obj.class instanceof Array ? obj.class : [])) {
				this.class.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('dataPeriod')) {
			this.dataPeriod = obj.dataPeriod;
		}

		if (obj.hasOwnProperty('data')) {
			this.data = [];
			for (const o of (obj.data instanceof Array ? obj.data : [])) {
				this.data.push(new ConsentProvisionData(o));
			}
		}

		if (obj.hasOwnProperty('provision')) {
			this.provision = [];
			for (const o of (obj.provision instanceof Array ? obj.provision : [])) {
				this.provision.push(new ConsentProvision(o));
			}
		}

	}

  type?: ConsentType1;
  period?: Period;
  actor?: ConsentProvisionActor[];
  action?: CodeableConcept[];
  securityLabel?: Coding[];
  purpose?: Coding[];
  class?: Coding[];
  code?: CodeableConcept[];
  dataPeriod?: Period;
  data?: ConsentProvisionData[];
  provision?: ConsentProvision[];
}

export class ConsentVerification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('verified')) {
			this.verified = obj.verified;
		}

		if (obj.hasOwnProperty('verifiedWith')) {
			this.verifiedWith = obj.verifiedWith;
		}

		if (obj.hasOwnProperty('verificationDate')) {
			this.verificationDate = obj.verificationDate;
		}

	}

  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: string;
}

export class ConsentPolicy extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('authority')) {
			this.authority = obj.authority;
		}

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

	}

  authority?: string;
  uri?: string;
}

export class Consent extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('scope')) {
			this.scope = obj.scope;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('dateTime')) {
			this.dateTime = obj.dateTime;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = [];
			for (const o of (obj.organization instanceof Array ? obj.organization : [])) {
				this.organization.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('sourceAttachment')) {
			this.sourceAttachment = obj.sourceAttachment;
		}

		if (obj.hasOwnProperty('sourceReference')) {
			this.sourceReference = obj.sourceReference;
		}

		if (obj.hasOwnProperty('policy')) {
			this.policy = [];
			for (const o of (obj.policy instanceof Array ? obj.policy : [])) {
				this.policy.push(new ConsentPolicy(o));
			}
		}

		if (obj.hasOwnProperty('policyRule')) {
			this.policyRule = obj.policyRule;
		}

		if (obj.hasOwnProperty('verification')) {
			this.verification = [];
			for (const o of (obj.verification instanceof Array ? obj.verification : [])) {
				this.verification.push(new ConsentVerification(o));
			}
		}

		if (obj.hasOwnProperty('provision')) {
			this.provision = obj.provision;
		}

	}

  resourceType = 'Consent';
  identifier?: Identifier[];
  status: ConsentStatus1;
  scope: CodeableConcept;
  category: CodeableConcept[];
  patient?: Reference;
  dateTime?: string;
  performer?: Reference[];
  organization?: Reference[];
  sourceAttachment?: Attachment;
  sourceReference?: Reference;
  policy?: ConsentPolicy[];
  policyRule?: CodeableConcept;
  verification?: ConsentVerification[];
  provision?: ConsentProvision;
}

export class ContractRule extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('contentAttachment')) {
			this.contentAttachment = obj.contentAttachment;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

	}

  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractLegal extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('contentAttachment')) {
			this.contentAttachment = obj.contentAttachment;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

	}

  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractFriendly extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('contentAttachment')) {
			this.contentAttachment = obj.contentAttachment;
		}

		if (obj.hasOwnProperty('contentReference')) {
			this.contentReference = obj.contentReference;
		}

	}

  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractSigner extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('party')) {
			this.party = obj.party;
		}

		if (obj.hasOwnProperty('signature')) {
			this.signature = [];
			for (const o of (obj.signature instanceof Array ? obj.signature : [])) {
				this.signature.push(new Signature(o));
			}
		}

	}

  type: Coding;
  party: Reference;
  signature: Signature[];
}

export class ContractTermActionSubject extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('reference')) {
			this.reference = [];
			for (const o of (obj.reference instanceof Array ? obj.reference : [])) {
				this.reference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

	}

  reference: Reference[];
  role?: CodeableConcept;
}

export class ContractTermAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = [];
			for (const o of (obj.subject instanceof Array ? obj.subject : [])) {
				this.subject.push(new ContractTermActionSubject(o));
			}
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = [];
			for (const o of (obj.linkId instanceof Array ? obj.linkId : [])) {
				this.linkId.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('contextLinkId')) {
			this.contextLinkId = [];
			for (const o of (obj.contextLinkId instanceof Array ? obj.contextLinkId : [])) {
				this.contextLinkId.push(o);
			}
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = [];
			for (const o of (obj.requester instanceof Array ? obj.requester : [])) {
				this.requester.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('requesterLinkId')) {
			this.requesterLinkId = [];
			for (const o of (obj.requesterLinkId instanceof Array ? obj.requesterLinkId : [])) {
				this.requesterLinkId.push(o);
			}
		}

		if (obj.hasOwnProperty('performerType')) {
			this.performerType = [];
			for (const o of (obj.performerType instanceof Array ? obj.performerType : [])) {
				this.performerType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('performerRole')) {
			this.performerRole = obj.performerRole;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('performerLinkId')) {
			this.performerLinkId = [];
			for (const o of (obj.performerLinkId instanceof Array ? obj.performerLinkId : [])) {
				this.performerLinkId.push(o);
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = [];
			for (const o of (obj.reason instanceof Array ? obj.reason : [])) {
				this.reason.push(o);
			}
		}

		if (obj.hasOwnProperty('reasonLinkId')) {
			this.reasonLinkId = [];
			for (const o of (obj.reasonLinkId instanceof Array ? obj.reasonLinkId : [])) {
				this.reasonLinkId.push(o);
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('securityLabelNumber')) {
			this.securityLabelNumber = [];
			for (const o of (obj.securityLabelNumber instanceof Array ? obj.securityLabelNumber : [])) {
				this.securityLabelNumber.push(o);
			}
		}

	}

  doNotPerform?: boolean;
  type: CodeableConcept;
  subject?: ContractTermActionSubject[];
  intent: CodeableConcept;
  linkId?: string[];
  status: CodeableConcept;
  context?: Reference;
  contextLinkId?: string[];
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  requester?: Reference[];
  requesterLinkId?: string[];
  performerType?: CodeableConcept[];
  performerRole?: CodeableConcept;
  performer?: Reference;
  performerLinkId?: string[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  reason?: string[];
  reasonLinkId?: string[];
  note?: Annotation[];
  securityLabelNumber?: number[];
}

export class ContractTermAssetValuedItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('entityCodeableConcept')) {
			this.entityCodeableConcept = obj.entityCodeableConcept;
		}

		if (obj.hasOwnProperty('entityReference')) {
			this.entityReference = obj.entityReference;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('effectiveTime')) {
			this.effectiveTime = obj.effectiveTime;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('points')) {
			this.points = obj.points;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('payment')) {
			this.payment = obj.payment;
		}

		if (obj.hasOwnProperty('paymentDate')) {
			this.paymentDate = obj.paymentDate;
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = obj.recipient;
		}

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = [];
			for (const o of (obj.linkId instanceof Array ? obj.linkId : [])) {
				this.linkId.push(o);
			}
		}

		if (obj.hasOwnProperty('securityLabelNumber')) {
			this.securityLabelNumber = [];
			for (const o of (obj.securityLabelNumber instanceof Array ? obj.securityLabelNumber : [])) {
				this.securityLabelNumber.push(o);
			}
		}

	}

  entityCodeableConcept?: CodeableConcept;
  entityReference?: Reference;
  identifier?: Identifier;
  effectiveTime?: string;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  points?: number;
  net?: Money;
  payment?: string;
  paymentDate?: string;
  responsible?: Reference;
  recipient?: Reference;
  linkId?: string[];
  securityLabelNumber?: number[];
}

export class ContractTermAssetContext extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  reference?: Reference;
  code?: CodeableConcept[];
  text?: string;
}

export class ContractTermAsset extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('scope')) {
			this.scope = obj.scope;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('typeReference')) {
			this.typeReference = [];
			for (const o of (obj.typeReference instanceof Array ? obj.typeReference : [])) {
				this.typeReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('subtype')) {
			this.subtype = [];
			for (const o of (obj.subtype instanceof Array ? obj.subtype : [])) {
				this.subtype.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = [];
			for (const o of (obj.context instanceof Array ? obj.context : [])) {
				this.context.push(new ContractTermAssetContext(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

		if (obj.hasOwnProperty('periodType')) {
			this.periodType = [];
			for (const o of (obj.periodType instanceof Array ? obj.periodType : [])) {
				this.periodType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = [];
			for (const o of (obj.period instanceof Array ? obj.period : [])) {
				this.period.push(new Period(o));
			}
		}

		if (obj.hasOwnProperty('usePeriod')) {
			this.usePeriod = [];
			for (const o of (obj.usePeriod instanceof Array ? obj.usePeriod : [])) {
				this.usePeriod.push(new Period(o));
			}
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = [];
			for (const o of (obj.linkId instanceof Array ? obj.linkId : [])) {
				this.linkId.push(o);
			}
		}

		if (obj.hasOwnProperty('answer')) {
			this.answer = [];
			for (const o of (obj.answer instanceof Array ? obj.answer : [])) {
				this.answer.push(new ContractTermOfferAnswer(o));
			}
		}

		if (obj.hasOwnProperty('securityLabelNumber')) {
			this.securityLabelNumber = [];
			for (const o of (obj.securityLabelNumber instanceof Array ? obj.securityLabelNumber : [])) {
				this.securityLabelNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('valuedItem')) {
			this.valuedItem = [];
			for (const o of (obj.valuedItem instanceof Array ? obj.valuedItem : [])) {
				this.valuedItem.push(new ContractTermAssetValuedItem(o));
			}
		}

	}

  scope?: CodeableConcept;
  type?: CodeableConcept[];
  typeReference?: Reference[];
  subtype?: CodeableConcept[];
  relationship?: Coding;
  context?: ContractTermAssetContext[];
  condition?: string;
  periodType?: CodeableConcept[];
  period?: Period[];
  usePeriod?: Period[];
  text?: string;
  linkId?: string[];
  answer?: ContractTermOfferAnswer[];
  securityLabelNumber?: number[];
  valuedItem?: ContractTermAssetValuedItem[];
}

export class ContractTermOfferAnswer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

	}

  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
}

export class ContractTermOfferParty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('reference')) {
			this.reference = [];
			for (const o of (obj.reference instanceof Array ? obj.reference : [])) {
				this.reference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

	}

  reference: Reference[];
  role: CodeableConcept;
}

export class ContractTermOffer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('party')) {
			this.party = [];
			for (const o of (obj.party instanceof Array ? obj.party : [])) {
				this.party.push(new ContractTermOfferParty(o));
			}
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = obj.topic;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('decision')) {
			this.decision = obj.decision;
		}

		if (obj.hasOwnProperty('decisionMode')) {
			this.decisionMode = [];
			for (const o of (obj.decisionMode instanceof Array ? obj.decisionMode : [])) {
				this.decisionMode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('answer')) {
			this.answer = [];
			for (const o of (obj.answer instanceof Array ? obj.answer : [])) {
				this.answer.push(new ContractTermOfferAnswer(o));
			}
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = [];
			for (const o of (obj.linkId instanceof Array ? obj.linkId : [])) {
				this.linkId.push(o);
			}
		}

		if (obj.hasOwnProperty('securityLabelNumber')) {
			this.securityLabelNumber = [];
			for (const o of (obj.securityLabelNumber instanceof Array ? obj.securityLabelNumber : [])) {
				this.securityLabelNumber.push(o);
			}
		}

	}

  identifier?: Identifier[];
  party?: ContractTermOfferParty[];
  topic?: Reference;
  type?: CodeableConcept;
  decision?: CodeableConcept;
  decisionMode?: CodeableConcept[];
  answer?: ContractTermOfferAnswer[];
  text?: string;
  linkId?: string[];
  securityLabelNumber?: number[];
}

export class ContractTermSecurityLabel extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('number')) {
			this.number = [];
			for (const o of (obj.number instanceof Array ? obj.number : [])) {
				this.number.push(o);
			}
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = obj.classification;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('control')) {
			this.control = [];
			for (const o of (obj.control instanceof Array ? obj.control : [])) {
				this.control.push(new Coding(o));
			}
		}

	}

  number?: number[];
  classification: Coding;
  category?: Coding[];
  control?: Coding[];
}

export class ContractTerm extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('applies')) {
			this.applies = obj.applies;
		}

		if (obj.hasOwnProperty('topicCodeableConcept')) {
			this.topicCodeableConcept = obj.topicCodeableConcept;
		}

		if (obj.hasOwnProperty('topicReference')) {
			this.topicReference = obj.topicReference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = obj.subType;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('securityLabel')) {
			this.securityLabel = [];
			for (const o of (obj.securityLabel instanceof Array ? obj.securityLabel : [])) {
				this.securityLabel.push(new ContractTermSecurityLabel(o));
			}
		}

		if (obj.hasOwnProperty('offer')) {
			this.offer = obj.offer;
		}

		if (obj.hasOwnProperty('asset')) {
			this.asset = [];
			for (const o of (obj.asset instanceof Array ? obj.asset : [])) {
				this.asset.push(new ContractTermAsset(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new ContractTermAction(o));
			}
		}

		if (obj.hasOwnProperty('group')) {
			this.group = [];
			for (const o of (obj.group instanceof Array ? obj.group : [])) {
				this.group.push(new ContractTerm(o));
			}
		}

	}

  identifier?: Identifier;
  issued?: string;
  applies?: Period;
  topicCodeableConcept?: CodeableConcept;
  topicReference?: Reference;
  type?: CodeableConcept;
  subType?: CodeableConcept;
  text?: string;
  securityLabel?: ContractTermSecurityLabel[];
  offer: ContractTermOffer;
  asset?: ContractTermAsset[];
  action?: ContractTermAction[];
  group?: ContractTerm[];
}

export class ContractContentDefinition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = obj.subType;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('publicationDate')) {
			this.publicationDate = obj.publicationDate;
		}

		if (obj.hasOwnProperty('publicationStatus')) {
			this.publicationStatus = obj.publicationStatus;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

	}

  type: CodeableConcept;
  subType?: CodeableConcept;
  publisher?: Reference;
  publicationDate?: string;
  publicationStatus: ContractPublicationStatus1;
  copyright?: string;
}

export class Contract extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('legalState')) {
			this.legalState = obj.legalState;
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = obj.instantiatesCanonical;
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = obj.instantiatesUri;
		}

		if (obj.hasOwnProperty('contentDerivative')) {
			this.contentDerivative = obj.contentDerivative;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('applies')) {
			this.applies = obj.applies;
		}

		if (obj.hasOwnProperty('expirationType')) {
			this.expirationType = obj.expirationType;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = [];
			for (const o of (obj.subject instanceof Array ? obj.subject : [])) {
				this.subject.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('authority')) {
			this.authority = [];
			for (const o of (obj.authority instanceof Array ? obj.authority : [])) {
				this.authority.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('domain')) {
			this.domain = [];
			for (const o of (obj.domain instanceof Array ? obj.domain : [])) {
				this.domain.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('site')) {
			this.site = [];
			for (const o of (obj.site instanceof Array ? obj.site : [])) {
				this.site.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = [];
			for (const o of (obj.alias instanceof Array ? obj.alias : [])) {
				this.alias.push(o);
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('scope')) {
			this.scope = obj.scope;
		}

		if (obj.hasOwnProperty('topicCodeableConcept')) {
			this.topicCodeableConcept = obj.topicCodeableConcept;
		}

		if (obj.hasOwnProperty('topicReference')) {
			this.topicReference = obj.topicReference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = [];
			for (const o of (obj.subType instanceof Array ? obj.subType : [])) {
				this.subType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('contentDefinition')) {
			this.contentDefinition = obj.contentDefinition;
		}

		if (obj.hasOwnProperty('term')) {
			this.term = [];
			for (const o of (obj.term instanceof Array ? obj.term : [])) {
				this.term.push(new ContractTerm(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('relevantHistory')) {
			this.relevantHistory = [];
			for (const o of (obj.relevantHistory instanceof Array ? obj.relevantHistory : [])) {
				this.relevantHistory.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('signer')) {
			this.signer = [];
			for (const o of (obj.signer instanceof Array ? obj.signer : [])) {
				this.signer.push(new ContractSigner(o));
			}
		}

		if (obj.hasOwnProperty('friendly')) {
			this.friendly = [];
			for (const o of (obj.friendly instanceof Array ? obj.friendly : [])) {
				this.friendly.push(new ContractFriendly(o));
			}
		}

		if (obj.hasOwnProperty('legal')) {
			this.legal = [];
			for (const o of (obj.legal instanceof Array ? obj.legal : [])) {
				this.legal.push(new ContractLegal(o));
			}
		}

		if (obj.hasOwnProperty('rule')) {
			this.rule = [];
			for (const o of (obj.rule instanceof Array ? obj.rule : [])) {
				this.rule.push(new ContractRule(o));
			}
		}

		if (obj.hasOwnProperty('legallyBindingAttachment')) {
			this.legallyBindingAttachment = obj.legallyBindingAttachment;
		}

		if (obj.hasOwnProperty('legallyBindingReference')) {
			this.legallyBindingReference = obj.legallyBindingReference;
		}

	}

  resourceType = 'Contract';
  identifier?: Identifier[];
  url?: string;
  version?: string;
  status?: ContractStatus1;
  legalState?: CodeableConcept;
  instantiatesCanonical?: Reference;
  instantiatesUri?: string;
  contentDerivative?: CodeableConcept;
  issued?: string;
  applies?: Period;
  expirationType?: CodeableConcept;
  subject?: Reference[];
  authority?: Reference[];
  domain?: Reference[];
  site?: Reference[];
  name?: string;
  title?: string;
  subtitle?: string;
  alias?: string[];
  author?: Reference;
  scope?: CodeableConcept;
  topicCodeableConcept?: CodeableConcept;
  topicReference?: Reference;
  type?: CodeableConcept;
  subType?: CodeableConcept[];
  contentDefinition?: ContractContentDefinition;
  term?: ContractTerm[];
  supportingInfo?: Reference[];
  relevantHistory?: Reference[];
  signer?: ContractSigner[];
  friendly?: ContractFriendly[];
  legal?: ContractLegal[];
  rule?: ContractRule[];
  legallyBindingAttachment?: Attachment;
  legallyBindingReference?: Reference;
}

export class CoverageCostToBeneficiaryException extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  type: CodeableConcept;
  period?: Period;
}

export class CoverageCostToBeneficiary extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('exception')) {
			this.exception = [];
			for (const o of (obj.exception instanceof Array ? obj.exception : [])) {
				this.exception.push(new CoverageCostToBeneficiaryException(o));
			}
		}

	}

  type?: CodeableConcept;
  valueQuantity?: Quantity;
  valueMoney?: Money;
  exception?: CoverageCostToBeneficiaryException[];
}

export class CoverageClass extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

	}

  type: CodeableConcept;
  value: string;
  name?: string;
}

export class Coverage extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('policyHolder')) {
			this.policyHolder = obj.policyHolder;
		}

		if (obj.hasOwnProperty('subscriber')) {
			this.subscriber = obj.subscriber;
		}

		if (obj.hasOwnProperty('subscriberId')) {
			this.subscriberId = obj.subscriberId;
		}

		if (obj.hasOwnProperty('beneficiary')) {
			this.beneficiary = obj.beneficiary;
		}

		if (obj.hasOwnProperty('dependent')) {
			this.dependent = obj.dependent;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('payor')) {
			this.payor = [];
			for (const o of (obj.payor instanceof Array ? obj.payor : [])) {
				this.payor.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('class')) {
			this.class = [];
			for (const o of (obj.class instanceof Array ? obj.class : [])) {
				this.class.push(new CoverageClass(o));
			}
		}

		if (obj.hasOwnProperty('order')) {
			this.order = obj.order;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = obj.network;
		}

		if (obj.hasOwnProperty('costToBeneficiary')) {
			this.costToBeneficiary = [];
			for (const o of (obj.costToBeneficiary instanceof Array ? obj.costToBeneficiary : [])) {
				this.costToBeneficiary.push(new CoverageCostToBeneficiary(o));
			}
		}

		if (obj.hasOwnProperty('subrogation')) {
			this.subrogation = obj.subrogation;
		}

		if (obj.hasOwnProperty('contract')) {
			this.contract = [];
			for (const o of (obj.contract instanceof Array ? obj.contract : [])) {
				this.contract.push(new Reference(o));
			}
		}

	}

  resourceType = 'Coverage';
  identifier?: Identifier[];
  status: CoverageStatus1;
  type?: CodeableConcept;
  policyHolder?: Reference;
  subscriber?: Reference;
  subscriberId?: string;
  beneficiary: Reference;
  dependent?: string;
  relationship?: CodeableConcept;
  period?: Period;
  payor: Reference[];
  class?: CoverageClass[];
  order?: number;
  network?: string;
  costToBeneficiary?: CoverageCostToBeneficiary[];
  subrogation?: boolean;
  contract?: Reference[];
}

export class CoverageEligibilityRequestItemDiagnosis extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('diagnosisCodeableConcept')) {
			this.diagnosisCodeableConcept = obj.diagnosisCodeableConcept;
		}

		if (obj.hasOwnProperty('diagnosisReference')) {
			this.diagnosisReference = obj.diagnosisReference;
		}

	}

  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
}

export class CoverageEligibilityRequestItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('supportingInfoSequence')) {
			this.supportingInfoSequence = [];
			for (const o of (obj.supportingInfoSequence instanceof Array ? obj.supportingInfoSequence : [])) {
				this.supportingInfoSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('facility')) {
			this.facility = obj.facility;
		}

		if (obj.hasOwnProperty('diagnosis')) {
			this.diagnosis = [];
			for (const o of (obj.diagnosis instanceof Array ? obj.diagnosis : [])) {
				this.diagnosis.push(new CoverageEligibilityRequestItemDiagnosis(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new Reference(o));
			}
		}

	}

  supportingInfoSequence?: number[];
  category?: CodeableConcept;
  productOrService?: CodeableConcept;
  modifier?: CodeableConcept[];
  provider?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  facility?: Reference;
  diagnosis?: CoverageEligibilityRequestItemDiagnosis[];
  detail?: Reference[];
}

export class CoverageEligibilityRequestInsurance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('focal')) {
			this.focal = obj.focal;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('businessArrangement')) {
			this.businessArrangement = obj.businessArrangement;
		}

	}

  focal?: boolean;
  coverage: Reference;
  businessArrangement?: string;
}

export class CoverageEligibilityRequestSupportingInfo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('information')) {
			this.information = obj.information;
		}

		if (obj.hasOwnProperty('appliesToAll')) {
			this.appliesToAll = obj.appliesToAll;
		}

	}

  sequence: number;
  information: Reference;
  appliesToAll?: boolean;
}

export class CoverageEligibilityRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = [];
			for (const o of (obj.purpose instanceof Array ? obj.purpose : [])) {
				this.purpose.push(o);
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('enterer')) {
			this.enterer = obj.enterer;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('facility')) {
			this.facility = obj.facility;
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new CoverageEligibilityRequestSupportingInfo(o));
			}
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new CoverageEligibilityRequestInsurance(o));
			}
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new CoverageEligibilityRequestItem(o));
			}
		}

	}

  resourceType = 'CoverageEligibilityRequest';
  identifier?: Identifier[];
  status: CoverageEligibilityRequestStatus1;
  priority?: CodeableConcept;
  purpose: CoverageEligibilityRequestPurpose1[];
  patient: Reference;
  servicedDate?: string;
  servicedPeriod?: Period;
  created: string;
  enterer?: Reference;
  provider?: Reference;
  insurer: Reference;
  facility?: Reference;
  supportingInfo?: CoverageEligibilityRequestSupportingInfo[];
  insurance?: CoverageEligibilityRequestInsurance[];
  item?: CoverageEligibilityRequestItem[];
}

export class CoverageEligibilityResponseError extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

	}

  code: CodeableConcept;
}

export class CoverageEligibilityResponseInsuranceItemBenefit extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('allowedUnsignedInt')) {
			this.allowedUnsignedInt = obj.allowedUnsignedInt;
		}

		if (obj.hasOwnProperty('allowedString')) {
			this.allowedString = obj.allowedString;
		}

		if (obj.hasOwnProperty('allowedMoney')) {
			this.allowedMoney = obj.allowedMoney;
		}

		if (obj.hasOwnProperty('usedUnsignedInt')) {
			this.usedUnsignedInt = obj.usedUnsignedInt;
		}

		if (obj.hasOwnProperty('usedString')) {
			this.usedString = obj.usedString;
		}

		if (obj.hasOwnProperty('usedMoney')) {
			this.usedMoney = obj.usedMoney;
		}

	}

  type: CodeableConcept;
  allowedUnsignedInt?: number;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: number;
  usedString?: string;
  usedMoney?: Money;
}

export class CoverageEligibilityResponseInsuranceItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('excluded')) {
			this.excluded = obj.excluded;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = obj.network;
		}

		if (obj.hasOwnProperty('unit')) {
			this.unit = obj.unit;
		}

		if (obj.hasOwnProperty('term')) {
			this.term = obj.term;
		}

		if (obj.hasOwnProperty('benefit')) {
			this.benefit = [];
			for (const o of (obj.benefit instanceof Array ? obj.benefit : [])) {
				this.benefit.push(new CoverageEligibilityResponseInsuranceItemBenefit(o));
			}
		}

		if (obj.hasOwnProperty('authorizationRequired')) {
			this.authorizationRequired = obj.authorizationRequired;
		}

		if (obj.hasOwnProperty('authorizationSupporting')) {
			this.authorizationSupporting = [];
			for (const o of (obj.authorizationSupporting instanceof Array ? obj.authorizationSupporting : [])) {
				this.authorizationSupporting.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('authorizationUrl')) {
			this.authorizationUrl = obj.authorizationUrl;
		}

	}

  category?: CodeableConcept;
  productOrService?: CodeableConcept;
  modifier?: CodeableConcept[];
  provider?: Reference;
  excluded?: boolean;
  name?: string;
  description?: string;
  network?: CodeableConcept;
  unit?: CodeableConcept;
  term?: CodeableConcept;
  benefit?: CoverageEligibilityResponseInsuranceItemBenefit[];
  authorizationRequired?: boolean;
  authorizationSupporting?: CodeableConcept[];
  authorizationUrl?: string;
}

export class CoverageEligibilityResponseInsurance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('inforce')) {
			this.inforce = obj.inforce;
		}

		if (obj.hasOwnProperty('benefitPeriod')) {
			this.benefitPeriod = obj.benefitPeriod;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new CoverageEligibilityResponseInsuranceItem(o));
			}
		}

	}

  coverage: Reference;
  inforce?: boolean;
  benefitPeriod?: Period;
  item?: CoverageEligibilityResponseInsuranceItem[];
}

export class CoverageEligibilityResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = [];
			for (const o of (obj.purpose instanceof Array ? obj.purpose : [])) {
				this.purpose.push(o);
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('requestor')) {
			this.requestor = obj.requestor;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('disposition')) {
			this.disposition = obj.disposition;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new CoverageEligibilityResponseInsurance(o));
			}
		}

		if (obj.hasOwnProperty('preAuthRef')) {
			this.preAuthRef = obj.preAuthRef;
		}

		if (obj.hasOwnProperty('form')) {
			this.form = obj.form;
		}

		if (obj.hasOwnProperty('error')) {
			this.error = [];
			for (const o of (obj.error instanceof Array ? obj.error : [])) {
				this.error.push(new CoverageEligibilityResponseError(o));
			}
		}

	}

  resourceType = 'CoverageEligibilityResponse';
  identifier?: Identifier[];
  status: CoverageEligibilityResponseStatus1;
  purpose: CoverageEligibilityResponsePurpose1[];
  patient: Reference;
  servicedDate?: string;
  servicedPeriod?: Period;
  created: string;
  requestor?: Reference;
  request: Reference;
  outcome: CoverageEligibilityResponseOutcome1;
  disposition?: string;
  insurer: Reference;
  insurance?: CoverageEligibilityResponseInsurance[];
  preAuthRef?: string;
  form?: CodeableConcept;
  error?: CoverageEligibilityResponseError[];
}

export class DetectedIssueMitigation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = obj.action;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

	}

  action: CodeableConcept;
  date?: string;
  author?: Reference;
}

export class DetectedIssueEvidence extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new Reference(o));
			}
		}

	}

  code?: CodeableConcept[];
  detail?: Reference[];
}

export class DetectedIssue extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('identifiedDateTime')) {
			this.identifiedDateTime = obj.identifiedDateTime;
		}

		if (obj.hasOwnProperty('identifiedPeriod')) {
			this.identifiedPeriod = obj.identifiedPeriod;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('implicated')) {
			this.implicated = [];
			for (const o of (obj.implicated instanceof Array ? obj.implicated : [])) {
				this.implicated.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('evidence')) {
			this.evidence = [];
			for (const o of (obj.evidence instanceof Array ? obj.evidence : [])) {
				this.evidence.push(new DetectedIssueEvidence(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = obj.detail;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('mitigation')) {
			this.mitigation = [];
			for (const o of (obj.mitigation instanceof Array ? obj.mitigation : [])) {
				this.mitigation.push(new DetectedIssueMitigation(o));
			}
		}

	}

  resourceType = 'DetectedIssue';
  identifier?: Identifier[];
  status: DetectedIssueStatus1;
  code?: CodeableConcept;
  severity?: DetectedIssueSeverity1;
  patient?: Reference;
  identifiedDateTime?: string;
  identifiedPeriod?: Period;
  author?: Reference;
  implicated?: Reference[];
  evidence?: DetectedIssueEvidence[];
  detail?: string;
  reference?: string;
  mitigation?: DetectedIssueMitigation[];
}

export class DeviceProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = [];
			for (const o of (obj.valueQuantity instanceof Array ? obj.valueQuantity : [])) {
				this.valueQuantity.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = [];
			for (const o of (obj.valueCode instanceof Array ? obj.valueCode : [])) {
				this.valueCode.push(new CodeableConcept(o));
			}
		}

	}

  type: CodeableConcept;
  valueQuantity?: Quantity[];
  valueCode?: CodeableConcept[];
}

export class DeviceVersion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('component')) {
			this.component = obj.component;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  type?: CodeableConcept;
  component?: Identifier;
  value: string;
}

export class DeviceSpecialization extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('systemType')) {
			this.systemType = obj.systemType;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

	}

  systemType: CodeableConcept;
  version?: string;
}

export class DeviceDeviceName extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  name: string;
  type: DeviceType1;
}

export class DeviceUdiCarrier extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('deviceIdentifier')) {
			this.deviceIdentifier = obj.deviceIdentifier;
		}

		if (obj.hasOwnProperty('issuer')) {
			this.issuer = obj.issuer;
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = obj.jurisdiction;
		}

		if (obj.hasOwnProperty('carrierAIDC')) {
			this.carrierAIDC = obj.carrierAIDC;
		}

		if (obj.hasOwnProperty('carrierHRF')) {
			this.carrierHRF = obj.carrierHRF;
		}

		if (obj.hasOwnProperty('entryType')) {
			this.entryType = obj.entryType;
		}

	}

  deviceIdentifier?: string;
  issuer?: string;
  jurisdiction?: string;
  carrierAIDC?: string;
  carrierHRF?: string;
  entryType?: DeviceEntryType1;
}

export class Device extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('udiCarrier')) {
			this.udiCarrier = [];
			for (const o of (obj.udiCarrier instanceof Array ? obj.udiCarrier : [])) {
				this.udiCarrier.push(new DeviceUdiCarrier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = [];
			for (const o of (obj.statusReason instanceof Array ? obj.statusReason : [])) {
				this.statusReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('distinctIdentifier')) {
			this.distinctIdentifier = obj.distinctIdentifier;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = obj.manufacturer;
		}

		if (obj.hasOwnProperty('manufactureDate')) {
			this.manufactureDate = obj.manufactureDate;
		}

		if (obj.hasOwnProperty('expirationDate')) {
			this.expirationDate = obj.expirationDate;
		}

		if (obj.hasOwnProperty('lotNumber')) {
			this.lotNumber = obj.lotNumber;
		}

		if (obj.hasOwnProperty('serialNumber')) {
			this.serialNumber = obj.serialNumber;
		}

		if (obj.hasOwnProperty('deviceName')) {
			this.deviceName = [];
			for (const o of (obj.deviceName instanceof Array ? obj.deviceName : [])) {
				this.deviceName.push(new DeviceDeviceName(o));
			}
		}

		if (obj.hasOwnProperty('modelNumber')) {
			this.modelNumber = obj.modelNumber;
		}

		if (obj.hasOwnProperty('partNumber')) {
			this.partNumber = obj.partNumber;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('specialization')) {
			this.specialization = [];
			for (const o of (obj.specialization instanceof Array ? obj.specialization : [])) {
				this.specialization.push(new DeviceSpecialization(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = [];
			for (const o of (obj.version instanceof Array ? obj.version : [])) {
				this.version.push(new DeviceVersion(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new DeviceProperty(o));
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('owner')) {
			this.owner = obj.owner;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('safety')) {
			this.safety = [];
			for (const o of (obj.safety instanceof Array ? obj.safety : [])) {
				this.safety.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = obj.parent;
		}

	}

  resourceType = 'Device';
  identifier?: Identifier[];
  definition?: Reference;
  udiCarrier?: DeviceUdiCarrier[];
  status?: DeviceStatus1;
  statusReason?: CodeableConcept[];
  distinctIdentifier?: string;
  manufacturer?: string;
  manufactureDate?: string;
  expirationDate?: string;
  lotNumber?: string;
  serialNumber?: string;
  deviceName?: DeviceDeviceName[];
  modelNumber?: string;
  partNumber?: string;
  type?: CodeableConcept;
  specialization?: DeviceSpecialization[];
  version?: DeviceVersion[];
  property?: DeviceProperty[];
  patient?: Reference;
  owner?: Reference;
  contact?: ContactPoint[];
  location?: Reference;
  url?: string;
  note?: Annotation[];
  safety?: CodeableConcept[];
  parent?: Reference;
}

export class DeviceDefinitionMaterial extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('substance')) {
			this.substance = obj.substance;
		}

		if (obj.hasOwnProperty('alternate')) {
			this.alternate = obj.alternate;
		}

		if (obj.hasOwnProperty('allergenicIndicator')) {
			this.allergenicIndicator = obj.allergenicIndicator;
		}

	}

  substance: CodeableConcept;
  alternate?: boolean;
  allergenicIndicator?: boolean;
}

export class DeviceDefinitionProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = [];
			for (const o of (obj.valueQuantity instanceof Array ? obj.valueQuantity : [])) {
				this.valueQuantity.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = [];
			for (const o of (obj.valueCode instanceof Array ? obj.valueCode : [])) {
				this.valueCode.push(new CodeableConcept(o));
			}
		}

	}

  type: CodeableConcept;
  valueQuantity?: Quantity[];
  valueCode?: CodeableConcept[];
}

export class DeviceDefinitionCapability extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = [];
			for (const o of (obj.description instanceof Array ? obj.description : [])) {
				this.description.push(new CodeableConcept(o));
			}
		}

	}

  type: CodeableConcept;
  description?: CodeableConcept[];
}

export class DeviceDefinitionSpecialization extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('systemType')) {
			this.systemType = obj.systemType;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

	}

  systemType: string;
  version?: string;
}

export class DeviceDefinitionDeviceName extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  name: string;
  type: DeviceDefinitionType1;
}

export class DeviceDefinitionUdiDeviceIdentifier extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('deviceIdentifier')) {
			this.deviceIdentifier = obj.deviceIdentifier;
		}

		if (obj.hasOwnProperty('issuer')) {
			this.issuer = obj.issuer;
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = obj.jurisdiction;
		}

	}

  deviceIdentifier: string;
  issuer: string;
  jurisdiction: string;
}

export class DeviceDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('udiDeviceIdentifier')) {
			this.udiDeviceIdentifier = [];
			for (const o of (obj.udiDeviceIdentifier instanceof Array ? obj.udiDeviceIdentifier : [])) {
				this.udiDeviceIdentifier.push(new DeviceDefinitionUdiDeviceIdentifier(o));
			}
		}

		if (obj.hasOwnProperty('manufacturerString')) {
			this.manufacturerString = obj.manufacturerString;
		}

		if (obj.hasOwnProperty('manufacturerReference')) {
			this.manufacturerReference = obj.manufacturerReference;
		}

		if (obj.hasOwnProperty('deviceName')) {
			this.deviceName = [];
			for (const o of (obj.deviceName instanceof Array ? obj.deviceName : [])) {
				this.deviceName.push(new DeviceDefinitionDeviceName(o));
			}
		}

		if (obj.hasOwnProperty('modelNumber')) {
			this.modelNumber = obj.modelNumber;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('specialization')) {
			this.specialization = [];
			for (const o of (obj.specialization instanceof Array ? obj.specialization : [])) {
				this.specialization.push(new DeviceDefinitionSpecialization(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = [];
			for (const o of (obj.version instanceof Array ? obj.version : [])) {
				this.version.push(o);
			}
		}

		if (obj.hasOwnProperty('safety')) {
			this.safety = [];
			for (const o of (obj.safety instanceof Array ? obj.safety : [])) {
				this.safety.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('shelfLifeStorage')) {
			this.shelfLifeStorage = [];
			for (const o of (obj.shelfLifeStorage instanceof Array ? obj.shelfLifeStorage : [])) {
				this.shelfLifeStorage.push(new ProductShelfLife(o));
			}
		}

		if (obj.hasOwnProperty('physicalCharacteristics')) {
			this.physicalCharacteristics = obj.physicalCharacteristics;
		}

		if (obj.hasOwnProperty('languageCode')) {
			this.languageCode = [];
			for (const o of (obj.languageCode instanceof Array ? obj.languageCode : [])) {
				this.languageCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('capability')) {
			this.capability = [];
			for (const o of (obj.capability instanceof Array ? obj.capability : [])) {
				this.capability.push(new DeviceDefinitionCapability(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new DeviceDefinitionProperty(o));
			}
		}

		if (obj.hasOwnProperty('owner')) {
			this.owner = obj.owner;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('onlineInformation')) {
			this.onlineInformation = obj.onlineInformation;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('parentDevice')) {
			this.parentDevice = obj.parentDevice;
		}

		if (obj.hasOwnProperty('material')) {
			this.material = [];
			for (const o of (obj.material instanceof Array ? obj.material : [])) {
				this.material.push(new DeviceDefinitionMaterial(o));
			}
		}

	}

  resourceType = 'DeviceDefinition';
  identifier?: Identifier[];
  udiDeviceIdentifier?: DeviceDefinitionUdiDeviceIdentifier[];
  manufacturerString?: string;
  manufacturerReference?: Reference;
  deviceName?: DeviceDefinitionDeviceName[];
  modelNumber?: string;
  type?: CodeableConcept;
  specialization?: DeviceDefinitionSpecialization[];
  version?: string[];
  safety?: CodeableConcept[];
  shelfLifeStorage?: ProductShelfLife[];
  physicalCharacteristics?: ProdCharacteristic;
  languageCode?: CodeableConcept[];
  capability?: DeviceDefinitionCapability[];
  property?: DeviceDefinitionProperty[];
  owner?: Reference;
  contact?: ContactPoint[];
  url?: string;
  onlineInformation?: string;
  note?: Annotation[];
  quantity?: Quantity;
  parentDevice?: Reference;
  material?: DeviceDefinitionMaterial[];
}

export class DeviceMetricCalibration extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('state')) {
			this.state = obj.state;
		}

		if (obj.hasOwnProperty('time')) {
			this.time = obj.time;
		}

	}

  type?: DeviceMetricType1;
  state?: DeviceMetricState1;
  time?: string;
}

export class DeviceMetric extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('unit')) {
			this.unit = obj.unit;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = obj.parent;
		}

		if (obj.hasOwnProperty('operationalStatus')) {
			this.operationalStatus = obj.operationalStatus;
		}

		if (obj.hasOwnProperty('color')) {
			this.color = obj.color;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('measurementPeriod')) {
			this.measurementPeriod = obj.measurementPeriod;
		}

		if (obj.hasOwnProperty('calibration')) {
			this.calibration = [];
			for (const o of (obj.calibration instanceof Array ? obj.calibration : [])) {
				this.calibration.push(new DeviceMetricCalibration(o));
			}
		}

	}

  resourceType = 'DeviceMetric';
  identifier?: Identifier[];
  type: CodeableConcept;
  unit?: CodeableConcept;
  source?: Reference;
  parent?: Reference;
  operationalStatus?: DeviceMetricOperationalStatus1;
  color?: DeviceMetricColor1;
  category: DeviceMetricCategory1;
  measurementPeriod?: Timing;
  calibration?: DeviceMetricCalibration[];
}

export class DeviceRequestParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

	}

  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}

export class DeviceRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('priorRequest')) {
			this.priorRequest = [];
			for (const o of (obj.priorRequest instanceof Array ? obj.priorRequest : [])) {
				this.priorRequest.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('groupIdentifier')) {
			this.groupIdentifier = obj.groupIdentifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('codeReference')) {
			this.codeReference = obj.codeReference;
		}

		if (obj.hasOwnProperty('codeCodeableConcept')) {
			this.codeCodeableConcept = obj.codeCodeableConcept;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new DeviceRequestParameter(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('performerType')) {
			this.performerType = obj.performerType;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('relevantHistory')) {
			this.relevantHistory = [];
			for (const o of (obj.relevantHistory instanceof Array ? obj.relevantHistory : [])) {
				this.relevantHistory.push(new Reference(o));
			}
		}

	}

  resourceType = 'DeviceRequest';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  priorRequest?: Reference[];
  groupIdentifier?: Identifier;
  status?: DeviceRequestStatus1;
  intent: DeviceRequestIntent1;
  priority?: DeviceRequestPriority1;
  codeReference?: Reference;
  codeCodeableConcept?: CodeableConcept;
  parameter?: DeviceRequestParameter[];
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  authoredOn?: string;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
}

export class DeviceUseStatement extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = [];
			for (const o of (obj.derivedFrom instanceof Array ? obj.derivedFrom : [])) {
				this.derivedFrom.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('timingTiming')) {
			this.timingTiming = obj.timingTiming;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('timingDateTime')) {
			this.timingDateTime = obj.timingDateTime;
		}

		if (obj.hasOwnProperty('recordedOn')) {
			this.recordedOn = obj.recordedOn;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'DeviceUseStatement';
  identifier?: Identifier[];
  basedOn?: Reference[];
  status: DeviceUseStatementStatus1;
  subject: Reference;
  derivedFrom?: Reference[];
  timingTiming?: Timing;
  timingPeriod?: Period;
  timingDateTime?: string;
  recordedOn?: string;
  source?: Reference;
  device: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  bodySite?: CodeableConcept;
  note?: Annotation[];
}

export class DiagnosticReportMedia extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = obj.link;
		}

	}

  comment?: string;
  link: Reference;
}

export class DiagnosticReport extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('effectiveDateTime')) {
			this.effectiveDateTime = obj.effectiveDateTime;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('resultsInterpreter')) {
			this.resultsInterpreter = [];
			for (const o of (obj.resultsInterpreter instanceof Array ? obj.resultsInterpreter : [])) {
				this.resultsInterpreter.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('specimen')) {
			this.specimen = [];
			for (const o of (obj.specimen instanceof Array ? obj.specimen : [])) {
				this.specimen.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('result')) {
			this.result = [];
			for (const o of (obj.result instanceof Array ? obj.result : [])) {
				this.result.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('imagingStudy')) {
			this.imagingStudy = [];
			for (const o of (obj.imagingStudy instanceof Array ? obj.imagingStudy : [])) {
				this.imagingStudy.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('media')) {
			this.media = [];
			for (const o of (obj.media instanceof Array ? obj.media : [])) {
				this.media.push(new DiagnosticReportMedia(o));
			}
		}

		if (obj.hasOwnProperty('conclusion')) {
			this.conclusion = obj.conclusion;
		}

		if (obj.hasOwnProperty('conclusionCode')) {
			this.conclusionCode = [];
			for (const o of (obj.conclusionCode instanceof Array ? obj.conclusionCode : [])) {
				this.conclusionCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('presentedForm')) {
			this.presentedForm = [];
			for (const o of (obj.presentedForm instanceof Array ? obj.presentedForm : [])) {
				this.presentedForm.push(new Attachment(o));
			}
		}

	}

  resourceType = 'DiagnosticReport';
  identifier?: Identifier[];
  basedOn?: Reference[];
  status: DiagnosticReportStatus1;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string;
  performer?: Reference[];
  resultsInterpreter?: Reference[];
  specimen?: Reference[];
  result?: Reference[];
  imagingStudy?: Reference[];
  media?: DiagnosticReportMedia[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
}

export class DocumentManifestRelated extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('ref')) {
			this.ref = obj.ref;
		}

	}

  identifier?: Identifier;
  ref?: Reference;
}

export class DocumentManifest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('masterIdentifier')) {
			this.masterIdentifier = obj.masterIdentifier;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = [];
			for (const o of (obj.recipient instanceof Array ? obj.recipient : [])) {
				this.recipient.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('content')) {
			this.content = [];
			for (const o of (obj.content instanceof Array ? obj.content : [])) {
				this.content.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('related')) {
			this.related = [];
			for (const o of (obj.related instanceof Array ? obj.related : [])) {
				this.related.push(new DocumentManifestRelated(o));
			}
		}

	}

  resourceType = 'DocumentManifest';
  masterIdentifier?: Identifier;
  identifier?: Identifier[];
  status: DocumentManifestStatus1;
  type?: CodeableConcept;
  subject?: Reference;
  created?: string;
  author?: Reference[];
  recipient?: Reference[];
  source?: string;
  description?: string;
  content: Reference[];
  related?: DocumentManifestRelated[];
}

export class DocumentReferenceContext extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = [];
			for (const o of (obj.encounter instanceof Array ? obj.encounter : [])) {
				this.encounter.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('event')) {
			this.event = [];
			for (const o of (obj.event instanceof Array ? obj.event : [])) {
				this.event.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('facilityType')) {
			this.facilityType = obj.facilityType;
		}

		if (obj.hasOwnProperty('practiceSetting')) {
			this.practiceSetting = obj.practiceSetting;
		}

		if (obj.hasOwnProperty('sourcePatientInfo')) {
			this.sourcePatientInfo = obj.sourcePatientInfo;
		}

		if (obj.hasOwnProperty('related')) {
			this.related = [];
			for (const o of (obj.related instanceof Array ? obj.related : [])) {
				this.related.push(new Reference(o));
			}
		}

	}

  encounter?: Reference[];
  event?: CodeableConcept[];
  period?: Period;
  facilityType?: CodeableConcept;
  practiceSetting?: CodeableConcept;
  sourcePatientInfo?: Reference;
  related?: Reference[];
}

export class DocumentReferenceContent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('attachment')) {
			this.attachment = obj.attachment;
		}

		if (obj.hasOwnProperty('format')) {
			this.format = obj.format;
		}

	}

  attachment: Attachment;
  format?: Coding;
}

export class DocumentReferenceRelatesTo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = obj.target;
		}

	}

  code: DocumentReferenceCode1;
  target: Reference;
}

export class DocumentReference extends DomainResource implements IFhir.IDocumentReference {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('masterIdentifier')) {
			this.masterIdentifier = obj.masterIdentifier;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('docStatus')) {
			this.docStatus = obj.docStatus;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('authenticator')) {
			this.authenticator = obj.authenticator;
		}

		if (obj.hasOwnProperty('custodian')) {
			this.custodian = obj.custodian;
		}

		if (obj.hasOwnProperty('relatesTo')) {
			this.relatesTo = [];
			for (const o of (obj.relatesTo instanceof Array ? obj.relatesTo : [])) {
				this.relatesTo.push(new DocumentReferenceRelatesTo(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('securityLabel')) {
			this.securityLabel = [];
			for (const o of (obj.securityLabel instanceof Array ? obj.securityLabel : [])) {
				this.securityLabel.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('content')) {
			this.content = [];
			for (const o of (obj.content instanceof Array ? obj.content : [])) {
				this.content.push(new DocumentReferenceContent(o));
			}
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

	}

  resourceType = 'DocumentReference';
  masterIdentifier?: Identifier;
  identifier?: Identifier[];
  status: DocumentReferenceStatus1;
  docStatus?: DocumentReferenceDocStatus1;
  type?: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  date?: string;
  author?: Reference[];
  authenticator?: Reference;
  custodian?: Reference;
  relatesTo?: DocumentReferenceRelatesTo[];
  description?: string;
  securityLabel?: CodeableConcept[];
  content: DocumentReferenceContent[];
  context?: DocumentReferenceContext;
}

export class EncounterLocation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('physicalType')) {
			this.physicalType = obj.physicalType;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  location: Reference;
  status?: EncounterStatus3;
  physicalType?: CodeableConcept;
  period?: Period;
}

export class EncounterHospitalization extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('preAdmissionIdentifier')) {
			this.preAdmissionIdentifier = obj.preAdmissionIdentifier;
		}

		if (obj.hasOwnProperty('origin')) {
			this.origin = obj.origin;
		}

		if (obj.hasOwnProperty('admitSource')) {
			this.admitSource = obj.admitSource;
		}

		if (obj.hasOwnProperty('reAdmission')) {
			this.reAdmission = obj.reAdmission;
		}

		if (obj.hasOwnProperty('dietPreference')) {
			this.dietPreference = [];
			for (const o of (obj.dietPreference instanceof Array ? obj.dietPreference : [])) {
				this.dietPreference.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialCourtesy')) {
			this.specialCourtesy = [];
			for (const o of (obj.specialCourtesy instanceof Array ? obj.specialCourtesy : [])) {
				this.specialCourtesy.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialArrangement')) {
			this.specialArrangement = [];
			for (const o of (obj.specialArrangement instanceof Array ? obj.specialArrangement : [])) {
				this.specialArrangement.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = obj.destination;
		}

		if (obj.hasOwnProperty('dischargeDisposition')) {
			this.dischargeDisposition = obj.dischargeDisposition;
		}

	}

  preAdmissionIdentifier?: Identifier;
  origin?: Reference;
  admitSource?: CodeableConcept;
  reAdmission?: CodeableConcept;
  dietPreference?: CodeableConcept[];
  specialCourtesy?: CodeableConcept[];
  specialArrangement?: CodeableConcept[];
  destination?: Reference;
  dischargeDisposition?: CodeableConcept;
}

export class EncounterDiagnosis extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('rank')) {
			this.rank = obj.rank;
		}

	}

  condition: Reference;
  use?: CodeableConcept;
  rank?: number;
}

export class EncounterParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('individual')) {
			this.individual = obj.individual;
		}

	}

  type?: CodeableConcept[];
  period?: Period;
  individual?: Reference;
}

export class EncounterClassHistory extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('class')) {
			this.class = obj.class;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  class: Coding;
  period: Period;
}

export class EncounterStatusHistory extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  status: EncounterStatus2;
  period: Period;
}

export class Encounter extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusHistory')) {
			this.statusHistory = [];
			for (const o of (obj.statusHistory instanceof Array ? obj.statusHistory : [])) {
				this.statusHistory.push(new EncounterStatusHistory(o));
			}
		}

		if (obj.hasOwnProperty('class')) {
			this.class = obj.class;
		}

		if (obj.hasOwnProperty('classHistory')) {
			this.classHistory = [];
			for (const o of (obj.classHistory instanceof Array ? obj.classHistory : [])) {
				this.classHistory.push(new EncounterClassHistory(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('serviceType')) {
			this.serviceType = obj.serviceType;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('episodeOfCare')) {
			this.episodeOfCare = [];
			for (const o of (obj.episodeOfCare instanceof Array ? obj.episodeOfCare : [])) {
				this.episodeOfCare.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new EncounterParticipant(o));
			}
		}

		if (obj.hasOwnProperty('appointment')) {
			this.appointment = [];
			for (const o of (obj.appointment instanceof Array ? obj.appointment : [])) {
				this.appointment.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('length')) {
			this.length = obj.length;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('diagnosis')) {
			this.diagnosis = [];
			for (const o of (obj.diagnosis instanceof Array ? obj.diagnosis : [])) {
				this.diagnosis.push(new EncounterDiagnosis(o));
			}
		}

		if (obj.hasOwnProperty('account')) {
			this.account = [];
			for (const o of (obj.account instanceof Array ? obj.account : [])) {
				this.account.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('hospitalization')) {
			this.hospitalization = obj.hospitalization;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(new EncounterLocation(o));
			}
		}

		if (obj.hasOwnProperty('serviceProvider')) {
			this.serviceProvider = obj.serviceProvider;
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = obj.partOf;
		}

	}

  resourceType = 'Encounter';
  identifier?: Identifier[];
  status: EncounterStatus1;
  statusHistory?: EncounterStatusHistory[];
  class: Coding;
  classHistory?: EncounterClassHistory[];
  type?: CodeableConcept[];
  serviceType?: CodeableConcept;
  priority?: CodeableConcept;
  subject?: Reference;
  episodeOfCare?: Reference[];
  basedOn?: Reference[];
  participant?: EncounterParticipant[];
  appointment?: Reference[];
  period?: Period;
  length?: Duration;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  diagnosis?: EncounterDiagnosis[];
  account?: Reference[];
  hospitalization?: EncounterHospitalization;
  location?: EncounterLocation[];
  serviceProvider?: Reference;
  partOf?: Reference;
}

export class Endpoint extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('connectionType')) {
			this.connectionType = obj.connectionType;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = obj.managingOrganization;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('payloadType')) {
			this.payloadType = [];
			for (const o of (obj.payloadType instanceof Array ? obj.payloadType : [])) {
				this.payloadType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('payloadMimeType')) {
			this.payloadMimeType = [];
			for (const o of (obj.payloadMimeType instanceof Array ? obj.payloadMimeType : [])) {
				this.payloadMimeType.push(o);
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

		if (obj.hasOwnProperty('header')) {
			this.header = [];
			for (const o of (obj.header instanceof Array ? obj.header : [])) {
				this.header.push(o);
			}
		}

	}

  resourceType = 'Endpoint';
  identifier?: Identifier[];
  status: EndpointStatus1;
  connectionType: Coding;
  name?: string;
  managingOrganization?: Reference;
  contact?: ContactPoint[];
  period?: Period;
  payloadType: CodeableConcept[];
  payloadMimeType?: string[];
  address: string;
  header?: string[];
}

export class EnrollmentRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('candidate')) {
			this.candidate = obj.candidate;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

	}

  resourceType = 'EnrollmentRequest';
  identifier?: Identifier[];
  status?: EnrollmentRequestStatus1;
  created?: string;
  insurer?: Reference;
  provider?: Reference;
  candidate?: Reference;
  coverage?: Reference;
}

export class EnrollmentResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('disposition')) {
			this.disposition = obj.disposition;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('requestProvider')) {
			this.requestProvider = obj.requestProvider;
		}

	}

  resourceType = 'EnrollmentResponse';
  identifier?: Identifier[];
  status?: EnrollmentResponseStatus1;
  request?: Reference;
  outcome?: EnrollmentResponseOutcome1;
  disposition?: string;
  created?: string;
  organization?: Reference;
  requestProvider?: Reference;
}

export class EpisodeOfCareDiagnosis extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('rank')) {
			this.rank = obj.rank;
		}

	}

  condition: Reference;
  role?: CodeableConcept;
  rank?: number;
}

export class EpisodeOfCareStatusHistory extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  status: EpisodeOfCareStatus2;
  period: Period;
}

export class EpisodeOfCare extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusHistory')) {
			this.statusHistory = [];
			for (const o of (obj.statusHistory instanceof Array ? obj.statusHistory : [])) {
				this.statusHistory.push(new EpisodeOfCareStatusHistory(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('diagnosis')) {
			this.diagnosis = [];
			for (const o of (obj.diagnosis instanceof Array ? obj.diagnosis : [])) {
				this.diagnosis.push(new EpisodeOfCareDiagnosis(o));
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = obj.managingOrganization;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('referralRequest')) {
			this.referralRequest = [];
			for (const o of (obj.referralRequest instanceof Array ? obj.referralRequest : [])) {
				this.referralRequest.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('careManager')) {
			this.careManager = obj.careManager;
		}

		if (obj.hasOwnProperty('team')) {
			this.team = [];
			for (const o of (obj.team instanceof Array ? obj.team : [])) {
				this.team.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('account')) {
			this.account = [];
			for (const o of (obj.account instanceof Array ? obj.account : [])) {
				this.account.push(new Reference(o));
			}
		}

	}

  resourceType = 'EpisodeOfCare';
  identifier?: Identifier[];
  status: EpisodeOfCareStatus1;
  statusHistory?: EpisodeOfCareStatusHistory[];
  type?: CodeableConcept[];
  diagnosis?: EpisodeOfCareDiagnosis[];
  patient: Reference;
  managingOrganization?: Reference;
  period?: Period;
  referralRequest?: Reference[];
  careManager?: Reference;
  team?: Reference[];
  account?: Reference[];
}

export class EventDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('trigger')) {
			this.trigger = [];
			for (const o of (obj.trigger instanceof Array ? obj.trigger : [])) {
				this.trigger.push(new TriggerDefinition(o));
			}
		}

	}

  resourceType = 'EventDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: EventDefinitionStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  trigger: TriggerDefinition[];
}

export class EvidenceCertainty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('rating')) {
			this.rating = obj.rating;
		}

		if (obj.hasOwnProperty('rater')) {
			this.rater = obj.rater;
		}

		if (obj.hasOwnProperty('subcomponent')) {
			this.subcomponent = [];
			for (const o of (obj.subcomponent instanceof Array ? obj.subcomponent : [])) {
				this.subcomponent.push(new EvidenceCertainty(o));
			}
		}

	}

  description?: string;
  note?: Annotation[];
  type?: CodeableConcept;
  rating?: CodeableConcept;
  rater?: string;
  subcomponent?: EvidenceCertainty[];
}

export class EvidenceStatisticModelCharacteristicVariable extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('variableDefinition')) {
			this.variableDefinition = obj.variableDefinition;
		}

		if (obj.hasOwnProperty('handling')) {
			this.handling = obj.handling;
		}

		if (obj.hasOwnProperty('valueCategory')) {
			this.valueCategory = [];
			for (const o of (obj.valueCategory instanceof Array ? obj.valueCategory : [])) {
				this.valueCategory.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = [];
			for (const o of (obj.valueQuantity instanceof Array ? obj.valueQuantity : [])) {
				this.valueQuantity.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = [];
			for (const o of (obj.valueRange instanceof Array ? obj.valueRange : [])) {
				this.valueRange.push(new Range(o));
			}
		}

	}

  variableDefinition: Reference;
  handling?: EvidenceHandling1;
  valueCategory?: CodeableConcept[];
  valueQuantity?: Quantity[];
  valueRange?: Range[];
}

export class EvidenceStatisticModelCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('variable')) {
			this.variable = [];
			for (const o of (obj.variable instanceof Array ? obj.variable : [])) {
				this.variable.push(new EvidenceStatisticModelCharacteristicVariable(o));
			}
		}

		if (obj.hasOwnProperty('attributeEstimate')) {
			this.attributeEstimate = [];
			for (const o of (obj.attributeEstimate instanceof Array ? obj.attributeEstimate : [])) {
				this.attributeEstimate.push(new EvidenceStatisticAttributeEstimate(o));
			}
		}

	}

  code: CodeableConcept;
  value?: Quantity;
  variable?: EvidenceStatisticModelCharacteristicVariable[];
  attributeEstimate?: EvidenceStatisticAttributeEstimate[];
}

export class EvidenceStatisticAttributeEstimate extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('level')) {
			this.level = obj.level;
		}

		if (obj.hasOwnProperty('range')) {
			this.range = obj.range;
		}

		if (obj.hasOwnProperty('attributeEstimate')) {
			this.attributeEstimate = [];
			for (const o of (obj.attributeEstimate instanceof Array ? obj.attributeEstimate : [])) {
				this.attributeEstimate.push(new EvidenceStatisticAttributeEstimate(o));
			}
		}

	}

  description?: string;
  note?: Annotation[];
  type?: CodeableConcept;
  quantity?: Quantity;
  level?: number;
  range?: Range;
  attributeEstimate?: EvidenceStatisticAttributeEstimate[];
}

export class EvidenceStatisticSampleSize extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('numberOfStudies')) {
			this.numberOfStudies = obj.numberOfStudies;
		}

		if (obj.hasOwnProperty('numberOfParticipants')) {
			this.numberOfParticipants = obj.numberOfParticipants;
		}

		if (obj.hasOwnProperty('knownDataCount')) {
			this.knownDataCount = obj.knownDataCount;
		}

	}

  description?: string;
  note?: Annotation[];
  numberOfStudies?: number;
  numberOfParticipants?: number;
  knownDataCount?: number;
}

export class EvidenceStatistic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('statisticType')) {
			this.statisticType = obj.statisticType;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('numberOfEvents')) {
			this.numberOfEvents = obj.numberOfEvents;
		}

		if (obj.hasOwnProperty('numberAffected')) {
			this.numberAffected = obj.numberAffected;
		}

		if (obj.hasOwnProperty('sampleSize')) {
			this.sampleSize = obj.sampleSize;
		}

		if (obj.hasOwnProperty('attributeEstimate')) {
			this.attributeEstimate = [];
			for (const o of (obj.attributeEstimate instanceof Array ? obj.attributeEstimate : [])) {
				this.attributeEstimate.push(new EvidenceStatisticAttributeEstimate(o));
			}
		}

		if (obj.hasOwnProperty('modelCharacteristic')) {
			this.modelCharacteristic = [];
			for (const o of (obj.modelCharacteristic instanceof Array ? obj.modelCharacteristic : [])) {
				this.modelCharacteristic.push(new EvidenceStatisticModelCharacteristic(o));
			}
		}

	}

  description?: string;
  note?: Annotation[];
  statisticType?: CodeableConcept;
  category?: CodeableConcept;
  quantity?: Quantity;
  numberOfEvents?: number;
  numberAffected?: number;
  sampleSize?: EvidenceStatisticSampleSize;
  attributeEstimate?: EvidenceStatisticAttributeEstimate[];
  modelCharacteristic?: EvidenceStatisticModelCharacteristic[];
}

export class EvidenceVariableDefinition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('variableRole')) {
			this.variableRole = obj.variableRole;
		}

		if (obj.hasOwnProperty('observed')) {
			this.observed = obj.observed;
		}

		if (obj.hasOwnProperty('intended')) {
			this.intended = obj.intended;
		}

		if (obj.hasOwnProperty('directnessMatch')) {
			this.directnessMatch = obj.directnessMatch;
		}

	}

  description?: string;
  note?: Annotation[];
  variableRole: CodeableConcept;
  observed?: Reference;
  intended?: Reference;
  directnessMatch?: CodeableConcept;
}

export class Evidence extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('citeAsReference')) {
			this.citeAsReference = obj.citeAsReference;
		}

		if (obj.hasOwnProperty('citeAsMarkdown')) {
			this.citeAsMarkdown = obj.citeAsMarkdown;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('assertion')) {
			this.assertion = obj.assertion;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('variableDefinition')) {
			this.variableDefinition = [];
			for (const o of (obj.variableDefinition instanceof Array ? obj.variableDefinition : [])) {
				this.variableDefinition.push(new EvidenceVariableDefinition(o));
			}
		}

		if (obj.hasOwnProperty('synthesisType')) {
			this.synthesisType = obj.synthesisType;
		}

		if (obj.hasOwnProperty('studyType')) {
			this.studyType = obj.studyType;
		}

		if (obj.hasOwnProperty('statistic')) {
			this.statistic = [];
			for (const o of (obj.statistic instanceof Array ? obj.statistic : [])) {
				this.statistic.push(new EvidenceStatistic(o));
			}
		}

		if (obj.hasOwnProperty('certainty')) {
			this.certainty = [];
			for (const o of (obj.certainty instanceof Array ? obj.certainty : [])) {
				this.certainty.push(new EvidenceCertainty(o));
			}
		}

	}

  resourceType = 'Evidence';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  title?: string;
  citeAsReference?: Reference;
  citeAsMarkdown?: string;
  status: EvidenceStatus1;
  date?: string;
  useContext?: UsageContext[];
  approvalDate?: string;
  lastReviewDate?: string;
  publisher?: string;
  contact?: ContactDetail[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  description?: string;
  assertion?: string;
  note?: Annotation[];
  variableDefinition: EvidenceVariableDefinition[];
  synthesisType?: CodeableConcept;
  studyType?: CodeableConcept;
  statistic?: EvidenceStatistic[];
  certainty?: EvidenceCertainty[];
}

export class EvidenceReportSection extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = obj.focus;
		}

		if (obj.hasOwnProperty('focusReference')) {
			this.focusReference = obj.focusReference;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('orderedBy')) {
			this.orderedBy = obj.orderedBy;
		}

		if (obj.hasOwnProperty('entryClassifier')) {
			this.entryClassifier = [];
			for (const o of (obj.entryClassifier instanceof Array ? obj.entryClassifier : [])) {
				this.entryClassifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('entryReference')) {
			this.entryReference = [];
			for (const o of (obj.entryReference instanceof Array ? obj.entryReference : [])) {
				this.entryReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('entryQuantity')) {
			this.entryQuantity = [];
			for (const o of (obj.entryQuantity instanceof Array ? obj.entryQuantity : [])) {
				this.entryQuantity.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('emptyReason')) {
			this.emptyReason = obj.emptyReason;
		}

		if (obj.hasOwnProperty('section')) {
			this.section = [];
			for (const o of (obj.section instanceof Array ? obj.section : [])) {
				this.section.push(new EvidenceReportSection(o));
			}
		}

	}

  title?: string;
  focus?: CodeableConcept;
  focusReference?: Reference;
  author?: Reference[];
  text?: Narrative;
  mode?: EvidenceReportMode1;
  orderedBy?: CodeableConcept;
  entryClassifier?: CodeableConcept[];
  entryReference?: Reference[];
  entryQuantity?: Quantity[];
  emptyReason?: CodeableConcept;
  section?: EvidenceReportSection[];
}

export class EvidenceReportRelatesTo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('targetIdentifier')) {
			this.targetIdentifier = obj.targetIdentifier;
		}

		if (obj.hasOwnProperty('targetReference')) {
			this.targetReference = obj.targetReference;
		}

	}

  code: EvidenceReportCode1;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}

export class EvidenceReportSubjectCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('exclude')) {
			this.exclude = obj.exclude;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  code: CodeableConcept;
  valueReference?: Reference;
  valueCodeableConcept?: CodeableConcept;
  valueBoolean?: boolean;
  valueQuantity?: Quantity;
  valueRange?: Range;
  exclude?: boolean;
  period?: Period;
}

export class EvidenceReportSubject extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new EvidenceReportSubjectCharacteristic(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  characteristic?: EvidenceReportSubjectCharacteristic[];
  note?: Annotation[];
}

export class EvidenceReport extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('relatedIdentifier')) {
			this.relatedIdentifier = [];
			for (const o of (obj.relatedIdentifier instanceof Array ? obj.relatedIdentifier : [])) {
				this.relatedIdentifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('citeAsReference')) {
			this.citeAsReference = obj.citeAsReference;
		}

		if (obj.hasOwnProperty('citeAsMarkdown')) {
			this.citeAsMarkdown = obj.citeAsMarkdown;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatesTo')) {
			this.relatesTo = [];
			for (const o of (obj.relatesTo instanceof Array ? obj.relatesTo : [])) {
				this.relatesTo.push(new EvidenceReportRelatesTo(o));
			}
		}

		if (obj.hasOwnProperty('section')) {
			this.section = [];
			for (const o of (obj.section instanceof Array ? obj.section : [])) {
				this.section.push(new EvidenceReportSection(o));
			}
		}

	}

  resourceType = 'EvidenceReport';
  url?: string;
  status: EvidenceReportStatus1;
  useContext?: UsageContext[];
  identifier?: Identifier[];
  relatedIdentifier?: Identifier[];
  citeAsReference?: Reference;
  citeAsMarkdown?: string;
  type?: CodeableConcept;
  note?: Annotation[];
  relatedArtifact?: RelatedArtifact[];
  subject: EvidenceReportSubject;
  publisher?: string;
  contact?: ContactDetail[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatesTo?: EvidenceReportRelatesTo[];
  section?: EvidenceReportSection[];
}

export class EvidenceVariableCategory extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

	}

  name?: string;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
}

export class EvidenceVariableCharacteristicTimeFromStart extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('range')) {
			this.range = obj.range;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  description?: string;
  quantity?: Quantity;
  range?: Range;
  note?: Annotation[];
}

export class EvidenceVariableCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('definitionReference')) {
			this.definitionReference = obj.definitionReference;
		}

		if (obj.hasOwnProperty('definitionCanonical')) {
			this.definitionCanonical = obj.definitionCanonical;
		}

		if (obj.hasOwnProperty('definitionCodeableConcept')) {
			this.definitionCodeableConcept = obj.definitionCodeableConcept;
		}

		if (obj.hasOwnProperty('definitionExpression')) {
			this.definitionExpression = obj.definitionExpression;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('exclude')) {
			this.exclude = obj.exclude;
		}

		if (obj.hasOwnProperty('timeFromStart')) {
			this.timeFromStart = obj.timeFromStart;
		}

		if (obj.hasOwnProperty('groupMeasure')) {
			this.groupMeasure = obj.groupMeasure;
		}

	}

  description?: string;
  definitionReference?: Reference;
  definitionCanonical?: string;
  definitionCodeableConcept?: CodeableConcept;
  definitionExpression?: Expression;
  method?: CodeableConcept;
  device?: Reference;
  exclude?: boolean;
  timeFromStart?: EvidenceVariableCharacteristicTimeFromStart;
  groupMeasure?: EvidenceVariableGroupMeasure1;
}

export class EvidenceVariable extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('shortTitle')) {
			this.shortTitle = obj.shortTitle;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('actual')) {
			this.actual = obj.actual;
		}

		if (obj.hasOwnProperty('characteristicCombination')) {
			this.characteristicCombination = obj.characteristicCombination;
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new EvidenceVariableCharacteristic(o));
			}
		}

		if (obj.hasOwnProperty('handling')) {
			this.handling = obj.handling;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new EvidenceVariableCategory(o));
			}
		}

	}

  resourceType = 'EvidenceVariable';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: EvidenceVariableStatus1;
  date?: string;
  description?: string;
  note?: Annotation[];
  useContext?: UsageContext[];
  publisher?: string;
  contact?: ContactDetail[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  actual?: boolean;
  characteristicCombination?: EvidenceVariableCharacteristicCombination1;
  characteristic?: EvidenceVariableCharacteristic[];
  handling?: EvidenceVariableHandling1;
  category?: EvidenceVariableCategory[];
}

export class ExampleScenarioProcessStepAlternative extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('step')) {
			this.step = [];
			for (const o of (obj.step instanceof Array ? obj.step : [])) {
				this.step.push(new ExampleScenarioProcessStep(o));
			}
		}

	}

  title: string;
  description?: string;
  step?: ExampleScenarioProcessStep[];
}

export class ExampleScenarioProcessStepOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('number')) {
			this.number = obj.number;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('initiator')) {
			this.initiator = obj.initiator;
		}

		if (obj.hasOwnProperty('receiver')) {
			this.receiver = obj.receiver;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('initiatorActive')) {
			this.initiatorActive = obj.initiatorActive;
		}

		if (obj.hasOwnProperty('receiverActive')) {
			this.receiverActive = obj.receiverActive;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

	}

  number: string;
  type?: string;
  name?: string;
  initiator?: string;
  receiver?: string;
  description?: string;
  initiatorActive?: boolean;
  receiverActive?: boolean;
  request?: ExampleScenarioInstanceContainedInstance;
  response?: ExampleScenarioInstanceContainedInstance;
}

export class ExampleScenarioProcessStep extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('process')) {
			this.process = [];
			for (const o of (obj.process instanceof Array ? obj.process : [])) {
				this.process.push(new ExampleScenarioProcess(o));
			}
		}

		if (obj.hasOwnProperty('pause')) {
			this.pause = obj.pause;
		}

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

		if (obj.hasOwnProperty('alternative')) {
			this.alternative = [];
			for (const o of (obj.alternative instanceof Array ? obj.alternative : [])) {
				this.alternative.push(new ExampleScenarioProcessStepAlternative(o));
			}
		}

	}

  process?: ExampleScenarioProcess[];
  pause?: boolean;
  operation?: ExampleScenarioProcessStepOperation;
  alternative?: ExampleScenarioProcessStepAlternative[];
}

export class ExampleScenarioProcess extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('preConditions')) {
			this.preConditions = obj.preConditions;
		}

		if (obj.hasOwnProperty('postConditions')) {
			this.postConditions = obj.postConditions;
		}

		if (obj.hasOwnProperty('step')) {
			this.step = [];
			for (const o of (obj.step instanceof Array ? obj.step : [])) {
				this.step.push(new ExampleScenarioProcessStep(o));
			}
		}

	}

  title: string;
  description?: string;
  preConditions?: string;
  postConditions?: string;
  step?: ExampleScenarioProcessStep[];
}

export class ExampleScenarioInstanceContainedInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('resourceId')) {
			this.resourceId = obj.resourceId;
		}

		if (obj.hasOwnProperty('versionId')) {
			this.versionId = obj.versionId;
		}

	}

  resourceId: string;
  versionId?: string;
}

export class ExampleScenarioInstanceVersion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('versionId')) {
			this.versionId = obj.versionId;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  versionId: string;
  description: string;
}

export class ExampleScenarioInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('resourceId')) {
			this.resourceId = obj.resourceId;
		}

		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = [];
			for (const o of (obj.version instanceof Array ? obj.version : [])) {
				this.version.push(new ExampleScenarioInstanceVersion(o));
			}
		}

		if (obj.hasOwnProperty('containedInstance')) {
			this.containedInstance = [];
			for (const o of (obj.containedInstance instanceof Array ? obj.containedInstance : [])) {
				this.containedInstance.push(new ExampleScenarioInstanceContainedInstance(o));
			}
		}

	}

  resourceId: string;
  resourceType: ExampleScenarioResourceType1;
  name?: string;
  description?: string;
  version?: ExampleScenarioInstanceVersion[];
  containedInstance?: ExampleScenarioInstanceContainedInstance[];
}

export class ExampleScenarioActor extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('actorId')) {
			this.actorId = obj.actorId;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  actorId: string;
  type: ExampleScenarioType1;
  name?: string;
  description?: string;
}

export class ExampleScenario extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = [];
			for (const o of (obj.actor instanceof Array ? obj.actor : [])) {
				this.actor.push(new ExampleScenarioActor(o));
			}
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = [];
			for (const o of (obj.instance instanceof Array ? obj.instance : [])) {
				this.instance.push(new ExampleScenarioInstance(o));
			}
		}

		if (obj.hasOwnProperty('process')) {
			this.process = [];
			for (const o of (obj.process instanceof Array ? obj.process : [])) {
				this.process.push(new ExampleScenarioProcess(o));
			}
		}

		if (obj.hasOwnProperty('workflow')) {
			this.workflow = [];
			for (const o of (obj.workflow instanceof Array ? obj.workflow : [])) {
				this.workflow.push(o);
			}
		}

	}

  resourceType = 'ExampleScenario';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  status: ExampleScenarioStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  copyright?: string;
  purpose?: string;
  actor?: ExampleScenarioActor[];
  instance?: ExampleScenarioInstance[];
  process?: ExampleScenarioProcess[];
  workflow?: string[];
}

export class ExplanationOfBenefitBenefitBalanceFinancial extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('allowedUnsignedInt')) {
			this.allowedUnsignedInt = obj.allowedUnsignedInt;
		}

		if (obj.hasOwnProperty('allowedString')) {
			this.allowedString = obj.allowedString;
		}

		if (obj.hasOwnProperty('allowedMoney')) {
			this.allowedMoney = obj.allowedMoney;
		}

		if (obj.hasOwnProperty('usedUnsignedInt')) {
			this.usedUnsignedInt = obj.usedUnsignedInt;
		}

		if (obj.hasOwnProperty('usedMoney')) {
			this.usedMoney = obj.usedMoney;
		}

	}

  type: CodeableConcept;
  allowedUnsignedInt?: number;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: number;
  usedMoney?: Money;
}

export class ExplanationOfBenefitBenefitBalance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('excluded')) {
			this.excluded = obj.excluded;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = obj.network;
		}

		if (obj.hasOwnProperty('unit')) {
			this.unit = obj.unit;
		}

		if (obj.hasOwnProperty('term')) {
			this.term = obj.term;
		}

		if (obj.hasOwnProperty('financial')) {
			this.financial = [];
			for (const o of (obj.financial instanceof Array ? obj.financial : [])) {
				this.financial.push(new ExplanationOfBenefitBenefitBalanceFinancial(o));
			}
		}

	}

  category: CodeableConcept;
  excluded?: boolean;
  name?: string;
  description?: string;
  network?: CodeableConcept;
  unit?: CodeableConcept;
  term?: CodeableConcept;
  financial?: ExplanationOfBenefitBenefitBalanceFinancial[];
}

export class ExplanationOfBenefitProcessNote extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('number')) {
			this.number = obj.number;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

	}

  number?: number;
  type?: ExplanationOfBenefitType1;
  text?: string;
  language?: CodeableConcept;
}

export class ExplanationOfBenefitPayment extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('adjustment')) {
			this.adjustment = obj.adjustment;
		}

		if (obj.hasOwnProperty('adjustmentReason')) {
			this.adjustmentReason = obj.adjustmentReason;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

	}

  type?: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: string;
  amount?: Money;
  identifier?: Identifier;
}

export class ExplanationOfBenefitTotal extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  category: CodeableConcept;
  amount: Money;
}

export class ExplanationOfBenefitAddItemDetailSubDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

	}

  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
}

export class ExplanationOfBenefitAddItemDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('subDetail')) {
			this.subDetail = [];
			for (const o of (obj.subDetail instanceof Array ? obj.subDetail : [])) {
				this.subDetail.push(new ExplanationOfBenefitAddItemDetailSubDetail(o));
			}
		}

	}

  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
  subDetail?: ExplanationOfBenefitAddItemDetailSubDetail[];
}

export class ExplanationOfBenefitAddItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemSequence')) {
			this.itemSequence = [];
			for (const o of (obj.itemSequence instanceof Array ? obj.itemSequence : [])) {
				this.itemSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('detailSequence')) {
			this.detailSequence = [];
			for (const o of (obj.detailSequence instanceof Array ? obj.detailSequence : [])) {
				this.detailSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('subDetailSequence')) {
			this.subDetailSequence = [];
			for (const o of (obj.subDetailSequence instanceof Array ? obj.subDetailSequence : [])) {
				this.subDetailSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = [];
			for (const o of (obj.provider instanceof Array ? obj.provider : [])) {
				this.provider.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('locationCodeableConcept')) {
			this.locationCodeableConcept = obj.locationCodeableConcept;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('subSite')) {
			this.subSite = [];
			for (const o of (obj.subSite instanceof Array ? obj.subSite : [])) {
				this.subSite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new ExplanationOfBenefitAddItemDetail(o));
			}
		}

	}

  itemSequence?: number[];
  detailSequence?: number[];
  subDetailSequence?: number[];
  provider?: Reference[];
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
  detail?: ExplanationOfBenefitAddItemDetail[];
}

export class ExplanationOfBenefitItemDetailSubDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

	}

  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
}

export class ExplanationOfBenefitItemDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('subDetail')) {
			this.subDetail = [];
			for (const o of (obj.subDetail instanceof Array ? obj.subDetail : [])) {
				this.subDetail.push(new ExplanationOfBenefitItemDetailSubDetail(o));
			}
		}

	}

  sequence: number;
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
  subDetail?: ExplanationOfBenefitItemDetailSubDetail[];
}

export class ExplanationOfBenefitItemAdjudication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: number;
}

export class ExplanationOfBenefitItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('careTeamSequence')) {
			this.careTeamSequence = [];
			for (const o of (obj.careTeamSequence instanceof Array ? obj.careTeamSequence : [])) {
				this.careTeamSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('diagnosisSequence')) {
			this.diagnosisSequence = [];
			for (const o of (obj.diagnosisSequence instanceof Array ? obj.diagnosisSequence : [])) {
				this.diagnosisSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('procedureSequence')) {
			this.procedureSequence = [];
			for (const o of (obj.procedureSequence instanceof Array ? obj.procedureSequence : [])) {
				this.procedureSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('informationSequence')) {
			this.informationSequence = [];
			for (const o of (obj.informationSequence instanceof Array ? obj.informationSequence : [])) {
				this.informationSequence.push(o);
			}
		}

		if (obj.hasOwnProperty('revenue')) {
			this.revenue = obj.revenue;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('productOrService')) {
			this.productOrService = obj.productOrService;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('programCode')) {
			this.programCode = [];
			for (const o of (obj.programCode instanceof Array ? obj.programCode : [])) {
				this.programCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('servicedDate')) {
			this.servicedDate = obj.servicedDate;
		}

		if (obj.hasOwnProperty('servicedPeriod')) {
			this.servicedPeriod = obj.servicedPeriod;
		}

		if (obj.hasOwnProperty('locationCodeableConcept')) {
			this.locationCodeableConcept = obj.locationCodeableConcept;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('unitPrice')) {
			this.unitPrice = obj.unitPrice;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('net')) {
			this.net = obj.net;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('subSite')) {
			this.subSite = [];
			for (const o of (obj.subSite instanceof Array ? obj.subSite : [])) {
				this.subSite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = [];
			for (const o of (obj.encounter instanceof Array ? obj.encounter : [])) {
				this.encounter.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('noteNumber')) {
			this.noteNumber = [];
			for (const o of (obj.noteNumber instanceof Array ? obj.noteNumber : [])) {
				this.noteNumber.push(o);
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new ExplanationOfBenefitItemDetail(o));
			}
		}

	}

  sequence: number;
  careTeamSequence?: number[];
  diagnosisSequence?: number[];
  procedureSequence?: number[];
  informationSequence?: number[];
  revenue?: CodeableConcept;
  category?: CodeableConcept;
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  programCode?: CodeableConcept[];
  servicedDate?: string;
  servicedPeriod?: Period;
  locationCodeableConcept?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  udi?: Reference[];
  bodySite?: CodeableConcept;
  subSite?: CodeableConcept[];
  encounter?: Reference[];
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
  detail?: ExplanationOfBenefitItemDetail[];
}

export class ExplanationOfBenefitAccident extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('locationAddress')) {
			this.locationAddress = obj.locationAddress;
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = obj.locationReference;
		}

	}

  date?: string;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}

export class ExplanationOfBenefitInsurance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('focal')) {
			this.focal = obj.focal;
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = obj.coverage;
		}

		if (obj.hasOwnProperty('preAuthRef')) {
			this.preAuthRef = [];
			for (const o of (obj.preAuthRef instanceof Array ? obj.preAuthRef : [])) {
				this.preAuthRef.push(o);
			}
		}

	}

  focal: boolean;
  coverage: Reference;
  preAuthRef?: string[];
}

export class ExplanationOfBenefitProcedure extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('procedureCodeableConcept')) {
			this.procedureCodeableConcept = obj.procedureCodeableConcept;
		}

		if (obj.hasOwnProperty('procedureReference')) {
			this.procedureReference = obj.procedureReference;
		}

		if (obj.hasOwnProperty('udi')) {
			this.udi = [];
			for (const o of (obj.udi instanceof Array ? obj.udi : [])) {
				this.udi.push(new Reference(o));
			}
		}

	}

  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export class ExplanationOfBenefitDiagnosis extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('diagnosisCodeableConcept')) {
			this.diagnosisCodeableConcept = obj.diagnosisCodeableConcept;
		}

		if (obj.hasOwnProperty('diagnosisReference')) {
			this.diagnosisReference = obj.diagnosisReference;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('onAdmission')) {
			this.onAdmission = obj.onAdmission;
		}

		if (obj.hasOwnProperty('packageCode')) {
			this.packageCode = obj.packageCode;
		}

	}

  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export class ExplanationOfBenefitSupportingInfo extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('timingDate')) {
			this.timingDate = obj.timingDate;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

	}

  sequence: number;
  category: CodeableConcept;
  code?: CodeableConcept;
  timingDate?: string;
  timingPeriod?: Period;
  valueBoolean?: boolean;
  valueString?: string;
  valueQuantity?: Quantity;
  valueAttachment?: Attachment;
  valueReference?: Reference;
  reason?: Coding;
}

export class ExplanationOfBenefitCareTeam extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('qualification')) {
			this.qualification = obj.qualification;
		}

	}

  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export class ExplanationOfBenefitPayee extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('party')) {
			this.party = obj.party;
		}

	}

  type?: CodeableConcept;
  party?: Reference;
}

export class ExplanationOfBenefitRelated extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('claim')) {
			this.claim = obj.claim;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

	}

  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}

export class ExplanationOfBenefit extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subType')) {
			this.subType = obj.subType;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('billablePeriod')) {
			this.billablePeriod = obj.billablePeriod;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('enterer')) {
			this.enterer = obj.enterer;
		}

		if (obj.hasOwnProperty('insurer')) {
			this.insurer = obj.insurer;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('fundsReserveRequested')) {
			this.fundsReserveRequested = obj.fundsReserveRequested;
		}

		if (obj.hasOwnProperty('fundsReserve')) {
			this.fundsReserve = obj.fundsReserve;
		}

		if (obj.hasOwnProperty('related')) {
			this.related = [];
			for (const o of (obj.related instanceof Array ? obj.related : [])) {
				this.related.push(new ExplanationOfBenefitRelated(o));
			}
		}

		if (obj.hasOwnProperty('prescription')) {
			this.prescription = obj.prescription;
		}

		if (obj.hasOwnProperty('originalPrescription')) {
			this.originalPrescription = obj.originalPrescription;
		}

		if (obj.hasOwnProperty('payee')) {
			this.payee = obj.payee;
		}

		if (obj.hasOwnProperty('referral')) {
			this.referral = obj.referral;
		}

		if (obj.hasOwnProperty('facility')) {
			this.facility = obj.facility;
		}

		if (obj.hasOwnProperty('claim')) {
			this.claim = obj.claim;
		}

		if (obj.hasOwnProperty('claimResponse')) {
			this.claimResponse = obj.claimResponse;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('disposition')) {
			this.disposition = obj.disposition;
		}

		if (obj.hasOwnProperty('preAuthRef')) {
			this.preAuthRef = [];
			for (const o of (obj.preAuthRef instanceof Array ? obj.preAuthRef : [])) {
				this.preAuthRef.push(o);
			}
		}

		if (obj.hasOwnProperty('preAuthRefPeriod')) {
			this.preAuthRefPeriod = [];
			for (const o of (obj.preAuthRefPeriod instanceof Array ? obj.preAuthRefPeriod : [])) {
				this.preAuthRefPeriod.push(new Period(o));
			}
		}

		if (obj.hasOwnProperty('careTeam')) {
			this.careTeam = [];
			for (const o of (obj.careTeam instanceof Array ? obj.careTeam : [])) {
				this.careTeam.push(new ExplanationOfBenefitCareTeam(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new ExplanationOfBenefitSupportingInfo(o));
			}
		}

		if (obj.hasOwnProperty('diagnosis')) {
			this.diagnosis = [];
			for (const o of (obj.diagnosis instanceof Array ? obj.diagnosis : [])) {
				this.diagnosis.push(new ExplanationOfBenefitDiagnosis(o));
			}
		}

		if (obj.hasOwnProperty('procedure')) {
			this.procedure = [];
			for (const o of (obj.procedure instanceof Array ? obj.procedure : [])) {
				this.procedure.push(new ExplanationOfBenefitProcedure(o));
			}
		}

		if (obj.hasOwnProperty('precedence')) {
			this.precedence = obj.precedence;
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new ExplanationOfBenefitInsurance(o));
			}
		}

		if (obj.hasOwnProperty('accident')) {
			this.accident = obj.accident;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new ExplanationOfBenefitItem(o));
			}
		}

		if (obj.hasOwnProperty('addItem')) {
			this.addItem = [];
			for (const o of (obj.addItem instanceof Array ? obj.addItem : [])) {
				this.addItem.push(new ExplanationOfBenefitAddItem(o));
			}
		}

		if (obj.hasOwnProperty('adjudication')) {
			this.adjudication = [];
			for (const o of (obj.adjudication instanceof Array ? obj.adjudication : [])) {
				this.adjudication.push(new ExplanationOfBenefitItemAdjudication(o));
			}
		}

		if (obj.hasOwnProperty('total')) {
			this.total = [];
			for (const o of (obj.total instanceof Array ? obj.total : [])) {
				this.total.push(new ExplanationOfBenefitTotal(o));
			}
		}

		if (obj.hasOwnProperty('payment')) {
			this.payment = obj.payment;
		}

		if (obj.hasOwnProperty('formCode')) {
			this.formCode = obj.formCode;
		}

		if (obj.hasOwnProperty('form')) {
			this.form = obj.form;
		}

		if (obj.hasOwnProperty('processNote')) {
			this.processNote = [];
			for (const o of (obj.processNote instanceof Array ? obj.processNote : [])) {
				this.processNote.push(new ExplanationOfBenefitProcessNote(o));
			}
		}

		if (obj.hasOwnProperty('benefitPeriod')) {
			this.benefitPeriod = obj.benefitPeriod;
		}

		if (obj.hasOwnProperty('benefitBalance')) {
			this.benefitBalance = [];
			for (const o of (obj.benefitBalance instanceof Array ? obj.benefitBalance : [])) {
				this.benefitBalance.push(new ExplanationOfBenefitBenefitBalance(o));
			}
		}

	}

  resourceType = 'ExplanationOfBenefit';
  identifier?: Identifier[];
  status: ExplanationOfBenefitStatus1;
  type: CodeableConcept;
  subType?: CodeableConcept;
  use: ExplanationOfBenefitUse1;
  patient: Reference;
  billablePeriod?: Period;
  created: string;
  enterer?: Reference;
  insurer: Reference;
  provider: Reference;
  priority?: CodeableConcept;
  fundsReserveRequested?: CodeableConcept;
  fundsReserve?: CodeableConcept;
  related?: ExplanationOfBenefitRelated[];
  prescription?: Reference;
  originalPrescription?: Reference;
  payee?: ExplanationOfBenefitPayee;
  referral?: Reference;
  facility?: Reference;
  claim?: Reference;
  claimResponse?: Reference;
  outcome: ExplanationOfBenefitOutcome1;
  disposition?: string;
  preAuthRef?: string[];
  preAuthRefPeriod?: Period[];
  careTeam?: ExplanationOfBenefitCareTeam[];
  supportingInfo?: ExplanationOfBenefitSupportingInfo[];
  diagnosis?: ExplanationOfBenefitDiagnosis[];
  procedure?: ExplanationOfBenefitProcedure[];
  precedence?: number;
  insurance: ExplanationOfBenefitInsurance[];
  accident?: ExplanationOfBenefitAccident;
  item?: ExplanationOfBenefitItem[];
  addItem?: ExplanationOfBenefitAddItem[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
  total?: ExplanationOfBenefitTotal[];
  payment?: ExplanationOfBenefitPayment;
  formCode?: CodeableConcept;
  form?: Attachment;
  processNote?: ExplanationOfBenefitProcessNote[];
  benefitPeriod?: Period;
  benefitBalance?: ExplanationOfBenefitBenefitBalance[];
}

export class FamilyMemberHistoryCondition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('contributedToDeath')) {
			this.contributedToDeath = obj.contributedToDeath;
		}

		if (obj.hasOwnProperty('onsetAge')) {
			this.onsetAge = obj.onsetAge;
		}

		if (obj.hasOwnProperty('onsetRange')) {
			this.onsetRange = obj.onsetRange;
		}

		if (obj.hasOwnProperty('onsetPeriod')) {
			this.onsetPeriod = obj.onsetPeriod;
		}

		if (obj.hasOwnProperty('onsetString')) {
			this.onsetString = obj.onsetString;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  code: CodeableConcept;
  outcome?: CodeableConcept;
  contributedToDeath?: boolean;
  onsetAge?: Age;
  onsetRange?: Range;
  onsetPeriod?: Period;
  onsetString?: string;
  note?: Annotation[];
}

export class FamilyMemberHistory extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('dataAbsentReason')) {
			this.dataAbsentReason = obj.dataAbsentReason;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('sex')) {
			this.sex = obj.sex;
		}

		if (obj.hasOwnProperty('bornPeriod')) {
			this.bornPeriod = obj.bornPeriod;
		}

		if (obj.hasOwnProperty('bornDate')) {
			this.bornDate = obj.bornDate;
		}

		if (obj.hasOwnProperty('bornString')) {
			this.bornString = obj.bornString;
		}

		if (obj.hasOwnProperty('ageAge')) {
			this.ageAge = obj.ageAge;
		}

		if (obj.hasOwnProperty('ageRange')) {
			this.ageRange = obj.ageRange;
		}

		if (obj.hasOwnProperty('ageString')) {
			this.ageString = obj.ageString;
		}

		if (obj.hasOwnProperty('estimatedAge')) {
			this.estimatedAge = obj.estimatedAge;
		}

		if (obj.hasOwnProperty('deceasedBoolean')) {
			this.deceasedBoolean = obj.deceasedBoolean;
		}

		if (obj.hasOwnProperty('deceasedAge')) {
			this.deceasedAge = obj.deceasedAge;
		}

		if (obj.hasOwnProperty('deceasedRange')) {
			this.deceasedRange = obj.deceasedRange;
		}

		if (obj.hasOwnProperty('deceasedDate')) {
			this.deceasedDate = obj.deceasedDate;
		}

		if (obj.hasOwnProperty('deceasedString')) {
			this.deceasedString = obj.deceasedString;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(new FamilyMemberHistoryCondition(o));
			}
		}

	}

  resourceType = 'FamilyMemberHistory';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  status: FamilyMemberHistoryStatus1;
  dataAbsentReason?: CodeableConcept;
  patient: Reference;
  date?: string;
  name?: string;
  relationship: CodeableConcept;
  sex?: CodeableConcept;
  bornPeriod?: Period;
  bornDate?: string;
  bornString?: string;
  ageAge?: Age;
  ageRange?: Range;
  ageString?: string;
  estimatedAge?: boolean;
  deceasedBoolean?: boolean;
  deceasedAge?: Age;
  deceasedRange?: Range;
  deceasedDate?: string;
  deceasedString?: string;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  condition?: FamilyMemberHistoryCondition[];
}

export class Flag extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

	}

  resourceType = 'Flag';
  identifier?: Identifier[];
  status: FlagStatus1;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject: Reference;
  period?: Period;
  encounter?: Reference;
  author?: Reference;
}

export class GoalTarget extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('measure')) {
			this.measure = obj.measure;
		}

		if (obj.hasOwnProperty('detailQuantity')) {
			this.detailQuantity = obj.detailQuantity;
		}

		if (obj.hasOwnProperty('detailRange')) {
			this.detailRange = obj.detailRange;
		}

		if (obj.hasOwnProperty('detailCodeableConcept')) {
			this.detailCodeableConcept = obj.detailCodeableConcept;
		}

		if (obj.hasOwnProperty('detailString')) {
			this.detailString = obj.detailString;
		}

		if (obj.hasOwnProperty('detailBoolean')) {
			this.detailBoolean = obj.detailBoolean;
		}

		if (obj.hasOwnProperty('detailInteger')) {
			this.detailInteger = obj.detailInteger;
		}

		if (obj.hasOwnProperty('detailRatio')) {
			this.detailRatio = obj.detailRatio;
		}

		if (obj.hasOwnProperty('dueDate')) {
			this.dueDate = obj.dueDate;
		}

		if (obj.hasOwnProperty('dueDuration')) {
			this.dueDuration = obj.dueDuration;
		}

	}

  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: CodeableConcept;
  detailString?: string;
  detailBoolean?: boolean;
  detailInteger?: number;
  detailRatio?: Ratio;
  dueDate?: string;
  dueDuration?: Duration;
}

export class Goal extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('lifecycleStatus')) {
			this.lifecycleStatus = obj.lifecycleStatus;
		}

		if (obj.hasOwnProperty('achievementStatus')) {
			this.achievementStatus = obj.achievementStatus;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('startDate')) {
			this.startDate = obj.startDate;
		}

		if (obj.hasOwnProperty('startCodeableConcept')) {
			this.startCodeableConcept = obj.startCodeableConcept;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new GoalTarget(o));
			}
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('expressedBy')) {
			this.expressedBy = obj.expressedBy;
		}

		if (obj.hasOwnProperty('addresses')) {
			this.addresses = [];
			for (const o of (obj.addresses instanceof Array ? obj.addresses : [])) {
				this.addresses.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('outcomeCode')) {
			this.outcomeCode = [];
			for (const o of (obj.outcomeCode instanceof Array ? obj.outcomeCode : [])) {
				this.outcomeCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('outcomeReference')) {
			this.outcomeReference = [];
			for (const o of (obj.outcomeReference instanceof Array ? obj.outcomeReference : [])) {
				this.outcomeReference.push(new Reference(o));
			}
		}

	}

  resourceType = 'Goal';
  identifier?: Identifier[];
  lifecycleStatus: GoalLifecycleStatus1;
  achievementStatus?: CodeableConcept;
  category?: CodeableConcept[];
  priority?: CodeableConcept;
  description: CodeableConcept;
  subject: Reference;
  startDate?: string;
  startCodeableConcept?: CodeableConcept;
  target?: GoalTarget[];
  statusDate?: string;
  statusReason?: string;
  expressedBy?: Reference;
  addresses?: Reference[];
  note?: Annotation[];
  outcomeCode?: CodeableConcept[];
  outcomeReference?: Reference[];
}

export class GraphDefinitionLinkTargetCompartment extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('rule')) {
			this.rule = obj.rule;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  use: GraphDefinitionUse1;
  code: GraphDefinitionCode1;
  rule: GraphDefinitionRule1;
  expression?: string;
  description?: string;
}

export class GraphDefinitionLinkTarget extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('params')) {
			this.params = obj.params;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

		if (obj.hasOwnProperty('compartment')) {
			this.compartment = [];
			for (const o of (obj.compartment instanceof Array ? obj.compartment : [])) {
				this.compartment.push(new GraphDefinitionLinkTargetCompartment(o));
			}
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new GraphDefinitionLink(o));
			}
		}

	}

  type: GraphDefinitionType1;
  params?: string;
  profile?: string;
  compartment?: GraphDefinitionLinkTargetCompartment[];
  link?: GraphDefinitionLink[];
}

export class GraphDefinitionLink extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('sliceName')) {
			this.sliceName = obj.sliceName;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new GraphDefinitionLinkTarget(o));
			}
		}

	}

  path?: string;
  sliceName?: string;
  min?: number;
  max?: string;
  description?: string;
  target?: GraphDefinitionLinkTarget[];
}

export class GraphDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new GraphDefinitionLink(o));
			}
		}

	}

  resourceType = 'GraphDefinition';
  url?: string;
  version?: string;
  name: string;
  status: GraphDefinitionStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  start: GraphDefinitionStart1;
  profile?: string;
  link?: GraphDefinitionLink[];
}

export class GroupMember extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('entity')) {
			this.entity = obj.entity;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('inactive')) {
			this.inactive = obj.inactive;
		}

	}

  entity: Reference;
  period?: Period;
  inactive?: boolean;
}

export class GroupCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('exclude')) {
			this.exclude = obj.exclude;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  code: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueBoolean?: boolean;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
  exclude: boolean;
  period?: Period;
}

export class Group extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('actual')) {
			this.actual = obj.actual;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('managingEntity')) {
			this.managingEntity = obj.managingEntity;
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new GroupCharacteristic(o));
			}
		}

		if (obj.hasOwnProperty('member')) {
			this.member = [];
			for (const o of (obj.member instanceof Array ? obj.member : [])) {
				this.member.push(new GroupMember(o));
			}
		}

	}

  resourceType = 'Group';
  identifier?: Identifier[];
  active?: boolean;
  type: GroupType1;
  actual: boolean;
  code?: CodeableConcept;
  name?: string;
  quantity?: number;
  managingEntity?: Reference;
  characteristic?: GroupCharacteristic[];
  member?: GroupMember[];
}

export class GuidanceResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('requestIdentifier')) {
			this.requestIdentifier = obj.requestIdentifier;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('moduleUri')) {
			this.moduleUri = obj.moduleUri;
		}

		if (obj.hasOwnProperty('moduleCanonical')) {
			this.moduleCanonical = obj.moduleCanonical;
		}

		if (obj.hasOwnProperty('moduleCodeableConcept')) {
			this.moduleCodeableConcept = obj.moduleCodeableConcept;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('evaluationMessage')) {
			this.evaluationMessage = [];
			for (const o of (obj.evaluationMessage instanceof Array ? obj.evaluationMessage : [])) {
				this.evaluationMessage.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('outputParameters')) {
			this.outputParameters = obj.outputParameters;
		}

		if (obj.hasOwnProperty('result')) {
			this.result = obj.result;
		}

		if (obj.hasOwnProperty('dataRequirement')) {
			this.dataRequirement = [];
			for (const o of (obj.dataRequirement instanceof Array ? obj.dataRequirement : [])) {
				this.dataRequirement.push(new DataRequirement(o));
			}
		}

	}

  resourceType = 'GuidanceResponse';
  requestIdentifier?: Identifier;
  identifier?: Identifier[];
  moduleUri?: string;
  moduleCanonical?: string;
  moduleCodeableConcept?: CodeableConcept;
  status: GuidanceResponseStatus1;
  subject?: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  performer?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  evaluationMessage?: Reference[];
  outputParameters?: Reference;
  result?: Reference;
  dataRequirement?: DataRequirement[];
}

export class HealthcareServiceNotAvailable extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('during')) {
			this.during = obj.during;
		}

	}

  description: string;
  during?: Period;
}

export class HealthcareServiceAvailableTime extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('daysOfWeek')) {
			this.daysOfWeek = [];
			for (const o of (obj.daysOfWeek instanceof Array ? obj.daysOfWeek : [])) {
				this.daysOfWeek.push(o);
			}
		}

		if (obj.hasOwnProperty('allDay')) {
			this.allDay = obj.allDay;
		}

		if (obj.hasOwnProperty('availableStartTime')) {
			this.availableStartTime = obj.availableStartTime;
		}

		if (obj.hasOwnProperty('availableEndTime')) {
			this.availableEndTime = obj.availableEndTime;
		}

	}

  daysOfWeek?: HealthcareServiceDaysOfWeek1[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export class HealthcareServiceEligibility extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  code?: CodeableConcept;
  comment?: string;
}

export class HealthcareService extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('providedBy')) {
			this.providedBy = obj.providedBy;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('extraDetails')) {
			this.extraDetails = obj.extraDetails;
		}

		if (obj.hasOwnProperty('photo')) {
			this.photo = obj.photo;
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('coverageArea')) {
			this.coverageArea = [];
			for (const o of (obj.coverageArea instanceof Array ? obj.coverageArea : [])) {
				this.coverageArea.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('serviceProvisionCode')) {
			this.serviceProvisionCode = [];
			for (const o of (obj.serviceProvisionCode instanceof Array ? obj.serviceProvisionCode : [])) {
				this.serviceProvisionCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('eligibility')) {
			this.eligibility = [];
			for (const o of (obj.eligibility instanceof Array ? obj.eligibility : [])) {
				this.eligibility.push(new HealthcareServiceEligibility(o));
			}
		}

		if (obj.hasOwnProperty('program')) {
			this.program = [];
			for (const o of (obj.program instanceof Array ? obj.program : [])) {
				this.program.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('communication')) {
			this.communication = [];
			for (const o of (obj.communication instanceof Array ? obj.communication : [])) {
				this.communication.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('referralMethod')) {
			this.referralMethod = [];
			for (const o of (obj.referralMethod instanceof Array ? obj.referralMethod : [])) {
				this.referralMethod.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('appointmentRequired')) {
			this.appointmentRequired = obj.appointmentRequired;
		}

		if (obj.hasOwnProperty('availableTime')) {
			this.availableTime = [];
			for (const o of (obj.availableTime instanceof Array ? obj.availableTime : [])) {
				this.availableTime.push(new HealthcareServiceAvailableTime(o));
			}
		}

		if (obj.hasOwnProperty('notAvailable')) {
			this.notAvailable = [];
			for (const o of (obj.notAvailable instanceof Array ? obj.notAvailable : [])) {
				this.notAvailable.push(new HealthcareServiceNotAvailable(o));
			}
		}

		if (obj.hasOwnProperty('availabilityExceptions')) {
			this.availabilityExceptions = obj.availabilityExceptions;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

	}

  resourceType = 'HealthcareService';
  identifier?: Identifier[];
  active?: boolean;
  providedBy?: Reference;
  category?: CodeableConcept[];
  type?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: Reference[];
  name?: string;
  comment?: string;
  extraDetails?: string;
  photo?: Attachment;
  telecom?: ContactPoint[];
  coverageArea?: Reference[];
  serviceProvisionCode?: CodeableConcept[];
  eligibility?: HealthcareServiceEligibility[];
  program?: CodeableConcept[];
  characteristic?: CodeableConcept[];
  communication?: CodeableConcept[];
  referralMethod?: CodeableConcept[];
  appointmentRequired?: boolean;
  availableTime?: HealthcareServiceAvailableTime[];
  notAvailable?: HealthcareServiceNotAvailable[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

export class ImagingStudySeriesInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('uid')) {
			this.uid = obj.uid;
		}

		if (obj.hasOwnProperty('sopClass')) {
			this.sopClass = obj.sopClass;
		}

		if (obj.hasOwnProperty('number')) {
			this.number = obj.number;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

	}

  uid: string;
  sopClass: Coding;
  number?: number;
  title?: string;
}

export class ImagingStudySeriesPerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
}

export class ImagingStudySeries extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('uid')) {
			this.uid = obj.uid;
		}

		if (obj.hasOwnProperty('number')) {
			this.number = obj.number;
		}

		if (obj.hasOwnProperty('modality')) {
			this.modality = obj.modality;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('numberOfInstances')) {
			this.numberOfInstances = obj.numberOfInstances;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('laterality')) {
			this.laterality = obj.laterality;
		}

		if (obj.hasOwnProperty('specimen')) {
			this.specimen = [];
			for (const o of (obj.specimen instanceof Array ? obj.specimen : [])) {
				this.specimen.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('started')) {
			this.started = obj.started;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new ImagingStudySeriesPerformer(o));
			}
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = [];
			for (const o of (obj.instance instanceof Array ? obj.instance : [])) {
				this.instance.push(new ImagingStudySeriesInstance(o));
			}
		}

	}

  uid: string;
  number?: number;
  modality: Coding;
  description?: string;
  numberOfInstances?: number;
  endpoint?: Reference[];
  bodySite?: Coding;
  laterality?: Coding;
  specimen?: Reference[];
  started?: string;
  performer?: ImagingStudySeriesPerformer[];
  instance?: ImagingStudySeriesInstance[];
}

export class ImagingStudy extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('modality')) {
			this.modality = [];
			for (const o of (obj.modality instanceof Array ? obj.modality : [])) {
				this.modality.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('started')) {
			this.started = obj.started;
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('referrer')) {
			this.referrer = obj.referrer;
		}

		if (obj.hasOwnProperty('interpreter')) {
			this.interpreter = [];
			for (const o of (obj.interpreter instanceof Array ? obj.interpreter : [])) {
				this.interpreter.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('numberOfSeries')) {
			this.numberOfSeries = obj.numberOfSeries;
		}

		if (obj.hasOwnProperty('numberOfInstances')) {
			this.numberOfInstances = obj.numberOfInstances;
		}

		if (obj.hasOwnProperty('procedureReference')) {
			this.procedureReference = obj.procedureReference;
		}

		if (obj.hasOwnProperty('procedureCode')) {
			this.procedureCode = [];
			for (const o of (obj.procedureCode instanceof Array ? obj.procedureCode : [])) {
				this.procedureCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('series')) {
			this.series = [];
			for (const o of (obj.series instanceof Array ? obj.series : [])) {
				this.series.push(new ImagingStudySeries(o));
			}
		}

	}

  resourceType = 'ImagingStudy';
  identifier?: Identifier[];
  status: ImagingStudyStatus1;
  modality?: Coding[];
  subject: Reference;
  encounter?: Reference;
  started?: string;
  basedOn?: Reference[];
  referrer?: Reference;
  interpreter?: Reference[];
  endpoint?: Reference[];
  numberOfSeries?: number;
  numberOfInstances?: number;
  procedureReference?: Reference;
  procedureCode?: CodeableConcept[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  description?: string;
  series?: ImagingStudySeries[];
}

export class ImmunizationProtocolApplied extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('series')) {
			this.series = obj.series;
		}

		if (obj.hasOwnProperty('authority')) {
			this.authority = obj.authority;
		}

		if (obj.hasOwnProperty('targetDisease')) {
			this.targetDisease = [];
			for (const o of (obj.targetDisease instanceof Array ? obj.targetDisease : [])) {
				this.targetDisease.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('doseNumberPositiveInt')) {
			this.doseNumberPositiveInt = obj.doseNumberPositiveInt;
		}

		if (obj.hasOwnProperty('doseNumberString')) {
			this.doseNumberString = obj.doseNumberString;
		}

		if (obj.hasOwnProperty('seriesDosesPositiveInt')) {
			this.seriesDosesPositiveInt = obj.seriesDosesPositiveInt;
		}

		if (obj.hasOwnProperty('seriesDosesString')) {
			this.seriesDosesString = obj.seriesDosesString;
		}

	}

  series?: string;
  authority?: Reference;
  targetDisease?: CodeableConcept[];
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

export class ImmunizationReaction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = obj.detail;
		}

		if (obj.hasOwnProperty('reported')) {
			this.reported = obj.reported;
		}

	}

  date?: string;
  detail?: Reference;
  reported?: boolean;
}

export class ImmunizationEducation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('documentType')) {
			this.documentType = obj.documentType;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('publicationDate')) {
			this.publicationDate = obj.publicationDate;
		}

		if (obj.hasOwnProperty('presentationDate')) {
			this.presentationDate = obj.presentationDate;
		}

	}

  documentType?: string;
  reference?: string;
  publicationDate?: string;
  presentationDate?: string;
}

export class ImmunizationPerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
}

export class Immunization extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('vaccineCode')) {
			this.vaccineCode = obj.vaccineCode;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrenceString')) {
			this.occurrenceString = obj.occurrenceString;
		}

		if (obj.hasOwnProperty('recorded')) {
			this.recorded = obj.recorded;
		}

		if (obj.hasOwnProperty('primarySource')) {
			this.primarySource = obj.primarySource;
		}

		if (obj.hasOwnProperty('reportOrigin')) {
			this.reportOrigin = obj.reportOrigin;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = obj.manufacturer;
		}

		if (obj.hasOwnProperty('lotNumber')) {
			this.lotNumber = obj.lotNumber;
		}

		if (obj.hasOwnProperty('expirationDate')) {
			this.expirationDate = obj.expirationDate;
		}

		if (obj.hasOwnProperty('site')) {
			this.site = obj.site;
		}

		if (obj.hasOwnProperty('route')) {
			this.route = obj.route;
		}

		if (obj.hasOwnProperty('doseQuantity')) {
			this.doseQuantity = obj.doseQuantity;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new ImmunizationPerformer(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('isSubpotent')) {
			this.isSubpotent = obj.isSubpotent;
		}

		if (obj.hasOwnProperty('subpotentReason')) {
			this.subpotentReason = [];
			for (const o of (obj.subpotentReason instanceof Array ? obj.subpotentReason : [])) {
				this.subpotentReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('education')) {
			this.education = [];
			for (const o of (obj.education instanceof Array ? obj.education : [])) {
				this.education.push(new ImmunizationEducation(o));
			}
		}

		if (obj.hasOwnProperty('programEligibility')) {
			this.programEligibility = [];
			for (const o of (obj.programEligibility instanceof Array ? obj.programEligibility : [])) {
				this.programEligibility.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('fundingSource')) {
			this.fundingSource = obj.fundingSource;
		}

		if (obj.hasOwnProperty('reaction')) {
			this.reaction = [];
			for (const o of (obj.reaction instanceof Array ? obj.reaction : [])) {
				this.reaction.push(new ImmunizationReaction(o));
			}
		}

		if (obj.hasOwnProperty('protocolApplied')) {
			this.protocolApplied = [];
			for (const o of (obj.protocolApplied instanceof Array ? obj.protocolApplied : [])) {
				this.protocolApplied.push(new ImmunizationProtocolApplied(o));
			}
		}

	}

  resourceType = 'Immunization';
  identifier?: Identifier[];
  status: ImmunizationStatus1;
  statusReason?: CodeableConcept;
  vaccineCode: CodeableConcept;
  patient: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrenceString?: string;
  recorded?: string;
  primarySource?: boolean;
  reportOrigin?: CodeableConcept;
  location?: Reference;
  manufacturer?: Reference;
  lotNumber?: string;
  expirationDate?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: ImmunizationPerformer[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  isSubpotent?: boolean;
  subpotentReason?: CodeableConcept[];
  education?: ImmunizationEducation[];
  programEligibility?: CodeableConcept[];
  fundingSource?: CodeableConcept;
  reaction?: ImmunizationReaction[];
  protocolApplied?: ImmunizationProtocolApplied[];
}

export class ImmunizationEvaluation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('authority')) {
			this.authority = obj.authority;
		}

		if (obj.hasOwnProperty('targetDisease')) {
			this.targetDisease = obj.targetDisease;
		}

		if (obj.hasOwnProperty('immunizationEvent')) {
			this.immunizationEvent = obj.immunizationEvent;
		}

		if (obj.hasOwnProperty('doseStatus')) {
			this.doseStatus = obj.doseStatus;
		}

		if (obj.hasOwnProperty('doseStatusReason')) {
			this.doseStatusReason = [];
			for (const o of (obj.doseStatusReason instanceof Array ? obj.doseStatusReason : [])) {
				this.doseStatusReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('series')) {
			this.series = obj.series;
		}

		if (obj.hasOwnProperty('doseNumberPositiveInt')) {
			this.doseNumberPositiveInt = obj.doseNumberPositiveInt;
		}

		if (obj.hasOwnProperty('doseNumberString')) {
			this.doseNumberString = obj.doseNumberString;
		}

		if (obj.hasOwnProperty('seriesDosesPositiveInt')) {
			this.seriesDosesPositiveInt = obj.seriesDosesPositiveInt;
		}

		if (obj.hasOwnProperty('seriesDosesString')) {
			this.seriesDosesString = obj.seriesDosesString;
		}

	}

  resourceType = 'ImmunizationEvaluation';
  identifier?: Identifier[];
  status: ImmunizationEvaluationStatus1;
  patient: Reference;
  date?: string;
  authority?: Reference;
  targetDisease: CodeableConcept;
  immunizationEvent: Reference;
  doseStatus: CodeableConcept;
  doseStatusReason?: CodeableConcept[];
  description?: string;
  series?: string;
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

export class ImmunizationRecommendationRecommendationDateCriterion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  code: CodeableConcept;
  value: string;
}

export class ImmunizationRecommendationRecommendation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('vaccineCode')) {
			this.vaccineCode = [];
			for (const o of (obj.vaccineCode instanceof Array ? obj.vaccineCode : [])) {
				this.vaccineCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('targetDisease')) {
			this.targetDisease = obj.targetDisease;
		}

		if (obj.hasOwnProperty('contraindicatedVaccineCode')) {
			this.contraindicatedVaccineCode = [];
			for (const o of (obj.contraindicatedVaccineCode instanceof Array ? obj.contraindicatedVaccineCode : [])) {
				this.contraindicatedVaccineCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('forecastStatus')) {
			this.forecastStatus = obj.forecastStatus;
		}

		if (obj.hasOwnProperty('forecastReason')) {
			this.forecastReason = [];
			for (const o of (obj.forecastReason instanceof Array ? obj.forecastReason : [])) {
				this.forecastReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('dateCriterion')) {
			this.dateCriterion = [];
			for (const o of (obj.dateCriterion instanceof Array ? obj.dateCriterion : [])) {
				this.dateCriterion.push(new ImmunizationRecommendationRecommendationDateCriterion(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('series')) {
			this.series = obj.series;
		}

		if (obj.hasOwnProperty('doseNumberPositiveInt')) {
			this.doseNumberPositiveInt = obj.doseNumberPositiveInt;
		}

		if (obj.hasOwnProperty('doseNumberString')) {
			this.doseNumberString = obj.doseNumberString;
		}

		if (obj.hasOwnProperty('seriesDosesPositiveInt')) {
			this.seriesDosesPositiveInt = obj.seriesDosesPositiveInt;
		}

		if (obj.hasOwnProperty('seriesDosesString')) {
			this.seriesDosesString = obj.seriesDosesString;
		}

		if (obj.hasOwnProperty('supportingImmunization')) {
			this.supportingImmunization = [];
			for (const o of (obj.supportingImmunization instanceof Array ? obj.supportingImmunization : [])) {
				this.supportingImmunization.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supportingPatientInformation')) {
			this.supportingPatientInformation = [];
			for (const o of (obj.supportingPatientInformation instanceof Array ? obj.supportingPatientInformation : [])) {
				this.supportingPatientInformation.push(new Reference(o));
			}
		}

	}

  vaccineCode?: CodeableConcept[];
  targetDisease?: CodeableConcept;
  contraindicatedVaccineCode?: CodeableConcept[];
  forecastStatus: CodeableConcept;
  forecastReason?: CodeableConcept[];
  dateCriterion?: ImmunizationRecommendationRecommendationDateCriterion[];
  description?: string;
  series?: string;
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
  supportingImmunization?: Reference[];
  supportingPatientInformation?: Reference[];
}

export class ImmunizationRecommendation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('authority')) {
			this.authority = obj.authority;
		}

		if (obj.hasOwnProperty('recommendation')) {
			this.recommendation = [];
			for (const o of (obj.recommendation instanceof Array ? obj.recommendation : [])) {
				this.recommendation.push(new ImmunizationRecommendationRecommendation(o));
			}
		}

	}

  resourceType = 'ImmunizationRecommendation';
  identifier?: Identifier[];
  patient: Reference;
  date: string;
  authority?: Reference;
  recommendation: ImmunizationRecommendationRecommendation[];
}

export class ImplementationGuideManifestPage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('anchor')) {
			this.anchor = [];
			for (const o of (obj.anchor instanceof Array ? obj.anchor : [])) {
				this.anchor.push(o);
			}
		}

	}

  name: string;
  title?: string;
  anchor?: string[];
}

export class ImplementationGuideManifestResource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('exampleBoolean')) {
			this.exampleBoolean = obj.exampleBoolean;
		}

		if (obj.hasOwnProperty('exampleCanonical')) {
			this.exampleCanonical = obj.exampleCanonical;
		}

		if (obj.hasOwnProperty('relativePath')) {
			this.relativePath = obj.relativePath;
		}

	}

  reference: Reference;
  exampleBoolean?: boolean;
  exampleCanonical?: string;
  relativePath?: string;
}

export class ImplementationGuideManifest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('rendering')) {
			this.rendering = obj.rendering;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = [];
			for (const o of (obj.resource instanceof Array ? obj.resource : [])) {
				this.resource.push(new ImplementationGuideManifestResource(o));
			}
		}

		if (obj.hasOwnProperty('page')) {
			this.page = [];
			for (const o of (obj.page instanceof Array ? obj.page : [])) {
				this.page.push(new ImplementationGuideManifestPage(o));
			}
		}

		if (obj.hasOwnProperty('image')) {
			this.image = [];
			for (const o of (obj.image instanceof Array ? obj.image : [])) {
				this.image.push(o);
			}
		}

		if (obj.hasOwnProperty('other')) {
			this.other = [];
			for (const o of (obj.other instanceof Array ? obj.other : [])) {
				this.other.push(o);
			}
		}

	}

  rendering?: string;
  resource: ImplementationGuideManifestResource[];
  page?: ImplementationGuideManifestPage[];
  image?: string[];
  other?: string[];
}

export class ImplementationGuideDefinitionTemplate extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('scope')) {
			this.scope = obj.scope;
		}

	}

  code: string;
  source: string;
  scope?: string;
}

export class ImplementationGuideDefinitionParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  code: ImplementationGuideCode1|string;
  value: string;
}

export class ImplementationGuideDefinitionPage extends Element {
	constructor(obj?: any) {
    super(obj);

		if (obj.hasOwnProperty('nameUrl')) {
			this.nameUrl = obj.nameUrl;
		}

		if (obj.hasOwnProperty('nameReference')) {
			this.nameReference = obj.nameReference;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('generation')) {
			this.generation = obj.generation;
		}

		if (obj.hasOwnProperty('page')) {
			this.page = [];
			for (const o of (obj.page instanceof Array ? obj.page : [])) {
				this.page.push(new ImplementationGuideDefinitionPage(o));
			}
		}

	}

  nameUrl?: string;
  nameReference?: Reference;
  title: string;
  generation: ImplementationGuideGeneration1;
  page?: ImplementationGuideDefinitionPage[];

  public getExtension() {
    switch (this.generation) {
      case 'markdown':
      case 'generated':
        return '.md';
      default:
        return `.${this.generation}`;
    }
  }

  public setTitle(value: string, isRoot = false) {
    this.title = value;

    if (!isRoot && value) {
      this.fileName = value.toLowerCase().replace(/\s/g, '_').replace(/[():]/g, '') + this.getExtension();
    } else if (isRoot) {
      this.fileName = 'index' + this.getExtension();
    }
  }

  public get navMenu() {
    const navMenuExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);
    if (navMenuExt) return navMenuExt.valueString;
  }

  public set navMenu(value: string) {
    this.extension = this.extension || [];
    let navMenuExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-nav-menu']);

    if (!navMenuExt && value) {
      navMenuExt = {
        url: Globals.extensionUrls['extension-ig-page-nav-menu'],
        valueString: value
      };
      this.extension.push(navMenuExt);
    } else if (navMenuExt && !value) {
      const index = this.extension.indexOf(navMenuExt);
      this.extension.splice(index, 1);
    } else if (navMenuExt && value) {
      navMenuExt.valueString = value
    }
  }

  public get fileName() {
    const fileNameExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-filename']);
    if (fileNameExt) return fileNameExt.valueUri;
  }

  public set fileName(value: string) {
    this.extension = this.extension || [];
    let fileNameExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-filename']);

    if (!fileNameExt && value) {
      fileNameExt = {
        url: Globals.extensionUrls['extension-ig-page-filename'],
        valueUri: value.replace(/\s/g, '_')
      };
      this.extension.push(fileNameExt);
    } else if (fileNameExt && !value) {
      const index = this.extension.indexOf(fileNameExt);
      this.extension.splice(index, 1);
    } else if (fileNameExt && value) {
      fileNameExt.valueUri = value.replace(/\s/g, '_');
    }

    if (this.hasOwnProperty('nameUrl') || !this.nameReference) {
      if (value) {
        let generatedNameUrl = value;

        if (!generatedNameUrl.endsWith('.html')) {
          generatedNameUrl = generatedNameUrl.substring(0, generatedNameUrl.lastIndexOf('.')) + '.html';
        }

        this.nameUrl = generatedNameUrl;
      } else {
        delete this.nameUrl;
      }
    }
  }

  public get reuseDescription() {
    const reuseDescriptionExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-reuse-description']);
    if (reuseDescriptionExt) return reuseDescriptionExt.valueBoolean;
    return false;
  }

  public set reuseDescription(value: boolean) {
    this.extension = this.extension || [];
    let reuseDescriptionExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-reuse-description']);

    if (!reuseDescriptionExt) {
      reuseDescriptionExt = {
        url: Globals.extensionUrls['extension-ig-page-reuse-description'],
        valueBoolean: value
      };
      this.extension.push(reuseDescriptionExt);
    } else if (reuseDescriptionExt) {
      reuseDescriptionExt.valueBoolean = value;
    }

    if (value) {
      this.contentMarkdown = null;
    }
  }

  public get contentMarkdown() {
    const contentExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-content']);
    if (contentExt) return contentExt.valueMarkdown;
  }

  public set contentMarkdown(value: string) {
    this.extension = this.extension || [];
    let contentExt = (this.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-page-content']);

    if (!contentExt && value) {
      contentExt = {
        url: Globals.extensionUrls['extension-ig-page-content'],
        valueMarkdown: value
      };
      this.extension.push(contentExt);
    } else if (contentExt && !value) {
      const index = this.extension.indexOf(contentExt);
      this.extension.splice(index, 1);
    } else if (contentExt && value) {
      contentExt.valueMarkdown = value;
    }
  }
}

export class ImplementationGuideDefinitionResource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('reference')) {
			this.reference = obj.reference;
		}

		if (obj.hasOwnProperty('fhirVersion')) {
			this.fhirVersion = [];
			for (const o of (obj.fhirVersion instanceof Array ? obj.fhirVersion : [])) {
				this.fhirVersion.push(o);
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('exampleBoolean')) {
			this.exampleBoolean = obj.exampleBoolean;
		}

		if (obj.hasOwnProperty('exampleCanonical')) {
			this.exampleCanonical = obj.exampleCanonical;
		}

		if (obj.hasOwnProperty('groupingId')) {
			this.groupingId = obj.groupingId;
		}

	}

  reference: Reference;
  fhirVersion?: ImplementationGuideFhirVersion2[];
  name?: string;
  description?: string;
  exampleBoolean?: boolean;
  exampleCanonical?: string;
  groupingId?: string;
}

export class ImplementationGuideDefinitionGrouping extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  name: string;
  description?: string;
}

export class ImplementationGuideDefinition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('grouping')) {
			this.grouping = [];
			for (const o of (obj.grouping instanceof Array ? obj.grouping : [])) {
				this.grouping.push(new ImplementationGuideDefinitionGrouping(o));
			}
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = [];
			for (const o of (obj.resource instanceof Array ? obj.resource : [])) {
				this.resource.push(new ImplementationGuideDefinitionResource(o));
			}
		}

		if (obj.hasOwnProperty('page')) {
			this.page = obj.page;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new ImplementationGuideDefinitionParameter(o));
			}
		}

		if (obj.hasOwnProperty('template')) {
			this.template = [];
			for (const o of (obj.template instanceof Array ? obj.template : [])) {
				this.template.push(new ImplementationGuideDefinitionTemplate(o));
			}
		}

	}

  grouping?: ImplementationGuideDefinitionGrouping[];
  resource: ImplementationGuideDefinitionResource[];
  page?: ImplementationGuideDefinitionPage;
  parameter?: ImplementationGuideDefinitionParameter[];
  template?: ImplementationGuideDefinitionTemplate[];
}

export class ImplementationGuideGlobal extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

	}

  type: ImplementationGuideType1|string;
  profile: string;
}

export class ImplementationGuideDependsOn extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

		if (obj.hasOwnProperty('packageId')) {
			this.packageId = obj.packageId;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

	}

  uri: string;
  packageId?: string;
  version?: string;
}

export class ImplementationGuide extends DomainResource implements IFhir.IImplementationGuide {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('packageId')) {
			this.packageId = obj.packageId;
		}

		if (obj.hasOwnProperty('license')) {
			this.license = obj.license;
		}

		if (obj.hasOwnProperty('fhirVersion')) {
			this.fhirVersion = [];
			for (const o of (obj.fhirVersion instanceof Array ? obj.fhirVersion : [])) {
				this.fhirVersion.push(o);
			}
		}

		if (obj.hasOwnProperty('dependsOn')) {
			this.dependsOn = [];
			for (const o of (obj.dependsOn instanceof Array ? obj.dependsOn : [])) {
				this.dependsOn.push(new ImplementationGuideDependsOn(o));
			}
		}

		if (obj.hasOwnProperty('global')) {
			this.global = [];
			for (const o of (obj.global instanceof Array ? obj.global : [])) {
				this.global.push(new ImplementationGuideGlobal(o));
			}
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('manifest')) {
			this.manifest = obj.manifest;
		}

	}

  resourceType = 'ImplementationGuide';
  url: string;
  version?: string;
  name: string;
  title?: string;
  status: ImplementationGuideStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  copyright?: string;
  packageId: string;
  license?: ImplementationGuideLicense1;
  fhirVersion: (ImplementationGuideFhirVersion1|string)[];
  dependsOn?: ImplementationGuideDependsOn[];
  global?: ImplementationGuideGlobal[];
  definition?: ImplementationGuideDefinition;
  manifest?: ImplementationGuideManifest;
}

export class IngredientSubstanceStrengthReferenceStrength extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('substance')) {
			this.substance = obj.substance;
		}

		if (obj.hasOwnProperty('strengthRatio')) {
			this.strengthRatio = obj.strengthRatio;
		}

		if (obj.hasOwnProperty('strengthRatioRange')) {
			this.strengthRatioRange = obj.strengthRatioRange;
		}

		if (obj.hasOwnProperty('measurementPoint')) {
			this.measurementPoint = obj.measurementPoint;
		}

		if (obj.hasOwnProperty('country')) {
			this.country = [];
			for (const o of (obj.country instanceof Array ? obj.country : [])) {
				this.country.push(new CodeableConcept(o));
			}
		}

	}

  substance?: CodeableReference;
  strengthRatio?: Ratio;
  strengthRatioRange?: RatioRange;
  measurementPoint?: string;
  country?: CodeableConcept[];
}

export class IngredientSubstanceStrength extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('presentationRatio')) {
			this.presentationRatio = obj.presentationRatio;
		}

		if (obj.hasOwnProperty('presentationRatioRange')) {
			this.presentationRatioRange = obj.presentationRatioRange;
		}

		if (obj.hasOwnProperty('textPresentation')) {
			this.textPresentation = obj.textPresentation;
		}

		if (obj.hasOwnProperty('concentrationRatio')) {
			this.concentrationRatio = obj.concentrationRatio;
		}

		if (obj.hasOwnProperty('concentrationRatioRange')) {
			this.concentrationRatioRange = obj.concentrationRatioRange;
		}

		if (obj.hasOwnProperty('textConcentration')) {
			this.textConcentration = obj.textConcentration;
		}

		if (obj.hasOwnProperty('measurementPoint')) {
			this.measurementPoint = obj.measurementPoint;
		}

		if (obj.hasOwnProperty('country')) {
			this.country = [];
			for (const o of (obj.country instanceof Array ? obj.country : [])) {
				this.country.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('referenceStrength')) {
			this.referenceStrength = [];
			for (const o of (obj.referenceStrength instanceof Array ? obj.referenceStrength : [])) {
				this.referenceStrength.push(new IngredientSubstanceStrengthReferenceStrength(o));
			}
		}

	}

  presentationRatio?: Ratio;
  presentationRatioRange?: RatioRange;
  textPresentation?: string;
  concentrationRatio?: Ratio;
  concentrationRatioRange?: RatioRange;
  textConcentration?: string;
  measurementPoint?: string;
  country?: CodeableConcept[];
  referenceStrength?: IngredientSubstanceStrengthReferenceStrength[];
}

export class IngredientSubstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('strength')) {
			this.strength = [];
			for (const o of (obj.strength instanceof Array ? obj.strength : [])) {
				this.strength.push(new IngredientSubstanceStrength(o));
			}
		}

	}

  code: CodeableReference;
  strength?: IngredientSubstanceStrength[];
}

export class IngredientManufacturer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = obj.manufacturer;
		}

	}

  role?: IngredientRole1;
  manufacturer: Reference;
}

export class Ingredient extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('for')) {
			this.for = [];
			for (const o of (obj.for instanceof Array ? obj.for : [])) {
				this.for.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('function')) {
			this.function = [];
			for (const o of (obj.function instanceof Array ? obj.function : [])) {
				this.function.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('allergenicIndicator')) {
			this.allergenicIndicator = obj.allergenicIndicator;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new IngredientManufacturer(o));
			}
		}

		if (obj.hasOwnProperty('substance')) {
			this.substance = obj.substance;
		}

	}

  resourceType = 'Ingredient';
  identifier?: Identifier;
  status: IngredientStatus1;
  for?: Reference[];
  role: CodeableConcept;
  function?: CodeableConcept[];
  allergenicIndicator?: boolean;
  manufacturer?: IngredientManufacturer[];
  substance: IngredientSubstance;
}

export class InsurancePlanPlanSpecificCostBenefitCost extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('applicability')) {
			this.applicability = obj.applicability;
		}

		if (obj.hasOwnProperty('qualifiers')) {
			this.qualifiers = [];
			for (const o of (obj.qualifiers instanceof Array ? obj.qualifiers : [])) {
				this.qualifiers.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  type: CodeableConcept;
  applicability?: CodeableConcept;
  qualifiers?: CodeableConcept[];
  value?: Quantity;
}

export class InsurancePlanPlanSpecificCostBenefit extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('cost')) {
			this.cost = [];
			for (const o of (obj.cost instanceof Array ? obj.cost : [])) {
				this.cost.push(new InsurancePlanPlanSpecificCostBenefitCost(o));
			}
		}

	}

  type: CodeableConcept;
  cost?: InsurancePlanPlanSpecificCostBenefitCost[];
}

export class InsurancePlanPlanSpecificCost extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('benefit')) {
			this.benefit = [];
			for (const o of (obj.benefit instanceof Array ? obj.benefit : [])) {
				this.benefit.push(new InsurancePlanPlanSpecificCostBenefit(o));
			}
		}

	}

  category: CodeableConcept;
  benefit?: InsurancePlanPlanSpecificCostBenefit[];
}

export class InsurancePlanPlanGeneralCost extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('groupSize')) {
			this.groupSize = obj.groupSize;
		}

		if (obj.hasOwnProperty('cost')) {
			this.cost = obj.cost;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  type?: CodeableConcept;
  groupSize?: number;
  cost?: Money;
  comment?: string;
}

export class InsurancePlanPlan extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('coverageArea')) {
			this.coverageArea = [];
			for (const o of (obj.coverageArea instanceof Array ? obj.coverageArea : [])) {
				this.coverageArea.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('network')) {
			this.network = [];
			for (const o of (obj.network instanceof Array ? obj.network : [])) {
				this.network.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('generalCost')) {
			this.generalCost = [];
			for (const o of (obj.generalCost instanceof Array ? obj.generalCost : [])) {
				this.generalCost.push(new InsurancePlanPlanGeneralCost(o));
			}
		}

		if (obj.hasOwnProperty('specificCost')) {
			this.specificCost = [];
			for (const o of (obj.specificCost instanceof Array ? obj.specificCost : [])) {
				this.specificCost.push(new InsurancePlanPlanSpecificCost(o));
			}
		}

	}

  identifier?: Identifier[];
  type?: CodeableConcept;
  coverageArea?: Reference[];
  network?: Reference[];
  generalCost?: InsurancePlanPlanGeneralCost[];
  specificCost?: InsurancePlanPlanSpecificCost[];
}

export class InsurancePlanCoverageBenefitLimit extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

	}

  value?: Quantity;
  code?: CodeableConcept;
}

export class InsurancePlanCoverageBenefit extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('requirement')) {
			this.requirement = obj.requirement;
		}

		if (obj.hasOwnProperty('limit')) {
			this.limit = [];
			for (const o of (obj.limit instanceof Array ? obj.limit : [])) {
				this.limit.push(new InsurancePlanCoverageBenefitLimit(o));
			}
		}

	}

  type: CodeableConcept;
  requirement?: string;
  limit?: InsurancePlanCoverageBenefitLimit[];
}

export class InsurancePlanCoverage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = [];
			for (const o of (obj.network instanceof Array ? obj.network : [])) {
				this.network.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('benefit')) {
			this.benefit = [];
			for (const o of (obj.benefit instanceof Array ? obj.benefit : [])) {
				this.benefit.push(new InsurancePlanCoverageBenefit(o));
			}
		}

	}

  type: CodeableConcept;
  network?: Reference[];
  benefit: InsurancePlanCoverageBenefit[];
}

export class InsurancePlanContact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

	}

  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

export class InsurancePlan extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = [];
			for (const o of (obj.alias instanceof Array ? obj.alias : [])) {
				this.alias.push(o);
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('ownedBy')) {
			this.ownedBy = obj.ownedBy;
		}

		if (obj.hasOwnProperty('administeredBy')) {
			this.administeredBy = obj.administeredBy;
		}

		if (obj.hasOwnProperty('coverageArea')) {
			this.coverageArea = [];
			for (const o of (obj.coverageArea instanceof Array ? obj.coverageArea : [])) {
				this.coverageArea.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new InsurancePlanContact(o));
			}
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('network')) {
			this.network = [];
			for (const o of (obj.network instanceof Array ? obj.network : [])) {
				this.network.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('coverage')) {
			this.coverage = [];
			for (const o of (obj.coverage instanceof Array ? obj.coverage : [])) {
				this.coverage.push(new InsurancePlanCoverage(o));
			}
		}

		if (obj.hasOwnProperty('plan')) {
			this.plan = [];
			for (const o of (obj.plan instanceof Array ? obj.plan : [])) {
				this.plan.push(new InsurancePlanPlan(o));
			}
		}

	}

  resourceType = 'InsurancePlan';
  identifier?: Identifier[];
  status?: InsurancePlanStatus1;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  period?: Period;
  ownedBy?: Reference;
  administeredBy?: Reference;
  coverageArea?: Reference[];
  contact?: InsurancePlanContact[];
  endpoint?: Reference[];
  network?: Reference[];
  coverage?: InsurancePlanCoverage[];
  plan?: InsurancePlanPlan[];
}

export class InvoiceLineItemPriceComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('factor')) {
			this.factor = obj.factor;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  type: InvoiceType1;
  code?: CodeableConcept;
  factor?: number;
  amount?: Money;
}

export class InvoiceLineItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('sequence')) {
			this.sequence = obj.sequence;
		}

		if (obj.hasOwnProperty('chargeItemReference')) {
			this.chargeItemReference = obj.chargeItemReference;
		}

		if (obj.hasOwnProperty('chargeItemCodeableConcept')) {
			this.chargeItemCodeableConcept = obj.chargeItemCodeableConcept;
		}

		if (obj.hasOwnProperty('priceComponent')) {
			this.priceComponent = [];
			for (const o of (obj.priceComponent instanceof Array ? obj.priceComponent : [])) {
				this.priceComponent.push(new InvoiceLineItemPriceComponent(o));
			}
		}

	}

  sequence?: number;
  chargeItemReference?: Reference;
  chargeItemCodeableConcept?: CodeableConcept;
  priceComponent?: InvoiceLineItemPriceComponent[];
}

export class InvoiceParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  role?: CodeableConcept;
  actor: Reference;
}

export class Invoice extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('cancelledReason')) {
			this.cancelledReason = obj.cancelledReason;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = obj.recipient;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new InvoiceParticipant(o));
			}
		}

		if (obj.hasOwnProperty('issuer')) {
			this.issuer = obj.issuer;
		}

		if (obj.hasOwnProperty('account')) {
			this.account = obj.account;
		}

		if (obj.hasOwnProperty('lineItem')) {
			this.lineItem = [];
			for (const o of (obj.lineItem instanceof Array ? obj.lineItem : [])) {
				this.lineItem.push(new InvoiceLineItem(o));
			}
		}

		if (obj.hasOwnProperty('totalPriceComponent')) {
			this.totalPriceComponent = [];
			for (const o of (obj.totalPriceComponent instanceof Array ? obj.totalPriceComponent : [])) {
				this.totalPriceComponent.push(new InvoiceLineItemPriceComponent(o));
			}
		}

		if (obj.hasOwnProperty('totalNet')) {
			this.totalNet = obj.totalNet;
		}

		if (obj.hasOwnProperty('totalGross')) {
			this.totalGross = obj.totalGross;
		}

		if (obj.hasOwnProperty('paymentTerms')) {
			this.paymentTerms = obj.paymentTerms;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'Invoice';
  identifier?: Identifier[];
  status: InvoiceStatus1;
  cancelledReason?: string;
  type?: CodeableConcept;
  subject?: Reference;
  recipient?: Reference;
  date?: string;
  participant?: InvoiceParticipant[];
  issuer?: Reference;
  account?: Reference;
  lineItem?: InvoiceLineItem[];
  totalPriceComponent?: InvoiceLineItemPriceComponent[];
  totalNet?: Money;
  totalGross?: Money;
  paymentTerms?: string;
  note?: Annotation[];
}

export class Library extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new ParameterDefinition(o));
			}
		}

		if (obj.hasOwnProperty('dataRequirement')) {
			this.dataRequirement = [];
			for (const o of (obj.dataRequirement instanceof Array ? obj.dataRequirement : [])) {
				this.dataRequirement.push(new DataRequirement(o));
			}
		}

		if (obj.hasOwnProperty('content')) {
			this.content = [];
			for (const o of (obj.content instanceof Array ? obj.content : [])) {
				this.content.push(new Attachment(o));
			}
		}

	}

  resourceType = 'Library';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: LibraryStatus1;
  experimental?: boolean;
  type: CodeableConcept;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  parameter?: ParameterDefinition[];
  dataRequirement?: DataRequirement[];
  content?: Attachment[];
}

export class LinkageItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

	}

  type: LinkageType1;
  resource: Reference;
}

export class Linkage extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new LinkageItem(o));
			}
		}

	}

  resourceType = 'Linkage';
  active?: boolean;
  author?: Reference;
  item: LinkageItem[];
}

export class ListEntry extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('flag')) {
			this.flag = obj.flag;
		}

		if (obj.hasOwnProperty('deleted')) {
			this.deleted = obj.deleted;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = obj.item;
		}

	}

  flag?: CodeableConcept;
  deleted?: boolean;
  date?: string;
  item: Reference;
}

export class List extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('orderedBy')) {
			this.orderedBy = obj.orderedBy;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('entry')) {
			this.entry = [];
			for (const o of (obj.entry instanceof Array ? obj.entry : [])) {
				this.entry.push(new ListEntry(o));
			}
		}

		if (obj.hasOwnProperty('emptyReason')) {
			this.emptyReason = obj.emptyReason;
		}

	}

  resourceType = 'List';
  identifier?: Identifier[];
  status: ListStatus1;
  mode: ListMode1;
  title?: string;
  code?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  date?: string;
  source?: Reference;
  orderedBy?: CodeableConcept;
  note?: Annotation[];
  entry?: ListEntry[];
  emptyReason?: CodeableConcept;
}

export class LocationHoursOfOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('daysOfWeek')) {
			this.daysOfWeek = [];
			for (const o of (obj.daysOfWeek instanceof Array ? obj.daysOfWeek : [])) {
				this.daysOfWeek.push(o);
			}
		}

		if (obj.hasOwnProperty('allDay')) {
			this.allDay = obj.allDay;
		}

		if (obj.hasOwnProperty('openingTime')) {
			this.openingTime = obj.openingTime;
		}

		if (obj.hasOwnProperty('closingTime')) {
			this.closingTime = obj.closingTime;
		}

	}

  daysOfWeek?: LocationDaysOfWeek1[];
  allDay?: boolean;
  openingTime?: string;
  closingTime?: string;
}

export class LocationPosition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('longitude')) {
			this.longitude = obj.longitude;
		}

		if (obj.hasOwnProperty('latitude')) {
			this.latitude = obj.latitude;
		}

		if (obj.hasOwnProperty('altitude')) {
			this.altitude = obj.altitude;
		}

	}

  longitude: number;
  latitude: number;
  altitude?: number;
}

export class Location extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('operationalStatus')) {
			this.operationalStatus = obj.operationalStatus;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = [];
			for (const o of (obj.alias instanceof Array ? obj.alias : [])) {
				this.alias.push(o);
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

		if (obj.hasOwnProperty('physicalType')) {
			this.physicalType = obj.physicalType;
		}

		if (obj.hasOwnProperty('position')) {
			this.position = obj.position;
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = obj.managingOrganization;
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = obj.partOf;
		}

		if (obj.hasOwnProperty('hoursOfOperation')) {
			this.hoursOfOperation = [];
			for (const o of (obj.hoursOfOperation instanceof Array ? obj.hoursOfOperation : [])) {
				this.hoursOfOperation.push(new LocationHoursOfOperation(o));
			}
		}

		if (obj.hasOwnProperty('availabilityExceptions')) {
			this.availabilityExceptions = obj.availabilityExceptions;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

	}

  resourceType = 'Location';
  identifier?: Identifier[];
  status?: LocationStatus1;
  operationalStatus?: Coding;
  name?: string;
  alias?: string[];
  description?: string;
  mode?: LocationMode1;
  type?: CodeableConcept[];
  telecom?: ContactPoint[];
  address?: Address;
  physicalType?: CodeableConcept;
  position?: LocationPosition;
  managingOrganization?: Reference;
  partOf?: Reference;
  hoursOfOperation?: LocationHoursOfOperation[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

export class ManufacturedItemDefinitionProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class ManufacturedItemDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('manufacturedDoseForm')) {
			this.manufacturedDoseForm = obj.manufacturedDoseForm;
		}

		if (obj.hasOwnProperty('unitOfPresentation')) {
			this.unitOfPresentation = obj.unitOfPresentation;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new ManufacturedItemDefinitionProperty(o));
			}
		}

	}

  resourceType = 'ManufacturedItemDefinition';
  identifier?: Identifier[];
  status: ManufacturedItemDefinitionStatus1;
  manufacturedDoseForm: CodeableConcept;
  unitOfPresentation?: CodeableConcept;
  manufacturer?: Reference[];
  ingredient?: CodeableConcept[];
  property?: ManufacturedItemDefinitionProperty[];
}

export class MeasureSupplementalData extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = [];
			for (const o of (obj.usage instanceof Array ? obj.usage : [])) {
				this.usage.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('criteria')) {
			this.criteria = obj.criteria;
		}

	}

  code?: CodeableConcept;
  usage?: CodeableConcept[];
  description?: string;
  criteria: Expression;
}

export class MeasureGroupStratifierComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('criteria')) {
			this.criteria = obj.criteria;
		}

	}

  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}

export class MeasureGroupStratifier extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('criteria')) {
			this.criteria = obj.criteria;
		}

		if (obj.hasOwnProperty('component')) {
			this.component = [];
			for (const o of (obj.component instanceof Array ? obj.component : [])) {
				this.component.push(new MeasureGroupStratifierComponent(o));
			}
		}

	}

  code?: CodeableConcept;
  description?: string;
  criteria?: Expression;
  component?: MeasureGroupStratifierComponent[];
}

export class MeasureGroupPopulation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('criteria')) {
			this.criteria = obj.criteria;
		}

	}

  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}

export class MeasureGroup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('population')) {
			this.population = [];
			for (const o of (obj.population instanceof Array ? obj.population : [])) {
				this.population.push(new MeasureGroupPopulation(o));
			}
		}

		if (obj.hasOwnProperty('stratifier')) {
			this.stratifier = [];
			for (const o of (obj.stratifier instanceof Array ? obj.stratifier : [])) {
				this.stratifier.push(new MeasureGroupStratifier(o));
			}
		}

	}

  code?: CodeableConcept;
  description?: string;
  population?: MeasureGroupPopulation[];
  stratifier?: MeasureGroupStratifier[];
}

export class Measure extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('library')) {
			this.library = [];
			for (const o of (obj.library instanceof Array ? obj.library : [])) {
				this.library.push(o);
			}
		}

		if (obj.hasOwnProperty('disclaimer')) {
			this.disclaimer = obj.disclaimer;
		}

		if (obj.hasOwnProperty('scoring')) {
			this.scoring = obj.scoring;
		}

		if (obj.hasOwnProperty('compositeScoring')) {
			this.compositeScoring = obj.compositeScoring;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('riskAdjustment')) {
			this.riskAdjustment = obj.riskAdjustment;
		}

		if (obj.hasOwnProperty('rateAggregation')) {
			this.rateAggregation = obj.rateAggregation;
		}

		if (obj.hasOwnProperty('rationale')) {
			this.rationale = obj.rationale;
		}

		if (obj.hasOwnProperty('clinicalRecommendationStatement')) {
			this.clinicalRecommendationStatement = obj.clinicalRecommendationStatement;
		}

		if (obj.hasOwnProperty('improvementNotation')) {
			this.improvementNotation = obj.improvementNotation;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = [];
			for (const o of (obj.definition instanceof Array ? obj.definition : [])) {
				this.definition.push(o);
			}
		}

		if (obj.hasOwnProperty('guidance')) {
			this.guidance = obj.guidance;
		}

		if (obj.hasOwnProperty('group')) {
			this.group = [];
			for (const o of (obj.group instanceof Array ? obj.group : [])) {
				this.group.push(new MeasureGroup(o));
			}
		}

		if (obj.hasOwnProperty('supplementalData')) {
			this.supplementalData = [];
			for (const o of (obj.supplementalData instanceof Array ? obj.supplementalData : [])) {
				this.supplementalData.push(new MeasureSupplementalData(o));
			}
		}

	}

  resourceType = 'Measure';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  status: MeasureStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  library?: string[];
  disclaimer?: string;
  scoring?: CodeableConcept;
  compositeScoring?: CodeableConcept;
  type?: CodeableConcept[];
  riskAdjustment?: string;
  rateAggregation?: string;
  rationale?: string;
  clinicalRecommendationStatement?: string;
  improvementNotation?: CodeableConcept;
  definition?: string[];
  guidance?: string;
  group?: MeasureGroup[];
  supplementalData?: MeasureSupplementalData[];
}

export class MeasureReportGroupStratifierStratumPopulation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('count')) {
			this.count = obj.count;
		}

		if (obj.hasOwnProperty('subjectResults')) {
			this.subjectResults = obj.subjectResults;
		}

	}

  code?: CodeableConcept;
  count?: number;
  subjectResults?: Reference;
}

export class MeasureReportGroupStratifierStratumComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  code: CodeableConcept;
  value: CodeableConcept;
}

export class MeasureReportGroupStratifierStratum extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('component')) {
			this.component = [];
			for (const o of (obj.component instanceof Array ? obj.component : [])) {
				this.component.push(new MeasureReportGroupStratifierStratumComponent(o));
			}
		}

		if (obj.hasOwnProperty('population')) {
			this.population = [];
			for (const o of (obj.population instanceof Array ? obj.population : [])) {
				this.population.push(new MeasureReportGroupStratifierStratumPopulation(o));
			}
		}

		if (obj.hasOwnProperty('measureScore')) {
			this.measureScore = obj.measureScore;
		}

	}

  value?: CodeableConcept;
  component?: MeasureReportGroupStratifierStratumComponent[];
  population?: MeasureReportGroupStratifierStratumPopulation[];
  measureScore?: Quantity;
}

export class MeasureReportGroupStratifier extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('stratum')) {
			this.stratum = [];
			for (const o of (obj.stratum instanceof Array ? obj.stratum : [])) {
				this.stratum.push(new MeasureReportGroupStratifierStratum(o));
			}
		}

	}

  code?: CodeableConcept[];
  stratum?: MeasureReportGroupStratifierStratum[];
}

export class MeasureReportGroupPopulation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('count')) {
			this.count = obj.count;
		}

		if (obj.hasOwnProperty('subjectResults')) {
			this.subjectResults = obj.subjectResults;
		}

	}

  code?: CodeableConcept;
  count?: number;
  subjectResults?: Reference;
}

export class MeasureReportGroup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('population')) {
			this.population = [];
			for (const o of (obj.population instanceof Array ? obj.population : [])) {
				this.population.push(new MeasureReportGroupPopulation(o));
			}
		}

		if (obj.hasOwnProperty('measureScore')) {
			this.measureScore = obj.measureScore;
		}

		if (obj.hasOwnProperty('stratifier')) {
			this.stratifier = [];
			for (const o of (obj.stratifier instanceof Array ? obj.stratifier : [])) {
				this.stratifier.push(new MeasureReportGroupStratifier(o));
			}
		}

	}

  code?: CodeableConcept;
  population?: MeasureReportGroupPopulation[];
  measureScore?: Quantity;
  stratifier?: MeasureReportGroupStratifier[];
}

export class MeasureReport extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('measure')) {
			this.measure = obj.measure;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('reporter')) {
			this.reporter = obj.reporter;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('improvementNotation')) {
			this.improvementNotation = obj.improvementNotation;
		}

		if (obj.hasOwnProperty('group')) {
			this.group = [];
			for (const o of (obj.group instanceof Array ? obj.group : [])) {
				this.group.push(new MeasureReportGroup(o));
			}
		}

		if (obj.hasOwnProperty('evaluatedResource')) {
			this.evaluatedResource = [];
			for (const o of (obj.evaluatedResource instanceof Array ? obj.evaluatedResource : [])) {
				this.evaluatedResource.push(new Reference(o));
			}
		}

	}

  resourceType = 'MeasureReport';
  identifier?: Identifier[];
  status: MeasureReportStatus1;
  type: MeasureReportType1;
  measure: string;
  subject?: Reference;
  date?: string;
  reporter?: Reference;
  period: Period;
  improvementNotation?: CodeableConcept;
  group?: MeasureReportGroup[];
  evaluatedResource?: Reference[];
}

export class Media extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('modality')) {
			this.modality = obj.modality;
		}

		if (obj.hasOwnProperty('view')) {
			this.view = obj.view;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('createdDateTime')) {
			this.createdDateTime = obj.createdDateTime;
		}

		if (obj.hasOwnProperty('createdPeriod')) {
			this.createdPeriod = obj.createdPeriod;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('operator')) {
			this.operator = obj.operator;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('deviceName')) {
			this.deviceName = obj.deviceName;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('height')) {
			this.height = obj.height;
		}

		if (obj.hasOwnProperty('width')) {
			this.width = obj.width;
		}

		if (obj.hasOwnProperty('frames')) {
			this.frames = obj.frames;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

		if (obj.hasOwnProperty('content')) {
			this.content = obj.content;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'Media';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: MediaStatus1;
  type?: CodeableConcept;
  modality?: CodeableConcept;
  view?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  createdDateTime?: string;
  createdPeriod?: Period;
  issued?: string;
  operator?: Reference;
  reasonCode?: CodeableConcept[];
  bodySite?: CodeableConcept;
  deviceName?: string;
  device?: Reference;
  height?: number;
  width?: number;
  frames?: number;
  duration?: number;
  content: Attachment;
  note?: Annotation[];
}

export class MedicationBatch extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('lotNumber')) {
			this.lotNumber = obj.lotNumber;
		}

		if (obj.hasOwnProperty('expirationDate')) {
			this.expirationDate = obj.expirationDate;
		}

	}

  lotNumber?: string;
  expirationDate?: string;
}

export class MedicationIngredient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

		if (obj.hasOwnProperty('isActive')) {
			this.isActive = obj.isActive;
		}

		if (obj.hasOwnProperty('strength')) {
			this.strength = obj.strength;
		}

	}

  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export class Medication extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = obj.manufacturer;
		}

		if (obj.hasOwnProperty('form')) {
			this.form = obj.form;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new MedicationIngredient(o));
			}
		}

		if (obj.hasOwnProperty('batch')) {
			this.batch = obj.batch;
		}

	}

  resourceType = 'Medication';
  identifier?: Identifier[];
  code?: CodeableConcept;
  status?: MedicationStatus1;
  manufacturer?: Reference;
  form?: CodeableConcept;
  amount?: Ratio;
  ingredient?: MedicationIngredient[];
  batch?: MedicationBatch;
}

export class MedicationAdministrationDosage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('site')) {
			this.site = obj.site;
		}

		if (obj.hasOwnProperty('route')) {
			this.route = obj.route;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('dose')) {
			this.dose = obj.dose;
		}

		if (obj.hasOwnProperty('rateRatio')) {
			this.rateRatio = obj.rateRatio;
		}

		if (obj.hasOwnProperty('rateQuantity')) {
			this.rateQuantity = obj.rateQuantity;
		}

	}

  text?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  dose?: Quantity;
  rateRatio?: Ratio;
  rateQuantity?: Quantity;
}

export class MedicationAdministrationPerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
}

export class MedicationAdministration extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiates')) {
			this.instantiates = [];
			for (const o of (obj.instantiates instanceof Array ? obj.instantiates : [])) {
				this.instantiates.push(o);
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = [];
			for (const o of (obj.statusReason instanceof Array ? obj.statusReason : [])) {
				this.statusReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('medicationCodeableConcept')) {
			this.medicationCodeableConcept = obj.medicationCodeableConcept;
		}

		if (obj.hasOwnProperty('medicationReference')) {
			this.medicationReference = obj.medicationReference;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = [];
			for (const o of (obj.supportingInformation instanceof Array ? obj.supportingInformation : [])) {
				this.supportingInformation.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('effectiveDateTime')) {
			this.effectiveDateTime = obj.effectiveDateTime;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new MedicationAdministrationPerformer(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = [];
			for (const o of (obj.device instanceof Array ? obj.device : [])) {
				this.device.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('dosage')) {
			this.dosage = obj.dosage;
		}

		if (obj.hasOwnProperty('eventHistory')) {
			this.eventHistory = [];
			for (const o of (obj.eventHistory instanceof Array ? obj.eventHistory : [])) {
				this.eventHistory.push(new Reference(o));
			}
		}

	}

  resourceType = 'MedicationAdministration';
  identifier?: Identifier[];
  instantiates?: string[];
  partOf?: Reference[];
  status: MedicationAdministrationStatus1;
  statusReason?: CodeableConcept[];
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  supportingInformation?: Reference[];
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  performer?: MedicationAdministrationPerformer[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  request?: Reference;
  device?: Reference[];
  note?: Annotation[];
  dosage?: MedicationAdministrationDosage;
  eventHistory?: Reference[];
}

export class MedicationDispenseSubstitution extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('wasSubstituted')) {
			this.wasSubstituted = obj.wasSubstituted;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = [];
			for (const o of (obj.reason instanceof Array ? obj.reason : [])) {
				this.reason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('responsibleParty')) {
			this.responsibleParty = [];
			for (const o of (obj.responsibleParty instanceof Array ? obj.responsibleParty : [])) {
				this.responsibleParty.push(new Reference(o));
			}
		}

	}

  wasSubstituted: boolean;
  type?: CodeableConcept;
  reason?: CodeableConcept[];
  responsibleParty?: Reference[];
}

export class MedicationDispensePerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
}

export class MedicationDispense extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReasonCodeableConcept')) {
			this.statusReasonCodeableConcept = obj.statusReasonCodeableConcept;
		}

		if (obj.hasOwnProperty('statusReasonReference')) {
			this.statusReasonReference = obj.statusReasonReference;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('medicationCodeableConcept')) {
			this.medicationCodeableConcept = obj.medicationCodeableConcept;
		}

		if (obj.hasOwnProperty('medicationReference')) {
			this.medicationReference = obj.medicationReference;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = [];
			for (const o of (obj.supportingInformation instanceof Array ? obj.supportingInformation : [])) {
				this.supportingInformation.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new MedicationDispensePerformer(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('authorizingPrescription')) {
			this.authorizingPrescription = [];
			for (const o of (obj.authorizingPrescription instanceof Array ? obj.authorizingPrescription : [])) {
				this.authorizingPrescription.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('daysSupply')) {
			this.daysSupply = obj.daysSupply;
		}

		if (obj.hasOwnProperty('whenPrepared')) {
			this.whenPrepared = obj.whenPrepared;
		}

		if (obj.hasOwnProperty('whenHandedOver')) {
			this.whenHandedOver = obj.whenHandedOver;
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = obj.destination;
		}

		if (obj.hasOwnProperty('receiver')) {
			this.receiver = [];
			for (const o of (obj.receiver instanceof Array ? obj.receiver : [])) {
				this.receiver.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('dosageInstruction')) {
			this.dosageInstruction = [];
			for (const o of (obj.dosageInstruction instanceof Array ? obj.dosageInstruction : [])) {
				this.dosageInstruction.push(new Dosage(o));
			}
		}

		if (obj.hasOwnProperty('substitution')) {
			this.substitution = obj.substitution;
		}

		if (obj.hasOwnProperty('detectedIssue')) {
			this.detectedIssue = [];
			for (const o of (obj.detectedIssue instanceof Array ? obj.detectedIssue : [])) {
				this.detectedIssue.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('eventHistory')) {
			this.eventHistory = [];
			for (const o of (obj.eventHistory instanceof Array ? obj.eventHistory : [])) {
				this.eventHistory.push(new Reference(o));
			}
		}

	}

  resourceType = 'MedicationDispense';
  identifier?: Identifier[];
  partOf?: Reference[];
  status: MedicationDispenseStatus1;
  statusReasonCodeableConcept?: CodeableConcept;
  statusReasonReference?: Reference;
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject?: Reference;
  context?: Reference;
  supportingInformation?: Reference[];
  performer?: MedicationDispensePerformer[];
  location?: Reference;
  authorizingPrescription?: Reference[];
  type?: CodeableConcept;
  quantity?: Quantity;
  daysSupply?: Quantity;
  whenPrepared?: string;
  whenHandedOver?: string;
  destination?: Reference;
  receiver?: Reference[];
  note?: Annotation[];
  dosageInstruction?: Dosage[];
  substitution?: MedicationDispenseSubstitution;
  detectedIssue?: Reference[];
  eventHistory?: Reference[];
}

export class MedicationKnowledgeKinetics extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('areaUnderCurve')) {
			this.areaUnderCurve = [];
			for (const o of (obj.areaUnderCurve instanceof Array ? obj.areaUnderCurve : [])) {
				this.areaUnderCurve.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('lethalDose50')) {
			this.lethalDose50 = [];
			for (const o of (obj.lethalDose50 instanceof Array ? obj.lethalDose50 : [])) {
				this.lethalDose50.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('halfLifePeriod')) {
			this.halfLifePeriod = obj.halfLifePeriod;
		}

	}

  areaUnderCurve?: Quantity[];
  lethalDose50?: Quantity[];
  halfLifePeriod?: Duration;
}

export class MedicationKnowledgeRegulatoryMaxDispense extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  quantity: Quantity;
  period?: Duration;
}

export class MedicationKnowledgeRegulatorySchedule extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = obj.schedule;
		}

	}

  schedule: CodeableConcept;
}

export class MedicationKnowledgeRegulatorySubstitution extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('allowed')) {
			this.allowed = obj.allowed;
		}

	}

  type: CodeableConcept;
  allowed: boolean;
}

export class MedicationKnowledgeRegulatory extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('regulatoryAuthority')) {
			this.regulatoryAuthority = obj.regulatoryAuthority;
		}

		if (obj.hasOwnProperty('substitution')) {
			this.substitution = [];
			for (const o of (obj.substitution instanceof Array ? obj.substitution : [])) {
				this.substitution.push(new MedicationKnowledgeRegulatorySubstitution(o));
			}
		}

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = [];
			for (const o of (obj.schedule instanceof Array ? obj.schedule : [])) {
				this.schedule.push(new MedicationKnowledgeRegulatorySchedule(o));
			}
		}

		if (obj.hasOwnProperty('maxDispense')) {
			this.maxDispense = obj.maxDispense;
		}

	}

  regulatoryAuthority: Reference;
  substitution?: MedicationKnowledgeRegulatorySubstitution[];
  schedule?: MedicationKnowledgeRegulatorySchedule[];
  maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
}

export class MedicationKnowledgeDrugCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

	}

  type?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueQuantity?: Quantity;
  valueBase64Binary?: string;
}

export class MedicationKnowledgePackaging extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

	}

  type?: CodeableConcept;
  quantity?: Quantity;
}

export class MedicationKnowledgeMedicineClassification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CodeableConcept(o));
			}
		}

	}

  type: CodeableConcept;
  classification?: CodeableConcept[];
}

export class MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('characteristicCodeableConcept')) {
			this.characteristicCodeableConcept = obj.characteristicCodeableConcept;
		}

		if (obj.hasOwnProperty('characteristicQuantity')) {
			this.characteristicQuantity = obj.characteristicQuantity;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = [];
			for (const o of (obj.value instanceof Array ? obj.value : [])) {
				this.value.push(o);
			}
		}

	}

  characteristicCodeableConcept?: CodeableConcept;
  characteristicQuantity?: Quantity;
  value?: string[];
}

export class MedicationKnowledgeAdministrationGuidelinesDosage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('dosage')) {
			this.dosage = [];
			for (const o of (obj.dosage instanceof Array ? obj.dosage : [])) {
				this.dosage.push(new Dosage(o));
			}
		}

	}

  type: CodeableConcept;
  dosage: Dosage[];
}

export class MedicationKnowledgeAdministrationGuidelines extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('dosage')) {
			this.dosage = [];
			for (const o of (obj.dosage instanceof Array ? obj.dosage : [])) {
				this.dosage.push(new MedicationKnowledgeAdministrationGuidelinesDosage(o));
			}
		}

		if (obj.hasOwnProperty('indicationCodeableConcept')) {
			this.indicationCodeableConcept = obj.indicationCodeableConcept;
		}

		if (obj.hasOwnProperty('indicationReference')) {
			this.indicationReference = obj.indicationReference;
		}

		if (obj.hasOwnProperty('patientCharacteristics')) {
			this.patientCharacteristics = [];
			for (const o of (obj.patientCharacteristics instanceof Array ? obj.patientCharacteristics : [])) {
				this.patientCharacteristics.push(new MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics(o));
			}
		}

	}

  dosage?: MedicationKnowledgeAdministrationGuidelinesDosage[];
  indicationCodeableConcept?: CodeableConcept;
  indicationReference?: Reference;
  patientCharacteristics?: MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics[];
}

export class MedicationKnowledgeMonitoringProgram extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

	}

  type?: CodeableConcept;
  name?: string;
}

export class MedicationKnowledgeCost extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('cost')) {
			this.cost = obj.cost;
		}

	}

  type: CodeableConcept;
  source?: string;
  cost: Money;
}

export class MedicationKnowledgeIngredient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

		if (obj.hasOwnProperty('isActive')) {
			this.isActive = obj.isActive;
		}

		if (obj.hasOwnProperty('strength')) {
			this.strength = obj.strength;
		}

	}

  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export class MedicationKnowledgeMonograph extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

	}

  type?: CodeableConcept;
  source?: Reference;
}

export class MedicationKnowledgeRelatedMedicationKnowledge extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('reference')) {
			this.reference = [];
			for (const o of (obj.reference instanceof Array ? obj.reference : [])) {
				this.reference.push(new Reference(o));
			}
		}

	}

  type: CodeableConcept;
  reference: Reference[];
}

export class MedicationKnowledge extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = obj.manufacturer;
		}

		if (obj.hasOwnProperty('doseForm')) {
			this.doseForm = obj.doseForm;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('synonym')) {
			this.synonym = [];
			for (const o of (obj.synonym instanceof Array ? obj.synonym : [])) {
				this.synonym.push(o);
			}
		}

		if (obj.hasOwnProperty('relatedMedicationKnowledge')) {
			this.relatedMedicationKnowledge = [];
			for (const o of (obj.relatedMedicationKnowledge instanceof Array ? obj.relatedMedicationKnowledge : [])) {
				this.relatedMedicationKnowledge.push(new MedicationKnowledgeRelatedMedicationKnowledge(o));
			}
		}

		if (obj.hasOwnProperty('associatedMedication')) {
			this.associatedMedication = [];
			for (const o of (obj.associatedMedication instanceof Array ? obj.associatedMedication : [])) {
				this.associatedMedication.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('productType')) {
			this.productType = [];
			for (const o of (obj.productType instanceof Array ? obj.productType : [])) {
				this.productType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('monograph')) {
			this.monograph = [];
			for (const o of (obj.monograph instanceof Array ? obj.monograph : [])) {
				this.monograph.push(new MedicationKnowledgeMonograph(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new MedicationKnowledgeIngredient(o));
			}
		}

		if (obj.hasOwnProperty('preparationInstruction')) {
			this.preparationInstruction = obj.preparationInstruction;
		}

		if (obj.hasOwnProperty('intendedRoute')) {
			this.intendedRoute = [];
			for (const o of (obj.intendedRoute instanceof Array ? obj.intendedRoute : [])) {
				this.intendedRoute.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('cost')) {
			this.cost = [];
			for (const o of (obj.cost instanceof Array ? obj.cost : [])) {
				this.cost.push(new MedicationKnowledgeCost(o));
			}
		}

		if (obj.hasOwnProperty('monitoringProgram')) {
			this.monitoringProgram = [];
			for (const o of (obj.monitoringProgram instanceof Array ? obj.monitoringProgram : [])) {
				this.monitoringProgram.push(new MedicationKnowledgeMonitoringProgram(o));
			}
		}

		if (obj.hasOwnProperty('administrationGuidelines')) {
			this.administrationGuidelines = [];
			for (const o of (obj.administrationGuidelines instanceof Array ? obj.administrationGuidelines : [])) {
				this.administrationGuidelines.push(new MedicationKnowledgeAdministrationGuidelines(o));
			}
		}

		if (obj.hasOwnProperty('medicineClassification')) {
			this.medicineClassification = [];
			for (const o of (obj.medicineClassification instanceof Array ? obj.medicineClassification : [])) {
				this.medicineClassification.push(new MedicationKnowledgeMedicineClassification(o));
			}
		}

		if (obj.hasOwnProperty('packaging')) {
			this.packaging = obj.packaging;
		}

		if (obj.hasOwnProperty('drugCharacteristic')) {
			this.drugCharacteristic = [];
			for (const o of (obj.drugCharacteristic instanceof Array ? obj.drugCharacteristic : [])) {
				this.drugCharacteristic.push(new MedicationKnowledgeDrugCharacteristic(o));
			}
		}

		if (obj.hasOwnProperty('contraindication')) {
			this.contraindication = [];
			for (const o of (obj.contraindication instanceof Array ? obj.contraindication : [])) {
				this.contraindication.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('regulatory')) {
			this.regulatory = [];
			for (const o of (obj.regulatory instanceof Array ? obj.regulatory : [])) {
				this.regulatory.push(new MedicationKnowledgeRegulatory(o));
			}
		}

		if (obj.hasOwnProperty('kinetics')) {
			this.kinetics = [];
			for (const o of (obj.kinetics instanceof Array ? obj.kinetics : [])) {
				this.kinetics.push(new MedicationKnowledgeKinetics(o));
			}
		}

	}

  resourceType = 'MedicationKnowledge';
  code?: CodeableConcept;
  status?: MedicationKnowledgeStatus1;
  manufacturer?: Reference;
  doseForm?: CodeableConcept;
  amount?: Quantity;
  synonym?: string[];
  relatedMedicationKnowledge?: MedicationKnowledgeRelatedMedicationKnowledge[];
  associatedMedication?: Reference[];
  productType?: CodeableConcept[];
  monograph?: MedicationKnowledgeMonograph[];
  ingredient?: MedicationKnowledgeIngredient[];
  preparationInstruction?: string;
  intendedRoute?: CodeableConcept[];
  cost?: MedicationKnowledgeCost[];
  monitoringProgram?: MedicationKnowledgeMonitoringProgram[];
  administrationGuidelines?: MedicationKnowledgeAdministrationGuidelines[];
  medicineClassification?: MedicationKnowledgeMedicineClassification[];
  packaging?: MedicationKnowledgePackaging;
  drugCharacteristic?: MedicationKnowledgeDrugCharacteristic[];
  contraindication?: Reference[];
  regulatory?: MedicationKnowledgeRegulatory[];
  kinetics?: MedicationKnowledgeKinetics[];
}

export class MedicationRequestSubstitution extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('allowedBoolean')) {
			this.allowedBoolean = obj.allowedBoolean;
		}

		if (obj.hasOwnProperty('allowedCodeableConcept')) {
			this.allowedCodeableConcept = obj.allowedCodeableConcept;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

	}

  allowedBoolean?: boolean;
  allowedCodeableConcept?: CodeableConcept;
  reason?: CodeableConcept;
}

export class MedicationRequestDispenseRequestInitialFill extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

	}

  quantity?: Quantity;
  duration?: Duration;
}

export class MedicationRequestDispenseRequest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('initialFill')) {
			this.initialFill = obj.initialFill;
		}

		if (obj.hasOwnProperty('dispenseInterval')) {
			this.dispenseInterval = obj.dispenseInterval;
		}

		if (obj.hasOwnProperty('validityPeriod')) {
			this.validityPeriod = obj.validityPeriod;
		}

		if (obj.hasOwnProperty('numberOfRepeatsAllowed')) {
			this.numberOfRepeatsAllowed = obj.numberOfRepeatsAllowed;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('expectedSupplyDuration')) {
			this.expectedSupplyDuration = obj.expectedSupplyDuration;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

	}

  initialFill?: MedicationRequestDispenseRequestInitialFill;
  dispenseInterval?: Duration;
  validityPeriod?: Period;
  numberOfRepeatsAllowed?: number;
  quantity?: Quantity;
  expectedSupplyDuration?: Duration;
  performer?: Reference;
}

export class MedicationRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('reportedBoolean')) {
			this.reportedBoolean = obj.reportedBoolean;
		}

		if (obj.hasOwnProperty('reportedReference')) {
			this.reportedReference = obj.reportedReference;
		}

		if (obj.hasOwnProperty('medicationCodeableConcept')) {
			this.medicationCodeableConcept = obj.medicationCodeableConcept;
		}

		if (obj.hasOwnProperty('medicationReference')) {
			this.medicationReference = obj.medicationReference;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('supportingInformation')) {
			this.supportingInformation = [];
			for (const o of (obj.supportingInformation instanceof Array ? obj.supportingInformation : [])) {
				this.supportingInformation.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('performerType')) {
			this.performerType = obj.performerType;
		}

		if (obj.hasOwnProperty('recorder')) {
			this.recorder = obj.recorder;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('groupIdentifier')) {
			this.groupIdentifier = obj.groupIdentifier;
		}

		if (obj.hasOwnProperty('courseOfTherapyType')) {
			this.courseOfTherapyType = obj.courseOfTherapyType;
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('dosageInstruction')) {
			this.dosageInstruction = [];
			for (const o of (obj.dosageInstruction instanceof Array ? obj.dosageInstruction : [])) {
				this.dosageInstruction.push(new Dosage(o));
			}
		}

		if (obj.hasOwnProperty('dispenseRequest')) {
			this.dispenseRequest = obj.dispenseRequest;
		}

		if (obj.hasOwnProperty('substitution')) {
			this.substitution = obj.substitution;
		}

		if (obj.hasOwnProperty('priorPrescription')) {
			this.priorPrescription = obj.priorPrescription;
		}

		if (obj.hasOwnProperty('detectedIssue')) {
			this.detectedIssue = [];
			for (const o of (obj.detectedIssue instanceof Array ? obj.detectedIssue : [])) {
				this.detectedIssue.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('eventHistory')) {
			this.eventHistory = [];
			for (const o of (obj.eventHistory instanceof Array ? obj.eventHistory : [])) {
				this.eventHistory.push(new Reference(o));
			}
		}

	}

  resourceType = 'MedicationRequest';
  identifier?: Identifier[];
  status: MedicationRequestStatus1;
  statusReason?: CodeableConcept;
  intent: MedicationRequestIntent1;
  category?: CodeableConcept[];
  priority?: MedicationRequestPriority1;
  doNotPerform?: boolean;
  reportedBoolean?: boolean;
  reportedReference?: Reference;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  encounter?: Reference;
  supportingInformation?: Reference[];
  authoredOn?: string;
  requester?: Reference;
  performer?: Reference;
  performerType?: CodeableConcept;
  recorder?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  courseOfTherapyType?: CodeableConcept;
  insurance?: Reference[];
  note?: Annotation[];
  dosageInstruction?: Dosage[];
  dispenseRequest?: MedicationRequestDispenseRequest;
  substitution?: MedicationRequestSubstitution;
  priorPrescription?: Reference;
  detectedIssue?: Reference[];
  eventHistory?: Reference[];
}

export class MedicationStatement extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = [];
			for (const o of (obj.statusReason instanceof Array ? obj.statusReason : [])) {
				this.statusReason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('medicationCodeableConcept')) {
			this.medicationCodeableConcept = obj.medicationCodeableConcept;
		}

		if (obj.hasOwnProperty('medicationReference')) {
			this.medicationReference = obj.medicationReference;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('effectiveDateTime')) {
			this.effectiveDateTime = obj.effectiveDateTime;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('dateAsserted')) {
			this.dateAsserted = obj.dateAsserted;
		}

		if (obj.hasOwnProperty('informationSource')) {
			this.informationSource = obj.informationSource;
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = [];
			for (const o of (obj.derivedFrom instanceof Array ? obj.derivedFrom : [])) {
				this.derivedFrom.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('dosage')) {
			this.dosage = [];
			for (const o of (obj.dosage instanceof Array ? obj.dosage : [])) {
				this.dosage.push(new Dosage(o));
			}
		}

	}

  resourceType = 'MedicationStatement';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: MedicationStatementStatus1;
  statusReason?: CodeableConcept[];
  category?: CodeableConcept;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  context?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  dateAsserted?: string;
  informationSource?: Reference;
  derivedFrom?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  dosage?: Dosage[];
}

export class MedicinalProductDefinitionCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class MedicinalProductDefinitionOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('effectiveDate')) {
			this.effectiveDate = obj.effectiveDate;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = [];
			for (const o of (obj.organization instanceof Array ? obj.organization : [])) {
				this.organization.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('confidentialityIndicator')) {
			this.confidentialityIndicator = obj.confidentialityIndicator;
		}

	}

  type?: CodeableReference;
  effectiveDate?: Period;
  organization?: Reference[];
  confidentialityIndicator?: CodeableConcept;
}

export class MedicinalProductDefinitionCrossReference extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('product')) {
			this.product = obj.product;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  product: CodeableReference;
  type?: CodeableConcept;
}

export class MedicinalProductDefinitionNameCountryLanguage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('country')) {
			this.country = obj.country;
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = obj.jurisdiction;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

	}

  country: CodeableConcept;
  jurisdiction?: CodeableConcept;
  language: CodeableConcept;
}

export class MedicinalProductDefinitionNameNamePart extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('part')) {
			this.part = obj.part;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  part: string;
  type: CodeableConcept;
}

export class MedicinalProductDefinitionName extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('productName')) {
			this.productName = obj.productName;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('namePart')) {
			this.namePart = [];
			for (const o of (obj.namePart instanceof Array ? obj.namePart : [])) {
				this.namePart.push(new MedicinalProductDefinitionNameNamePart(o));
			}
		}

		if (obj.hasOwnProperty('countryLanguage')) {
			this.countryLanguage = [];
			for (const o of (obj.countryLanguage instanceof Array ? obj.countryLanguage : [])) {
				this.countryLanguage.push(new MedicinalProductDefinitionNameCountryLanguage(o));
			}
		}

	}

  productName: string;
  type?: CodeableConcept;
  namePart?: MedicinalProductDefinitionNameNamePart[];
  countryLanguage?: MedicinalProductDefinitionNameCountryLanguage[];
}

export class MedicinalProductDefinitionContact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = obj.contact;
		}

	}

  type?: CodeableConcept;
  contact: Reference;
}

export class MedicinalProductDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('domain')) {
			this.domain = obj.domain;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('combinedPharmaceuticalDoseForm')) {
			this.combinedPharmaceuticalDoseForm = obj.combinedPharmaceuticalDoseForm;
		}

		if (obj.hasOwnProperty('route')) {
			this.route = [];
			for (const o of (obj.route instanceof Array ? obj.route : [])) {
				this.route.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('indication')) {
			this.indication = obj.indication;
		}

		if (obj.hasOwnProperty('legalStatusOfSupply')) {
			this.legalStatusOfSupply = obj.legalStatusOfSupply;
		}

		if (obj.hasOwnProperty('additionalMonitoringIndicator')) {
			this.additionalMonitoringIndicator = obj.additionalMonitoringIndicator;
		}

		if (obj.hasOwnProperty('specialMeasures')) {
			this.specialMeasures = [];
			for (const o of (obj.specialMeasures instanceof Array ? obj.specialMeasures : [])) {
				this.specialMeasures.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('pediatricUseIndicator')) {
			this.pediatricUseIndicator = obj.pediatricUseIndicator;
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('marketingStatus')) {
			this.marketingStatus = [];
			for (const o of (obj.marketingStatus instanceof Array ? obj.marketingStatus : [])) {
				this.marketingStatus.push(new MarketingStatus(o));
			}
		}

		if (obj.hasOwnProperty('packagedMedicinalProduct')) {
			this.packagedMedicinalProduct = [];
			for (const o of (obj.packagedMedicinalProduct instanceof Array ? obj.packagedMedicinalProduct : [])) {
				this.packagedMedicinalProduct.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('impurity')) {
			this.impurity = [];
			for (const o of (obj.impurity instanceof Array ? obj.impurity : [])) {
				this.impurity.push(new CodeableReference(o));
			}
		}

		if (obj.hasOwnProperty('attachedDocument')) {
			this.attachedDocument = [];
			for (const o of (obj.attachedDocument instanceof Array ? obj.attachedDocument : [])) {
				this.attachedDocument.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('masterFile')) {
			this.masterFile = [];
			for (const o of (obj.masterFile instanceof Array ? obj.masterFile : [])) {
				this.masterFile.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new MedicinalProductDefinitionContact(o));
			}
		}

		if (obj.hasOwnProperty('clinicalTrial')) {
			this.clinicalTrial = [];
			for (const o of (obj.clinicalTrial instanceof Array ? obj.clinicalTrial : [])) {
				this.clinicalTrial.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new MedicinalProductDefinitionName(o));
			}
		}

		if (obj.hasOwnProperty('crossReference')) {
			this.crossReference = [];
			for (const o of (obj.crossReference instanceof Array ? obj.crossReference : [])) {
				this.crossReference.push(new MedicinalProductDefinitionCrossReference(o));
			}
		}

		if (obj.hasOwnProperty('operation')) {
			this.operation = [];
			for (const o of (obj.operation instanceof Array ? obj.operation : [])) {
				this.operation.push(new MedicinalProductDefinitionOperation(o));
			}
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new MedicinalProductDefinitionCharacteristic(o));
			}
		}

	}

  resourceType = 'MedicinalProductDefinition';
  identifier?: Identifier[];
  type?: CodeableConcept;
  domain?: CodeableConcept;
  version?: string;
  status?: CodeableConcept;
  statusDate?: string;
  description?: string;
  combinedPharmaceuticalDoseForm?: CodeableConcept;
  route?: CodeableConcept[];
  indication?: string;
  legalStatusOfSupply?: CodeableConcept;
  additionalMonitoringIndicator?: CodeableConcept;
  specialMeasures?: CodeableConcept[];
  pediatricUseIndicator?: CodeableConcept;
  classification?: CodeableConcept[];
  marketingStatus?: MarketingStatus[];
  packagedMedicinalProduct?: CodeableConcept[];
  ingredient?: CodeableConcept[];
  impurity?: CodeableReference[];
  attachedDocument?: Reference[];
  masterFile?: Reference[];
  contact?: MedicinalProductDefinitionContact[];
  clinicalTrial?: Reference[];
  code?: Coding[];
  name: MedicinalProductDefinitionName[];
  crossReference?: MedicinalProductDefinitionCrossReference[];
  operation?: MedicinalProductDefinitionOperation[];
  characteristic?: MedicinalProductDefinitionCharacteristic[];
}

export class MessageDefinitionAllowedResponse extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('message')) {
			this.message = obj.message;
		}

		if (obj.hasOwnProperty('situation')) {
			this.situation = obj.situation;
		}

	}

  message: string;
  situation?: string;
}

export class MessageDefinitionFocus extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

	}

  code: MessageDefinitionCode1;
  profile?: string;
  min: number;
  max?: string;
}

export class MessageDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('base')) {
			this.base = obj.base;
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = [];
			for (const o of (obj.parent instanceof Array ? obj.parent : [])) {
				this.parent.push(o);
			}
		}

		if (obj.hasOwnProperty('eventCoding')) {
			this.eventCoding = obj.eventCoding;
		}

		if (obj.hasOwnProperty('eventUri')) {
			this.eventUri = obj.eventUri;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = [];
			for (const o of (obj.focus instanceof Array ? obj.focus : [])) {
				this.focus.push(new MessageDefinitionFocus(o));
			}
		}

		if (obj.hasOwnProperty('responseRequired')) {
			this.responseRequired = obj.responseRequired;
		}

		if (obj.hasOwnProperty('allowedResponse')) {
			this.allowedResponse = [];
			for (const o of (obj.allowedResponse instanceof Array ? obj.allowedResponse : [])) {
				this.allowedResponse.push(new MessageDefinitionAllowedResponse(o));
			}
		}

		if (obj.hasOwnProperty('graph')) {
			this.graph = [];
			for (const o of (obj.graph instanceof Array ? obj.graph : [])) {
				this.graph.push(o);
			}
		}

	}

  resourceType = 'MessageDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  replaces?: string[];
  status: MessageDefinitionStatus1;
  experimental?: boolean;
  date: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  base?: string;
  parent?: string[];
  eventCoding?: Coding;
  eventUri?: string;
  category?: MessageDefinitionCategory1;
  focus?: MessageDefinitionFocus[];
  responseRequired?: MessageDefinitionResponseRequired1;
  allowedResponse?: MessageDefinitionAllowedResponse[];
  graph?: string[];
}

export class MessageHeaderResponse extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('details')) {
			this.details = obj.details;
		}

	}

  identifier: string;
  code: MessageHeaderCode1;
  details?: Reference;
}

export class MessageHeaderSource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('software')) {
			this.software = obj.software;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = obj.contact;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = obj.endpoint;
		}

	}

  name?: string;
  software?: string;
  version?: string;
  contact?: ContactPoint;
  endpoint: string;
}

export class MessageHeaderDestination extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = obj.target;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = obj.endpoint;
		}

		if (obj.hasOwnProperty('receiver')) {
			this.receiver = obj.receiver;
		}

	}

  name?: string;
  target?: Reference;
  endpoint: string;
  receiver?: Reference;
}

export class MessageHeader extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('eventCoding')) {
			this.eventCoding = obj.eventCoding;
		}

		if (obj.hasOwnProperty('eventUri')) {
			this.eventUri = obj.eventUri;
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = [];
			for (const o of (obj.destination instanceof Array ? obj.destination : [])) {
				this.destination.push(new MessageHeaderDestination(o));
			}
		}

		if (obj.hasOwnProperty('sender')) {
			this.sender = obj.sender;
		}

		if (obj.hasOwnProperty('enterer')) {
			this.enterer = obj.enterer;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = [];
			for (const o of (obj.focus instanceof Array ? obj.focus : [])) {
				this.focus.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

	}

  resourceType = 'MessageHeader';
  eventCoding?: Coding;
  eventUri?: string;
  destination?: MessageHeaderDestination[];
  sender?: Reference;
  enterer?: Reference;
  author?: Reference;
  source: MessageHeaderSource;
  responsible?: Reference;
  reason?: CodeableConcept;
  response?: MessageHeaderResponse;
  focus?: Reference[];
  definition?: string;
}

export class MolecularSequenceStructureVariantInner extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

	}

  start?: number;
  end?: number;
}

export class MolecularSequenceStructureVariantOuter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

	}

  start?: number;
  end?: number;
}

export class MolecularSequenceStructureVariant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('variantType')) {
			this.variantType = obj.variantType;
		}

		if (obj.hasOwnProperty('exact')) {
			this.exact = obj.exact;
		}

		if (obj.hasOwnProperty('length')) {
			this.length = obj.length;
		}

		if (obj.hasOwnProperty('outer')) {
			this.outer = obj.outer;
		}

		if (obj.hasOwnProperty('inner')) {
			this.inner = obj.inner;
		}

	}

  variantType?: CodeableConcept;
  exact?: boolean;
  length?: number;
  outer?: MolecularSequenceStructureVariantOuter;
  inner?: MolecularSequenceStructureVariantInner;
}

export class MolecularSequenceRepository extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('datasetId')) {
			this.datasetId = obj.datasetId;
		}

		if (obj.hasOwnProperty('variantsetId')) {
			this.variantsetId = obj.variantsetId;
		}

		if (obj.hasOwnProperty('readsetId')) {
			this.readsetId = obj.readsetId;
		}

	}

  type: MolecularSequenceType3;
  url?: string;
  name?: string;
  datasetId?: string;
  variantsetId?: string;
  readsetId?: string;
}

export class MolecularSequenceQualityRoc extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('score')) {
			this.score = [];
			for (const o of (obj.score instanceof Array ? obj.score : [])) {
				this.score.push(o);
			}
		}

		if (obj.hasOwnProperty('numTP')) {
			this.numTP = [];
			for (const o of (obj.score instanceof Array ? obj.numTP : [])) {
				this.numTP.push(o);
			}
		}

		if (obj.hasOwnProperty('numFP')) {
			this.numFP = [];
			for (const o of (obj.numFP instanceof Array ? obj.numFP : [])) {
				this.numFP.push(o);
			}
		}

		if (obj.hasOwnProperty('numFN')) {
			this.numFN = [];
			for (const o of (obj.numFN instanceof Array ? obj.numFN : [])) {
				this.numFN.push(o);
			}
		}

		if (obj.hasOwnProperty('precision')) {
			this.precision = [];
			for (const o of (obj.precision instanceof Array ? obj.precision : [])) {
				this.precision.push(o);
			}
		}

		if (obj.hasOwnProperty('sensitivity')) {
			this.sensitivity = [];
			for (const o of (obj.sensitivity instanceof Array ? obj.sensitivity : [])) {
				this.sensitivity.push(o);
			}
		}

		if (obj.hasOwnProperty('fMeasure')) {
			this.fMeasure = [];
			for (const o of (obj.fMeasure instanceof Array ? obj.fMeasure : [])) {
				this.fMeasure.push(o);
			}
		}

	}

  score?: number[];
  numTP?: number[];
  numFP?: number[];
  numFN?: number[];
  precision?: number[];
  sensitivity?: number[];
  fMeasure?: number[];
}

export class MolecularSequenceQuality extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('standardSequence')) {
			this.standardSequence = obj.standardSequence;
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('score')) {
			this.score = obj.score;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('truthTP')) {
			this.truthTP = obj.truthTP;
		}

		if (obj.hasOwnProperty('queryTP')) {
			this.queryTP = obj.queryTP;
		}

		if (obj.hasOwnProperty('truthFN')) {
			this.truthFN = obj.truthFN;
		}

		if (obj.hasOwnProperty('queryFP')) {
			this.queryFP = obj.queryFP;
		}

		if (obj.hasOwnProperty('gtFP')) {
			this.gtFP = obj.gtFP;
		}

		if (obj.hasOwnProperty('precision')) {
			this.precision = obj.precision;
		}

		if (obj.hasOwnProperty('recall')) {
			this.recall = obj.recall;
		}

		if (obj.hasOwnProperty('fScore')) {
			this.fScore = obj.fScore;
		}

		if (obj.hasOwnProperty('roc')) {
			this.roc = obj.roc;
		}

	}

  type: MolecularSequenceType2;
  standardSequence?: CodeableConcept;
  start?: number;
  end?: number;
  score?: Quantity;
  method?: CodeableConcept;
  truthTP?: number;
  queryTP?: number;
  truthFN?: number;
  queryFP?: number;
  gtFP?: number;
  precision?: number;
  recall?: number;
  fScore?: number;
  roc?: MolecularSequenceQualityRoc;
}

export class MolecularSequenceVariant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('observedAllele')) {
			this.observedAllele = obj.observedAllele;
		}

		if (obj.hasOwnProperty('referenceAllele')) {
			this.referenceAllele = obj.referenceAllele;
		}

		if (obj.hasOwnProperty('cigar')) {
			this.cigar = obj.cigar;
		}

		if (obj.hasOwnProperty('variantPointer')) {
			this.variantPointer = obj.variantPointer;
		}

	}

  start?: number;
  end?: number;
  observedAllele?: string;
  referenceAllele?: string;
  cigar?: string;
  variantPointer?: Reference;
}

export class MolecularSequenceReferenceSeq extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('chromosome')) {
			this.chromosome = obj.chromosome;
		}

		if (obj.hasOwnProperty('genomeBuild')) {
			this.genomeBuild = obj.genomeBuild;
		}

		if (obj.hasOwnProperty('orientation')) {
			this.orientation = obj.orientation;
		}

		if (obj.hasOwnProperty('referenceSeqId')) {
			this.referenceSeqId = obj.referenceSeqId;
		}

		if (obj.hasOwnProperty('referenceSeqPointer')) {
			this.referenceSeqPointer = obj.referenceSeqPointer;
		}

		if (obj.hasOwnProperty('referenceSeqString')) {
			this.referenceSeqString = obj.referenceSeqString;
		}

		if (obj.hasOwnProperty('strand')) {
			this.strand = obj.strand;
		}

		if (obj.hasOwnProperty('windowStart')) {
			this.windowStart = obj.windowStart;
		}

		if (obj.hasOwnProperty('windowEnd')) {
			this.windowEnd = obj.windowEnd;
		}

	}

  chromosome?: CodeableConcept;
  genomeBuild?: string;
  orientation?: MolecularSequenceOrientation1;
  referenceSeqId?: CodeableConcept;
  referenceSeqPointer?: Reference;
  referenceSeqString?: string;
  strand?: MolecularSequenceStrand1;
  windowStart?: number;
  windowEnd?: number;
}

export class MolecularSequence extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('coordinateSystem')) {
			this.coordinateSystem = obj.coordinateSystem;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('specimen')) {
			this.specimen = obj.specimen;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('referenceSeq')) {
			this.referenceSeq = obj.referenceSeq;
		}

		if (obj.hasOwnProperty('variant')) {
			this.variant = [];
			for (const o of (obj.variant instanceof Array ? obj.variant : [])) {
				this.variant.push(new MolecularSequenceVariant(o));
			}
		}

		if (obj.hasOwnProperty('observedSeq')) {
			this.observedSeq = obj.observedSeq;
		}

		if (obj.hasOwnProperty('quality')) {
			this.quality = [];
			for (const o of (obj.quality instanceof Array ? obj.quality : [])) {
				this.quality.push(new MolecularSequenceQuality(o));
			}
		}

		if (obj.hasOwnProperty('readCoverage')) {
			this.readCoverage = obj.readCoverage;
		}

		if (obj.hasOwnProperty('repository')) {
			this.repository = [];
			for (const o of (obj.repository instanceof Array ? obj.repository : [])) {
				this.repository.push(new MolecularSequenceRepository(o));
			}
		}

		if (obj.hasOwnProperty('pointer')) {
			this.pointer = [];
			for (const o of (obj.pointer instanceof Array ? obj.pointer : [])) {
				this.pointer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('structureVariant')) {
			this.structureVariant = [];
			for (const o of (obj.structureVariant instanceof Array ? obj.structureVariant : [])) {
				this.structureVariant.push(new MolecularSequenceStructureVariant(o));
			}
		}

	}

  resourceType = 'MolecularSequence';
  identifier?: Identifier[];
  type?: MolecularSequenceType1;
  coordinateSystem: number;
  patient?: Reference;
  specimen?: Reference;
  device?: Reference;
  performer?: Reference;
  quantity?: Quantity;
  referenceSeq?: MolecularSequenceReferenceSeq;
  variant?: MolecularSequenceVariant[];
  observedSeq?: string;
  quality?: MolecularSequenceQuality[];
  readCoverage?: number;
  repository?: MolecularSequenceRepository[];
  pointer?: Reference[];
  structureVariant?: MolecularSequenceStructureVariant[];
}

export class NamingSystemUniqueId extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('preferred')) {
			this.preferred = obj.preferred;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  type: NamingSystemType1;
  value: string;
  preferred?: boolean;
  comment?: string;
  period?: Period;
}

export class NamingSystem extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('uniqueId')) {
			this.uniqueId = [];
			for (const o of (obj.uniqueId instanceof Array ? obj.uniqueId : [])) {
				this.uniqueId.push(new NamingSystemUniqueId(o));
			}
		}

	}

  resourceType = 'NamingSystem';
  name: string;
  status: NamingSystemStatus1;
  kind: NamingSystemKind1;
  date: string;
  publisher?: string;
  contact?: ContactDetail[];
  responsible?: string;
  type?: CodeableConcept;
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  usage?: string;
  uniqueId: NamingSystemUniqueId[];
}

export class NutritionOrderEnteralFormulaAdministration extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = obj.schedule;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('rateQuantity')) {
			this.rateQuantity = obj.rateQuantity;
		}

		if (obj.hasOwnProperty('rateRatio')) {
			this.rateRatio = obj.rateRatio;
		}

	}

  schedule?: Timing;
  quantity?: Quantity;
  rateQuantity?: Quantity;
  rateRatio?: Ratio;
}

export class NutritionOrderEnteralFormula extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('baseFormulaType')) {
			this.baseFormulaType = obj.baseFormulaType;
		}

		if (obj.hasOwnProperty('baseFormulaProductName')) {
			this.baseFormulaProductName = obj.baseFormulaProductName;
		}

		if (obj.hasOwnProperty('additiveType')) {
			this.additiveType = obj.additiveType;
		}

		if (obj.hasOwnProperty('additiveProductName')) {
			this.additiveProductName = obj.additiveProductName;
		}

		if (obj.hasOwnProperty('caloricDensity')) {
			this.caloricDensity = obj.caloricDensity;
		}

		if (obj.hasOwnProperty('routeofAdministration')) {
			this.routeofAdministration = obj.routeofAdministration;
		}

		if (obj.hasOwnProperty('administration')) {
			this.administration = [];
			for (const o of (obj.administration instanceof Array ? obj.administration : [])) {
				this.administration.push(new NutritionOrderEnteralFormulaAdministration(o));
			}
		}

		if (obj.hasOwnProperty('maxVolumeToDeliver')) {
			this.maxVolumeToDeliver = obj.maxVolumeToDeliver;
		}

		if (obj.hasOwnProperty('administrationInstruction')) {
			this.administrationInstruction = obj.administrationInstruction;
		}

	}

  baseFormulaType?: CodeableConcept;
  baseFormulaProductName?: string;
  additiveType?: CodeableConcept;
  additiveProductName?: string;
  caloricDensity?: Quantity;
  routeofAdministration?: CodeableConcept;
  administration?: NutritionOrderEnteralFormulaAdministration[];
  maxVolumeToDeliver?: Quantity;
  administrationInstruction?: string;
}

export class NutritionOrderSupplement extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('productName')) {
			this.productName = obj.productName;
		}

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = [];
			for (const o of (obj.schedule instanceof Array ? obj.schedule : [])) {
				this.schedule.push(new Timing(o));
			}
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('instruction')) {
			this.instruction = obj.instruction;
		}

	}

  type?: CodeableConcept;
  productName?: string;
  schedule?: Timing[];
  quantity?: Quantity;
  instruction?: string;
}

export class NutritionOrderOralDietTexture extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = obj.modifier;
		}

		if (obj.hasOwnProperty('foodType')) {
			this.foodType = obj.foodType;
		}

	}

  modifier?: CodeableConcept;
  foodType?: CodeableConcept;
}

export class NutritionOrderOralDietNutrient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = obj.modifier;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  modifier?: CodeableConcept;
  amount?: Quantity;
}

export class NutritionOrderOralDiet extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = [];
			for (const o of (obj.schedule instanceof Array ? obj.schedule : [])) {
				this.schedule.push(new Timing(o));
			}
		}

		if (obj.hasOwnProperty('nutrient')) {
			this.nutrient = [];
			for (const o of (obj.nutrient instanceof Array ? obj.nutrient : [])) {
				this.nutrient.push(new NutritionOrderOralDietNutrient(o));
			}
		}

		if (obj.hasOwnProperty('texture')) {
			this.texture = [];
			for (const o of (obj.texture instanceof Array ? obj.texture : [])) {
				this.texture.push(new NutritionOrderOralDietTexture(o));
			}
		}

		if (obj.hasOwnProperty('fluidConsistencyType')) {
			this.fluidConsistencyType = [];
			for (const o of (obj.fluidConsistencyType instanceof Array ? obj.fluidConsistencyType : [])) {
				this.fluidConsistencyType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('instruction')) {
			this.instruction = obj.instruction;
		}

	}

  type?: CodeableConcept[];
  schedule?: Timing[];
  nutrient?: NutritionOrderOralDietNutrient[];
  texture?: NutritionOrderOralDietTexture[];
  fluidConsistencyType?: CodeableConcept[];
  instruction?: string;
}

export class NutritionOrder extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiates')) {
			this.instantiates = [];
			for (const o of (obj.instantiates instanceof Array ? obj.instantiates : [])) {
				this.instantiates.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('dateTime')) {
			this.dateTime = obj.dateTime;
		}

		if (obj.hasOwnProperty('orderer')) {
			this.orderer = obj.orderer;
		}

		if (obj.hasOwnProperty('allergyIntolerance')) {
			this.allergyIntolerance = [];
			for (const o of (obj.allergyIntolerance instanceof Array ? obj.allergyIntolerance : [])) {
				this.allergyIntolerance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('foodPreferenceModifier')) {
			this.foodPreferenceModifier = [];
			for (const o of (obj.foodPreferenceModifier instanceof Array ? obj.foodPreferenceModifier : [])) {
				this.foodPreferenceModifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('excludeFoodModifier')) {
			this.excludeFoodModifier = [];
			for (const o of (obj.excludeFoodModifier instanceof Array ? obj.excludeFoodModifier : [])) {
				this.excludeFoodModifier.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('oralDiet')) {
			this.oralDiet = obj.oralDiet;
		}

		if (obj.hasOwnProperty('supplement')) {
			this.supplement = [];
			for (const o of (obj.supplement instanceof Array ? obj.supplement : [])) {
				this.supplement.push(new NutritionOrderSupplement(o));
			}
		}

		if (obj.hasOwnProperty('enteralFormula')) {
			this.enteralFormula = obj.enteralFormula;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'NutritionOrder';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  instantiates?: string[];
  status: NutritionOrderStatus1;
  intent: NutritionOrderIntent1;
  patient: Reference;
  encounter?: Reference;
  dateTime: string;
  orderer?: Reference;
  allergyIntolerance?: Reference[];
  foodPreferenceModifier?: CodeableConcept[];
  excludeFoodModifier?: CodeableConcept[];
  oralDiet?: NutritionOrderOralDiet;
  supplement?: NutritionOrderSupplement[];
  enteralFormula?: NutritionOrderEnteralFormula;
  note?: Annotation[];
}

export class NutritionProductInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('lotNumber')) {
			this.lotNumber = obj.lotNumber;
		}

		if (obj.hasOwnProperty('expiry')) {
			this.expiry = obj.expiry;
		}

		if (obj.hasOwnProperty('useBy')) {
			this.useBy = obj.useBy;
		}

	}

  quantity?: Quantity;
  identifier?: Identifier[];
  lotNumber?: string;
  expiry?: string;
  useBy?: string;
}

export class NutritionProductProductCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueQuantity?: Quantity;
  valueBase64Binary?: string;
  valueAttachment?: Attachment;
  valueBoolean?: boolean;
}

export class NutritionProductIngredient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('item')) {
			this.item = obj.item;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = [];
			for (const o of (obj.amount instanceof Array ? obj.amount : [])) {
				this.amount.push(new Ratio(o));
			}
		}

	}

  item: CodeableReference;
  amount?: Ratio[];
}

export class NutritionProductNutrient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('item')) {
			this.item = obj.item;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = [];
			for (const o of (obj.amount instanceof Array ? obj.amount : [])) {
				this.amount.push(new Ratio(o));
			}
		}

	}

  item?: CodeableReference;
  amount?: Ratio[];
}

export class NutritionProduct extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('nutrient')) {
			this.nutrient = [];
			for (const o of (obj.nutrient instanceof Array ? obj.nutrient : [])) {
				this.nutrient.push(new NutritionProductNutrient(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new NutritionProductIngredient(o));
			}
		}

		if (obj.hasOwnProperty('knownAllergen')) {
			this.knownAllergen = [];
			for (const o of (obj.knownAllergen instanceof Array ? obj.knownAllergen : [])) {
				this.knownAllergen.push(new CodeableReference(o));
			}
		}

		if (obj.hasOwnProperty('productCharacteristic')) {
			this.productCharacteristic = [];
			for (const o of (obj.productCharacteristic instanceof Array ? obj.productCharacteristic : [])) {
				this.productCharacteristic.push(new NutritionProductProductCharacteristic(o));
			}
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = obj.instance;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'NutritionProduct';
  status: NutritionProductStatus1;
  category?: CodeableConcept[];
  code?: CodeableConcept;
  manufacturer?: Reference[];
  nutrient?: NutritionProductNutrient[];
  ingredient?: NutritionProductIngredient[];
  knownAllergen?: CodeableReference[];
  productCharacteristic?: NutritionProductProductCharacteristic[];
  instance?: NutritionProductInstance;
  note?: Annotation[];
}

export class ObservationComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('dataAbsentReason')) {
			this.dataAbsentReason = obj.dataAbsentReason;
		}

		if (obj.hasOwnProperty('interpretation')) {
			this.interpretation = [];
			for (const o of (obj.interpretation instanceof Array ? obj.interpretation : [])) {
				this.interpretation.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('referenceRange')) {
			this.referenceRange = [];
			for (const o of (obj.referenceRange instanceof Array ? obj.referenceRange : [])) {
				this.referenceRange.push(new ObservationReferenceRange(o));
			}
		}

	}

  code: CodeableConcept;
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  referenceRange?: ObservationReferenceRange[];
}

export class ObservationReferenceRange extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('low')) {
			this.low = obj.low;
		}

		if (obj.hasOwnProperty('high')) {
			this.high = obj.high;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('appliesTo')) {
			this.appliesTo = [];
			for (const o of (obj.appliesTo instanceof Array ? obj.appliesTo : [])) {
				this.appliesTo.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('age')) {
			this.age = obj.age;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  age?: Range;
  text?: string;
}

export class Observation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = [];
			for (const o of (obj.focus instanceof Array ? obj.focus : [])) {
				this.focus.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('effectiveDateTime')) {
			this.effectiveDateTime = obj.effectiveDateTime;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('effectiveTiming')) {
			this.effectiveTiming = obj.effectiveTiming;
		}

		if (obj.hasOwnProperty('effectiveInstant')) {
			this.effectiveInstant = obj.effectiveInstant;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('dataAbsentReason')) {
			this.dataAbsentReason = obj.dataAbsentReason;
		}

		if (obj.hasOwnProperty('interpretation')) {
			this.interpretation = [];
			for (const o of (obj.interpretation instanceof Array ? obj.interpretation : [])) {
				this.interpretation.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('specimen')) {
			this.specimen = obj.specimen;
		}

		if (obj.hasOwnProperty('device')) {
			this.device = obj.device;
		}

		if (obj.hasOwnProperty('referenceRange')) {
			this.referenceRange = [];
			for (const o of (obj.referenceRange instanceof Array ? obj.referenceRange : [])) {
				this.referenceRange.push(new ObservationReferenceRange(o));
			}
		}

		if (obj.hasOwnProperty('hasMember')) {
			this.hasMember = [];
			for (const o of (obj.hasMember instanceof Array ? obj.hasMember : [])) {
				this.hasMember.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = [];
			for (const o of (obj.derivedFrom instanceof Array ? obj.derivedFrom : [])) {
				this.derivedFrom.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('component')) {
			this.component = [];
			for (const o of (obj.component instanceof Array ? obj.component : [])) {
				this.component.push(new ObservationComponent(o));
			}
		}

	}

  resourceType = 'Observation';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: ObservationStatus1;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  focus?: Reference[];
  encounter?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  effectiveTiming?: Timing;
  effectiveInstant?: string;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueSampledData?: SampledData;
  valueTime?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  dataAbsentReason?: CodeableConcept;
  interpretation?: CodeableConcept[];
  note?: Annotation[];
  bodySite?: CodeableConcept;
  method?: CodeableConcept;
  specimen?: Reference;
  device?: Reference;
  referenceRange?: ObservationReferenceRange[];
  hasMember?: Reference[];
  derivedFrom?: Reference[];
  component?: ObservationComponent[];
}

export class ObservationDefinitionQualifiedInterval extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('range')) {
			this.range = obj.range;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('appliesTo')) {
			this.appliesTo = [];
			for (const o of (obj.appliesTo instanceof Array ? obj.appliesTo : [])) {
				this.appliesTo.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('age')) {
			this.age = obj.age;
		}

		if (obj.hasOwnProperty('gestationalAge')) {
			this.gestationalAge = obj.gestationalAge;
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

	}

  category?: ObservationDefinitionCategory1;
  range?: Range;
  context?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  gender?: ObservationDefinitionGender1;
  age?: Range;
  gestationalAge?: Range;
  condition?: string;
}

export class ObservationDefinitionQuantitativeDetails extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('customaryUnit')) {
			this.customaryUnit = obj.customaryUnit;
		}

		if (obj.hasOwnProperty('unit')) {
			this.unit = obj.unit;
		}

		if (obj.hasOwnProperty('conversionFactor')) {
			this.conversionFactor = obj.conversionFactor;
		}

		if (obj.hasOwnProperty('decimalPrecision')) {
			this.decimalPrecision = obj.decimalPrecision;
		}

	}

  customaryUnit?: CodeableConcept;
  unit?: CodeableConcept;
  conversionFactor?: number;
  decimalPrecision?: number;
}

export class ObservationDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('permittedDataType')) {
			this.permittedDataType = [];
			for (const o of (obj.permittedDataType instanceof Array ? obj.permittedDataType : [])) {
				this.permittedDataType.push(o);
			}
		}

		if (obj.hasOwnProperty('multipleResultsAllowed')) {
			this.multipleResultsAllowed = obj.multipleResultsAllowed;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('preferredReportName')) {
			this.preferredReportName = obj.preferredReportName;
		}

		if (obj.hasOwnProperty('quantitativeDetails')) {
			this.quantitativeDetails = obj.quantitativeDetails;
		}

		if (obj.hasOwnProperty('qualifiedInterval')) {
			this.qualifiedInterval = [];
			for (const o of (obj.qualifiedInterval instanceof Array ? obj.qualifiedInterval : [])) {
				this.qualifiedInterval.push(new ObservationDefinitionQualifiedInterval(o));
			}
		}

		if (obj.hasOwnProperty('validCodedValueSet')) {
			this.validCodedValueSet = obj.validCodedValueSet;
		}

		if (obj.hasOwnProperty('normalCodedValueSet')) {
			this.normalCodedValueSet = obj.normalCodedValueSet;
		}

		if (obj.hasOwnProperty('abnormalCodedValueSet')) {
			this.abnormalCodedValueSet = obj.abnormalCodedValueSet;
		}

		if (obj.hasOwnProperty('criticalCodedValueSet')) {
			this.criticalCodedValueSet = obj.criticalCodedValueSet;
		}

	}

  resourceType = 'ObservationDefinition';
  category?: CodeableConcept[];
  code: CodeableConcept;
  identifier?: Identifier[];
  permittedDataType?: ObservationDefinitionPermittedDataType1[];
  multipleResultsAllowed?: boolean;
  method?: CodeableConcept;
  preferredReportName?: string;
  quantitativeDetails?: ObservationDefinitionQuantitativeDetails;
  qualifiedInterval?: ObservationDefinitionQualifiedInterval[];
  validCodedValueSet?: Reference;
  normalCodedValueSet?: Reference;
  abnormalCodedValueSet?: Reference;
  criticalCodedValueSet?: Reference;
}

export class OperationDefinitionOverload extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('parameterName')) {
			this.parameterName = [];
			for (const o of (obj.parameterName instanceof Array ? obj.parameterName : [])) {
				this.parameterName.push(o);
			}
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  parameterName?: string[];
  comment?: string;
}

export class OperationDefinitionParameterReferencedFrom extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('sourceId')) {
			this.sourceId = obj.sourceId;
		}

	}

  source: string;
  sourceId?: string;
}

export class OperationDefinitionParameterBinding extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('strength')) {
			this.strength = obj.strength;
		}

		if (obj.hasOwnProperty('valueSet')) {
			this.valueSet = obj.valueSet;
		}

	}

  strength: OperationDefinitionStrength1;
  valueSet: string;
}

export class OperationDefinitionParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('targetProfile')) {
			this.targetProfile = [];
			for (const o of (obj.targetProfile instanceof Array ? obj.targetProfile : [])) {
				this.targetProfile.push(o);
			}
		}

		if (obj.hasOwnProperty('searchType')) {
			this.searchType = obj.searchType;
		}

		if (obj.hasOwnProperty('binding')) {
			this.binding = obj.binding;
		}

		if (obj.hasOwnProperty('referencedFrom')) {
			this.referencedFrom = [];
			for (const o of (obj.referencedFrom instanceof Array ? obj.referencedFrom : [])) {
				this.referencedFrom.push(new OperationDefinitionParameterReferencedFrom(o));
			}
		}

		if (obj.hasOwnProperty('part')) {
			this.part = [];
			for (const o of (obj.part instanceof Array ? obj.part : [])) {
				this.part.push(new OperationDefinitionParameter(o));
			}
		}

	}

  name: string;
  use: OperationDefinitionUse1;
  min: number;
  max: string;
  documentation?: string;
  type?: OperationDefinitionType1;
  targetProfile?: string[];
  searchType?: OperationDefinitionSearchType1;
  binding?: OperationDefinitionParameterBinding;
  referencedFrom?: OperationDefinitionParameterReferencedFrom[];
  part?: OperationDefinitionParameter[];
}

export class OperationDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('affectsState')) {
			this.affectsState = obj.affectsState;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

		if (obj.hasOwnProperty('base')) {
			this.base = obj.base;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = [];
			for (const o of (obj.resource instanceof Array ? obj.resource : [])) {
				this.resource.push(o);
			}
		}

		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = obj.instance;
		}

		if (obj.hasOwnProperty('inputProfile')) {
			this.inputProfile = obj.inputProfile;
		}

		if (obj.hasOwnProperty('outputProfile')) {
			this.outputProfile = obj.outputProfile;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new OperationDefinitionParameter(o));
			}
		}

		if (obj.hasOwnProperty('overload')) {
			this.overload = [];
			for (const o of (obj.overload instanceof Array ? obj.overload : [])) {
				this.overload.push(new OperationDefinitionOverload(o));
			}
		}

	}

  resourceType = 'OperationDefinition';
  url?: string;
  version?: string;
  name: string;
  title?: string;
  status: OperationDefinitionStatus1;
  kind: OperationDefinitionKind1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  affectsState?: boolean;
  code: string;
  comment?: string;
  base?: string;
  resource?: OperationDefinitionResource1[];
  system: boolean;
  type: boolean;
  instance: boolean;
  inputProfile?: string;
  outputProfile?: string;
  parameter?: OperationDefinitionParameter[];
  overload?: OperationDefinitionOverload[];
}

export class OperationOutcomeIssue implements IFhir.IOperationOutcomeIssue {
	constructor(obj?: any) {
		if (obj.hasOwnProperty('severity')) {
			this.severity = obj.severity;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('details')) {
			this.details = obj.details;
		}

		if (obj.hasOwnProperty('diagnostics')) {
			this.diagnostics = obj.diagnostics;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(o);
			}
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = [];
			for (const o of (obj.expression instanceof Array ? obj.expression : [])) {
				this.expression.push(o);
			}
		}

	}

  severity: OperationOutcomeSeverity1;
  code: OperationOutcomeCode1;
  details?: CodeableConcept;
  diagnostics?: string;
  location?: string[];
  expression?: string[];
}

export class OperationOutcome extends DomainResource implements IFhir.IOperationOutcome {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('issue')) {
			this.issue = [];
			for (const o of (obj.issue instanceof Array ? obj.issue : [])) {
				this.issue.push(new OperationOutcomeIssue(o));
			}
		}

	}

  resourceType = 'OperationOutcome';
  issue: OperationOutcomeIssue[];
}

export class OrganizationContact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

	}

  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

export class Organization extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = [];
			for (const o of (obj.alias instanceof Array ? obj.alias : [])) {
				this.alias.push(o);
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = obj.partOf;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new OrganizationContact(o));
			}
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

	}

  resourceType = 'Organization';
  identifier?: Identifier[];
  active?: boolean;
  type?: CodeableConcept[];
  name?: string;
  alias?: string[];
  telecom?: ContactPoint[];
  address?: Address[];
  partOf?: Reference;
  contact?: OrganizationContact[];
  endpoint?: Reference[];
}

export class OrganizationAffiliation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('participatingOrganization')) {
			this.participatingOrganization = obj.participatingOrganization;
		}

		if (obj.hasOwnProperty('network')) {
			this.network = [];
			for (const o of (obj.network instanceof Array ? obj.network : [])) {
				this.network.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('healthcareService')) {
			this.healthcareService = [];
			for (const o of (obj.healthcareService instanceof Array ? obj.healthcareService : [])) {
				this.healthcareService.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

	}

  resourceType = 'OrganizationAffiliation';
  identifier?: Identifier[];
  active?: boolean;
  period?: Period;
  organization?: Reference;
  participatingOrganization?: Reference;
  network?: Reference[];
  code?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: Reference[];
  healthcareService?: Reference[];
  telecom?: ContactPoint[];
  endpoint?: Reference[];
}

export class PackagedProductDefinitionPackageContainedItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('item')) {
			this.item = obj.item;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  item: CodeableReference;
  amount?: Quantity;
}

export class PackagedProductDefinitionPackageProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class PackagedProductDefinitionPackageShelfLifeStorage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('periodDuration')) {
			this.periodDuration = obj.periodDuration;
		}

		if (obj.hasOwnProperty('periodString')) {
			this.periodString = obj.periodString;
		}

		if (obj.hasOwnProperty('specialPrecautionsForStorage')) {
			this.specialPrecautionsForStorage = [];
			for (const o of (obj.specialPrecautionsForStorage instanceof Array ? obj.specialPrecautionsForStorage : [])) {
				this.specialPrecautionsForStorage.push(new CodeableConcept(o));
			}
		}

	}

  type?: CodeableConcept;
  periodDuration?: Duration;
  periodString?: string;
  specialPrecautionsForStorage?: CodeableConcept[];
}

export class PackagedProductDefinitionPackage extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('material')) {
			this.material = [];
			for (const o of (obj.material instanceof Array ? obj.material : [])) {
				this.material.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('alternateMaterial')) {
			this.alternateMaterial = [];
			for (const o of (obj.alternateMaterial instanceof Array ? obj.alternateMaterial : [])) {
				this.alternateMaterial.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('shelfLifeStorage')) {
			this.shelfLifeStorage = [];
			for (const o of (obj.shelfLifeStorage instanceof Array ? obj.shelfLifeStorage : [])) {
				this.shelfLifeStorage.push(new PackagedProductDefinitionPackageShelfLifeStorage(o));
			}
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new PackagedProductDefinitionPackageProperty(o));
			}
		}

		if (obj.hasOwnProperty('containedItem')) {
			this.containedItem = [];
			for (const o of (obj.containedItem instanceof Array ? obj.containedItem : [])) {
				this.containedItem.push(new PackagedProductDefinitionPackageContainedItem(o));
			}
		}

		if (obj.hasOwnProperty('package')) {
			this.package = [];
			for (const o of (obj.package instanceof Array ? obj.package : [])) {
				this.package.push(new PackagedProductDefinitionPackage(o));
			}
		}

	}

  identifier?: Identifier[];
  type?: CodeableConcept;
  quantity?: number;
  material?: CodeableConcept[];
  alternateMaterial?: CodeableConcept[];
  shelfLifeStorage?: PackagedProductDefinitionPackageShelfLifeStorage[];
  manufacturer?: Reference[];
  property?: PackagedProductDefinitionPackageProperty[];
  containedItem?: PackagedProductDefinitionPackageContainedItem[];
  package?: PackagedProductDefinitionPackage[];
}

export class PackagedProductDefinitionLegalStatusOfSupply extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = obj.jurisdiction;
		}

	}

  code?: CodeableConcept;
  jurisdiction?: CodeableConcept;
}

export class PackagedProductDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('packageFor')) {
			this.packageFor = [];
			for (const o of (obj.packageFor instanceof Array ? obj.packageFor : [])) {
				this.packageFor.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('containedItemQuantity')) {
			this.containedItemQuantity = [];
			for (const o of (obj.containedItemQuantity instanceof Array ? obj.containedItemQuantity : [])) {
				this.containedItemQuantity.push(new Quantity(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('legalStatusOfSupply')) {
			this.legalStatusOfSupply = [];
			for (const o of (obj.legalStatusOfSupply instanceof Array ? obj.legalStatusOfSupply : [])) {
				this.legalStatusOfSupply.push(new PackagedProductDefinitionLegalStatusOfSupply(o));
			}
		}

		if (obj.hasOwnProperty('marketingStatus')) {
			this.marketingStatus = [];
			for (const o of (obj.marketingStatus instanceof Array ? obj.marketingStatus : [])) {
				this.marketingStatus.push(new MarketingStatus(o));
			}
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('copackagedIndicator')) {
			this.copackagedIndicator = obj.copackagedIndicator;
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('package')) {
			this.package = obj.package;
		}

	}

  resourceType = 'PackagedProductDefinition';
  identifier?: Identifier[];
  name?: string;
  type?: CodeableConcept;
  packageFor?: Reference[];
  status?: CodeableConcept;
  statusDate?: string;
  containedItemQuantity?: Quantity[];
  description?: string;
  legalStatusOfSupply?: PackagedProductDefinitionLegalStatusOfSupply[];
  marketingStatus?: MarketingStatus[];
  characteristic?: CodeableConcept[];
  copackagedIndicator?: boolean;
  manufacturer?: Reference[];
  package?: PackagedProductDefinitionPackage;
}

export class ParametersParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueCanonical')) {
			this.valueCanonical = obj.valueCanonical;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueInstant')) {
			this.valueInstant = obj.valueInstant;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueMarkdown')) {
			this.valueMarkdown = obj.valueMarkdown;
		}

		if (obj.hasOwnProperty('valueOid')) {
			this.valueOid = obj.valueOid;
		}

		if (obj.hasOwnProperty('valuePositiveInt')) {
			this.valuePositiveInt = obj.valuePositiveInt;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueUnsignedInt')) {
			this.valueUnsignedInt = obj.valueUnsignedInt;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueUrl')) {
			this.valueUrl = obj.valueUrl;
		}

		if (obj.hasOwnProperty('valueUuid')) {
			this.valueUuid = obj.valueUuid;
		}

		if (obj.hasOwnProperty('valueAddress')) {
			this.valueAddress = obj.valueAddress;
		}

		if (obj.hasOwnProperty('valueAge')) {
			this.valueAge = obj.valueAge;
		}

		if (obj.hasOwnProperty('valueAnnotation')) {
			this.valueAnnotation = obj.valueAnnotation;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueContactPoint')) {
			this.valueContactPoint = obj.valueContactPoint;
		}

		if (obj.hasOwnProperty('valueCount')) {
			this.valueCount = obj.valueCount;
		}

		if (obj.hasOwnProperty('valueDistance')) {
			this.valueDistance = obj.valueDistance;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

		if (obj.hasOwnProperty('valueHumanName')) {
			this.valueHumanName = obj.valueHumanName;
		}

		if (obj.hasOwnProperty('valueIdentifier')) {
			this.valueIdentifier = obj.valueIdentifier;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueSignature')) {
			this.valueSignature = obj.valueSignature;
		}

		if (obj.hasOwnProperty('valueTiming')) {
			this.valueTiming = obj.valueTiming;
		}

		if (obj.hasOwnProperty('valueContactDetail')) {
			this.valueContactDetail = obj.valueContactDetail;
		}

		if (obj.hasOwnProperty('valueContributor')) {
			this.valueContributor = obj.valueContributor;
		}

		if (obj.hasOwnProperty('valueDataRequirement')) {
			this.valueDataRequirement = obj.valueDataRequirement;
		}

		if (obj.hasOwnProperty('valueExpression')) {
			this.valueExpression = obj.valueExpression;
		}

		if (obj.hasOwnProperty('valueParameterDefinition')) {
			this.valueParameterDefinition = obj.valueParameterDefinition;
		}

		if (obj.hasOwnProperty('valueRelatedArtifact')) {
			this.valueRelatedArtifact = obj.valueRelatedArtifact;
		}

		if (obj.hasOwnProperty('valueTriggerDefinition')) {
			this.valueTriggerDefinition = obj.valueTriggerDefinition;
		}

		if (obj.hasOwnProperty('valueUsageContext')) {
			this.valueUsageContext = obj.valueUsageContext;
		}

		if (obj.hasOwnProperty('valueDosage')) {
			this.valueDosage = obj.valueDosage;
		}

		if (obj.hasOwnProperty('valueMeta')) {
			this.valueMeta = obj.valueMeta;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('part')) {
			this.part = [];
			for (const o of (obj.part instanceof Array ? obj.part : [])) {
				this.part.push(new ParametersParameter(o));
			}
		}

	}

  name: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: number;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
  resource?: Resource;
  part?: ParametersParameter[];
}

export class Parameters extends Resource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new ParametersParameter(o));
			}
		}

	}

  resourceType = 'Parameters';
  parameter?: ParametersParameter[];
}

export class PatientLink extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('other')) {
			this.other = obj.other;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  other: Reference;
  type: PatientType1;
}

export class PatientCommunication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('preferred')) {
			this.preferred = obj.preferred;
		}

	}

  language: CodeableConcept;
  preferred?: boolean;
}

export class PatientContact extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = [];
			for (const o of (obj.relationship instanceof Array ? obj.relationship : [])) {
				this.relationship.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = obj.address;
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

	}

  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: PatientGender2;
  organization?: Reference;
  period?: Period;
}

export class Patient extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new HumanName(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('birthDate')) {
			this.birthDate = obj.birthDate;
		}

		if (obj.hasOwnProperty('deceasedBoolean')) {
			this.deceasedBoolean = obj.deceasedBoolean;
		}

		if (obj.hasOwnProperty('deceasedDateTime')) {
			this.deceasedDateTime = obj.deceasedDateTime;
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('maritalStatus')) {
			this.maritalStatus = obj.maritalStatus;
		}

		if (obj.hasOwnProperty('multipleBirthBoolean')) {
			this.multipleBirthBoolean = obj.multipleBirthBoolean;
		}

		if (obj.hasOwnProperty('multipleBirthInteger')) {
			this.multipleBirthInteger = obj.multipleBirthInteger;
		}

		if (obj.hasOwnProperty('photo')) {
			this.photo = [];
			for (const o of (obj.photo instanceof Array ? obj.photo : [])) {
				this.photo.push(new Attachment(o));
			}
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new PatientContact(o));
			}
		}

		if (obj.hasOwnProperty('communication')) {
			this.communication = [];
			for (const o of (obj.communication instanceof Array ? obj.communication : [])) {
				this.communication.push(new PatientCommunication(o));
			}
		}

		if (obj.hasOwnProperty('generalPractitioner')) {
			this.generalPractitioner = [];
			for (const o of (obj.generalPractitioner instanceof Array ? obj.generalPractitioner : [])) {
				this.generalPractitioner.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = obj.managingOrganization;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new PatientLink(o));
			}
		}

	}

  resourceType = 'Patient';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: PatientGender1;
  birthDate?: string;
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  address?: Address[];
  maritalStatus?: CodeableConcept;
  multipleBirthBoolean?: boolean;
  multipleBirthInteger?: number;
  photo?: Attachment[];
  contact?: PatientContact[];
  communication?: PatientCommunication[];
  generalPractitioner?: Reference[];
  managingOrganization?: Reference;
  link?: PatientLink[];
}

export class PaymentNotice extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('provider')) {
			this.provider = obj.provider;
		}

		if (obj.hasOwnProperty('payment')) {
			this.payment = obj.payment;
		}

		if (obj.hasOwnProperty('paymentDate')) {
			this.paymentDate = obj.paymentDate;
		}

		if (obj.hasOwnProperty('payee')) {
			this.payee = obj.payee;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = obj.recipient;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('paymentStatus')) {
			this.paymentStatus = obj.paymentStatus;
		}

	}

  resourceType = 'PaymentNotice';
  identifier?: Identifier[];
  status: PaymentNoticeStatus1;
  request?: Reference;
  response?: Reference;
  created: string;
  provider?: Reference;
  payment: Reference;
  paymentDate?: string;
  payee?: Reference;
  recipient: Reference;
  amount: Money;
  paymentStatus?: CodeableConcept;
}

export class PaymentReconciliationProcessNote extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

	}

  type?: PaymentReconciliationType1;
  text?: string;
}

export class PaymentReconciliationDetail extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('predecessor')) {
			this.predecessor = obj.predecessor;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('submitter')) {
			this.submitter = obj.submitter;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('responsible')) {
			this.responsible = obj.responsible;
		}

		if (obj.hasOwnProperty('payee')) {
			this.payee = obj.payee;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  identifier?: Identifier;
  predecessor?: Identifier;
  type: CodeableConcept;
  request?: Reference;
  submitter?: Reference;
  response?: Reference;
  date?: string;
  responsible?: Reference;
  payee?: Reference;
  amount?: Money;
}

export class PaymentReconciliation extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('paymentIssuer')) {
			this.paymentIssuer = obj.paymentIssuer;
		}

		if (obj.hasOwnProperty('request')) {
			this.request = obj.request;
		}

		if (obj.hasOwnProperty('requestor')) {
			this.requestor = obj.requestor;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('disposition')) {
			this.disposition = obj.disposition;
		}

		if (obj.hasOwnProperty('paymentDate')) {
			this.paymentDate = obj.paymentDate;
		}

		if (obj.hasOwnProperty('paymentAmount')) {
			this.paymentAmount = obj.paymentAmount;
		}

		if (obj.hasOwnProperty('paymentIdentifier')) {
			this.paymentIdentifier = obj.paymentIdentifier;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = [];
			for (const o of (obj.detail instanceof Array ? obj.detail : [])) {
				this.detail.push(new PaymentReconciliationDetail(o));
			}
		}

		if (obj.hasOwnProperty('formCode')) {
			this.formCode = obj.formCode;
		}

		if (obj.hasOwnProperty('processNote')) {
			this.processNote = [];
			for (const o of (obj.processNote instanceof Array ? obj.processNote : [])) {
				this.processNote.push(new PaymentReconciliationProcessNote(o));
			}
		}

	}

  resourceType = 'PaymentReconciliation';
  identifier?: Identifier[];
  status: PaymentReconciliationStatus1;
  period?: Period;
  created: string;
  paymentIssuer?: Reference;
  request?: Reference;
  requestor?: Reference;
  outcome?: PaymentReconciliationOutcome1;
  disposition?: string;
  paymentDate: string;
  paymentAmount: Money;
  paymentIdentifier?: Identifier;
  detail?: PaymentReconciliationDetail[];
  formCode?: CodeableConcept;
  processNote?: PaymentReconciliationProcessNote[];
}

export class PersonLink extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('target')) {
			this.target = obj.target;
		}

		if (obj.hasOwnProperty('assurance')) {
			this.assurance = obj.assurance;
		}

	}

  target: Reference;
  assurance?: PersonAssurance1;
}

export class Person extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new HumanName(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('birthDate')) {
			this.birthDate = obj.birthDate;
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('photo')) {
			this.photo = obj.photo;
		}

		if (obj.hasOwnProperty('managingOrganization')) {
			this.managingOrganization = obj.managingOrganization;
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new PersonLink(o));
			}
		}

	}

  resourceType = 'Person';
  identifier?: Identifier[];
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: PersonGender1;
  birthDate?: string;
  address?: Address[];
  photo?: Attachment;
  managingOrganization?: Reference;
  active?: boolean;
  link?: PersonLink[];
}

export class PlanDefinitionActionDynamicValue extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  path?: string;
  expression?: Expression;
}

export class PlanDefinitionActionParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

	}

  type: PlanDefinitionType1;
  role?: CodeableConcept;
}

export class PlanDefinitionActionRelatedAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('actionId')) {
			this.actionId = obj.actionId;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('offsetDuration')) {
			this.offsetDuration = obj.offsetDuration;
		}

		if (obj.hasOwnProperty('offsetRange')) {
			this.offsetRange = obj.offsetRange;
		}

	}

  actionId: string;
  relationship: PlanDefinitionRelationship1;
  offsetDuration?: Duration;
  offsetRange?: Range;
}

export class PlanDefinitionActionCondition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  kind: PlanDefinitionKind1;
  expression?: Expression;
}

export class PlanDefinitionAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('prefix')) {
			this.prefix = obj.prefix;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('textEquivalent')) {
			this.textEquivalent = obj.textEquivalent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = [];
			for (const o of (obj.reason instanceof Array ? obj.reason : [])) {
				this.reason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = [];
			for (const o of (obj.documentation instanceof Array ? obj.documentation : [])) {
				this.documentation.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('goalId')) {
			this.goalId = [];
			for (const o of (obj.goalId instanceof Array ? obj.goalId : [])) {
				this.goalId.push(o);
			}
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('subjectCanonical')) {
			this.subjectCanonical = obj.subjectCanonical;
		}

		if (obj.hasOwnProperty('trigger')) {
			this.trigger = [];
			for (const o of (obj.trigger instanceof Array ? obj.trigger : [])) {
				this.trigger.push(new TriggerDefinition(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(new PlanDefinitionActionCondition(o));
			}
		}

		if (obj.hasOwnProperty('input')) {
			this.input = [];
			for (const o of (obj.input instanceof Array ? obj.input : [])) {
				this.input.push(new DataRequirement(o));
			}
		}

		if (obj.hasOwnProperty('output')) {
			this.output = [];
			for (const o of (obj.output instanceof Array ? obj.output : [])) {
				this.output.push(new DataRequirement(o));
			}
		}

		if (obj.hasOwnProperty('relatedAction')) {
			this.relatedAction = [];
			for (const o of (obj.relatedAction instanceof Array ? obj.relatedAction : [])) {
				this.relatedAction.push(new PlanDefinitionActionRelatedAction(o));
			}
		}

		if (obj.hasOwnProperty('timingDateTime')) {
			this.timingDateTime = obj.timingDateTime;
		}

		if (obj.hasOwnProperty('timingAge')) {
			this.timingAge = obj.timingAge;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('timingDuration')) {
			this.timingDuration = obj.timingDuration;
		}

		if (obj.hasOwnProperty('timingRange')) {
			this.timingRange = obj.timingRange;
		}

		if (obj.hasOwnProperty('timingTiming')) {
			this.timingTiming = obj.timingTiming;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new PlanDefinitionActionParticipant(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('groupingBehavior')) {
			this.groupingBehavior = obj.groupingBehavior;
		}

		if (obj.hasOwnProperty('selectionBehavior')) {
			this.selectionBehavior = obj.selectionBehavior;
		}

		if (obj.hasOwnProperty('requiredBehavior')) {
			this.requiredBehavior = obj.requiredBehavior;
		}

		if (obj.hasOwnProperty('precheckBehavior')) {
			this.precheckBehavior = obj.precheckBehavior;
		}

		if (obj.hasOwnProperty('cardinalityBehavior')) {
			this.cardinalityBehavior = obj.cardinalityBehavior;
		}

		if (obj.hasOwnProperty('definitionCanonical')) {
			this.definitionCanonical = obj.definitionCanonical;
		}

		if (obj.hasOwnProperty('definitionUri')) {
			this.definitionUri = obj.definitionUri;
		}

		if (obj.hasOwnProperty('transform')) {
			this.transform = obj.transform;
		}

		if (obj.hasOwnProperty('dynamicValue')) {
			this.dynamicValue = [];
			for (const o of (obj.dynamicValue instanceof Array ? obj.dynamicValue : [])) {
				this.dynamicValue.push(new PlanDefinitionActionDynamicValue(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new PlanDefinitionAction(o));
			}
		}

	}

  prefix?: string;
  title?: string;
  description?: string;
  textEquivalent?: string;
  priority?: PlanDefinitionPriority1;
  code?: CodeableConcept[];
  reason?: CodeableConcept[];
  documentation?: RelatedArtifact[];
  goalId?: string[];
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  subjectCanonical?: string;
  trigger?: TriggerDefinition[];
  condition?: PlanDefinitionActionCondition[];
  input?: DataRequirement[];
  output?: DataRequirement[];
  relatedAction?: PlanDefinitionActionRelatedAction[];
  timingDateTime?: string;
  timingAge?: Age;
  timingPeriod?: Period;
  timingDuration?: Duration;
  timingRange?: Range;
  timingTiming?: Timing;
  participant?: PlanDefinitionActionParticipant[];
  type?: CodeableConcept;
  groupingBehavior?: PlanDefinitionGroupingBehavior1;
  selectionBehavior?: PlanDefinitionSelectionBehavior1;
  requiredBehavior?: PlanDefinitionRequiredBehavior1;
  precheckBehavior?: PlanDefinitionPrecheckBehavior1;
  cardinalityBehavior?: PlanDefinitionCardinalityBehavior1;
  definitionCanonical?: string;
  definitionUri?: string;
  transform?: string;
  dynamicValue?: PlanDefinitionActionDynamicValue[];
  action?: PlanDefinitionAction[];
}

export class PlanDefinitionGoalTarget extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('measure')) {
			this.measure = obj.measure;
		}

		if (obj.hasOwnProperty('detailQuantity')) {
			this.detailQuantity = obj.detailQuantity;
		}

		if (obj.hasOwnProperty('detailRange')) {
			this.detailRange = obj.detailRange;
		}

		if (obj.hasOwnProperty('detailCodeableConcept')) {
			this.detailCodeableConcept = obj.detailCodeableConcept;
		}

		if (obj.hasOwnProperty('due')) {
			this.due = obj.due;
		}

	}

  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: CodeableConcept;
  due?: Duration;
}

export class PlanDefinitionGoal extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('addresses')) {
			this.addresses = [];
			for (const o of (obj.addresses instanceof Array ? obj.addresses : [])) {
				this.addresses.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = [];
			for (const o of (obj.documentation instanceof Array ? obj.documentation : [])) {
				this.documentation.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new PlanDefinitionGoalTarget(o));
			}
		}

	}

  category?: CodeableConcept;
  description: CodeableConcept;
  priority?: CodeableConcept;
  start?: CodeableConcept;
  addresses?: CodeableConcept[];
  documentation?: RelatedArtifact[];
  target?: PlanDefinitionGoalTarget[];
}

export class PlanDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('subjectCanonical')) {
			this.subjectCanonical = obj.subjectCanonical;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('library')) {
			this.library = [];
			for (const o of (obj.library instanceof Array ? obj.library : [])) {
				this.library.push(o);
			}
		}

		if (obj.hasOwnProperty('goal')) {
			this.goal = [];
			for (const o of (obj.goal instanceof Array ? obj.goal : [])) {
				this.goal.push(new PlanDefinitionGoal(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new PlanDefinitionAction(o));
			}
		}

	}

  resourceType = 'PlanDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  subtitle?: string;
  type?: CodeableConcept;
  status: PlanDefinitionStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  subjectCanonical?: string;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  library?: string[];
  goal?: PlanDefinitionGoal[];
  action?: PlanDefinitionAction[];
}

export class PractitionerQualification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('issuer')) {
			this.issuer = obj.issuer;
		}

	}

  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}

export class Practitioner extends DomainResource implements IFhir.IPractitioner {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new HumanName(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('birthDate')) {
			this.birthDate = obj.birthDate;
		}

		if (obj.hasOwnProperty('photo')) {
			this.photo = [];
			for (const o of (obj.photo instanceof Array ? obj.photo : [])) {
				this.photo.push(new Attachment(o));
			}
		}

		if (obj.hasOwnProperty('qualification')) {
			this.qualification = [];
			for (const o of (obj.qualification instanceof Array ? obj.qualification : [])) {
				this.qualification.push(new PractitionerQualification(o));
			}
		}

		if (obj.hasOwnProperty('communication')) {
			this.communication = [];
			for (const o of (obj.communication instanceof Array ? obj.communication : [])) {
				this.communication.push(new CodeableConcept(o));
			}
		}

	}

  resourceType = 'Practitioner';
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  address?: Address[];
  gender?: PractitionerGender1;
  birthDate?: string;
  photo?: Attachment[];
  qualification?: PractitionerQualification[];
  communication?: CodeableConcept[];
}

export class PractitionerRoleNotAvailable extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('during')) {
			this.during = obj.during;
		}

	}

  description: string;
  during?: Period;
}

export class PractitionerRoleAvailableTime extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('daysOfWeek')) {
			this.daysOfWeek = [];
			for (const o of (obj.daysOfWeek instanceof Array ? obj.daysOfWeek : [])) {
				this.daysOfWeek.push(o);
			}
		}

		if (obj.hasOwnProperty('allDay')) {
			this.allDay = obj.allDay;
		}

		if (obj.hasOwnProperty('availableStartTime')) {
			this.availableStartTime = obj.availableStartTime;
		}

		if (obj.hasOwnProperty('availableEndTime')) {
			this.availableEndTime = obj.availableEndTime;
		}

	}

  daysOfWeek?: PractitionerRoleDaysOfWeek1[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export class PractitionerRole extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('practitioner')) {
			this.practitioner = obj.practitioner;
		}

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('healthcareService')) {
			this.healthcareService = [];
			for (const o of (obj.healthcareService instanceof Array ? obj.healthcareService : [])) {
				this.healthcareService.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('availableTime')) {
			this.availableTime = [];
			for (const o of (obj.availableTime instanceof Array ? obj.availableTime : [])) {
				this.availableTime.push(new PractitionerRoleAvailableTime(o));
			}
		}

		if (obj.hasOwnProperty('notAvailable')) {
			this.notAvailable = [];
			for (const o of (obj.notAvailable instanceof Array ? obj.notAvailable : [])) {
				this.notAvailable.push(new PractitionerRoleNotAvailable(o));
			}
		}

		if (obj.hasOwnProperty('availabilityExceptions')) {
			this.availabilityExceptions = obj.availabilityExceptions;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = [];
			for (const o of (obj.endpoint instanceof Array ? obj.endpoint : [])) {
				this.endpoint.push(new Reference(o));
			}
		}

	}

  resourceType = 'PractitionerRole';
  identifier?: Identifier[];
  active?: boolean;
  period?: Period;
  practitioner?: Reference;
  organization?: Reference;
  code?: CodeableConcept[];
  specialty?: CodeableConcept[];
  location?: Reference[];
  healthcareService?: Reference[];
  telecom?: ContactPoint[];
  availableTime?: PractitionerRoleAvailableTime[];
  notAvailable?: PractitionerRoleNotAvailable[];
  availabilityExceptions?: string;
  endpoint?: Reference[];
}

export class ProcedureFocalDevice extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = obj.action;
		}

		if (obj.hasOwnProperty('manipulated')) {
			this.manipulated = obj.manipulated;
		}

	}

  action?: CodeableConcept;
  manipulated: Reference;
}

export class ProcedurePerformer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('function')) {
			this.function = obj.function;
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = obj.actor;
		}

		if (obj.hasOwnProperty('onBehalfOf')) {
			this.onBehalfOf = obj.onBehalfOf;
		}

	}

  function?: CodeableConcept;
  actor: Reference;
  onBehalfOf?: Reference;
}

export class Procedure extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('performedDateTime')) {
			this.performedDateTime = obj.performedDateTime;
		}

		if (obj.hasOwnProperty('performedPeriod')) {
			this.performedPeriod = obj.performedPeriod;
		}

		if (obj.hasOwnProperty('performedString')) {
			this.performedString = obj.performedString;
		}

		if (obj.hasOwnProperty('performedAge')) {
			this.performedAge = obj.performedAge;
		}

		if (obj.hasOwnProperty('performedRange')) {
			this.performedRange = obj.performedRange;
		}

		if (obj.hasOwnProperty('recorder')) {
			this.recorder = obj.recorder;
		}

		if (obj.hasOwnProperty('asserter')) {
			this.asserter = obj.asserter;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new ProcedurePerformer(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = [];
			for (const o of (obj.bodySite instanceof Array ? obj.bodySite : [])) {
				this.bodySite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('report')) {
			this.report = [];
			for (const o of (obj.report instanceof Array ? obj.report : [])) {
				this.report.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('complication')) {
			this.complication = [];
			for (const o of (obj.complication instanceof Array ? obj.complication : [])) {
				this.complication.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('complicationDetail')) {
			this.complicationDetail = [];
			for (const o of (obj.complicationDetail instanceof Array ? obj.complicationDetail : [])) {
				this.complicationDetail.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('followUp')) {
			this.followUp = [];
			for (const o of (obj.followUp instanceof Array ? obj.followUp : [])) {
				this.followUp.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('focalDevice')) {
			this.focalDevice = [];
			for (const o of (obj.focalDevice instanceof Array ? obj.focalDevice : [])) {
				this.focalDevice.push(new ProcedureFocalDevice(o));
			}
		}

		if (obj.hasOwnProperty('usedReference')) {
			this.usedReference = [];
			for (const o of (obj.usedReference instanceof Array ? obj.usedReference : [])) {
				this.usedReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('usedCode')) {
			this.usedCode = [];
			for (const o of (obj.usedCode instanceof Array ? obj.usedCode : [])) {
				this.usedCode.push(new CodeableConcept(o));
			}
		}

	}

  resourceType = 'Procedure';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status: ProcedureStatus1;
  statusReason?: CodeableConcept;
  category?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  performedDateTime?: string;
  performedPeriod?: Period;
  performedString?: string;
  performedAge?: Age;
  performedRange?: Range;
  recorder?: Reference;
  asserter?: Reference;
  performer?: ProcedurePerformer[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  bodySite?: CodeableConcept[];
  outcome?: CodeableConcept;
  report?: Reference[];
  complication?: CodeableConcept[];
  complicationDetail?: Reference[];
  followUp?: CodeableConcept[];
  note?: Annotation[];
  focalDevice?: ProcedureFocalDevice[];
  usedReference?: Reference[];
  usedCode?: CodeableConcept[];
}

export class ProvenanceEntity extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('what')) {
			this.what = obj.what;
		}

		if (obj.hasOwnProperty('agent')) {
			this.agent = [];
			for (const o of (obj.agent instanceof Array ? obj.agent : [])) {
				this.agent.push(new ProvenanceAgent(o));
			}
		}

	}

  role: ProvenanceRole1;
  what: Reference;
  agent?: ProvenanceAgent[];
}

export class ProvenanceAgent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('role')) {
			this.role = [];
			for (const o of (obj.role instanceof Array ? obj.role : [])) {
				this.role.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('who')) {
			this.who = obj.who;
		}

		if (obj.hasOwnProperty('onBehalfOf')) {
			this.onBehalfOf = obj.onBehalfOf;
		}

	}

  type?: CodeableConcept;
  role?: CodeableConcept[];
  who: Reference;
  onBehalfOf?: Reference;
}

export class Provenance extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('occurredPeriod')) {
			this.occurredPeriod = obj.occurredPeriod;
		}

		if (obj.hasOwnProperty('occurredDateTime')) {
			this.occurredDateTime = obj.occurredDateTime;
		}

		if (obj.hasOwnProperty('recorded')) {
			this.recorded = obj.recorded;
		}

		if (obj.hasOwnProperty('policy')) {
			this.policy = [];
			for (const o of (obj.policy instanceof Array ? obj.policy : [])) {
				this.policy.push(o);
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = [];
			for (const o of (obj.reason instanceof Array ? obj.reason : [])) {
				this.reason.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('activity')) {
			this.activity = obj.activity;
		}

		if (obj.hasOwnProperty('agent')) {
			this.agent = [];
			for (const o of (obj.agent instanceof Array ? obj.agent : [])) {
				this.agent.push(new ProvenanceAgent(o));
			}
		}

		if (obj.hasOwnProperty('entity')) {
			this.entity = [];
			for (const o of (obj.entity instanceof Array ? obj.entity : [])) {
				this.entity.push(new ProvenanceEntity(o));
			}
		}

		if (obj.hasOwnProperty('signature')) {
			this.signature = [];
			for (const o of (obj.signature instanceof Array ? obj.signature : [])) {
				this.signature.push(new Signature(o));
			}
		}

	}

  resourceType = 'Provenance';
  target: Reference[];
  occurredPeriod?: Period;
  occurredDateTime?: string;
  recorded: string;
  policy?: string[];
  location?: Reference;
  reason?: CodeableConcept[];
  activity?: CodeableConcept;
  agent: ProvenanceAgent[];
  entity?: ProvenanceEntity[];
  signature?: Signature[];
}

export class QuestionnaireItemInitial extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

	}

  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
}

export class QuestionnaireItemAnswerOption extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('initialSelected')) {
			this.initialSelected = obj.initialSelected;
		}

	}

  valueInteger?: number;
  valueDate?: string;
  valueTime?: string;
  valueString?: string;
  valueCoding?: Coding;
  valueReference?: Reference;
  initialSelected?: boolean;
}

export class QuestionnaireItemEnableWhen extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('question')) {
			this.question = obj.question;
		}

		if (obj.hasOwnProperty('operator')) {
			this.operator = obj.operator;
		}

		if (obj.hasOwnProperty('answerBoolean')) {
			this.answerBoolean = obj.answerBoolean;
		}

		if (obj.hasOwnProperty('answerDecimal')) {
			this.answerDecimal = obj.answerDecimal;
		}

		if (obj.hasOwnProperty('answerInteger')) {
			this.answerInteger = obj.answerInteger;
		}

		if (obj.hasOwnProperty('answerDate')) {
			this.answerDate = obj.answerDate;
		}

		if (obj.hasOwnProperty('answerDateTime')) {
			this.answerDateTime = obj.answerDateTime;
		}

		if (obj.hasOwnProperty('answerTime')) {
			this.answerTime = obj.answerTime;
		}

		if (obj.hasOwnProperty('answerString')) {
			this.answerString = obj.answerString;
		}

		if (obj.hasOwnProperty('answerCoding')) {
			this.answerCoding = obj.answerCoding;
		}

		if (obj.hasOwnProperty('answerQuantity')) {
			this.answerQuantity = obj.answerQuantity;
		}

		if (obj.hasOwnProperty('answerReference')) {
			this.answerReference = obj.answerReference;
		}

	}

  question: string;
  operator: QuestionnaireOperator1;
  answerBoolean?: boolean;
  answerDecimal?: number;
  answerInteger?: number;
  answerDate?: string;
  answerDateTime?: string;
  answerTime?: string;
  answerString?: string;
  answerCoding?: Coding;
  answerQuantity?: Quantity;
  answerReference?: Reference;
}

export class QuestionnaireItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = obj.linkId;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('prefix')) {
			this.prefix = obj.prefix;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('enableWhen')) {
			this.enableWhen = [];
			for (const o of (obj.enableWhen instanceof Array ? obj.enableWhen : [])) {
				this.enableWhen.push(new QuestionnaireItemEnableWhen(o));
			}
		}

		if (obj.hasOwnProperty('enableBehavior')) {
			this.enableBehavior = obj.enableBehavior;
		}

		if (obj.hasOwnProperty('required')) {
			this.required = obj.required;
		}

		if (obj.hasOwnProperty('repeats')) {
			this.repeats = obj.repeats;
		}

		if (obj.hasOwnProperty('readOnly')) {
			this.readOnly = obj.readOnly;
		}

		if (obj.hasOwnProperty('maxLength')) {
			this.maxLength = obj.maxLength;
		}

		if (obj.hasOwnProperty('answerValueSet')) {
			this.answerValueSet = obj.answerValueSet;
		}

		if (obj.hasOwnProperty('answerOption')) {
			this.answerOption = [];
			for (const o of (obj.answerOption instanceof Array ? obj.answerOption : [])) {
				this.answerOption.push(new QuestionnaireItemAnswerOption(o));
			}
		}

		if (obj.hasOwnProperty('initial')) {
			this.initial = [];
			for (const o of (obj.initial instanceof Array ? obj.initial : [])) {
				this.initial.push(new QuestionnaireItemInitial(o));
			}
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new QuestionnaireItem(o));
			}
		}

	}

  linkId: string;
  definition?: string;
  code?: Coding[];
  prefix?: string;
  text?: string;
  type: QuestionnaireType1;
  enableWhen?: QuestionnaireItemEnableWhen[];
  enableBehavior?: QuestionnaireEnableBehavior1;
  required?: boolean;
  repeats?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  answerValueSet?: string;
  answerOption?: QuestionnaireItemAnswerOption[];
  initial?: QuestionnaireItemInitial[];
  item?: QuestionnaireItem[];
}

export class Questionnaire extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = [];
			for (const o of (obj.derivedFrom instanceof Array ? obj.derivedFrom : [])) {
				this.derivedFrom.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectType')) {
			this.subjectType = [];
			for (const o of (obj.subjectType instanceof Array ? obj.subjectType : [])) {
				this.subjectType.push(o);
			}
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new QuestionnaireItem(o));
			}
		}

	}

  resourceType = 'Questionnaire';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  derivedFrom?: string[];
  status: QuestionnaireStatus1;
  experimental?: boolean;
  subjectType?: QuestionnaireSubjectType1[];
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  code?: Coding[];
  item?: QuestionnaireItem[];
}

export class QuestionnaireResponseItemAnswer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new QuestionnaireResponseItem(o));
			}
		}

	}

  valueBoolean?: boolean;
  valueDecimal?: number;
  valueInteger?: number;
  valueDate?: string;
  valueDateTime?: string;
  valueTime?: string;
  valueString?: string;
  valueUri?: string;
  valueAttachment?: Attachment;
  valueCoding?: Coding;
  valueQuantity?: Quantity;
  valueReference?: Reference;
  item?: QuestionnaireResponseItem[];
}

export class QuestionnaireResponseItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('linkId')) {
			this.linkId = obj.linkId;
		}

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('text')) {
			this.text = obj.text;
		}

		if (obj.hasOwnProperty('answer')) {
			this.answer = [];
			for (const o of (obj.answer instanceof Array ? obj.answer : [])) {
				this.answer.push(new QuestionnaireResponseItemAnswer(o));
			}
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new QuestionnaireResponseItem(o));
			}
		}

	}

  linkId: string;
  definition?: string;
  text?: string;
  answer?: QuestionnaireResponseItemAnswer[];
  item?: QuestionnaireResponseItem[];
}

export class QuestionnaireResponse extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('questionnaire')) {
			this.questionnaire = obj.questionnaire;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('authored')) {
			this.authored = obj.authored;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = obj.source;
		}

		if (obj.hasOwnProperty('item')) {
			this.item = [];
			for (const o of (obj.item instanceof Array ? obj.item : [])) {
				this.item.push(new QuestionnaireResponseItem(o));
			}
		}

	}

  resourceType = 'QuestionnaireResponse';
  identifier?: Identifier;
  basedOn?: Reference[];
  partOf?: Reference[];
  questionnaire?: string;
  status: QuestionnaireResponseStatus1;
  subject?: Reference;
  encounter?: Reference;
  authored?: string;
  author?: Reference;
  source?: Reference;
  item?: QuestionnaireResponseItem[];
}

export class RegulatedAuthorizationCase extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('datePeriod')) {
			this.datePeriod = obj.datePeriod;
		}

		if (obj.hasOwnProperty('dateDateTime')) {
			this.dateDateTime = obj.dateDateTime;
		}

		if (obj.hasOwnProperty('application')) {
			this.application = [];
			for (const o of (obj.application instanceof Array ? obj.application : [])) {
				this.application.push(new RegulatedAuthorizationCase(o));
			}
		}

	}

  identifier?: Identifier;
  type?: CodeableConcept;
  status?: CodeableConcept;
  datePeriod?: Period;
  dateDateTime?: string;
  application?: RegulatedAuthorizationCase[];
}

export class RegulatedAuthorization extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = [];
			for (const o of (obj.subject instanceof Array ? obj.subject : [])) {
				this.subject.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('region')) {
			this.region = [];
			for (const o of (obj.region instanceof Array ? obj.region : [])) {
				this.region.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('validityPeriod')) {
			this.validityPeriod = obj.validityPeriod;
		}

		if (obj.hasOwnProperty('indication')) {
			this.indication = obj.indication;
		}

		if (obj.hasOwnProperty('intendedUse')) {
			this.intendedUse = obj.intendedUse;
		}

		if (obj.hasOwnProperty('basis')) {
			this.basis = [];
			for (const o of (obj.basis instanceof Array ? obj.basis : [])) {
				this.basis.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('holder')) {
			this.holder = obj.holder;
		}

		if (obj.hasOwnProperty('regulator')) {
			this.regulator = obj.regulator;
		}

		if (obj.hasOwnProperty('case')) {
			this.case = obj.case;
		}

	}

  resourceType = 'RegulatedAuthorization';
  identifier?: Identifier[];
  subject?: Reference[];
  type?: CodeableConcept;
  description?: string;
  region?: CodeableConcept[];
  status?: CodeableConcept;
  statusDate?: string;
  validityPeriod?: Period;
  indication?: CodeableReference;
  intendedUse?: CodeableConcept;
  basis?: CodeableConcept[];
  holder?: Reference;
  regulator?: Reference;
  case?: RegulatedAuthorizationCase;
}

export class RelatedPersonCommunication extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('preferred')) {
			this.preferred = obj.preferred;
		}

	}

  language: CodeableConcept;
  preferred?: boolean;
}

export class RelatedPerson extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = [];
			for (const o of (obj.relationship instanceof Array ? obj.relationship : [])) {
				this.relationship.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new HumanName(o));
			}
		}

		if (obj.hasOwnProperty('telecom')) {
			this.telecom = [];
			for (const o of (obj.telecom instanceof Array ? obj.telecom : [])) {
				this.telecom.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('gender')) {
			this.gender = obj.gender;
		}

		if (obj.hasOwnProperty('birthDate')) {
			this.birthDate = obj.birthDate;
		}

		if (obj.hasOwnProperty('address')) {
			this.address = [];
			for (const o of (obj.address instanceof Array ? obj.address : [])) {
				this.address.push(new Address(o));
			}
		}

		if (obj.hasOwnProperty('photo')) {
			this.photo = [];
			for (const o of (obj.photo instanceof Array ? obj.photo : [])) {
				this.photo.push(new Attachment(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('communication')) {
			this.communication = [];
			for (const o of (obj.communication instanceof Array ? obj.communication : [])) {
				this.communication.push(new RelatedPersonCommunication(o));
			}
		}

	}

  resourceType = 'RelatedPerson';
  identifier?: Identifier[];
  active?: boolean;
  patient: Reference;
  relationship?: CodeableConcept[];
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: RelatedPersonGender1;
  birthDate?: string;
  address?: Address[];
  photo?: Attachment[];
  period?: Period;
  communication?: RelatedPersonCommunication[];
}

export class RequestGroupActionRelatedAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('actionId')) {
			this.actionId = obj.actionId;
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = obj.relationship;
		}

		if (obj.hasOwnProperty('offsetDuration')) {
			this.offsetDuration = obj.offsetDuration;
		}

		if (obj.hasOwnProperty('offsetRange')) {
			this.offsetRange = obj.offsetRange;
		}

	}

  actionId: string;
  relationship: RequestGroupRelationship1;
  offsetDuration?: Duration;
  offsetRange?: Range;
}

export class RequestGroupActionCondition extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  kind: RequestGroupKind1;
  expression?: Expression;
}

export class RequestGroupAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('prefix')) {
			this.prefix = obj.prefix;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('textEquivalent')) {
			this.textEquivalent = obj.textEquivalent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = [];
			for (const o of (obj.documentation instanceof Array ? obj.documentation : [])) {
				this.documentation.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(new RequestGroupActionCondition(o));
			}
		}

		if (obj.hasOwnProperty('relatedAction')) {
			this.relatedAction = [];
			for (const o of (obj.relatedAction instanceof Array ? obj.relatedAction : [])) {
				this.relatedAction.push(new RequestGroupActionRelatedAction(o));
			}
		}

		if (obj.hasOwnProperty('timingDateTime')) {
			this.timingDateTime = obj.timingDateTime;
		}

		if (obj.hasOwnProperty('timingAge')) {
			this.timingAge = obj.timingAge;
		}

		if (obj.hasOwnProperty('timingPeriod')) {
			this.timingPeriod = obj.timingPeriod;
		}

		if (obj.hasOwnProperty('timingDuration')) {
			this.timingDuration = obj.timingDuration;
		}

		if (obj.hasOwnProperty('timingRange')) {
			this.timingRange = obj.timingRange;
		}

		if (obj.hasOwnProperty('timingTiming')) {
			this.timingTiming = obj.timingTiming;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('groupingBehavior')) {
			this.groupingBehavior = obj.groupingBehavior;
		}

		if (obj.hasOwnProperty('selectionBehavior')) {
			this.selectionBehavior = obj.selectionBehavior;
		}

		if (obj.hasOwnProperty('requiredBehavior')) {
			this.requiredBehavior = obj.requiredBehavior;
		}

		if (obj.hasOwnProperty('precheckBehavior')) {
			this.precheckBehavior = obj.precheckBehavior;
		}

		if (obj.hasOwnProperty('cardinalityBehavior')) {
			this.cardinalityBehavior = obj.cardinalityBehavior;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new RequestGroupAction(o));
			}
		}

	}

  prefix?: string;
  title?: string;
  description?: string;
  textEquivalent?: string;
  priority?: RequestGroupPriority2;
  code?: CodeableConcept[];
  documentation?: RelatedArtifact[];
  condition?: RequestGroupActionCondition[];
  relatedAction?: RequestGroupActionRelatedAction[];
  timingDateTime?: string;
  timingAge?: Age;
  timingPeriod?: Period;
  timingDuration?: Duration;
  timingRange?: Range;
  timingTiming?: Timing;
  participant?: Reference[];
  type?: CodeableConcept;
  groupingBehavior?: RequestGroupGroupingBehavior1;
  selectionBehavior?: RequestGroupSelectionBehavior1;
  requiredBehavior?: RequestGroupRequiredBehavior1;
  precheckBehavior?: RequestGroupPrecheckBehavior1;
  cardinalityBehavior?: RequestGroupCardinalityBehavior1;
  resource?: Reference;
  action?: RequestGroupAction[];
}

export class RequestGroup extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('groupIdentifier')) {
			this.groupIdentifier = obj.groupIdentifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('author')) {
			this.author = obj.author;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new RequestGroupAction(o));
			}
		}

	}

  resourceType = 'RequestGroup';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  groupIdentifier?: Identifier;
  status: RequestGroupStatus1;
  intent: RequestGroupIntent1;
  priority?: RequestGroupPriority1;
  code?: CodeableConcept;
  subject?: Reference;
  encounter?: Reference;
  authoredOn?: string;
  author?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  note?: Annotation[];
  action?: RequestGroupAction[];
}

export class ResearchDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('shortTitle')) {
			this.shortTitle = obj.shortTitle;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = [];
			for (const o of (obj.comment instanceof Array ? obj.comment : [])) {
				this.comment.push(o);
			}
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('library')) {
			this.library = [];
			for (const o of (obj.library instanceof Array ? obj.library : [])) {
				this.library.push(o);
			}
		}

		if (obj.hasOwnProperty('population')) {
			this.population = obj.population;
		}

		if (obj.hasOwnProperty('exposure')) {
			this.exposure = obj.exposure;
		}

		if (obj.hasOwnProperty('exposureAlternative')) {
			this.exposureAlternative = obj.exposureAlternative;
		}

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

	}

  resourceType = 'ResearchDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: ResearchDefinitionStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  comment?: string[];
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  library?: string[];
  population: Reference;
  exposure?: Reference;
  exposureAlternative?: Reference;
  outcome?: Reference;
}

export class ResearchElementDefinitionCharacteristic extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('definitionCodeableConcept')) {
			this.definitionCodeableConcept = obj.definitionCodeableConcept;
		}

		if (obj.hasOwnProperty('definitionCanonical')) {
			this.definitionCanonical = obj.definitionCanonical;
		}

		if (obj.hasOwnProperty('definitionExpression')) {
			this.definitionExpression = obj.definitionExpression;
		}

		if (obj.hasOwnProperty('definitionDataRequirement')) {
			this.definitionDataRequirement = obj.definitionDataRequirement;
		}

		if (obj.hasOwnProperty('usageContext')) {
			this.usageContext = [];
			for (const o of (obj.usageContext instanceof Array ? obj.usageContext : [])) {
				this.usageContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('exclude')) {
			this.exclude = obj.exclude;
		}

		if (obj.hasOwnProperty('unitOfMeasure')) {
			this.unitOfMeasure = obj.unitOfMeasure;
		}

		if (obj.hasOwnProperty('studyEffectiveDescription')) {
			this.studyEffectiveDescription = obj.studyEffectiveDescription;
		}

		if (obj.hasOwnProperty('studyEffectiveDateTime')) {
			this.studyEffectiveDateTime = obj.studyEffectiveDateTime;
		}

		if (obj.hasOwnProperty('studyEffectivePeriod')) {
			this.studyEffectivePeriod = obj.studyEffectivePeriod;
		}

		if (obj.hasOwnProperty('studyEffectiveDuration')) {
			this.studyEffectiveDuration = obj.studyEffectiveDuration;
		}

		if (obj.hasOwnProperty('studyEffectiveTiming')) {
			this.studyEffectiveTiming = obj.studyEffectiveTiming;
		}

		if (obj.hasOwnProperty('studyEffectiveTimeFromStart')) {
			this.studyEffectiveTimeFromStart = obj.studyEffectiveTimeFromStart;
		}

		if (obj.hasOwnProperty('studyEffectiveGroupMeasure')) {
			this.studyEffectiveGroupMeasure = obj.studyEffectiveGroupMeasure;
		}

		if (obj.hasOwnProperty('participantEffectiveDescription')) {
			this.participantEffectiveDescription = obj.participantEffectiveDescription;
		}

		if (obj.hasOwnProperty('participantEffectiveDateTime')) {
			this.participantEffectiveDateTime = obj.participantEffectiveDateTime;
		}

		if (obj.hasOwnProperty('participantEffectivePeriod')) {
			this.participantEffectivePeriod = obj.participantEffectivePeriod;
		}

		if (obj.hasOwnProperty('participantEffectiveDuration')) {
			this.participantEffectiveDuration = obj.participantEffectiveDuration;
		}

		if (obj.hasOwnProperty('participantEffectiveTiming')) {
			this.participantEffectiveTiming = obj.participantEffectiveTiming;
		}

		if (obj.hasOwnProperty('participantEffectiveTimeFromStart')) {
			this.participantEffectiveTimeFromStart = obj.participantEffectiveTimeFromStart;
		}

		if (obj.hasOwnProperty('participantEffectiveGroupMeasure')) {
			this.participantEffectiveGroupMeasure = obj.participantEffectiveGroupMeasure;
		}

	}

  definitionCodeableConcept?: CodeableConcept;
  definitionCanonical?: string;
  definitionExpression?: Expression;
  definitionDataRequirement?: DataRequirement;
  usageContext?: UsageContext[];
  exclude?: boolean;
  unitOfMeasure?: CodeableConcept;
  studyEffectiveDescription?: string;
  studyEffectiveDateTime?: string;
  studyEffectivePeriod?: Period;
  studyEffectiveDuration?: Duration;
  studyEffectiveTiming?: Timing;
  studyEffectiveTimeFromStart?: Duration;
  studyEffectiveGroupMeasure?: ResearchElementDefinitionStudyEffectiveGroupMeasure1;
  participantEffectiveDescription?: string;
  participantEffectiveDateTime?: string;
  participantEffectivePeriod?: Period;
  participantEffectiveDuration?: Duration;
  participantEffectiveTiming?: Timing;
  participantEffectiveTimeFromStart?: Duration;
  participantEffectiveGroupMeasure?: ResearchElementDefinitionParticipantEffectiveGroupMeasure1;
}

export class ResearchElementDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('shortTitle')) {
			this.shortTitle = obj.shortTitle;
		}

		if (obj.hasOwnProperty('subtitle')) {
			this.subtitle = obj.subtitle;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('subjectCodeableConcept')) {
			this.subjectCodeableConcept = obj.subjectCodeableConcept;
		}

		if (obj.hasOwnProperty('subjectReference')) {
			this.subjectReference = obj.subjectReference;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = [];
			for (const o of (obj.comment instanceof Array ? obj.comment : [])) {
				this.comment.push(o);
			}
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('usage')) {
			this.usage = obj.usage;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = [];
			for (const o of (obj.topic instanceof Array ? obj.topic : [])) {
				this.topic.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('author')) {
			this.author = [];
			for (const o of (obj.author instanceof Array ? obj.author : [])) {
				this.author.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('editor')) {
			this.editor = [];
			for (const o of (obj.editor instanceof Array ? obj.editor : [])) {
				this.editor.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('reviewer')) {
			this.reviewer = [];
			for (const o of (obj.reviewer instanceof Array ? obj.reviewer : [])) {
				this.reviewer.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('endorser')) {
			this.endorser = [];
			for (const o of (obj.endorser instanceof Array ? obj.endorser : [])) {
				this.endorser.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('library')) {
			this.library = [];
			for (const o of (obj.library instanceof Array ? obj.library : [])) {
				this.library.push(o);
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('variableType')) {
			this.variableType = obj.variableType;
		}

		if (obj.hasOwnProperty('characteristic')) {
			this.characteristic = [];
			for (const o of (obj.characteristic instanceof Array ? obj.characteristic : [])) {
				this.characteristic.push(new ResearchElementDefinitionCharacteristic(o));
			}
		}

	}

  resourceType = 'ResearchElementDefinition';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  shortTitle?: string;
  subtitle?: string;
  status: ResearchElementDefinitionStatus1;
  experimental?: boolean;
  subjectCodeableConcept?: CodeableConcept;
  subjectReference?: Reference;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  comment?: string[];
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  usage?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  topic?: CodeableConcept[];
  author?: ContactDetail[];
  editor?: ContactDetail[];
  reviewer?: ContactDetail[];
  endorser?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  library?: string[];
  type: ResearchElementDefinitionType1;
  variableType?: ResearchElementDefinitionVariableType1;
  characteristic: ResearchElementDefinitionCharacteristic[];
}

export class ResearchStudyObjective extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

	}

  name?: string;
  type?: CodeableConcept;
}

export class ResearchStudyArm extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  name: string;
  type?: CodeableConcept;
  description?: string;
}

export class ResearchStudy extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('protocol')) {
			this.protocol = [];
			for (const o of (obj.protocol instanceof Array ? obj.protocol : [])) {
				this.protocol.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('primaryPurposeType')) {
			this.primaryPurposeType = obj.primaryPurposeType;
		}

		if (obj.hasOwnProperty('phase')) {
			this.phase = obj.phase;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = [];
			for (const o of (obj.focus instanceof Array ? obj.focus : [])) {
				this.focus.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('relatedArtifact')) {
			this.relatedArtifact = [];
			for (const o of (obj.relatedArtifact instanceof Array ? obj.relatedArtifact : [])) {
				this.relatedArtifact.push(new RelatedArtifact(o));
			}
		}

		if (obj.hasOwnProperty('keyword')) {
			this.keyword = [];
			for (const o of (obj.keyword instanceof Array ? obj.keyword : [])) {
				this.keyword.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('location')) {
			this.location = [];
			for (const o of (obj.location instanceof Array ? obj.location : [])) {
				this.location.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('enrollment')) {
			this.enrollment = [];
			for (const o of (obj.enrollment instanceof Array ? obj.enrollment : [])) {
				this.enrollment.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('sponsor')) {
			this.sponsor = obj.sponsor;
		}

		if (obj.hasOwnProperty('principalInvestigator')) {
			this.principalInvestigator = obj.principalInvestigator;
		}

		if (obj.hasOwnProperty('site')) {
			this.site = [];
			for (const o of (obj.site instanceof Array ? obj.site : [])) {
				this.site.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('reasonStopped')) {
			this.reasonStopped = obj.reasonStopped;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('arm')) {
			this.arm = [];
			for (const o of (obj.arm instanceof Array ? obj.arm : [])) {
				this.arm.push(new ResearchStudyArm(o));
			}
		}

		if (obj.hasOwnProperty('objective')) {
			this.objective = [];
			for (const o of (obj.objective instanceof Array ? obj.objective : [])) {
				this.objective.push(new ResearchStudyObjective(o));
			}
		}

	}

  resourceType = 'ResearchStudy';
  identifier?: Identifier[];
  title?: string;
  protocol?: Reference[];
  partOf?: Reference[];
  status: ResearchStudyStatus1;
  primaryPurposeType?: CodeableConcept;
  phase?: CodeableConcept;
  category?: CodeableConcept[];
  focus?: CodeableConcept[];
  condition?: CodeableConcept[];
  contact?: ContactDetail[];
  relatedArtifact?: RelatedArtifact[];
  keyword?: CodeableConcept[];
  location?: CodeableConcept[];
  description?: string;
  enrollment?: Reference[];
  period?: Period;
  sponsor?: Reference;
  principalInvestigator?: Reference;
  site?: Reference[];
  reasonStopped?: CodeableConcept;
  note?: Annotation[];
  arm?: ResearchStudyArm[];
  objective?: ResearchStudyObjective[];
}

export class ResearchSubject extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('study')) {
			this.study = obj.study;
		}

		if (obj.hasOwnProperty('individual')) {
			this.individual = obj.individual;
		}

		if (obj.hasOwnProperty('assignedArm')) {
			this.assignedArm = obj.assignedArm;
		}

		if (obj.hasOwnProperty('actualArm')) {
			this.actualArm = obj.actualArm;
		}

		if (obj.hasOwnProperty('consent')) {
			this.consent = obj.consent;
		}

	}

  resourceType = 'ResearchSubject';
  identifier?: Identifier[];
  status: ResearchSubjectStatus1;
  period?: Period;
  study: Reference;
  individual: Reference;
  assignedArm?: string;
  actualArm?: string;
  consent?: Reference;
}

export class RiskAssessmentPrediction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('outcome')) {
			this.outcome = obj.outcome;
		}

		if (obj.hasOwnProperty('probabilityDecimal')) {
			this.probabilityDecimal = obj.probabilityDecimal;
		}

		if (obj.hasOwnProperty('probabilityRange')) {
			this.probabilityRange = obj.probabilityRange;
		}

		if (obj.hasOwnProperty('qualitativeRisk')) {
			this.qualitativeRisk = obj.qualitativeRisk;
		}

		if (obj.hasOwnProperty('relativeRisk')) {
			this.relativeRisk = obj.relativeRisk;
		}

		if (obj.hasOwnProperty('whenPeriod')) {
			this.whenPeriod = obj.whenPeriod;
		}

		if (obj.hasOwnProperty('whenRange')) {
			this.whenRange = obj.whenRange;
		}

		if (obj.hasOwnProperty('rationale')) {
			this.rationale = obj.rationale;
		}

	}

  outcome?: CodeableConcept;
  probabilityDecimal?: number;
  probabilityRange?: Range;
  qualitativeRisk?: CodeableConcept;
  relativeRisk?: number;
  whenPeriod?: Period;
  whenRange?: Range;
  rationale?: string;
}

export class RiskAssessment extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = obj.basedOn;
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = obj.parent;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = obj.performer;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('basis')) {
			this.basis = [];
			for (const o of (obj.basis instanceof Array ? obj.basis : [])) {
				this.basis.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('prediction')) {
			this.prediction = [];
			for (const o of (obj.prediction instanceof Array ? obj.prediction : [])) {
				this.prediction.push(new RiskAssessmentPrediction(o));
			}
		}

		if (obj.hasOwnProperty('mitigation')) {
			this.mitigation = obj.mitigation;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'RiskAssessment';
  identifier?: Identifier[];
  basedOn?: Reference;
  parent?: Reference;
  status: RiskAssessmentStatus1;
  method?: CodeableConcept;
  code?: CodeableConcept;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  condition?: Reference;
  performer?: Reference;
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  basis?: Reference[];
  prediction?: RiskAssessmentPrediction[];
  mitigation?: string;
  note?: Annotation[];
}

export class Schedule extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('active')) {
			this.active = obj.active;
		}

		if (obj.hasOwnProperty('serviceCategory')) {
			this.serviceCategory = [];
			for (const o of (obj.serviceCategory instanceof Array ? obj.serviceCategory : [])) {
				this.serviceCategory.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('serviceType')) {
			this.serviceType = [];
			for (const o of (obj.serviceType instanceof Array ? obj.serviceType : [])) {
				this.serviceType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('actor')) {
			this.actor = [];
			for (const o of (obj.actor instanceof Array ? obj.actor : [])) {
				this.actor.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('planningHorizon')) {
			this.planningHorizon = obj.planningHorizon;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  resourceType = 'Schedule';
  identifier?: Identifier[];
  active?: boolean;
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  actor: Reference[];
  planningHorizon?: Period;
  comment?: string;
}

export class SearchParameterComponent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('definition')) {
			this.definition = obj.definition;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  definition: string;
  expression: string;
}

export class SearchParameter extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = obj.derivedFrom;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('base')) {
			this.base = [];
			for (const o of (obj.base instanceof Array ? obj.base : [])) {
				this.base.push(o);
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('xpath')) {
			this.xpath = obj.xpath;
		}

		if (obj.hasOwnProperty('xpathUsage')) {
			this.xpathUsage = obj.xpathUsage;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(o);
			}
		}

		if (obj.hasOwnProperty('multipleOr')) {
			this.multipleOr = obj.multipleOr;
		}

		if (obj.hasOwnProperty('multipleAnd')) {
			this.multipleAnd = obj.multipleAnd;
		}

		if (obj.hasOwnProperty('comparator')) {
			this.comparator = [];
			for (const o of (obj.comparator instanceof Array ? obj.comparator : [])) {
				this.comparator.push(o);
			}
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(o);
			}
		}

		if (obj.hasOwnProperty('chain')) {
			this.chain = [];
			for (const o of (obj.chain instanceof Array ? obj.chain : [])) {
				this.chain.push(o);
			}
		}

		if (obj.hasOwnProperty('component')) {
			this.component = [];
			for (const o of (obj.component instanceof Array ? obj.component : [])) {
				this.component.push(new SearchParameterComponent(o));
			}
		}

	}

  resourceType = 'SearchParameter';
  url: string;
  version?: string;
  name: string;
  derivedFrom?: string;
  status: SearchParameterStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  code: string;
  base: SearchParameterBase1[];
  type: SearchParameterType1;
  expression?: string;
  xpath?: string;
  xpathUsage?: SearchParameterXpathUsage1;
  target?: SearchParameterTarget1[];
  multipleOr?: boolean;
  multipleAnd?: boolean;
  comparator?: SearchParameterComparator1[];
  modifier?: SearchParameterModifier1[];
  chain?: string[];
  component?: SearchParameterComponent[];
}

export class ServiceRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = [];
			for (const o of (obj.instantiatesCanonical instanceof Array ? obj.instantiatesCanonical : [])) {
				this.instantiatesCanonical.push(o);
			}
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = [];
			for (const o of (obj.instantiatesUri instanceof Array ? obj.instantiatesUri : [])) {
				this.instantiatesUri.push(o);
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('replaces')) {
			this.replaces = [];
			for (const o of (obj.replaces instanceof Array ? obj.replaces : [])) {
				this.replaces.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('requisition')) {
			this.requisition = obj.requisition;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('doNotPerform')) {
			this.doNotPerform = obj.doNotPerform;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('orderDetail')) {
			this.orderDetail = [];
			for (const o of (obj.orderDetail instanceof Array ? obj.orderDetail : [])) {
				this.orderDetail.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('quantityQuantity')) {
			this.quantityQuantity = obj.quantityQuantity;
		}

		if (obj.hasOwnProperty('quantityRatio')) {
			this.quantityRatio = obj.quantityRatio;
		}

		if (obj.hasOwnProperty('quantityRange')) {
			this.quantityRange = obj.quantityRange;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('asNeededBoolean')) {
			this.asNeededBoolean = obj.asNeededBoolean;
		}

		if (obj.hasOwnProperty('asNeededCodeableConcept')) {
			this.asNeededCodeableConcept = obj.asNeededCodeableConcept;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('performerType')) {
			this.performerType = obj.performerType;
		}

		if (obj.hasOwnProperty('performer')) {
			this.performer = [];
			for (const o of (obj.performer instanceof Array ? obj.performer : [])) {
				this.performer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('locationCode')) {
			this.locationCode = [];
			for (const o of (obj.locationCode instanceof Array ? obj.locationCode : [])) {
				this.locationCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('locationReference')) {
			this.locationReference = [];
			for (const o of (obj.locationReference instanceof Array ? obj.locationReference : [])) {
				this.locationReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supportingInfo')) {
			this.supportingInfo = [];
			for (const o of (obj.supportingInfo instanceof Array ? obj.supportingInfo : [])) {
				this.supportingInfo.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('specimen')) {
			this.specimen = [];
			for (const o of (obj.specimen instanceof Array ? obj.specimen : [])) {
				this.specimen.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = [];
			for (const o of (obj.bodySite instanceof Array ? obj.bodySite : [])) {
				this.bodySite.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('patientInstruction')) {
			this.patientInstruction = obj.patientInstruction;
		}

		if (obj.hasOwnProperty('relevantHistory')) {
			this.relevantHistory = [];
			for (const o of (obj.relevantHistory instanceof Array ? obj.relevantHistory : [])) {
				this.relevantHistory.push(new Reference(o));
			}
		}

	}

  resourceType = 'ServiceRequest';
  identifier?: Identifier[];
  instantiatesCanonical?: string[];
  instantiatesUri?: string[];
  basedOn?: Reference[];
  replaces?: Reference[];
  requisition?: Identifier;
  status: ServiceRequestStatus1;
  intent: ServiceRequestIntent1;
  category?: CodeableConcept[];
  priority?: ServiceRequestPriority1;
  doNotPerform?: boolean;
  code?: CodeableConcept;
  orderDetail?: CodeableConcept[];
  quantityQuantity?: Quantity;
  quantityRatio?: Ratio;
  quantityRange?: Range;
  subject: Reference;
  encounter?: Reference;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  asNeededBoolean?: boolean;
  asNeededCodeableConcept?: CodeableConcept;
  authoredOn?: string;
  requester?: Reference;
  performerType?: CodeableConcept;
  performer?: Reference[];
  locationCode?: CodeableConcept[];
  locationReference?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  insurance?: Reference[];
  supportingInfo?: Reference[];
  specimen?: Reference[];
  bodySite?: CodeableConcept[];
  note?: Annotation[];
  patientInstruction?: string;
  relevantHistory?: Reference[];
}

export class Slot extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('serviceCategory')) {
			this.serviceCategory = [];
			for (const o of (obj.serviceCategory instanceof Array ? obj.serviceCategory : [])) {
				this.serviceCategory.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('serviceType')) {
			this.serviceType = [];
			for (const o of (obj.serviceType instanceof Array ? obj.serviceType : [])) {
				this.serviceType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('specialty')) {
			this.specialty = [];
			for (const o of (obj.specialty instanceof Array ? obj.specialty : [])) {
				this.specialty.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('appointmentType')) {
			this.appointmentType = obj.appointmentType;
		}

		if (obj.hasOwnProperty('schedule')) {
			this.schedule = obj.schedule;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('start')) {
			this.start = obj.start;
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('overbooked')) {
			this.overbooked = obj.overbooked;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  resourceType = 'Slot';
  identifier?: Identifier[];
  serviceCategory?: CodeableConcept[];
  serviceType?: CodeableConcept[];
  specialty?: CodeableConcept[];
  appointmentType?: CodeableConcept;
  schedule: Reference;
  status: SlotStatus1;
  start: string;
  end: string;
  overbooked?: boolean;
  comment?: string;
}

export class SpecimenContainer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('capacity')) {
			this.capacity = obj.capacity;
		}

		if (obj.hasOwnProperty('specimenQuantity')) {
			this.specimenQuantity = obj.specimenQuantity;
		}

		if (obj.hasOwnProperty('additiveCodeableConcept')) {
			this.additiveCodeableConcept = obj.additiveCodeableConcept;
		}

		if (obj.hasOwnProperty('additiveReference')) {
			this.additiveReference = obj.additiveReference;
		}

	}

  identifier?: Identifier[];
  description?: string;
  type?: CodeableConcept;
  capacity?: Quantity;
  specimenQuantity?: Quantity;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}

export class SpecimenProcessing extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('procedure')) {
			this.procedure = obj.procedure;
		}

		if (obj.hasOwnProperty('additive')) {
			this.additive = [];
			for (const o of (obj.additive instanceof Array ? obj.additive : [])) {
				this.additive.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('timeDateTime')) {
			this.timeDateTime = obj.timeDateTime;
		}

		if (obj.hasOwnProperty('timePeriod')) {
			this.timePeriod = obj.timePeriod;
		}

	}

  description?: string;
  procedure?: CodeableConcept;
  additive?: Reference[];
  timeDateTime?: string;
  timePeriod?: Period;
}

export class SpecimenCollection extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('collector')) {
			this.collector = obj.collector;
		}

		if (obj.hasOwnProperty('collectedDateTime')) {
			this.collectedDateTime = obj.collectedDateTime;
		}

		if (obj.hasOwnProperty('collectedPeriod')) {
			this.collectedPeriod = obj.collectedPeriod;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('bodySite')) {
			this.bodySite = obj.bodySite;
		}

		if (obj.hasOwnProperty('fastingStatusCodeableConcept')) {
			this.fastingStatusCodeableConcept = obj.fastingStatusCodeableConcept;
		}

		if (obj.hasOwnProperty('fastingStatusDuration')) {
			this.fastingStatusDuration = obj.fastingStatusDuration;
		}

	}

  collector?: Reference;
  collectedDateTime?: string;
  collectedPeriod?: Period;
  duration?: Duration;
  quantity?: Quantity;
  method?: CodeableConcept;
  bodySite?: CodeableConcept;
  fastingStatusCodeableConcept?: CodeableConcept;
  fastingStatusDuration?: Duration;
}

export class Specimen extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('accessionIdentifier')) {
			this.accessionIdentifier = obj.accessionIdentifier;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('subject')) {
			this.subject = obj.subject;
		}

		if (obj.hasOwnProperty('receivedTime')) {
			this.receivedTime = obj.receivedTime;
		}

		if (obj.hasOwnProperty('parent')) {
			this.parent = [];
			for (const o of (obj.parent instanceof Array ? obj.parent : [])) {
				this.parent.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('request')) {
			this.request = [];
			for (const o of (obj.request instanceof Array ? obj.request : [])) {
				this.request.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('collection')) {
			this.collection = obj.collection;
		}

		if (obj.hasOwnProperty('processing')) {
			this.processing = [];
			for (const o of (obj.processing instanceof Array ? obj.processing : [])) {
				this.processing.push(new SpecimenProcessing(o));
			}
		}

		if (obj.hasOwnProperty('container')) {
			this.container = [];
			for (const o of (obj.container instanceof Array ? obj.container : [])) {
				this.container.push(new SpecimenContainer(o));
			}
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = [];
			for (const o of (obj.condition instanceof Array ? obj.condition : [])) {
				this.condition.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  resourceType = 'Specimen';
  identifier?: Identifier[];
  accessionIdentifier?: Identifier;
  status?: SpecimenStatus1;
  type?: CodeableConcept;
  subject?: Reference;
  receivedTime?: string;
  parent?: Reference[];
  request?: Reference[];
  collection?: SpecimenCollection;
  processing?: SpecimenProcessing[];
  container?: SpecimenContainer[];
  condition?: CodeableConcept[];
  note?: Annotation[];
}

export class SpecimenDefinitionTypeTestedHandling extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('temperatureQualifier')) {
			this.temperatureQualifier = obj.temperatureQualifier;
		}

		if (obj.hasOwnProperty('temperatureRange')) {
			this.temperatureRange = obj.temperatureRange;
		}

		if (obj.hasOwnProperty('maxDuration')) {
			this.maxDuration = obj.maxDuration;
		}

		if (obj.hasOwnProperty('instruction')) {
			this.instruction = obj.instruction;
		}

	}

  temperatureQualifier?: CodeableConcept;
  temperatureRange?: Range;
  maxDuration?: Duration;
  instruction?: string;
}

export class SpecimenDefinitionTypeTestedContainerAdditive extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('additiveCodeableConcept')) {
			this.additiveCodeableConcept = obj.additiveCodeableConcept;
		}

		if (obj.hasOwnProperty('additiveReference')) {
			this.additiveReference = obj.additiveReference;
		}

	}

  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}

export class SpecimenDefinitionTypeTestedContainer extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('material')) {
			this.material = obj.material;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('cap')) {
			this.cap = obj.cap;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('capacity')) {
			this.capacity = obj.capacity;
		}

		if (obj.hasOwnProperty('minimumVolumeQuantity')) {
			this.minimumVolumeQuantity = obj.minimumVolumeQuantity;
		}

		if (obj.hasOwnProperty('minimumVolumeString')) {
			this.minimumVolumeString = obj.minimumVolumeString;
		}

		if (obj.hasOwnProperty('additive')) {
			this.additive = [];
			for (const o of (obj.additive instanceof Array ? obj.additive : [])) {
				this.additive.push(new SpecimenDefinitionTypeTestedContainerAdditive(o));
			}
		}

		if (obj.hasOwnProperty('preparation')) {
			this.preparation = obj.preparation;
		}

	}

  material?: CodeableConcept;
  type?: CodeableConcept;
  cap?: CodeableConcept;
  description?: string;
  capacity?: Quantity;
  minimumVolumeQuantity?: Quantity;
  minimumVolumeString?: string;
  additive?: SpecimenDefinitionTypeTestedContainerAdditive[];
  preparation?: string;
}

export class SpecimenDefinitionTypeTested extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('isDerived')) {
			this.isDerived = obj.isDerived;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('preference')) {
			this.preference = obj.preference;
		}

		if (obj.hasOwnProperty('container')) {
			this.container = obj.container;
		}

		if (obj.hasOwnProperty('requirement')) {
			this.requirement = obj.requirement;
		}

		if (obj.hasOwnProperty('retentionTime')) {
			this.retentionTime = obj.retentionTime;
		}

		if (obj.hasOwnProperty('rejectionCriterion')) {
			this.rejectionCriterion = [];
			for (const o of (obj.rejectionCriterion instanceof Array ? obj.rejectionCriterion : [])) {
				this.rejectionCriterion.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('handling')) {
			this.handling = [];
			for (const o of (obj.handling instanceof Array ? obj.handling : [])) {
				this.handling.push(new SpecimenDefinitionTypeTestedHandling(o));
			}
		}

	}

  isDerived?: boolean;
  type?: CodeableConcept;
  preference: SpecimenDefinitionPreference1;
  container?: SpecimenDefinitionTypeTestedContainer;
  requirement?: string;
  retentionTime?: Duration;
  rejectionCriterion?: CodeableConcept[];
  handling?: SpecimenDefinitionTypeTestedHandling[];
}

export class SpecimenDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('typeCollected')) {
			this.typeCollected = obj.typeCollected;
		}

		if (obj.hasOwnProperty('patientPreparation')) {
			this.patientPreparation = [];
			for (const o of (obj.patientPreparation instanceof Array ? obj.patientPreparation : [])) {
				this.patientPreparation.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('timeAspect')) {
			this.timeAspect = obj.timeAspect;
		}

		if (obj.hasOwnProperty('collection')) {
			this.collection = [];
			for (const o of (obj.collection instanceof Array ? obj.collection : [])) {
				this.collection.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('typeTested')) {
			this.typeTested = [];
			for (const o of (obj.typeTested instanceof Array ? obj.typeTested : [])) {
				this.typeTested.push(new SpecimenDefinitionTypeTested(o));
			}
		}

	}

  resourceType = 'SpecimenDefinition';
  identifier?: Identifier;
  typeCollected?: CodeableConcept;
  patientPreparation?: CodeableConcept[];
  timeAspect?: string;
  collection?: CodeableConcept[];
  typeTested?: SpecimenDefinitionTypeTested[];
}

export class StructureDefinitionDifferential extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('element')) {
			this.element = [];
			for (const o of (obj.element instanceof Array ? obj.element : [])) {
				this.element.push(new ElementDefinition(o));
			}
		}

	}

  element: ElementDefinition[];
}

export class StructureDefinitionSnapshot extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('element')) {
			this.element = [];
			for (const o of (obj.element instanceof Array ? obj.element : [])) {
				this.element.push(new ElementDefinition(o));
			}
		}

	}

  element: ElementDefinition[];
}

export class StructureDefinitionContext extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

	}

  type: StructureDefinitionType1;
  expression: string;
}

export class StructureDefinitionMapping extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identity')) {
			this.identity = obj.identity;
		}

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('comment')) {
			this.comment = obj.comment;
		}

	}

  identity: string;
  uri?: string;
  name?: string;
  comment?: string;
}

export class StructureDefinition extends DomainResource implements IFhir.IStructureDefinition {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('keyword')) {
			this.keyword = [];
			for (const o of (obj.keyword instanceof Array ? obj.keyword : [])) {
				this.keyword.push(new Coding(o));
			}
		}

		if (obj.hasOwnProperty('fhirVersion')) {
			this.fhirVersion = obj.fhirVersion;
		}

		if (obj.hasOwnProperty('mapping')) {
			this.mapping = [];
			for (const o of (obj.mapping instanceof Array ? obj.mapping : [])) {
				this.mapping.push(new StructureDefinitionMapping(o));
			}
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('abstract')) {
			this.abstract = obj.abstract;
		}

		if (obj.hasOwnProperty('context')) {
			this.context = [];
			for (const o of (obj.context instanceof Array ? obj.context : [])) {
				this.context.push(new StructureDefinitionContext(o));
			}
		}

		if (obj.hasOwnProperty('contextInvariant')) {
			this.contextInvariant = [];
			for (const o of (obj.contextInvariant instanceof Array ? obj.contextInvariant : [])) {
				this.contextInvariant.push(o);
			}
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('baseDefinition')) {
			this.baseDefinition = obj.baseDefinition;
		}

		if (obj.hasOwnProperty('derivation')) {
			this.derivation = obj.derivation;
		}

		if (obj.hasOwnProperty('snapshot')) {
			this.snapshot = obj.snapshot;
		}

		if (obj.hasOwnProperty('differential')) {
			this.differential = obj.differential;
		}

	}

  resourceType = 'StructureDefinition';
  url: string;
  identifier?: Identifier[];
  version?: string;
  name: string;
  title?: string;
  status: StructureDefinitionStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  keyword?: Coding[];
  fhirVersion?: StructureDefinitionFhirVersion1;
  mapping?: StructureDefinitionMapping[];
  kind: StructureDefinitionKind1;
  abstract: boolean;
  context?: StructureDefinitionContext[];
  contextInvariant?: string[];
  type: StructureDefinitionType2;
  baseDefinition?: string;
  derivation?: StructureDefinitionDerivation1;
  snapshot?: StructureDefinitionSnapshot;
  differential?: StructureDefinitionDifferential;
  intro: string;
  notes: string;
}

export class StructureMapGroupRuleDependent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('variable')) {
			this.variable = [];
			for (const o of (obj.variable instanceof Array ? obj.variable : [])) {
				this.variable.push(o);
			}
		}

	}

  name: string;
  variable: string[];
}

export class StructureMapGroupRuleTargetParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

	}

  valueId?: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
}

export class StructureMapGroupRuleTarget extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('contextType')) {
			this.contextType = obj.contextType;
		}

		if (obj.hasOwnProperty('element')) {
			this.element = obj.element;
		}

		if (obj.hasOwnProperty('variable')) {
			this.variable = obj.variable;
		}

		if (obj.hasOwnProperty('listMode')) {
			this.listMode = [];
			for (const o of (obj.listMode instanceof Array ? obj.listMode : [])) {
				this.listMode.push(o);
			}
		}

		if (obj.hasOwnProperty('listRuleId')) {
			this.listRuleId = obj.listRuleId;
		}

		if (obj.hasOwnProperty('transform')) {
			this.transform = obj.transform;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new StructureMapGroupRuleTargetParameter(o));
			}
		}

	}

  context?: string;
  contextType?: StructureMapContextType1;
  element?: string;
  variable?: string;
  listMode?: StructureMapListMode2[];
  listRuleId?: string;
  transform?: StructureMapTransform1;
  parameter?: StructureMapGroupRuleTargetParameter[];
}

export class StructureMapGroupRuleSource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('context')) {
			this.context = obj.context;
		}

		if (obj.hasOwnProperty('min')) {
			this.min = obj.min;
		}

		if (obj.hasOwnProperty('max')) {
			this.max = obj.max;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('defaultValueBase64Binary')) {
			this.defaultValueBase64Binary = obj.defaultValueBase64Binary;
		}

		if (obj.hasOwnProperty('defaultValueBoolean')) {
			this.defaultValueBoolean = obj.defaultValueBoolean;
		}

		if (obj.hasOwnProperty('defaultValueCanonical')) {
			this.defaultValueCanonical = obj.defaultValueCanonical;
		}

		if (obj.hasOwnProperty('defaultValueCode')) {
			this.defaultValueCode = obj.defaultValueCode;
		}

		if (obj.hasOwnProperty('defaultValueDate')) {
			this.defaultValueDate = obj.defaultValueDate;
		}

		if (obj.hasOwnProperty('defaultValueDateTime')) {
			this.defaultValueDateTime = obj.defaultValueDateTime;
		}

		if (obj.hasOwnProperty('defaultValueDecimal')) {
			this.defaultValueDecimal = obj.defaultValueDecimal;
		}

		if (obj.hasOwnProperty('defaultValueId')) {
			this.defaultValueId = obj.defaultValueId;
		}

		if (obj.hasOwnProperty('defaultValueInstant')) {
			this.defaultValueInstant = obj.defaultValueInstant;
		}

		if (obj.hasOwnProperty('defaultValueInteger')) {
			this.defaultValueInteger = obj.defaultValueInteger;
		}

		if (obj.hasOwnProperty('defaultValueMarkdown')) {
			this.defaultValueMarkdown = obj.defaultValueMarkdown;
		}

		if (obj.hasOwnProperty('defaultValueOid')) {
			this.defaultValueOid = obj.defaultValueOid;
		}

		if (obj.hasOwnProperty('defaultValuePositiveInt')) {
			this.defaultValuePositiveInt = obj.defaultValuePositiveInt;
		}

		if (obj.hasOwnProperty('defaultValueString')) {
			this.defaultValueString = obj.defaultValueString;
		}

		if (obj.hasOwnProperty('defaultValueTime')) {
			this.defaultValueTime = obj.defaultValueTime;
		}

		if (obj.hasOwnProperty('defaultValueUnsignedInt')) {
			this.defaultValueUnsignedInt = obj.defaultValueUnsignedInt;
		}

		if (obj.hasOwnProperty('defaultValueUri')) {
			this.defaultValueUri = obj.defaultValueUri;
		}

		if (obj.hasOwnProperty('defaultValueUrl')) {
			this.defaultValueUrl = obj.defaultValueUrl;
		}

		if (obj.hasOwnProperty('defaultValueUuid')) {
			this.defaultValueUuid = obj.defaultValueUuid;
		}

		if (obj.hasOwnProperty('defaultValueAddress')) {
			this.defaultValueAddress = obj.defaultValueAddress;
		}

		if (obj.hasOwnProperty('defaultValueAge')) {
			this.defaultValueAge = obj.defaultValueAge;
		}

		if (obj.hasOwnProperty('defaultValueAnnotation')) {
			this.defaultValueAnnotation = obj.defaultValueAnnotation;
		}

		if (obj.hasOwnProperty('defaultValueAttachment')) {
			this.defaultValueAttachment = obj.defaultValueAttachment;
		}

		if (obj.hasOwnProperty('defaultValueCodeableConcept')) {
			this.defaultValueCodeableConcept = obj.defaultValueCodeableConcept;
		}

		if (obj.hasOwnProperty('defaultValueCoding')) {
			this.defaultValueCoding = obj.defaultValueCoding;
		}

		if (obj.hasOwnProperty('defaultValueContactPoint')) {
			this.defaultValueContactPoint = obj.defaultValueContactPoint;
		}

		if (obj.hasOwnProperty('defaultValueCount')) {
			this.defaultValueCount = obj.defaultValueCount;
		}

		if (obj.hasOwnProperty('defaultValueDistance')) {
			this.defaultValueDistance = obj.defaultValueDistance;
		}

		if (obj.hasOwnProperty('defaultValueDuration')) {
			this.defaultValueDuration = obj.defaultValueDuration;
		}

		if (obj.hasOwnProperty('defaultValueHumanName')) {
			this.defaultValueHumanName = obj.defaultValueHumanName;
		}

		if (obj.hasOwnProperty('defaultValueIdentifier')) {
			this.defaultValueIdentifier = obj.defaultValueIdentifier;
		}

		if (obj.hasOwnProperty('defaultValueMoney')) {
			this.defaultValueMoney = obj.defaultValueMoney;
		}

		if (obj.hasOwnProperty('defaultValuePeriod')) {
			this.defaultValuePeriod = obj.defaultValuePeriod;
		}

		if (obj.hasOwnProperty('defaultValueQuantity')) {
			this.defaultValueQuantity = obj.defaultValueQuantity;
		}

		if (obj.hasOwnProperty('defaultValueRange')) {
			this.defaultValueRange = obj.defaultValueRange;
		}

		if (obj.hasOwnProperty('defaultValueRatio')) {
			this.defaultValueRatio = obj.defaultValueRatio;
		}

		if (obj.hasOwnProperty('defaultValueReference')) {
			this.defaultValueReference = obj.defaultValueReference;
		}

		if (obj.hasOwnProperty('defaultValueSampledData')) {
			this.defaultValueSampledData = obj.defaultValueSampledData;
		}

		if (obj.hasOwnProperty('defaultValueSignature')) {
			this.defaultValueSignature = obj.defaultValueSignature;
		}

		if (obj.hasOwnProperty('defaultValueTiming')) {
			this.defaultValueTiming = obj.defaultValueTiming;
		}

		if (obj.hasOwnProperty('defaultValueContactDetail')) {
			this.defaultValueContactDetail = obj.defaultValueContactDetail;
		}

		if (obj.hasOwnProperty('defaultValueContributor')) {
			this.defaultValueContributor = obj.defaultValueContributor;
		}

		if (obj.hasOwnProperty('defaultValueDataRequirement')) {
			this.defaultValueDataRequirement = obj.defaultValueDataRequirement;
		}

		if (obj.hasOwnProperty('defaultValueExpression')) {
			this.defaultValueExpression = obj.defaultValueExpression;
		}

		if (obj.hasOwnProperty('defaultValueParameterDefinition')) {
			this.defaultValueParameterDefinition = obj.defaultValueParameterDefinition;
		}

		if (obj.hasOwnProperty('defaultValueRelatedArtifact')) {
			this.defaultValueRelatedArtifact = obj.defaultValueRelatedArtifact;
		}

		if (obj.hasOwnProperty('defaultValueTriggerDefinition')) {
			this.defaultValueTriggerDefinition = obj.defaultValueTriggerDefinition;
		}

		if (obj.hasOwnProperty('defaultValueUsageContext')) {
			this.defaultValueUsageContext = obj.defaultValueUsageContext;
		}

		if (obj.hasOwnProperty('defaultValueDosage')) {
			this.defaultValueDosage = obj.defaultValueDosage;
		}

		if (obj.hasOwnProperty('defaultValueMeta')) {
			this.defaultValueMeta = obj.defaultValueMeta;
		}

		if (obj.hasOwnProperty('element')) {
			this.element = obj.element;
		}

		if (obj.hasOwnProperty('listMode')) {
			this.listMode = obj.listMode;
		}

		if (obj.hasOwnProperty('variable')) {
			this.variable = obj.variable;
		}

		if (obj.hasOwnProperty('condition')) {
			this.condition = obj.condition;
		}

		if (obj.hasOwnProperty('check')) {
			this.check = obj.check;
		}

		if (obj.hasOwnProperty('logMessage')) {
			this.logMessage = obj.logMessage;
		}

	}

  context: string;
  min?: number;
  max?: string;
  type?: string;
  defaultValueBase64Binary?: string;
  defaultValueBoolean?: boolean;
  defaultValueCanonical?: string;
  defaultValueCode?: string;
  defaultValueDate?: string;
  defaultValueDateTime?: string;
  defaultValueDecimal?: number;
  defaultValueId?: string;
  defaultValueInstant?: string;
  defaultValueInteger?: number;
  defaultValueMarkdown?: string;
  defaultValueOid?: string;
  defaultValuePositiveInt?: number;
  defaultValueString?: string;
  defaultValueTime?: string;
  defaultValueUnsignedInt?: number;
  defaultValueUri?: string;
  defaultValueUrl?: string;
  defaultValueUuid?: string;
  defaultValueAddress?: Address;
  defaultValueAge?: Age;
  defaultValueAnnotation?: Annotation;
  defaultValueAttachment?: Attachment;
  defaultValueCodeableConcept?: CodeableConcept;
  defaultValueCoding?: Coding;
  defaultValueContactPoint?: ContactPoint;
  defaultValueCount?: Count;
  defaultValueDistance?: Distance;
  defaultValueDuration?: Duration;
  defaultValueHumanName?: HumanName;
  defaultValueIdentifier?: Identifier;
  defaultValueMoney?: Money;
  defaultValuePeriod?: Period;
  defaultValueQuantity?: Quantity;
  defaultValueRange?: Range;
  defaultValueRatio?: Ratio;
  defaultValueReference?: Reference;
  defaultValueSampledData?: SampledData;
  defaultValueSignature?: Signature;
  defaultValueTiming?: Timing;
  defaultValueContactDetail?: ContactDetail;
  defaultValueContributor?: Contributor;
  defaultValueDataRequirement?: DataRequirement;
  defaultValueExpression?: Expression;
  defaultValueParameterDefinition?: ParameterDefinition;
  defaultValueRelatedArtifact?: RelatedArtifact;
  defaultValueTriggerDefinition?: TriggerDefinition;
  defaultValueUsageContext?: UsageContext;
  defaultValueDosage?: Dosage;
  defaultValueMeta?: Meta;
  element?: string;
  listMode?: StructureMapListMode1;
  variable?: string;
  condition?: string;
  check?: string;
  logMessage?: string;
}

export class StructureMapGroupRule extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = [];
			for (const o of (obj.source instanceof Array ? obj.source : [])) {
				this.source.push(new StructureMapGroupRuleSource(o));
			}
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new StructureMapGroupRuleTarget(o));
			}
		}

		if (obj.hasOwnProperty('rule')) {
			this.rule = [];
			for (const o of (obj.rule instanceof Array ? obj.rule : [])) {
				this.rule.push(new StructureMapGroupRule(o));
			}
		}

		if (obj.hasOwnProperty('dependent')) {
			this.dependent = [];
			for (const o of (obj.dependent instanceof Array ? obj.dependent : [])) {
				this.dependent.push(new StructureMapGroupRuleDependent(o));
			}
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  name: string;
  source: StructureMapGroupRuleSource[];
  target?: StructureMapGroupRuleTarget[];
  rule?: StructureMapGroupRule[];
  dependent?: StructureMapGroupRuleDependent[];
  documentation?: string;
}

export class StructureMapGroupInput extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  name: string;
  type?: string;
  mode: StructureMapMode2;
  documentation?: string;
}

export class StructureMapGroup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('extends')) {
			this.extends = obj.extends;
		}

		if (obj.hasOwnProperty('typeMode')) {
			this.typeMode = obj.typeMode;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

		if (obj.hasOwnProperty('input')) {
			this.input = [];
			for (const o of (obj.input instanceof Array ? obj.input : [])) {
				this.input.push(new StructureMapGroupInput(o));
			}
		}

		if (obj.hasOwnProperty('rule')) {
			this.rule = [];
			for (const o of (obj.rule instanceof Array ? obj.rule : [])) {
				this.rule.push(new StructureMapGroupRule(o));
			}
		}

	}

  name: string;
  extends?: string;
  typeMode: StructureMapTypeMode1;
  documentation?: string;
  input: StructureMapGroupInput[];
  rule: StructureMapGroupRule[];
}

export class StructureMapStructure extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('mode')) {
			this.mode = obj.mode;
		}

		if (obj.hasOwnProperty('alias')) {
			this.alias = obj.alias;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  url: string;
  mode: StructureMapMode1;
  alias?: string;
  documentation?: string;
}

export class StructureMap extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('structure')) {
			this.structure = [];
			for (const o of (obj.structure instanceof Array ? obj.structure : [])) {
				this.structure.push(new StructureMapStructure(o));
			}
		}

		if (obj.hasOwnProperty('import')) {
			this.import = [];
			for (const o of (obj.import instanceof Array ? obj.import : [])) {
				this.import.push(o);
			}
		}

		if (obj.hasOwnProperty('group')) {
			this.group = [];
			for (const o of (obj.group instanceof Array ? obj.group : [])) {
				this.group.push(new StructureMapGroup(o));
			}
		}

	}

  resourceType = 'StructureMap';
  url: string;
  identifier?: Identifier[];
  version?: string;
  name: string;
  title?: string;
  status: StructureMapStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  structure?: StructureMapStructure[];
  import?: string[];
  group: StructureMapGroup[];
}

export class SubscriptionChannel extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('endpoint')) {
			this.endpoint = obj.endpoint;
		}

		if (obj.hasOwnProperty('payload')) {
			this.payload = obj.payload;
		}

		if (obj.hasOwnProperty('header')) {
			this.header = [];
			for (const o of (obj.header instanceof Array ? obj.header : [])) {
				this.header.push(o);
			}
		}

	}

  type: SubscriptionType1;
  endpoint?: string;
  payload?: string;
  header?: string[];
}

export class Subscription extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactPoint(o));
			}
		}

		if (obj.hasOwnProperty('end')) {
			this.end = obj.end;
		}

		if (obj.hasOwnProperty('reason')) {
			this.reason = obj.reason;
		}

		if (obj.hasOwnProperty('criteria')) {
			this.criteria = obj.criteria;
		}

		if (obj.hasOwnProperty('error')) {
			this.error = obj.error;
		}

		if (obj.hasOwnProperty('channel')) {
			this.channel = obj.channel;
		}

	}

  resourceType = 'Subscription';
  status: SubscriptionStatus1;
  contact?: ContactPoint[];
  end?: string;
  reason: string;
  criteria: string;
  error?: string;
  channel: SubscriptionChannel;
}

export class SubscriptionStatusNotificationEvent extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('eventNumber')) {
			this.eventNumber = obj.eventNumber;
		}

		if (obj.hasOwnProperty('timestamp')) {
			this.timestamp = obj.timestamp;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = obj.focus;
		}

		if (obj.hasOwnProperty('additionalContext')) {
			this.additionalContext = [];
			for (const o of (obj.additionalContext instanceof Array ? obj.additionalContext : [])) {
				this.additionalContext.push(new Reference(o));
			}
		}

	}

  eventNumber: string;
  timestamp?: string;
  focus?: Reference;
  additionalContext?: Reference[];
}

export class SubscriptionStatus extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('eventsSinceSubscriptionStart')) {
			this.eventsSinceSubscriptionStart = obj.eventsSinceSubscriptionStart;
		}

		if (obj.hasOwnProperty('notificationEvent')) {
			this.notificationEvent = [];
			for (const o of (obj.notificationEvent instanceof Array ? obj.notificationEvent : [])) {
				this.notificationEvent.push(new SubscriptionStatusNotificationEvent(o));
			}
		}

		if (obj.hasOwnProperty('subscription')) {
			this.subscription = obj.subscription;
		}

		if (obj.hasOwnProperty('topic')) {
			this.topic = obj.topic;
		}

		if (obj.hasOwnProperty('error')) {
			this.error = [];
			for (const o of (obj.error instanceof Array ? obj.error : [])) {
				this.error.push(new CodeableConcept(o));
			}
		}

	}

  resourceType = 'SubscriptionStatus';
  status?: SubscriptionStatusStatus1;
  type: SubscriptionStatusType1;
  eventsSinceSubscriptionStart?: string;
  notificationEvent?: SubscriptionStatusNotificationEvent[];
  subscription: Reference;
  topic?: string;
  error?: CodeableConcept[];
}

export class SubscriptionTopicNotificationShape extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('include')) {
			this.include = [];
			for (const o of (obj.include instanceof Array ? obj.include : [])) {
				this.include.push(o);
			}
		}

		if (obj.hasOwnProperty('revInclude')) {
			this.revInclude = [];
			for (const o of (obj.revInclude instanceof Array ? obj.revInclude : [])) {
				this.revInclude.push(o);
			}
		}

	}

  resource: SubscriptionTopicResource4;
  include?: string[];
  revInclude?: string[];
}

export class SubscriptionTopicCanFilterBy extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('filterParameter')) {
			this.filterParameter = obj.filterParameter;
		}

		if (obj.hasOwnProperty('filterDefinition')) {
			this.filterDefinition = obj.filterDefinition;
		}

		if (obj.hasOwnProperty('modifier')) {
			this.modifier = [];
			for (const o of (obj.modifier instanceof Array ? obj.modifier : [])) {
				this.modifier.push(o);
			}
		}

	}

  description?: string;
  resource?: SubscriptionTopicResource3;
  filterParameter: string;
  filterDefinition?: string;
  modifier?: SubscriptionTopicModifier1[];
}

export class SubscriptionTopicEventTrigger extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('event')) {
			this.event = obj.event;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

	}

  description?: string;
  event: CodeableConcept;
  resource: SubscriptionTopicResource2;
}

export class SubscriptionTopicResourceTriggerQueryCriteria extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('previous')) {
			this.previous = obj.previous;
		}

		if (obj.hasOwnProperty('resultForCreate')) {
			this.resultForCreate = obj.resultForCreate;
		}

		if (obj.hasOwnProperty('current')) {
			this.current = obj.current;
		}

		if (obj.hasOwnProperty('resultForDelete')) {
			this.resultForDelete = obj.resultForDelete;
		}

		if (obj.hasOwnProperty('requireBoth')) {
			this.requireBoth = obj.requireBoth;
		}

	}

  previous?: string;
  resultForCreate?: SubscriptionTopicResultForCreate1;
  current?: string;
  resultForDelete?: SubscriptionTopicResultForDelete1;
  requireBoth?: boolean;
}

export class SubscriptionTopicResourceTrigger extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('supportedInteraction')) {
			this.supportedInteraction = [];
			for (const o of (obj.supportedInteraction instanceof Array ? obj.supportedInteraction : [])) {
				this.supportedInteraction.push(o);
			}
		}

		if (obj.hasOwnProperty('queryCriteria')) {
			this.queryCriteria = obj.queryCriteria;
		}

		if (obj.hasOwnProperty('fhirPathCriteria')) {
			this.fhirPathCriteria = obj.fhirPathCriteria;
		}

	}

  description?: string;
  resource: SubscriptionTopicResource1;
  supportedInteraction?: SubscriptionTopicSupportedInteraction1[];
  queryCriteria?: SubscriptionTopicResourceTriggerQueryCriteria;
  fhirPathCriteria?: string;
}

export class SubscriptionTopic extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('derivedFrom')) {
			this.derivedFrom = [];
			for (const o of (obj.derivedFrom instanceof Array ? obj.derivedFrom : [])) {
				this.derivedFrom.push(o);
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('approvalDate')) {
			this.approvalDate = obj.approvalDate;
		}

		if (obj.hasOwnProperty('lastReviewDate')) {
			this.lastReviewDate = obj.lastReviewDate;
		}

		if (obj.hasOwnProperty('effectivePeriod')) {
			this.effectivePeriod = obj.effectivePeriod;
		}

		if (obj.hasOwnProperty('resourceTrigger')) {
			this.resourceTrigger = [];
			for (const o of (obj.resourceTrigger instanceof Array ? obj.resourceTrigger : [])) {
				this.resourceTrigger.push(new SubscriptionTopicResourceTrigger(o));
			}
		}

		if (obj.hasOwnProperty('eventTrigger')) {
			this.eventTrigger = [];
			for (const o of (obj.eventTrigger instanceof Array ? obj.eventTrigger : [])) {
				this.eventTrigger.push(new SubscriptionTopicEventTrigger(o));
			}
		}

		if (obj.hasOwnProperty('canFilterBy')) {
			this.canFilterBy = [];
			for (const o of (obj.canFilterBy instanceof Array ? obj.canFilterBy : [])) {
				this.canFilterBy.push(new SubscriptionTopicCanFilterBy(o));
			}
		}

		if (obj.hasOwnProperty('notificationShape')) {
			this.notificationShape = [];
			for (const o of (obj.notificationShape instanceof Array ? obj.notificationShape : [])) {
				this.notificationShape.push(new SubscriptionTopicNotificationShape(o));
			}
		}

	}

  resourceType = 'SubscriptionTopic';
  url: string;
  identifier?: Identifier[];
  version?: string;
  title?: string;
  derivedFrom?: string[];
  status: SubscriptionTopicStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  approvalDate?: string;
  lastReviewDate?: string;
  effectivePeriod?: Period;
  resourceTrigger?: SubscriptionTopicResourceTrigger[];
  eventTrigger?: SubscriptionTopicEventTrigger[];
  canFilterBy?: SubscriptionTopicCanFilterBy[];
  notificationShape?: SubscriptionTopicNotificationShape[];
}

export class SubstanceIngredient extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('substanceCodeableConcept')) {
			this.substanceCodeableConcept = obj.substanceCodeableConcept;
		}

		if (obj.hasOwnProperty('substanceReference')) {
			this.substanceReference = obj.substanceReference;
		}

	}

  quantity?: Ratio;
  substanceCodeableConcept?: CodeableConcept;
  substanceReference?: Reference;
}

export class SubstanceInstance extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('expiry')) {
			this.expiry = obj.expiry;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

	}

  identifier?: Identifier;
  expiry?: string;
  quantity?: Quantity;
}

export class Substance extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = [];
			for (const o of (obj.category instanceof Array ? obj.category : [])) {
				this.category.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('instance')) {
			this.instance = [];
			for (const o of (obj.instance instanceof Array ? obj.instance : [])) {
				this.instance.push(new SubstanceInstance(o));
			}
		}

		if (obj.hasOwnProperty('ingredient')) {
			this.ingredient = [];
			for (const o of (obj.ingredient instanceof Array ? obj.ingredient : [])) {
				this.ingredient.push(new SubstanceIngredient(o));
			}
		}

	}

  resourceType = 'Substance';
  identifier?: Identifier[];
  status?: SubstanceStatus1;
  category?: CodeableConcept[];
  code: CodeableConcept;
  description?: string;
  instance?: SubstanceInstance[];
  ingredient?: SubstanceIngredient[];
}

export class SubstanceDefinitionSourceMaterial extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('genus')) {
			this.genus = obj.genus;
		}

		if (obj.hasOwnProperty('species')) {
			this.species = obj.species;
		}

		if (obj.hasOwnProperty('part')) {
			this.part = obj.part;
		}

		if (obj.hasOwnProperty('countryOfOrigin')) {
			this.countryOfOrigin = [];
			for (const o of (obj.countryOfOrigin instanceof Array ? obj.countryOfOrigin : [])) {
				this.countryOfOrigin.push(new CodeableConcept(o));
			}
		}

	}

  type?: CodeableConcept;
  genus?: CodeableConcept;
  species?: CodeableConcept;
  part?: CodeableConcept;
  countryOfOrigin?: CodeableConcept[];
}

export class SubstanceDefinitionRelationship extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('substanceDefinitionReference')) {
			this.substanceDefinitionReference = obj.substanceDefinitionReference;
		}

		if (obj.hasOwnProperty('substanceDefinitionCodeableConcept')) {
			this.substanceDefinitionCodeableConcept = obj.substanceDefinitionCodeableConcept;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('isDefining')) {
			this.isDefining = obj.isDefining;
		}

		if (obj.hasOwnProperty('amountQuantity')) {
			this.amountQuantity = obj.amountQuantity;
		}

		if (obj.hasOwnProperty('amountRatio')) {
			this.amountRatio = obj.amountRatio;
		}

		if (obj.hasOwnProperty('amountString')) {
			this.amountString = obj.amountString;
		}

		if (obj.hasOwnProperty('ratioHighLimitAmount')) {
			this.ratioHighLimitAmount = obj.ratioHighLimitAmount;
		}

		if (obj.hasOwnProperty('comparator')) {
			this.comparator = obj.comparator;
		}

		if (obj.hasOwnProperty('source')) {
			this.source = [];
			for (const o of (obj.source instanceof Array ? obj.source : [])) {
				this.source.push(new Reference(o));
			}
		}

	}

  substanceDefinitionReference?: Reference;
  substanceDefinitionCodeableConcept?: CodeableConcept;
  type: CodeableConcept;
  isDefining?: boolean;
  amountQuantity?: Quantity;
  amountRatio?: Ratio;
  amountString?: string;
  ratioHighLimitAmount?: Ratio;
  comparator?: CodeableConcept;
  source?: Reference[];
}

export class SubstanceDefinitionNameOfficial extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('authority')) {
			this.authority = obj.authority;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

	}

  authority?: CodeableConcept;
  status?: CodeableConcept;
  date?: string;
}

export class SubstanceDefinitionName extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('preferred')) {
			this.preferred = obj.preferred;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = [];
			for (const o of (obj.language instanceof Array ? obj.language : [])) {
				this.language.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('domain')) {
			this.domain = [];
			for (const o of (obj.domain instanceof Array ? obj.domain : [])) {
				this.domain.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('synonym')) {
			this.synonym = [];
			for (const o of (obj.synonym instanceof Array ? obj.synonym : [])) {
				this.synonym.push(new SubstanceDefinitionName(o));
			}
		}

		if (obj.hasOwnProperty('translation')) {
			this.translation = [];
			for (const o of (obj.translation instanceof Array ? obj.translation : [])) {
				this.translation.push(new SubstanceDefinitionName(o));
			}
		}

		if (obj.hasOwnProperty('official')) {
			this.official = [];
			for (const o of (obj.official instanceof Array ? obj.official : [])) {
				this.official.push(new SubstanceDefinitionNameOfficial(o));
			}
		}

		if (obj.hasOwnProperty('source')) {
			this.source = [];
			for (const o of (obj.source instanceof Array ? obj.source : [])) {
				this.source.push(new Reference(o));
			}
		}

	}

  name: string;
  type?: CodeableConcept;
  status?: CodeableConcept;
  preferred?: boolean;
  language?: CodeableConcept[];
  domain?: CodeableConcept[];
  jurisdiction?: CodeableConcept[];
  synonym?: SubstanceDefinitionName[];
  translation?: SubstanceDefinitionName[];
  official?: SubstanceDefinitionNameOfficial[];
  source?: Reference[];
}

export class SubstanceDefinitionCode extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('source')) {
			this.source = [];
			for (const o of (obj.source instanceof Array ? obj.source : [])) {
				this.source.push(new Reference(o));
			}
		}

	}

  code?: CodeableConcept;
  status?: CodeableConcept;
  statusDate?: string;
  note?: Annotation[];
  source?: Reference[];
}

export class SubstanceDefinitionStructureRepresentation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('representation')) {
			this.representation = obj.representation;
		}

		if (obj.hasOwnProperty('format')) {
			this.format = obj.format;
		}

		if (obj.hasOwnProperty('document')) {
			this.document = obj.document;
		}

	}

  type?: CodeableConcept;
  representation?: string;
  format?: CodeableConcept;
  document?: Reference;
}

export class SubstanceDefinitionStructure extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('stereochemistry')) {
			this.stereochemistry = obj.stereochemistry;
		}

		if (obj.hasOwnProperty('opticalActivity')) {
			this.opticalActivity = obj.opticalActivity;
		}

		if (obj.hasOwnProperty('molecularFormula')) {
			this.molecularFormula = obj.molecularFormula;
		}

		if (obj.hasOwnProperty('molecularFormulaByMoiety')) {
			this.molecularFormulaByMoiety = obj.molecularFormulaByMoiety;
		}

		if (obj.hasOwnProperty('molecularWeight')) {
			this.molecularWeight = obj.molecularWeight;
		}

		if (obj.hasOwnProperty('technique')) {
			this.technique = [];
			for (const o of (obj.technique instanceof Array ? obj.technique : [])) {
				this.technique.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('sourceDocument')) {
			this.sourceDocument = [];
			for (const o of (obj.sourceDocument instanceof Array ? obj.sourceDocument : [])) {
				this.sourceDocument.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('representation')) {
			this.representation = [];
			for (const o of (obj.representation instanceof Array ? obj.representation : [])) {
				this.representation.push(new SubstanceDefinitionStructureRepresentation(o));
			}
		}

	}

  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  molecularFormulaByMoiety?: string;
  molecularWeight?: SubstanceDefinitionMolecularWeight;
  technique?: CodeableConcept[];
  sourceDocument?: Reference[];
  representation?: SubstanceDefinitionStructureRepresentation[];
}

export class SubstanceDefinitionMolecularWeight extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

	}

  method?: CodeableConcept;
  type?: CodeableConcept;
  amount: Quantity;
}

export class SubstanceDefinitionProperty extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

	}

  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class SubstanceDefinitionMoiety extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('role')) {
			this.role = obj.role;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('stereochemistry')) {
			this.stereochemistry = obj.stereochemistry;
		}

		if (obj.hasOwnProperty('opticalActivity')) {
			this.opticalActivity = obj.opticalActivity;
		}

		if (obj.hasOwnProperty('molecularFormula')) {
			this.molecularFormula = obj.molecularFormula;
		}

		if (obj.hasOwnProperty('amountQuantity')) {
			this.amountQuantity = obj.amountQuantity;
		}

		if (obj.hasOwnProperty('amountString')) {
			this.amountString = obj.amountString;
		}

		if (obj.hasOwnProperty('measurementType')) {
			this.measurementType = obj.measurementType;
		}

	}

  role?: CodeableConcept;
  identifier?: Identifier;
  name?: string;
  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  amountQuantity?: Quantity;
  amountString?: string;
  measurementType?: CodeableConcept;
}

export class SubstanceDefinition extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('classification')) {
			this.classification = [];
			for (const o of (obj.classification instanceof Array ? obj.classification : [])) {
				this.classification.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('domain')) {
			this.domain = obj.domain;
		}

		if (obj.hasOwnProperty('grade')) {
			this.grade = [];
			for (const o of (obj.grade instanceof Array ? obj.grade : [])) {
				this.grade.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('informationSource')) {
			this.informationSource = [];
			for (const o of (obj.informationSource instanceof Array ? obj.informationSource : [])) {
				this.informationSource.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('manufacturer')) {
			this.manufacturer = [];
			for (const o of (obj.manufacturer instanceof Array ? obj.manufacturer : [])) {
				this.manufacturer.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('supplier')) {
			this.supplier = [];
			for (const o of (obj.supplier instanceof Array ? obj.supplier : [])) {
				this.supplier.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('moiety')) {
			this.moiety = [];
			for (const o of (obj.moiety instanceof Array ? obj.moiety : [])) {
				this.moiety.push(new SubstanceDefinitionMoiety(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(new SubstanceDefinitionProperty(o));
			}
		}

		if (obj.hasOwnProperty('molecularWeight')) {
			this.molecularWeight = [];
			for (const o of (obj.molecularWeight instanceof Array ? obj.molecularWeight : [])) {
				this.molecularWeight.push(new SubstanceDefinitionMolecularWeight(o));
			}
		}

		if (obj.hasOwnProperty('structure')) {
			this.structure = obj.structure;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = [];
			for (const o of (obj.code instanceof Array ? obj.code : [])) {
				this.code.push(new SubstanceDefinitionCode(o));
			}
		}

		if (obj.hasOwnProperty('name')) {
			this.name = [];
			for (const o of (obj.name instanceof Array ? obj.name : [])) {
				this.name.push(new SubstanceDefinitionName(o));
			}
		}

		if (obj.hasOwnProperty('relationship')) {
			this.relationship = [];
			for (const o of (obj.relationship instanceof Array ? obj.relationship : [])) {
				this.relationship.push(new SubstanceDefinitionRelationship(o));
			}
		}

		if (obj.hasOwnProperty('sourceMaterial')) {
			this.sourceMaterial = obj.sourceMaterial;
		}

	}

  resourceType = 'SubstanceDefinition';
  identifier?: Identifier[];
  version?: string;
  status?: CodeableConcept;
  classification?: CodeableConcept[];
  domain?: CodeableConcept;
  grade?: CodeableConcept[];
  description?: string;
  informationSource?: Reference[];
  note?: Annotation[];
  manufacturer?: Reference[];
  supplier?: Reference[];
  moiety?: SubstanceDefinitionMoiety[];
  property?: SubstanceDefinitionProperty[];
  molecularWeight?: SubstanceDefinitionMolecularWeight[];
  structure?: SubstanceDefinitionStructure;
  code?: SubstanceDefinitionCode[];
  name?: SubstanceDefinitionName[];
  relationship?: SubstanceDefinitionRelationship[];
  sourceMaterial?: SubstanceDefinitionSourceMaterial;
}

export class SupplyDeliverySuppliedItem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

	}

  quantity?: Quantity;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
}

export class SupplyDelivery extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('suppliedItem')) {
			this.suppliedItem = obj.suppliedItem;
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('supplier')) {
			this.supplier = obj.supplier;
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = obj.destination;
		}

		if (obj.hasOwnProperty('receiver')) {
			this.receiver = [];
			for (const o of (obj.receiver instanceof Array ? obj.receiver : [])) {
				this.receiver.push(new Reference(o));
			}
		}

	}

  resourceType = 'SupplyDelivery';
  identifier?: Identifier[];
  basedOn?: Reference[];
  partOf?: Reference[];
  status?: SupplyDeliveryStatus1;
  patient?: Reference;
  type?: CodeableConcept;
  suppliedItem?: SupplyDeliverySuppliedItem;
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  supplier?: Reference;
  destination?: Reference;
  receiver?: Reference[];
}

export class SupplyRequestParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

	}

  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}

export class SupplyRequest extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('category')) {
			this.category = obj.category;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('itemCodeableConcept')) {
			this.itemCodeableConcept = obj.itemCodeableConcept;
		}

		if (obj.hasOwnProperty('itemReference')) {
			this.itemReference = obj.itemReference;
		}

		if (obj.hasOwnProperty('quantity')) {
			this.quantity = obj.quantity;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new SupplyRequestParameter(o));
			}
		}

		if (obj.hasOwnProperty('occurrenceDateTime')) {
			this.occurrenceDateTime = obj.occurrenceDateTime;
		}

		if (obj.hasOwnProperty('occurrencePeriod')) {
			this.occurrencePeriod = obj.occurrencePeriod;
		}

		if (obj.hasOwnProperty('occurrenceTiming')) {
			this.occurrenceTiming = obj.occurrenceTiming;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('supplier')) {
			this.supplier = [];
			for (const o of (obj.supplier instanceof Array ? obj.supplier : [])) {
				this.supplier.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = [];
			for (const o of (obj.reasonCode instanceof Array ? obj.reasonCode : [])) {
				this.reasonCode.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = [];
			for (const o of (obj.reasonReference instanceof Array ? obj.reasonReference : [])) {
				this.reasonReference.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('deliverFrom')) {
			this.deliverFrom = obj.deliverFrom;
		}

		if (obj.hasOwnProperty('deliverTo')) {
			this.deliverTo = obj.deliverTo;
		}

	}

  resourceType = 'SupplyRequest';
  identifier?: Identifier[];
  status?: SupplyRequestStatus1;
  category?: CodeableConcept;
  priority?: SupplyRequestPriority1;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  quantity: Quantity;
  parameter?: SupplyRequestParameter[];
  occurrenceDateTime?: string;
  occurrencePeriod?: Period;
  occurrenceTiming?: Timing;
  authoredOn?: string;
  requester?: Reference;
  supplier?: Reference[];
  reasonCode?: CodeableConcept[];
  reasonReference?: Reference[];
  deliverFrom?: Reference;
  deliverTo?: Reference;
}

export class TaskOutput extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueCanonical')) {
			this.valueCanonical = obj.valueCanonical;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueInstant')) {
			this.valueInstant = obj.valueInstant;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueMarkdown')) {
			this.valueMarkdown = obj.valueMarkdown;
		}

		if (obj.hasOwnProperty('valueOid')) {
			this.valueOid = obj.valueOid;
		}

		if (obj.hasOwnProperty('valuePositiveInt')) {
			this.valuePositiveInt = obj.valuePositiveInt;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueUnsignedInt')) {
			this.valueUnsignedInt = obj.valueUnsignedInt;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueUrl')) {
			this.valueUrl = obj.valueUrl;
		}

		if (obj.hasOwnProperty('valueUuid')) {
			this.valueUuid = obj.valueUuid;
		}

		if (obj.hasOwnProperty('valueAddress')) {
			this.valueAddress = obj.valueAddress;
		}

		if (obj.hasOwnProperty('valueAge')) {
			this.valueAge = obj.valueAge;
		}

		if (obj.hasOwnProperty('valueAnnotation')) {
			this.valueAnnotation = obj.valueAnnotation;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueContactPoint')) {
			this.valueContactPoint = obj.valueContactPoint;
		}

		if (obj.hasOwnProperty('valueCount')) {
			this.valueCount = obj.valueCount;
		}

		if (obj.hasOwnProperty('valueDistance')) {
			this.valueDistance = obj.valueDistance;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

		if (obj.hasOwnProperty('valueHumanName')) {
			this.valueHumanName = obj.valueHumanName;
		}

		if (obj.hasOwnProperty('valueIdentifier')) {
			this.valueIdentifier = obj.valueIdentifier;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueSignature')) {
			this.valueSignature = obj.valueSignature;
		}

		if (obj.hasOwnProperty('valueTiming')) {
			this.valueTiming = obj.valueTiming;
		}

		if (obj.hasOwnProperty('valueContactDetail')) {
			this.valueContactDetail = obj.valueContactDetail;
		}

		if (obj.hasOwnProperty('valueContributor')) {
			this.valueContributor = obj.valueContributor;
		}

		if (obj.hasOwnProperty('valueDataRequirement')) {
			this.valueDataRequirement = obj.valueDataRequirement;
		}

		if (obj.hasOwnProperty('valueExpression')) {
			this.valueExpression = obj.valueExpression;
		}

		if (obj.hasOwnProperty('valueParameterDefinition')) {
			this.valueParameterDefinition = obj.valueParameterDefinition;
		}

		if (obj.hasOwnProperty('valueRelatedArtifact')) {
			this.valueRelatedArtifact = obj.valueRelatedArtifact;
		}

		if (obj.hasOwnProperty('valueTriggerDefinition')) {
			this.valueTriggerDefinition = obj.valueTriggerDefinition;
		}

		if (obj.hasOwnProperty('valueUsageContext')) {
			this.valueUsageContext = obj.valueUsageContext;
		}

		if (obj.hasOwnProperty('valueDosage')) {
			this.valueDosage = obj.valueDosage;
		}

		if (obj.hasOwnProperty('valueMeta')) {
			this.valueMeta = obj.valueMeta;
		}

	}

  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: number;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}

export class TaskInput extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('valueBase64Binary')) {
			this.valueBase64Binary = obj.valueBase64Binary;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueCanonical')) {
			this.valueCanonical = obj.valueCanonical;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDate')) {
			this.valueDate = obj.valueDate;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueId')) {
			this.valueId = obj.valueId;
		}

		if (obj.hasOwnProperty('valueInstant')) {
			this.valueInstant = obj.valueInstant;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueMarkdown')) {
			this.valueMarkdown = obj.valueMarkdown;
		}

		if (obj.hasOwnProperty('valueOid')) {
			this.valueOid = obj.valueOid;
		}

		if (obj.hasOwnProperty('valuePositiveInt')) {
			this.valuePositiveInt = obj.valuePositiveInt;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueTime')) {
			this.valueTime = obj.valueTime;
		}

		if (obj.hasOwnProperty('valueUnsignedInt')) {
			this.valueUnsignedInt = obj.valueUnsignedInt;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueUrl')) {
			this.valueUrl = obj.valueUrl;
		}

		if (obj.hasOwnProperty('valueUuid')) {
			this.valueUuid = obj.valueUuid;
		}

		if (obj.hasOwnProperty('valueAddress')) {
			this.valueAddress = obj.valueAddress;
		}

		if (obj.hasOwnProperty('valueAge')) {
			this.valueAge = obj.valueAge;
		}

		if (obj.hasOwnProperty('valueAnnotation')) {
			this.valueAnnotation = obj.valueAnnotation;
		}

		if (obj.hasOwnProperty('valueAttachment')) {
			this.valueAttachment = obj.valueAttachment;
		}

		if (obj.hasOwnProperty('valueCodeableConcept')) {
			this.valueCodeableConcept = obj.valueCodeableConcept;
		}

		if (obj.hasOwnProperty('valueCoding')) {
			this.valueCoding = obj.valueCoding;
		}

		if (obj.hasOwnProperty('valueContactPoint')) {
			this.valueContactPoint = obj.valueContactPoint;
		}

		if (obj.hasOwnProperty('valueCount')) {
			this.valueCount = obj.valueCount;
		}

		if (obj.hasOwnProperty('valueDistance')) {
			this.valueDistance = obj.valueDistance;
		}

		if (obj.hasOwnProperty('valueDuration')) {
			this.valueDuration = obj.valueDuration;
		}

		if (obj.hasOwnProperty('valueHumanName')) {
			this.valueHumanName = obj.valueHumanName;
		}

		if (obj.hasOwnProperty('valueIdentifier')) {
			this.valueIdentifier = obj.valueIdentifier;
		}

		if (obj.hasOwnProperty('valueMoney')) {
			this.valueMoney = obj.valueMoney;
		}

		if (obj.hasOwnProperty('valuePeriod')) {
			this.valuePeriod = obj.valuePeriod;
		}

		if (obj.hasOwnProperty('valueQuantity')) {
			this.valueQuantity = obj.valueQuantity;
		}

		if (obj.hasOwnProperty('valueRange')) {
			this.valueRange = obj.valueRange;
		}

		if (obj.hasOwnProperty('valueRatio')) {
			this.valueRatio = obj.valueRatio;
		}

		if (obj.hasOwnProperty('valueReference')) {
			this.valueReference = obj.valueReference;
		}

		if (obj.hasOwnProperty('valueSampledData')) {
			this.valueSampledData = obj.valueSampledData;
		}

		if (obj.hasOwnProperty('valueSignature')) {
			this.valueSignature = obj.valueSignature;
		}

		if (obj.hasOwnProperty('valueTiming')) {
			this.valueTiming = obj.valueTiming;
		}

		if (obj.hasOwnProperty('valueContactDetail')) {
			this.valueContactDetail = obj.valueContactDetail;
		}

		if (obj.hasOwnProperty('valueContributor')) {
			this.valueContributor = obj.valueContributor;
		}

		if (obj.hasOwnProperty('valueDataRequirement')) {
			this.valueDataRequirement = obj.valueDataRequirement;
		}

		if (obj.hasOwnProperty('valueExpression')) {
			this.valueExpression = obj.valueExpression;
		}

		if (obj.hasOwnProperty('valueParameterDefinition')) {
			this.valueParameterDefinition = obj.valueParameterDefinition;
		}

		if (obj.hasOwnProperty('valueRelatedArtifact')) {
			this.valueRelatedArtifact = obj.valueRelatedArtifact;
		}

		if (obj.hasOwnProperty('valueTriggerDefinition')) {
			this.valueTriggerDefinition = obj.valueTriggerDefinition;
		}

		if (obj.hasOwnProperty('valueUsageContext')) {
			this.valueUsageContext = obj.valueUsageContext;
		}

		if (obj.hasOwnProperty('valueDosage')) {
			this.valueDosage = obj.valueDosage;
		}

		if (obj.hasOwnProperty('valueMeta')) {
			this.valueMeta = obj.valueMeta;
		}

	}

  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: number;
  valueInteger?: number;
  valueMarkdown?: string;
  valueOid?: string;
  valuePositiveInt?: number;
  valueString?: string;
  valueTime?: string;
  valueUnsignedInt?: number;
  valueUri?: string;
  valueUrl?: string;
  valueUuid?: string;
  valueAddress?: Address;
  valueAge?: Age;
  valueAnnotation?: Annotation;
  valueAttachment?: Attachment;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueContactPoint?: ContactPoint;
  valueCount?: Count;
  valueDistance?: Distance;
  valueDuration?: Duration;
  valueHumanName?: HumanName;
  valueIdentifier?: Identifier;
  valueMoney?: Money;
  valuePeriod?: Period;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueRatio?: Ratio;
  valueReference?: Reference;
  valueSampledData?: SampledData;
  valueSignature?: Signature;
  valueTiming?: Timing;
  valueContactDetail?: ContactDetail;
  valueContributor?: Contributor;
  valueDataRequirement?: DataRequirement;
  valueExpression?: Expression;
  valueParameterDefinition?: ParameterDefinition;
  valueRelatedArtifact?: RelatedArtifact;
  valueTriggerDefinition?: TriggerDefinition;
  valueUsageContext?: UsageContext;
  valueDosage?: Dosage;
  valueMeta?: Meta;
}

export class TaskRestriction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('repetitions')) {
			this.repetitions = obj.repetitions;
		}

		if (obj.hasOwnProperty('period')) {
			this.period = obj.period;
		}

		if (obj.hasOwnProperty('recipient')) {
			this.recipient = [];
			for (const o of (obj.recipient instanceof Array ? obj.recipient : [])) {
				this.recipient.push(new Reference(o));
			}
		}

	}

  repetitions?: number;
  period?: Period;
  recipient?: Reference[];
}

export class Task extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('instantiatesCanonical')) {
			this.instantiatesCanonical = obj.instantiatesCanonical;
		}

		if (obj.hasOwnProperty('instantiatesUri')) {
			this.instantiatesUri = obj.instantiatesUri;
		}

		if (obj.hasOwnProperty('basedOn')) {
			this.basedOn = [];
			for (const o of (obj.basedOn instanceof Array ? obj.basedOn : [])) {
				this.basedOn.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('groupIdentifier')) {
			this.groupIdentifier = obj.groupIdentifier;
		}

		if (obj.hasOwnProperty('partOf')) {
			this.partOf = [];
			for (const o of (obj.partOf instanceof Array ? obj.partOf : [])) {
				this.partOf.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusReason')) {
			this.statusReason = obj.statusReason;
		}

		if (obj.hasOwnProperty('businessStatus')) {
			this.businessStatus = obj.businessStatus;
		}

		if (obj.hasOwnProperty('intent')) {
			this.intent = obj.intent;
		}

		if (obj.hasOwnProperty('priority')) {
			this.priority = obj.priority;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('focus')) {
			this.focus = obj.focus;
		}

		if (obj.hasOwnProperty('for')) {
			this.for = obj.for;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('executionPeriod')) {
			this.executionPeriod = obj.executionPeriod;
		}

		if (obj.hasOwnProperty('authoredOn')) {
			this.authoredOn = obj.authoredOn;
		}

		if (obj.hasOwnProperty('lastModified')) {
			this.lastModified = obj.lastModified;
		}

		if (obj.hasOwnProperty('requester')) {
			this.requester = obj.requester;
		}

		if (obj.hasOwnProperty('performerType')) {
			this.performerType = [];
			for (const o of (obj.performerType instanceof Array ? obj.performerType : [])) {
				this.performerType.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('owner')) {
			this.owner = obj.owner;
		}

		if (obj.hasOwnProperty('location')) {
			this.location = obj.location;
		}

		if (obj.hasOwnProperty('reasonCode')) {
			this.reasonCode = obj.reasonCode;
		}

		if (obj.hasOwnProperty('reasonReference')) {
			this.reasonReference = obj.reasonReference;
		}

		if (obj.hasOwnProperty('insurance')) {
			this.insurance = [];
			for (const o of (obj.insurance instanceof Array ? obj.insurance : [])) {
				this.insurance.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

		if (obj.hasOwnProperty('relevantHistory')) {
			this.relevantHistory = [];
			for (const o of (obj.relevantHistory instanceof Array ? obj.relevantHistory : [])) {
				this.relevantHistory.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('restriction')) {
			this.restriction = obj.restriction;
		}

		if (obj.hasOwnProperty('input')) {
			this.input = [];
			for (const o of (obj.input instanceof Array ? obj.input : [])) {
				this.input.push(new TaskInput(o));
			}
		}

		if (obj.hasOwnProperty('output')) {
			this.output = [];
			for (const o of (obj.output instanceof Array ? obj.output : [])) {
				this.output.push(new TaskOutput(o));
			}
		}

	}

  resourceType = 'Task';
  identifier?: Identifier[];
  instantiatesCanonical?: string;
  instantiatesUri?: string;
  basedOn?: Reference[];
  groupIdentifier?: Identifier;
  partOf?: Reference[];
  status: TaskStatus1;
  statusReason?: CodeableConcept;
  businessStatus?: CodeableConcept;
  intent: TaskIntent1;
  priority?: TaskPriority1;
  code?: CodeableConcept;
  description?: string;
  focus?: Reference;
  for?: Reference;
  encounter?: Reference;
  executionPeriod?: Period;
  authoredOn?: string;
  lastModified?: string;
  requester?: Reference;
  performerType?: CodeableConcept[];
  owner?: Reference;
  location?: Reference;
  reasonCode?: CodeableConcept;
  reasonReference?: Reference;
  insurance?: Reference[];
  note?: Annotation[];
  relevantHistory?: Reference[];
  restriction?: TaskRestriction;
  input?: TaskInput[];
  output?: TaskOutput[];
}

export class TerminologyCapabilitiesClosure extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('translation')) {
			this.translation = obj.translation;
		}

	}

  translation?: boolean;
}

export class TerminologyCapabilitiesTranslation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('needsMap')) {
			this.needsMap = obj.needsMap;
		}

	}

  needsMap: boolean;
}

export class TerminologyCapabilitiesValidateCode extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('translations')) {
			this.translations = obj.translations;
		}

	}

  translations: boolean;
}

export class TerminologyCapabilitiesExpansionParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('documentation')) {
			this.documentation = obj.documentation;
		}

	}

  name: string;
  documentation?: string;
}

export class TerminologyCapabilitiesExpansion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('hierarchical')) {
			this.hierarchical = obj.hierarchical;
		}

		if (obj.hasOwnProperty('paging')) {
			this.paging = obj.paging;
		}

		if (obj.hasOwnProperty('incomplete')) {
			this.incomplete = obj.incomplete;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new TerminologyCapabilitiesExpansionParameter(o));
			}
		}

		if (obj.hasOwnProperty('textFilter')) {
			this.textFilter = obj.textFilter;
		}

	}

  hierarchical?: boolean;
  paging?: boolean;
  incomplete?: boolean;
  parameter?: TerminologyCapabilitiesExpansionParameter[];
  textFilter?: string;
}

export class TerminologyCapabilitiesCodeSystemVersionFilter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('op')) {
			this.op = [];
			for (const o of (obj.op instanceof Array ? obj.op : [])) {
				this.op.push(o);
			}
		}

	}

  code: string;
  op: string[];
}

export class TerminologyCapabilitiesCodeSystemVersion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('isDefault')) {
			this.isDefault = obj.isDefault;
		}

		if (obj.hasOwnProperty('compositional')) {
			this.compositional = obj.compositional;
		}

		if (obj.hasOwnProperty('language')) {
			this.language = [];
			for (const o of (obj.language instanceof Array ? obj.language : [])) {
				this.language.push(o);
			}
		}

		if (obj.hasOwnProperty('filter')) {
			this.filter = [];
			for (const o of (obj.filter instanceof Array ? obj.filter : [])) {
				this.filter.push(new TerminologyCapabilitiesCodeSystemVersionFilter(o));
			}
		}

		if (obj.hasOwnProperty('property')) {
			this.property = [];
			for (const o of (obj.property instanceof Array ? obj.property : [])) {
				this.property.push(o);
			}
		}

	}

  code?: string;
  isDefault?: boolean;
  compositional?: boolean;
  language?: string[];
  filter?: TerminologyCapabilitiesCodeSystemVersionFilter[];
  property?: string[];
}

export class TerminologyCapabilitiesCodeSystem extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = [];
			for (const o of (obj.version instanceof Array ? obj.version : [])) {
				this.version.push(new TerminologyCapabilitiesCodeSystemVersion(o));
			}
		}

		if (obj.hasOwnProperty('subsumption')) {
			this.subsumption = obj.subsumption;
		}

	}

  uri?: string;
  version?: TerminologyCapabilitiesCodeSystemVersion[];
  subsumption?: boolean;
}

export class TerminologyCapabilitiesImplementation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

	}

  description: string;
  url?: string;
}

export class TerminologyCapabilitiesSoftware extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

	}

  name: string;
  version?: string;
}

export class TerminologyCapabilities extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('kind')) {
			this.kind = obj.kind;
		}

		if (obj.hasOwnProperty('software')) {
			this.software = obj.software;
		}

		if (obj.hasOwnProperty('implementation')) {
			this.implementation = obj.implementation;
		}

		if (obj.hasOwnProperty('lockedDate')) {
			this.lockedDate = obj.lockedDate;
		}

		if (obj.hasOwnProperty('codeSystem')) {
			this.codeSystem = [];
			for (const o of (obj.codeSystem instanceof Array ? obj.codeSystem : [])) {
				this.codeSystem.push(new TerminologyCapabilitiesCodeSystem(o));
			}
		}

		if (obj.hasOwnProperty('expansion')) {
			this.expansion = obj.expansion;
		}

		if (obj.hasOwnProperty('codeSearch')) {
			this.codeSearch = obj.codeSearch;
		}

		if (obj.hasOwnProperty('validateCode')) {
			this.validateCode = obj.validateCode;
		}

		if (obj.hasOwnProperty('translation')) {
			this.translation = obj.translation;
		}

		if (obj.hasOwnProperty('closure')) {
			this.closure = obj.closure;
		}

	}

  resourceType = 'TerminologyCapabilities';
  url?: string;
  version?: string;
  name?: string;
  title?: string;
  status: TerminologyCapabilitiesStatus1;
  experimental?: boolean;
  date: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  kind: TerminologyCapabilitiesKind1;
  software?: TerminologyCapabilitiesSoftware;
  implementation?: TerminologyCapabilitiesImplementation;
  lockedDate?: boolean;
  codeSystem?: TerminologyCapabilitiesCodeSystem[];
  expansion?: TerminologyCapabilitiesExpansion;
  codeSearch?: TerminologyCapabilitiesCodeSearch1;
  validateCode?: TerminologyCapabilitiesValidateCode;
  translation?: TerminologyCapabilitiesTranslation;
  closure?: TerminologyCapabilitiesClosure;
}

export class TestReportTeardownAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

	}

  operation: TestReportSetupActionOperation;
}

export class TestReportTeardown extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestReportTeardownAction(o));
			}
		}

	}

  action: TestReportTeardownAction[];
}

export class TestReportTestAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

		if (obj.hasOwnProperty('assert')) {
			this.assert = obj.assert;
		}

	}

  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}

export class TestReportTest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestReportTestAction(o));
			}
		}

	}

  name?: string;
  description?: string;
  action: TestReportTestAction[];
}

export class TestReportSetupActionAssert extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('result')) {
			this.result = obj.result;
		}

		if (obj.hasOwnProperty('message')) {
			this.message = obj.message;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = obj.detail;
		}

	}

  result: TestReportResult3;
  message?: string;
  detail?: string;
}

export class TestReportSetupActionOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('result')) {
			this.result = obj.result;
		}

		if (obj.hasOwnProperty('message')) {
			this.message = obj.message;
		}

		if (obj.hasOwnProperty('detail')) {
			this.detail = obj.detail;
		}

	}

  result: TestReportResult2;
  message?: string;
  detail?: string;
}

export class TestReportSetupAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

		if (obj.hasOwnProperty('assert')) {
			this.assert = obj.assert;
		}

	}

  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}

export class TestReportSetup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestReportSetupAction(o));
			}
		}

	}

  action: TestReportSetupAction[];
}

export class TestReportParticipant extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('uri')) {
			this.uri = obj.uri;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

	}

  type: TestReportType1;
  uri: string;
  display?: string;
}

export class TestReport extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('testScript')) {
			this.testScript = obj.testScript;
		}

		if (obj.hasOwnProperty('result')) {
			this.result = obj.result;
		}

		if (obj.hasOwnProperty('score')) {
			this.score = obj.score;
		}

		if (obj.hasOwnProperty('tester')) {
			this.tester = obj.tester;
		}

		if (obj.hasOwnProperty('issued')) {
			this.issued = obj.issued;
		}

		if (obj.hasOwnProperty('participant')) {
			this.participant = [];
			for (const o of (obj.participant instanceof Array ? obj.participant : [])) {
				this.participant.push(new TestReportParticipant(o));
			}
		}

		if (obj.hasOwnProperty('setup')) {
			this.setup = obj.setup;
		}

		if (obj.hasOwnProperty('test')) {
			this.test = [];
			for (const o of (obj.test instanceof Array ? obj.test : [])) {
				this.test.push(new TestReportTest(o));
			}
		}

		if (obj.hasOwnProperty('teardown')) {
			this.teardown = obj.teardown;
		}

	}

  resourceType = 'TestReport';
  identifier?: Identifier;
  name?: string;
  status: TestReportStatus1;
  testScript: Reference;
  result: TestReportResult1;
  score?: number;
  tester?: string;
  issued?: string;
  participant?: TestReportParticipant[];
  setup?: TestReportSetup;
  test?: TestReportTest[];
  teardown?: TestReportTeardown;
}

export class TestScriptTeardownAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

	}

  operation: TestScriptSetupActionOperation;
}

export class TestScriptTeardown extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestScriptTeardownAction(o));
			}
		}

	}

  action: TestScriptTeardownAction[];
}

export class TestScriptTestAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

		if (obj.hasOwnProperty('assert')) {
			this.assert = obj.assert;
		}

	}

  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}

export class TestScriptTest extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestScriptTestAction(o));
			}
		}

	}

  name?: string;
  description?: string;
  action: TestScriptTestAction[];
}

export class TestScriptSetupActionAssert extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('label')) {
			this.label = obj.label;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('direction')) {
			this.direction = obj.direction;
		}

		if (obj.hasOwnProperty('compareToSourceId')) {
			this.compareToSourceId = obj.compareToSourceId;
		}

		if (obj.hasOwnProperty('compareToSourceExpression')) {
			this.compareToSourceExpression = obj.compareToSourceExpression;
		}

		if (obj.hasOwnProperty('compareToSourcePath')) {
			this.compareToSourcePath = obj.compareToSourcePath;
		}

		if (obj.hasOwnProperty('contentType')) {
			this.contentType = obj.contentType;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('headerField')) {
			this.headerField = obj.headerField;
		}

		if (obj.hasOwnProperty('minimumId')) {
			this.minimumId = obj.minimumId;
		}

		if (obj.hasOwnProperty('navigationLinks')) {
			this.navigationLinks = obj.navigationLinks;
		}

		if (obj.hasOwnProperty('operator')) {
			this.operator = obj.operator;
		}

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('requestMethod')) {
			this.requestMethod = obj.requestMethod;
		}

		if (obj.hasOwnProperty('requestURL')) {
			this.requestURL = obj.requestURL;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('response')) {
			this.response = obj.response;
		}

		if (obj.hasOwnProperty('responseCode')) {
			this.responseCode = obj.responseCode;
		}

		if (obj.hasOwnProperty('sourceId')) {
			this.sourceId = obj.sourceId;
		}

		if (obj.hasOwnProperty('validateProfileId')) {
			this.validateProfileId = obj.validateProfileId;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

		if (obj.hasOwnProperty('warningOnly')) {
			this.warningOnly = obj.warningOnly;
		}

	}

  label?: string;
  description?: string;
  direction?: TestScriptDirection1;
  compareToSourceId?: string;
  compareToSourceExpression?: string;
  compareToSourcePath?: string;
  contentType?: string;
  expression?: string;
  headerField?: string;
  minimumId?: string;
  navigationLinks?: boolean;
  operator?: TestScriptOperator1;
  path?: string;
  requestMethod?: TestScriptRequestMethod1;
  requestURL?: string;
  resource?: TestScriptResource2;
  response?: TestScriptResponse1;
  responseCode?: string;
  sourceId?: string;
  validateProfileId?: string;
  value?: string;
  warningOnly: boolean;
}

export class TestScriptSetupActionOperationRequestHeader extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('field')) {
			this.field = obj.field;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  field: string;
  value: string;
}

export class TestScriptSetupActionOperation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('type')) {
			this.type = obj.type;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

		if (obj.hasOwnProperty('label')) {
			this.label = obj.label;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('accept')) {
			this.accept = obj.accept;
		}

		if (obj.hasOwnProperty('contentType')) {
			this.contentType = obj.contentType;
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = obj.destination;
		}

		if (obj.hasOwnProperty('encodeRequestUrl')) {
			this.encodeRequestUrl = obj.encodeRequestUrl;
		}

		if (obj.hasOwnProperty('method')) {
			this.method = obj.method;
		}

		if (obj.hasOwnProperty('origin')) {
			this.origin = obj.origin;
		}

		if (obj.hasOwnProperty('params')) {
			this.params = obj.params;
		}

		if (obj.hasOwnProperty('requestHeader')) {
			this.requestHeader = [];
			for (const o of (obj.requestHeader instanceof Array ? obj.requestHeader : [])) {
				this.requestHeader.push(new TestScriptSetupActionOperationRequestHeader(o));
			}
		}

		if (obj.hasOwnProperty('requestId')) {
			this.requestId = obj.requestId;
		}

		if (obj.hasOwnProperty('responseId')) {
			this.responseId = obj.responseId;
		}

		if (obj.hasOwnProperty('sourceId')) {
			this.sourceId = obj.sourceId;
		}

		if (obj.hasOwnProperty('targetId')) {
			this.targetId = obj.targetId;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

	}

  type?: Coding;
  resource?: TestScriptResource1;
  label?: string;
  description?: string;
  accept?: string;
  contentType?: string;
  destination?: number;
  encodeRequestUrl: boolean;
  method?: TestScriptMethod1;
  origin?: number;
  params?: string;
  requestHeader?: TestScriptSetupActionOperationRequestHeader[];
  requestId?: string;
  responseId?: string;
  sourceId?: string;
  targetId?: string;
  url?: string;
}

export class TestScriptSetupAction extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('operation')) {
			this.operation = obj.operation;
		}

		if (obj.hasOwnProperty('assert')) {
			this.assert = obj.assert;
		}

	}

  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}

export class TestScriptSetup extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('action')) {
			this.action = [];
			for (const o of (obj.action instanceof Array ? obj.action : [])) {
				this.action.push(new TestScriptSetupAction(o));
			}
		}

	}

  action: TestScriptSetupAction[];
}

export class TestScriptVariable extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('defaultValue')) {
			this.defaultValue = obj.defaultValue;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('expression')) {
			this.expression = obj.expression;
		}

		if (obj.hasOwnProperty('headerField')) {
			this.headerField = obj.headerField;
		}

		if (obj.hasOwnProperty('hint')) {
			this.hint = obj.hint;
		}

		if (obj.hasOwnProperty('path')) {
			this.path = obj.path;
		}

		if (obj.hasOwnProperty('sourceId')) {
			this.sourceId = obj.sourceId;
		}

	}

  name: string;
  defaultValue?: string;
  description?: string;
  expression?: string;
  headerField?: string;
  hint?: string;
  path?: string;
  sourceId?: string;
}

export class TestScriptFixture extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('autocreate')) {
			this.autocreate = obj.autocreate;
		}

		if (obj.hasOwnProperty('autodelete')) {
			this.autodelete = obj.autodelete;
		}

		if (obj.hasOwnProperty('resource')) {
			this.resource = obj.resource;
		}

	}

  autocreate: boolean;
  autodelete: boolean;
  resource?: Reference;
}

export class TestScriptMetadataCapability extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('required')) {
			this.required = obj.required;
		}

		if (obj.hasOwnProperty('validated')) {
			this.validated = obj.validated;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('origin')) {
			this.origin = [];
			for (const o of (obj.origin instanceof Array ? obj.origin : [])) {
				this.origin.push(o);
			}
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = obj.destination;
		}

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(o);
			}
		}

		if (obj.hasOwnProperty('capabilities')) {
			this.capabilities = obj.capabilities;
		}

	}

  required: boolean;
  validated: boolean;
  description?: string;
  origin?: number[];
  destination?: number;
  link?: string[];
  capabilities: string;
}

export class TestScriptMetadataLink extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

	}

  url: string;
  description?: string;
}

export class TestScriptMetadata extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('link')) {
			this.link = [];
			for (const o of (obj.link instanceof Array ? obj.link : [])) {
				this.link.push(new TestScriptMetadataLink(o));
			}
		}

		if (obj.hasOwnProperty('capability')) {
			this.capability = [];
			for (const o of (obj.capability instanceof Array ? obj.capability : [])) {
				this.capability.push(new TestScriptMetadataCapability(o));
			}
		}

	}

  link?: TestScriptMetadataLink[];
  capability: TestScriptMetadataCapability[];
}

export class TestScriptDestination extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('index')) {
			this.index = obj.index;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

	}

  index: number;
  profile: Coding;
}

export class TestScriptOrigin extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('index')) {
			this.index = obj.index;
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = obj.profile;
		}

	}

  index: number;
  profile: Coding;
}

export class TestScript extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('origin')) {
			this.origin = [];
			for (const o of (obj.origin instanceof Array ? obj.origin : [])) {
				this.origin.push(new TestScriptOrigin(o));
			}
		}

		if (obj.hasOwnProperty('destination')) {
			this.destination = [];
			for (const o of (obj.destination instanceof Array ? obj.destination : [])) {
				this.destination.push(new TestScriptDestination(o));
			}
		}

		if (obj.hasOwnProperty('metadata')) {
			this.metadata = obj.metadata;
		}

		if (obj.hasOwnProperty('fixture')) {
			this.fixture = [];
			for (const o of (obj.fixture instanceof Array ? obj.fixture : [])) {
				this.fixture.push(new TestScriptFixture(o));
			}
		}

		if (obj.hasOwnProperty('profile')) {
			this.profile = [];
			for (const o of (obj.profile instanceof Array ? obj.profile : [])) {
				this.profile.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('variable')) {
			this.variable = [];
			for (const o of (obj.variable instanceof Array ? obj.variable : [])) {
				this.variable.push(new TestScriptVariable(o));
			}
		}

		if (obj.hasOwnProperty('setup')) {
			this.setup = obj.setup;
		}

		if (obj.hasOwnProperty('test')) {
			this.test = [];
			for (const o of (obj.test instanceof Array ? obj.test : [])) {
				this.test.push(new TestScriptTest(o));
			}
		}

		if (obj.hasOwnProperty('teardown')) {
			this.teardown = obj.teardown;
		}

	}

  resourceType = 'TestScript';
  url: string;
  identifier?: Identifier;
  version?: string;
  name: string;
  title?: string;
  status: TestScriptStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  purpose?: string;
  copyright?: string;
  origin?: TestScriptOrigin[];
  destination?: TestScriptDestination[];
  metadata?: TestScriptMetadata;
  fixture?: TestScriptFixture[];
  profile?: Reference[];
  variable?: TestScriptVariable[];
  setup?: TestScriptSetup;
  test?: TestScriptTest[];
  teardown?: TestScriptTeardown;
}

export class ValueSetExpansionContains extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('abstract')) {
			this.abstract = obj.abstract;
		}

		if (obj.hasOwnProperty('inactive')) {
			this.inactive = obj.inactive;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('designation')) {
			this.designation = [];
			for (const o of (obj.designation instanceof Array ? obj.designation : [])) {
				this.designation.push(new ValueSetComposeIncludeConceptDesignation(o));
			}
		}

		if (obj.hasOwnProperty('contains')) {
			this.contains = [];
			for (const o of (obj.contains instanceof Array ? obj.contains : [])) {
				this.contains.push(new ValueSetExpansionContains(o));
			}
		}

	}

  system?: string;
  abstract?: boolean;
  inactive?: boolean;
  version?: string;
  code?: string;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation[];
  contains?: ValueSetExpansionContains[];
}

export class ValueSetExpansionParameter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('valueString')) {
			this.valueString = obj.valueString;
		}

		if (obj.hasOwnProperty('valueBoolean')) {
			this.valueBoolean = obj.valueBoolean;
		}

		if (obj.hasOwnProperty('valueInteger')) {
			this.valueInteger = obj.valueInteger;
		}

		if (obj.hasOwnProperty('valueDecimal')) {
			this.valueDecimal = obj.valueDecimal;
		}

		if (obj.hasOwnProperty('valueUri')) {
			this.valueUri = obj.valueUri;
		}

		if (obj.hasOwnProperty('valueCode')) {
			this.valueCode = obj.valueCode;
		}

		if (obj.hasOwnProperty('valueDateTime')) {
			this.valueDateTime = obj.valueDateTime;
		}

	}

  name: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
  valueUri?: string;
  valueCode?: string;
  valueDateTime?: string;
}

export class ValueSetExpansion extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = obj.identifier;
		}

		if (obj.hasOwnProperty('timestamp')) {
			this.timestamp = obj.timestamp;
		}

		if (obj.hasOwnProperty('total')) {
			this.total = obj.total;
		}

		if (obj.hasOwnProperty('offset')) {
			this.offset = obj.offset;
		}

		if (obj.hasOwnProperty('parameter')) {
			this.parameter = [];
			for (const o of (obj.parameter instanceof Array ? obj.parameter : [])) {
				this.parameter.push(new ValueSetExpansionParameter(o));
			}
		}

		if (obj.hasOwnProperty('contains')) {
			this.contains = [];
			for (const o of (obj.contains instanceof Array ? obj.contains : [])) {
				this.contains.push(new ValueSetExpansionContains(o));
			}
		}

	}

  identifier?: string;
  timestamp: string;
  total?: number;
  offset?: number;
  parameter?: ValueSetExpansionParameter[];
  contains?: ValueSetExpansionContains[];
}

export class ValueSetComposeIncludeFilter extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('property')) {
			this.property = obj.property;
		}

		if (obj.hasOwnProperty('op')) {
			this.op = obj.op;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  property: string;
  op: ValueSetOp1;
  value: string;
}

export class ValueSetComposeIncludeConceptDesignation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('language')) {
			this.language = obj.language;
		}

		if (obj.hasOwnProperty('use')) {
			this.use = obj.use;
		}

		if (obj.hasOwnProperty('value')) {
			this.value = obj.value;
		}

	}

  language?: string;
  use?: Coding;
  value: string;
}

export class ValueSetComposeIncludeConcept extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('code')) {
			this.code = obj.code;
		}

		if (obj.hasOwnProperty('display')) {
			this.display = obj.display;
		}

		if (obj.hasOwnProperty('designation')) {
			this.designation = [];
			for (const o of (obj.designation instanceof Array ? obj.designation : [])) {
				this.designation.push(new ValueSetComposeIncludeConceptDesignation(o));
			}
		}

	}

  code: string;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation[];
}

export class ValueSetComposeInclude extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('system')) {
			this.system = obj.system;
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('concept')) {
			this.concept = [];
			for (const o of (obj.concept instanceof Array ? obj.concept : [])) {
				this.concept.push(new ValueSetComposeIncludeConcept(o));
			}
		}

		if (obj.hasOwnProperty('filter')) {
			this.filter = [];
			for (const o of (obj.filter instanceof Array ? obj.filter : [])) {
				this.filter.push(new ValueSetComposeIncludeFilter(o));
			}
		}

		if (obj.hasOwnProperty('valueSet')) {
			this.valueSet = [];
			for (const o of (obj.valueSet instanceof Array ? obj.valueSet : [])) {
				this.valueSet.push(o);
			}
		}

	}

  system?: string;
  version?: string;
  concept?: ValueSetComposeIncludeConcept[];
  filter?: ValueSetComposeIncludeFilter[];
  valueSet?: string[];
}

export class ValueSetCompose extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('lockedDate')) {
			this.lockedDate = obj.lockedDate;
		}

		if (obj.hasOwnProperty('inactive')) {
			this.inactive = obj.inactive;
		}

		if (obj.hasOwnProperty('include')) {
			this.include = [];
			for (const o of (obj.include instanceof Array ? obj.include : [])) {
				this.include.push(new ValueSetComposeInclude(o));
			}
		}

		if (obj.hasOwnProperty('exclude')) {
			this.exclude = [];
			for (const o of (obj.exclude instanceof Array ? obj.exclude : [])) {
				this.exclude.push(new ValueSetComposeInclude(o));
			}
		}

	}

  lockedDate?: string;
  inactive?: boolean;
  include: ValueSetComposeInclude[];
  exclude?: ValueSetComposeInclude[];
}

export class ValueSet extends DomainResource implements IFhir.IValueSet {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('url')) {
			this.url = obj.url;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('version')) {
			this.version = obj.version;
		}

		if (obj.hasOwnProperty('name')) {
			this.name = obj.name;
		}

		if (obj.hasOwnProperty('title')) {
			this.title = obj.title;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('experimental')) {
			this.experimental = obj.experimental;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('publisher')) {
			this.publisher = obj.publisher;
		}

		if (obj.hasOwnProperty('contact')) {
			this.contact = [];
			for (const o of (obj.contact instanceof Array ? obj.contact : [])) {
				this.contact.push(new ContactDetail(o));
			}
		}

		if (obj.hasOwnProperty('description')) {
			this.description = obj.description;
		}

		if (obj.hasOwnProperty('useContext')) {
			this.useContext = [];
			for (const o of (obj.useContext instanceof Array ? obj.useContext : [])) {
				this.useContext.push(new UsageContext(o));
			}
		}

		if (obj.hasOwnProperty('jurisdiction')) {
			this.jurisdiction = [];
			for (const o of (obj.jurisdiction instanceof Array ? obj.jurisdiction : [])) {
				this.jurisdiction.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('immutable')) {
			this.immutable = obj.immutable;
		}

		if (obj.hasOwnProperty('purpose')) {
			this.purpose = obj.purpose;
		}

		if (obj.hasOwnProperty('copyright')) {
			this.copyright = obj.copyright;
		}

		if (obj.hasOwnProperty('compose')) {
			this.compose = obj.compose;
		}

		if (obj.hasOwnProperty('expansion')) {
			this.expansion = obj.expansion;
		}

	}

  resourceType = 'ValueSet';
  url?: string;
  identifier?: Identifier[];
  version?: string;
  name?: string;
  title?: string;
  status: ValueSetStatus1;
  experimental?: boolean;
  date?: string;
  publisher?: string;
  contact?: ContactDetail[];
  description?: string;
  useContext?: UsageContext[];
  jurisdiction?: CodeableConcept[];
  immutable?: boolean;
  purpose?: string;
  copyright?: string;
  compose?: ValueSetCompose;
  expansion?: ValueSetExpansion;
}

export class VerificationResultValidator extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('organization')) {
			this.organization = obj.organization;
		}

		if (obj.hasOwnProperty('identityCertificate')) {
			this.identityCertificate = obj.identityCertificate;
		}

		if (obj.hasOwnProperty('attestationSignature')) {
			this.attestationSignature = obj.attestationSignature;
		}

	}

  organization: Reference;
  identityCertificate?: string;
  attestationSignature?: Signature;
}

export class VerificationResultAttestation extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('who')) {
			this.who = obj.who;
		}

		if (obj.hasOwnProperty('onBehalfOf')) {
			this.onBehalfOf = obj.onBehalfOf;
		}

		if (obj.hasOwnProperty('communicationMethod')) {
			this.communicationMethod = obj.communicationMethod;
		}

		if (obj.hasOwnProperty('date')) {
			this.date = obj.date;
		}

		if (obj.hasOwnProperty('sourceIdentityCertificate')) {
			this.sourceIdentityCertificate = obj.sourceIdentityCertificate;
		}

		if (obj.hasOwnProperty('proxyIdentityCertificate')) {
			this.proxyIdentityCertificate = obj.proxyIdentityCertificate;
		}

		if (obj.hasOwnProperty('proxySignature')) {
			this.proxySignature = obj.proxySignature;
		}

		if (obj.hasOwnProperty('sourceSignature')) {
			this.sourceSignature = obj.sourceSignature;
		}

	}

  who?: Reference;
  onBehalfOf?: Reference;
  communicationMethod?: CodeableConcept;
  date?: string;
  sourceIdentityCertificate?: string;
  proxyIdentityCertificate?: string;
  proxySignature?: Signature;
  sourceSignature?: Signature;
}

export class VerificationResultPrimarySource extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('who')) {
			this.who = obj.who;
		}

		if (obj.hasOwnProperty('type')) {
			this.type = [];
			for (const o of (obj.type instanceof Array ? obj.type : [])) {
				this.type.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('communicationMethod')) {
			this.communicationMethod = [];
			for (const o of (obj.communicationMethod instanceof Array ? obj.communicationMethod : [])) {
				this.communicationMethod.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('validationStatus')) {
			this.validationStatus = obj.validationStatus;
		}

		if (obj.hasOwnProperty('validationDate')) {
			this.validationDate = obj.validationDate;
		}

		if (obj.hasOwnProperty('canPushUpdates')) {
			this.canPushUpdates = obj.canPushUpdates;
		}

		if (obj.hasOwnProperty('pushTypeAvailable')) {
			this.pushTypeAvailable = [];
			for (const o of (obj.pushTypeAvailable instanceof Array ? obj.pushTypeAvailable : [])) {
				this.pushTypeAvailable.push(new CodeableConcept(o));
			}
		}

	}

  who?: Reference;
  type?: CodeableConcept[];
  communicationMethod?: CodeableConcept[];
  validationStatus?: CodeableConcept;
  validationDate?: string;
  canPushUpdates?: CodeableConcept;
  pushTypeAvailable?: CodeableConcept[];
}

export class VerificationResult extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('target')) {
			this.target = [];
			for (const o of (obj.target instanceof Array ? obj.target : [])) {
				this.target.push(new Reference(o));
			}
		}

		if (obj.hasOwnProperty('targetLocation')) {
			this.targetLocation = [];
			for (const o of (obj.targetLocation instanceof Array ? obj.targetLocation : [])) {
				this.targetLocation.push(o);
			}
		}

		if (obj.hasOwnProperty('need')) {
			this.need = obj.need;
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('statusDate')) {
			this.statusDate = obj.statusDate;
		}

		if (obj.hasOwnProperty('validationType')) {
			this.validationType = obj.validationType;
		}

		if (obj.hasOwnProperty('validationProcess')) {
			this.validationProcess = [];
			for (const o of (obj.validationProcess instanceof Array ? obj.validationProcess : [])) {
				this.validationProcess.push(new CodeableConcept(o));
			}
		}

		if (obj.hasOwnProperty('frequency')) {
			this.frequency = obj.frequency;
		}

		if (obj.hasOwnProperty('lastPerformed')) {
			this.lastPerformed = obj.lastPerformed;
		}

		if (obj.hasOwnProperty('nextScheduled')) {
			this.nextScheduled = obj.nextScheduled;
		}

		if (obj.hasOwnProperty('failureAction')) {
			this.failureAction = obj.failureAction;
		}

		if (obj.hasOwnProperty('primarySource')) {
			this.primarySource = [];
			for (const o of (obj.primarySource instanceof Array ? obj.primarySource : [])) {
				this.primarySource.push(new VerificationResultPrimarySource(o));
			}
		}

		if (obj.hasOwnProperty('attestation')) {
			this.attestation = obj.attestation;
		}

		if (obj.hasOwnProperty('validator')) {
			this.validator = [];
			for (const o of (obj.validator instanceof Array ? obj.validator : [])) {
				this.validator.push(new VerificationResultValidator(o));
			}
		}

	}

  resourceType = 'VerificationResult';
  target?: Reference[];
  targetLocation?: string[];
  need?: CodeableConcept;
  status: VerificationResultStatus1;
  statusDate?: string;
  validationType?: CodeableConcept;
  validationProcess?: CodeableConcept[];
  frequency?: Timing;
  lastPerformed?: string;
  nextScheduled?: string;
  failureAction?: CodeableConcept;
  primarySource?: VerificationResultPrimarySource[];
  attestation?: VerificationResultAttestation;
  validator?: VerificationResultValidator[];
}

export class VisionPrescriptionLensSpecificationPrism extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('amount')) {
			this.amount = obj.amount;
		}

		if (obj.hasOwnProperty('base')) {
			this.base = obj.base;
		}

	}

  amount: number;
  base: VisionPrescriptionBase1;
}

export class VisionPrescriptionLensSpecification extends Element {
	constructor(obj?: any) {
		super(obj);

		if (obj.hasOwnProperty('product')) {
			this.product = obj.product;
		}

		if (obj.hasOwnProperty('eye')) {
			this.eye = obj.eye;
		}

		if (obj.hasOwnProperty('sphere')) {
			this.sphere = obj.sphere;
		}

		if (obj.hasOwnProperty('cylinder')) {
			this.cylinder = obj.cylinder;
		}

		if (obj.hasOwnProperty('axis')) {
			this.axis = obj.axis;
		}

		if (obj.hasOwnProperty('prism')) {
			this.prism = [];
			for (const o of (obj.prism instanceof Array ? obj.prism : [])) {
				this.prism.push(new VisionPrescriptionLensSpecificationPrism(o));
			}
		}

		if (obj.hasOwnProperty('add')) {
			this.add = obj.add;
		}

		if (obj.hasOwnProperty('power')) {
			this.power = obj.power;
		}

		if (obj.hasOwnProperty('backCurve')) {
			this.backCurve = obj.backCurve;
		}

		if (obj.hasOwnProperty('diameter')) {
			this.diameter = obj.diameter;
		}

		if (obj.hasOwnProperty('duration')) {
			this.duration = obj.duration;
		}

		if (obj.hasOwnProperty('color')) {
			this.color = obj.color;
		}

		if (obj.hasOwnProperty('brand')) {
			this.brand = obj.brand;
		}

		if (obj.hasOwnProperty('note')) {
			this.note = [];
			for (const o of (obj.note instanceof Array ? obj.note : [])) {
				this.note.push(new Annotation(o));
			}
		}

	}

  product: CodeableConcept;
  eye: VisionPrescriptionEye1;
  sphere?: number;
  cylinder?: number;
  axis?: number;
  prism?: VisionPrescriptionLensSpecificationPrism[];
  add?: number;
  power?: number;
  backCurve?: number;
  diameter?: number;
  duration?: Quantity;
  color?: string;
  brand?: string;
  note?: Annotation[];
}

export class VisionPrescription extends DomainResource {
	constructor(obj?: any) {
		super(obj);
		if (obj.hasOwnProperty('resourceType')) {
			this.resourceType = obj.resourceType;
		}

		if (obj.hasOwnProperty('identifier')) {
			this.identifier = [];
			for (const o of (obj.identifier instanceof Array ? obj.identifier : [])) {
				this.identifier.push(new Identifier(o));
			}
		}

		if (obj.hasOwnProperty('status')) {
			this.status = obj.status;
		}

		if (obj.hasOwnProperty('created')) {
			this.created = obj.created;
		}

		if (obj.hasOwnProperty('patient')) {
			this.patient = obj.patient;
		}

		if (obj.hasOwnProperty('encounter')) {
			this.encounter = obj.encounter;
		}

		if (obj.hasOwnProperty('dateWritten')) {
			this.dateWritten = obj.dateWritten;
		}

		if (obj.hasOwnProperty('prescriber')) {
			this.prescriber = obj.prescriber;
		}

		if (obj.hasOwnProperty('lensSpecification')) {
			this.lensSpecification = [];
			for (const o of (obj.lensSpecification instanceof Array ? obj.lensSpecification : [])) {
				this.lensSpecification.push(new VisionPrescriptionLensSpecification(o));
			}
		}

	}

  resourceType = 'VisionPrescription';
  identifier?: Identifier[];
  status: VisionPrescriptionStatus1;
  created: string;
  patient: Reference;
  encounter?: Reference;
  dateWritten: string;
  prescriber: Reference;
  lensSpecification: VisionPrescriptionLensSpecification[];
}

