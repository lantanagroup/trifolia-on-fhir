import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
    selector: '[routeTransformer]'
})
export class RouteTransformerDirective {
    constructor(private el: ElementRef, private router: Router) { }

    @HostListener('click', ['$event'])
    public onClick(event) {
        if (event.target.tagName === 'A') {
            this.router.navigate([event.target.getAttribute('href')]);
            event.preventDefault();
        } else {
            return;
        }
    }
};