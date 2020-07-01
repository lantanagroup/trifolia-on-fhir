import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate{
  canDeactivate: () => boolean;
}

/**
 * This class is the class that triggers every time a user tries to go to a new page/different route within the application.
 * If there are changes currently made to the page that the user was just on, then this class triggers and confirms that
 * this is what the user wants before navigating to the new page.
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot): boolean {

    if (!component.canDeactivate || component.canDeactivate()) return true;
    if (!component.canDeactivate()) {
      return window.confirm("You have unsaved changes on this resource. Are you sure you'd like to navigate to a new page?");
    }
  }
}
