import {UnauthorizedException} from '@nestjs/common';
import {ITofUser, PaginateOptions} from '@trifolia-fhir/tof-lib';
import {TofLogger} from '../tof-logger';


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
     * Override this to provide any custom mapping of what the @Request() parameter provides to data entity properties.
     * @param req Request parameter decorator
     * @returns object for use in PaginateOptions.filter
     */
    protected getFilterFromRequest(req?: any): {[key: string]: object} {
        //this.logger.debug('getFilterFromRequest');
        return {};
    }

    /**
     * Returns a valid PaginateOptions object from any provided @Request() parameter decorator.
     * Override this to provide any custom mapping of what the @Request() parameter provides to data entity properties.
     * @param req Request parameter decorator
     * @returns PaginateOptions for use in the BaseDataController.search method
     */
    protected getPaginateOptionsFromRequest(req?: any): PaginateOptions {

        let query = req.query;

        const options: PaginateOptions = {
            page: (query && query.page) ? query.page : 1,
            itemsPerPage: (query && query.itemsPerPage) ? query.itemsPerPage : 10,
            sortBy: {},
            pipeline: [{$match: this.getFilterFromRequest(req)}]
        };

        if ('_sort' in query) {

          const sortTerms = query['_sort'].split(',');
          sortTerms.forEach(term => {
            if (!term) return;

            let dir: 'asc' | 'desc' = 'asc';
            if (term[0] === '-') {
              dir = 'desc';
              term = term.substring(1);
            }

            options.sortBy[term] = dir;
            });
        }

        return options;
    }

    protected escapeRegExp(value: string) {
      return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }


}
