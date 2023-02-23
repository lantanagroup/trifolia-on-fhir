import { UnauthorizedException } from "@nestjs/common";
import { PaginateOptions } from "@trifolia-fhir/tof-lib";
import type { ITofUser } from "@trifolia-fhir/tof-lib";
import { TofLogger } from "../tof-logger";


export class BaseController {

    protected readonly logger = new TofLogger(BaseController.name);


    /**
     * Throws {UnauthorizedException} is given user is not an admin
     * @param user 
     * @throws UnauthorizedException
     */
    protected assertAdmin(user: ITofUser) {
        if (!user.isAdmin) {
            throw new UnauthorizedException('This operation requires administrative privileges.');
        }
    }


    /**
     * Returns the normalized authId string for the supplied subject. Currently just removes 'auth0|' from the start of the string if present.
     * @param user 
     */
    protected getAuthIdFromSubject(sub: string): string {

        if (!sub || sub.length < 1) {
            return null;
        }

        if (sub.startsWith('auth0|')) {
            sub = sub.substring(6);
        }

        return sub;

    }

    
    
    /**
     * Returns an object that is suitable to use in the filter property of PaginateOptions.
     * Override this to provide any custom mapping of what the route handler @Query() parameter provides to data entity properties.
     * @param query Query route handler parameter decorator
     * @returns object for use in PaginateOptions.filter
     */
    protected getFilterFromQuery(query?: any) : any {
        this.logger.debug('getFilterFromQuery');
        return {};
    }

    /**
     * Returns a valid PaginateOptions object from any provided Query route handler parameter decorator.
     * Override this to provide any custom mapping of what the route handler @Query() parameter provides to data entity properties.
     * @param query Query route handler parameter decorator 
     * @returns PaginateOptions for use in the BaseDataController.search method
     */
    protected getPaginateOptionsFromQuery(query?: any) : PaginateOptions {
        this.logger.debug('getPaginateOptionsFromQuery');

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