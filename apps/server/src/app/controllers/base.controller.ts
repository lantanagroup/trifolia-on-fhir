import { PaginateOptions } from "@trifolia-fhir/tof-lib/paginate";


export class BaseController {
    
    
    /**
     * Returns an object that is suitable to use in the filter property of PaginateOptions.
     * Override this to provide any custom mapping of what the route handler @Query() parameter provides to data entity properties.
     * @param query Query route handler parameter decorator
     * @returns object for use in PaginateOptions.filter
     */
    protected getFilterFromQuery(query?: any) : any {
        return {};
    }

    /**
     * Returns a valid PaginateOptions object from any provided Query route handler parameter decorator.
     * Override this to provide any custom mapping of what the route handler @Query() parameter provides to data entity properties.
     * @param query Query route handler parameter decorator 
     * @returns PaginateOptions for use in the BaseDataController.search method
     */
    protected getPaginateOptionsFromQuery(query?: any) : PaginateOptions {
        const filter = this.getFilterFromQuery(query);

        const options: PaginateOptions = {
            page: (query && query.page) ? query.page : 1,
            itemsPerPage: (query && query.itemsPerPage) ? query.itemsPerPage : 10,
            sortBy: {},
            filter: this.getFilterFromQuery(query)
          };

          
        if ('_sort' in query) {
            options.sortBy[query['_sort']] = 'asc';
        }

        return options;
    }
    

}