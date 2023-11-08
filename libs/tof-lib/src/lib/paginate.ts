import { PipelineStage } from "mongoose";

export class PaginateOptions {

    public page?: number = 1;
    public itemsPerPage?: number = 10;
    public pipeline?: PipelineStage[];
    public sortBy?: {[key: string]: 'asc'|'desc'};
    public populate?: string[] = [];
    public projection?: PipelineStage.Project['$project'];

    /**
     * Whether or not to hydrate the results based on the model's schema.
     * For example: if using a custom aggregation pipeline that includes replacing a field in the model 
     * (such as the result of a $lookup), this should be set to false.
     * @default true
     */
    public hydrate?: boolean = true;
}

export class Paginated<T> {

    public results: T[];
    public itemsPerPage: number;
    public total: number;

}

