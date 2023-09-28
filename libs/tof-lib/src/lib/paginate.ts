import { PipelineStage } from "mongoose";

export class PaginateOptions {

    public page?: number = 1;
    public itemsPerPage?: number = 10;
    public pipeline?: PipelineStage[];
    public sortBy?: {[key: string]: 'asc'|'desc'};
    public populate?: string[] = [];
    public projection?: PipelineStage.Project['$project'];
}

export class Paginated<T> {

    public results: T[];
    public itemsPerPage: number;
    public total: number;

}

