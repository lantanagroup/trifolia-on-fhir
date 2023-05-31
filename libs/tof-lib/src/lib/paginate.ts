
export class PaginateOptions {

    public page?: number = 1;
    public itemsPerPage?: number = 10;
    public filter?: any;
    public sortBy?: {[key: string]: 'asc'|'desc'};
    public populate?: string[] = [];
}

export class Paginated<T> {

    public results: T[];
    public itemsPerPage: number;
    public total: number;

}

