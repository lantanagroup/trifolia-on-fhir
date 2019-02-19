export interface ExpandOptions {
    filter?: string;
    profile?: string;
    date?: string;
    offset?: number;
    count?: number;
    includeDesignations?: boolean;
    includeDefinition?: boolean;
    activeOnly?: boolean;
    excludeNested?: boolean;
    excludeNotForUI?: boolean;
    excludePostCoordinated?: boolean;
    displayLanguage?: string;
    limitedExpansion?: boolean;
}