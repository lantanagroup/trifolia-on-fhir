import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate{
  canDeactivate: () => boolean;
}

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
