import * as IFhir from '../fhirInterfaces';

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

export class Address {
  resourceType = 'Address';
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

export class Period {
  resourceType = 'Period';
  start?: string;
  end?: string;
}

export class Quantity {
  resourceType = 'Quantity';
  value?: number;
  comparator?: QuantityComparator1;
  unit?: string;
  system?: string;
  code?: string;
}

export class Age extends Quantity {
  resourceType = 'Age';
}

export class Annotation {
  resourceType = 'Annotation';
  authorReference?: Reference;
  authorString?: string;
  time?: string;
  text: string;
}

export class Reference implements IFhir.IResourceReference {
  resourceType = 'Reference';
  reference?: string;
  type?: ReferenceType1;
  identifier?: Identifier;
  display?: string;
}

export class Identifier implements IFhir.IIdentifier {
  resourceType = 'Identifier';
  use?: IdentifierUse1;
  type?: CodeableConcept;
  system?: string;
  value?: string;
  period?: Period;
  assigner?: Reference;
}

export class CodeableConcept implements IFhir.ICodeableConcept {
  resourceType = 'CodeableConcept';
  coding?: Coding[];
  text?: string;
}

export class Coding implements IFhir.ICoding {
  resourceType = 'Coding';
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
}

export class Attachment implements IFhir.IAttachment {
  resourceType = 'Attachment';
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
}

export class CodeableReference {
  resourceType = 'CodeableReference';
  concept?: CodeableConcept;
  reference?: Reference;
}

export class ContactDetail implements IFhir.IContactDetail {
  resourceType = 'ContactDetail';
  name?: string;
  telecom?: ContactPoint[];
}

export class ContactPoint implements IFhir.IContactPoint {
  resourceType = 'ContactPoint';
  system?: ContactPointSystem1;
  value?: string;
  use?: ContactPointUse1;
  rank?: number;
  period?: Period;
}

export class Contributor {
  resourceType = 'Contributor';
  type: ContributorType1;
  name: string;
  contact?: ContactDetail[];
}

export class Count extends Quantity {
  resourceType = 'Count';
}

export class DataRequirementSort {
  path: string;
  direction: DataRequirementDirection1;
}

export class DataRequirementDateFilter {
  path?: string;
  searchParam?: string;
  valueDateTime?: string;
  valuePeriod?: Period;
  valueDuration?: Duration;
}

export class DataRequirementCodeFilter {
  path?: string;
  searchParam?: string;
  valueSet?: string;
  code?: Coding[];
}

export class DataRequirement {
  resourceType = 'DataRequirement';
  type: DataRequirementType1;
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
  resourceType = 'Duration';
}

export class Distance extends Quantity {
  resourceType = 'Distance';
}

export class DosageDoseAndRate {
  type?: CodeableConcept;
  doseRange?: Range;
  doseQuantity?: Quantity;
  rateRatio?: Ratio;
  rateRange?: Range;
  rateQuantity?: Quantity;
}

export class Dosage {
  resourceType = 'Dosage';
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

export class TimingRepeat {
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

export class Timing {
  resourceType = 'Timing';
  event?: string[];
  repeat?: TimingRepeat;
  code?: CodeableConcept;
}

export class Range {
  resourceType = 'Range';
  low?: Quantity;
  high?: Quantity;
}

export class Ratio {
  resourceType = 'Ratio';
  numerator?: Quantity;
  denominator?: Quantity;
}

export class ElementDefinitionMapping implements IFhir.IElementDefinitionMapping {
  identity: string;
  language?: string;
  map: string;
  comment?: string;
}

export class ElementDefinitionBinding {
  strength: ElementDefinitionStrength1;
  description?: string;
  valueSet?: string;
}

export class ElementDefinitionConstraint implements IFhir.IElementDefinitionConstraint {
  key: string;
  requirements?: string;
  severity: ElementDefinitionSeverity1;
  human: string;
  expression?: string;
  xpath?: string;
  source?: string;
}

export class ElementDefinitionExample {
  label: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
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
  code: ElementDefinitionCode1;
  profile?: string[];
  targetProfile?: string[];
  aggregation?: ElementDefinitionAggregation1[];
  versioning?: ElementDefinitionVersioning1;
}

export class ElementDefinitionBase {
  path: string;
  min: number;
  max: string;
}

export class ElementDefinitionSlicingDiscriminator {
  type: ElementDefinitionType1;
  path: string;
}

export class ElementDefinitionSlicing implements IFhir.IElementDefinitionSlicing {
  discriminator?: ElementDefinitionSlicingDiscriminator[];
  description?: string;
  ordered?: boolean;
  rules: ElementDefinitionRules1;
}

export class ElementDefinition implements IFhir.IElementDefinition {
  resourceType = 'ElementDefinition';
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
  resourceType = 'HumanName';
  use?: HumanNameUse1;
  text?: string;
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  period?: Period;
}

export class Money {
  resourceType = 'Money';
  value?: number;
  currency?: string;
}

export class RatioRange {
  resourceType = 'RatioRange';
  lowNumerator?: Quantity;
  highNumerator?: Quantity;
  denominator?: Quantity;
}

export class SampledData {
  resourceType = 'SampledData';
  origin: Quantity;
  period: number;
  factor?: number;
  lowerLimit?: number;
  upperLimit?: number;
  dimensions: number;
  data?: string;
}

export class Signature {
  resourceType = 'Signature';
  type: Coding[];
  when: string;
  who: Reference;
  onBehalfOf?: Reference;
  targetFormat?: string;
  sigFormat?: string;
  data?: string;
}

export class Expression {
  resourceType = 'Expression';
  description?: string;
  name?: string;
  language: ExpressionLanguage1;
  expression?: string;
  reference?: string;
}

export class ParameterDefinition {
  resourceType = 'ParameterDefinition';
  name?: string;
  use: ParameterDefinitionUse1;
  min?: number;
  max?: string;
  documentation?: string;
  type: ParameterDefinitionType1;
  profile?: string;
}

export class RelatedArtifact {
  resourceType = 'RelatedArtifact';
  type: RelatedArtifactType1;
  label?: string;
  display?: string;
  citation?: string;
  url?: string;
  document?: Attachment;
  resource?: string;
}

export class TriggerDefinition {
  resourceType = 'TriggerDefinition';
  type: TriggerDefinitionType1;
  name?: string;
  timingTiming?: Timing;
  timingReference?: Reference;
  timingDate?: string;
  timingDateTime?: string;
  data?: DataRequirement[];
  condition?: Expression;
}

export class UsageContext {
  resourceType = 'UsageContext';
  code: Coding;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueReference?: Reference;
}

export class Extension implements IFhir.IExtension {
  resourceType = 'Extension';
  url: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
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

export class MarketingStatus {
  resourceType = 'MarketingStatus';
  country?: CodeableConcept;
  jurisdiction?: CodeableConcept;
  status: CodeableConcept;
  dateRange?: Period;
  restoreDate?: string;
}

export class Meta implements IFhir.IMeta {
  resourceType = 'Meta';
  versionId?: string;
  lastUpdated?: string;
  source?: string;
  profile?: string[];
  security?: Coding[];
  tag?: Coding[];
}

export class Narrative {
  resourceType = 'Narrative';
  status: NarrativeStatus1;
  div: string;
}

export class Population {
  resourceType = 'Population';
  ageRange?: Range;
  ageCodeableConcept?: CodeableConcept;
  gender?: CodeableConcept;
  race?: CodeableConcept;
  physiologicalCondition?: CodeableConcept;
}

export class ProdCharacteristic {
  resourceType = 'ProdCharacteristic';
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

export class ProductShelfLife {
  resourceType = 'ProductShelfLife';
  identifier?: Identifier;
  type: CodeableConcept;
  period: Quantity;
  specialPrecautionsForStorage?: CodeableConcept[];
}

export class MoneyQuantity extends Quantity {
  resourceType = 'MoneyQuantity';
}

export class SimpleQuantity extends Quantity {
  resourceType = 'SimpleQuantity';
  comparator: QuantityComparator1;
}

export class Resource extends DataRequirementSort implements IFhir.IResource {
  resourceType = 'Resource';
  id?: string;
  meta?: Meta;
  implicitRules?: string;
  language?: string;
}

export class AccountGuarantor {
  party: Reference;
  onHold?: boolean;
  period?: Period;
}

export class AccountCoverage {
  coverage: Reference;
  priority?: number;
}

export class DomainResource extends Resource {
  resourceType = 'DomainResource';
  text?: Narrative;
  contained?: Resource[];
  extension?: Extension[];
  modifierExtension?: Extension[];
}

export class Account extends DomainResource {
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

export class ActivityDefinitionDynamicValue {
  path: string;
  expression: Expression;
}

export class ActivityDefinitionParticipant {
  type: ActivityDefinitionType1;
  role?: CodeableConcept;
}

export class ActivityDefinition extends DomainResource {
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

export class AdministrableProductDefinitionRouteOfAdministrationTargetSpeciesWithdrawalPeriod {
  tissue: CodeableConcept;
  value: Quantity;
  supportingInformation?: string;
}

export class AdministrableProductDefinitionRouteOfAdministrationTargetSpecies {
  code: CodeableConcept;
  withdrawalPeriod?: AdministrableProductDefinitionRouteOfAdministrationTargetSpeciesWithdrawalPeriod[];
}

export class AdministrableProductDefinitionRouteOfAdministration {
  code: CodeableConcept;
  firstDose?: Quantity;
  maxSingleDose?: Quantity;
  maxDosePerDay?: Quantity;
  maxDosePerTreatmentPeriod?: Ratio;
  maxTreatmentPeriod?: Duration;
  targetSpecies?: AdministrableProductDefinitionRouteOfAdministrationTargetSpecies[];
}

export class AdministrableProductDefinitionProperty {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
  status?: CodeableConcept;
}

export class AdministrableProductDefinition extends DomainResource {
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

export class AdverseEventSuspectEntityCausality {
  assessment?: CodeableConcept;
  productRelatedness?: string;
  author?: Reference;
  method?: CodeableConcept;
}

export class AdverseEventSuspectEntity {
  instance: Reference;
  causality?: AdverseEventSuspectEntityCausality[];
}

export class AdverseEvent extends DomainResource {
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

export class AllergyIntoleranceReaction {
  substance?: CodeableConcept;
  manifestation: CodeableConcept[];
  description?: string;
  onset?: string;
  severity?: AllergyIntoleranceSeverity1;
  exposureRoute?: CodeableConcept;
  note?: Annotation[];
}

export class AllergyIntolerance extends DomainResource {
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

export class AppointmentParticipant {
  type?: CodeableConcept[];
  actor?: Reference;
  required?: AppointmentRequired1;
  status: AppointmentStatus2;
  period?: Period;
}

export class Appointment extends DomainResource {
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

export class AuditEventEntityDetail {
  type: string;
  valueString?: string;
  valueBase64Binary?: string;
}

export class AuditEventEntity {
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

export class AuditEventSource {
  site?: string;
  observer: Reference;
  type?: Coding[];
}

export class AuditEventAgentNetwork implements IFhir.INetworkComponent {
  address?: string;
  type?: AuditEventType1;
}

export class AuditEventAgent implements IFhir.IAgentComponent {
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
  resourceType = 'Basic';
  identifier?: Identifier[];
  code: CodeableConcept;
  subject?: Reference;
  created?: string;
  author?: Reference;
}

export class Binary extends Resource {
  resourceType = 'Binary';
  contentType: string;
  securityContext?: Reference;
  data?: string;
}

export class BiologicallyDerivedProductStorage {
  description?: string;
  temperature?: number;
  scale?: BiologicallyDerivedProductScale1;
  duration?: Period;
}

export class BiologicallyDerivedProductManipulation {
  description?: string;
  timeDateTime?: string;
  timePeriod?: Period;
}

export class BiologicallyDerivedProductProcessing {
  description?: string;
  procedure?: CodeableConcept;
  additive?: Reference;
  timeDateTime?: string;
  timePeriod?: Period;
}

export class BiologicallyDerivedProductCollection {
  collector?: Reference;
  source?: Reference;
  collectedDateTime?: string;
  collectedPeriod?: Period;
}

export class BiologicallyDerivedProduct extends DomainResource {
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

export class BundleEntryResponse implements IFhir.IBundleEntryResponse {
  status: string;
  location?: string;
  etag?: string;
  lastModified?: string;
  outcome?: Resource;
}

export class BundleEntryRequest {
  method: BundleMethod1;
  url: string;
  ifNoneMatch?: string;
  ifModifiedSince?: string;
  ifMatch?: string;
  ifNoneExist?: string;
}

export class BundleEntrySearch {
  mode?: BundleMode1;
  score?: number;
}

export class BundleEntry implements IFhir.IBundleEntry {
  link?: BundleLink[];
  fullUrl?: string;
  resource?: Resource;
  search?: BundleEntrySearch;
  request?: BundleEntryRequest;
  response?: BundleEntryResponse;
}

export class BundleLink {
  relation: string;
  url: string;
}

export class Bundle extends Resource implements IFhir.IBundle {
  resourceType = 'Bundle';
  identifier?: Identifier;
  type: BundleType1;
  timestamp?: string;
  total?: number;
  link?: BundleLink[];
  entry?: BundleEntry[];
  signature?: Signature;
}

export class CapabilityStatementDocument {
  mode: CapabilityStatementMode3;
  documentation?: string;
  profile: string;
}

export class CapabilityStatementMessagingSupportedMessage {
  mode: CapabilityStatementMode2;
  definition: string;
}

export class CapabilityStatementMessagingEndpoint {
  protocol: Coding;
  address: string;
}

export class CapabilityStatementMessaging {
  endpoint?: CapabilityStatementMessagingEndpoint[];
  reliableCache?: number;
  documentation?: string;
  supportedMessage?: CapabilityStatementMessagingSupportedMessage[];
}

export class CapabilityStatementRestInteraction {
  code: CapabilityStatementCode2;
  documentation?: string;
}

export class CapabilityStatementRestResourceOperation {
  name: string;
  definition: string;
  documentation?: string;
}

export class CapabilityStatementRestResourceSearchParam {
  name: string;
  definition?: string;
  type: CapabilityStatementType2;
  documentation?: string;
}

export class CapabilityStatementRestResourceInteraction {
  code: CapabilityStatementCode1;
  documentation?: string;
}

export class CapabilityStatementRestResource {
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

export class CapabilityStatementRestSecurity {
  cors?: boolean;
  service?: CodeableConcept[];
  description?: string;
}

export class CapabilityStatementRest {
  mode: CapabilityStatementMode1;
  documentation?: string;
  security?: CapabilityStatementRestSecurity;
  resource?: CapabilityStatementRestResource[];
  interaction?: CapabilityStatementRestInteraction[];
  searchParam?: CapabilityStatementRestResourceSearchParam[];
  operation?: CapabilityStatementRestResourceOperation[];
  compartment?: string[];
}

export class CapabilityStatementImplementation {
  description: string;
  url?: string;
  custodian?: Reference;
}

export class CapabilityStatementSoftware {
  name: string;
  version?: string;
  releaseDate?: string;
}

export class CapabilityStatement extends DomainResource implements IFhir.ICapabilityStatement {
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

export class CarePlanActivityDetail {
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

export class CarePlanActivity {
  outcomeCodeableConcept?: CodeableConcept[];
  outcomeReference?: Reference[];
  progress?: Annotation[];
  reference?: Reference;
  detail?: CarePlanActivityDetail;
}

export class CarePlan extends DomainResource {
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

export class CareTeamParticipant {
  role?: CodeableConcept[];
  member?: Reference;
  onBehalfOf?: Reference;
  period?: Period;
}

export class CareTeam extends DomainResource {
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

export class CatalogEntryRelatedEntry {
  relationtype: CatalogEntryRelationtype1;
  item: Reference;
}

export class CatalogEntry extends DomainResource {
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

export class ChargeItemPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export class ChargeItem extends DomainResource {
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

export class ChargeItemDefinitionPropertyGroupPriceComponent {
  type: ChargeItemDefinitionType1;
  code?: CodeableConcept;
  factor?: number;
  amount?: Money;
}

export class ChargeItemDefinitionPropertyGroup {
  applicability?: ChargeItemDefinitionApplicability[];
  priceComponent?: ChargeItemDefinitionPropertyGroupPriceComponent[];
}

export class ChargeItemDefinitionApplicability {
  description?: string;
  language?: string;
  expression?: string;
}

export class ChargeItemDefinition extends DomainResource {
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

export class CitationCitedArtifactContributorshipSummary {
  type?: CodeableConcept;
  style?: CodeableConcept;
  source?: CodeableConcept;
  value: string;
}

export class CitationCitedArtifactContributorshipEntryContributionInstance {
  type: CodeableConcept;
  time?: string;
}

export class CitationCitedArtifactContributorshipEntryAffiliationInfo {
  affiliation?: string;
  role?: string;
  identifier?: Identifier[];
}

export class CitationCitedArtifactContributorshipEntry {
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

export class CitationCitedArtifactContributorship {
  complete?: boolean;
  entry?: CitationCitedArtifactContributorshipEntry[];
  summary?: CitationCitedArtifactContributorshipSummary[];
}

export class CitationCitedArtifactClassificationWhoClassified {
  person?: Reference;
  organization?: Reference;
  publisher?: Reference;
  classifierCopyright?: string;
  freeToShare?: boolean;
}

export class CitationCitedArtifactClassification {
  type?: CodeableConcept;
  classifier?: CodeableConcept[];
  whoClassified?: CitationCitedArtifactClassificationWhoClassified;
}

export class CitationCitedArtifactWebLocation {
  type?: CodeableConcept;
  url?: string;
}

export class CitationCitedArtifactPublicationFormPeriodicReleaseDateOfPublication {
  date?: string;
  year?: string;
  month?: string;
  day?: string;
  season?: string;
  text?: string;
}

export class CitationCitedArtifactPublicationFormPeriodicRelease {
  citedMedium?: CodeableConcept;
  volume?: string;
  issue?: string;
  dateOfPublication?: CitationCitedArtifactPublicationFormPeriodicReleaseDateOfPublication;
}

export class CitationCitedArtifactPublicationFormPublishedIn {
  type?: CodeableConcept;
  identifier?: Identifier[];
  title?: string;
  publisher?: Reference;
  publisherLocation?: string;
}

export class CitationCitedArtifactPublicationForm {
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

export class CitationCitedArtifactRelatesTo {
  relationshipType: CodeableConcept;
  targetClassifier?: CodeableConcept[];
  targetUri?: string;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
  targetAttachment?: Attachment;
}

export class CitationCitedArtifactPart {
  type?: CodeableConcept;
  value?: string;
  baseCitation?: Reference;
}

export class CitationCitedArtifactAbstract {
  type?: CodeableConcept;
  language?: CodeableConcept;
  text: string;
  copyright?: string;
}

export class CitationCitedArtifactTitle {
  type?: CodeableConcept[];
  language?: CodeableConcept;
  text: string;
}

export class CitationCitedArtifactStatusDate {
  activity: CodeableConcept;
  actual?: boolean;
  period: Period;
}

export class CitationCitedArtifactVersion {
  value: string;
  baseCitation?: Reference;
}

export class CitationCitedArtifact {
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

export class CitationRelatesTo {
  relationshipType: CodeableConcept;
  targetClassifier?: CodeableConcept[];
  targetUri?: string;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
  targetAttachment?: Attachment;
}

export class CitationStatusDate {
  activity: CodeableConcept;
  actual?: boolean;
  period: Period;
}

export class CitationClassification {
  type?: CodeableConcept;
  classifier?: CodeableConcept[];
}

export class CitationSummary {
  style?: CodeableConcept;
  text: string;
}

export class Citation extends DomainResource {
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

export class ClaimItemDetailSubDetail {
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

export class ClaimItemDetail {
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

export class ClaimItem {
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

export class ClaimAccident {
  date: string;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}

export class ClaimInsurance {
  sequence: number;
  focal: boolean;
  identifier?: Identifier;
  coverage: Reference;
  businessArrangement?: string;
  preAuthRef?: string[];
  claimResponse?: Reference;
}

export class ClaimProcedure {
  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export class ClaimDiagnosis {
  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export class ClaimSupportingInfo {
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

export class ClaimCareTeam {
  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export class ClaimPayee {
  type: CodeableConcept;
  party?: Reference;
}

export class ClaimRelated {
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}

export class Claim extends DomainResource {
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

export class ClaimResponseError {
  itemSequence?: number;
  detailSequence?: number;
  subDetailSequence?: number;
  code: CodeableConcept;
}

export class ClaimResponseInsurance {
  sequence: number;
  focal: boolean;
  coverage: Reference;
  businessArrangement?: string;
  claimResponse?: Reference;
}

export class ClaimResponseProcessNote {
  number?: number;
  type?: ClaimResponseType1;
  text: string;
  language?: CodeableConcept;
}

export class ClaimResponsePayment {
  type: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: string;
  amount: Money;
  identifier?: Identifier;
}

export class ClaimResponseTotal {
  category: CodeableConcept;
  amount: Money;
}

export class ClaimResponseAddItemDetailSubDetail {
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
}

export class ClaimResponseAddItemDetail {
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

export class ClaimResponseAddItem {
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

export class ClaimResponseItemDetailSubDetail {
  subDetailSequence: number;
  noteNumber?: number[];
  adjudication?: ClaimResponseItemAdjudication[];
}

export class ClaimResponseItemDetail {
  detailSequence: number;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  subDetail?: ClaimResponseItemDetailSubDetail[];
}

export class ClaimResponseItemAdjudication {
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: number;
}

export class ClaimResponseItem {
  itemSequence: number;
  noteNumber?: number[];
  adjudication: ClaimResponseItemAdjudication[];
  detail?: ClaimResponseItemDetail[];
}

export class ClaimResponse extends DomainResource {
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

export class ClinicalImpressionFinding {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  basis?: string;
}

export class ClinicalImpressionInvestigation {
  code: CodeableConcept;
  item?: Reference[];
}

export class ClinicalImpression extends DomainResource {
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

export class ClinicalUseDefinitionWarning {
  description?: string;
  code?: CodeableConcept;
}

export class ClinicalUseDefinitionUndesirableEffect {
  symptomConditionEffect?: CodeableReference;
  classification?: CodeableConcept;
  frequencyOfOccurrence?: CodeableConcept;
}

export class ClinicalUseDefinitionInteractionInteractant {
  itemReference?: Reference;
  itemCodeableConcept?: CodeableConcept;
}

export class ClinicalUseDefinitionInteraction {
  interactant?: ClinicalUseDefinitionInteractionInteractant[];
  type?: CodeableConcept;
  effect?: CodeableReference;
  incidence?: CodeableConcept;
  management?: CodeableConcept[];
}

export class ClinicalUseDefinitionIndication {
  diseaseSymptomProcedure?: CodeableReference;
  diseaseStatus?: CodeableReference;
  comorbidity?: CodeableReference[];
  intendedEffect?: CodeableReference;
  durationRange?: Range;
  durationString?: string;
  undesirableEffect?: Reference[];
  otherTherapy?: ClinicalUseDefinitionContraindicationOtherTherapy[];
}

export class ClinicalUseDefinitionContraindicationOtherTherapy {
  relationshipType: CodeableConcept;
  therapy: CodeableReference;
}

export class ClinicalUseDefinitionContraindication {
  diseaseSymptomProcedure?: CodeableReference;
  diseaseStatus?: CodeableReference;
  comorbidity?: CodeableReference[];
  indication?: Reference[];
  otherTherapy?: ClinicalUseDefinitionContraindicationOtherTherapy[];
}

export class ClinicalUseDefinition extends DomainResource {
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
  code: string;
  valueCode?: string;
  valueCoding?: Coding;
  valueString?: string;
  valueInteger?: number;
  valueBoolean?: boolean;
  valueDateTime?: string;
  valueDecimal?: number;
}

export class CodeSystemConceptDesignation {
  language?: string;
  use?: Coding;
  value: string;
}

export class CodeSystemConcept implements IFhir.ICodeSystemConcept {
  code: string;
  display?: string;
  definition?: string;
  designation?: CodeSystemConceptDesignation[];
  property?: CodeSystemConceptProperty[];
  concept?: CodeSystemConcept[];
}

export class CodeSystemProperty {
  code: string;
  uri?: string;
  description?: string;
  type: CodeSystemType1;
}

export class CodeSystemFilter {
  code: string;
  description?: string;
  operator: CodeSystemOperator1[];
  value: string;
}

export class CodeSystem extends DomainResource implements IFhir.ICodeSystem {
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

export class CommunicationPayload {
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class Communication extends DomainResource {
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

export class CommunicationRequestPayload {
  contentString?: string;
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class CommunicationRequest extends DomainResource {
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

export class CompartmentDefinitionResource {
  code: CompartmentDefinitionCode2;
  param?: string[];
  documentation?: string;
}

export class CompartmentDefinition extends DomainResource {
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

export class CompositionSection {
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

export class CompositionEvent {
  code?: CodeableConcept[];
  period?: Period;
  detail?: Reference[];
}

export class CompositionRelatesTo {
  code: CompositionCode1;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}

export class CompositionAttester {
  mode: CompositionMode1;
  time?: string;
  party?: Reference;
}

export class Composition extends DomainResource {
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

export class ConceptMapGroupUnmapped {
  mode: ConceptMapMode1;
  code?: string;
  display?: string;
  url?: string;
}

export class ConceptMapGroupElementTargetDependsOn {
  property: string;
  system?: string;
  value: string;
  display?: string;
}

export class ConceptMapGroupElementTarget {
  code?: string;
  display?: string;
  equivalence: ConceptMapEquivalence1;
  comment?: string;
  dependsOn?: ConceptMapGroupElementTargetDependsOn[];
  product?: ConceptMapGroupElementTargetDependsOn[];
}

export class ConceptMapGroupElement {
  code?: string;
  display?: string;
  target?: ConceptMapGroupElementTarget[];
}

export class ConceptMapGroup {
  source?: string;
  sourceVersion?: string;
  target?: string;
  targetVersion?: string;
  element: ConceptMapGroupElement[];
  unmapped?: ConceptMapGroupUnmapped;
}

export class ConceptMap extends DomainResource {
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

export class ConditionEvidence {
  code?: CodeableConcept[];
  detail?: Reference[];
}

export class ConditionStage {
  summary?: CodeableConcept;
  assessment?: Reference[];
  type?: CodeableConcept;
}

export class Condition extends DomainResource {
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

export class ConsentProvisionData {
  meaning: ConsentMeaning1;
  reference: Reference;
}

export class ConsentProvisionActor {
  role: CodeableConcept;
  reference: Reference;
}

export class ConsentProvision {
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

export class ConsentVerification {
  verified: boolean;
  verifiedWith?: Reference;
  verificationDate?: string;
}

export class ConsentPolicy {
  authority?: string;
  uri?: string;
}

export class Consent extends DomainResource {
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

export class ContractRule {
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractLegal {
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractFriendly {
  contentAttachment?: Attachment;
  contentReference?: Reference;
}

export class ContractSigner {
  type: Coding;
  party: Reference;
  signature: Signature[];
}

export class ContractTermActionSubject {
  reference: Reference[];
  role?: CodeableConcept;
}

export class ContractTermAction {
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

export class ContractTermAssetValuedItem {
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

export class ContractTermAssetContext {
  reference?: Reference;
  code?: CodeableConcept[];
  text?: string;
}

export class ContractTermAsset {
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

export class ContractTermOfferAnswer {
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

export class ContractTermOfferParty {
  reference: Reference[];
  role: CodeableConcept;
}

export class ContractTermOffer {
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

export class ContractTermSecurityLabel {
  number?: number[];
  classification: Coding;
  category?: Coding[];
  control?: Coding[];
}

export class ContractTerm {
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

export class ContractContentDefinition {
  type: CodeableConcept;
  subType?: CodeableConcept;
  publisher?: Reference;
  publicationDate?: string;
  publicationStatus: ContractPublicationStatus1;
  copyright?: string;
}

export class Contract extends DomainResource {
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

export class CoverageCostToBeneficiaryException {
  type: CodeableConcept;
  period?: Period;
}

export class CoverageCostToBeneficiary {
  type?: CodeableConcept;
  valueQuantity?: Quantity;
  valueMoney?: Money;
  exception?: CoverageCostToBeneficiaryException[];
}

export class CoverageClass {
  type: CodeableConcept;
  value: string;
  name?: string;
}

export class Coverage extends DomainResource {
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

export class CoverageEligibilityRequestItemDiagnosis {
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
}

export class CoverageEligibilityRequestItem {
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

export class CoverageEligibilityRequestInsurance {
  focal?: boolean;
  coverage: Reference;
  businessArrangement?: string;
}

export class CoverageEligibilityRequestSupportingInfo {
  sequence: number;
  information: Reference;
  appliesToAll?: boolean;
}

export class CoverageEligibilityRequest extends DomainResource {
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

export class CoverageEligibilityResponseError {
  code: CodeableConcept;
}

export class CoverageEligibilityResponseInsuranceItemBenefit {
  type: CodeableConcept;
  allowedUnsignedInt?: number;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: number;
  usedString?: string;
  usedMoney?: Money;
}

export class CoverageEligibilityResponseInsuranceItem {
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

export class CoverageEligibilityResponseInsurance {
  coverage: Reference;
  inforce?: boolean;
  benefitPeriod?: Period;
  item?: CoverageEligibilityResponseInsuranceItem[];
}

export class CoverageEligibilityResponse extends DomainResource {
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

export class DetectedIssueMitigation {
  action: CodeableConcept;
  date?: string;
  author?: Reference;
}

export class DetectedIssueEvidence {
  code?: CodeableConcept[];
  detail?: Reference[];
}

export class DetectedIssue extends DomainResource {
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

export class DeviceProperty {
  type: CodeableConcept;
  valueQuantity?: Quantity[];
  valueCode?: CodeableConcept[];
}

export class DeviceVersion {
  type?: CodeableConcept;
  component?: Identifier;
  value: string;
}

export class DeviceSpecialization {
  systemType: CodeableConcept;
  version?: string;
}

export class DeviceDeviceName {
  name: string;
  type: DeviceType1;
}

export class DeviceUdiCarrier {
  deviceIdentifier?: string;
  issuer?: string;
  jurisdiction?: string;
  carrierAIDC?: string;
  carrierHRF?: string;
  entryType?: DeviceEntryType1;
}

export class Device extends DomainResource {
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

export class DeviceDefinitionMaterial {
  substance: CodeableConcept;
  alternate?: boolean;
  allergenicIndicator?: boolean;
}

export class DeviceDefinitionProperty {
  type: CodeableConcept;
  valueQuantity?: Quantity[];
  valueCode?: CodeableConcept[];
}

export class DeviceDefinitionCapability {
  type: CodeableConcept;
  description?: CodeableConcept[];
}

export class DeviceDefinitionSpecialization {
  systemType: string;
  version?: string;
}

export class DeviceDefinitionDeviceName {
  name: string;
  type: DeviceDefinitionType1;
}

export class DeviceDefinitionUdiDeviceIdentifier {
  deviceIdentifier: string;
  issuer: string;
  jurisdiction: string;
}

export class DeviceDefinition extends DomainResource {
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

export class DeviceMetricCalibration {
  type?: DeviceMetricType1;
  state?: DeviceMetricState1;
  time?: string;
}

export class DeviceMetric extends DomainResource {
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

export class DeviceRequestParameter {
  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}

export class DeviceRequest extends DomainResource {
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

export class DiagnosticReportMedia {
  comment?: string;
  link: Reference;
}

export class DiagnosticReport extends DomainResource {
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

export class DocumentManifestRelated {
  identifier?: Identifier;
  ref?: Reference;
}

export class DocumentManifest extends DomainResource {
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

export class DocumentReferenceContext {
  encounter?: Reference[];
  event?: CodeableConcept[];
  period?: Period;
  facilityType?: CodeableConcept;
  practiceSetting?: CodeableConcept;
  sourcePatientInfo?: Reference;
  related?: Reference[];
}

export class DocumentReferenceContent {
  attachment: Attachment;
  format?: Coding;
}

export class DocumentReferenceRelatesTo {
  code: DocumentReferenceCode1;
  target: Reference;
}

export class DocumentReference extends DomainResource implements IFhir.IDocumentReference {
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

export class EncounterLocation {
  location: Reference;
  status?: EncounterStatus3;
  physicalType?: CodeableConcept;
  period?: Period;
}

export class EncounterHospitalization {
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

export class EncounterDiagnosis {
  condition: Reference;
  use?: CodeableConcept;
  rank?: number;
}

export class EncounterParticipant {
  type?: CodeableConcept[];
  period?: Period;
  individual?: Reference;
}

export class EncounterClassHistory {
  class: Coding;
  period: Period;
}

export class EncounterStatusHistory {
  status: EncounterStatus2;
  period: Period;
}

export class Encounter extends DomainResource {
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

export class EpisodeOfCareDiagnosis {
  condition: Reference;
  role?: CodeableConcept;
  rank?: number;
}

export class EpisodeOfCareStatusHistory {
  status: EpisodeOfCareStatus2;
  period: Period;
}

export class EpisodeOfCare extends DomainResource {
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

export class EvidenceCertainty {
  description?: string;
  note?: Annotation[];
  type?: CodeableConcept;
  rating?: CodeableConcept;
  rater?: string;
  subcomponent?: EvidenceCertainty[];
}

export class EvidenceStatisticModelCharacteristicVariable {
  variableDefinition: Reference;
  handling?: EvidenceHandling1;
  valueCategory?: CodeableConcept[];
  valueQuantity?: Quantity[];
  valueRange?: Range[];
}

export class EvidenceStatisticModelCharacteristic {
  code: CodeableConcept;
  value?: Quantity;
  variable?: EvidenceStatisticModelCharacteristicVariable[];
  attributeEstimate?: EvidenceStatisticAttributeEstimate[];
}

export class EvidenceStatisticAttributeEstimate {
  description?: string;
  note?: Annotation[];
  type?: CodeableConcept;
  quantity?: Quantity;
  level?: number;
  range?: Range;
  attributeEstimate?: EvidenceStatisticAttributeEstimate[];
}

export class EvidenceStatisticSampleSize {
  description?: string;
  note?: Annotation[];
  numberOfStudies?: number;
  numberOfParticipants?: number;
  knownDataCount?: number;
}

export class EvidenceStatistic {
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

export class EvidenceVariableDefinition {
  description?: string;
  note?: Annotation[];
  variableRole: CodeableConcept;
  observed?: Reference;
  intended?: Reference;
  directnessMatch?: CodeableConcept;
}

export class Evidence extends DomainResource {
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

export class EvidenceReportSection {
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

export class EvidenceReportRelatesTo {
  code: EvidenceReportCode1;
  targetIdentifier?: Identifier;
  targetReference?: Reference;
}

export class EvidenceReportSubjectCharacteristic {
  code: CodeableConcept;
  valueReference?: Reference;
  valueCodeableConcept?: CodeableConcept;
  valueBoolean?: boolean;
  valueQuantity?: Quantity;
  valueRange?: Range;
  exclude?: boolean;
  period?: Period;
}

export class EvidenceReportSubject {
  characteristic?: EvidenceReportSubjectCharacteristic[];
  note?: Annotation[];
}

export class EvidenceReport extends DomainResource {
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

export class EvidenceVariableCategory {
  name?: string;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
}

export class EvidenceVariableCharacteristicTimeFromStart {
  description?: string;
  quantity?: Quantity;
  range?: Range;
  note?: Annotation[];
}

export class EvidenceVariableCharacteristic {
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

export class ExampleScenarioProcessStepAlternative {
  title: string;
  description?: string;
  step?: ExampleScenarioProcessStep[];
}

export class ExampleScenarioProcessStepOperation {
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

export class ExampleScenarioProcessStep {
  process?: ExampleScenarioProcess[];
  pause?: boolean;
  operation?: ExampleScenarioProcessStepOperation;
  alternative?: ExampleScenarioProcessStepAlternative[];
}

export class ExampleScenarioProcess {
  title: string;
  description?: string;
  preConditions?: string;
  postConditions?: string;
  step?: ExampleScenarioProcessStep[];
}

export class ExampleScenarioInstanceContainedInstance {
  resourceId: string;
  versionId?: string;
}

export class ExampleScenarioInstanceVersion {
  versionId: string;
  description: string;
}

export class ExampleScenarioInstance {
  resourceId: string;
  resourceType: ExampleScenarioResourceType1;
  name?: string;
  description?: string;
  version?: ExampleScenarioInstanceVersion[];
  containedInstance?: ExampleScenarioInstanceContainedInstance[];
}

export class ExampleScenarioActor {
  actorId: string;
  type: ExampleScenarioType1;
  name?: string;
  description?: string;
}

export class ExampleScenario extends DomainResource {
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

export class ExplanationOfBenefitBenefitBalanceFinancial {
  type: CodeableConcept;
  allowedUnsignedInt?: number;
  allowedString?: string;
  allowedMoney?: Money;
  usedUnsignedInt?: number;
  usedMoney?: Money;
}

export class ExplanationOfBenefitBenefitBalance {
  category: CodeableConcept;
  excluded?: boolean;
  name?: string;
  description?: string;
  network?: CodeableConcept;
  unit?: CodeableConcept;
  term?: CodeableConcept;
  financial?: ExplanationOfBenefitBenefitBalanceFinancial[];
}

export class ExplanationOfBenefitProcessNote {
  number?: number;
  type?: ExplanationOfBenefitType1;
  text?: string;
  language?: CodeableConcept;
}

export class ExplanationOfBenefitPayment {
  type?: CodeableConcept;
  adjustment?: Money;
  adjustmentReason?: CodeableConcept;
  date?: string;
  amount?: Money;
  identifier?: Identifier;
}

export class ExplanationOfBenefitTotal {
  category: CodeableConcept;
  amount: Money;
}

export class ExplanationOfBenefitAddItemDetailSubDetail {
  productOrService: CodeableConcept;
  modifier?: CodeableConcept[];
  quantity?: Quantity;
  unitPrice?: Money;
  factor?: number;
  net?: Money;
  noteNumber?: number[];
  adjudication?: ExplanationOfBenefitItemAdjudication[];
}

export class ExplanationOfBenefitAddItemDetail {
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

export class ExplanationOfBenefitAddItem {
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

export class ExplanationOfBenefitItemDetailSubDetail {
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

export class ExplanationOfBenefitItemDetail {
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

export class ExplanationOfBenefitItemAdjudication {
  category: CodeableConcept;
  reason?: CodeableConcept;
  amount?: Money;
  value?: number;
}

export class ExplanationOfBenefitItem {
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

export class ExplanationOfBenefitAccident {
  date?: string;
  type?: CodeableConcept;
  locationAddress?: Address;
  locationReference?: Reference;
}

export class ExplanationOfBenefitInsurance {
  focal: boolean;
  coverage: Reference;
  preAuthRef?: string[];
}

export class ExplanationOfBenefitProcedure {
  sequence: number;
  type?: CodeableConcept[];
  date?: string;
  procedureCodeableConcept?: CodeableConcept;
  procedureReference?: Reference;
  udi?: Reference[];
}

export class ExplanationOfBenefitDiagnosis {
  sequence: number;
  diagnosisCodeableConcept?: CodeableConcept;
  diagnosisReference?: Reference;
  type?: CodeableConcept[];
  onAdmission?: CodeableConcept;
  packageCode?: CodeableConcept;
}

export class ExplanationOfBenefitSupportingInfo {
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

export class ExplanationOfBenefitCareTeam {
  sequence: number;
  provider: Reference;
  responsible?: boolean;
  role?: CodeableConcept;
  qualification?: CodeableConcept;
}

export class ExplanationOfBenefitPayee {
  type?: CodeableConcept;
  party?: Reference;
}

export class ExplanationOfBenefitRelated {
  claim?: Reference;
  relationship?: CodeableConcept;
  reference?: Identifier;
}

export class ExplanationOfBenefit extends DomainResource {
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

export class FamilyMemberHistoryCondition {
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

export class GoalTarget {
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

export class GraphDefinitionLinkTargetCompartment {
  use: GraphDefinitionUse1;
  code: GraphDefinitionCode1;
  rule: GraphDefinitionRule1;
  expression?: string;
  description?: string;
}

export class GraphDefinitionLinkTarget {
  type: GraphDefinitionType1;
  params?: string;
  profile?: string;
  compartment?: GraphDefinitionLinkTargetCompartment[];
  link?: GraphDefinitionLink[];
}

export class GraphDefinitionLink {
  path?: string;
  sliceName?: string;
  min?: number;
  max?: string;
  description?: string;
  target?: GraphDefinitionLinkTarget[];
}

export class GraphDefinition extends DomainResource {
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

export class GroupMember {
  entity: Reference;
  period?: Period;
  inactive?: boolean;
}

export class GroupCharacteristic {
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

export class HealthcareServiceNotAvailable {
  description: string;
  during?: Period;
}

export class HealthcareServiceAvailableTime {
  daysOfWeek?: HealthcareServiceDaysOfWeek1[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export class HealthcareServiceEligibility {
  code?: CodeableConcept;
  comment?: string;
}

export class HealthcareService extends DomainResource {
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

export class ImagingStudySeriesInstance {
  uid: string;
  sopClass: Coding;
  number?: number;
  title?: string;
}

export class ImagingStudySeriesPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export class ImagingStudySeries {
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

export class ImmunizationProtocolApplied {
  series?: string;
  authority?: Reference;
  targetDisease?: CodeableConcept[];
  doseNumberPositiveInt?: number;
  doseNumberString?: string;
  seriesDosesPositiveInt?: number;
  seriesDosesString?: string;
}

export class ImmunizationReaction {
  date?: string;
  detail?: Reference;
  reported?: boolean;
}

export class ImmunizationEducation {
  documentType?: string;
  reference?: string;
  publicationDate?: string;
  presentationDate?: string;
}

export class ImmunizationPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export class Immunization extends DomainResource {
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

export class ImmunizationRecommendationRecommendationDateCriterion {
  code: CodeableConcept;
  value: string;
}

export class ImmunizationRecommendationRecommendation {
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
  resourceType = 'ImmunizationRecommendation';
  identifier?: Identifier[];
  patient: Reference;
  date: string;
  authority?: Reference;
  recommendation: ImmunizationRecommendationRecommendation[];
}

export class ImplementationGuideManifestPage {
  name: string;
  title?: string;
  anchor?: string[];
}

export class ImplementationGuideManifestResource {
  reference: Reference;
  exampleBoolean?: boolean;
  exampleCanonical?: string;
  relativePath?: string;
}

export class ImplementationGuideManifest {
  rendering?: string;
  resource: ImplementationGuideManifestResource[];
  page?: ImplementationGuideManifestPage[];
  image?: string[];
  other?: string[];
}

export class ImplementationGuideDefinitionTemplate {
  code: string;
  source: string;
  scope?: string;
}

export class ImplementationGuideDefinitionParameter {
  code: ImplementationGuideCode1;
  value: string;
}

export class ImplementationGuideDefinitionPage {
  nameUrl?: string;
  nameReference?: Reference;
  title: string;
  generation: ImplementationGuideGeneration1;
  page?: ImplementationGuideDefinitionPage[];
}

export class ImplementationGuideDefinitionResource {
  reference: Reference;
  fhirVersion?: ImplementationGuideFhirVersion2[];
  name?: string;
  description?: string;
  exampleBoolean?: boolean;
  exampleCanonical?: string;
  groupingId?: string;
}

export class ImplementationGuideDefinitionGrouping {
  name: string;
  description?: string;
}

export class ImplementationGuideDefinition {
  grouping?: ImplementationGuideDefinitionGrouping[];
  resource: ImplementationGuideDefinitionResource[];
  page?: ImplementationGuideDefinitionPage;
  parameter?: ImplementationGuideDefinitionParameter[];
  template?: ImplementationGuideDefinitionTemplate[];
}

export class ImplementationGuideGlobal {
  type: ImplementationGuideType1;
  profile: string;
}

export class ImplementationGuideDependsOn {
  uri: string;
  packageId?: string;
  version?: string;
}

export class ImplementationGuide extends DomainResource implements IFhir.IImplementationGuide {
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
  fhirVersion: ImplementationGuideFhirVersion1[];
  dependsOn?: ImplementationGuideDependsOn[];
  global?: ImplementationGuideGlobal[];
  definition?: ImplementationGuideDefinition;
  manifest?: ImplementationGuideManifest;
}

export class IngredientSubstanceStrengthReferenceStrength {
  substance?: CodeableReference;
  strengthRatio?: Ratio;
  strengthRatioRange?: RatioRange;
  measurementPoint?: string;
  country?: CodeableConcept[];
}

export class IngredientSubstanceStrength {
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

export class IngredientSubstance {
  code: CodeableReference;
  strength?: IngredientSubstanceStrength[];
}

export class IngredientManufacturer {
  role?: IngredientRole1;
  manufacturer: Reference;
}

export class Ingredient extends DomainResource {
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

export class InsurancePlanPlanSpecificCostBenefitCost {
  type: CodeableConcept;
  applicability?: CodeableConcept;
  qualifiers?: CodeableConcept[];
  value?: Quantity;
}

export class InsurancePlanPlanSpecificCostBenefit {
  type: CodeableConcept;
  cost?: InsurancePlanPlanSpecificCostBenefitCost[];
}

export class InsurancePlanPlanSpecificCost {
  category: CodeableConcept;
  benefit?: InsurancePlanPlanSpecificCostBenefit[];
}

export class InsurancePlanPlanGeneralCost {
  type?: CodeableConcept;
  groupSize?: number;
  cost?: Money;
  comment?: string;
}

export class InsurancePlanPlan {
  identifier?: Identifier[];
  type?: CodeableConcept;
  coverageArea?: Reference[];
  network?: Reference[];
  generalCost?: InsurancePlanPlanGeneralCost[];
  specificCost?: InsurancePlanPlanSpecificCost[];
}

export class InsurancePlanCoverageBenefitLimit {
  value?: Quantity;
  code?: CodeableConcept;
}

export class InsurancePlanCoverageBenefit {
  type: CodeableConcept;
  requirement?: string;
  limit?: InsurancePlanCoverageBenefitLimit[];
}

export class InsurancePlanCoverage {
  type: CodeableConcept;
  network?: Reference[];
  benefit: InsurancePlanCoverageBenefit[];
}

export class InsurancePlanContact {
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

export class InsurancePlan extends DomainResource {
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

export class InvoiceLineItemPriceComponent {
  type: InvoiceType1;
  code?: CodeableConcept;
  factor?: number;
  amount?: Money;
}

export class InvoiceLineItem {
  sequence?: number;
  chargeItemReference?: Reference;
  chargeItemCodeableConcept?: CodeableConcept;
  priceComponent?: InvoiceLineItemPriceComponent[];
}

export class InvoiceParticipant {
  role?: CodeableConcept;
  actor: Reference;
}

export class Invoice extends DomainResource {
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

export class LinkageItem {
  type: LinkageType1;
  resource: Reference;
}

export class Linkage extends DomainResource {
  resourceType = 'Linkage';
  active?: boolean;
  author?: Reference;
  item: LinkageItem[];
}

export class ListEntry {
  flag?: CodeableConcept;
  deleted?: boolean;
  date?: string;
  item: Reference;
}

export class List extends DomainResource {
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

export class LocationHoursOfOperation {
  daysOfWeek?: LocationDaysOfWeek1[];
  allDay?: boolean;
  openingTime?: string;
  closingTime?: string;
}

export class LocationPosition {
  longitude: number;
  latitude: number;
  altitude?: number;
}

export class Location extends DomainResource {
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

export class ManufacturedItemDefinitionProperty {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class ManufacturedItemDefinition extends DomainResource {
  resourceType = 'ManufacturedItemDefinition';
  identifier?: Identifier[];
  status: ManufacturedItemDefinitionStatus1;
  manufacturedDoseForm: CodeableConcept;
  unitOfPresentation?: CodeableConcept;
  manufacturer?: Reference[];
  ingredient?: CodeableConcept[];
  property?: ManufacturedItemDefinitionProperty[];
}

export class MeasureSupplementalData {
  code?: CodeableConcept;
  usage?: CodeableConcept[];
  description?: string;
  criteria: Expression;
}

export class MeasureGroupStratifierComponent {
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}

export class MeasureGroupStratifier {
  code?: CodeableConcept;
  description?: string;
  criteria?: Expression;
  component?: MeasureGroupStratifierComponent[];
}

export class MeasureGroupPopulation {
  code?: CodeableConcept;
  description?: string;
  criteria: Expression;
}

export class MeasureGroup {
  code?: CodeableConcept;
  description?: string;
  population?: MeasureGroupPopulation[];
  stratifier?: MeasureGroupStratifier[];
}

export class Measure extends DomainResource {
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

export class MeasureReportGroupStratifierStratumPopulation {
  code?: CodeableConcept;
  count?: number;
  subjectResults?: Reference;
}

export class MeasureReportGroupStratifierStratumComponent {
  code: CodeableConcept;
  value: CodeableConcept;
}

export class MeasureReportGroupStratifierStratum {
  value?: CodeableConcept;
  component?: MeasureReportGroupStratifierStratumComponent[];
  population?: MeasureReportGroupStratifierStratumPopulation[];
  measureScore?: Quantity;
}

export class MeasureReportGroupStratifier {
  code?: CodeableConcept[];
  stratum?: MeasureReportGroupStratifierStratum[];
}

export class MeasureReportGroupPopulation {
  code?: CodeableConcept;
  count?: number;
  subjectResults?: Reference;
}

export class MeasureReportGroup {
  code?: CodeableConcept;
  population?: MeasureReportGroupPopulation[];
  measureScore?: Quantity;
  stratifier?: MeasureReportGroupStratifier[];
}

export class MeasureReport extends DomainResource {
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

export class MedicationBatch {
  lotNumber?: string;
  expirationDate?: string;
}

export class MedicationIngredient {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export class Medication extends DomainResource {
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

export class MedicationAdministrationDosage {
  text?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  method?: CodeableConcept;
  dose?: Quantity;
  rateRatio?: Ratio;
  rateQuantity?: Quantity;
}

export class MedicationAdministrationPerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export class MedicationAdministration extends DomainResource {
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

export class MedicationDispenseSubstitution {
  wasSubstituted: boolean;
  type?: CodeableConcept;
  reason?: CodeableConcept[];
  responsibleParty?: Reference[];
}

export class MedicationDispensePerformer {
  function?: CodeableConcept;
  actor: Reference;
}

export class MedicationDispense extends DomainResource {
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

export class MedicationKnowledgeKinetics {
  areaUnderCurve?: Quantity[];
  lethalDose50?: Quantity[];
  halfLifePeriod?: Duration;
}

export class MedicationKnowledgeRegulatoryMaxDispense {
  quantity: Quantity;
  period?: Duration;
}

export class MedicationKnowledgeRegulatorySchedule {
  schedule: CodeableConcept;
}

export class MedicationKnowledgeRegulatorySubstitution {
  type: CodeableConcept;
  allowed: boolean;
}

export class MedicationKnowledgeRegulatory {
  regulatoryAuthority: Reference;
  substitution?: MedicationKnowledgeRegulatorySubstitution[];
  schedule?: MedicationKnowledgeRegulatorySchedule[];
  maxDispense?: MedicationKnowledgeRegulatoryMaxDispense;
}

export class MedicationKnowledgeDrugCharacteristic {
  type?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueQuantity?: Quantity;
  valueBase64Binary?: string;
}

export class MedicationKnowledgePackaging {
  type?: CodeableConcept;
  quantity?: Quantity;
}

export class MedicationKnowledgeMedicineClassification {
  type: CodeableConcept;
  classification?: CodeableConcept[];
}

export class MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics {
  characteristicCodeableConcept?: CodeableConcept;
  characteristicQuantity?: Quantity;
  value?: string[];
}

export class MedicationKnowledgeAdministrationGuidelinesDosage {
  type: CodeableConcept;
  dosage: Dosage[];
}

export class MedicationKnowledgeAdministrationGuidelines {
  dosage?: MedicationKnowledgeAdministrationGuidelinesDosage[];
  indicationCodeableConcept?: CodeableConcept;
  indicationReference?: Reference;
  patientCharacteristics?: MedicationKnowledgeAdministrationGuidelinesPatientCharacteristics[];
}

export class MedicationKnowledgeMonitoringProgram {
  type?: CodeableConcept;
  name?: string;
}

export class MedicationKnowledgeCost {
  type: CodeableConcept;
  source?: string;
  cost: Money;
}

export class MedicationKnowledgeIngredient {
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
  isActive?: boolean;
  strength?: Ratio;
}

export class MedicationKnowledgeMonograph {
  type?: CodeableConcept;
  source?: Reference;
}

export class MedicationKnowledgeRelatedMedicationKnowledge {
  type: CodeableConcept;
  reference: Reference[];
}

export class MedicationKnowledge extends DomainResource {
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

export class MedicationRequestSubstitution {
  allowedBoolean?: boolean;
  allowedCodeableConcept?: CodeableConcept;
  reason?: CodeableConcept;
}

export class MedicationRequestDispenseRequestInitialFill {
  quantity?: Quantity;
  duration?: Duration;
}

export class MedicationRequestDispenseRequest {
  initialFill?: MedicationRequestDispenseRequestInitialFill;
  dispenseInterval?: Duration;
  validityPeriod?: Period;
  numberOfRepeatsAllowed?: number;
  quantity?: Quantity;
  expectedSupplyDuration?: Duration;
  performer?: Reference;
}

export class MedicationRequest extends DomainResource {
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

export class MedicinalProductDefinitionCharacteristic {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class MedicinalProductDefinitionOperation {
  type?: CodeableReference;
  effectiveDate?: Period;
  organization?: Reference[];
  confidentialityIndicator?: CodeableConcept;
}

export class MedicinalProductDefinitionCrossReference {
  product: CodeableReference;
  type?: CodeableConcept;
}

export class MedicinalProductDefinitionNameCountryLanguage {
  country: CodeableConcept;
  jurisdiction?: CodeableConcept;
  language: CodeableConcept;
}

export class MedicinalProductDefinitionNameNamePart {
  part: string;
  type: CodeableConcept;
}

export class MedicinalProductDefinitionName {
  productName: string;
  type?: CodeableConcept;
  namePart?: MedicinalProductDefinitionNameNamePart[];
  countryLanguage?: MedicinalProductDefinitionNameCountryLanguage[];
}

export class MedicinalProductDefinitionContact {
  type?: CodeableConcept;
  contact: Reference;
}

export class MedicinalProductDefinition extends DomainResource {
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

export class MessageDefinitionAllowedResponse {
  message: string;
  situation?: string;
}

export class MessageDefinitionFocus {
  code: MessageDefinitionCode1;
  profile?: string;
  min: number;
  max?: string;
}

export class MessageDefinition extends DomainResource {
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

export class MessageHeaderResponse {
  identifier: string;
  code: MessageHeaderCode1;
  details?: Reference;
}

export class MessageHeaderSource {
  name?: string;
  software?: string;
  version?: string;
  contact?: ContactPoint;
  endpoint: string;
}

export class MessageHeaderDestination {
  name?: string;
  target?: Reference;
  endpoint: string;
  receiver?: Reference;
}

export class MessageHeader extends DomainResource {
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

export class MolecularSequenceStructureVariantInner {
  start?: number;
  end?: number;
}

export class MolecularSequenceStructureVariantOuter {
  start?: number;
  end?: number;
}

export class MolecularSequenceStructureVariant {
  variantType?: CodeableConcept;
  exact?: boolean;
  length?: number;
  outer?: MolecularSequenceStructureVariantOuter;
  inner?: MolecularSequenceStructureVariantInner;
}

export class MolecularSequenceRepository {
  type: MolecularSequenceType3;
  url?: string;
  name?: string;
  datasetId?: string;
  variantsetId?: string;
  readsetId?: string;
}

export class MolecularSequenceQualityRoc {
  score?: number[];
  numTP?: number[];
  numFP?: number[];
  numFN?: number[];
  precision?: number[];
  sensitivity?: number[];
  fMeasure?: number[];
}

export class MolecularSequenceQuality {
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

export class MolecularSequenceVariant {
  start?: number;
  end?: number;
  observedAllele?: string;
  referenceAllele?: string;
  cigar?: string;
  variantPointer?: Reference;
}

export class MolecularSequenceReferenceSeq {
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

export class NamingSystemUniqueId {
  type: NamingSystemType1;
  value: string;
  preferred?: boolean;
  comment?: string;
  period?: Period;
}

export class NamingSystem extends DomainResource {
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

export class NutritionOrderEnteralFormulaAdministration {
  schedule?: Timing;
  quantity?: Quantity;
  rateQuantity?: Quantity;
  rateRatio?: Ratio;
}

export class NutritionOrderEnteralFormula {
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

export class NutritionOrderSupplement {
  type?: CodeableConcept;
  productName?: string;
  schedule?: Timing[];
  quantity?: Quantity;
  instruction?: string;
}

export class NutritionOrderOralDietTexture {
  modifier?: CodeableConcept;
  foodType?: CodeableConcept;
}

export class NutritionOrderOralDietNutrient {
  modifier?: CodeableConcept;
  amount?: Quantity;
}

export class NutritionOrderOralDiet {
  type?: CodeableConcept[];
  schedule?: Timing[];
  nutrient?: NutritionOrderOralDietNutrient[];
  texture?: NutritionOrderOralDietTexture[];
  fluidConsistencyType?: CodeableConcept[];
  instruction?: string;
}

export class NutritionOrder extends DomainResource {
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

export class NutritionProductInstance {
  quantity?: Quantity;
  identifier?: Identifier[];
  lotNumber?: string;
  expiry?: string;
  useBy?: string;
}

export class NutritionProductProductCharacteristic {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueQuantity?: Quantity;
  valueBase64Binary?: string;
  valueAttachment?: Attachment;
  valueBoolean?: boolean;
}

export class NutritionProductIngredient {
  item: CodeableReference;
  amount?: Ratio[];
}

export class NutritionProductNutrient {
  item?: CodeableReference;
  amount?: Ratio[];
}

export class NutritionProduct extends DomainResource {
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

export class ObservationComponent {
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

export class ObservationReferenceRange {
  low?: Quantity;
  high?: Quantity;
  type?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  age?: Range;
  text?: string;
}

export class Observation extends DomainResource {
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

export class ObservationDefinitionQualifiedInterval {
  category?: ObservationDefinitionCategory1;
  range?: Range;
  context?: CodeableConcept;
  appliesTo?: CodeableConcept[];
  gender?: ObservationDefinitionGender1;
  age?: Range;
  gestationalAge?: Range;
  condition?: string;
}

export class ObservationDefinitionQuantitativeDetails {
  customaryUnit?: CodeableConcept;
  unit?: CodeableConcept;
  conversionFactor?: number;
  decimalPrecision?: number;
}

export class ObservationDefinition extends DomainResource {
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

export class OperationDefinitionOverload {
  parameterName?: string[];
  comment?: string;
}

export class OperationDefinitionParameterReferencedFrom {
  source: string;
  sourceId?: string;
}

export class OperationDefinitionParameterBinding {
  strength: OperationDefinitionStrength1;
  valueSet: string;
}

export class OperationDefinitionParameter {
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
  severity: OperationOutcomeSeverity1;
  code: OperationOutcomeCode1;
  details?: CodeableConcept;
  diagnostics?: string;
  location?: string[];
  expression?: string[];
}

export class OperationOutcome extends DomainResource implements IFhir.IOperationOutcome {
  resourceType = 'OperationOutcome';
  issue: OperationOutcomeIssue[];
}

export class OrganizationContact {
  purpose?: CodeableConcept;
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
}

export class Organization extends DomainResource {
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

export class PackagedProductDefinitionPackageContainedItem {
  item: CodeableReference;
  amount?: Quantity;
}

export class PackagedProductDefinitionPackageProperty {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class PackagedProductDefinitionPackageShelfLifeStorage {
  type?: CodeableConcept;
  periodDuration?: Duration;
  periodString?: string;
  specialPrecautionsForStorage?: CodeableConcept[];
}

export class PackagedProductDefinitionPackage {
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

export class PackagedProductDefinitionLegalStatusOfSupply {
  code?: CodeableConcept;
  jurisdiction?: CodeableConcept;
}

export class PackagedProductDefinition extends DomainResource {
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

export class ParametersParameter {
  name: string;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
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
  resourceType = 'Parameters';
  parameter?: ParametersParameter[];
}

export class PatientLink {
  other: Reference;
  type: PatientType1;
}

export class PatientCommunication {
  language: CodeableConcept;
  preferred?: boolean;
}

export class PatientContact {
  relationship?: CodeableConcept[];
  name?: HumanName;
  telecom?: ContactPoint[];
  address?: Address;
  gender?: PatientGender2;
  organization?: Reference;
  period?: Period;
}

export class Patient extends DomainResource {
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

export class PaymentReconciliationProcessNote {
  type?: PaymentReconciliationType1;
  text?: string;
}

export class PaymentReconciliationDetail {
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

export class PersonLink {
  target: Reference;
  assurance?: PersonAssurance1;
}

export class Person extends DomainResource {
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

export class PlanDefinitionActionDynamicValue {
  path?: string;
  expression?: Expression;
}

export class PlanDefinitionActionParticipant {
  type: PlanDefinitionType1;
  role?: CodeableConcept;
}

export class PlanDefinitionActionRelatedAction {
  actionId: string;
  relationship: PlanDefinitionRelationship1;
  offsetDuration?: Duration;
  offsetRange?: Range;
}

export class PlanDefinitionActionCondition {
  kind: PlanDefinitionKind1;
  expression?: Expression;
}

export class PlanDefinitionAction {
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

export class PlanDefinitionGoalTarget {
  measure?: CodeableConcept;
  detailQuantity?: Quantity;
  detailRange?: Range;
  detailCodeableConcept?: CodeableConcept;
  due?: Duration;
}

export class PlanDefinitionGoal {
  category?: CodeableConcept;
  description: CodeableConcept;
  priority?: CodeableConcept;
  start?: CodeableConcept;
  addresses?: CodeableConcept[];
  documentation?: RelatedArtifact[];
  target?: PlanDefinitionGoalTarget[];
}

export class PlanDefinition extends DomainResource {
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

export class PractitionerQualification {
  identifier?: Identifier[];
  code: CodeableConcept;
  period?: Period;
  issuer?: Reference;
}

export class Practitioner extends DomainResource implements IFhir.IPractitioner {
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

export class PractitionerRoleNotAvailable {
  description: string;
  during?: Period;
}

export class PractitionerRoleAvailableTime {
  daysOfWeek?: PractitionerRoleDaysOfWeek1[];
  allDay?: boolean;
  availableStartTime?: string;
  availableEndTime?: string;
}

export class PractitionerRole extends DomainResource {
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

export class ProcedureFocalDevice {
  action?: CodeableConcept;
  manipulated: Reference;
}

export class ProcedurePerformer {
  function?: CodeableConcept;
  actor: Reference;
  onBehalfOf?: Reference;
}

export class Procedure extends DomainResource {
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

export class ProvenanceEntity {
  role: ProvenanceRole1;
  what: Reference;
  agent?: ProvenanceAgent[];
}

export class ProvenanceAgent {
  type?: CodeableConcept;
  role?: CodeableConcept[];
  who: Reference;
  onBehalfOf?: Reference;
}

export class Provenance extends DomainResource {
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

export class QuestionnaireItemInitial {
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

export class QuestionnaireItemAnswerOption {
  valueInteger?: number;
  valueDate?: string;
  valueTime?: string;
  valueString?: string;
  valueCoding?: Coding;
  valueReference?: Reference;
  initialSelected?: boolean;
}

export class QuestionnaireItemEnableWhen {
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

export class QuestionnaireItem {
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

export class QuestionnaireResponseItemAnswer {
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

export class QuestionnaireResponseItem {
  linkId: string;
  definition?: string;
  text?: string;
  answer?: QuestionnaireResponseItemAnswer[];
  item?: QuestionnaireResponseItem[];
}

export class QuestionnaireResponse extends DomainResource {
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

export class RegulatedAuthorizationCase {
  identifier?: Identifier;
  type?: CodeableConcept;
  status?: CodeableConcept;
  datePeriod?: Period;
  dateDateTime?: string;
  application?: RegulatedAuthorizationCase[];
}

export class RegulatedAuthorization extends DomainResource {
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

export class RelatedPersonCommunication {
  language: CodeableConcept;
  preferred?: boolean;
}

export class RelatedPerson extends DomainResource {
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

export class RequestGroupActionRelatedAction {
  actionId: string;
  relationship: RequestGroupRelationship1;
  offsetDuration?: Duration;
  offsetRange?: Range;
}

export class RequestGroupActionCondition {
  kind: RequestGroupKind1;
  expression?: Expression;
}

export class RequestGroupAction {
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

export class ResearchElementDefinitionCharacteristic {
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

export class ResearchStudyObjective {
  name?: string;
  type?: CodeableConcept;
}

export class ResearchStudyArm {
  name: string;
  type?: CodeableConcept;
  description?: string;
}

export class ResearchStudy extends DomainResource {
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

export class RiskAssessmentPrediction {
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

export class SearchParameterComponent {
  definition: string;
  expression: string;
}

export class SearchParameter extends DomainResource {
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

export class SpecimenContainer {
  identifier?: Identifier[];
  description?: string;
  type?: CodeableConcept;
  capacity?: Quantity;
  specimenQuantity?: Quantity;
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}

export class SpecimenProcessing {
  description?: string;
  procedure?: CodeableConcept;
  additive?: Reference[];
  timeDateTime?: string;
  timePeriod?: Period;
}

export class SpecimenCollection {
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

export class SpecimenDefinitionTypeTestedHandling {
  temperatureQualifier?: CodeableConcept;
  temperatureRange?: Range;
  maxDuration?: Duration;
  instruction?: string;
}

export class SpecimenDefinitionTypeTestedContainerAdditive {
  additiveCodeableConcept?: CodeableConcept;
  additiveReference?: Reference;
}

export class SpecimenDefinitionTypeTestedContainer {
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

export class SpecimenDefinitionTypeTested {
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
  resourceType = 'SpecimenDefinition';
  identifier?: Identifier;
  typeCollected?: CodeableConcept;
  patientPreparation?: CodeableConcept[];
  timeAspect?: string;
  collection?: CodeableConcept[];
  typeTested?: SpecimenDefinitionTypeTested[];
}

export class StructureDefinitionDifferential {
  element: ElementDefinition[];
}

export class StructureDefinitionSnapshot {
  element: ElementDefinition[];
}

export class StructureDefinitionContext {
  type: StructureDefinitionType1;
  expression: string;
}

export class StructureDefinitionMapping {
  identity: string;
  uri?: string;
  name?: string;
  comment?: string;
}

export class StructureDefinition extends DomainResource implements IFhir.IStructureDefinition {
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

export class StructureMapGroupRuleDependent {
  name: string;
  variable: string[];
}

export class StructureMapGroupRuleTargetParameter {
  valueId?: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
}

export class StructureMapGroupRuleTarget {
  context?: string;
  contextType?: StructureMapContextType1;
  element?: string;
  variable?: string;
  listMode?: StructureMapListMode2[];
  listRuleId?: string;
  transform?: StructureMapTransform1;
  parameter?: StructureMapGroupRuleTargetParameter[];
}

export class StructureMapGroupRuleSource {
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

export class StructureMapGroupRule {
  name: string;
  source: StructureMapGroupRuleSource[];
  target?: StructureMapGroupRuleTarget[];
  rule?: StructureMapGroupRule[];
  dependent?: StructureMapGroupRuleDependent[];
  documentation?: string;
}

export class StructureMapGroupInput {
  name: string;
  type?: string;
  mode: StructureMapMode2;
  documentation?: string;
}

export class StructureMapGroup {
  name: string;
  extends?: string;
  typeMode: StructureMapTypeMode1;
  documentation?: string;
  input: StructureMapGroupInput[];
  rule: StructureMapGroupRule[];
}

export class StructureMapStructure {
  url: string;
  mode: StructureMapMode1;
  alias?: string;
  documentation?: string;
}

export class StructureMap extends DomainResource {
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

export class SubscriptionChannel {
  type: SubscriptionType1;
  endpoint?: string;
  payload?: string;
  header?: string[];
}

export class Subscription extends DomainResource {
  resourceType = 'Subscription';
  status: SubscriptionStatus1;
  contact?: ContactPoint[];
  end?: string;
  reason: string;
  criteria: string;
  error?: string;
  channel: SubscriptionChannel;
}

export class SubscriptionStatusNotificationEvent {
  eventNumber: string;
  timestamp?: string;
  focus?: Reference;
  additionalContext?: Reference[];
}

export class SubscriptionStatus extends DomainResource {
  resourceType = 'SubscriptionStatus';
  status?: SubscriptionStatusStatus1;
  type: SubscriptionStatusType1;
  eventsSinceSubscriptionStart?: string;
  notificationEvent?: SubscriptionStatusNotificationEvent[];
  subscription: Reference;
  topic?: string;
  error?: CodeableConcept[];
}

export class SubscriptionTopicNotificationShape {
  resource: SubscriptionTopicResource4;
  include?: string[];
  revInclude?: string[];
}

export class SubscriptionTopicCanFilterBy {
  description?: string;
  resource?: SubscriptionTopicResource3;
  filterParameter: string;
  filterDefinition?: string;
  modifier?: SubscriptionTopicModifier1[];
}

export class SubscriptionTopicEventTrigger {
  description?: string;
  event: CodeableConcept;
  resource: SubscriptionTopicResource2;
}

export class SubscriptionTopicResourceTriggerQueryCriteria {
  previous?: string;
  resultForCreate?: SubscriptionTopicResultForCreate1;
  current?: string;
  resultForDelete?: SubscriptionTopicResultForDelete1;
  requireBoth?: boolean;
}

export class SubscriptionTopicResourceTrigger {
  description?: string;
  resource: SubscriptionTopicResource1;
  supportedInteraction?: SubscriptionTopicSupportedInteraction1[];
  queryCriteria?: SubscriptionTopicResourceTriggerQueryCriteria;
  fhirPathCriteria?: string;
}

export class SubscriptionTopic extends DomainResource {
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

export class SubstanceIngredient {
  quantity?: Ratio;
  substanceCodeableConcept?: CodeableConcept;
  substanceReference?: Reference;
}

export class SubstanceInstance {
  identifier?: Identifier;
  expiry?: string;
  quantity?: Quantity;
}

export class Substance extends DomainResource {
  resourceType = 'Substance';
  identifier?: Identifier[];
  status?: SubstanceStatus1;
  category?: CodeableConcept[];
  code: CodeableConcept;
  description?: string;
  instance?: SubstanceInstance[];
  ingredient?: SubstanceIngredient[];
}

export class SubstanceDefinitionSourceMaterial {
  type?: CodeableConcept;
  genus?: CodeableConcept;
  species?: CodeableConcept;
  part?: CodeableConcept;
  countryOfOrigin?: CodeableConcept[];
}

export class SubstanceDefinitionRelationship {
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

export class SubstanceDefinitionNameOfficial {
  authority?: CodeableConcept;
  status?: CodeableConcept;
  date?: string;
}

export class SubstanceDefinitionName {
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

export class SubstanceDefinitionCode {
  code?: CodeableConcept;
  status?: CodeableConcept;
  statusDate?: string;
  note?: Annotation[];
  source?: Reference[];
}

export class SubstanceDefinitionStructureRepresentation {
  type?: CodeableConcept;
  representation?: string;
  format?: CodeableConcept;
  document?: Reference;
}

export class SubstanceDefinitionStructure {
  stereochemistry?: CodeableConcept;
  opticalActivity?: CodeableConcept;
  molecularFormula?: string;
  molecularFormulaByMoiety?: string;
  molecularWeight?: SubstanceDefinitionMolecularWeight;
  technique?: CodeableConcept[];
  sourceDocument?: Reference[];
  representation?: SubstanceDefinitionStructureRepresentation[];
}

export class SubstanceDefinitionMolecularWeight {
  method?: CodeableConcept;
  type?: CodeableConcept;
  amount: Quantity;
}

export class SubstanceDefinitionProperty {
  type: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueDate?: string;
  valueBoolean?: boolean;
  valueAttachment?: Attachment;
}

export class SubstanceDefinitionMoiety {
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

export class SupplyDeliverySuppliedItem {
  quantity?: Quantity;
  itemCodeableConcept?: CodeableConcept;
  itemReference?: Reference;
}

export class SupplyDelivery extends DomainResource {
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

export class SupplyRequestParameter {
  code?: CodeableConcept;
  valueCodeableConcept?: CodeableConcept;
  valueQuantity?: Quantity;
  valueRange?: Range;
  valueBoolean?: boolean;
}

export class SupplyRequest extends DomainResource {
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

export class TaskOutput {
  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
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

export class TaskInput {
  type: CodeableConcept;
  valueBase64Binary?: string;
  valueBoolean?: boolean;
  valueCanonical?: string;
  valueCode?: string;
  valueDate?: string;
  valueDateTime?: string;
  valueDecimal?: number;
  valueId?: string;
  valueInstant?: string;
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

export class TaskRestriction {
  repetitions?: number;
  period?: Period;
  recipient?: Reference[];
}

export class Task extends DomainResource {
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

export class TerminologyCapabilitiesClosure {
  translation?: boolean;
}

export class TerminologyCapabilitiesTranslation {
  needsMap: boolean;
}

export class TerminologyCapabilitiesValidateCode {
  translations: boolean;
}

export class TerminologyCapabilitiesExpansionParameter {
  name: string;
  documentation?: string;
}

export class TerminologyCapabilitiesExpansion {
  hierarchical?: boolean;
  paging?: boolean;
  incomplete?: boolean;
  parameter?: TerminologyCapabilitiesExpansionParameter[];
  textFilter?: string;
}

export class TerminologyCapabilitiesCodeSystemVersionFilter {
  code: string;
  op: string[];
}

export class TerminologyCapabilitiesCodeSystemVersion {
  code?: string;
  isDefault?: boolean;
  compositional?: boolean;
  language?: string[];
  filter?: TerminologyCapabilitiesCodeSystemVersionFilter[];
  property?: string[];
}

export class TerminologyCapabilitiesCodeSystem {
  uri?: string;
  version?: TerminologyCapabilitiesCodeSystemVersion[];
  subsumption?: boolean;
}

export class TerminologyCapabilitiesImplementation {
  description: string;
  url?: string;
}

export class TerminologyCapabilitiesSoftware {
  name: string;
  version?: string;
}

export class TerminologyCapabilities extends DomainResource {
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

export class TestReportTeardownAction {
  operation: TestReportSetupActionOperation;
}

export class TestReportTeardown {
  action: TestReportTeardownAction[];
}

export class TestReportTestAction {
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}

export class TestReportTest {
  name?: string;
  description?: string;
  action: TestReportTestAction[];
}

export class TestReportSetupActionAssert {
  result: TestReportResult3;
  message?: string;
  detail?: string;
}

export class TestReportSetupActionOperation {
  result: TestReportResult2;
  message?: string;
  detail?: string;
}

export class TestReportSetupAction {
  operation?: TestReportSetupActionOperation;
  assert?: TestReportSetupActionAssert;
}

export class TestReportSetup {
  action: TestReportSetupAction[];
}

export class TestReportParticipant {
  type: TestReportType1;
  uri: string;
  display?: string;
}

export class TestReport extends DomainResource {
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

export class TestScriptTeardownAction {
  operation: TestScriptSetupActionOperation;
}

export class TestScriptTeardown {
  action: TestScriptTeardownAction[];
}

export class TestScriptTestAction {
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}

export class TestScriptTest {
  name?: string;
  description?: string;
  action: TestScriptTestAction[];
}

export class TestScriptSetupActionAssert {
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

export class TestScriptSetupActionOperationRequestHeader {
  field: string;
  value: string;
}

export class TestScriptSetupActionOperation {
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

export class TestScriptSetupAction {
  operation?: TestScriptSetupActionOperation;
  assert?: TestScriptSetupActionAssert;
}

export class TestScriptSetup {
  action: TestScriptSetupAction[];
}

export class TestScriptVariable {
  name: string;
  defaultValue?: string;
  description?: string;
  expression?: string;
  headerField?: string;
  hint?: string;
  path?: string;
  sourceId?: string;
}

export class TestScriptFixture {
  autocreate: boolean;
  autodelete: boolean;
  resource?: Reference;
}

export class TestScriptMetadataCapability {
  required: boolean;
  validated: boolean;
  description?: string;
  origin?: number[];
  destination?: number;
  link?: string[];
  capabilities: string;
}

export class TestScriptMetadataLink {
  url: string;
  description?: string;
}

export class TestScriptMetadata {
  link?: TestScriptMetadataLink[];
  capability: TestScriptMetadataCapability[];
}

export class TestScriptDestination {
  index: number;
  profile: Coding;
}

export class TestScriptOrigin {
  index: number;
  profile: Coding;
}

export class TestScript extends DomainResource {
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

export class ValueSetExpansionContains {
  system?: string;
  abstract?: boolean;
  inactive?: boolean;
  version?: string;
  code?: string;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation[];
  contains?: ValueSetExpansionContains[];
}

export class ValueSetExpansionParameter {
  name: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
  valueUri?: string;
  valueCode?: string;
  valueDateTime?: string;
}

export class ValueSetExpansion {
  identifier?: string;
  timestamp: string;
  total?: number;
  offset?: number;
  parameter?: ValueSetExpansionParameter[];
  contains?: ValueSetExpansionContains[];
}

export class ValueSetComposeIncludeFilter {
  property: string;
  op: ValueSetOp1;
  value: string;
}

export class ValueSetComposeIncludeConceptDesignation {
  language?: string;
  use?: Coding;
  value: string;
}

export class ValueSetComposeIncludeConcept {
  code: string;
  display?: string;
  designation?: ValueSetComposeIncludeConceptDesignation[];
}

export class ValueSetComposeInclude {
  system?: string;
  version?: string;
  concept?: ValueSetComposeIncludeConcept[];
  filter?: ValueSetComposeIncludeFilter[];
  valueSet?: string[];
}

export class ValueSetCompose {
  lockedDate?: string;
  inactive?: boolean;
  include: ValueSetComposeInclude[];
  exclude?: ValueSetComposeInclude[];
}

export class ValueSet extends DomainResource implements IFhir.IValueSet {
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

export class VerificationResultValidator {
  organization: Reference;
  identityCertificate?: string;
  attestationSignature?: Signature;
}

export class VerificationResultAttestation {
  who?: Reference;
  onBehalfOf?: Reference;
  communicationMethod?: CodeableConcept;
  date?: string;
  sourceIdentityCertificate?: string;
  proxyIdentityCertificate?: string;
  proxySignature?: Signature;
  sourceSignature?: Signature;
}

export class VerificationResultPrimarySource {
  who?: Reference;
  type?: CodeableConcept[];
  communicationMethod?: CodeableConcept[];
  validationStatus?: CodeableConcept;
  validationDate?: string;
  canPushUpdates?: CodeableConcept;
  pushTypeAvailable?: CodeableConcept[];
}

export class VerificationResult extends DomainResource {
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

export class VisionPrescriptionLensSpecificationPrism {
  amount: number;
  base: VisionPrescriptionBase1;
}

export class VisionPrescriptionLensSpecification {
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

