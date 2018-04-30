webpackJsonp(["main"],{

/***/ "./src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_gendir lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/***/ (function(module, exports) {

module.exports = ".sub-nav-link {\r\n  color: rgba(255,255,255,.5);\r\n  text-decoration: none;\r\n}\r\n\r\n.profile-picture {\r\n  width: 21px;\r\n  height: 21px;\r\n}\r\n\r\n.nav-link.dropdown-toggle.active a {\r\n  color: #fff;\r\n}\r\n\r\n.container.container-large {\r\n  max-width: 100% !important;\r\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-md navbar-dark fixed-top bg-dark\">\r\n  <a class=\"navbar-brand\" href=\"#\">Trifolia</a>\r\n  <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarCollapse\" aria-controls=\"navbarCollapse\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\r\n    <span class=\"navbar-toggler-icon\"></span>\r\n  </button>\r\n  <div class=\"collapse navbar-collapse\" id=\"navbarCollapse\">\r\n    <ul class=\"navbar-nav mr-auto\">\r\n      <li class=\"nav-item\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/home\">Home <span class=\"sr-only\">(current)</span></a>\r\n      </li>\r\n      <li class=\"nav-item dropdown\" *ngIf=\"authService.isAuthenticated()\">\r\n        <a class=\"nav-link dropdown-toggle\" [routerLinkActive]=\"['active']\" href=\"#\" id=\"igMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n          <a class=\"sub-nav-link\">Implementation Guides</a>\r\n        </a>\r\n        <div class=\"dropdown-menu\" aria-labelledby=\"igMenu\">\r\n          <a class=\"dropdown-item\" routerLink=\"/implementation-guide\">Browse</a>\r\n          <a class=\"dropdown-item\" href=\"#\">Recent...</a>\r\n        </div>\r\n      </li>\r\n      <li class=\"nav-item\" *ngIf=\"authService.isAuthenticated()\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/structure-definition\">Structure Definitions</a>\r\n      </li>\r\n      <li class=\"nav-item\" *ngIf=\"authService.isAuthenticated()\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/valuesets\">Value Sets</a>\r\n      </li>\r\n      <li class=\"nav-item\" *ngIf=\"authService.isAuthenticated()\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/codesystems\">Code Systems</a>\r\n      </li>\r\n      <li class=\"nav-item\" *ngIf=\"authService.isAuthenticated()\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/export\">Export</a>\r\n      </li>\r\n      <li class=\"nav-item\" *ngIf=\"authService.isAuthenticated()\" [routerLinkActive]=\"['active']\">\r\n        <a class=\"nav-link\" routerLink=\"/import\">Import</a>\r\n      </li>\r\n    </ul>\r\n    <ul class=\"nav navbar-nav navbar-right\">\r\n      <li class=\"nav-item\" *ngIf=\"configService.config\">\r\n        <select class=\"form-control\" [ngModel]=\"configService.fhirServer\" (ngModelChange)=\"configService.changeFhirServer($event)\">\r\n          <option *ngFor=\"let fs of configService.config.fhirServers\" value=\"{{fs.id}}\">{{fs.name}}</option>\r\n        </select>\r\n      </li>\r\n      <li class=\"nav-item dropdown\">\r\n        <a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"helpMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n          Help\r\n        </a>\r\n        <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"helpMenu\">\r\n          <a class=\"dropdown-item\" href=\"/help\" target=\"_new\">Documentation</a>\r\n          <a class=\"dropdown-item\" href=\"#\">Request Support</a>\r\n          <a class=\"dropdown-item\" href=\"#\">:Version:</a>\r\n        </div>\r\n      </li>\r\n      <li class=\"nav-item dropdown\">\r\n        <a class=\"nav-link dropdown-toggle\" *ngIf=\"authService.isAuthenticated()\" href=\"#\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\r\n          <img class=\"profile-picture\" *ngIf=\"userProfile && userProfile.picture\" src=\"{{userProfile.picture}}\" />\r\n          {{getDisplayName()}}\r\n        </a>\r\n        <a class=\"nav-link dropdown-toggle\" *ngIf=\"!authService.isAuthenticated()\" href=\"#\" id=\"profileMenu\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">Not Logged In</a>\r\n        <div class=\"dropdown-menu dropdown-menu-right\" aria-labelledby=\"profileMenu\">\r\n          <a class=\"dropdown-item\" *ngIf=\"authService.isAuthenticated()\" routerLink=\"/users/me\">Profile</a>\r\n          <a class=\"dropdown-item\" *ngIf=\"!authService.isAuthenticated()\" (click)=\"authService.login()\">Login</a>\r\n          <a class=\"dropdown-item\" *ngIf=\"authService.isAuthenticated()\" (click)=\"authService.logout()\">Logout</a>\r\n        </div>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n</nav>\r\n\r\n<div class=\"container\" [class.container-large]=\"isBigContainer\">\r\n  <div class=\"jumbotron\">\r\n    <div class=\"alert alert-warning\" *ngIf=\"configService.statusMessage\">{{configService.statusMessage}}</div>\r\n    <router-outlet></router-outlet>\r\n  </div>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_auth_service__ = __webpack_require__("./src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_config_service__ = __webpack_require__("./src/app/services/config.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(authService, configService, router) {
        var _this = this;
        this.authService = authService;
        this.configService = configService;
        this.router = router;
        this.isBigContainer = false;
        this.authService.authChanged.subscribe(function () {
            _this.userProfile = _this.authService.userProfile;
            _this.person = _this.authService.person;
        });
    }
    AppComponent.prototype.getDisplayName = function () {
        if (this.person) {
            return this.person.getDisplayName();
        }
        if (this.userProfile) {
            return this.userProfile.name;
        }
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.authService.isAuthenticated()) {
            var self = this;
            this.authService.getProfile(function (err, profile, person) { });
        }
        this.router.events.subscribe(function (event) {
            if (event instanceof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* NavigationEnd */]) {
                _this.isBigContainer =
                    event.url.startsWith('/structure-definition/');
            }
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__("./src/app/app.component.html"),
        styles: [__webpack_require__("./src/app/app.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_3__services_config_service__["a" /* ConfigService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__services_config_service__["a" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_config_service__["a" /* ConfigService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */]) === "function" && _c || Object])
], AppComponent);

var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export authHttpServiceFactory */
/* unused harmony export AddHeaderInterceptor */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__implementation_guides_implementation_guides_component__ = __webpack_require__("./src/app/implementation-guides/implementation-guides.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__home_home_component__ = __webpack_require__("./src/app/home/home.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__implementation_guide_implementation_guide_component__ = __webpack_require__("./src/app/implementation-guide/implementation-guide.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__export_export_component__ = __webpack_require__("./src/app/export/export.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__import_import_component__ = __webpack_require__("./src/app/import/import.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__structure_definition_structure_definition_component__ = __webpack_require__("./src/app/structure-definition/structure-definition.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__valuesets_valuesets_component__ = __webpack_require__("./src/app/valuesets/valuesets.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__valueset_valueset_component__ = __webpack_require__("./src/app/valueset/valueset.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__codesystems_codesystems_component__ = __webpack_require__("./src/app/codesystems/codesystems.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__codesystem_codesystem_component__ = __webpack_require__("./src/app/codesystem/codesystem.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__login_login_component__ = __webpack_require__("./src/app/login/login.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angular2_jwt__ = __webpack_require__("./node_modules/angular2-jwt/angular2-jwt.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_angular2_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18_angular2_jwt__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__structure_definitions_structure_definitions_component__ = __webpack_require__("./src/app/structure-definitions/structure-definitions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__users_users_component__ = __webpack_require__("./src/app/users/users.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__user_user_component__ = __webpack_require__("./src/app/user/user.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__services_auth_service__ = __webpack_require__("./src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__services_person_service__ = __webpack_require__("./src/app/services/person.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__fhir_edit_human_name_human_name_component__ = __webpack_require__("./src/app/fhir-edit/human-name/human-name.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__fhir_edit_human_names_human_names_component__ = __webpack_require__("./src/app/fhir-edit/human-names/human-names.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__new_profile_new_profile_component__ = __webpack_require__("./src/app/new-profile/new-profile.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_angular2_cookie_core__ = __webpack_require__("./node_modules/angular2-cookie/core.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_angular2_cookie_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_27_angular2_cookie_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__fhir_edit_string_string_component__ = __webpack_require__("./src/app/fhir-edit/string/string.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__select_choice_modal_select_choice_modal_component__ = __webpack_require__("./src/app/select-choice-modal/select-choice-modal.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__element_definition_panel_element_definition_panel_component__ = __webpack_require__("./src/app/element-definition-panel/element-definition-panel.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__fhir_edit_element_definition_type_modal_element_definition_type_modal_component__ = __webpack_require__("./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__globals__ = __webpack_require__("./src/app/globals.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__markdown_markdown_component__ = __webpack_require__("./src/app/markdown/markdown.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_t_json_viewer__ = __webpack_require__("./node_modules/t-json-viewer/index.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




































function authHttpServiceFactory(http, options) {
    return new __WEBPACK_IMPORTED_MODULE_18_angular2_jwt__["AuthHttp"](new __WEBPACK_IMPORTED_MODULE_18_angular2_jwt__["AuthConfig"]({
        noClientCheck: true
    }), http, options);
}
var AddHeaderInterceptor = (function () {
    function AddHeaderInterceptor() {
    }
    AddHeaderInterceptor.prototype.intercept = function (req, next) {
        var token = localStorage.getItem('token');
        var fhirServer = localStorage.getItem('fhirServer');
        var headers = {};
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        if (fhirServer) {
            headers['fhirServer'] = fhirServer;
        }
        var clonedRequest = req.clone({
            setHeaders: headers
        });
        return next.handle(clonedRequest);
    };
    return AddHeaderInterceptor;
}());

var appRoutes = [
    { path: 'home', component: __WEBPACK_IMPORTED_MODULE_7__home_home_component__["a" /* HomeComponent */] },
    { path: 'implementation-guide', component: __WEBPACK_IMPORTED_MODULE_6__implementation_guides_implementation_guides_component__["a" /* ImplementationGuidesComponent */] },
    { path: 'implementation-guide/:id', component: __WEBPACK_IMPORTED_MODULE_8__implementation_guide_implementation_guide_component__["a" /* ImplementationGuideComponent */] },
    { path: 'structure-definition', component: __WEBPACK_IMPORTED_MODULE_19__structure_definitions_structure_definitions_component__["a" /* StructureDefinitionsComponent */] },
    { path: 'structure-definition/new', component: __WEBPACK_IMPORTED_MODULE_26__new_profile_new_profile_component__["a" /* NewProfileComponent */] },
    { path: 'structure-definition/:id', component: __WEBPACK_IMPORTED_MODULE_12__structure_definition_structure_definition_component__["a" /* StructureDefinitionComponent */] },
    { path: 'valuesets', component: __WEBPACK_IMPORTED_MODULE_13__valuesets_valuesets_component__["a" /* ValuesetsComponent */] },
    { path: 'valuesets/:id', component: __WEBPACK_IMPORTED_MODULE_14__valueset_valueset_component__["a" /* ValuesetComponent */] },
    { path: 'codesystems', component: __WEBPACK_IMPORTED_MODULE_15__codesystems_codesystems_component__["a" /* CodesystemsComponent */] },
    { path: 'codesystems/:id', component: __WEBPACK_IMPORTED_MODULE_16__codesystem_codesystem_component__["a" /* CodesystemComponent */] },
    { path: 'export', component: __WEBPACK_IMPORTED_MODULE_10__export_export_component__["a" /* ExportComponent */] },
    { path: 'import', component: __WEBPACK_IMPORTED_MODULE_11__import_import_component__["a" /* ImportComponent */] },
    { path: 'users', component: __WEBPACK_IMPORTED_MODULE_20__users_users_component__["a" /* UsersComponent */] },
    { path: 'users/me', component: __WEBPACK_IMPORTED_MODULE_21__user_user_component__["a" /* UserComponent */] },
    { path: 'users/:id', component: __WEBPACK_IMPORTED_MODULE_21__user_user_component__["a" /* UserComponent */] },
    { path: 'login', component: __WEBPACK_IMPORTED_MODULE_17__login_login_component__["a" /* LoginComponent */] },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_30__select_choice_modal_select_choice_modal_component__["a" /* SelectChoiceModalComponent */],
            __WEBPACK_IMPORTED_MODULE_32__fhir_edit_element_definition_type_modal_element_definition_type_modal_component__["a" /* ElementDefinitionTypeModalComponent */]
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */],
            __WEBPACK_IMPORTED_MODULE_6__implementation_guides_implementation_guides_component__["a" /* ImplementationGuidesComponent */],
            __WEBPACK_IMPORTED_MODULE_7__home_home_component__["a" /* HomeComponent */],
            __WEBPACK_IMPORTED_MODULE_8__implementation_guide_implementation_guide_component__["a" /* ImplementationGuideComponent */],
            __WEBPACK_IMPORTED_MODULE_10__export_export_component__["a" /* ExportComponent */],
            __WEBPACK_IMPORTED_MODULE_11__import_import_component__["a" /* ImportComponent */],
            __WEBPACK_IMPORTED_MODULE_12__structure_definition_structure_definition_component__["a" /* StructureDefinitionComponent */],
            __WEBPACK_IMPORTED_MODULE_13__valuesets_valuesets_component__["a" /* ValuesetsComponent */],
            __WEBPACK_IMPORTED_MODULE_14__valueset_valueset_component__["a" /* ValuesetComponent */],
            __WEBPACK_IMPORTED_MODULE_15__codesystems_codesystems_component__["a" /* CodesystemsComponent */],
            __WEBPACK_IMPORTED_MODULE_16__codesystem_codesystem_component__["a" /* CodesystemComponent */],
            __WEBPACK_IMPORTED_MODULE_17__login_login_component__["a" /* LoginComponent */],
            __WEBPACK_IMPORTED_MODULE_19__structure_definitions_structure_definitions_component__["a" /* StructureDefinitionsComponent */],
            __WEBPACK_IMPORTED_MODULE_20__users_users_component__["a" /* UsersComponent */],
            __WEBPACK_IMPORTED_MODULE_21__user_user_component__["a" /* UserComponent */],
            __WEBPACK_IMPORTED_MODULE_24__fhir_edit_human_name_human_name_component__["a" /* HumanNameComponent */],
            __WEBPACK_IMPORTED_MODULE_25__fhir_edit_human_names_human_names_component__["a" /* HumanNamesComponent */],
            __WEBPACK_IMPORTED_MODULE_26__new_profile_new_profile_component__["a" /* NewProfileComponent */],
            __WEBPACK_IMPORTED_MODULE_29__fhir_edit_string_string_component__["a" /* StringComponent */],
            __WEBPACK_IMPORTED_MODULE_30__select_choice_modal_select_choice_modal_component__["a" /* SelectChoiceModalComponent */],
            __WEBPACK_IMPORTED_MODULE_31__element_definition_panel_element_definition_panel_component__["a" /* ElementDefinitionPanelComponent */],
            __WEBPACK_IMPORTED_MODULE_32__fhir_edit_element_definition_type_modal_element_definition_type_modal_component__["a" /* ElementDefinitionTypeModalComponent */],
            __WEBPACK_IMPORTED_MODULE_34__markdown_markdown_component__["a" /* MarkdownComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_9__angular_router__["d" /* RouterModule */].forRoot(appRoutes, { enableTracing: false } // <-- debugging purposes only
            ),
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["c" /* HttpClientModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_http__["HttpModule"],
            __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["c" /* NgbModule */].forRoot(),
            __WEBPACK_IMPORTED_MODULE_35_t_json_viewer__["a" /* TJsonViewerModule */]
        ],
        providers: [
            {
                provide: __WEBPACK_IMPORTED_MODULE_18_angular2_jwt__["AuthHttp"],
                useFactory: authHttpServiceFactory,
                deps: [__WEBPACK_IMPORTED_MODULE_4__angular_http__["Http"], __WEBPACK_IMPORTED_MODULE_4__angular_http__["RequestOptions"]]
            }, {
                provide: __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                useClass: AddHeaderInterceptor,
                multi: true
            },
            __WEBPACK_IMPORTED_MODULE_22__services_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_23__services_person_service__["a" /* PersonService */],
            __WEBPACK_IMPORTED_MODULE_27_angular2_cookie_core__["CookieService"],
            __WEBPACK_IMPORTED_MODULE_33__globals__["a" /* Globals */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "./src/app/codesystem/codesystem.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/codesystem/codesystem.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  codesystem works!\n</p>\n"

/***/ }),

/***/ "./src/app/codesystem/codesystem.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodesystemComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CodesystemComponent = (function () {
    function CodesystemComponent() {
    }
    CodesystemComponent.prototype.ngOnInit = function () {
    };
    return CodesystemComponent;
}());
CodesystemComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-codesystem',
        template: __webpack_require__("./src/app/codesystem/codesystem.component.html"),
        styles: [__webpack_require__("./src/app/codesystem/codesystem.component.css")]
    }),
    __metadata("design:paramtypes", [])
], CodesystemComponent);

//# sourceMappingURL=codesystem.component.js.map

/***/ }),

/***/ "./src/app/codesystems/codesystems.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/codesystems/codesystems.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  codesystems works!\n</p>\n"

/***/ }),

/***/ "./src/app/codesystems/codesystems.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodesystemsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var CodesystemsComponent = (function () {
    function CodesystemsComponent() {
    }
    CodesystemsComponent.prototype.ngOnInit = function () {
    };
    return CodesystemsComponent;
}());
CodesystemsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-codesystems',
        template: __webpack_require__("./src/app/codesystems/codesystems.component.html"),
        styles: [__webpack_require__("./src/app/codesystems/codesystems.component.css")]
    }),
    __metadata("design:paramtypes", [])
], CodesystemsComponent);

//# sourceMappingURL=codesystems.component.js.map

/***/ }),

/***/ "./src/app/element-definition-panel/element-definition-panel.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/element-definition-panel/element-definition-panel.component.html":
/***/ (function(module, exports) {

module.exports = "<fieldset [disabled]=\"disabled\">\n  <ngb-tabset justify=\"fill\">\n    <ngb-tab title=\"General\">\n      <ng-template ngbTabContent>\n        <div class=\"form-control\">\n          <label>ID/Path</label>\n          <div class=\"input-group\">\n            <input type=\"text\" class=\"form-control\" readonly=\"readonly\" [(ngModel)]=\"element.id\" />\n            <input type=\"text\" class=\"form-control\" readonly=\"readonly\" [(ngModel)]=\"element.path\" />\n          </div>\n        </div>\n\n        <div class=\"form-control\">\n          <label>\n            <input type=\"checkbox\" [ngModel]=\"element.hasOwnProperty('representation')\" (ngModelChange)=\"globals.toggleProperty(element, 'representation', 'xmlAttr')\" />\n            Representation\n            <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.representation']}}\" placement=\"top\"></i>\n          </label>\n          <select class=\"form-control\" [(ngModel)]=\"element.representation\" [disabled]=\"!element.hasOwnProperty('representation')\">\n            <option>xmlAttr</option>\n            <option>xmlText</option>\n            <option>typeAttr</option>\n            <option>cdaText</option>\n            <option>xhtml</option>\n          </select>\n        </div>\n\n        <!-- Code -->\n        <div class=\"form-control\">\n          <label>\n            <input type=\"checkbox\" [ngModel]=\"element.hasOwnProperty('code')\" (ngModelChange)=\"globals.toggleProperty(element, 'code', [])\" />\n            Code\n            <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.code']}}\" placement=\"top\"></i>\n          </label>\n          <div class=\"pull-right\" *ngIf=\"element.hasOwnProperty('code')\">\n            <i class=\"fa fa-plus\" title=\"Add a code\" (click)=\"element.code.push({})\"></i>\n          </div>\n          <div class=\"input-group\" *ngFor=\"let c of element.code; let i = index\" [attr.data-index]=\"i\">\n            <div class=\"input-group-addon\">\n              <input type=\"checkbox\" [ngModel]=\"c.hasOwnProperty('system')\" (ngModelChange)=\"globals.toggleProperty(c, 'system', '')\" />\n            </div>\n            <input type=\"text\" class=\"form-control\" placeholder=\"system\" [disabled]=\"!c.hasOwnProperty('system')\" [(ngModel)]=\"c.system\" />\n            <div class=\"input-group-addon\">\n              <input type=\"checkbox\" [ngModel]=\"c.hasOwnProperty('code')\" (ngModelChange)=\"globals.toggleProperty(c, 'code', '')\" />\n            </div>\n            <input type=\"text\" class=\"form-control\" placeholder=\"code\" [disabled]=\"!c.hasOwnProperty('code')\" [(ngModel)]=\"c.code\" />\n            <div class=\"input-group-addon\">\n              <input type=\"checkbox\" [ngModel]=\"c.hasOwnProperty('display')\" (ngModelChange)=\"globals.toggleProperty(c, 'display', '')\" />\n            </div>\n            <input type=\"text\" class=\"form-control\" placeholder=\"display\" [disabled]=\"!c.hasOwnProperty('display')\" [(ngModel)]=\"c.display\" />\n            <div class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-default clickable\" (click)=\"element.code.splice(i, 1)\" title=\"Remove this code\"><i class=\"fa fa-remove\"></i></button>\n            </div>\n          </div>\n          <div *ngIf=\"element.code && element.code.length == 0\">No codes</div>\n        </div>\n\n        <!-- Min -->\n        <div class=\"form-control\">\n          <label>\n            <input type=\"checkbox\" [ngModel]=\"element.hasOwnProperty('min')\" (ngModelChange)=\"globals.toggleProperty(element, 'min', elementTreeModel.min)\" />\n            Min\n            <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.min']}}\" placement=\"top\"></i>\n          </label>\n          <input type=\"number\" class=\"form-control\" [disabled]=\"!element.hasOwnProperty('min')\" [(ngModel)]=\"element.min\" />\n        </div>\n\n        <!-- Max -->\n        <div class=\"form-control\">\n          <label>\n            <input type=\"checkbox\" [ngModel]=\"element.hasOwnProperty('max')\" (ngModelChange)=\"globals.toggleProperty(element, 'max', elementTreeModel.max)\" />\n            Max\n            <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.max']}}\" placement=\"top\"></i>\n          </label>\n          <div class=\"input-group\">\n            <input type=\"number\" class=\"form-control\" [disabled]=\"!element.hasOwnProperty('max') || element.max === '*'\" [ngModel]=\"element.max\" (ngModelChange)=\"element.max=$event.toString()\" />\n            <div class=\"input-group-addon\">\n              <input type=\"checkbox\" [ngModel]=\"element.max === '*'\" (ngModelChange)=\"toggleMaxUnlimited()\" [disabled]=\"elementTreeModel.baseElement.max === '0' || elementTreeModel.baseElement.max === '1'\" /> Unlimited\n            </div>\n          </div>\n        </div>\n\n        <!-- Type -->\n        <div class=\"form-control\">\n          <label>\n            <input type=\"checkbox\" [ngModel]=\"element.hasOwnProperty('type')\" (ngModelChange)=\"globals.toggleProperty(element, 'type', [])\" />\n            Type\n            <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type']}}\" placement=\"top\"></i>\n          </label>\n          <div class=\"pull-right\" *ngIf=\"element.hasOwnProperty('type')\">\n            <i class=\"fa fa-plus clickable\" title=\"Add a type\" (click)=\"element.type.push({ code: 'Address' })\"></i>\n          </div>\n          <div class=\"input-group\" *ngFor=\"let t of element.type; let i = index\" [attr.data-index]=\"i\">\n            <select class=\"form-control\" [(ngModel)]=\"t.code\">\n              <option *ngFor=\"let o of globals.fhirDefinedTypes\">{{o}}</option>\n            </select>\n            <input type=\"text\" class=\"form-control\" readonly value=\"{{globals.getShortString(t.profile, false, 30) || globals.getShortString(t.targetProfile, false, 30)}}\" title=\"{{t.profile || t.targetProfile}}\" />\n            <div class=\"input-group-btn\">\n              <button type=\"button\" class=\"btn btn-default clickable\" (click)=\"openTypeModel(element, t)\"><i class=\"fa fa-edit\"></i></button>\n              <button type=\"button\" class=\"btn btn-default clickable\" (click)=\"element.type.splice(i, 1)\"><i class=\"fa fa-remove\"></i></button>\n            </div>\n          </div>\n          <div *ngIf=\"element.type && element.type.length == 0\">No types</div>\n        </div>\n\n        <div class=\"form-control\">\n          <label>Default Value</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Max Length</label>\n          <input type=\"number\" class=\"form-control\" />\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab title=\"Slicing\">\n      <ng-template ngbTabContent>\n        <div class=\"form-control\">\n          <label>Slice Name</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Slicing</label>\n          ...\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab title=\"Narrative\">\n      <ng-template ngbTabContent>\n        <div class=\"form-control\">\n          <label>Short</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Label</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Definition</label>\n          <textarea class=\"form-control\"></textarea>\n        </div>\n\n        <div class=\"form-control\">\n          <label>Comment</label>\n          <textarea class=\"form-control\"></textarea>\n        </div>\n\n        <div class=\"form-control\">\n          <label>Requirements</label>\n          <textarea class=\"form-control\"></textarea>\n        </div>\n\n        <div class=\"form-control\">\n          <label>Alias</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Meaning when missing</label>\n          <textarea class=\"form-control\"></textarea>\n        </div>\n\n        <div class=\"form-control\">\n          <label>Order meaning</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab title=\"Binding\">\n      <ng-template ngbTabContent>\n        <div class=\"form-control\">\n          <label>Binding</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Fixed</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Pattern</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Example</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Min Value</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Max Value</label>\n          ...\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab title=\"Extra\">\n      <ng-template ngbTabContent>\n        <div class=\"form-control\">\n          <label>Content Reference</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Condition</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Constraint</label>\n          ...\n        </div>\n\n        <div class=\"form-control\">\n          <label>Must Support</label>\n          <input type=\"checkbox\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Is Modifier?</label>\n          <input type=\"checkbox\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Is Modifier Reason</label>\n          <input type=\"text\" class=\"form-control\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Is Summary?</label>\n          <input type=\"checkbox\" />\n        </div>\n\n        <div class=\"form-control\">\n          <label>Mapping</label>\n          ...\n        </div>\n      </ng-template>\n    </ngb-tab>\n    <ngb-tab title=\"JSON\">\n      <ng-template ngbTabContent>\n        <pre>{{element | json}}</pre>\n      </ng-template>\n    </ngb-tab>\n  </ngb-tabset>\n</fieldset>"

/***/ }),

/***/ "./src/app/element-definition-panel/element-definition-panel.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ElementDefinitionPanelComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fhir_edit_element_definition_type_modal_element_definition_type_modal_component__ = __webpack_require__("./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__globals__ = __webpack_require__("./src/app/globals.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_element_tree_model__ = __webpack_require__("./src/app/models/element-tree-model.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ElementDefinitionPanelComponent = (function () {
    function ElementDefinitionPanelComponent(modalService, globals) {
        this.modalService = modalService;
        this.globals = globals;
        this.disabled = false;
    }
    Object.defineProperty(ElementDefinitionPanelComponent.prototype, "element", {
        get: function () {
            return this.elementTreeModel.constrainedElement;
        },
        enumerable: true,
        configurable: true
    });
    ElementDefinitionPanelComponent.prototype.toggleMaxUnlimited = function () {
        if (!this.element.hasOwnProperty('max')) {
            return;
        }
        if (this.element.max === '*') {
            this.element.max = '1';
        }
        else {
            this.element.max = '*';
        }
    };
    ElementDefinitionPanelComponent.prototype.openTypeModel = function (element, type) {
        var modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_2__fhir_edit_element_definition_type_modal_element_definition_type_modal_component__["a" /* ElementDefinitionTypeModalComponent */]);
        modalRef.componentInstance.element = element;
        modalRef.componentInstance.type = type;
    };
    ElementDefinitionPanelComponent.prototype.ngOnInit = function () {
    };
    return ElementDefinitionPanelComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__models_element_tree_model__["a" /* ElementTreeModel */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__models_element_tree_model__["a" /* ElementTreeModel */]) === "function" && _a || Object)
], ElementDefinitionPanelComponent.prototype, "elementTreeModel", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ElementDefinitionPanelComponent.prototype, "disabled", void 0);
ElementDefinitionPanelComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-element-definition-panel',
        template: __webpack_require__("./src/app/element-definition-panel/element-definition-panel.component.html"),
        styles: [__webpack_require__("./src/app/element-definition-panel/element-definition-panel.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__globals__["a" /* Globals */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__globals__["a" /* Globals */]) === "function" && _c || Object])
], ElementDefinitionPanelComponent);

var _a, _b, _c;
//# sourceMappingURL=element-definition-panel.component.js.map

/***/ }),

/***/ "./src/app/export/export.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/export/export.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Export</h1>\r\n\r\n<div class=\"alert alert-info\" *ngIf=\"message\">{{message}}</div>\r\n\r\n<select class=\"form-control\">\r\n  <option>Implementation Guide</option>\r\n</select>\r\n\r\n<footer class=\"footer\">\r\n  <button type=\"button\" class=\"btn btn-default\">Export</button>\r\n</footer>\r\n"

/***/ }),

/***/ "./src/app/export/export.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExportComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ExportComponent = (function () {
    function ExportComponent() {
    }
    ExportComponent.prototype.ngOnInit = function () {
    };
    return ExportComponent;
}());
ExportComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-export',
        template: __webpack_require__("./src/app/export/export.component.html"),
        styles: [__webpack_require__("./src/app/export/export.component.css")]
    }),
    __metadata("design:paramtypes", [])
], ExportComponent);

//# sourceMappingURL=export.component.js.map

/***/ }),

/***/ "./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n  <h4 class=\"modal-title\">{{element.path}}'s Type</h4>\n  <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss('Cross click')\">\n    <span aria-hidden=\"true\">&times;</span>\n  </button>\n</div>\n<div class=\"modal-body\">\n  <div class=\"form-group\">\n    <label>\n      Code\n      <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type.code']}}\" placement=\"top\"></i>\n    </label>\n    <select class=\"form-control\" [(ngModel)]=\"type.code\">\n      <option *ngFor=\"let o of globals.fhirDefinedTypes\">{{o}}</option>\n    </select>\n  </div>\n\n  <div class=\"form-group\">\n    <label>\n      <input type=\"checkbox\" [ngModel]=\"type.hasOwnProperty('profile')\" (ngModelChange)=\"globals.toggleProperty(type, 'profile', '')\" />\n      Profile\n      <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type.profile']}}\" placement=\"top\"></i>\n    </label>\n    <div class=\"input-group\">\n      <input type=\"text\" class=\"form-control\" [disabled]=\"!type.hasOwnProperty('profile')\" [(ngModel)]=\"type.profile\" />\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label>\n      <input type=\"checkbox\" [ngModel]=\"type.hasOwnProperty('targetProfile')\" (ngModelChange)=\"globals.toggleProperty(type, 'targetProfile', '')\" />\n      Target Profile\n      <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type.targetProfile']}}\" placement=\"top\"></i>\n    </label>\n    <div class=\"input-group\">\n      <input type=\"text\" class=\"form-control\" [disabled]=\"!type.hasOwnProperty('targetProfile')\" [(ngModel)]=\"type.targetProfile\" />\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label>\n      <input type=\"checkbox\" [ngModel]=\"type.hasOwnProperty('aggregation')\" (ngModelChange)=\"globals.toggleProperty(type, 'aggregation', 'contained')\" />\n      Aggregation\n      <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type.aggregation']}}\" placement=\"top\"></i>\n    </label>\n    <div class=\"input-group\">\n      <select class=\"form-control\" [disabled]=\"!type.hasOwnProperty('aggregation')\" [(ngModel)]=\"type.aggregation\">\n        <option>contained</option>\n        <option>referenced</option>\n        <option>bundled</option>\n      </select>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label>\n      <input type=\"checkbox\" [ngModel]=\"type.hasOwnProperty('versioning')\" (ngModelChange)=\"globals.toggleProperty(type, 'versioning', 'either')\" />\n      Versioning\n      <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['ed.type.versioning']}}\" placement=\"top\"></i>\n    </label>\n    <div class=\"input-group\">\n      <select class=\"form-control\" [disabled]=\"!type.hasOwnProperty('versioning')\" [(ngModel)]=\"type.versioning\">\n        <option>either</option>\n        <option>independent</option>\n        <option>specific</option>\n      </select>\n    </div>\n  </div>\n</div>\n<div class=\"modal-footer\">\n  <button type=\"button\" class=\"btn btn-outline-dark\" (click)=\"activeModal.close('Close click')\">Close</button>\n</div>"

/***/ }),

/***/ "./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ElementDefinitionTypeModalComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__globals__ = __webpack_require__("./src/app/globals.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ElementDefinitionTypeModalComponent = (function () {
    function ElementDefinitionTypeModalComponent(activeModal, globals) {
        this.activeModal = activeModal;
        this.globals = globals;
    }
    ElementDefinitionTypeModalComponent.prototype.ngOnInit = function () {
    };
    return ElementDefinitionTypeModalComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ElementDefinitionTypeModalComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], ElementDefinitionTypeModalComponent.prototype, "type", void 0);
ElementDefinitionTypeModalComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-element-definition-type-modal',
        template: __webpack_require__("./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.html"),
        styles: [__webpack_require__("./src/app/fhir-edit/element-definition-type-modal/element-definition-type-modal.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__globals__["a" /* Globals */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__globals__["a" /* Globals */]) === "function" && _b || Object])
], ElementDefinitionTypeModalComponent);

var _a, _b;
//# sourceMappingURL=element-definition-type-modal.component.js.map

/***/ }),

/***/ "./src/app/fhir-edit/human-name/human-name.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/fhir-edit/human-name/human-name.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  human-name works!\n</p>\n"

/***/ }),

/***/ "./src/app/fhir-edit/human-name/human-name.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HumanNameComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_fhir__ = __webpack_require__("./src/app/models/fhir.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HumanNameComponent = (function () {
    function HumanNameComponent() {
    }
    HumanNameComponent.prototype.initProperty = function (shouldInit) {
        if (!this.parent) {
            return;
        }
        if (shouldInit && !this.parent[this.property]) {
            this.parent[this.property] = new __WEBPACK_IMPORTED_MODULE_1__models_fhir__["a" /* HumanName */]();
        }
        else if (!shouldInit && this.parent[this.property]) {
            delete this.parent[this.property];
        }
    };
    return HumanNameComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], HumanNameComponent.prototype, "parent", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], HumanNameComponent.prototype, "property", void 0);
HumanNameComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'fhir-edit-human-name',
        template: __webpack_require__("./src/app/fhir-edit/human-name/human-name.component.html"),
        styles: [__webpack_require__("./src/app/fhir-edit/human-name/human-name.component.css")]
    }),
    __metadata("design:paramtypes", [])
], HumanNameComponent);

//# sourceMappingURL=human-name.component.js.map

/***/ }),

/***/ "./src/app/fhir-edit/human-names/human-names.component.css":
/***/ (function(module, exports) {

module.exports = "label {\r\n  font-weight: bold;\r\n}\r\n\r\nli {\r\n  padding-top: 5px;\r\n}\r\n\r\nli > .input-group {\r\n  margin-top: 2px;\r\n}\r\n\r\nul {\r\n  list-style-type: none;\r\n  padding-left: 0px;\r\n}\r\n"

/***/ }),

/***/ "./src/app/fhir-edit/human-names/human-names.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\r\n  <label>{{title}}</label>\r\n  <button type=\"button\" class=\"btn btn-default btn-sm\" *ngIf=\"humanNames\" (click)=\"initProperty(false)\">Exclude</button>\r\n  <button type=\"button\" class=\"btn btn-default btn-sm\" *ngIf=\"!humanNames\" (click)=\"initProperty(true)\">Include</button>\r\n  <button type=\"button\" class=\"btn btn-default btn-sm\" *ngIf=\"humanNames\" (click)=\"addName(true)\">Add Name</button>\r\n  <ul *ngIf=\"humanNames\">\r\n    <li *ngFor=\"let hn of humanNames; let hi = index\" [attr.data-index]=\"hi\">\r\n      <div *ngIf=\"hn.given\">\r\n        <div class=\"input-group\" *ngFor=\"let given of hn.given; index as gi; trackBy: trackByIndex\">\r\n          <div class=\"input-group-addon\">Given</div>\r\n          <input type=\"text\" class=\"form-control\" [(ngModel)]=\"hn.given[gi]\" />\r\n          <div class=\"input-group-btn\" *ngIf=\"gi === hn.given.length-1\">\r\n            <button type=\"button\" class=\"btn btn-default\" (click)=\"hn.given.push('')\"><i class=\"fa fa-plus\"></i></button>\r\n            <button type=\"button\" class=\"btn btn-default\" (click)=\"hn.given.splice(gi, 1)\"><i class=\"fa fa-trash\"></i></button>\r\n          </div>\r\n        </div>\r\n      </div>\r\n      <div class=\"input-group\" *ngIf=\"!hn.given || hn.given.length == 0\">\r\n        <div class=\"input-group-addon\">Given</div>\r\n        <input type=\"text\" class=\"form-control\" [disabled]=\"true\" />\r\n        <div class=\"input-group-btn\">\r\n          <button type=\"button\" class=\"btn btn-default\" (click)=\"addGiven(hn)\"><i class=\"fa fa-plus\"></i></button>\r\n        </div>\r\n      </div>\r\n      <div class=\"input-group\">\r\n        <div class=\"input-group-addon\">Family</div>\r\n        <input type=\"text\" class=\"form-control\" [(ngModel)]=\"hn.family\" />\r\n      </div>\r\n    </li>\r\n  </ul>\r\n</div>\r\n"

/***/ }),

/***/ "./src/app/fhir-edit/human-names/human-names.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HumanNamesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_fhir__ = __webpack_require__("./src/app/models/fhir.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HumanNamesComponent = (function () {
    function HumanNamesComponent() {
        this.title = 'Name';
    }
    HumanNamesComponent.prototype.initProperty = function (shouldInit) {
        if (!this.parent) {
            return;
        }
        if (shouldInit && !this.parent[this.property]) {
            this.parent[this.property] = [];
        }
        else if (!shouldInit && this.parent[this.property]) {
            delete this.parent[this.property];
        }
        this.updateHumanNames();
    };
    HumanNamesComponent.prototype.addName = function () {
        if (!this.humanNames) {
            return;
        }
        this.humanNames.push(new __WEBPACK_IMPORTED_MODULE_1__models_fhir__["a" /* HumanName */]());
    };
    HumanNamesComponent.prototype.updateHumanNames = function () {
        if (this.parent) {
            this.humanNames = this.parent[this.property];
        }
        else {
            this.humanNames = null;
        }
    };
    HumanNamesComponent.prototype.addGiven = function (humanName) {
        if (!humanName.given) {
            humanName.given = [];
        }
        humanName.given.push('');
    };
    HumanNamesComponent.prototype.ngOnChanges = function (changes) {
        this.updateHumanNames();
    };
    HumanNamesComponent.prototype.ngOnInit = function () {
        this.updateHumanNames();
    };
    HumanNamesComponent.prototype.trackByIndex = function (index, item) {
        return index;
    };
    return HumanNamesComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], HumanNamesComponent.prototype, "title", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], HumanNamesComponent.prototype, "parent", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], HumanNamesComponent.prototype, "property", void 0);
HumanNamesComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'fhir-edit-human-names',
        template: __webpack_require__("./src/app/fhir-edit/human-names/human-names.component.html"),
        styles: [__webpack_require__("./src/app/fhir-edit/human-names/human-names.component.css")]
    }),
    __metadata("design:paramtypes", [])
], HumanNamesComponent);

//# sourceMappingURL=human-names.component.js.map

/***/ }),

/***/ "./src/app/fhir-edit/string/string.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/fhir-edit/string/string.component.html":
/***/ (function(module, exports) {

module.exports = "<div [class.input-group]=\"!!title\">\r\n    <div class=\"input-group-addon\" *ngIf=\"!!title\">{{title}}</div>\r\n    <input type=\"text\" class=\"form-control\" [(ngModel)]=\"parent[property]\" />\r\n</div>"

/***/ }),

/***/ "./src/app/fhir-edit/string/string.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StringComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var StringComponent = (function () {
    function StringComponent() {
    }
    StringComponent.prototype.ngOnInit = function () {
    };
    return StringComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], StringComponent.prototype, "parent", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], StringComponent.prototype, "property", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], StringComponent.prototype, "title", void 0);
StringComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'fhir-edit-string',
        template: __webpack_require__("./src/app/fhir-edit/string/string.component.html"),
        styles: [__webpack_require__("./src/app/fhir-edit/string/string.component.css")]
    }),
    __metadata("design:paramtypes", [])
], StringComponent);

//# sourceMappingURL=string.component.js.map

/***/ }),

/***/ "./src/app/globals.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Globals; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Globals = (function () {
    function Globals() {
        this.fhirDefinedTypes = [
            'Address',
            'Age',
            'Annotation',
            'Attachment',
            'BackboneElement',
            'CodeableConcept',
            'Coding',
            'ContactDetail',
            'ContactPoint',
            'Contributor',
            'Count',
            'DataRequirement',
            'Distance',
            'Dosage',
            'Duration',
            'Element',
            'ElementDefinition',
            'Extension',
            'HumanName',
            'Identifier',
            'MarketingStatus',
            'Meta',
            'Money',
            'Narrative',
            'ParameterDefinition',
            'Period',
            'ProdCharacteristic',
            'ProductShelfLife',
            'Quantity',
            'Range',
            'Ratio',
            'Reference',
            'RelatedArtifact',
            'SampledData',
            'Signature',
            'SimpleQuantity',
            'SubstanceAmount',
            'SubstanceMoiety',
            'Timing',
            'TriggerDefinition',
            'UsageContext',
            'base64Binary',
            'boolean',
            'canonical',
            'code',
            'date',
            'dateTime',
            'decimal',
            'id',
            'instant',
            'integer',
            'markdown',
            'oid',
            'positiveInt',
            'string',
            'time',
            'unsignedInt',
            'uri',
            'url',
            'uuid',
            'xhtml',
            'Account',
            'ActivityDefinition',
            'AdverseEvent',
            'AllergyIntolerance',
            'Appointment',
            'AppointmentResponse',
            'AuditEvent',
            'Basic',
            'Binary',
            'BiologicallyDerivedProduct',
            'BodyStructure',
            'Bundle',
            'CapabilityStatement',
            'CarePlan',
            'CareTeam',
            'ChargeItem',
            'Claim',
            'ClaimResponse',
            'ClinicalImpression',
            'CodeSystem',
            'Communication',
            'CommunicationRequest',
            'CompartmentDefinition',
            'Composition',
            'ConceptMap',
            'Condition',
            'Consent',
            'Contract',
            'Coverage',
            'DetectedIssue',
            'Device',
            'DeviceComponent',
            'DeviceMetric',
            'DeviceRequest',
            'DeviceUseStatement',
            'DiagnosticReport',
            'DocumentManifest',
            'DocumentReference',
            'DomainResource',
            'EligibilityRequest',
            'EligibilityResponse',
            'Encounter',
            'Endpoint',
            'EnrollmentRequest',
            'EnrollmentResponse',
            'EntryDefinition',
            'EpisodeOfCare',
            'EventDefinition',
            'ExampleScenario',
            'ExpansionProfile',
            'ExplanationOfBenefit',
            'FamilyMemberHistory',
            'Flag',
            'Goal',
            'GraphDefinition',
            'Group',
            'GuidanceResponse',
            'HealthcareService',
            'ImagingStudy',
            'Immunization',
            'ImmunizationEvaluation',
            'ImmunizationRecommendation',
            'ImplementationGuide',
            'Invoice',
            'ItemInstance',
            'Library',
            'Linkage',
            'List',
            'Location',
            'Measure',
            'MeasureReport',
            'Media',
            'Medication',
            'MedicationAdministration',
            'MedicationDispense',
            'MedicationKnowledge',
            'MedicationRequest',
            'MedicationStatement',
            'MedicinalProduct',
            'MedicinalProductAuthorization',
            'MedicinalProductClinicals',
            'MedicinalProductDeviceSpec',
            'MedicinalProductIngredient',
            'MedicinalProductPackaged',
            'MedicinalProductPharmaceutical',
            'MessageDefinition',
            'MessageHeader',
            'NamingSystem',
            'NutritionOrder',
            'Observation',
            'ObservationDefinition',
            'OccupationalData',
            'OperationDefinition',
            'OperationOutcome',
            'Organization',
            'OrganizationRole',
            'Parameters',
            'Patient',
            'PaymentNotice',
            'PaymentReconciliation',
            'Person',
            'PlanDefinition',
            'Practitioner',
            'PractitionerRole',
            'Procedure',
            'ProcessRequest',
            'ProcessResponse',
            'ProductPlan',
            'Provenance',
            'Questionnaire',
            'QuestionnaireResponse',
            'RelatedPerson',
            'RequestGroup',
            'ResearchStudy',
            'ResearchSubject',
            'Resource',
            'RiskAssessment',
            'Schedule',
            'SearchParameter',
            'Sequence',
            'ServiceRequest',
            'Slot',
            'Specimen',
            'SpecimenDefinition',
            'StructureDefinition',
            'StructureMap',
            'Subscription',
            'Substance',
            'SubstancePolymer',
            'SubstanceReferenceInformation',
            'SubstanceSpecification',
            'SupplyDelivery',
            'SupplyRequest',
            'Task',
            'TerminologyCapabilities',
            'TestReport',
            'TestScript',
            'UserSession',
            'ValueSet',
            'VerificationResult',
            'VisionPrescription'
        ];
        this.tooltips = {
            'resource.id': 'The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.',
            'sd.name': 'A natural language name identifying the structure definition. This name should be usable as an identifier for the module by machine processing applications such as code generation.',
            'sd.url': 'An absolute URI that is used to identify this structure definition when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which this structure definition is (or will be) published.',
            'sd.title': 'A short, descriptive, user-friendly title for the structure definition.',
            'sd.date': 'The date (and optionally time) when the structure definition was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the structure definition changes.',
            'sd.publisher': 'The name of the organization or individual that published the structure definition.',
            'sd.description': 'A free text natural language description of the structure definition from a consumer\'s perspective.',
            'sd.version': 'The identifier that is used to identify this version of the structure definition when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the structure definition author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.',
            'sd.status': 'The status of this structure definition. Enables tracking the life-cycle of the content.',
            'sd.experimental': 'A Boolean value to indicate that this structure definition is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage.',
            'ed.representation': 'Codes that define how this element is ' +
                'represented in instances, when the deviation varies from the normal case.',
            'ed.code': 'A code that has the same meaning as the element in a particular terminology.',
            'ed.min': 'The minimum number of times this element SHALL appear in the instance.',
            'ed.max': 'The maximum number of times this element is permitted to appear in the instance.',
            'ed.type': 'The data type or resource that the value of this element is permitted to be.',
            'ed.type.code': 'URL of Data type or Resource that is a(or the) type used for this element. References are URLs that are relative to http://hl7.org/fhir/StructureDefinition e.g. "string" is a reference to http://hl7.org/fhir/StructureDefinition/string. Absolute URLs are only allowed in logical models.',
            'ed.type.profile': 'Identifies a profile structure or implementation Guide that applies to the datatype this element refers to. If any profiles are specified, then the content must conform to at least one of them. The URL can be a local reference - to a contained StructureDefinition, or a reference to another StructureDefinition or Implementation Guide by a canonical URL. When an implementation guide is specified, the type SHALL conform to at least one profile defined in the implementation guide.',
            'ed.type.targetProfile': 'Used when the type is "Reference", and Identifies a profile structure or implementation Guide that applies to the target of the reference this element refers to. If any profiles are specified, then the content must conform to at least one of them. The URL can be a local reference - to a contained StructureDefinition, or a reference to another StructureDefinition or Implementation Guide by a canonical URL. When an implementation guide is specified, the target resource SHALL conform to at least one profile defined in the implementation guide.',
            'ed.type.aggregation': 'If the type is a reference to another resource, how the resource is or can be aggregated - is it a contained resource, or a reference, and if the context is a bundle, is it included in the bundle.',
            'ed.type.versioning': 'Whether this reference needs to be version specific or version independent, or whether either can be used.'
        };
    }
    Globals.prototype.toggleProperty = function (parent, propertyName, defaultValue) {
        if (parent.hasOwnProperty(propertyName)) {
            delete parent[propertyName];
        }
        else {
            parent[propertyName] = defaultValue;
        }
    };
    Globals.prototype.getShortString = function (theString, pre, length) {
        if (pre === void 0) { pre = true; }
        if (length === void 0) { length = 20; }
        if (theString && theString.length > length) {
            if (pre) {
                return theString.substring(0, length) + '...';
            }
            else {
                return '...' + theString.substring(theString.length - length);
            }
        }
        return theString;
    };
    return Globals;
}());
Globals = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], Globals);

//# sourceMappingURL=globals.js.map

/***/ }),

/***/ "./src/app/home/home.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/home/home.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Welcome to Trifolia on FHIR!</h1>\r\n\r\n<p>Trifolia on FHIR is ....</p>\r\n"

/***/ }),

/***/ "./src/app/home/home.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeComponent = (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-home',
        template: __webpack_require__("./src/app/home/home.component.html"),
        styles: [__webpack_require__("./src/app/home/home.component.css")]
    }),
    __metadata("design:paramtypes", [])
], HomeComponent);

//# sourceMappingURL=home.component.js.map

/***/ }),

/***/ "./src/app/implementation-guide/implementation-guide.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/implementation-guide/implementation-guide.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  implementation-guide works!\n</p>\n"

/***/ }),

/***/ "./src/app/implementation-guide/implementation-guide.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImplementationGuideComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ImplementationGuideComponent = (function () {
    function ImplementationGuideComponent() {
    }
    ImplementationGuideComponent.prototype.ngOnInit = function () {
    };
    return ImplementationGuideComponent;
}());
ImplementationGuideComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-implementation-guide',
        template: __webpack_require__("./src/app/implementation-guide/implementation-guide.component.html"),
        styles: [__webpack_require__("./src/app/implementation-guide/implementation-guide.component.css")]
    }),
    __metadata("design:paramtypes", [])
], ImplementationGuideComponent);

//# sourceMappingURL=implementation-guide.component.js.map

/***/ }),

/***/ "./src/app/implementation-guides/implementation-guides.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/implementation-guides/implementation-guides.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Implementation Guides</h1>\r\n\r\n<table class=\"table table-striped\">\r\n  <thead>\r\n    <tr>\r\n      <th>Name</th>\r\n      <th>Type</th>\r\n      <th>\r\n        <div class=\"pull-right\">\r\n          <button type=\"button\" class=\"btn btn-default\">Add</button>\r\n        </div>\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr *ngFor=\"let ig of implementationGuides\">\r\n      <td>{{ig.name}}</td>\r\n      <td>{{ig.type}}</td>\r\n      <td>\r\n        <div class=\"pull-right\">\r\n          <a class=\"btn btn-default\" routerLink=\"/implementation-guide/{{ig.id}}\">Edit</a>\r\n        </div>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n  <tfoot>\r\n    <tr>\r\n      <td colspan=\"3\">{{implementationGuides.length}} total implementation guides</td>\r\n    </tr>\r\n  </tfoot>\r\n</table>\r\n"

/***/ }),

/***/ "./src/app/implementation-guides/implementation-guides.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImplementationGuidesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_implementation_guide_service__ = __webpack_require__("./src/app/services/implementation-guide.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_config_service__ = __webpack_require__("./src/app/services/config.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ImplementationGuidesComponent = (function () {
    function ImplementationGuidesComponent(igService, configService) {
        this.igService = igService;
        this.configService = configService;
        this.implementationGuides = [];
    }
    ImplementationGuidesComponent.prototype.getImplementationGuides = function () {
        var _this = this;
        this.implementationGuides = [];
        this.configService.setStatusMessage('Loading implementation guides');
        this.igService.getImplementationGuides(undefined)
            .subscribe(function (res) {
            _this.implementationGuides = res;
            _this.configService.setStatusMessage('');
        }, function (err) {
            _this.configService.setStatusMessage('Error loading implementation guides: ' + err);
        });
    };
    ImplementationGuidesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getImplementationGuides();
        this.configService.fhirServerChanged.subscribe(function (fhirServer) { return _this.getImplementationGuides(); });
    };
    return ImplementationGuidesComponent;
}());
ImplementationGuidesComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-implementation-guides',
        template: __webpack_require__("./src/app/implementation-guides/implementation-guides.component.html"),
        styles: [__webpack_require__("./src/app/implementation-guides/implementation-guides.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_implementation_guide_service__["a" /* ImplementationGuideService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_implementation_guide_service__["a" /* ImplementationGuideService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_implementation_guide_service__["a" /* ImplementationGuideService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_config_service__["a" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_config_service__["a" /* ConfigService */]) === "function" && _b || Object])
], ImplementationGuidesComponent);

var _a, _b;
//# sourceMappingURL=implementation-guides.component.js.map

/***/ }),

/***/ "./src/app/import/import.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/import/import.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  import works!\n</p>\n"

/***/ }),

/***/ "./src/app/import/import.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImportComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ImportComponent = (function () {
    function ImportComponent() {
    }
    ImportComponent.prototype.ngOnInit = function () {
    };
    return ImportComponent;
}());
ImportComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-import',
        template: __webpack_require__("./src/app/import/import.component.html"),
        styles: [__webpack_require__("./src/app/import/import.component.css")]
    }),
    __metadata("design:paramtypes", [])
], ImportComponent);

//# sourceMappingURL=import.component.js.map

/***/ }),

/***/ "./src/app/login/login.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/login/login.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  login works!\n</p>\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_auth_service__ = __webpack_require__("./src/app/services/auth.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LoginComponent = (function () {
    function LoginComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        console.log('test');
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.authService.handleAuthentication();
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-login',
        template: __webpack_require__("./src/app/login/login.component.html"),
        styles: [__webpack_require__("./src/app/login/login.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_auth_service__["a" /* AuthService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_router__["c" /* Router */]) === "function" && _b || Object])
], LoginComponent);

var _a, _b;
//# sourceMappingURL=login.component.js.map

/***/ }),

/***/ "./src/app/markdown/markdown.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/markdown/markdown.component.html":
/***/ (function(module, exports) {

module.exports = "<textarea #simplemde></textarea>"

/***/ }),

/***/ "./src/app/markdown/markdown.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export NgModelBase */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MarkdownComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_simplemde__ = __webpack_require__("./node_modules/simplemde/src/js/simplemde.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_simplemde___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_simplemde__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MARKDOWN_CONTROL_VALUE_ACCESSOR = {
    provide: __WEBPACK_IMPORTED_MODULE_2__angular_forms__["c" /* NG_VALUE_ACCESSOR */],
    useExisting: Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["forwardRef"])(function () { return MarkdownComponent; }),
    multi: true
};
var NgModelBase = (function () {
    function NgModelBase() {
    }
    Object.defineProperty(NgModelBase.prototype, "value", {
        get: function () {
            return this._innerValue;
        },
        set: function (v) {
            if (v !== this._innerValue) {
                this._innerValue = v;
                this.onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    NgModelBase.prototype.writeValue = function (v) {
        if (v !== this._innerValue) {
            this._innerValue = v;
        }
    };
    NgModelBase.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    NgModelBase.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return NgModelBase;
}());

var MarkdownComponent = (function (_super) {
    __extends(MarkdownComponent, _super);
    function MarkdownComponent() {
        var _this = _super.call(this) || this;
        _this.tmpValue = null;
        return _this;
    }
    MarkdownComponent.prototype.writeValue = function (v) {
        if (v !== this._innerValue) {
            this._innerValue = v;
            if (this.simplemde && this.value != null) {
                this.simplemde.value(this.value);
            }
            if (!this.simplemde) {
                this.tmpValue = this.value;
            }
        }
    };
    MarkdownComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var config = {
            element: this.textarea.nativeElement
        };
        this.simplemde = new __WEBPACK_IMPORTED_MODULE_1_simplemde__(config);
        if (this.tmpValue) {
            this.simplemde.value(this.tmpValue);
            this.tmpValue = null;
        }
        this.simplemde.codemirror.on('change', function () {
            _this.value = _this.simplemde.value();
        });
    };
    MarkdownComponent.prototype.ngOnDestroy = function () {
        this.simplemde = null;
    };
    return MarkdownComponent;
}(NgModelBase));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('simplemde'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === "function" && _a || Object)
], MarkdownComponent.prototype, "textarea", void 0);
MarkdownComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-markdown',
        template: __webpack_require__("./src/app/markdown/markdown.component.html"),
        styles: [__webpack_require__("./src/app/markdown/markdown.component.css")],
        providers: [MARKDOWN_CONTROL_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [])
], MarkdownComponent);

var _a;
//# sourceMappingURL=markdown.component.js.map

/***/ }),

/***/ "./src/app/models/element-tree-model.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ElementTreeModel; });
var ElementTreeModel = (function () {
    function ElementTreeModel(id) {
        this.tabs = '';
        this.id = id;
    }
    ElementTreeModel.prototype.setFields = function (baseElement, depth, hasChildren, constrainedElement) {
        this.id = baseElement.path.substring(baseElement.path.lastIndexOf('.') + 1);
        this.baseElement = baseElement;
        this.depth = depth;
        this.hasChildren = hasChildren;
        for (var x = 1; x < this.depth; x++) {
            this.tabs += '    ';
        }
    };
    Object.defineProperty(ElementTreeModel.prototype, "min", {
        get: function () {
            if (this.constrainedElement && this.constrainedElement.hasOwnProperty('min')) {
                return this.constrainedElement.min;
            }
            return this.baseElement.min;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ElementTreeModel.prototype, "max", {
        get: function () {
            if (this.constrainedElement && this.constrainedElement.hasOwnProperty('max')) {
                return this.constrainedElement.max;
            }
            return this.baseElement.max;
        },
        enumerable: true,
        configurable: true
    });
    ElementTreeModel.prototype.getBindingDisplay = function (element) {
        if (!element.binding) {
            return '';
        }
        if (element.binding.strength && element.binding.valueSet) {
            return element.binding.strength + ' ' + element.binding.valueSet.toString();
        }
        else if (element.binding.valueSet) {
            return element.binding.valueSet.toString();
        }
    };
    Object.defineProperty(ElementTreeModel.prototype, "binding", {
        get: function () {
            if (this.constrainedElement) {
                return this.getBindingDisplay(this.constrainedElement);
            }
            return this.getBindingDisplay(this.baseElement);
        },
        enumerable: true,
        configurable: true
    });
    return ElementTreeModel;
}());

//# sourceMappingURL=element-tree-model.js.map

/***/ }),

/***/ "./src/app/models/fhir.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Base */
/* unused harmony export Element */
/* unused harmony export Extension */
/* unused harmony export Coding */
/* unused harmony export Meta */
/* unused harmony export Resource */
/* unused harmony export Narrative */
/* unused harmony export DomainResource */
/* unused harmony export CodeableConcept */
/* unused harmony export Period */
/* unused harmony export ResourceReference */
/* unused harmony export Identifier */
/* unused harmony export ContactPoint */
/* unused harmony export ContactDetail */
/* unused harmony export UsageContext */
/* unused harmony export BackboneElement */
/* unused harmony export MappingComponent */
/* unused harmony export DiscriminatorComponent */
/* unused harmony export SlicingComponent */
/* unused harmony export BaseComponent */
/* unused harmony export TypeRefComponent */
/* unused harmony export ExampleComponent */
/* unused harmony export ConstraintComponent */
/* unused harmony export ElementDefinitionBindingComponent */
/* unused harmony export ElementDefinition */
/* unused harmony export SnapshotComponent */
/* unused harmony export DifferentialComponent */
/* unused harmony export StructureDefinition */
/* unused harmony export ParameterComponent */
/* unused harmony export Parameters */
/* unused harmony export Query */
/* unused harmony export LinkComponent */
/* unused harmony export SearchComponent */
/* unused harmony export RequestComponent */
/* unused harmony export ResponseComponent */
/* unused harmony export EntryComponent */
/* unused harmony export ResourceEntry */
/* unused harmony export Flag */
/* unused harmony export Alert */
/* unused harmony export Quantity */
/* unused harmony export SimpleQuantity */
/* unused harmony export Range */
/* unused harmony export ReferenceRangeComponent */
/* unused harmony export RelatedComponent */
/* unused harmony export ComponentComponent */
/* unused harmony export Observation */
/* unused harmony export Binary */
/* unused harmony export Signature */
/* unused harmony export Bundle */
/* unused harmony export BundleExtensions */
/* unused harmony export FilterComponent */
/* unused harmony export PropertyComponent */
/* unused harmony export DesignationComponent */
/* unused harmony export ConceptPropertyComponent */
/* unused harmony export ConceptDefinitionComponent */
/* unused harmony export CodeSystem */
/* unused harmony export CodeSystemExtensions */
/* unused harmony export OtherElementComponent */
/* unused harmony export TargetElementComponent */
/* unused harmony export SourceElementComponent */
/* unused harmony export UnmappedComponent */
/* unused harmony export GroupComponent */
/* unused harmony export ConceptMap */
/* unused harmony export ElementDefinitionExtensions */
/* unused harmony export Money */
/* unused harmony export CoverageComponent */
/* unused harmony export GuarantorComponent */
/* unused harmony export Account */
/* unused harmony export Contributor */
/* unused harmony export Attachment */
/* unused harmony export RelatedArtifact */
/* unused harmony export ParticipantComponent */
/* unused harmony export RepeatComponent */
/* unused harmony export Timing */
/* unused harmony export Ratio */
/* unused harmony export Dosage */
/* unused harmony export DynamicValueComponent */
/* unused harmony export ActivityDefinition */
/* unused harmony export Address */
/* unused harmony export SuspectEntityComponent */
/* unused harmony export AdverseEvent */
/* unused harmony export Age */
/* unused harmony export Annotation */
/* unused harmony export ReactionComponent */
/* unused harmony export AllergyIntolerance */
/* unused harmony export Appointment */
/* unused harmony export AppointmentResponse */
/* unused harmony export NetworkComponent */
/* unused harmony export AgentComponent */
/* unused harmony export SourceComponent */
/* unused harmony export DetailComponent */
/* unused harmony export EntityComponent */
/* unused harmony export AuditEvent */
/* unused harmony export Basic */
/* unused harmony export BodySite */
/* unused harmony export SoftwareComponent */
/* unused harmony export ImplementationComponent */
/* unused harmony export CertificateComponent */
/* unused harmony export SecurityComponent */
/* unused harmony export ResourceInteractionComponent */
/* unused harmony export SearchParamComponent */
/* unused harmony export ResourceComponent */
/* unused harmony export SystemInteractionComponent */
/* unused harmony export OperationComponent */
/* unused harmony export RestComponent */
/* unused harmony export EndpointComponent */
/* unused harmony export SupportedMessageComponent */
/* unused harmony export EventComponent */
/* unused harmony export MessagingComponent */
/* unused harmony export DocumentComponent */
/* unused harmony export CapabilityStatement */
/* unused harmony export ActivityComponent */
/* unused harmony export CarePlan */
/* unused harmony export CareTeam */
/* unused harmony export ChargeItem */
/* unused harmony export RelatedClaimComponent */
/* unused harmony export PayeeComponent */
/* unused harmony export CareTeamComponent */
/* unused harmony export SpecialConditionComponent */
/* unused harmony export DiagnosisComponent */
/* unused harmony export ProcedureComponent */
/* unused harmony export InsuranceComponent */
/* unused harmony export AccidentComponent */
/* unused harmony export ItemComponent */
/* unused harmony export Claim */
/* unused harmony export AdjudicationComponent */
/* unused harmony export AddedItemsDetailComponent */
/* unused harmony export AddedItemComponent */
/* unused harmony export ErrorComponent */
/* unused harmony export PaymentComponent */
/* unused harmony export NoteComponent */
/* unused harmony export ClaimResponse */
/* unused harmony export InvestigationComponent */
/* unused harmony export FindingComponent */
/* unused harmony export ClinicalImpression */
/* unused harmony export PayloadComponent */
/* unused harmony export Communication */
/* unused harmony export RequesterComponent */
/* unused harmony export CommunicationRequest */
/* unused harmony export CompartmentDefinition */
/* unused harmony export AttesterComponent */
/* unused harmony export RelatesToComponent */
/* unused harmony export SectionComponent */
/* unused harmony export Composition */
/* unused harmony export StageComponent */
/* unused harmony export EvidenceComponent */
/* unused harmony export Condition */
/* unused harmony export ActorComponent */
/* unused harmony export PolicyComponent */
/* unused harmony export DataComponent */
/* unused harmony export ExceptActorComponent */
/* unused harmony export ExceptDataComponent */
/* unused harmony export ExceptComponent */
/* unused harmony export Consent */
/* unused harmony export SignatoryComponent */
/* unused harmony export ValuedItemComponent */
/* unused harmony export TermAgentComponent */
/* unused harmony export TermValuedItemComponent */
/* unused harmony export TermComponent */
/* unused harmony export FriendlyLanguageComponent */
/* unused harmony export LegalLanguageComponent */
/* unused harmony export ComputableLanguageComponent */
/* unused harmony export Contract */
/* unused harmony export Count */
/* unused harmony export Coverage */
/* unused harmony export DataElement */
/* unused harmony export CodeFilterComponent */
/* unused harmony export DateFilterComponent */
/* unused harmony export DataRequirement */
/* unused harmony export MitigationComponent */
/* unused harmony export DetectedIssue */
/* unused harmony export UdiComponent */
/* unused harmony export Device */
/* unused harmony export ProductionSpecificationComponent */
/* unused harmony export DeviceComponent */
/* unused harmony export CalibrationComponent */
/* unused harmony export DeviceMetric */
/* unused harmony export DeviceRequest */
/* unused harmony export DeviceUseStatement */
/* unused harmony export PerformerComponent */
/* unused harmony export ImageComponent */
/* unused harmony export DiagnosticReport */
/* unused harmony export Distance */
/* unused harmony export ContentComponent */
/* unused harmony export DocumentManifest */
/* unused harmony export ContextComponent */
/* unused harmony export DocumentReference */
/* unused harmony export Duration */
/* unused harmony export EligibilityRequest */
/* unused harmony export ErrorsComponent */
/* unused harmony export EligibilityResponse */
/* unused harmony export StatusHistoryComponent */
/* unused harmony export ClassHistoryComponent */
/* unused harmony export HospitalizationComponent */
/* unused harmony export LocationComponent */
/* unused harmony export Encounter */
/* unused harmony export Endpoint */
/* unused harmony export EnrollmentRequest */
/* unused harmony export EnrollmentResponse */
/* unused harmony export EpisodeOfCare */
/* unused harmony export FixedVersionComponent */
/* unused harmony export ExcludedSystemComponent */
/* unused harmony export ExpansionProfile */
/* unused harmony export SupportingInformationComponent */
/* unused harmony export BenefitComponent */
/* unused harmony export BenefitBalanceComponent */
/* unused harmony export ExplanationOfBenefit */
/* unused harmony export ConditionComponent */
/* unused harmony export FamilyMemberHistory */
/* unused harmony export TargetComponent */
/* unused harmony export Goal */
/* unused harmony export GraphDefinition */
/* unused harmony export CharacteristicComponent */
/* unused harmony export MemberComponent */
/* unused harmony export Group */
/* unused harmony export GuidanceResponse */
/* unused harmony export AvailableTimeComponent */
/* unused harmony export NotAvailableComponent */
/* unused harmony export HealthcareService */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HumanName; });
/* unused harmony export InstanceComponent */
/* unused harmony export SeriesComponent */
/* unused harmony export StudyComponent */
/* unused harmony export ImagingManifest */
/* unused harmony export ImagingStudy */
/* unused harmony export PractitionerComponent */
/* unused harmony export ExplanationComponent */
/* unused harmony export VaccinationProtocolComponent */
/* unused harmony export Immunization */
/* unused harmony export DateCriterionComponent */
/* unused harmony export ProtocolComponent */
/* unused harmony export RecommendationComponent */
/* unused harmony export ImmunizationRecommendation */
/* unused harmony export DependencyComponent */
/* unused harmony export PackageComponent */
/* unused harmony export GlobalComponent */
/* unused harmony export PageComponent */
/* unused harmony export ImplementationGuide */
/* unused harmony export ParameterDefinition */
/* unused harmony export Library */
/* unused harmony export Linkage */
/* unused harmony export List */
/* unused harmony export PositionComponent */
/* unused harmony export Location */
/* unused harmony export SupplementalDataComponent */
/* unused harmony export Measure */
/* unused harmony export MeasureReport */
/* unused harmony export Media */
/* unused harmony export IngredientComponent */
/* unused harmony export Medication */
/* unused harmony export DosageComponent */
/* unused harmony export MedicationAdministration */
/* unused harmony export SubstitutionComponent */
/* unused harmony export MedicationDispense */
/* unused harmony export DispenseRequestComponent */
/* unused harmony export MedicationRequest */
/* unused harmony export MedicationStatement */
/* unused harmony export FocusComponent */
/* unused harmony export AllowedResponseComponent */
/* unused harmony export MessageDefinition */
/* unused harmony export MessageDestinationComponent */
/* unused harmony export MessageSourceComponent */
/* unused harmony export MessageHeader */
/* unused harmony export UniqueIdComponent */
/* unused harmony export NamingSystem */
/* unused harmony export NutrientComponent */
/* unused harmony export TextureComponent */
/* unused harmony export OralDietComponent */
/* unused harmony export SupplementComponent */
/* unused harmony export AdministrationComponent */
/* unused harmony export EnteralFormulaComponent */
/* unused harmony export NutritionOrder */
/* unused harmony export OverloadComponent */
/* unused harmony export OperationDefinition */
/* unused harmony export IssueComponent */
/* unused harmony export OperationOutcome */
/* unused harmony export ContactComponent */
/* unused harmony export Organization */
/* unused harmony export AnimalComponent */
/* unused harmony export CommunicationComponent */
/* unused harmony export Patient */
/* unused harmony export PaymentNotice */
/* unused harmony export DetailsComponent */
/* unused harmony export NotesComponent */
/* unused harmony export PaymentReconciliation */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Person; });
/* unused harmony export GoalComponent */
/* unused harmony export TriggerDefinition */
/* unused harmony export RelatedActionComponent */
/* unused harmony export ActionComponent */
/* unused harmony export PlanDefinition */
/* unused harmony export QualificationComponent */
/* unused harmony export Practitioner */
/* unused harmony export PractitionerRole */
/* unused harmony export FocalDeviceComponent */
/* unused harmony export Procedure */
/* unused harmony export ProcedureRequest */
/* unused harmony export ItemsComponent */
/* unused harmony export ProcessRequest */
/* unused harmony export ProcessNoteComponent */
/* unused harmony export ProcessResponse */
/* unused harmony export Provenance */
/* unused harmony export Questionnaire */
/* unused harmony export QuestionnaireResponse */
/* unused harmony export ReferralRequest */
/* unused harmony export RelatedPerson */
/* unused harmony export RequestGroup */
/* unused harmony export ArmComponent */
/* unused harmony export ResearchStudy */
/* unused harmony export ResearchSubject */
/* unused harmony export PredictionComponent */
/* unused harmony export RiskAssessment */
/* unused harmony export SampledData */
/* unused harmony export Schedule */
/* unused harmony export SearchParameter */
/* unused harmony export ReferenceSeqComponent */
/* unused harmony export VariantComponent */
/* unused harmony export QualityComponent */
/* unused harmony export RepositoryComponent */
/* unused harmony export Sequence */
/* unused harmony export ServiceDefinition */
/* unused harmony export Slot */
/* unused harmony export CollectionComponent */
/* unused harmony export ProcessingComponent */
/* unused harmony export ContainerComponent */
/* unused harmony export Specimen */
/* unused harmony export StructureComponent */
/* unused harmony export StructureMap */
/* unused harmony export ChannelComponent */
/* unused harmony export Subscription */
/* unused harmony export Substance */
/* unused harmony export SuppliedItemComponent */
/* unused harmony export SupplyDelivery */
/* unused harmony export OrderedItemComponent */
/* unused harmony export SupplyRequest */
/* unused harmony export RestrictionComponent */
/* unused harmony export OutputComponent */
/* unused harmony export Task */
/* unused harmony export ModelInfo */
/* unused harmony export AssertComponent */
/* unused harmony export SetupActionComponent */
/* unused harmony export SetupComponent */
/* unused harmony export TestActionComponent */
/* unused harmony export TestComponent */
/* unused harmony export TeardownActionComponent */
/* unused harmony export TeardownComponent */
/* unused harmony export TestReport */
/* unused harmony export OriginComponent */
/* unused harmony export DestinationComponent */
/* unused harmony export CapabilityComponent */
/* unused harmony export MetadataComponent */
/* unused harmony export FixtureComponent */
/* unused harmony export VariableComponent */
/* unused harmony export RuleParamComponent */
/* unused harmony export RuleComponent */
/* unused harmony export RulesetRuleParamComponent */
/* unused harmony export RulesetRuleComponent */
/* unused harmony export RulesetComponent */
/* unused harmony export TestScript */
/* unused harmony export ConceptReferenceComponent */
/* unused harmony export ConceptSetComponent */
/* unused harmony export ComposeComponent */
/* unused harmony export ContainsComponent */
/* unused harmony export ExpansionComponent */
/* unused harmony export ValueSet */
/* unused harmony export DispenseComponent */
/* unused harmony export VisionPrescription */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Base = (function () {
    function Base(obj) {
        if (obj) {
            if (obj.fhir_comments) {
                this.fhir_comments = obj.fhir_comments;
            }
        }
    }
    return Base;
}());

var Element = (function (_super) {
    __extends(Element, _super);
    function Element(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.id) {
                _this.id = obj.id;
            }
            if (obj.extension) {
                _this.extension = [];
                for (var _i = 0, _a = obj.extension || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.extension.push(new Extension(o));
                }
            }
        }
        return _this;
    }
    return Element;
}(Base));

var Extension = (function (_super) {
    __extends(Extension, _super);
    function Extension(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return Extension;
}(Element));

var Coding = (function (_super) {
    __extends(Coding, _super);
    function Coding(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.userSelected) {
                _this.userSelected = obj.userSelected;
            }
        }
        return _this;
    }
    return Coding;
}(Element));

var Meta = (function (_super) {
    __extends(Meta, _super);
    function Meta(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.versionId) {
                _this.versionId = obj.versionId;
            }
            if (obj.lastUpdated) {
                _this.lastUpdated = new Date(obj.lastUpdated);
            }
            if (obj.profile) {
                _this.profile = obj.profile;
            }
            if (obj.security) {
                _this.security = [];
                for (var _i = 0, _a = obj.security || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.security.push(new Coding(o));
                }
            }
            if (obj.tag) {
                _this.tag = [];
                for (var _b = 0, _c = obj.tag || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.tag.push(new Coding(o));
                }
            }
        }
        return _this;
    }
    return Meta;
}(Element));

var Resource = (function (_super) {
    __extends(Resource, _super);
    function Resource(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.id) {
                _this.id = obj.id;
            }
            if (obj.meta) {
                _this.meta = new Meta(obj.meta);
            }
            if (obj.implicitRules) {
                _this.implicitRules = obj.implicitRules;
            }
            if (obj.language) {
                _this.language = obj.language;
            }
        }
        return _this;
    }
    return Resource;
}(Base));

var Narrative = (function (_super) {
    __extends(Narrative, _super);
    function Narrative(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.div) {
                _this.div = obj.div;
            }
        }
        return _this;
    }
    return Narrative;
}(Element));

var DomainResource = (function (_super) {
    __extends(DomainResource, _super);
    function DomainResource(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DomainResource';
        if (obj) {
            if (obj.text) {
                _this.text = new Narrative(obj.text);
            }
            if (obj.contained) {
                _this.contained = [];
                for (var _i = 0, _a = obj.contained || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contained.push(new Resource(o));
                }
            }
            if (obj.extension) {
                _this.extension = [];
                for (var _b = 0, _c = obj.extension || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.extension.push(new Extension(o));
                }
            }
            if (obj.modifierExtension) {
                _this.modifierExtension = [];
                for (var _d = 0, _e = obj.modifierExtension || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.modifierExtension.push(new Extension(o));
                }
            }
        }
        return _this;
    }
    return DomainResource;
}(Resource));

var CodeableConcept = (function (_super) {
    __extends(CodeableConcept, _super);
    function CodeableConcept(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.coding) {
                _this.coding = [];
                for (var _i = 0, _a = obj.coding || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.coding.push(new Coding(o));
                }
            }
            if (obj.text) {
                _this.text = obj.text;
            }
        }
        return _this;
    }
    return CodeableConcept;
}(Element));

var Period = (function (_super) {
    __extends(Period, _super);
    function Period(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.start) {
                _this.start = new Date(obj.start);
            }
            if (obj.end) {
                _this.end = new Date(obj.end);
            }
        }
        return _this;
    }
    return Period;
}(Element));

var ResourceReference = (function (_super) {
    __extends(ResourceReference, _super);
    function ResourceReference(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.reference) {
                _this.reference = obj.reference;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.display) {
                _this.display = obj.display;
            }
        }
        return _this;
    }
    return ResourceReference;
}(Element));

var Identifier = (function (_super) {
    __extends(Identifier, _super);
    function Identifier(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.assigner) {
                _this.assigner = new ResourceReference(obj.assigner);
            }
        }
        return _this;
    }
    return Identifier;
}(Element));

var ContactPoint = (function (_super) {
    __extends(ContactPoint, _super);
    function ContactPoint(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.rank) {
                _this.rank = obj.rank;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return ContactPoint;
}(Element));

var ContactDetail = (function (_super) {
    __extends(ContactDetail, _super);
    function ContactDetail(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _i = 0, _a = obj.telecom || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
        }
        return _this;
    }
    return ContactDetail;
}(Element));

var UsageContext = (function (_super) {
    __extends(UsageContext, _super);
    function UsageContext(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new Coding(obj.code);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return UsageContext;
}(Element));

var BackboneElement = (function (_super) {
    __extends(BackboneElement, _super);
    function BackboneElement(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.modifierExtension) {
                _this.modifierExtension = [];
                for (var _i = 0, _a = obj.modifierExtension || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.modifierExtension.push(new Extension(o));
                }
            }
        }
        return _this;
    }
    return BackboneElement;
}(Element));

var MappingComponent = (function (_super) {
    __extends(MappingComponent, _super);
    function MappingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identity) {
                _this.identity = obj.identity;
            }
            if (obj.uri) {
                _this.uri = obj.uri;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return MappingComponent;
}(BackboneElement));

var DiscriminatorComponent = (function (_super) {
    __extends(DiscriminatorComponent, _super);
    function DiscriminatorComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.path) {
                _this.path = obj.path;
            }
        }
        return _this;
    }
    return DiscriminatorComponent;
}(Element));

var SlicingComponent = (function (_super) {
    __extends(SlicingComponent, _super);
    function SlicingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.discriminator) {
                _this.discriminator = [];
                for (var _i = 0, _a = obj.discriminator || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.discriminator.push(new DiscriminatorComponent(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.ordered) {
                _this.ordered = obj.ordered;
            }
            if (obj.rules) {
                _this.rules = obj.rules;
            }
        }
        return _this;
    }
    return SlicingComponent;
}(Element));

var BaseComponent = (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.min) {
                _this.min = obj.min;
            }
            if (obj.max) {
                _this.max = obj.max;
            }
        }
        return _this;
    }
    return BaseComponent;
}(Element));

var TypeRefComponent = (function (_super) {
    __extends(TypeRefComponent, _super);
    function TypeRefComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.profile) {
                _this.profile = obj.profile;
            }
            if (obj.targetProfile) {
                _this.targetProfile = obj.targetProfile;
            }
            if (obj.aggregation) {
                _this.aggregation = obj.aggregation;
            }
            if (obj.versioning) {
                _this.versioning = obj.versioning;
            }
        }
        return _this;
    }
    return TypeRefComponent;
}(Element));

var ExampleComponent = (function (_super) {
    __extends(ExampleComponent, _super);
    function ExampleComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.label) {
                _this.label = obj.label;
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return ExampleComponent;
}(Element));

var ConstraintComponent = (function (_super) {
    __extends(ConstraintComponent, _super);
    function ConstraintComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.key) {
                _this.key = obj.key;
            }
            if (obj.requirements) {
                _this.requirements = obj.requirements;
            }
            if (obj.severity) {
                _this.severity = obj.severity;
            }
            if (obj.human) {
                _this.human = obj.human;
            }
            if (obj.expression) {
                _this.expression = obj.expression;
            }
            if (obj.xpath) {
                _this.xpath = obj.xpath;
            }
            if (obj.source) {
                _this.source = obj.source;
            }
        }
        return _this;
    }
    return ConstraintComponent;
}(Element));

var ElementDefinitionBindingComponent = (function (_super) {
    __extends(ElementDefinitionBindingComponent, _super);
    function ElementDefinitionBindingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.strength) {
                _this.strength = obj.strength;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.valueSet) {
                _this.valueSet = new Element(obj.valueSet);
            }
        }
        return _this;
    }
    return ElementDefinitionBindingComponent;
}(Element));

var ElementDefinition = (function (_super) {
    __extends(ElementDefinition, _super);
    function ElementDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.representation) {
                _this.representation = obj.representation;
            }
            if (obj.sliceName) {
                _this.sliceName = obj.sliceName;
            }
            if (obj.label) {
                _this.label = obj.label;
            }
            if (obj.code) {
                _this.code = [];
                for (var _i = 0, _a = obj.code || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.code.push(new Coding(o));
                }
            }
            if (obj.slicing) {
                _this.slicing = new SlicingComponent(obj.slicing);
            }
            if (obj.short) {
                _this.short = obj.short;
            }
            if (obj.definition) {
                _this.definition = obj.definition;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.requirements) {
                _this.requirements = obj.requirements;
            }
            if (obj.alias) {
                _this.alias = obj.alias;
            }
            if (obj.min) {
                _this.min = obj.min;
            }
            if (obj.max) {
                _this.max = obj.max;
            }
            if (obj.base) {
                _this.base = new BaseComponent(obj.base);
            }
            if (obj.contentReference) {
                _this.contentReference = obj.contentReference;
            }
            if (obj.type) {
                _this.type = [];
                for (var _b = 0, _c = obj.type || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.type.push(new TypeRefComponent(o));
                }
            }
            if (obj.defaultValue) {
                _this.defaultValue = new Element(obj.defaultValue);
            }
            if (obj.meaningWhenMissing) {
                _this.meaningWhenMissing = obj.meaningWhenMissing;
            }
            if (obj.orderMeaning) {
                _this.orderMeaning = obj.orderMeaning;
            }
            if (obj.fixed) {
                _this.fixed = new Element(obj.fixed);
            }
            if (obj.pattern) {
                _this.pattern = new Element(obj.pattern);
            }
            if (obj.example) {
                _this.example = [];
                for (var _d = 0, _e = obj.example || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.example.push(new ExampleComponent(o));
                }
            }
            if (obj.minValue) {
                _this.minValue = new Element(obj.minValue);
            }
            if (obj.maxValue) {
                _this.maxValue = new Element(obj.maxValue);
            }
            if (obj.maxLength) {
                _this.maxLength = obj.maxLength;
            }
            if (obj.condition) {
                _this.condition = obj.condition;
            }
            if (obj.constraint) {
                _this.constraint = [];
                for (var _f = 0, _g = obj.constraint || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.constraint.push(new ConstraintComponent(o));
                }
            }
            if (obj.mustSupport) {
                _this.mustSupport = obj.mustSupport;
            }
            if (obj.isModifier) {
                _this.isModifier = obj.isModifier;
            }
            if (obj.isSummary) {
                _this.isSummary = obj.isSummary;
            }
            if (obj.binding) {
                _this.binding = new ElementDefinitionBindingComponent(obj.binding);
            }
            if (obj.mapping) {
                _this.mapping = [];
                for (var _h = 0, _j = obj.mapping || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.mapping.push(new MappingComponent(o));
                }
            }
        }
        return _this;
    }
    return ElementDefinition;
}(Element));

var SnapshotComponent = (function (_super) {
    __extends(SnapshotComponent, _super);
    function SnapshotComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.element) {
                _this.element = [];
                for (var _i = 0, _a = obj.element || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.element.push(new ElementDefinition(o));
                }
            }
        }
        return _this;
    }
    return SnapshotComponent;
}(BackboneElement));

var DifferentialComponent = (function (_super) {
    __extends(DifferentialComponent, _super);
    function DifferentialComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.element) {
                _this.element = [];
                for (var _i = 0, _a = obj.element || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.element.push(new ElementDefinition(o));
                }
            }
        }
        return _this;
    }
    return DifferentialComponent;
}(BackboneElement));

var StructureDefinition = (function (_super) {
    __extends(StructureDefinition, _super);
    function StructureDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'StructureDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _d = 0, _e = obj.useContext || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _f = 0, _g = obj.jurisdiction || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.keyword) {
                _this.keyword = [];
                for (var _h = 0, _j = obj.keyword || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.keyword.push(new Coding(o));
                }
            }
            if (obj.fhirVersion) {
                _this.fhirVersion = obj.fhirVersion;
            }
            if (obj.mapping) {
                _this.mapping = [];
                for (var _k = 0, _l = obj.mapping || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.mapping.push(new MappingComponent(o));
                }
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.abstract) {
                _this.abstract = obj.abstract;
            }
            if (obj.contextType) {
                _this.contextType = obj.contextType;
            }
            if (obj.context) {
                _this.context = obj.context;
            }
            if (obj.contextInvariant) {
                _this.contextInvariant = obj.contextInvariant;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.baseDefinition) {
                _this.baseDefinition = obj.baseDefinition;
            }
            if (obj.derivation) {
                _this.derivation = obj.derivation;
            }
            if (obj.snapshot) {
                _this.snapshot = new SnapshotComponent(obj.snapshot);
            }
            if (obj.differential) {
                _this.differential = new DifferentialComponent(obj.differential);
            }
        }
        return _this;
    }
    return StructureDefinition;
}(DomainResource));

var ParameterComponent = (function (_super) {
    __extends(ParameterComponent, _super);
    function ParameterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.resource) {
                _this.resource = new Resource(obj.resource);
            }
            if (obj.part) {
                _this.part = [];
                for (var _i = 0, _a = obj.part || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.part.push(new ParameterComponent(o));
                }
            }
        }
        return _this;
    }
    return ParameterComponent;
}(BackboneElement));

var Parameters = (function (_super) {
    __extends(Parameters, _super);
    function Parameters(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Parameters';
        if (obj) {
            if (obj.parameter) {
                _this.parameter = [];
                for (var _i = 0, _a = obj.parameter || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.parameter.push(new ParameterComponent(o));
                }
            }
        }
        return _this;
    }
    return Parameters;
}(Resource));

var Query = (function (_super) {
    __extends(Query, _super);
    function Query(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Query';
        if (obj) {
        }
        return _this;
    }
    return Query;
}(Parameters));

var LinkComponent = (function (_super) {
    __extends(LinkComponent, _super);
    function LinkComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.relation) {
                _this.relation = obj.relation;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
        }
        return _this;
    }
    return LinkComponent;
}(BackboneElement));

var SearchComponent = (function (_super) {
    __extends(SearchComponent, _super);
    function SearchComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.score) {
                _this.score = obj.score;
            }
        }
        return _this;
    }
    return SearchComponent;
}(BackboneElement));

var RequestComponent = (function (_super) {
    __extends(RequestComponent, _super);
    function RequestComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.method) {
                _this.method = obj.method;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.ifNoneMatch) {
                _this.ifNoneMatch = obj.ifNoneMatch;
            }
            if (obj.ifModifiedSince) {
                _this.ifModifiedSince = new Date(obj.ifModifiedSince);
            }
            if (obj.ifMatch) {
                _this.ifMatch = obj.ifMatch;
            }
            if (obj.ifNoneExist) {
                _this.ifNoneExist = obj.ifNoneExist;
            }
        }
        return _this;
    }
    return RequestComponent;
}(BackboneElement));

var ResponseComponent = (function (_super) {
    __extends(ResponseComponent, _super);
    function ResponseComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.location) {
                _this.location = obj.location;
            }
            if (obj.etag) {
                _this.etag = obj.etag;
            }
            if (obj.lastModified) {
                _this.lastModified = new Date(obj.lastModified);
            }
            if (obj.outcome) {
                _this.outcome = new Resource(obj.outcome);
            }
        }
        return _this;
    }
    return ResponseComponent;
}(BackboneElement));

var EntryComponent = (function (_super) {
    __extends(EntryComponent, _super);
    function EntryComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.link) {
                _this.link = [];
                for (var _i = 0, _a = obj.link || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.link.push(new LinkComponent(o));
                }
            }
            if (obj.fullUrl) {
                _this.fullUrl = obj.fullUrl;
            }
            if (obj.resource) {
                _this.resource = new Resource(obj.resource);
            }
            if (obj.search) {
                _this.search = new SearchComponent(obj.search);
            }
            if (obj.request) {
                _this.request = new RequestComponent(obj.request);
            }
            if (obj.response) {
                _this.response = new ResponseComponent(obj.response);
            }
        }
        return _this;
    }
    return EntryComponent;
}(BackboneElement));

var ResourceEntry = (function (_super) {
    __extends(ResourceEntry, _super);
    function ResourceEntry(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return ResourceEntry;
}(EntryComponent));

var Flag = (function (_super) {
    __extends(Flag, _super);
    function Flag(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Flag';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
        }
        return _this;
    }
    return Flag;
}(DomainResource));

var Alert = (function (_super) {
    __extends(Alert, _super);
    function Alert(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Alert';
        if (obj) {
        }
        return _this;
    }
    return Alert;
}(Flag));

var Quantity = (function (_super) {
    __extends(Quantity, _super);
    function Quantity(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.value) {
                _this.value = obj.value;
            }
            if (obj.comparator) {
                _this.comparator = obj.comparator;
            }
            if (obj.unit) {
                _this.unit = obj.unit;
            }
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
        }
        return _this;
    }
    return Quantity;
}(Element));

var SimpleQuantity = (function (_super) {
    __extends(SimpleQuantity, _super);
    function SimpleQuantity(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return SimpleQuantity;
}(Quantity));

var Range = (function (_super) {
    __extends(Range, _super);
    function Range(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.low) {
                _this.low = new Quantity(obj.low);
            }
            if (obj.high) {
                _this.high = new Quantity(obj.high);
            }
        }
        return _this;
    }
    return Range;
}(Element));

var ReferenceRangeComponent = (function (_super) {
    __extends(ReferenceRangeComponent, _super);
    function ReferenceRangeComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.low) {
                _this.low = new SimpleQuantity(obj.low);
            }
            if (obj.high) {
                _this.high = new SimpleQuantity(obj.high);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.appliesTo) {
                _this.appliesTo = [];
                for (var _i = 0, _a = obj.appliesTo || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.appliesTo.push(new CodeableConcept(o));
                }
            }
            if (obj.age) {
                _this.age = new Range(obj.age);
            }
            if (obj.text) {
                _this.text = obj.text;
            }
        }
        return _this;
    }
    return ReferenceRangeComponent;
}(BackboneElement));

var RelatedComponent = (function (_super) {
    __extends(RelatedComponent, _super);
    function RelatedComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.target) {
                _this.target = new ResourceReference(obj.target);
            }
        }
        return _this;
    }
    return RelatedComponent;
}(BackboneElement));

var ComponentComponent = (function (_super) {
    __extends(ComponentComponent, _super);
    function ComponentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.dataAbsentReason) {
                _this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
            }
            if (obj.interpretation) {
                _this.interpretation = new CodeableConcept(obj.interpretation);
            }
            if (obj.referenceRange) {
                _this.referenceRange = [];
                for (var _i = 0, _a = obj.referenceRange || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.referenceRange.push(new ReferenceRangeComponent(o));
                }
            }
        }
        return _this;
    }
    return ComponentComponent;
}(BackboneElement));

var Observation = (function (_super) {
    __extends(Observation, _super);
    function Observation(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Observation';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _d = 0, _e = obj.category || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.effective) {
                _this.effective = new Element(obj.effective);
            }
            if (obj.issued) {
                _this.issued = new Date(obj.issued);
            }
            if (obj.performer) {
                _this.performer = [];
                for (var _f = 0, _g = obj.performer || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.performer.push(new ResourceReference(o));
                }
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.dataAbsentReason) {
                _this.dataAbsentReason = new CodeableConcept(obj.dataAbsentReason);
            }
            if (obj.interpretation) {
                _this.interpretation = new CodeableConcept(obj.interpretation);
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.bodySite) {
                _this.bodySite = new CodeableConcept(obj.bodySite);
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.specimen) {
                _this.specimen = new ResourceReference(obj.specimen);
            }
            if (obj.device) {
                _this.device = new ResourceReference(obj.device);
            }
            if (obj.referenceRange) {
                _this.referenceRange = [];
                for (var _h = 0, _j = obj.referenceRange || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.referenceRange.push(new ReferenceRangeComponent(o));
                }
            }
            if (obj.related) {
                _this.related = [];
                for (var _k = 0, _l = obj.related || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.related.push(new RelatedComponent(o));
                }
            }
            if (obj.component) {
                _this.component = [];
                for (var _m = 0, _o = obj.component || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.component.push(new ComponentComponent(o));
                }
            }
        }
        return _this;
    }
    return Observation;
}(DomainResource));

var Binary = (function (_super) {
    __extends(Binary, _super);
    function Binary(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Binary';
        if (obj) {
            if (obj.contentType) {
                _this.contentType = obj.contentType;
            }
            if (obj.securityContext) {
                _this.securityContext = new ResourceReference(obj.securityContext);
            }
            if (obj.content) {
                _this.content = obj.content;
            }
        }
        return _this;
    }
    return Binary;
}(Resource));

var Signature = (function (_super) {
    __extends(Signature, _super);
    function Signature(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = [];
                for (var _i = 0, _a = obj.type || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.type.push(new Coding(o));
                }
            }
            if (obj.when) {
                _this.when = new Date(obj.when);
            }
            if (obj.who) {
                _this.who = new Element(obj.who);
            }
            if (obj.onBehalfOf) {
                _this.onBehalfOf = new Element(obj.onBehalfOf);
            }
            if (obj.contentType) {
                _this.contentType = obj.contentType;
            }
            if (obj.blob) {
                _this.blob = obj.blob;
            }
        }
        return _this;
    }
    return Signature;
}(Element));

var Bundle = (function (_super) {
    __extends(Bundle, _super);
    function Bundle(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Bundle';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.total) {
                _this.total = obj.total;
            }
            if (obj.link) {
                _this.link = [];
                for (var _i = 0, _a = obj.link || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.link.push(new LinkComponent(o));
                }
            }
            if (obj.entry) {
                _this.entry = [];
                for (var _b = 0, _c = obj.entry || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.entry.push(new EntryComponent(o));
                }
            }
            if (obj.signature) {
                _this.signature = new Signature(obj.signature);
            }
        }
        return _this;
    }
    return Bundle;
}(Resource));

var BundleExtensions = (function () {
    function BundleExtensions(obj) {
        if (obj) {
        }
    }
    return BundleExtensions;
}());

var FilterComponent = (function (_super) {
    __extends(FilterComponent, _super);
    function FilterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.operator) {
                _this.operator = obj.operator;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return FilterComponent;
}(BackboneElement));

var PropertyComponent = (function (_super) {
    __extends(PropertyComponent, _super);
    function PropertyComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.uri) {
                _this.uri = obj.uri;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
        }
        return _this;
    }
    return PropertyComponent;
}(BackboneElement));

var DesignationComponent = (function (_super) {
    __extends(DesignationComponent, _super);
    function DesignationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.language) {
                _this.language = obj.language;
            }
            if (obj.use) {
                _this.use = new Coding(obj.use);
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return DesignationComponent;
}(BackboneElement));

var ConceptPropertyComponent = (function (_super) {
    __extends(ConceptPropertyComponent, _super);
    function ConceptPropertyComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return ConceptPropertyComponent;
}(BackboneElement));

var ConceptDefinitionComponent = (function (_super) {
    __extends(ConceptDefinitionComponent, _super);
    function ConceptDefinitionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.definition) {
                _this.definition = obj.definition;
            }
            if (obj.designation) {
                _this.designation = [];
                for (var _i = 0, _a = obj.designation || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.designation.push(new DesignationComponent(o));
                }
            }
            if (obj.property) {
                _this.property = [];
                for (var _b = 0, _c = obj.property || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.property.push(new ConceptPropertyComponent(o));
                }
            }
            if (obj.concept) {
                _this.concept = [];
                for (var _d = 0, _e = obj.concept || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.concept.push(new ConceptDefinitionComponent(o));
                }
            }
        }
        return _this;
    }
    return ConceptDefinitionComponent;
}(BackboneElement));

var CodeSystem = (function (_super) {
    __extends(CodeSystem, _super);
    function CodeSystem(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CodeSystem';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.caseSensitive) {
                _this.caseSensitive = obj.caseSensitive;
            }
            if (obj.valueSet) {
                _this.valueSet = obj.valueSet;
            }
            if (obj.hierarchyMeaning) {
                _this.hierarchyMeaning = obj.hierarchyMeaning;
            }
            if (obj.compositional) {
                _this.compositional = obj.compositional;
            }
            if (obj.versionNeeded) {
                _this.versionNeeded = obj.versionNeeded;
            }
            if (obj.content) {
                _this.content = obj.content;
            }
            if (obj.count) {
                _this.count = obj.count;
            }
            if (obj.filter) {
                _this.filter = [];
                for (var _f = 0, _g = obj.filter || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.filter.push(new FilterComponent(o));
                }
            }
            if (obj.property) {
                _this.property = [];
                for (var _h = 0, _j = obj.property || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.property.push(new PropertyComponent(o));
                }
            }
            if (obj.concept) {
                _this.concept = [];
                for (var _k = 0, _l = obj.concept || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.concept.push(new ConceptDefinitionComponent(o));
                }
            }
        }
        return _this;
    }
    return CodeSystem;
}(DomainResource));

var CodeSystemExtensions = (function () {
    function CodeSystemExtensions(obj) {
        if (obj) {
        }
    }
    return CodeSystemExtensions;
}());

var OtherElementComponent = (function (_super) {
    __extends(OtherElementComponent, _super);
    function OtherElementComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.property) {
                _this.property = obj.property;
            }
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
        }
        return _this;
    }
    return OtherElementComponent;
}(BackboneElement));

var TargetElementComponent = (function (_super) {
    __extends(TargetElementComponent, _super);
    function TargetElementComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.equivalence) {
                _this.equivalence = obj.equivalence;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.dependsOn) {
                _this.dependsOn = [];
                for (var _i = 0, _a = obj.dependsOn || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.dependsOn.push(new OtherElementComponent(o));
                }
            }
            if (obj.product) {
                _this.product = [];
                for (var _b = 0, _c = obj.product || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.product.push(new OtherElementComponent(o));
                }
            }
        }
        return _this;
    }
    return TargetElementComponent;
}(BackboneElement));

var SourceElementComponent = (function (_super) {
    __extends(SourceElementComponent, _super);
    function SourceElementComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.target) {
                _this.target = [];
                for (var _i = 0, _a = obj.target || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.target.push(new TargetElementComponent(o));
                }
            }
        }
        return _this;
    }
    return SourceElementComponent;
}(BackboneElement));

var UnmappedComponent = (function (_super) {
    __extends(UnmappedComponent, _super);
    function UnmappedComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
        }
        return _this;
    }
    return UnmappedComponent;
}(BackboneElement));

var GroupComponent = (function (_super) {
    __extends(GroupComponent, _super);
    function GroupComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.source) {
                _this.source = obj.source;
            }
            if (obj.sourceVersion) {
                _this.sourceVersion = obj.sourceVersion;
            }
            if (obj.target) {
                _this.target = obj.target;
            }
            if (obj.targetVersion) {
                _this.targetVersion = obj.targetVersion;
            }
            if (obj.element) {
                _this.element = [];
                for (var _i = 0, _a = obj.element || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.element.push(new SourceElementComponent(o));
                }
            }
            if (obj.unmapped) {
                _this.unmapped = new UnmappedComponent(obj.unmapped);
            }
        }
        return _this;
    }
    return GroupComponent;
}(BackboneElement));

var ConceptMap = (function (_super) {
    __extends(ConceptMap, _super);
    function ConceptMap(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ConceptMap';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.source) {
                _this.source = new Element(obj.source);
            }
            if (obj.target) {
                _this.target = new Element(obj.target);
            }
            if (obj.group) {
                _this.group = [];
                for (var _f = 0, _g = obj.group || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.group.push(new GroupComponent(o));
                }
            }
        }
        return _this;
    }
    return ConceptMap;
}(DomainResource));

var ElementDefinitionExtensions = (function () {
    function ElementDefinitionExtensions(obj) {
        if (obj) {
        }
    }
    return ElementDefinitionExtensions;
}());

var Money = (function (_super) {
    __extends(Money, _super);
    function Money(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return Money;
}(Quantity));

var CoverageComponent = (function (_super) {
    __extends(CoverageComponent, _super);
    function CoverageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.coverage) {
                _this.coverage = new ResourceReference(obj.coverage);
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
        }
        return _this;
    }
    return CoverageComponent;
}(BackboneElement));

var GuarantorComponent = (function (_super) {
    __extends(GuarantorComponent, _super);
    function GuarantorComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.party) {
                _this.party = new ResourceReference(obj.party);
            }
            if (obj.onHold) {
                _this.onHold = obj.onHold;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return GuarantorComponent;
}(BackboneElement));

var Account = (function (_super) {
    __extends(Account, _super);
    function Account(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Account';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.active) {
                _this.active = new Period(obj.active);
            }
            if (obj.balance) {
                _this.balance = new Money(obj.balance);
            }
            if (obj.coverage) {
                _this.coverage = [];
                for (var _b = 0, _c = obj.coverage || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.coverage.push(new CoverageComponent(o));
                }
            }
            if (obj.owner) {
                _this.owner = new ResourceReference(obj.owner);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.guarantor) {
                _this.guarantor = [];
                for (var _d = 0, _e = obj.guarantor || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.guarantor.push(new GuarantorComponent(o));
                }
            }
        }
        return _this;
    }
    return Account;
}(DomainResource));

var Contributor = (function (_super) {
    __extends(Contributor, _super);
    function Contributor(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
        }
        return _this;
    }
    return Contributor;
}(Element));

var Attachment = (function (_super) {
    __extends(Attachment, _super);
    function Attachment(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.contentType) {
                _this.contentType = obj.contentType;
            }
            if (obj.language) {
                _this.language = obj.language;
            }
            if (obj.data) {
                _this.data = obj.data;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.size) {
                _this.size = obj.size;
            }
            if (obj.hash) {
                _this.hash = obj.hash;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.creation) {
                _this.creation = new Date(obj.creation);
            }
        }
        return _this;
    }
    return Attachment;
}(Element));

var RelatedArtifact = (function (_super) {
    __extends(RelatedArtifact, _super);
    function RelatedArtifact(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.citation) {
                _this.citation = obj.citation;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.document) {
                _this.document = new Attachment(obj.document);
            }
            if (obj.resource) {
                _this.resource = new ResourceReference(obj.resource);
            }
        }
        return _this;
    }
    return RelatedArtifact;
}(Element));

var ParticipantComponent = (function (_super) {
    __extends(ParticipantComponent, _super);
    function ParticipantComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
        }
        return _this;
    }
    return ParticipantComponent;
}(BackboneElement));

var RepeatComponent = (function (_super) {
    __extends(RepeatComponent, _super);
    function RepeatComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.bounds) {
                _this.bounds = new Element(obj.bounds);
            }
            if (obj.count) {
                _this.count = obj.count;
            }
            if (obj.countMax) {
                _this.countMax = obj.countMax;
            }
            if (obj.duration) {
                _this.duration = obj.duration;
            }
            if (obj.durationMax) {
                _this.durationMax = obj.durationMax;
            }
            if (obj.durationUnit) {
                _this.durationUnit = obj.durationUnit;
            }
            if (obj.frequency) {
                _this.frequency = obj.frequency;
            }
            if (obj.frequencyMax) {
                _this.frequencyMax = obj.frequencyMax;
            }
            if (obj.period) {
                _this.period = obj.period;
            }
            if (obj.periodMax) {
                _this.periodMax = obj.periodMax;
            }
            if (obj.periodUnit) {
                _this.periodUnit = obj.periodUnit;
            }
            if (obj.dayOfWeek) {
                _this.dayOfWeek = obj.dayOfWeek;
            }
            if (obj.timeOfDay) {
                _this.timeOfDay = obj.timeOfDay;
            }
            if (obj.when) {
                _this.when = obj.when;
            }
            if (obj.offset) {
                _this.offset = obj.offset;
            }
        }
        return _this;
    }
    return RepeatComponent;
}(Element));

var Timing = (function (_super) {
    __extends(Timing, _super);
    function Timing(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.event) {
                _this.event = obj.event;
            }
            if (obj.repeat) {
                _this.repeat = new RepeatComponent(obj.repeat);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
        }
        return _this;
    }
    return Timing;
}(Element));

var Ratio = (function (_super) {
    __extends(Ratio, _super);
    function Ratio(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.numerator) {
                _this.numerator = new Quantity(obj.numerator);
            }
            if (obj.denominator) {
                _this.denominator = new Quantity(obj.denominator);
            }
        }
        return _this;
    }
    return Ratio;
}(Element));

var Dosage = (function (_super) {
    __extends(Dosage, _super);
    function Dosage(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.additionalInstruction) {
                _this.additionalInstruction = [];
                for (var _i = 0, _a = obj.additionalInstruction || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.additionalInstruction.push(new CodeableConcept(o));
                }
            }
            if (obj.patientInstruction) {
                _this.patientInstruction = obj.patientInstruction;
            }
            if (obj.timing) {
                _this.timing = new Timing(obj.timing);
            }
            if (obj.asNeeded) {
                _this.asNeeded = new Element(obj.asNeeded);
            }
            if (obj.site) {
                _this.site = new CodeableConcept(obj.site);
            }
            if (obj.route) {
                _this.route = new CodeableConcept(obj.route);
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.dose) {
                _this.dose = new Element(obj.dose);
            }
            if (obj.maxDosePerPeriod) {
                _this.maxDosePerPeriod = new Ratio(obj.maxDosePerPeriod);
            }
            if (obj.maxDosePerAdministration) {
                _this.maxDosePerAdministration = new Quantity(obj.maxDosePerAdministration);
            }
            if (obj.maxDosePerLifetime) {
                _this.maxDosePerLifetime = new Quantity(obj.maxDosePerLifetime);
            }
            if (obj.rate) {
                _this.rate = new Element(obj.rate);
            }
        }
        return _this;
    }
    return Dosage;
}(Element));

var DynamicValueComponent = (function (_super) {
    __extends(DynamicValueComponent, _super);
    function DynamicValueComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.language) {
                _this.language = obj.language;
            }
            if (obj.expression) {
                _this.expression = obj.expression;
            }
        }
        return _this;
    }
    return DynamicValueComponent;
}(BackboneElement));

var ActivityDefinition = (function (_super) {
    __extends(ActivityDefinition, _super);
    function ActivityDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ActivityDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _f = 0, _g = obj.topic || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.topic.push(new CodeableConcept(o));
                }
            }
            if (obj.contributor) {
                _this.contributor = [];
                for (var _h = 0, _j = obj.contributor || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contributor.push(new Contributor(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.library) {
                _this.library = [];
                for (var _p = 0, _q = obj.library || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.library.push(new ResourceReference(o));
                }
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.timing) {
                _this.timing = new Element(obj.timing);
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _r = 0, _s = obj.participant || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.product) {
                _this.product = new Element(obj.product);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.dosage) {
                _this.dosage = [];
                for (var _t = 0, _u = obj.dosage || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.dosage.push(new Dosage(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = [];
                for (var _v = 0, _w = obj.bodySite || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.bodySite.push(new CodeableConcept(o));
                }
            }
            if (obj.transform) {
                _this.transform = new ResourceReference(obj.transform);
            }
            if (obj.dynamicValue) {
                _this.dynamicValue = [];
                for (var _x = 0, _y = obj.dynamicValue || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.dynamicValue.push(new DynamicValueComponent(o));
                }
            }
        }
        return _this;
    }
    return ActivityDefinition;
}(DomainResource));

var Address = (function (_super) {
    __extends(Address, _super);
    function Address(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.line) {
                _this.line = obj.line;
            }
            if (obj.city) {
                _this.city = obj.city;
            }
            if (obj.district) {
                _this.district = obj.district;
            }
            if (obj.state) {
                _this.state = obj.state;
            }
            if (obj.postalCode) {
                _this.postalCode = obj.postalCode;
            }
            if (obj.country) {
                _this.country = obj.country;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return Address;
}(Element));

var SuspectEntityComponent = (function (_super) {
    __extends(SuspectEntityComponent, _super);
    function SuspectEntityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.instance) {
                _this.instance = new ResourceReference(obj.instance);
            }
            if (obj.causality) {
                _this.causality = obj.causality;
            }
            if (obj.causalityAssessment) {
                _this.causalityAssessment = new CodeableConcept(obj.causalityAssessment);
            }
            if (obj.causalityProductRelatedness) {
                _this.causalityProductRelatedness = obj.causalityProductRelatedness;
            }
            if (obj.causalityMethod) {
                _this.causalityMethod = new CodeableConcept(obj.causalityMethod);
            }
            if (obj.causalityAuthor) {
                _this.causalityAuthor = new ResourceReference(obj.causalityAuthor);
            }
            if (obj.causalityResult) {
                _this.causalityResult = new CodeableConcept(obj.causalityResult);
            }
        }
        return _this;
    }
    return SuspectEntityComponent;
}(BackboneElement));

var AdverseEvent = (function (_super) {
    __extends(AdverseEvent, _super);
    function AdverseEvent(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'AdverseEvent';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.category) {
                _this.category = obj.category;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.reaction) {
                _this.reaction = [];
                for (var _i = 0, _a = obj.reaction || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.reaction.push(new ResourceReference(o));
                }
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.seriousness) {
                _this.seriousness = new CodeableConcept(obj.seriousness);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.recorder) {
                _this.recorder = new ResourceReference(obj.recorder);
            }
            if (obj.eventParticipant) {
                _this.eventParticipant = new ResourceReference(obj.eventParticipant);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.suspectEntity) {
                _this.suspectEntity = [];
                for (var _b = 0, _c = obj.suspectEntity || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.suspectEntity.push(new SuspectEntityComponent(o));
                }
            }
            if (obj.subjectMedicalHistory) {
                _this.subjectMedicalHistory = [];
                for (var _d = 0, _e = obj.subjectMedicalHistory || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.subjectMedicalHistory.push(new ResourceReference(o));
                }
            }
            if (obj.referenceDocument) {
                _this.referenceDocument = [];
                for (var _f = 0, _g = obj.referenceDocument || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.referenceDocument.push(new ResourceReference(o));
                }
            }
            if (obj.study) {
                _this.study = [];
                for (var _h = 0, _j = obj.study || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.study.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return AdverseEvent;
}(DomainResource));

var Age = (function (_super) {
    __extends(Age, _super);
    function Age(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return Age;
}(Quantity));

var Annotation = (function (_super) {
    __extends(Annotation, _super);
    function Annotation(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.author) {
                _this.author = new Element(obj.author);
            }
            if (obj.time) {
                _this.time = new Date(obj.time);
            }
            if (obj.text) {
                _this.text = obj.text;
            }
        }
        return _this;
    }
    return Annotation;
}(Element));

var ReactionComponent = (function (_super) {
    __extends(ReactionComponent, _super);
    function ReactionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.substance) {
                _this.substance = new CodeableConcept(obj.substance);
            }
            if (obj.manifestation) {
                _this.manifestation = [];
                for (var _i = 0, _a = obj.manifestation || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.manifestation.push(new CodeableConcept(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.onset) {
                _this.onset = new Date(obj.onset);
            }
            if (obj.severity) {
                _this.severity = obj.severity;
            }
            if (obj.exposureRoute) {
                _this.exposureRoute = new CodeableConcept(obj.exposureRoute);
            }
            if (obj.note) {
                _this.note = [];
                for (var _b = 0, _c = obj.note || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return ReactionComponent;
}(BackboneElement));

var AllergyIntolerance = (function (_super) {
    __extends(AllergyIntolerance, _super);
    function AllergyIntolerance(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'AllergyIntolerance';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.clinicalStatus) {
                _this.clinicalStatus = obj.clinicalStatus;
            }
            if (obj.verificationStatus) {
                _this.verificationStatus = obj.verificationStatus;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.category) {
                _this.category = obj.category;
            }
            if (obj.criticality) {
                _this.criticality = obj.criticality;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.onset) {
                _this.onset = new Element(obj.onset);
            }
            if (obj.assertedDate) {
                _this.assertedDate = new Date(obj.assertedDate);
            }
            if (obj.recorder) {
                _this.recorder = new ResourceReference(obj.recorder);
            }
            if (obj.asserter) {
                _this.asserter = new ResourceReference(obj.asserter);
            }
            if (obj.lastOccurrence) {
                _this.lastOccurrence = new Date(obj.lastOccurrence);
            }
            if (obj.note) {
                _this.note = [];
                for (var _b = 0, _c = obj.note || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.reaction) {
                _this.reaction = [];
                for (var _d = 0, _e = obj.reaction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.reaction.push(new ReactionComponent(o));
                }
            }
        }
        return _this;
    }
    return AllergyIntolerance;
}(DomainResource));

var Appointment = (function (_super) {
    __extends(Appointment, _super);
    function Appointment(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Appointment';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.serviceCategory) {
                _this.serviceCategory = new CodeableConcept(obj.serviceCategory);
            }
            if (obj.serviceType) {
                _this.serviceType = [];
                for (var _b = 0, _c = obj.serviceType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.serviceType.push(new CodeableConcept(o));
                }
            }
            if (obj.specialty) {
                _this.specialty = [];
                for (var _d = 0, _e = obj.specialty || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialty.push(new CodeableConcept(o));
                }
            }
            if (obj.appointmentType) {
                _this.appointmentType = new CodeableConcept(obj.appointmentType);
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _f = 0, _g = obj.reason || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.indication) {
                _this.indication = [];
                for (var _h = 0, _j = obj.indication || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.indication.push(new ResourceReference(o));
                }
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.supportingInformation) {
                _this.supportingInformation = [];
                for (var _k = 0, _l = obj.supportingInformation || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.supportingInformation.push(new ResourceReference(o));
                }
            }
            if (obj.start) {
                _this.start = new Date(obj.start);
            }
            if (obj.end) {
                _this.end = new Date(obj.end);
            }
            if (obj.minutesDuration) {
                _this.minutesDuration = obj.minutesDuration;
            }
            if (obj.slot) {
                _this.slot = [];
                for (var _m = 0, _o = obj.slot || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.slot.push(new ResourceReference(o));
                }
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.incomingReferral) {
                _this.incomingReferral = [];
                for (var _p = 0, _q = obj.incomingReferral || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.incomingReferral.push(new ResourceReference(o));
                }
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _r = 0, _s = obj.participant || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.requestedPeriod) {
                _this.requestedPeriod = [];
                for (var _t = 0, _u = obj.requestedPeriod || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.requestedPeriod.push(new Period(o));
                }
            }
        }
        return _this;
    }
    return Appointment;
}(DomainResource));

var AppointmentResponse = (function (_super) {
    __extends(AppointmentResponse, _super);
    function AppointmentResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'AppointmentResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.appointment) {
                _this.appointment = new ResourceReference(obj.appointment);
            }
            if (obj.start) {
                _this.start = new Date(obj.start);
            }
            if (obj.end) {
                _this.end = new Date(obj.end);
            }
            if (obj.participantType) {
                _this.participantType = [];
                for (var _b = 0, _c = obj.participantType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.participantType.push(new CodeableConcept(o));
                }
            }
            if (obj.actor) {
                _this.actor = new ResourceReference(obj.actor);
            }
            if (obj.participantStatus) {
                _this.participantStatus = obj.participantStatus;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return AppointmentResponse;
}(DomainResource));

var NetworkComponent = (function (_super) {
    __extends(NetworkComponent, _super);
    function NetworkComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.address) {
                _this.address = obj.address;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
        }
        return _this;
    }
    return NetworkComponent;
}(BackboneElement));

var AgentComponent = (function (_super) {
    __extends(AgentComponent, _super);
    function AgentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.role) {
                _this.role = [];
                for (var _i = 0, _a = obj.role || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.role.push(new CodeableConcept(o));
                }
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
            if (obj.userId) {
                _this.userId = new Identifier(obj.userId);
            }
            if (obj.altId) {
                _this.altId = obj.altId;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.requestor) {
                _this.requestor = obj.requestor;
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.policy) {
                _this.policy = obj.policy;
            }
            if (obj.media) {
                _this.media = new Coding(obj.media);
            }
            if (obj.network) {
                _this.network = new NetworkComponent(obj.network);
            }
            if (obj.purposeOfUse) {
                _this.purposeOfUse = [];
                for (var _b = 0, _c = obj.purposeOfUse || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.purposeOfUse.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return AgentComponent;
}(BackboneElement));

var SourceComponent = (function (_super) {
    __extends(SourceComponent, _super);
    function SourceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.site) {
                _this.site = obj.site;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.type) {
                _this.type = [];
                for (var _i = 0, _a = obj.type || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.type.push(new Coding(o));
                }
            }
        }
        return _this;
    }
    return SourceComponent;
}(BackboneElement));

var DetailComponent = (function (_super) {
    __extends(DetailComponent, _super);
    function DetailComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return DetailComponent;
}(BackboneElement));

var EntityComponent = (function (_super) {
    __extends(EntityComponent, _super);
    function EntityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
            if (obj.type) {
                _this.type = new Coding(obj.type);
            }
            if (obj.role) {
                _this.role = new Coding(obj.role);
            }
            if (obj.lifecycle) {
                _this.lifecycle = new Coding(obj.lifecycle);
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _i = 0, _a = obj.securityLabel || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.securityLabel.push(new Coding(o));
                }
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.query) {
                _this.query = obj.query;
            }
            if (obj.detail) {
                _this.detail = [];
                for (var _b = 0, _c = obj.detail || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.detail.push(new DetailComponent(o));
                }
            }
        }
        return _this;
    }
    return EntityComponent;
}(BackboneElement));

var AuditEvent = (function (_super) {
    __extends(AuditEvent, _super);
    function AuditEvent(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'AuditEvent';
        if (obj) {
            if (obj.type) {
                _this.type = new Coding(obj.type);
            }
            if (obj.subtype) {
                _this.subtype = [];
                for (var _i = 0, _a = obj.subtype || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.subtype.push(new Coding(o));
                }
            }
            if (obj.action) {
                _this.action = obj.action;
            }
            if (obj.recorded) {
                _this.recorded = new Date(obj.recorded);
            }
            if (obj.outcome) {
                _this.outcome = obj.outcome;
            }
            if (obj.outcomeDesc) {
                _this.outcomeDesc = obj.outcomeDesc;
            }
            if (obj.purposeOfEvent) {
                _this.purposeOfEvent = [];
                for (var _b = 0, _c = obj.purposeOfEvent || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.purposeOfEvent.push(new CodeableConcept(o));
                }
            }
            if (obj.agent) {
                _this.agent = [];
                for (var _d = 0, _e = obj.agent || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.agent.push(new AgentComponent(o));
                }
            }
            if (obj.source) {
                _this.source = new SourceComponent(obj.source);
            }
            if (obj.entity) {
                _this.entity = [];
                for (var _f = 0, _g = obj.entity || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.entity.push(new EntityComponent(o));
                }
            }
        }
        return _this;
    }
    return AuditEvent;
}(DomainResource));

var Basic = (function (_super) {
    __extends(Basic, _super);
    function Basic(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Basic';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
        }
        return _this;
    }
    return Basic;
}(DomainResource));

var BodySite = (function (_super) {
    __extends(BodySite, _super);
    function BodySite(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'BodySite';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.qualifier) {
                _this.qualifier = [];
                for (var _b = 0, _c = obj.qualifier || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.qualifier.push(new CodeableConcept(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.image) {
                _this.image = [];
                for (var _d = 0, _e = obj.image || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.image.push(new Attachment(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
        }
        return _this;
    }
    return BodySite;
}(DomainResource));

var SoftwareComponent = (function (_super) {
    __extends(SoftwareComponent, _super);
    function SoftwareComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.releaseDate) {
                _this.releaseDate = new Date(obj.releaseDate);
            }
        }
        return _this;
    }
    return SoftwareComponent;
}(BackboneElement));

var ImplementationComponent = (function (_super) {
    __extends(ImplementationComponent, _super);
    function ImplementationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
        }
        return _this;
    }
    return ImplementationComponent;
}(BackboneElement));

var CertificateComponent = (function (_super) {
    __extends(CertificateComponent, _super);
    function CertificateComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.blob) {
                _this.blob = obj.blob;
            }
        }
        return _this;
    }
    return CertificateComponent;
}(BackboneElement));

var SecurityComponent = (function (_super) {
    __extends(SecurityComponent, _super);
    function SecurityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.cors) {
                _this.cors = obj.cors;
            }
            if (obj.service) {
                _this.service = [];
                for (var _i = 0, _a = obj.service || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.service.push(new CodeableConcept(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.certificate) {
                _this.certificate = [];
                for (var _b = 0, _c = obj.certificate || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.certificate.push(new CertificateComponent(o));
                }
            }
        }
        return _this;
    }
    return SecurityComponent;
}(BackboneElement));

var ResourceInteractionComponent = (function (_super) {
    __extends(ResourceInteractionComponent, _super);
    function ResourceInteractionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
        }
        return _this;
    }
    return ResourceInteractionComponent;
}(BackboneElement));

var SearchParamComponent = (function (_super) {
    __extends(SearchParamComponent, _super);
    function SearchParamComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.definition) {
                _this.definition = obj.definition;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
        }
        return _this;
    }
    return SearchParamComponent;
}(BackboneElement));

var ResourceComponent = (function (_super) {
    __extends(ResourceComponent, _super);
    function ResourceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.profile) {
                _this.profile = new ResourceReference(obj.profile);
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
            if (obj.interaction) {
                _this.interaction = [];
                for (var _i = 0, _a = obj.interaction || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.interaction.push(new ResourceInteractionComponent(o));
                }
            }
            if (obj.versioning) {
                _this.versioning = obj.versioning;
            }
            if (obj.readHistory) {
                _this.readHistory = obj.readHistory;
            }
            if (obj.updateCreate) {
                _this.updateCreate = obj.updateCreate;
            }
            if (obj.conditionalCreate) {
                _this.conditionalCreate = obj.conditionalCreate;
            }
            if (obj.conditionalRead) {
                _this.conditionalRead = obj.conditionalRead;
            }
            if (obj.conditionalUpdate) {
                _this.conditionalUpdate = obj.conditionalUpdate;
            }
            if (obj.conditionalDelete) {
                _this.conditionalDelete = obj.conditionalDelete;
            }
            if (obj.referencePolicy) {
                _this.referencePolicy = obj.referencePolicy;
            }
            if (obj.searchInclude) {
                _this.searchInclude = obj.searchInclude;
            }
            if (obj.searchRevInclude) {
                _this.searchRevInclude = obj.searchRevInclude;
            }
            if (obj.searchParam) {
                _this.searchParam = [];
                for (var _b = 0, _c = obj.searchParam || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.searchParam.push(new SearchParamComponent(o));
                }
            }
        }
        return _this;
    }
    return ResourceComponent;
}(BackboneElement));

var SystemInteractionComponent = (function (_super) {
    __extends(SystemInteractionComponent, _super);
    function SystemInteractionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
        }
        return _this;
    }
    return SystemInteractionComponent;
}(BackboneElement));

var OperationComponent = (function (_super) {
    __extends(OperationComponent, _super);
    function OperationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.definition) {
                _this.definition = new ResourceReference(obj.definition);
            }
        }
        return _this;
    }
    return OperationComponent;
}(BackboneElement));

var RestComponent = (function (_super) {
    __extends(RestComponent, _super);
    function RestComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
            if (obj.security) {
                _this.security = new SecurityComponent(obj.security);
            }
            if (obj.resource) {
                _this.resource = [];
                for (var _i = 0, _a = obj.resource || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.resource.push(new ResourceComponent(o));
                }
            }
            if (obj.interaction) {
                _this.interaction = [];
                for (var _b = 0, _c = obj.interaction || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.interaction.push(new SystemInteractionComponent(o));
                }
            }
            if (obj.searchParam) {
                _this.searchParam = [];
                for (var _d = 0, _e = obj.searchParam || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.searchParam.push(new SearchParamComponent(o));
                }
            }
            if (obj.operation) {
                _this.operation = [];
                for (var _f = 0, _g = obj.operation || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.operation.push(new OperationComponent(o));
                }
            }
            if (obj.compartment) {
                _this.compartment = obj.compartment;
            }
        }
        return _this;
    }
    return RestComponent;
}(BackboneElement));

var EndpointComponent = (function (_super) {
    __extends(EndpointComponent, _super);
    function EndpointComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.protocol) {
                _this.protocol = new Coding(obj.protocol);
            }
            if (obj.address) {
                _this.address = obj.address;
            }
        }
        return _this;
    }
    return EndpointComponent;
}(BackboneElement));

var SupportedMessageComponent = (function (_super) {
    __extends(SupportedMessageComponent, _super);
    function SupportedMessageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.definition) {
                _this.definition = new ResourceReference(obj.definition);
            }
        }
        return _this;
    }
    return SupportedMessageComponent;
}(BackboneElement));

var EventComponent = (function (_super) {
    __extends(EventComponent, _super);
    function EventComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new Coding(obj.code);
            }
            if (obj.category) {
                _this.category = obj.category;
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.focus) {
                _this.focus = obj.focus;
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.response) {
                _this.response = new ResourceReference(obj.response);
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
        }
        return _this;
    }
    return EventComponent;
}(BackboneElement));

var MessagingComponent = (function (_super) {
    __extends(MessagingComponent, _super);
    function MessagingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _i = 0, _a = obj.endpoint || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.endpoint.push(new EndpointComponent(o));
                }
            }
            if (obj.reliableCache) {
                _this.reliableCache = obj.reliableCache;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
            if (obj.supportedMessage) {
                _this.supportedMessage = [];
                for (var _b = 0, _c = obj.supportedMessage || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.supportedMessage.push(new SupportedMessageComponent(o));
                }
            }
            if (obj.event) {
                _this.event = [];
                for (var _d = 0, _e = obj.event || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.event.push(new EventComponent(o));
                }
            }
        }
        return _this;
    }
    return MessagingComponent;
}(BackboneElement));

var DocumentComponent = (function (_super) {
    __extends(DocumentComponent, _super);
    function DocumentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
            if (obj.profile) {
                _this.profile = new ResourceReference(obj.profile);
            }
        }
        return _this;
    }
    return DocumentComponent;
}(BackboneElement));

var CapabilityStatement = (function (_super) {
    __extends(CapabilityStatement, _super);
    function CapabilityStatement(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CapabilityStatement';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.instantiates) {
                _this.instantiates = obj.instantiates;
            }
            if (obj.software) {
                _this.software = new SoftwareComponent(obj.software);
            }
            if (obj.implementation) {
                _this.implementation = new ImplementationComponent(obj.implementation);
            }
            if (obj.fhirVersion) {
                _this.fhirVersion = obj.fhirVersion;
            }
            if (obj.acceptUnknown) {
                _this.acceptUnknown = obj.acceptUnknown;
            }
            if (obj.format) {
                _this.format = obj.format;
            }
            if (obj.patchFormat) {
                _this.patchFormat = obj.patchFormat;
            }
            if (obj.implementationGuide) {
                _this.implementationGuide = obj.implementationGuide;
            }
            if (obj.profile) {
                _this.profile = [];
                for (var _f = 0, _g = obj.profile || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.profile.push(new ResourceReference(o));
                }
            }
            if (obj.rest) {
                _this.rest = [];
                for (var _h = 0, _j = obj.rest || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.rest.push(new RestComponent(o));
                }
            }
            if (obj.messaging) {
                _this.messaging = [];
                for (var _k = 0, _l = obj.messaging || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.messaging.push(new MessagingComponent(o));
                }
            }
            if (obj.document) {
                _this.document = [];
                for (var _m = 0, _o = obj.document || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.document.push(new DocumentComponent(o));
                }
            }
        }
        return _this;
    }
    return CapabilityStatement;
}(DomainResource));

var ActivityComponent = (function (_super) {
    __extends(ActivityComponent, _super);
    function ActivityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.outcomeCodeableConcept) {
                _this.outcomeCodeableConcept = [];
                for (var _i = 0, _a = obj.outcomeCodeableConcept || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.outcomeCodeableConcept.push(new CodeableConcept(o));
                }
            }
            if (obj.outcomeReference) {
                _this.outcomeReference = [];
                for (var _b = 0, _c = obj.outcomeReference || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.outcomeReference.push(new ResourceReference(o));
                }
            }
            if (obj.progress) {
                _this.progress = [];
                for (var _d = 0, _e = obj.progress || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.progress.push(new Annotation(o));
                }
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
            if (obj.detail) {
                _this.detail = new DetailComponent(obj.detail);
            }
        }
        return _this;
    }
    return ActivityComponent;
}(BackboneElement));

var CarePlan = (function (_super) {
    __extends(CarePlan, _super);
    function CarePlan(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CarePlan';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _f = 0, _g = obj.replaces || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _h = 0, _j = obj.partOf || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.category) {
                _this.category = [];
                for (var _k = 0, _l = obj.category || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.author) {
                _this.author = [];
                for (var _m = 0, _o = obj.author || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.author.push(new ResourceReference(o));
                }
            }
            if (obj.careTeam) {
                _this.careTeam = [];
                for (var _p = 0, _q = obj.careTeam || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.careTeam.push(new ResourceReference(o));
                }
            }
            if (obj.addresses) {
                _this.addresses = [];
                for (var _r = 0, _s = obj.addresses || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.addresses.push(new ResourceReference(o));
                }
            }
            if (obj.supportingInfo) {
                _this.supportingInfo = [];
                for (var _t = 0, _u = obj.supportingInfo || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.supportingInfo.push(new ResourceReference(o));
                }
            }
            if (obj.goal) {
                _this.goal = [];
                for (var _v = 0, _w = obj.goal || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.goal.push(new ResourceReference(o));
                }
            }
            if (obj.activity) {
                _this.activity = [];
                for (var _x = 0, _y = obj.activity || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.activity.push(new ActivityComponent(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _z = 0, _0 = obj.note || []; _z < _0.length; _z++) {
                    var o = _0[_z];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return CarePlan;
}(DomainResource));

var CareTeam = (function (_super) {
    __extends(CareTeam, _super);
    function CareTeam(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CareTeam';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _b = 0, _c = obj.category || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _d = 0, _e = obj.participant || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _f = 0, _g = obj.reasonCode || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _h = 0, _j = obj.reasonReference || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = [];
                for (var _k = 0, _l = obj.managingOrganization || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.managingOrganization.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _m = 0, _o = obj.note || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return CareTeam;
}(DomainResource));

var ChargeItem = (function (_super) {
    __extends(ChargeItem, _super);
    function ChargeItem(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ChargeItem';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.definition) {
                _this.definition = obj.definition;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _i = 0, _a = obj.partOf || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _b = 0, _c = obj.participant || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.performingOrganization) {
                _this.performingOrganization = new ResourceReference(obj.performingOrganization);
            }
            if (obj.requestingOrganization) {
                _this.requestingOrganization = new ResourceReference(obj.requestingOrganization);
            }
            if (obj.quantity) {
                _this.quantity = new Quantity(obj.quantity);
            }
            if (obj.bodysite) {
                _this.bodysite = [];
                for (var _d = 0, _e = obj.bodysite || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.bodysite.push(new CodeableConcept(o));
                }
            }
            if (obj.factorOverride) {
                _this.factorOverride = obj.factorOverride;
            }
            if (obj.priceOverride) {
                _this.priceOverride = new Money(obj.priceOverride);
            }
            if (obj.overrideReason) {
                _this.overrideReason = obj.overrideReason;
            }
            if (obj.enterer) {
                _this.enterer = new ResourceReference(obj.enterer);
            }
            if (obj.enteredDate) {
                _this.enteredDate = new Date(obj.enteredDate);
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _f = 0, _g = obj.reason || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.service) {
                _this.service = [];
                for (var _h = 0, _j = obj.service || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.service.push(new ResourceReference(o));
                }
            }
            if (obj.account) {
                _this.account = [];
                for (var _k = 0, _l = obj.account || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.account.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _m = 0, _o = obj.note || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.supportingInformation) {
                _this.supportingInformation = [];
                for (var _p = 0, _q = obj.supportingInformation || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.supportingInformation.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return ChargeItem;
}(DomainResource));

var RelatedClaimComponent = (function (_super) {
    __extends(RelatedClaimComponent, _super);
    function RelatedClaimComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.claim) {
                _this.claim = new ResourceReference(obj.claim);
            }
            if (obj.relationship) {
                _this.relationship = new CodeableConcept(obj.relationship);
            }
            if (obj.reference) {
                _this.reference = new Identifier(obj.reference);
            }
        }
        return _this;
    }
    return RelatedClaimComponent;
}(BackboneElement));

var PayeeComponent = (function (_super) {
    __extends(PayeeComponent, _super);
    function PayeeComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.resourceType) {
                _this.resourceType = new Coding(obj.resourceType);
            }
            if (obj.party) {
                _this.party = new ResourceReference(obj.party);
            }
        }
        return _this;
    }
    return PayeeComponent;
}(BackboneElement));

var CareTeamComponent = (function (_super) {
    __extends(CareTeamComponent, _super);
    function CareTeamComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.responsible) {
                _this.responsible = obj.responsible;
            }
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
            if (obj.qualification) {
                _this.qualification = new CodeableConcept(obj.qualification);
            }
        }
        return _this;
    }
    return CareTeamComponent;
}(BackboneElement));

var SpecialConditionComponent = (function (_super) {
    __extends(SpecialConditionComponent, _super);
    function SpecialConditionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.timing) {
                _this.timing = new Element(obj.timing);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.reason) {
                _this.reason = new CodeableConcept(obj.reason);
            }
        }
        return _this;
    }
    return SpecialConditionComponent;
}(BackboneElement));

var DiagnosisComponent = (function (_super) {
    __extends(DiagnosisComponent, _super);
    function DiagnosisComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.diagnosis) {
                _this.diagnosis = new Element(obj.diagnosis);
            }
            if (obj.type) {
                _this.type = [];
                for (var _i = 0, _a = obj.type || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.packageCode) {
                _this.packageCode = new CodeableConcept(obj.packageCode);
            }
        }
        return _this;
    }
    return DiagnosisComponent;
}(BackboneElement));

var ProcedureComponent = (function (_super) {
    __extends(ProcedureComponent, _super);
    function ProcedureComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.procedure) {
                _this.procedure = new Element(obj.procedure);
            }
        }
        return _this;
    }
    return ProcedureComponent;
}(BackboneElement));

var InsuranceComponent = (function (_super) {
    __extends(InsuranceComponent, _super);
    function InsuranceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.focal) {
                _this.focal = obj.focal;
            }
            if (obj.coverage) {
                _this.coverage = new ResourceReference(obj.coverage);
            }
            if (obj.businessArrangement) {
                _this.businessArrangement = obj.businessArrangement;
            }
            if (obj.preAuthRef) {
                _this.preAuthRef = obj.preAuthRef;
            }
            if (obj.claimResponse) {
                _this.claimResponse = new ResourceReference(obj.claimResponse);
            }
        }
        return _this;
    }
    return InsuranceComponent;
}(BackboneElement));

var AccidentComponent = (function (_super) {
    __extends(AccidentComponent, _super);
    function AccidentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.location) {
                _this.location = new Element(obj.location);
            }
        }
        return _this;
    }
    return AccidentComponent;
}(BackboneElement));

var ItemComponent = (function (_super) {
    __extends(ItemComponent, _super);
    function ItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.careTeamLinkId) {
                _this.careTeamLinkId = obj.careTeamLinkId;
            }
            if (obj.diagnosisLinkId) {
                _this.diagnosisLinkId = obj.diagnosisLinkId;
            }
            if (obj.procedureLinkId) {
                _this.procedureLinkId = obj.procedureLinkId;
            }
            if (obj.informationLinkId) {
                _this.informationLinkId = obj.informationLinkId;
            }
            if (obj.revenue) {
                _this.revenue = new CodeableConcept(obj.revenue);
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.service) {
                _this.service = new CodeableConcept(obj.service);
            }
            if (obj.modifier) {
                _this.modifier = [];
                for (var _i = 0, _a = obj.modifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.modifier.push(new CodeableConcept(o));
                }
            }
            if (obj.programCode) {
                _this.programCode = [];
                for (var _b = 0, _c = obj.programCode || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.programCode.push(new CodeableConcept(o));
                }
            }
            if (obj.serviced) {
                _this.serviced = new Element(obj.serviced);
            }
            if (obj.location) {
                _this.location = new Element(obj.location);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.unitPrice) {
                _this.unitPrice = new Money(obj.unitPrice);
            }
            if (obj.factor) {
                _this.factor = obj.factor;
            }
            if (obj.net) {
                _this.net = new Money(obj.net);
            }
            if (obj.udi) {
                _this.udi = [];
                for (var _d = 0, _e = obj.udi || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.udi.push(new ResourceReference(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = new CodeableConcept(obj.bodySite);
            }
            if (obj.subSite) {
                _this.subSite = [];
                for (var _f = 0, _g = obj.subSite || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.subSite.push(new CodeableConcept(o));
                }
            }
            if (obj.encounter) {
                _this.encounter = [];
                for (var _h = 0, _j = obj.encounter || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.encounter.push(new ResourceReference(o));
                }
            }
            if (obj.detail) {
                _this.detail = [];
                for (var _k = 0, _l = obj.detail || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.detail.push(new DetailComponent(o));
                }
            }
        }
        return _this;
    }
    return ItemComponent;
}(BackboneElement));

var Claim = (function (_super) {
    __extends(Claim, _super);
    function Claim(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Claim';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subType) {
                _this.subType = [];
                for (var _b = 0, _c = obj.subType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.subType.push(new CodeableConcept(o));
                }
            }
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.billablePeriod) {
                _this.billablePeriod = new Period(obj.billablePeriod);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.enterer) {
                _this.enterer = new ResourceReference(obj.enterer);
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.priority) {
                _this.priority = new CodeableConcept(obj.priority);
            }
            if (obj.fundsReserve) {
                _this.fundsReserve = new CodeableConcept(obj.fundsReserve);
            }
            if (obj.related) {
                _this.related = [];
                for (var _d = 0, _e = obj.related || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.related.push(new RelatedClaimComponent(o));
                }
            }
            if (obj.prescription) {
                _this.prescription = new ResourceReference(obj.prescription);
            }
            if (obj.originalPrescription) {
                _this.originalPrescription = new ResourceReference(obj.originalPrescription);
            }
            if (obj.payee) {
                _this.payee = new PayeeComponent(obj.payee);
            }
            if (obj.referral) {
                _this.referral = new ResourceReference(obj.referral);
            }
            if (obj.facility) {
                _this.facility = new ResourceReference(obj.facility);
            }
            if (obj.careTeam) {
                _this.careTeam = [];
                for (var _f = 0, _g = obj.careTeam || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.careTeam.push(new CareTeamComponent(o));
                }
            }
            if (obj.information) {
                _this.information = [];
                for (var _h = 0, _j = obj.information || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.information.push(new SpecialConditionComponent(o));
                }
            }
            if (obj.diagnosis) {
                _this.diagnosis = [];
                for (var _k = 0, _l = obj.diagnosis || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.diagnosis.push(new DiagnosisComponent(o));
                }
            }
            if (obj.procedure) {
                _this.procedure = [];
                for (var _m = 0, _o = obj.procedure || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.procedure.push(new ProcedureComponent(o));
                }
            }
            if (obj.insurance) {
                _this.insurance = [];
                for (var _p = 0, _q = obj.insurance || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.insurance.push(new InsuranceComponent(o));
                }
            }
            if (obj.accident) {
                _this.accident = new AccidentComponent(obj.accident);
            }
            if (obj.employmentImpacted) {
                _this.employmentImpacted = new Period(obj.employmentImpacted);
            }
            if (obj.hospitalization) {
                _this.hospitalization = new Period(obj.hospitalization);
            }
            if (obj.item) {
                _this.item = [];
                for (var _r = 0, _s = obj.item || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.item.push(new ItemComponent(o));
                }
            }
            if (obj.total) {
                _this.total = new Money(obj.total);
            }
        }
        return _this;
    }
    return Claim;
}(DomainResource));

var AdjudicationComponent = (function (_super) {
    __extends(AdjudicationComponent, _super);
    function AdjudicationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.reason) {
                _this.reason = new CodeableConcept(obj.reason);
            }
            if (obj.amount) {
                _this.amount = new Money(obj.amount);
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return AdjudicationComponent;
}(BackboneElement));

var AddedItemsDetailComponent = (function (_super) {
    __extends(AddedItemsDetailComponent, _super);
    function AddedItemsDetailComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.revenue) {
                _this.revenue = new CodeableConcept(obj.revenue);
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.service) {
                _this.service = new CodeableConcept(obj.service);
            }
            if (obj.modifier) {
                _this.modifier = [];
                for (var _i = 0, _a = obj.modifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.modifier.push(new CodeableConcept(o));
                }
            }
            if (obj.fee) {
                _this.fee = new Money(obj.fee);
            }
            if (obj.noteNumber) {
                _this.noteNumber = obj.noteNumber;
            }
            if (obj.adjudication) {
                _this.adjudication = [];
                for (var _b = 0, _c = obj.adjudication || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.adjudication.push(new AdjudicationComponent(o));
                }
            }
        }
        return _this;
    }
    return AddedItemsDetailComponent;
}(BackboneElement));

var AddedItemComponent = (function (_super) {
    __extends(AddedItemComponent, _super);
    function AddedItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequenceLinkId) {
                _this.sequenceLinkId = obj.sequenceLinkId;
            }
            if (obj.revenue) {
                _this.revenue = new CodeableConcept(obj.revenue);
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.service) {
                _this.service = new CodeableConcept(obj.service);
            }
            if (obj.modifier) {
                _this.modifier = [];
                for (var _i = 0, _a = obj.modifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.modifier.push(new CodeableConcept(o));
                }
            }
            if (obj.fee) {
                _this.fee = new Money(obj.fee);
            }
            if (obj.noteNumber) {
                _this.noteNumber = obj.noteNumber;
            }
            if (obj.adjudication) {
                _this.adjudication = [];
                for (var _b = 0, _c = obj.adjudication || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.adjudication.push(new AdjudicationComponent(o));
                }
            }
            if (obj.detail) {
                _this.detail = [];
                for (var _d = 0, _e = obj.detail || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.detail.push(new AddedItemsDetailComponent(o));
                }
            }
        }
        return _this;
    }
    return AddedItemComponent;
}(BackboneElement));

var ErrorComponent = (function (_super) {
    __extends(ErrorComponent, _super);
    function ErrorComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequenceLinkId) {
                _this.sequenceLinkId = obj.sequenceLinkId;
            }
            if (obj.detailSequenceLinkId) {
                _this.detailSequenceLinkId = obj.detailSequenceLinkId;
            }
            if (obj.subdetailSequenceLinkId) {
                _this.subdetailSequenceLinkId = obj.subdetailSequenceLinkId;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
        }
        return _this;
    }
    return ErrorComponent;
}(BackboneElement));

var PaymentComponent = (function (_super) {
    __extends(PaymentComponent, _super);
    function PaymentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.adjustment) {
                _this.adjustment = new Money(obj.adjustment);
            }
            if (obj.adjustmentReason) {
                _this.adjustmentReason = new CodeableConcept(obj.adjustmentReason);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.amount) {
                _this.amount = new Money(obj.amount);
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
        }
        return _this;
    }
    return PaymentComponent;
}(BackboneElement));

var NoteComponent = (function (_super) {
    __extends(NoteComponent, _super);
    function NoteComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.number) {
                _this.number = obj.number;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.language) {
                _this.language = new CodeableConcept(obj.language);
            }
        }
        return _this;
    }
    return NoteComponent;
}(BackboneElement));

var ClaimResponse = (function (_super) {
    __extends(ClaimResponse, _super);
    function ClaimResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ClaimResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.requestProvider) {
                _this.requestProvider = new ResourceReference(obj.requestProvider);
            }
            if (obj.requestOrganization) {
                _this.requestOrganization = new ResourceReference(obj.requestOrganization);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.payeeType) {
                _this.payeeType = new CodeableConcept(obj.payeeType);
            }
            if (obj.item) {
                _this.item = [];
                for (var _b = 0, _c = obj.item || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.item.push(new ItemComponent(o));
                }
            }
            if (obj.addItem) {
                _this.addItem = [];
                for (var _d = 0, _e = obj.addItem || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.addItem.push(new AddedItemComponent(o));
                }
            }
            if (obj.error) {
                _this.error = [];
                for (var _f = 0, _g = obj.error || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.error.push(new ErrorComponent(o));
                }
            }
            if (obj.totalCost) {
                _this.totalCost = new Money(obj.totalCost);
            }
            if (obj.unallocDeductable) {
                _this.unallocDeductable = new Money(obj.unallocDeductable);
            }
            if (obj.totalBenefit) {
                _this.totalBenefit = new Money(obj.totalBenefit);
            }
            if (obj.payment) {
                _this.payment = new PaymentComponent(obj.payment);
            }
            if (obj.reserved) {
                _this.reserved = new Coding(obj.reserved);
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.processNote) {
                _this.processNote = [];
                for (var _h = 0, _j = obj.processNote || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.processNote.push(new NoteComponent(o));
                }
            }
            if (obj.communicationRequest) {
                _this.communicationRequest = [];
                for (var _k = 0, _l = obj.communicationRequest || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.communicationRequest.push(new ResourceReference(o));
                }
            }
            if (obj.insurance) {
                _this.insurance = [];
                for (var _m = 0, _o = obj.insurance || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.insurance.push(new InsuranceComponent(o));
                }
            }
        }
        return _this;
    }
    return ClaimResponse;
}(DomainResource));

var InvestigationComponent = (function (_super) {
    __extends(InvestigationComponent, _super);
    function InvestigationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.item) {
                _this.item = [];
                for (var _i = 0, _a = obj.item || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.item.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return InvestigationComponent;
}(BackboneElement));

var FindingComponent = (function (_super) {
    __extends(FindingComponent, _super);
    function FindingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.item) {
                _this.item = new Element(obj.item);
            }
            if (obj.basis) {
                _this.basis = obj.basis;
            }
        }
        return _this;
    }
    return FindingComponent;
}(BackboneElement));

var ClinicalImpression = (function (_super) {
    __extends(ClinicalImpression, _super);
    function ClinicalImpression(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ClinicalImpression';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.effective) {
                _this.effective = new Element(obj.effective);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.assessor) {
                _this.assessor = new ResourceReference(obj.assessor);
            }
            if (obj.previous) {
                _this.previous = new ResourceReference(obj.previous);
            }
            if (obj.problem) {
                _this.problem = [];
                for (var _b = 0, _c = obj.problem || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.problem.push(new ResourceReference(o));
                }
            }
            if (obj.investigation) {
                _this.investigation = [];
                for (var _d = 0, _e = obj.investigation || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.investigation.push(new InvestigationComponent(o));
                }
            }
            if (obj.protocol) {
                _this.protocol = obj.protocol;
            }
            if (obj.summary) {
                _this.summary = obj.summary;
            }
            if (obj.finding) {
                _this.finding = [];
                for (var _f = 0, _g = obj.finding || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.finding.push(new FindingComponent(o));
                }
            }
            if (obj.prognosisCodeableConcept) {
                _this.prognosisCodeableConcept = [];
                for (var _h = 0, _j = obj.prognosisCodeableConcept || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.prognosisCodeableConcept.push(new CodeableConcept(o));
                }
            }
            if (obj.prognosisReference) {
                _this.prognosisReference = [];
                for (var _k = 0, _l = obj.prognosisReference || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.prognosisReference.push(new ResourceReference(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _m = 0, _o = obj.action || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.action.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _p = 0, _q = obj.note || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return ClinicalImpression;
}(DomainResource));

var PayloadComponent = (function (_super) {
    __extends(PayloadComponent, _super);
    function PayloadComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.content) {
                _this.content = new Element(obj.content);
            }
        }
        return _this;
    }
    return PayloadComponent;
}(BackboneElement));

var Communication = (function (_super) {
    __extends(Communication, _super);
    function Communication(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Communication';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _f = 0, _g = obj.partOf || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.notDone) {
                _this.notDone = obj.notDone;
            }
            if (obj.notDoneReason) {
                _this.notDoneReason = new CodeableConcept(obj.notDoneReason);
            }
            if (obj.category) {
                _this.category = [];
                for (var _h = 0, _j = obj.category || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.medium) {
                _this.medium = [];
                for (var _k = 0, _l = obj.medium || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.medium.push(new CodeableConcept(o));
                }
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.recipient) {
                _this.recipient = [];
                for (var _m = 0, _o = obj.recipient || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.recipient.push(new ResourceReference(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _p = 0, _q = obj.topic || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.topic.push(new ResourceReference(o));
                }
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.sent) {
                _this.sent = new Date(obj.sent);
            }
            if (obj.received) {
                _this.received = new Date(obj.received);
            }
            if (obj.sender) {
                _this.sender = new ResourceReference(obj.sender);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _r = 0, _s = obj.reasonCode || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _t = 0, _u = obj.reasonReference || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.payload) {
                _this.payload = [];
                for (var _v = 0, _w = obj.payload || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.payload.push(new PayloadComponent(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _x = 0, _y = obj.note || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return Communication;
}(DomainResource));

var RequesterComponent = (function (_super) {
    __extends(RequesterComponent, _super);
    function RequesterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.agent) {
                _this.agent = new ResourceReference(obj.agent);
            }
            if (obj.onBehalfOf) {
                _this.onBehalfOf = new ResourceReference(obj.onBehalfOf);
            }
        }
        return _this;
    }
    return RequesterComponent;
}(BackboneElement));

var CommunicationRequest = (function (_super) {
    __extends(CommunicationRequest, _super);
    function CommunicationRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CommunicationRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _d = 0, _e = obj.replaces || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _f = 0, _g = obj.category || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.medium) {
                _this.medium = [];
                for (var _h = 0, _j = obj.medium || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.medium.push(new CodeableConcept(o));
                }
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.recipient) {
                _this.recipient = [];
                for (var _k = 0, _l = obj.recipient || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.recipient.push(new ResourceReference(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _m = 0, _o = obj.topic || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.topic.push(new ResourceReference(o));
                }
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.payload) {
                _this.payload = [];
                for (var _p = 0, _q = obj.payload || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.payload.push(new PayloadComponent(o));
                }
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.sender) {
                _this.sender = new ResourceReference(obj.sender);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _r = 0, _s = obj.reasonCode || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _t = 0, _u = obj.reasonReference || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _v = 0, _w = obj.note || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return CommunicationRequest;
}(DomainResource));

var CompartmentDefinition = (function (_super) {
    __extends(CompartmentDefinition, _super);
    function CompartmentDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'CompartmentDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.search) {
                _this.search = obj.search;
            }
            if (obj.resource) {
                _this.resource = [];
                for (var _f = 0, _g = obj.resource || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.resource.push(new ResourceComponent(o));
                }
            }
        }
        return _this;
    }
    return CompartmentDefinition;
}(DomainResource));

var AttesterComponent = (function (_super) {
    __extends(AttesterComponent, _super);
    function AttesterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.time) {
                _this.time = new Date(obj.time);
            }
            if (obj.party) {
                _this.party = new ResourceReference(obj.party);
            }
        }
        return _this;
    }
    return AttesterComponent;
}(BackboneElement));

var RelatesToComponent = (function (_super) {
    __extends(RelatesToComponent, _super);
    function RelatesToComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.target) {
                _this.target = new Element(obj.target);
            }
        }
        return _this;
    }
    return RelatesToComponent;
}(BackboneElement));

var SectionComponent = (function (_super) {
    __extends(SectionComponent, _super);
    function SectionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.text) {
                _this.text = new Narrative(obj.text);
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.orderedBy) {
                _this.orderedBy = new CodeableConcept(obj.orderedBy);
            }
            if (obj.entry) {
                _this.entry = [];
                for (var _i = 0, _a = obj.entry || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.entry.push(new ResourceReference(o));
                }
            }
            if (obj.emptyReason) {
                _this.emptyReason = new CodeableConcept(obj.emptyReason);
            }
            if (obj.section) {
                _this.section = [];
                for (var _b = 0, _c = obj.section || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.section.push(new SectionComponent(o));
                }
            }
        }
        return _this;
    }
    return SectionComponent;
}(BackboneElement));

var Composition = (function (_super) {
    __extends(Composition, _super);
    function Composition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Composition';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.class) {
                _this.class = new CodeableConcept(obj.class);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.author) {
                _this.author = [];
                for (var _i = 0, _a = obj.author || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.author.push(new ResourceReference(o));
                }
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.confidentiality) {
                _this.confidentiality = obj.confidentiality;
            }
            if (obj.attester) {
                _this.attester = [];
                for (var _b = 0, _c = obj.attester || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.attester.push(new AttesterComponent(o));
                }
            }
            if (obj.custodian) {
                _this.custodian = new ResourceReference(obj.custodian);
            }
            if (obj.relatesTo) {
                _this.relatesTo = [];
                for (var _d = 0, _e = obj.relatesTo || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.relatesTo.push(new RelatesToComponent(o));
                }
            }
            if (obj.event) {
                _this.event = [];
                for (var _f = 0, _g = obj.event || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.event.push(new EventComponent(o));
                }
            }
            if (obj.section) {
                _this.section = [];
                for (var _h = 0, _j = obj.section || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.section.push(new SectionComponent(o));
                }
            }
        }
        return _this;
    }
    return Composition;
}(DomainResource));

var StageComponent = (function (_super) {
    __extends(StageComponent, _super);
    function StageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.summary) {
                _this.summary = new CodeableConcept(obj.summary);
            }
            if (obj.assessment) {
                _this.assessment = [];
                for (var _i = 0, _a = obj.assessment || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.assessment.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return StageComponent;
}(BackboneElement));

var EvidenceComponent = (function (_super) {
    __extends(EvidenceComponent, _super);
    function EvidenceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = [];
                for (var _i = 0, _a = obj.code || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.code.push(new CodeableConcept(o));
                }
            }
            if (obj.detail) {
                _this.detail = [];
                for (var _b = 0, _c = obj.detail || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.detail.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return EvidenceComponent;
}(BackboneElement));

var Condition = (function (_super) {
    __extends(Condition, _super);
    function Condition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Condition';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.clinicalStatus) {
                _this.clinicalStatus = obj.clinicalStatus;
            }
            if (obj.verificationStatus) {
                _this.verificationStatus = obj.verificationStatus;
            }
            if (obj.category) {
                _this.category = [];
                for (var _b = 0, _c = obj.category || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.severity) {
                _this.severity = new CodeableConcept(obj.severity);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.bodySite) {
                _this.bodySite = [];
                for (var _d = 0, _e = obj.bodySite || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.bodySite.push(new CodeableConcept(o));
                }
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.onset) {
                _this.onset = new Element(obj.onset);
            }
            if (obj.abatement) {
                _this.abatement = new Element(obj.abatement);
            }
            if (obj.assertedDate) {
                _this.assertedDate = new Date(obj.assertedDate);
            }
            if (obj.asserter) {
                _this.asserter = new ResourceReference(obj.asserter);
            }
            if (obj.stage) {
                _this.stage = new StageComponent(obj.stage);
            }
            if (obj.evidence) {
                _this.evidence = [];
                for (var _f = 0, _g = obj.evidence || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.evidence.push(new EvidenceComponent(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _h = 0, _j = obj.note || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return Condition;
}(DomainResource));

var ActorComponent = (function (_super) {
    __extends(ActorComponent, _super);
    function ActorComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
        }
        return _this;
    }
    return ActorComponent;
}(BackboneElement));

var PolicyComponent = (function (_super) {
    __extends(PolicyComponent, _super);
    function PolicyComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.authority) {
                _this.authority = obj.authority;
            }
            if (obj.uri) {
                _this.uri = obj.uri;
            }
        }
        return _this;
    }
    return PolicyComponent;
}(BackboneElement));

var DataComponent = (function (_super) {
    __extends(DataComponent, _super);
    function DataComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.meaning) {
                _this.meaning = obj.meaning;
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
        }
        return _this;
    }
    return DataComponent;
}(BackboneElement));

var ExceptActorComponent = (function (_super) {
    __extends(ExceptActorComponent, _super);
    function ExceptActorComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
        }
        return _this;
    }
    return ExceptActorComponent;
}(BackboneElement));

var ExceptDataComponent = (function (_super) {
    __extends(ExceptDataComponent, _super);
    function ExceptDataComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.meaning) {
                _this.meaning = obj.meaning;
            }
            if (obj.reference) {
                _this.reference = new ResourceReference(obj.reference);
            }
        }
        return _this;
    }
    return ExceptDataComponent;
}(BackboneElement));

var ExceptComponent = (function (_super) {
    __extends(ExceptComponent, _super);
    function ExceptComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.actor) {
                _this.actor = [];
                for (var _i = 0, _a = obj.actor || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.actor.push(new ExceptActorComponent(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _b = 0, _c = obj.action || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.action.push(new CodeableConcept(o));
                }
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _d = 0, _e = obj.securityLabel || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.securityLabel.push(new Coding(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = [];
                for (var _f = 0, _g = obj.purpose || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.purpose.push(new Coding(o));
                }
            }
            if (obj.class) {
                _this.class = [];
                for (var _h = 0, _j = obj.class || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.class.push(new Coding(o));
                }
            }
            if (obj.code) {
                _this.code = [];
                for (var _k = 0, _l = obj.code || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.code.push(new Coding(o));
                }
            }
            if (obj.dataPeriod) {
                _this.dataPeriod = new Period(obj.dataPeriod);
            }
            if (obj.data) {
                _this.data = [];
                for (var _m = 0, _o = obj.data || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.data.push(new ExceptDataComponent(o));
                }
            }
        }
        return _this;
    }
    return ExceptComponent;
}(BackboneElement));

var Consent = (function (_super) {
    __extends(Consent, _super);
    function Consent(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Consent';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _i = 0, _a = obj.category || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.dateTime) {
                _this.dateTime = new Date(obj.dateTime);
            }
            if (obj.consentingParty) {
                _this.consentingParty = [];
                for (var _b = 0, _c = obj.consentingParty || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.consentingParty.push(new ResourceReference(o));
                }
            }
            if (obj.actor) {
                _this.actor = [];
                for (var _d = 0, _e = obj.actor || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.actor.push(new ActorComponent(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _f = 0, _g = obj.action || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.action.push(new CodeableConcept(o));
                }
            }
            if (obj.organization) {
                _this.organization = [];
                for (var _h = 0, _j = obj.organization || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.organization.push(new ResourceReference(o));
                }
            }
            if (obj.source) {
                _this.source = new Element(obj.source);
            }
            if (obj.policy) {
                _this.policy = [];
                for (var _k = 0, _l = obj.policy || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.policy.push(new PolicyComponent(o));
                }
            }
            if (obj.policyRule) {
                _this.policyRule = obj.policyRule;
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _m = 0, _o = obj.securityLabel || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.securityLabel.push(new Coding(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = [];
                for (var _p = 0, _q = obj.purpose || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.purpose.push(new Coding(o));
                }
            }
            if (obj.dataPeriod) {
                _this.dataPeriod = new Period(obj.dataPeriod);
            }
            if (obj.data) {
                _this.data = [];
                for (var _r = 0, _s = obj.data || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.data.push(new DataComponent(o));
                }
            }
            if (obj.except) {
                _this.except = [];
                for (var _t = 0, _u = obj.except || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.except.push(new ExceptComponent(o));
                }
            }
        }
        return _this;
    }
    return Consent;
}(DomainResource));

var SignatoryComponent = (function (_super) {
    __extends(SignatoryComponent, _super);
    function SignatoryComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new Coding(obj.type);
            }
            if (obj.party) {
                _this.party = new ResourceReference(obj.party);
            }
            if (obj.signature) {
                _this.signature = [];
                for (var _i = 0, _a = obj.signature || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.signature.push(new Signature(o));
                }
            }
        }
        return _this;
    }
    return SignatoryComponent;
}(BackboneElement));

var ValuedItemComponent = (function (_super) {
    __extends(ValuedItemComponent, _super);
    function ValuedItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.entity) {
                _this.entity = new Element(obj.entity);
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.effectiveTime) {
                _this.effectiveTime = new Date(obj.effectiveTime);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.unitPrice) {
                _this.unitPrice = new Money(obj.unitPrice);
            }
            if (obj.factor) {
                _this.factor = obj.factor;
            }
            if (obj.points) {
                _this.points = obj.points;
            }
            if (obj.net) {
                _this.net = new Money(obj.net);
            }
        }
        return _this;
    }
    return ValuedItemComponent;
}(BackboneElement));

var TermAgentComponent = (function (_super) {
    __extends(TermAgentComponent, _super);
    function TermAgentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.actor) {
                _this.actor = new ResourceReference(obj.actor);
            }
            if (obj.role) {
                _this.role = [];
                for (var _i = 0, _a = obj.role || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.role.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return TermAgentComponent;
}(BackboneElement));

var TermValuedItemComponent = (function (_super) {
    __extends(TermValuedItemComponent, _super);
    function TermValuedItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.entity) {
                _this.entity = new Element(obj.entity);
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.effectiveTime) {
                _this.effectiveTime = new Date(obj.effectiveTime);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.unitPrice) {
                _this.unitPrice = new Money(obj.unitPrice);
            }
            if (obj.factor) {
                _this.factor = obj.factor;
            }
            if (obj.points) {
                _this.points = obj.points;
            }
            if (obj.net) {
                _this.net = new Money(obj.net);
            }
        }
        return _this;
    }
    return TermValuedItemComponent;
}(BackboneElement));

var TermComponent = (function (_super) {
    __extends(TermComponent, _super);
    function TermComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.issued) {
                _this.issued = new Date(obj.issued);
            }
            if (obj.applies) {
                _this.applies = new Period(obj.applies);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subType) {
                _this.subType = new CodeableConcept(obj.subType);
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _i = 0, _a = obj.topic || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.topic.push(new ResourceReference(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _b = 0, _c = obj.action || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.action.push(new CodeableConcept(o));
                }
            }
            if (obj.actionReason) {
                _this.actionReason = [];
                for (var _d = 0, _e = obj.actionReason || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.actionReason.push(new CodeableConcept(o));
                }
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _f = 0, _g = obj.securityLabel || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.securityLabel.push(new Coding(o));
                }
            }
            if (obj.agent) {
                _this.agent = [];
                for (var _h = 0, _j = obj.agent || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.agent.push(new TermAgentComponent(o));
                }
            }
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.valuedItem) {
                _this.valuedItem = [];
                for (var _k = 0, _l = obj.valuedItem || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.valuedItem.push(new TermValuedItemComponent(o));
                }
            }
            if (obj.group) {
                _this.group = [];
                for (var _m = 0, _o = obj.group || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.group.push(new TermComponent(o));
                }
            }
        }
        return _this;
    }
    return TermComponent;
}(BackboneElement));

var FriendlyLanguageComponent = (function (_super) {
    __extends(FriendlyLanguageComponent, _super);
    function FriendlyLanguageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.content) {
                _this.content = new Element(obj.content);
            }
        }
        return _this;
    }
    return FriendlyLanguageComponent;
}(BackboneElement));

var LegalLanguageComponent = (function (_super) {
    __extends(LegalLanguageComponent, _super);
    function LegalLanguageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.content) {
                _this.content = new Element(obj.content);
            }
        }
        return _this;
    }
    return LegalLanguageComponent;
}(BackboneElement));

var ComputableLanguageComponent = (function (_super) {
    __extends(ComputableLanguageComponent, _super);
    function ComputableLanguageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.content) {
                _this.content = new Element(obj.content);
            }
        }
        return _this;
    }
    return ComputableLanguageComponent;
}(BackboneElement));

var Contract = (function (_super) {
    __extends(Contract, _super);
    function Contract(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Contract';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.issued) {
                _this.issued = new Date(obj.issued);
            }
            if (obj.applies) {
                _this.applies = new Period(obj.applies);
            }
            if (obj.subject) {
                _this.subject = [];
                for (var _i = 0, _a = obj.subject || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.subject.push(new ResourceReference(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _b = 0, _c = obj.topic || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.topic.push(new ResourceReference(o));
                }
            }
            if (obj.authority) {
                _this.authority = [];
                for (var _d = 0, _e = obj.authority || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.authority.push(new ResourceReference(o));
                }
            }
            if (obj.domain) {
                _this.domain = [];
                for (var _f = 0, _g = obj.domain || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.domain.push(new ResourceReference(o));
                }
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subType) {
                _this.subType = [];
                for (var _h = 0, _j = obj.subType || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.subType.push(new CodeableConcept(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _k = 0, _l = obj.action || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.action.push(new CodeableConcept(o));
                }
            }
            if (obj.actionReason) {
                _this.actionReason = [];
                for (var _m = 0, _o = obj.actionReason || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.actionReason.push(new CodeableConcept(o));
                }
            }
            if (obj.decisionType) {
                _this.decisionType = new CodeableConcept(obj.decisionType);
            }
            if (obj.contentDerivative) {
                _this.contentDerivative = new CodeableConcept(obj.contentDerivative);
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _p = 0, _q = obj.securityLabel || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.securityLabel.push(new Coding(o));
                }
            }
            if (obj.agent) {
                _this.agent = [];
                for (var _r = 0, _s = obj.agent || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.agent.push(new AgentComponent(o));
                }
            }
            if (obj.signer) {
                _this.signer = [];
                for (var _t = 0, _u = obj.signer || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.signer.push(new SignatoryComponent(o));
                }
            }
            if (obj.valuedItem) {
                _this.valuedItem = [];
                for (var _v = 0, _w = obj.valuedItem || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.valuedItem.push(new ValuedItemComponent(o));
                }
            }
            if (obj.term) {
                _this.term = [];
                for (var _x = 0, _y = obj.term || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.term.push(new TermComponent(o));
                }
            }
            if (obj.binding) {
                _this.binding = new Element(obj.binding);
            }
            if (obj.friendly) {
                _this.friendly = [];
                for (var _z = 0, _0 = obj.friendly || []; _z < _0.length; _z++) {
                    var o = _0[_z];
                    _this.friendly.push(new FriendlyLanguageComponent(o));
                }
            }
            if (obj.legal) {
                _this.legal = [];
                for (var _1 = 0, _2 = obj.legal || []; _1 < _2.length; _1++) {
                    var o = _2[_1];
                    _this.legal.push(new LegalLanguageComponent(o));
                }
            }
            if (obj.rule) {
                _this.rule = [];
                for (var _3 = 0, _4 = obj.rule || []; _3 < _4.length; _3++) {
                    var o = _4[_3];
                    _this.rule.push(new ComputableLanguageComponent(o));
                }
            }
        }
        return _this;
    }
    return Contract;
}(DomainResource));

var Count = (function (_super) {
    __extends(Count, _super);
    function Count(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return Count;
}(Quantity));

var Coverage = (function (_super) {
    __extends(Coverage, _super);
    function Coverage(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Coverage';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.policyHolder) {
                _this.policyHolder = new ResourceReference(obj.policyHolder);
            }
            if (obj.subscriber) {
                _this.subscriber = new ResourceReference(obj.subscriber);
            }
            if (obj.subscriberId) {
                _this.subscriberId = obj.subscriberId;
            }
            if (obj.beneficiary) {
                _this.beneficiary = new ResourceReference(obj.beneficiary);
            }
            if (obj.relationship) {
                _this.relationship = new CodeableConcept(obj.relationship);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.payor) {
                _this.payor = [];
                for (var _b = 0, _c = obj.payor || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.payor.push(new ResourceReference(o));
                }
            }
            if (obj.grouping) {
                _this.grouping = new GroupComponent(obj.grouping);
            }
            if (obj.dependent) {
                _this.dependent = obj.dependent;
            }
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.order) {
                _this.order = obj.order;
            }
            if (obj.network) {
                _this.network = obj.network;
            }
            if (obj.contract) {
                _this.contract = [];
                for (var _d = 0, _e = obj.contract || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.contract.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return Coverage;
}(DomainResource));

var DataElement = (function (_super) {
    __extends(DataElement, _super);
    function DataElement(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DataElement';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _d = 0, _e = obj.useContext || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _f = 0, _g = obj.jurisdiction || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.stringency) {
                _this.stringency = obj.stringency;
            }
            if (obj.mapping) {
                _this.mapping = [];
                for (var _h = 0, _j = obj.mapping || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.mapping.push(new MappingComponent(o));
                }
            }
            if (obj.element) {
                _this.element = [];
                for (var _k = 0, _l = obj.element || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.element.push(new ElementDefinition(o));
                }
            }
        }
        return _this;
    }
    return DataElement;
}(DomainResource));

var CodeFilterComponent = (function (_super) {
    __extends(CodeFilterComponent, _super);
    function CodeFilterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.valueSet) {
                _this.valueSet = new Element(obj.valueSet);
            }
            if (obj.valueCode) {
                _this.valueCode = obj.valueCode;
            }
            if (obj.valueCoding) {
                _this.valueCoding = [];
                for (var _i = 0, _a = obj.valueCoding || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.valueCoding.push(new Coding(o));
                }
            }
            if (obj.valueCodeableConcept) {
                _this.valueCodeableConcept = [];
                for (var _b = 0, _c = obj.valueCodeableConcept || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.valueCodeableConcept.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return CodeFilterComponent;
}(Element));

var DateFilterComponent = (function (_super) {
    __extends(DateFilterComponent, _super);
    function DateFilterComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return DateFilterComponent;
}(Element));

var DataRequirement = (function (_super) {
    __extends(DataRequirement, _super);
    function DataRequirement(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.profile) {
                _this.profile = obj.profile;
            }
            if (obj.mustSupport) {
                _this.mustSupport = obj.mustSupport;
            }
            if (obj.codeFilter) {
                _this.codeFilter = [];
                for (var _i = 0, _a = obj.codeFilter || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.codeFilter.push(new CodeFilterComponent(o));
                }
            }
            if (obj.dateFilter) {
                _this.dateFilter = [];
                for (var _b = 0, _c = obj.dateFilter || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.dateFilter.push(new DateFilterComponent(o));
                }
            }
        }
        return _this;
    }
    return DataRequirement;
}(Element));

var MitigationComponent = (function (_super) {
    __extends(MitigationComponent, _super);
    function MitigationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.action) {
                _this.action = new CodeableConcept(obj.action);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
        }
        return _this;
    }
    return MitigationComponent;
}(BackboneElement));

var DetectedIssue = (function (_super) {
    __extends(DetectedIssue, _super);
    function DetectedIssue(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DetectedIssue';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.severity) {
                _this.severity = obj.severity;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.implicated) {
                _this.implicated = [];
                for (var _i = 0, _a = obj.implicated || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.implicated.push(new ResourceReference(o));
                }
            }
            if (obj.detail) {
                _this.detail = obj.detail;
            }
            if (obj.reference) {
                _this.reference = obj.reference;
            }
            if (obj.mitigation) {
                _this.mitigation = [];
                for (var _b = 0, _c = obj.mitigation || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.mitigation.push(new MitigationComponent(o));
                }
            }
        }
        return _this;
    }
    return DetectedIssue;
}(DomainResource));

var UdiComponent = (function (_super) {
    __extends(UdiComponent, _super);
    function UdiComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.deviceIdentifier) {
                _this.deviceIdentifier = obj.deviceIdentifier;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = obj.jurisdiction;
            }
            if (obj.carrierHRF) {
                _this.carrierHRF = obj.carrierHRF;
            }
            if (obj.carrierAIDC) {
                _this.carrierAIDC = obj.carrierAIDC;
            }
            if (obj.issuer) {
                _this.issuer = obj.issuer;
            }
            if (obj.entryType) {
                _this.entryType = obj.entryType;
            }
        }
        return _this;
    }
    return UdiComponent;
}(BackboneElement));

var Device = (function (_super) {
    __extends(Device, _super);
    function Device(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Device';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.udi) {
                _this.udi = new UdiComponent(obj.udi);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.lotNumber) {
                _this.lotNumber = obj.lotNumber;
            }
            if (obj.manufacturer) {
                _this.manufacturer = obj.manufacturer;
            }
            if (obj.manufactureDate) {
                _this.manufactureDate = new Date(obj.manufactureDate);
            }
            if (obj.expirationDate) {
                _this.expirationDate = new Date(obj.expirationDate);
            }
            if (obj.model) {
                _this.model = obj.model;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.owner) {
                _this.owner = new ResourceReference(obj.owner);
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactPoint(o));
                }
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.note) {
                _this.note = [];
                for (var _d = 0, _e = obj.note || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.safety) {
                _this.safety = [];
                for (var _f = 0, _g = obj.safety || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.safety.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return Device;
}(DomainResource));

var ProductionSpecificationComponent = (function (_super) {
    __extends(ProductionSpecificationComponent, _super);
    function ProductionSpecificationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.specType) {
                _this.specType = new CodeableConcept(obj.specType);
            }
            if (obj.componentId) {
                _this.componentId = new Identifier(obj.componentId);
            }
            if (obj.productionSpec) {
                _this.productionSpec = obj.productionSpec;
            }
        }
        return _this;
    }
    return ProductionSpecificationComponent;
}(BackboneElement));

var DeviceComponent = (function (_super) {
    __extends(DeviceComponent, _super);
    function DeviceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DeviceComponent';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.lastSystemChange) {
                _this.lastSystemChange = new Date(obj.lastSystemChange);
            }
            if (obj.source) {
                _this.source = new ResourceReference(obj.source);
            }
            if (obj.parent) {
                _this.parent = new ResourceReference(obj.parent);
            }
            if (obj.operationalStatus) {
                _this.operationalStatus = [];
                for (var _i = 0, _a = obj.operationalStatus || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.operationalStatus.push(new CodeableConcept(o));
                }
            }
            if (obj.parameterGroup) {
                _this.parameterGroup = new CodeableConcept(obj.parameterGroup);
            }
            if (obj.measurementPrinciple) {
                _this.measurementPrinciple = obj.measurementPrinciple;
            }
            if (obj.productionSpecification) {
                _this.productionSpecification = [];
                for (var _b = 0, _c = obj.productionSpecification || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.productionSpecification.push(new ProductionSpecificationComponent(o));
                }
            }
            if (obj.languageCode) {
                _this.languageCode = new CodeableConcept(obj.languageCode);
            }
        }
        return _this;
    }
    return DeviceComponent;
}(DomainResource));

var CalibrationComponent = (function (_super) {
    __extends(CalibrationComponent, _super);
    function CalibrationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.state) {
                _this.state = obj.state;
            }
            if (obj.time) {
                _this.time = new Date(obj.time);
            }
        }
        return _this;
    }
    return CalibrationComponent;
}(BackboneElement));

var DeviceMetric = (function (_super) {
    __extends(DeviceMetric, _super);
    function DeviceMetric(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DeviceMetric';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.unit) {
                _this.unit = new CodeableConcept(obj.unit);
            }
            if (obj.source) {
                _this.source = new ResourceReference(obj.source);
            }
            if (obj.parent) {
                _this.parent = new ResourceReference(obj.parent);
            }
            if (obj.operationalStatus) {
                _this.operationalStatus = obj.operationalStatus;
            }
            if (obj.color) {
                _this.color = obj.color;
            }
            if (obj.category) {
                _this.category = obj.category;
            }
            if (obj.measurementPeriod) {
                _this.measurementPeriod = new Timing(obj.measurementPeriod);
            }
            if (obj.calibration) {
                _this.calibration = [];
                for (var _i = 0, _a = obj.calibration || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.calibration.push(new CalibrationComponent(o));
                }
            }
        }
        return _this;
    }
    return DeviceMetric;
}(DomainResource));

var DeviceRequest = (function (_super) {
    __extends(DeviceRequest, _super);
    function DeviceRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DeviceRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.priorRequest) {
                _this.priorRequest = [];
                for (var _f = 0, _g = obj.priorRequest || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.priorRequest.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = new CodeableConcept(obj.intent);
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.code) {
                _this.code = new Element(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.performerType) {
                _this.performerType = new CodeableConcept(obj.performerType);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _h = 0, _j = obj.reasonCode || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _k = 0, _l = obj.reasonReference || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.supportingInfo) {
                _this.supportingInfo = [];
                for (var _m = 0, _o = obj.supportingInfo || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.supportingInfo.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _p = 0, _q = obj.note || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.relevantHistory) {
                _this.relevantHistory = [];
                for (var _r = 0, _s = obj.relevantHistory || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.relevantHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return DeviceRequest;
}(DomainResource));

var DeviceUseStatement = (function (_super) {
    __extends(DeviceUseStatement, _super);
    function DeviceUseStatement(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DeviceUseStatement';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.whenUsed) {
                _this.whenUsed = new Period(obj.whenUsed);
            }
            if (obj.timing) {
                _this.timing = new Element(obj.timing);
            }
            if (obj.recordedOn) {
                _this.recordedOn = new Date(obj.recordedOn);
            }
            if (obj.source) {
                _this.source = new ResourceReference(obj.source);
            }
            if (obj.device) {
                _this.device = new ResourceReference(obj.device);
            }
            if (obj.indication) {
                _this.indication = [];
                for (var _b = 0, _c = obj.indication || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.indication.push(new CodeableConcept(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = new CodeableConcept(obj.bodySite);
            }
            if (obj.note) {
                _this.note = [];
                for (var _d = 0, _e = obj.note || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return DeviceUseStatement;
}(DomainResource));

var PerformerComponent = (function (_super) {
    __extends(PerformerComponent, _super);
    function PerformerComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
            if (obj.actor) {
                _this.actor = new ResourceReference(obj.actor);
            }
        }
        return _this;
    }
    return PerformerComponent;
}(BackboneElement));

var ImageComponent = (function (_super) {
    __extends(ImageComponent, _super);
    function ImageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.link) {
                _this.link = new ResourceReference(obj.link);
            }
        }
        return _this;
    }
    return ImageComponent;
}(BackboneElement));

var DiagnosticReport = (function (_super) {
    __extends(DiagnosticReport, _super);
    function DiagnosticReport(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DiagnosticReport';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.effective) {
                _this.effective = new Element(obj.effective);
            }
            if (obj.issued) {
                _this.issued = new Date(obj.issued);
            }
            if (obj.performer) {
                _this.performer = [];
                for (var _d = 0, _e = obj.performer || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.performer.push(new PerformerComponent(o));
                }
            }
            if (obj.specimen) {
                _this.specimen = [];
                for (var _f = 0, _g = obj.specimen || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.specimen.push(new ResourceReference(o));
                }
            }
            if (obj.result) {
                _this.result = [];
                for (var _h = 0, _j = obj.result || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.result.push(new ResourceReference(o));
                }
            }
            if (obj.imagingStudy) {
                _this.imagingStudy = [];
                for (var _k = 0, _l = obj.imagingStudy || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.imagingStudy.push(new ResourceReference(o));
                }
            }
            if (obj.image) {
                _this.image = [];
                for (var _m = 0, _o = obj.image || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.image.push(new ImageComponent(o));
                }
            }
            if (obj.conclusion) {
                _this.conclusion = obj.conclusion;
            }
            if (obj.codedDiagnosis) {
                _this.codedDiagnosis = [];
                for (var _p = 0, _q = obj.codedDiagnosis || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.codedDiagnosis.push(new CodeableConcept(o));
                }
            }
            if (obj.presentedForm) {
                _this.presentedForm = [];
                for (var _r = 0, _s = obj.presentedForm || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.presentedForm.push(new Attachment(o));
                }
            }
        }
        return _this;
    }
    return DiagnosticReport;
}(DomainResource));

var Distance = (function (_super) {
    __extends(Distance, _super);
    function Distance(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return Distance;
}(Quantity));

var ContentComponent = (function (_super) {
    __extends(ContentComponent, _super);
    function ContentComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.p) {
                _this.p = new Element(obj.p);
            }
        }
        return _this;
    }
    return ContentComponent;
}(BackboneElement));

var DocumentManifest = (function (_super) {
    __extends(DocumentManifest, _super);
    function DocumentManifest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DocumentManifest';
        if (obj) {
            if (obj.masterIdentifier) {
                _this.masterIdentifier = new Identifier(obj.masterIdentifier);
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.author) {
                _this.author = [];
                for (var _b = 0, _c = obj.author || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.author.push(new ResourceReference(o));
                }
            }
            if (obj.recipient) {
                _this.recipient = [];
                for (var _d = 0, _e = obj.recipient || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.recipient.push(new ResourceReference(o));
                }
            }
            if (obj.source) {
                _this.source = obj.source;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.content) {
                _this.content = [];
                for (var _f = 0, _g = obj.content || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.content.push(new ContentComponent(o));
                }
            }
            if (obj.related) {
                _this.related = [];
                for (var _h = 0, _j = obj.related || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.related.push(new RelatedComponent(o));
                }
            }
        }
        return _this;
    }
    return DocumentManifest;
}(DomainResource));

var ContextComponent = (function (_super) {
    __extends(ContextComponent, _super);
    function ContextComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.event) {
                _this.event = [];
                for (var _i = 0, _a = obj.event || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.event.push(new CodeableConcept(o));
                }
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.facilityType) {
                _this.facilityType = new CodeableConcept(obj.facilityType);
            }
            if (obj.practiceSetting) {
                _this.practiceSetting = new CodeableConcept(obj.practiceSetting);
            }
            if (obj.sourcePatientInfo) {
                _this.sourcePatientInfo = new ResourceReference(obj.sourcePatientInfo);
            }
            if (obj.related) {
                _this.related = [];
                for (var _b = 0, _c = obj.related || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.related.push(new RelatedComponent(o));
                }
            }
        }
        return _this;
    }
    return ContextComponent;
}(BackboneElement));

var DocumentReference = (function (_super) {
    __extends(DocumentReference, _super);
    function DocumentReference(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'DocumentReference';
        if (obj) {
            if (obj.masterIdentifier) {
                _this.masterIdentifier = new Identifier(obj.masterIdentifier);
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.docStatus) {
                _this.docStatus = obj.docStatus;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.class) {
                _this.class = new CodeableConcept(obj.class);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.indexed) {
                _this.indexed = new Date(obj.indexed);
            }
            if (obj.author) {
                _this.author = [];
                for (var _b = 0, _c = obj.author || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.author.push(new ResourceReference(o));
                }
            }
            if (obj.authenticator) {
                _this.authenticator = new ResourceReference(obj.authenticator);
            }
            if (obj.custodian) {
                _this.custodian = new ResourceReference(obj.custodian);
            }
            if (obj.relatesTo) {
                _this.relatesTo = [];
                for (var _d = 0, _e = obj.relatesTo || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.relatesTo.push(new RelatesToComponent(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.securityLabel) {
                _this.securityLabel = [];
                for (var _f = 0, _g = obj.securityLabel || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.securityLabel.push(new CodeableConcept(o));
                }
            }
            if (obj.content) {
                _this.content = [];
                for (var _h = 0, _j = obj.content || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.content.push(new ContentComponent(o));
                }
            }
            if (obj.context) {
                _this.context = new ContextComponent(obj.context);
            }
        }
        return _this;
    }
    return DocumentReference;
}(DomainResource));

var Duration = (function (_super) {
    __extends(Duration, _super);
    function Duration(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
        }
        return _this;
    }
    return Duration;
}(Quantity));

var EligibilityRequest = (function (_super) {
    __extends(EligibilityRequest, _super);
    function EligibilityRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'EligibilityRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.priority) {
                _this.priority = new CodeableConcept(obj.priority);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.serviced) {
                _this.serviced = new Element(obj.serviced);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.enterer) {
                _this.enterer = new ResourceReference(obj.enterer);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.facility) {
                _this.facility = new ResourceReference(obj.facility);
            }
            if (obj.coverage) {
                _this.coverage = new ResourceReference(obj.coverage);
            }
            if (obj.businessArrangement) {
                _this.businessArrangement = obj.businessArrangement;
            }
            if (obj.benefitCategory) {
                _this.benefitCategory = new CodeableConcept(obj.benefitCategory);
            }
            if (obj.benefitSubCategory) {
                _this.benefitSubCategory = new CodeableConcept(obj.benefitSubCategory);
            }
        }
        return _this;
    }
    return EligibilityRequest;
}(DomainResource));

var ErrorsComponent = (function (_super) {
    __extends(ErrorsComponent, _super);
    function ErrorsComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
        }
        return _this;
    }
    return ErrorsComponent;
}(BackboneElement));

var EligibilityResponse = (function (_super) {
    __extends(EligibilityResponse, _super);
    function EligibilityResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'EligibilityResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.requestProvider) {
                _this.requestProvider = new ResourceReference(obj.requestProvider);
            }
            if (obj.requestOrganization) {
                _this.requestOrganization = new ResourceReference(obj.requestOrganization);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.inforce) {
                _this.inforce = obj.inforce;
            }
            if (obj.insurance) {
                _this.insurance = [];
                for (var _b = 0, _c = obj.insurance || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.insurance.push(new InsuranceComponent(o));
                }
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.error) {
                _this.error = [];
                for (var _d = 0, _e = obj.error || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.error.push(new ErrorsComponent(o));
                }
            }
        }
        return _this;
    }
    return EligibilityResponse;
}(DomainResource));

var StatusHistoryComponent = (function (_super) {
    __extends(StatusHistoryComponent, _super);
    function StatusHistoryComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return StatusHistoryComponent;
}(BackboneElement));

var ClassHistoryComponent = (function (_super) {
    __extends(ClassHistoryComponent, _super);
    function ClassHistoryComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.class) {
                _this.class = new Coding(obj.class);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return ClassHistoryComponent;
}(BackboneElement));

var HospitalizationComponent = (function (_super) {
    __extends(HospitalizationComponent, _super);
    function HospitalizationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.preAdmissionIdentifier) {
                _this.preAdmissionIdentifier = new Identifier(obj.preAdmissionIdentifier);
            }
            if (obj.origin) {
                _this.origin = new ResourceReference(obj.origin);
            }
            if (obj.admitSource) {
                _this.admitSource = new CodeableConcept(obj.admitSource);
            }
            if (obj.reAdmission) {
                _this.reAdmission = new CodeableConcept(obj.reAdmission);
            }
            if (obj.dietPreference) {
                _this.dietPreference = [];
                for (var _i = 0, _a = obj.dietPreference || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.dietPreference.push(new CodeableConcept(o));
                }
            }
            if (obj.specialCourtesy) {
                _this.specialCourtesy = [];
                for (var _b = 0, _c = obj.specialCourtesy || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.specialCourtesy.push(new CodeableConcept(o));
                }
            }
            if (obj.specialArrangement) {
                _this.specialArrangement = [];
                for (var _d = 0, _e = obj.specialArrangement || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialArrangement.push(new CodeableConcept(o));
                }
            }
            if (obj.destination) {
                _this.destination = new ResourceReference(obj.destination);
            }
            if (obj.dischargeDisposition) {
                _this.dischargeDisposition = new CodeableConcept(obj.dischargeDisposition);
            }
        }
        return _this;
    }
    return HospitalizationComponent;
}(BackboneElement));

var LocationComponent = (function (_super) {
    __extends(LocationComponent, _super);
    function LocationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return LocationComponent;
}(BackboneElement));

var Encounter = (function (_super) {
    __extends(Encounter, _super);
    function Encounter(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Encounter';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.statusHistory) {
                _this.statusHistory = [];
                for (var _b = 0, _c = obj.statusHistory || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.statusHistory.push(new StatusHistoryComponent(o));
                }
            }
            if (obj.class) {
                _this.class = new Coding(obj.class);
            }
            if (obj.classHistory) {
                _this.classHistory = [];
                for (var _d = 0, _e = obj.classHistory || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.classHistory.push(new ClassHistoryComponent(o));
                }
            }
            if (obj.type) {
                _this.type = [];
                for (var _f = 0, _g = obj.type || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.priority) {
                _this.priority = new CodeableConcept(obj.priority);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.episodeOfCare) {
                _this.episodeOfCare = [];
                for (var _h = 0, _j = obj.episodeOfCare || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.episodeOfCare.push(new ResourceReference(o));
                }
            }
            if (obj.incomingReferral) {
                _this.incomingReferral = [];
                for (var _k = 0, _l = obj.incomingReferral || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.incomingReferral.push(new ResourceReference(o));
                }
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _m = 0, _o = obj.participant || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.appointment) {
                _this.appointment = new ResourceReference(obj.appointment);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.length) {
                _this.length = new Duration(obj.length);
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _p = 0, _q = obj.reason || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.diagnosis) {
                _this.diagnosis = [];
                for (var _r = 0, _s = obj.diagnosis || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.diagnosis.push(new DiagnosisComponent(o));
                }
            }
            if (obj.account) {
                _this.account = [];
                for (var _t = 0, _u = obj.account || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.account.push(new ResourceReference(o));
                }
            }
            if (obj.hospitalization) {
                _this.hospitalization = new HospitalizationComponent(obj.hospitalization);
            }
            if (obj.location) {
                _this.location = [];
                for (var _v = 0, _w = obj.location || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.location.push(new LocationComponent(o));
                }
            }
            if (obj.serviceProvider) {
                _this.serviceProvider = new ResourceReference(obj.serviceProvider);
            }
            if (obj.partOf) {
                _this.partOf = new ResourceReference(obj.partOf);
            }
        }
        return _this;
    }
    return Encounter;
}(DomainResource));

var Endpoint = (function (_super) {
    __extends(Endpoint, _super);
    function Endpoint(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Endpoint';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.connectionType) {
                _this.connectionType = new Coding(obj.connectionType);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = new ResourceReference(obj.managingOrganization);
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactPoint(o));
                }
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.payloadType) {
                _this.payloadType = [];
                for (var _d = 0, _e = obj.payloadType || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.payloadType.push(new CodeableConcept(o));
                }
            }
            if (obj.payloadMimeType) {
                _this.payloadMimeType = obj.payloadMimeType;
            }
            if (obj.address) {
                _this.address = obj.address;
            }
            if (obj.header) {
                _this.header = obj.header;
            }
        }
        return _this;
    }
    return Endpoint;
}(DomainResource));

var EnrollmentRequest = (function (_super) {
    __extends(EnrollmentRequest, _super);
    function EnrollmentRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'EnrollmentRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.coverage) {
                _this.coverage = new ResourceReference(obj.coverage);
            }
        }
        return _this;
    }
    return EnrollmentRequest;
}(DomainResource));

var EnrollmentResponse = (function (_super) {
    __extends(EnrollmentResponse, _super);
    function EnrollmentResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'EnrollmentResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.requestProvider) {
                _this.requestProvider = new ResourceReference(obj.requestProvider);
            }
            if (obj.requestOrganization) {
                _this.requestOrganization = new ResourceReference(obj.requestOrganization);
            }
        }
        return _this;
    }
    return EnrollmentResponse;
}(DomainResource));

var EpisodeOfCare = (function (_super) {
    __extends(EpisodeOfCare, _super);
    function EpisodeOfCare(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'EpisodeOfCare';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.statusHistory) {
                _this.statusHistory = [];
                for (var _b = 0, _c = obj.statusHistory || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.statusHistory.push(new StatusHistoryComponent(o));
                }
            }
            if (obj.type) {
                _this.type = [];
                for (var _d = 0, _e = obj.type || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.diagnosis) {
                _this.diagnosis = [];
                for (var _f = 0, _g = obj.diagnosis || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.diagnosis.push(new DiagnosisComponent(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = new ResourceReference(obj.managingOrganization);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.referralRequest) {
                _this.referralRequest = [];
                for (var _h = 0, _j = obj.referralRequest || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.referralRequest.push(new ResourceReference(o));
                }
            }
            if (obj.careManager) {
                _this.careManager = new ResourceReference(obj.careManager);
            }
            if (obj.team) {
                _this.team = [];
                for (var _k = 0, _l = obj.team || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.team.push(new ResourceReference(o));
                }
            }
            if (obj.account) {
                _this.account = [];
                for (var _m = 0, _o = obj.account || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.account.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return EpisodeOfCare;
}(DomainResource));

var FixedVersionComponent = (function (_super) {
    __extends(FixedVersionComponent, _super);
    function FixedVersionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
        }
        return _this;
    }
    return FixedVersionComponent;
}(BackboneElement));

var ExcludedSystemComponent = (function (_super) {
    __extends(ExcludedSystemComponent, _super);
    function ExcludedSystemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
        }
        return _this;
    }
    return ExcludedSystemComponent;
}(BackboneElement));

var ExpansionProfile = (function (_super) {
    __extends(ExpansionProfile, _super);
    function ExpansionProfile(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ExpansionProfile';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.fixedVersion) {
                _this.fixedVersion = [];
                for (var _f = 0, _g = obj.fixedVersion || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.fixedVersion.push(new FixedVersionComponent(o));
                }
            }
            if (obj.excludedSystem) {
                _this.excludedSystem = new ExcludedSystemComponent(obj.excludedSystem);
            }
            if (obj.includeDesignations) {
                _this.includeDesignations = obj.includeDesignations;
            }
            if (obj.designation) {
                _this.designation = new DesignationComponent(obj.designation);
            }
            if (obj.includeDefinition) {
                _this.includeDefinition = obj.includeDefinition;
            }
            if (obj.activeOnly) {
                _this.activeOnly = obj.activeOnly;
            }
            if (obj.excludeNested) {
                _this.excludeNested = obj.excludeNested;
            }
            if (obj.excludeNotForUI) {
                _this.excludeNotForUI = obj.excludeNotForUI;
            }
            if (obj.excludePostCoordinated) {
                _this.excludePostCoordinated = obj.excludePostCoordinated;
            }
            if (obj.displayLanguage) {
                _this.displayLanguage = obj.displayLanguage;
            }
            if (obj.limitedExpansion) {
                _this.limitedExpansion = obj.limitedExpansion;
            }
        }
        return _this;
    }
    return ExpansionProfile;
}(DomainResource));

var SupportingInformationComponent = (function (_super) {
    __extends(SupportingInformationComponent, _super);
    function SupportingInformationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequence) {
                _this.sequence = obj.sequence;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.timing) {
                _this.timing = new Element(obj.timing);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.reason) {
                _this.reason = new Coding(obj.reason);
            }
        }
        return _this;
    }
    return SupportingInformationComponent;
}(BackboneElement));

var BenefitComponent = (function (_super) {
    __extends(BenefitComponent, _super);
    function BenefitComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.allowed) {
                _this.allowed = new Element(obj.allowed);
            }
            if (obj.used) {
                _this.used = new Element(obj.used);
            }
        }
        return _this;
    }
    return BenefitComponent;
}(BackboneElement));

var BenefitBalanceComponent = (function (_super) {
    __extends(BenefitBalanceComponent, _super);
    function BenefitBalanceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.subCategory) {
                _this.subCategory = new CodeableConcept(obj.subCategory);
            }
            if (obj.excluded) {
                _this.excluded = obj.excluded;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.network) {
                _this.network = new CodeableConcept(obj.network);
            }
            if (obj.unit) {
                _this.unit = new CodeableConcept(obj.unit);
            }
            if (obj.term) {
                _this.term = new CodeableConcept(obj.term);
            }
            if (obj.financial) {
                _this.financial = [];
                for (var _i = 0, _a = obj.financial || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.financial.push(new BenefitComponent(o));
                }
            }
        }
        return _this;
    }
    return BenefitBalanceComponent;
}(BackboneElement));

var ExplanationOfBenefit = (function (_super) {
    __extends(ExplanationOfBenefit, _super);
    function ExplanationOfBenefit(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ExplanationOfBenefit';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subType) {
                _this.subType = [];
                for (var _b = 0, _c = obj.subType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.subType.push(new CodeableConcept(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.billablePeriod) {
                _this.billablePeriod = new Period(obj.billablePeriod);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.enterer) {
                _this.enterer = new ResourceReference(obj.enterer);
            }
            if (obj.insurer) {
                _this.insurer = new ResourceReference(obj.insurer);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.referral) {
                _this.referral = new ResourceReference(obj.referral);
            }
            if (obj.facility) {
                _this.facility = new ResourceReference(obj.facility);
            }
            if (obj.claim) {
                _this.claim = new ResourceReference(obj.claim);
            }
            if (obj.claimResponse) {
                _this.claimResponse = new ResourceReference(obj.claimResponse);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.related) {
                _this.related = [];
                for (var _d = 0, _e = obj.related || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.related.push(new RelatedClaimComponent(o));
                }
            }
            if (obj.prescription) {
                _this.prescription = new ResourceReference(obj.prescription);
            }
            if (obj.originalPrescription) {
                _this.originalPrescription = new ResourceReference(obj.originalPrescription);
            }
            if (obj.payee) {
                _this.payee = new PayeeComponent(obj.payee);
            }
            if (obj.information) {
                _this.information = [];
                for (var _f = 0, _g = obj.information || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.information.push(new SupportingInformationComponent(o));
                }
            }
            if (obj.careTeam) {
                _this.careTeam = [];
                for (var _h = 0, _j = obj.careTeam || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.careTeam.push(new CareTeamComponent(o));
                }
            }
            if (obj.diagnosis) {
                _this.diagnosis = [];
                for (var _k = 0, _l = obj.diagnosis || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.diagnosis.push(new DiagnosisComponent(o));
                }
            }
            if (obj.procedure) {
                _this.procedure = [];
                for (var _m = 0, _o = obj.procedure || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.procedure.push(new ProcedureComponent(o));
                }
            }
            if (obj.precedence) {
                _this.precedence = obj.precedence;
            }
            if (obj.insurance) {
                _this.insurance = new InsuranceComponent(obj.insurance);
            }
            if (obj.accident) {
                _this.accident = new AccidentComponent(obj.accident);
            }
            if (obj.employmentImpacted) {
                _this.employmentImpacted = new Period(obj.employmentImpacted);
            }
            if (obj.hospitalization) {
                _this.hospitalization = new Period(obj.hospitalization);
            }
            if (obj.item) {
                _this.item = [];
                for (var _p = 0, _q = obj.item || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.item.push(new ItemComponent(o));
                }
            }
            if (obj.addItem) {
                _this.addItem = [];
                for (var _r = 0, _s = obj.addItem || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.addItem.push(new AddedItemComponent(o));
                }
            }
            if (obj.totalCost) {
                _this.totalCost = new Money(obj.totalCost);
            }
            if (obj.unallocDeductable) {
                _this.unallocDeductable = new Money(obj.unallocDeductable);
            }
            if (obj.totalBenefit) {
                _this.totalBenefit = new Money(obj.totalBenefit);
            }
            if (obj.payment) {
                _this.payment = new PaymentComponent(obj.payment);
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.processNote) {
                _this.processNote = [];
                for (var _t = 0, _u = obj.processNote || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.processNote.push(new NoteComponent(o));
                }
            }
            if (obj.benefitBalance) {
                _this.benefitBalance = [];
                for (var _v = 0, _w = obj.benefitBalance || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.benefitBalance.push(new BenefitBalanceComponent(o));
                }
            }
        }
        return _this;
    }
    return ExplanationOfBenefit;
}(DomainResource));

var ConditionComponent = (function (_super) {
    __extends(ConditionComponent, _super);
    function ConditionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.onset) {
                _this.onset = new Element(obj.onset);
            }
            if (obj.note) {
                _this.note = [];
                for (var _i = 0, _a = obj.note || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return ConditionComponent;
}(BackboneElement));

var FamilyMemberHistory = (function (_super) {
    __extends(FamilyMemberHistory, _super);
    function FamilyMemberHistory(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'FamilyMemberHistory';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.notDone) {
                _this.notDone = obj.notDone;
            }
            if (obj.notDoneReason) {
                _this.notDoneReason = new CodeableConcept(obj.notDoneReason);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.relationship) {
                _this.relationship = new CodeableConcept(obj.relationship);
            }
            if (obj.gender) {
                _this.gender = obj.gender;
            }
            if (obj.born) {
                _this.born = new Element(obj.born);
            }
            if (obj.age) {
                _this.age = new Element(obj.age);
            }
            if (obj.estimatedAge) {
                _this.estimatedAge = obj.estimatedAge;
            }
            if (obj.deceased) {
                _this.deceased = new Element(obj.deceased);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _d = 0, _e = obj.reasonCode || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _f = 0, _g = obj.reasonReference || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _h = 0, _j = obj.note || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.condition) {
                _this.condition = [];
                for (var _k = 0, _l = obj.condition || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.condition.push(new ConditionComponent(o));
                }
            }
        }
        return _this;
    }
    return FamilyMemberHistory;
}(DomainResource));

var TargetComponent = (function (_super) {
    __extends(TargetComponent, _super);
    function TargetComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.measure) {
                _this.measure = new CodeableConcept(obj.measure);
            }
            if (obj.detail) {
                _this.detail = new Element(obj.detail);
            }
            if (obj.due) {
                _this.due = new Element(obj.due);
            }
        }
        return _this;
    }
    return TargetComponent;
}(BackboneElement));

var Goal = (function (_super) {
    __extends(Goal, _super);
    function Goal(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Goal';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _b = 0, _c = obj.category || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.priority) {
                _this.priority = new CodeableConcept(obj.priority);
            }
            if (obj.description) {
                _this.description = new CodeableConcept(obj.description);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.start) {
                _this.start = new Element(obj.start);
            }
            if (obj.target) {
                _this.target = new TargetComponent(obj.target);
            }
            if (obj.statusDate) {
                _this.statusDate = new Date(obj.statusDate);
            }
            if (obj.statusReason) {
                _this.statusReason = obj.statusReason;
            }
            if (obj.expressedBy) {
                _this.expressedBy = new ResourceReference(obj.expressedBy);
            }
            if (obj.addresses) {
                _this.addresses = [];
                for (var _d = 0, _e = obj.addresses || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.addresses.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _f = 0, _g = obj.note || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.outcomeCode) {
                _this.outcomeCode = [];
                for (var _h = 0, _j = obj.outcomeCode || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.outcomeCode.push(new CodeableConcept(o));
                }
            }
            if (obj.outcomeReference) {
                _this.outcomeReference = [];
                for (var _k = 0, _l = obj.outcomeReference || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.outcomeReference.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return Goal;
}(DomainResource));

var GraphDefinition = (function (_super) {
    __extends(GraphDefinition, _super);
    function GraphDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'GraphDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.start) {
                _this.start = obj.start;
            }
            if (obj.profile) {
                _this.profile = obj.profile;
            }
            if (obj.link) {
                _this.link = [];
                for (var _f = 0, _g = obj.link || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.link.push(new LinkComponent(o));
                }
            }
        }
        return _this;
    }
    return GraphDefinition;
}(DomainResource));

var CharacteristicComponent = (function (_super) {
    __extends(CharacteristicComponent, _super);
    function CharacteristicComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
            if (obj.exclude) {
                _this.exclude = obj.exclude;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return CharacteristicComponent;
}(BackboneElement));

var MemberComponent = (function (_super) {
    __extends(MemberComponent, _super);
    function MemberComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.entity) {
                _this.entity = new ResourceReference(obj.entity);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.inactive) {
                _this.inactive = obj.inactive;
            }
        }
        return _this;
    }
    return MemberComponent;
}(BackboneElement));

var Group = (function (_super) {
    __extends(Group, _super);
    function Group(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Group';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.actual) {
                _this.actual = obj.actual;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.quantity) {
                _this.quantity = obj.quantity;
            }
            if (obj.characteristic) {
                _this.characteristic = [];
                for (var _b = 0, _c = obj.characteristic || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.characteristic.push(new CharacteristicComponent(o));
                }
            }
            if (obj.member) {
                _this.member = [];
                for (var _d = 0, _e = obj.member || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.member.push(new MemberComponent(o));
                }
            }
        }
        return _this;
    }
    return Group;
}(DomainResource));

var GuidanceResponse = (function (_super) {
    __extends(GuidanceResponse, _super);
    function GuidanceResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'GuidanceResponse';
        if (obj) {
            if (obj.requestId) {
                _this.requestId = obj.requestId;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.module) {
                _this.module = new ResourceReference(obj.module);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrenceDateTime) {
                _this.occurrenceDateTime = new Date(obj.occurrenceDateTime);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
            if (obj.reason) {
                _this.reason = new Element(obj.reason);
            }
            if (obj.note) {
                _this.note = [];
                for (var _i = 0, _a = obj.note || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.evaluationMessage) {
                _this.evaluationMessage = [];
                for (var _b = 0, _c = obj.evaluationMessage || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.evaluationMessage.push(new ResourceReference(o));
                }
            }
            if (obj.outputParameters) {
                _this.outputParameters = new ResourceReference(obj.outputParameters);
            }
            if (obj.result) {
                _this.result = new ResourceReference(obj.result);
            }
            if (obj.dataRequirement) {
                _this.dataRequirement = [];
                for (var _d = 0, _e = obj.dataRequirement || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.dataRequirement.push(new DataRequirement(o));
                }
            }
        }
        return _this;
    }
    return GuidanceResponse;
}(DomainResource));

var AvailableTimeComponent = (function (_super) {
    __extends(AvailableTimeComponent, _super);
    function AvailableTimeComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.daysOfWeek) {
                _this.daysOfWeek = obj.daysOfWeek;
            }
            if (obj.allDay) {
                _this.allDay = obj.allDay;
            }
            if (obj.availableStartTime) {
                _this.availableStartTime = new Date(obj.availableStartTime);
            }
            if (obj.availableEndTime) {
                _this.availableEndTime = new Date(obj.availableEndTime);
            }
        }
        return _this;
    }
    return AvailableTimeComponent;
}(BackboneElement));

var NotAvailableComponent = (function (_super) {
    __extends(NotAvailableComponent, _super);
    function NotAvailableComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.during) {
                _this.during = new Period(obj.during);
            }
        }
        return _this;
    }
    return NotAvailableComponent;
}(BackboneElement));

var HealthcareService = (function (_super) {
    __extends(HealthcareService, _super);
    function HealthcareService(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'HealthcareService';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.providedBy) {
                _this.providedBy = new ResourceReference(obj.providedBy);
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.type) {
                _this.type = [];
                for (var _b = 0, _c = obj.type || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.specialty) {
                _this.specialty = [];
                for (var _d = 0, _e = obj.specialty || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialty.push(new CodeableConcept(o));
                }
            }
            if (obj.location) {
                _this.location = [];
                for (var _f = 0, _g = obj.location || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.location.push(new ResourceReference(o));
                }
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.extraDetails) {
                _this.extraDetails = obj.extraDetails;
            }
            if (obj.photo) {
                _this.photo = new Attachment(obj.photo);
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _h = 0, _j = obj.telecom || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.coverageArea) {
                _this.coverageArea = [];
                for (var _k = 0, _l = obj.coverageArea || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.coverageArea.push(new ResourceReference(o));
                }
            }
            if (obj.serviceProvisionCode) {
                _this.serviceProvisionCode = [];
                for (var _m = 0, _o = obj.serviceProvisionCode || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.serviceProvisionCode.push(new CodeableConcept(o));
                }
            }
            if (obj.eligibility) {
                _this.eligibility = new CodeableConcept(obj.eligibility);
            }
            if (obj.eligibilityNote) {
                _this.eligibilityNote = obj.eligibilityNote;
            }
            if (obj.programName) {
                _this.programName = obj.programName;
            }
            if (obj.characteristic) {
                _this.characteristic = [];
                for (var _p = 0, _q = obj.characteristic || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.characteristic.push(new CodeableConcept(o));
                }
            }
            if (obj.referralMethod) {
                _this.referralMethod = [];
                for (var _r = 0, _s = obj.referralMethod || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.referralMethod.push(new CodeableConcept(o));
                }
            }
            if (obj.appointmentRequired) {
                _this.appointmentRequired = obj.appointmentRequired;
            }
            if (obj.availableTime) {
                _this.availableTime = [];
                for (var _t = 0, _u = obj.availableTime || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.availableTime.push(new AvailableTimeComponent(o));
                }
            }
            if (obj.notAvailable) {
                _this.notAvailable = [];
                for (var _v = 0, _w = obj.notAvailable || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.notAvailable.push(new NotAvailableComponent(o));
                }
            }
            if (obj.availabilityExceptions) {
                _this.availabilityExceptions = obj.availabilityExceptions;
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _x = 0, _y = obj.endpoint || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return HealthcareService;
}(DomainResource));

var HumanName = (function (_super) {
    __extends(HumanName, _super);
    function HumanName(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.family) {
                _this.family = obj.family;
            }
            if (obj.given) {
                _this.given = obj.given;
            }
            if (obj.prefix) {
                _this.prefix = obj.prefix;
            }
            if (obj.suffix) {
                _this.suffix = obj.suffix;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    HumanName.prototype.getDisplay = function () {
        if (this.family && this.given && this.given.length > 0) {
            return this.family + ', ' + this.given[0];
        }
        else if (this.family) {
            return this.family;
        }
        else if (this.given && this.given.length > 0) {
            return this.given[0];
        }
    };
    return HumanName;
}(Element));

var InstanceComponent = (function (_super) {
    __extends(InstanceComponent, _super);
    function InstanceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sopClass) {
                _this.sopClass = obj.sopClass;
            }
            if (obj.uid) {
                _this.uid = obj.uid;
            }
        }
        return _this;
    }
    return InstanceComponent;
}(BackboneElement));

var SeriesComponent = (function (_super) {
    __extends(SeriesComponent, _super);
    function SeriesComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.uid) {
                _this.uid = obj.uid;
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _i = 0, _a = obj.endpoint || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
            if (obj.instance) {
                _this.instance = [];
                for (var _b = 0, _c = obj.instance || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.instance.push(new InstanceComponent(o));
                }
            }
        }
        return _this;
    }
    return SeriesComponent;
}(BackboneElement));

var StudyComponent = (function (_super) {
    __extends(StudyComponent, _super);
    function StudyComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.uid) {
                _this.uid = obj.uid;
            }
            if (obj.imagingStudy) {
                _this.imagingStudy = new ResourceReference(obj.imagingStudy);
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _i = 0, _a = obj.endpoint || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
            if (obj.series) {
                _this.series = [];
                for (var _b = 0, _c = obj.series || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.series.push(new SeriesComponent(o));
                }
            }
        }
        return _this;
    }
    return StudyComponent;
}(BackboneElement));

var ImagingManifest = (function (_super) {
    __extends(ImagingManifest, _super);
    function ImagingManifest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ImagingManifest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.authoringTime) {
                _this.authoringTime = new Date(obj.authoringTime);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.study) {
                _this.study = [];
                for (var _i = 0, _a = obj.study || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.study.push(new StudyComponent(o));
                }
            }
        }
        return _this;
    }
    return ImagingManifest;
}(DomainResource));

var ImagingStudy = (function (_super) {
    __extends(ImagingStudy, _super);
    function ImagingStudy(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ImagingStudy';
        if (obj) {
            if (obj.uid) {
                _this.uid = obj.uid;
            }
            if (obj.accession) {
                _this.accession = new Identifier(obj.accession);
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.availability) {
                _this.availability = obj.availability;
            }
            if (obj.modalityList) {
                _this.modalityList = [];
                for (var _b = 0, _c = obj.modalityList || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.modalityList.push(new Coding(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.started) {
                _this.started = new Date(obj.started);
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.referrer) {
                _this.referrer = new ResourceReference(obj.referrer);
            }
            if (obj.interpreter) {
                _this.interpreter = [];
                for (var _f = 0, _g = obj.interpreter || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.interpreter.push(new ResourceReference(o));
                }
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _h = 0, _j = obj.endpoint || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
            if (obj.numberOfSeries) {
                _this.numberOfSeries = obj.numberOfSeries;
            }
            if (obj.numberOfInstances) {
                _this.numberOfInstances = obj.numberOfInstances;
            }
            if (obj.procedureReference) {
                _this.procedureReference = [];
                for (var _k = 0, _l = obj.procedureReference || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.procedureReference.push(new ResourceReference(o));
                }
            }
            if (obj.procedureCode) {
                _this.procedureCode = [];
                for (var _m = 0, _o = obj.procedureCode || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.procedureCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reason) {
                _this.reason = new CodeableConcept(obj.reason);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.series) {
                _this.series = [];
                for (var _p = 0, _q = obj.series || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.series.push(new SeriesComponent(o));
                }
            }
        }
        return _this;
    }
    return ImagingStudy;
}(DomainResource));

var PractitionerComponent = (function (_super) {
    __extends(PractitionerComponent, _super);
    function PractitionerComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.role) {
                _this.role = new CodeableConcept(obj.role);
            }
            if (obj.actor) {
                _this.actor = new ResourceReference(obj.actor);
            }
        }
        return _this;
    }
    return PractitionerComponent;
}(BackboneElement));

var ExplanationComponent = (function (_super) {
    __extends(ExplanationComponent, _super);
    function ExplanationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.reason) {
                _this.reason = [];
                for (var _i = 0, _a = obj.reason || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonNotGiven) {
                _this.reasonNotGiven = [];
                for (var _b = 0, _c = obj.reasonNotGiven || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.reasonNotGiven.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return ExplanationComponent;
}(BackboneElement));

var VaccinationProtocolComponent = (function (_super) {
    __extends(VaccinationProtocolComponent, _super);
    function VaccinationProtocolComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.doseSequence) {
                _this.doseSequence = obj.doseSequence;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.authority) {
                _this.authority = new ResourceReference(obj.authority);
            }
            if (obj.series) {
                _this.series = obj.series;
            }
            if (obj.seriesDoses) {
                _this.seriesDoses = obj.seriesDoses;
            }
            if (obj.targetDisease) {
                _this.targetDisease = [];
                for (var _i = 0, _a = obj.targetDisease || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.targetDisease.push(new CodeableConcept(o));
                }
            }
            if (obj.doseStatus) {
                _this.doseStatus = new CodeableConcept(obj.doseStatus);
            }
            if (obj.doseStatusReason) {
                _this.doseStatusReason = new CodeableConcept(obj.doseStatusReason);
            }
        }
        return _this;
    }
    return VaccinationProtocolComponent;
}(BackboneElement));

var Immunization = (function (_super) {
    __extends(Immunization, _super);
    function Immunization(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Immunization';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.notGiven) {
                _this.notGiven = obj.notGiven;
            }
            if (obj.vaccineCode) {
                _this.vaccineCode = new CodeableConcept(obj.vaccineCode);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.primarySource) {
                _this.primarySource = obj.primarySource;
            }
            if (obj.reportOrigin) {
                _this.reportOrigin = new CodeableConcept(obj.reportOrigin);
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.manufacturer) {
                _this.manufacturer = new ResourceReference(obj.manufacturer);
            }
            if (obj.lotNumber) {
                _this.lotNumber = obj.lotNumber;
            }
            if (obj.expirationDate) {
                _this.expirationDate = new Date(obj.expirationDate);
            }
            if (obj.site) {
                _this.site = new CodeableConcept(obj.site);
            }
            if (obj.route) {
                _this.route = new CodeableConcept(obj.route);
            }
            if (obj.doseQuantity) {
                _this.doseQuantity = new SimpleQuantity(obj.doseQuantity);
            }
            if (obj.practitioner) {
                _this.practitioner = [];
                for (var _b = 0, _c = obj.practitioner || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.practitioner.push(new PractitionerComponent(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _d = 0, _e = obj.note || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.explanation) {
                _this.explanation = new ExplanationComponent(obj.explanation);
            }
            if (obj.reaction) {
                _this.reaction = [];
                for (var _f = 0, _g = obj.reaction || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.reaction.push(new ReactionComponent(o));
                }
            }
            if (obj.vaccinationProtocol) {
                _this.vaccinationProtocol = [];
                for (var _h = 0, _j = obj.vaccinationProtocol || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.vaccinationProtocol.push(new VaccinationProtocolComponent(o));
                }
            }
        }
        return _this;
    }
    return Immunization;
}(DomainResource));

var DateCriterionComponent = (function (_super) {
    __extends(DateCriterionComponent, _super);
    function DateCriterionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.value) {
                _this.value = new Date(obj.value);
            }
        }
        return _this;
    }
    return DateCriterionComponent;
}(BackboneElement));

var ProtocolComponent = (function (_super) {
    __extends(ProtocolComponent, _super);
    function ProtocolComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.doseSequence) {
                _this.doseSequence = obj.doseSequence;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.authority) {
                _this.authority = new ResourceReference(obj.authority);
            }
            if (obj.series) {
                _this.series = obj.series;
            }
        }
        return _this;
    }
    return ProtocolComponent;
}(BackboneElement));

var RecommendationComponent = (function (_super) {
    __extends(RecommendationComponent, _super);
    function RecommendationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.vaccineCode) {
                _this.vaccineCode = new CodeableConcept(obj.vaccineCode);
            }
            if (obj.targetDisease) {
                _this.targetDisease = new CodeableConcept(obj.targetDisease);
            }
            if (obj.doseNumber) {
                _this.doseNumber = obj.doseNumber;
            }
            if (obj.forecastStatus) {
                _this.forecastStatus = new CodeableConcept(obj.forecastStatus);
            }
            if (obj.dateCriterion) {
                _this.dateCriterion = [];
                for (var _i = 0, _a = obj.dateCriterion || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.dateCriterion.push(new DateCriterionComponent(o));
                }
            }
            if (obj.protocol) {
                _this.protocol = new ProtocolComponent(obj.protocol);
            }
            if (obj.supportingImmunization) {
                _this.supportingImmunization = [];
                for (var _b = 0, _c = obj.supportingImmunization || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.supportingImmunization.push(new ResourceReference(o));
                }
            }
            if (obj.supportingPatientInformation) {
                _this.supportingPatientInformation = [];
                for (var _d = 0, _e = obj.supportingPatientInformation || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.supportingPatientInformation.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return RecommendationComponent;
}(BackboneElement));

var ImmunizationRecommendation = (function (_super) {
    __extends(ImmunizationRecommendation, _super);
    function ImmunizationRecommendation(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ImmunizationRecommendation';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.recommendation) {
                _this.recommendation = [];
                for (var _b = 0, _c = obj.recommendation || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.recommendation.push(new RecommendationComponent(o));
                }
            }
        }
        return _this;
    }
    return ImmunizationRecommendation;
}(DomainResource));

var DependencyComponent = (function (_super) {
    __extends(DependencyComponent, _super);
    function DependencyComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.uri) {
                _this.uri = obj.uri;
            }
        }
        return _this;
    }
    return DependencyComponent;
}(BackboneElement));

var PackageComponent = (function (_super) {
    __extends(PackageComponent, _super);
    function PackageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.resource) {
                _this.resource = [];
                for (var _i = 0, _a = obj.resource || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.resource.push(new ResourceComponent(o));
                }
            }
        }
        return _this;
    }
    return PackageComponent;
}(BackboneElement));

var GlobalComponent = (function (_super) {
    __extends(GlobalComponent, _super);
    function GlobalComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.profile) {
                _this.profile = new ResourceReference(obj.profile);
            }
        }
        return _this;
    }
    return GlobalComponent;
}(BackboneElement));

var PageComponent = (function (_super) {
    __extends(PageComponent, _super);
    function PageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.source) {
                _this.source = obj.source;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.package) {
                _this.package = obj.package;
            }
            if (obj.format) {
                _this.format = obj.format;
            }
            if (obj.page) {
                _this.page = [];
                for (var _i = 0, _a = obj.page || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.page.push(new PageComponent(o));
                }
            }
        }
        return _this;
    }
    return PageComponent;
}(BackboneElement));

var ImplementationGuide = (function (_super) {
    __extends(ImplementationGuide, _super);
    function ImplementationGuide(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ImplementationGuide';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.fhirVersion) {
                _this.fhirVersion = obj.fhirVersion;
            }
            if (obj.dependency) {
                _this.dependency = [];
                for (var _f = 0, _g = obj.dependency || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.dependency.push(new DependencyComponent(o));
                }
            }
            if (obj.package) {
                _this.package = [];
                for (var _h = 0, _j = obj.package || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.package.push(new PackageComponent(o));
                }
            }
            if (obj.global) {
                _this.global = [];
                for (var _k = 0, _l = obj.global || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.global.push(new GlobalComponent(o));
                }
            }
            if (obj.binary) {
                _this.binary = obj.binary;
            }
            if (obj.page) {
                _this.page = new PageComponent(obj.page);
            }
        }
        return _this;
    }
    return ImplementationGuide;
}(DomainResource));

var ParameterDefinition = (function (_super) {
    __extends(ParameterDefinition, _super);
    function ParameterDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.use) {
                _this.use = obj.use;
            }
            if (obj.min) {
                _this.min = obj.min;
            }
            if (obj.max) {
                _this.max = obj.max;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.profile) {
                _this.profile = new ResourceReference(obj.profile);
            }
        }
        return _this;
    }
    return ParameterDefinition;
}(Element));

var Library = (function (_super) {
    __extends(Library, _super);
    function Library(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Library';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _f = 0, _g = obj.topic || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.topic.push(new CodeableConcept(o));
                }
            }
            if (obj.contributor) {
                _this.contributor = [];
                for (var _h = 0, _j = obj.contributor || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contributor.push(new Contributor(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.parameter) {
                _this.parameter = [];
                for (var _p = 0, _q = obj.parameter || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.parameter.push(new ParameterDefinition(o));
                }
            }
            if (obj.dataRequirement) {
                _this.dataRequirement = [];
                for (var _r = 0, _s = obj.dataRequirement || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.dataRequirement.push(new DataRequirement(o));
                }
            }
            if (obj.content) {
                _this.content = [];
                for (var _t = 0, _u = obj.content || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.content.push(new Attachment(o));
                }
            }
        }
        return _this;
    }
    return Library;
}(DomainResource));

var Linkage = (function (_super) {
    __extends(Linkage, _super);
    function Linkage(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Linkage';
        if (obj) {
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.item) {
                _this.item = [];
                for (var _i = 0, _a = obj.item || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.item.push(new ItemComponent(o));
                }
            }
        }
        return _this;
    }
    return Linkage;
}(DomainResource));

var List = (function (_super) {
    __extends(List, _super);
    function List(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'List';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.source) {
                _this.source = new ResourceReference(obj.source);
            }
            if (obj.orderedBy) {
                _this.orderedBy = new CodeableConcept(obj.orderedBy);
            }
            if (obj.note) {
                _this.note = [];
                for (var _b = 0, _c = obj.note || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.entry) {
                _this.entry = [];
                for (var _d = 0, _e = obj.entry || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.entry.push(new EntryComponent(o));
                }
            }
            if (obj.emptyReason) {
                _this.emptyReason = new CodeableConcept(obj.emptyReason);
            }
        }
        return _this;
    }
    return List;
}(DomainResource));

var PositionComponent = (function (_super) {
    __extends(PositionComponent, _super);
    function PositionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.longitude) {
                _this.longitude = obj.longitude;
            }
            if (obj.latitude) {
                _this.latitude = obj.latitude;
            }
            if (obj.altitude) {
                _this.altitude = obj.altitude;
            }
        }
        return _this;
    }
    return PositionComponent;
}(BackboneElement));

var Location = (function (_super) {
    __extends(Location, _super);
    function Location(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Location';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.operationalStatus) {
                _this.operationalStatus = new Coding(obj.operationalStatus);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.alias) {
                _this.alias = obj.alias;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _b = 0, _c = obj.telecom || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.address) {
                _this.address = new Address(obj.address);
            }
            if (obj.physicalType) {
                _this.physicalType = new CodeableConcept(obj.physicalType);
            }
            if (obj.position) {
                _this.position = new PositionComponent(obj.position);
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = new ResourceReference(obj.managingOrganization);
            }
            if (obj.partOf) {
                _this.partOf = new ResourceReference(obj.partOf);
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _d = 0, _e = obj.endpoint || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return Location;
}(DomainResource));

var SupplementalDataComponent = (function (_super) {
    __extends(SupplementalDataComponent, _super);
    function SupplementalDataComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.usage) {
                _this.usage = [];
                for (var _i = 0, _a = obj.usage || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.usage.push(new CodeableConcept(o));
                }
            }
            if (obj.criteria) {
                _this.criteria = obj.criteria;
            }
            if (obj.path) {
                _this.path = obj.path;
            }
        }
        return _this;
    }
    return SupplementalDataComponent;
}(BackboneElement));

var Measure = (function (_super) {
    __extends(Measure, _super);
    function Measure(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Measure';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _f = 0, _g = obj.topic || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.topic.push(new CodeableConcept(o));
                }
            }
            if (obj.contributor) {
                _this.contributor = [];
                for (var _h = 0, _j = obj.contributor || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contributor.push(new Contributor(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.library) {
                _this.library = [];
                for (var _p = 0, _q = obj.library || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.library.push(new ResourceReference(o));
                }
            }
            if (obj.disclaimer) {
                _this.disclaimer = obj.disclaimer;
            }
            if (obj.scoring) {
                _this.scoring = new CodeableConcept(obj.scoring);
            }
            if (obj.compositeScoring) {
                _this.compositeScoring = new CodeableConcept(obj.compositeScoring);
            }
            if (obj.type) {
                _this.type = [];
                for (var _r = 0, _s = obj.type || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.riskAdjustment) {
                _this.riskAdjustment = obj.riskAdjustment;
            }
            if (obj.rateAggregation) {
                _this.rateAggregation = obj.rateAggregation;
            }
            if (obj.rationale) {
                _this.rationale = obj.rationale;
            }
            if (obj.clinicalRecommendationStatement) {
                _this.clinicalRecommendationStatement = obj.clinicalRecommendationStatement;
            }
            if (obj.improvementNotation) {
                _this.improvementNotation = obj.improvementNotation;
            }
            if (obj.definition) {
                _this.definition = obj.definition;
            }
            if (obj.guidance) {
                _this.guidance = obj.guidance;
            }
            if (obj.set) {
                _this.set = obj.set;
            }
            if (obj.group) {
                _this.group = [];
                for (var _t = 0, _u = obj.group || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.group.push(new GroupComponent(o));
                }
            }
            if (obj.supplementalData) {
                _this.supplementalData = [];
                for (var _v = 0, _w = obj.supplementalData || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.supplementalData.push(new SupplementalDataComponent(o));
                }
            }
        }
        return _this;
    }
    return Measure;
}(DomainResource));

var MeasureReport = (function (_super) {
    __extends(MeasureReport, _super);
    function MeasureReport(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MeasureReport';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.measure) {
                _this.measure = new ResourceReference(obj.measure);
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.reportingOrganization) {
                _this.reportingOrganization = new ResourceReference(obj.reportingOrganization);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.group) {
                _this.group = [];
                for (var _i = 0, _a = obj.group || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.group.push(new GroupComponent(o));
                }
            }
            if (obj.evaluatedResources) {
                _this.evaluatedResources = new ResourceReference(obj.evaluatedResources);
            }
        }
        return _this;
    }
    return MeasureReport;
}(DomainResource));

var Media = (function (_super) {
    __extends(Media, _super);
    function Media(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Media';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.subtype) {
                _this.subtype = new CodeableConcept(obj.subtype);
            }
            if (obj.view) {
                _this.view = new CodeableConcept(obj.view);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.operator) {
                _this.operator = new ResourceReference(obj.operator);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _d = 0, _e = obj.reasonCode || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = new CodeableConcept(obj.bodySite);
            }
            if (obj.device) {
                _this.device = new ResourceReference(obj.device);
            }
            if (obj.height) {
                _this.height = obj.height;
            }
            if (obj.width) {
                _this.width = obj.width;
            }
            if (obj.frames) {
                _this.frames = obj.frames;
            }
            if (obj.duration) {
                _this.duration = obj.duration;
            }
            if (obj.content) {
                _this.content = new Attachment(obj.content);
            }
            if (obj.note) {
                _this.note = [];
                for (var _f = 0, _g = obj.note || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return Media;
}(DomainResource));

var IngredientComponent = (function (_super) {
    __extends(IngredientComponent, _super);
    function IngredientComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.item) {
                _this.item = new Element(obj.item);
            }
            if (obj.isActive) {
                _this.isActive = obj.isActive;
            }
            if (obj.amount) {
                _this.amount = new Ratio(obj.amount);
            }
        }
        return _this;
    }
    return IngredientComponent;
}(BackboneElement));

var Medication = (function (_super) {
    __extends(Medication, _super);
    function Medication(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Medication';
        if (obj) {
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.isBrand) {
                _this.isBrand = obj.isBrand;
            }
            if (obj.isOverTheCounter) {
                _this.isOverTheCounter = obj.isOverTheCounter;
            }
            if (obj.manufacturer) {
                _this.manufacturer = new ResourceReference(obj.manufacturer);
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.ingredient) {
                _this.ingredient = [];
                for (var _i = 0, _a = obj.ingredient || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.ingredient.push(new IngredientComponent(o));
                }
            }
            if (obj.package) {
                _this.package = new PackageComponent(obj.package);
            }
            if (obj.image) {
                _this.image = [];
                for (var _b = 0, _c = obj.image || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.image.push(new Attachment(o));
                }
            }
        }
        return _this;
    }
    return Medication;
}(DomainResource));

var DosageComponent = (function (_super) {
    __extends(DosageComponent, _super);
    function DosageComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.text) {
                _this.text = obj.text;
            }
            if (obj.site) {
                _this.site = new CodeableConcept(obj.site);
            }
            if (obj.route) {
                _this.route = new CodeableConcept(obj.route);
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.dose) {
                _this.dose = new SimpleQuantity(obj.dose);
            }
            if (obj.rate) {
                _this.rate = new Element(obj.rate);
            }
        }
        return _this;
    }
    return DosageComponent;
}(BackboneElement));

var MedicationAdministration = (function (_super) {
    __extends(MedicationAdministration, _super);
    function MedicationAdministration(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MedicationAdministration';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _d = 0, _e = obj.partOf || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.medication) {
                _this.medication = new Element(obj.medication);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.supportingInformation) {
                _this.supportingInformation = [];
                for (var _f = 0, _g = obj.supportingInformation || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.supportingInformation.push(new ResourceReference(o));
                }
            }
            if (obj.effective) {
                _this.effective = new Element(obj.effective);
            }
            if (obj.performer) {
                _this.performer = [];
                for (var _h = 0, _j = obj.performer || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.performer.push(new PerformerComponent(o));
                }
            }
            if (obj.notGiven) {
                _this.notGiven = obj.notGiven;
            }
            if (obj.reasonNotGiven) {
                _this.reasonNotGiven = [];
                for (var _k = 0, _l = obj.reasonNotGiven || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonNotGiven.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _m = 0, _o = obj.reasonCode || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _p = 0, _q = obj.reasonReference || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.prescription) {
                _this.prescription = new ResourceReference(obj.prescription);
            }
            if (obj.device) {
                _this.device = [];
                for (var _r = 0, _s = obj.device || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.device.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _t = 0, _u = obj.note || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.dosage) {
                _this.dosage = new DosageComponent(obj.dosage);
            }
            if (obj.eventHistory) {
                _this.eventHistory = [];
                for (var _v = 0, _w = obj.eventHistory || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.eventHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return MedicationAdministration;
}(DomainResource));

var SubstitutionComponent = (function (_super) {
    __extends(SubstitutionComponent, _super);
    function SubstitutionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.wasSubstituted) {
                _this.wasSubstituted = obj.wasSubstituted;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _i = 0, _a = obj.reason || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.responsibleParty) {
                _this.responsibleParty = [];
                for (var _b = 0, _c = obj.responsibleParty || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.responsibleParty.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return SubstitutionComponent;
}(BackboneElement));

var MedicationDispense = (function (_super) {
    __extends(MedicationDispense, _super);
    function MedicationDispense(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MedicationDispense';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _b = 0, _c = obj.partOf || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.medication) {
                _this.medication = new Element(obj.medication);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.supportingInformation) {
                _this.supportingInformation = [];
                for (var _d = 0, _e = obj.supportingInformation || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.supportingInformation.push(new ResourceReference(o));
                }
            }
            if (obj.performer) {
                _this.performer = [];
                for (var _f = 0, _g = obj.performer || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.performer.push(new PerformerComponent(o));
                }
            }
            if (obj.authorizingPrescription) {
                _this.authorizingPrescription = [];
                for (var _h = 0, _j = obj.authorizingPrescription || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.authorizingPrescription.push(new ResourceReference(o));
                }
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.daysSupply) {
                _this.daysSupply = new SimpleQuantity(obj.daysSupply);
            }
            if (obj.whenPrepared) {
                _this.whenPrepared = new Date(obj.whenPrepared);
            }
            if (obj.whenHandedOver) {
                _this.whenHandedOver = new Date(obj.whenHandedOver);
            }
            if (obj.destination) {
                _this.destination = new ResourceReference(obj.destination);
            }
            if (obj.receiver) {
                _this.receiver = [];
                for (var _k = 0, _l = obj.receiver || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.receiver.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _m = 0, _o = obj.note || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.dosageInstruction) {
                _this.dosageInstruction = [];
                for (var _p = 0, _q = obj.dosageInstruction || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.dosageInstruction.push(new Dosage(o));
                }
            }
            if (obj.substitution) {
                _this.substitution = new SubstitutionComponent(obj.substitution);
            }
            if (obj.detectedIssue) {
                _this.detectedIssue = [];
                for (var _r = 0, _s = obj.detectedIssue || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.detectedIssue.push(new ResourceReference(o));
                }
            }
            if (obj.notDone) {
                _this.notDone = obj.notDone;
            }
            if (obj.notDoneReason) {
                _this.notDoneReason = new Element(obj.notDoneReason);
            }
            if (obj.eventHistory) {
                _this.eventHistory = [];
                for (var _t = 0, _u = obj.eventHistory || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.eventHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return MedicationDispense;
}(DomainResource));

var DispenseRequestComponent = (function (_super) {
    __extends(DispenseRequestComponent, _super);
    function DispenseRequestComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.validityPeriod) {
                _this.validityPeriod = new Period(obj.validityPeriod);
            }
            if (obj.numberOfRepeatsAllowed) {
                _this.numberOfRepeatsAllowed = obj.numberOfRepeatsAllowed;
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.expectedSupplyDuration) {
                _this.expectedSupplyDuration = new Duration(obj.expectedSupplyDuration);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
        }
        return _this;
    }
    return DispenseRequestComponent;
}(BackboneElement));

var MedicationRequest = (function (_super) {
    __extends(MedicationRequest, _super);
    function MedicationRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MedicationRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.medication) {
                _this.medication = new Element(obj.medication);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.supportingInformation) {
                _this.supportingInformation = [];
                for (var _f = 0, _g = obj.supportingInformation || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.supportingInformation.push(new ResourceReference(o));
                }
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.recorder) {
                _this.recorder = new ResourceReference(obj.recorder);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _h = 0, _j = obj.reasonCode || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _k = 0, _l = obj.reasonReference || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _m = 0, _o = obj.note || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.dosageInstruction) {
                _this.dosageInstruction = [];
                for (var _p = 0, _q = obj.dosageInstruction || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.dosageInstruction.push(new Dosage(o));
                }
            }
            if (obj.dispenseRequest) {
                _this.dispenseRequest = new DispenseRequestComponent(obj.dispenseRequest);
            }
            if (obj.substitution) {
                _this.substitution = new SubstitutionComponent(obj.substitution);
            }
            if (obj.priorPrescription) {
                _this.priorPrescription = new ResourceReference(obj.priorPrescription);
            }
            if (obj.detectedIssue) {
                _this.detectedIssue = [];
                for (var _r = 0, _s = obj.detectedIssue || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.detectedIssue.push(new ResourceReference(o));
                }
            }
            if (obj.eventHistory) {
                _this.eventHistory = [];
                for (var _t = 0, _u = obj.eventHistory || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.eventHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return MedicationRequest;
}(DomainResource));

var MedicationStatement = (function (_super) {
    __extends(MedicationStatement, _super);
    function MedicationStatement(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MedicationStatement';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _d = 0, _e = obj.partOf || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.medication) {
                _this.medication = new Element(obj.medication);
            }
            if (obj.effective) {
                _this.effective = new Element(obj.effective);
            }
            if (obj.dateAsserted) {
                _this.dateAsserted = new Date(obj.dateAsserted);
            }
            if (obj.informationSource) {
                _this.informationSource = new ResourceReference(obj.informationSource);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.derivedFrom) {
                _this.derivedFrom = [];
                for (var _f = 0, _g = obj.derivedFrom || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.derivedFrom.push(new ResourceReference(o));
                }
            }
            if (obj.taken) {
                _this.taken = obj.taken;
            }
            if (obj.reasonNotTaken) {
                _this.reasonNotTaken = [];
                for (var _h = 0, _j = obj.reasonNotTaken || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.reasonNotTaken.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _k = 0, _l = obj.reasonCode || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _m = 0, _o = obj.reasonReference || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _p = 0, _q = obj.note || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.dosage) {
                _this.dosage = [];
                for (var _r = 0, _s = obj.dosage || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.dosage.push(new Dosage(o));
                }
            }
        }
        return _this;
    }
    return MedicationStatement;
}(DomainResource));

var FocusComponent = (function (_super) {
    __extends(FocusComponent, _super);
    function FocusComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.profile) {
                _this.profile = new ResourceReference(obj.profile);
            }
            if (obj.min) {
                _this.min = obj.min;
            }
            if (obj.max) {
                _this.max = obj.max;
            }
        }
        return _this;
    }
    return FocusComponent;
}(BackboneElement));

var AllowedResponseComponent = (function (_super) {
    __extends(AllowedResponseComponent, _super);
    function AllowedResponseComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.message) {
                _this.message = new ResourceReference(obj.message);
            }
            if (obj.situation) {
                _this.situation = obj.situation;
            }
        }
        return _this;
    }
    return AllowedResponseComponent;
}(BackboneElement));

var MessageDefinition = (function (_super) {
    __extends(MessageDefinition, _super);
    function MessageDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MessageDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.base) {
                _this.base = new ResourceReference(obj.base);
            }
            if (obj.parent) {
                _this.parent = [];
                for (var _f = 0, _g = obj.parent || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.parent.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _h = 0, _j = obj.replaces || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.event) {
                _this.event = new Coding(obj.event);
            }
            if (obj.category) {
                _this.category = obj.category;
            }
            if (obj.focus) {
                _this.focus = [];
                for (var _k = 0, _l = obj.focus || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.focus.push(new FocusComponent(o));
                }
            }
            if (obj.responseRequired) {
                _this.responseRequired = obj.responseRequired;
            }
            if (obj.allowedResponse) {
                _this.allowedResponse = [];
                for (var _m = 0, _o = obj.allowedResponse || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.allowedResponse.push(new AllowedResponseComponent(o));
                }
            }
        }
        return _this;
    }
    return MessageDefinition;
}(DomainResource));

var MessageDestinationComponent = (function (_super) {
    __extends(MessageDestinationComponent, _super);
    function MessageDestinationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.target) {
                _this.target = new ResourceReference(obj.target);
            }
            if (obj.endpoint) {
                _this.endpoint = obj.endpoint;
            }
        }
        return _this;
    }
    return MessageDestinationComponent;
}(BackboneElement));

var MessageSourceComponent = (function (_super) {
    __extends(MessageSourceComponent, _super);
    function MessageSourceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.software) {
                _this.software = obj.software;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.contact) {
                _this.contact = new ContactPoint(obj.contact);
            }
            if (obj.endpoint) {
                _this.endpoint = obj.endpoint;
            }
        }
        return _this;
    }
    return MessageSourceComponent;
}(BackboneElement));

var MessageHeader = (function (_super) {
    __extends(MessageHeader, _super);
    function MessageHeader(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'MessageHeader';
        if (obj) {
            if (obj.event) {
                _this.event = new Coding(obj.event);
            }
            if (obj.destination) {
                _this.destination = [];
                for (var _i = 0, _a = obj.destination || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.destination.push(new MessageDestinationComponent(o));
                }
            }
            if (obj.receiver) {
                _this.receiver = new ResourceReference(obj.receiver);
            }
            if (obj.sender) {
                _this.sender = new ResourceReference(obj.sender);
            }
            if (obj.timestamp) {
                _this.timestamp = new Date(obj.timestamp);
            }
            if (obj.enterer) {
                _this.enterer = new ResourceReference(obj.enterer);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.source) {
                _this.source = new MessageSourceComponent(obj.source);
            }
            if (obj.responsible) {
                _this.responsible = new ResourceReference(obj.responsible);
            }
            if (obj.reason) {
                _this.reason = new CodeableConcept(obj.reason);
            }
            if (obj.response) {
                _this.response = new ResponseComponent(obj.response);
            }
            if (obj.focus) {
                _this.focus = [];
                for (var _b = 0, _c = obj.focus || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.focus.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return MessageHeader;
}(DomainResource));

var UniqueIdComponent = (function (_super) {
    __extends(UniqueIdComponent, _super);
    function UniqueIdComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
            if (obj.preferred) {
                _this.preferred = obj.preferred;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return UniqueIdComponent;
}(BackboneElement));

var NamingSystem = (function (_super) {
    __extends(NamingSystem, _super);
    function NamingSystem(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'NamingSystem';
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.responsible) {
                _this.responsible = obj.responsible;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.uniqueId) {
                _this.uniqueId = [];
                for (var _f = 0, _g = obj.uniqueId || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.uniqueId.push(new UniqueIdComponent(o));
                }
            }
            if (obj.replacedBy) {
                _this.replacedBy = new ResourceReference(obj.replacedBy);
            }
        }
        return _this;
    }
    return NamingSystem;
}(DomainResource));

var NutrientComponent = (function (_super) {
    __extends(NutrientComponent, _super);
    function NutrientComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.modifier) {
                _this.modifier = new CodeableConcept(obj.modifier);
            }
            if (obj.amount) {
                _this.amount = new SimpleQuantity(obj.amount);
            }
        }
        return _this;
    }
    return NutrientComponent;
}(BackboneElement));

var TextureComponent = (function (_super) {
    __extends(TextureComponent, _super);
    function TextureComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.modifier) {
                _this.modifier = new CodeableConcept(obj.modifier);
            }
            if (obj.foodType) {
                _this.foodType = new CodeableConcept(obj.foodType);
            }
        }
        return _this;
    }
    return TextureComponent;
}(BackboneElement));

var OralDietComponent = (function (_super) {
    __extends(OralDietComponent, _super);
    function OralDietComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = [];
                for (var _i = 0, _a = obj.type || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.schedule) {
                _this.schedule = [];
                for (var _b = 0, _c = obj.schedule || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.schedule.push(new Timing(o));
                }
            }
            if (obj.nutrient) {
                _this.nutrient = [];
                for (var _d = 0, _e = obj.nutrient || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.nutrient.push(new NutrientComponent(o));
                }
            }
            if (obj.texture) {
                _this.texture = [];
                for (var _f = 0, _g = obj.texture || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.texture.push(new TextureComponent(o));
                }
            }
            if (obj.fluidConsistencyType) {
                _this.fluidConsistencyType = [];
                for (var _h = 0, _j = obj.fluidConsistencyType || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.fluidConsistencyType.push(new CodeableConcept(o));
                }
            }
            if (obj.instruction) {
                _this.instruction = obj.instruction;
            }
        }
        return _this;
    }
    return OralDietComponent;
}(BackboneElement));

var SupplementComponent = (function (_super) {
    __extends(SupplementComponent, _super);
    function SupplementComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.productName) {
                _this.productName = obj.productName;
            }
            if (obj.schedule) {
                _this.schedule = [];
                for (var _i = 0, _a = obj.schedule || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.schedule.push(new Timing(o));
                }
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.instruction) {
                _this.instruction = obj.instruction;
            }
        }
        return _this;
    }
    return SupplementComponent;
}(BackboneElement));

var AdministrationComponent = (function (_super) {
    __extends(AdministrationComponent, _super);
    function AdministrationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.schedule) {
                _this.schedule = new Timing(obj.schedule);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.rate) {
                _this.rate = new Element(obj.rate);
            }
        }
        return _this;
    }
    return AdministrationComponent;
}(BackboneElement));

var EnteralFormulaComponent = (function (_super) {
    __extends(EnteralFormulaComponent, _super);
    function EnteralFormulaComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.baseFormulaType) {
                _this.baseFormulaType = new CodeableConcept(obj.baseFormulaType);
            }
            if (obj.baseFormulaProductName) {
                _this.baseFormulaProductName = obj.baseFormulaProductName;
            }
            if (obj.additiveType) {
                _this.additiveType = new CodeableConcept(obj.additiveType);
            }
            if (obj.additiveProductName) {
                _this.additiveProductName = obj.additiveProductName;
            }
            if (obj.caloricDensity) {
                _this.caloricDensity = new SimpleQuantity(obj.caloricDensity);
            }
            if (obj.routeofAdministration) {
                _this.routeofAdministration = new CodeableConcept(obj.routeofAdministration);
            }
            if (obj.administration) {
                _this.administration = [];
                for (var _i = 0, _a = obj.administration || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.administration.push(new AdministrationComponent(o));
                }
            }
            if (obj.maxVolumeToDeliver) {
                _this.maxVolumeToDeliver = new SimpleQuantity(obj.maxVolumeToDeliver);
            }
            if (obj.administrationInstruction) {
                _this.administrationInstruction = obj.administrationInstruction;
            }
        }
        return _this;
    }
    return EnteralFormulaComponent;
}(BackboneElement));

var NutritionOrder = (function (_super) {
    __extends(NutritionOrder, _super);
    function NutritionOrder(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'NutritionOrder';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.dateTime) {
                _this.dateTime = new Date(obj.dateTime);
            }
            if (obj.orderer) {
                _this.orderer = new ResourceReference(obj.orderer);
            }
            if (obj.allergyIntolerance) {
                _this.allergyIntolerance = [];
                for (var _b = 0, _c = obj.allergyIntolerance || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.allergyIntolerance.push(new ResourceReference(o));
                }
            }
            if (obj.foodPreferenceModifier) {
                _this.foodPreferenceModifier = [];
                for (var _d = 0, _e = obj.foodPreferenceModifier || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.foodPreferenceModifier.push(new CodeableConcept(o));
                }
            }
            if (obj.excludeFoodModifier) {
                _this.excludeFoodModifier = [];
                for (var _f = 0, _g = obj.excludeFoodModifier || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.excludeFoodModifier.push(new CodeableConcept(o));
                }
            }
            if (obj.oralDiet) {
                _this.oralDiet = new OralDietComponent(obj.oralDiet);
            }
            if (obj.supplement) {
                _this.supplement = [];
                for (var _h = 0, _j = obj.supplement || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.supplement.push(new SupplementComponent(o));
                }
            }
            if (obj.enteralFormula) {
                _this.enteralFormula = new EnteralFormulaComponent(obj.enteralFormula);
            }
        }
        return _this;
    }
    return NutritionOrder;
}(DomainResource));

var OverloadComponent = (function (_super) {
    __extends(OverloadComponent, _super);
    function OverloadComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.parameterName) {
                _this.parameterName = obj.parameterName;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return OverloadComponent;
}(BackboneElement));

var OperationDefinition = (function (_super) {
    __extends(OperationDefinition, _super);
    function OperationDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'OperationDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.kind) {
                _this.kind = obj.kind;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.idempotent) {
                _this.idempotent = obj.idempotent;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
            if (obj.base) {
                _this.base = new ResourceReference(obj.base);
            }
            if (obj.resource) {
                _this.resource = obj.resource;
            }
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.instance) {
                _this.instance = obj.instance;
            }
            if (obj.parameter) {
                _this.parameter = [];
                for (var _f = 0, _g = obj.parameter || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.parameter.push(new ParameterComponent(o));
                }
            }
            if (obj.overload) {
                _this.overload = [];
                for (var _h = 0, _j = obj.overload || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.overload.push(new OverloadComponent(o));
                }
            }
        }
        return _this;
    }
    return OperationDefinition;
}(DomainResource));

var IssueComponent = (function (_super) {
    __extends(IssueComponent, _super);
    function IssueComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.severity) {
                _this.severity = obj.severity;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.details) {
                _this.details = new CodeableConcept(obj.details);
            }
            if (obj.diagnostics) {
                _this.diagnostics = obj.diagnostics;
            }
            if (obj.location) {
                _this.location = obj.location;
            }
            if (obj.expression) {
                _this.expression = obj.expression;
            }
        }
        return _this;
    }
    return IssueComponent;
}(BackboneElement));

var OperationOutcome = (function (_super) {
    __extends(OperationOutcome, _super);
    function OperationOutcome(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'OperationOutcome';
        if (obj) {
            if (obj.issue) {
                _this.issue = [];
                for (var _i = 0, _a = obj.issue || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.issue.push(new IssueComponent(o));
                }
            }
        }
        return _this;
    }
    return OperationOutcome;
}(DomainResource));

var ContactComponent = (function (_super) {
    __extends(ContactComponent, _super);
    function ContactComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.purpose) {
                _this.purpose = new CodeableConcept(obj.purpose);
            }
            if (obj.name) {
                _this.name = new HumanName(obj.name);
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _i = 0, _a = obj.telecom || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.address) {
                _this.address = new Address(obj.address);
            }
        }
        return _this;
    }
    return ContactComponent;
}(BackboneElement));

var Organization = (function (_super) {
    __extends(Organization, _super);
    function Organization(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Organization';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.type) {
                _this.type = [];
                for (var _b = 0, _c = obj.type || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.type.push(new CodeableConcept(o));
                }
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.alias) {
                _this.alias = obj.alias;
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _d = 0, _e = obj.telecom || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.address) {
                _this.address = [];
                for (var _f = 0, _g = obj.address || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.address.push(new Address(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = new ResourceReference(obj.partOf);
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _h = 0, _j = obj.contact || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contact.push(new ContactComponent(o));
                }
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _k = 0, _l = obj.endpoint || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return Organization;
}(DomainResource));

var AnimalComponent = (function (_super) {
    __extends(AnimalComponent, _super);
    function AnimalComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.species) {
                _this.species = new CodeableConcept(obj.species);
            }
            if (obj.breed) {
                _this.breed = new CodeableConcept(obj.breed);
            }
            if (obj.genderStatus) {
                _this.genderStatus = new CodeableConcept(obj.genderStatus);
            }
        }
        return _this;
    }
    return AnimalComponent;
}(BackboneElement));

var CommunicationComponent = (function (_super) {
    __extends(CommunicationComponent, _super);
    function CommunicationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.language) {
                _this.language = new CodeableConcept(obj.language);
            }
            if (obj.preferred) {
                _this.preferred = obj.preferred;
            }
        }
        return _this;
    }
    return CommunicationComponent;
}(BackboneElement));

var Patient = (function (_super) {
    __extends(Patient, _super);
    function Patient(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Patient';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.name) {
                _this.name = [];
                for (var _b = 0, _c = obj.name || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.name.push(new HumanName(o));
                }
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _d = 0, _e = obj.telecom || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.gender) {
                _this.gender = obj.gender;
            }
            if (obj.birthDate) {
                _this.birthDate = new Date(obj.birthDate);
            }
            if (obj.deceased) {
                _this.deceased = new Element(obj.deceased);
            }
            if (obj.address) {
                _this.address = [];
                for (var _f = 0, _g = obj.address || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.address.push(new Address(o));
                }
            }
            if (obj.maritalStatus) {
                _this.maritalStatus = new CodeableConcept(obj.maritalStatus);
            }
            if (obj.multipleBirth) {
                _this.multipleBirth = new Element(obj.multipleBirth);
            }
            if (obj.photo) {
                _this.photo = [];
                for (var _h = 0, _j = obj.photo || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.photo.push(new Attachment(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactComponent(o));
                }
            }
            if (obj.animal) {
                _this.animal = new AnimalComponent(obj.animal);
            }
            if (obj.communication) {
                _this.communication = [];
                for (var _m = 0, _o = obj.communication || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.communication.push(new CommunicationComponent(o));
                }
            }
            if (obj.generalPractitioner) {
                _this.generalPractitioner = [];
                for (var _p = 0, _q = obj.generalPractitioner || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.generalPractitioner.push(new ResourceReference(o));
                }
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = new ResourceReference(obj.managingOrganization);
            }
            if (obj.link) {
                _this.link = [];
                for (var _r = 0, _s = obj.link || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.link.push(new LinkComponent(o));
                }
            }
        }
        return _this;
    }
    return Patient;
}(DomainResource));

var PaymentNotice = (function (_super) {
    __extends(PaymentNotice, _super);
    function PaymentNotice(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'PaymentNotice';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.response) {
                _this.response = new ResourceReference(obj.response);
            }
            if (obj.statusDate) {
                _this.statusDate = new Date(obj.statusDate);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.target) {
                _this.target = new ResourceReference(obj.target);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.paymentStatus) {
                _this.paymentStatus = new CodeableConcept(obj.paymentStatus);
            }
        }
        return _this;
    }
    return PaymentNotice;
}(DomainResource));

var DetailsComponent = (function (_super) {
    __extends(DetailsComponent, _super);
    function DetailsComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.response) {
                _this.response = new ResourceReference(obj.response);
            }
            if (obj.submitter) {
                _this.submitter = new ResourceReference(obj.submitter);
            }
            if (obj.payee) {
                _this.payee = new ResourceReference(obj.payee);
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.amount) {
                _this.amount = new Money(obj.amount);
            }
        }
        return _this;
    }
    return DetailsComponent;
}(BackboneElement));

var NotesComponent = (function (_super) {
    __extends(NotesComponent, _super);
    function NotesComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.text) {
                _this.text = obj.text;
            }
        }
        return _this;
    }
    return NotesComponent;
}(BackboneElement));

var PaymentReconciliation = (function (_super) {
    __extends(PaymentReconciliation, _super);
    function PaymentReconciliation(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'PaymentReconciliation';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.requestProvider) {
                _this.requestProvider = new ResourceReference(obj.requestProvider);
            }
            if (obj.requestOrganization) {
                _this.requestOrganization = new ResourceReference(obj.requestOrganization);
            }
            if (obj.detail) {
                _this.detail = [];
                for (var _b = 0, _c = obj.detail || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.detail.push(new DetailsComponent(o));
                }
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.total) {
                _this.total = new Money(obj.total);
            }
            if (obj.processNote) {
                _this.processNote = [];
                for (var _d = 0, _e = obj.processNote || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.processNote.push(new NotesComponent(o));
                }
            }
        }
        return _this;
    }
    return PaymentReconciliation;
}(DomainResource));

var Person = (function (_super) {
    __extends(Person, _super);
    function Person(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Person';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.name) {
                _this.name = [];
                for (var _b = 0, _c = obj.name || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.name.push(new HumanName(o));
                }
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _d = 0, _e = obj.telecom || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.gender) {
                _this.gender = obj.gender;
            }
            if (obj.birthDate) {
                _this.birthDate = new Date(obj.birthDate);
            }
            if (obj.address) {
                _this.address = [];
                for (var _f = 0, _g = obj.address || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.address.push(new Address(o));
                }
            }
            if (obj.photo) {
                _this.photo = new Attachment(obj.photo);
            }
            if (obj.managingOrganization) {
                _this.managingOrganization = new ResourceReference(obj.managingOrganization);
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.link) {
                _this.link = [];
                for (var _h = 0, _j = obj.link || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.link.push(new LinkComponent(o));
                }
            }
        }
        return _this;
    }
    Person.prototype.getDisplayName = function () {
        if (this.name.length > 0) {
            return this.name[0].getDisplay();
        }
    };
    return Person;
}(DomainResource));

var GoalComponent = (function (_super) {
    __extends(GoalComponent, _super);
    function GoalComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.description) {
                _this.description = new CodeableConcept(obj.description);
            }
            if (obj.priority) {
                _this.priority = new CodeableConcept(obj.priority);
            }
            if (obj.start) {
                _this.start = new CodeableConcept(obj.start);
            }
            if (obj.addresses) {
                _this.addresses = [];
                for (var _i = 0, _a = obj.addresses || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.addresses.push(new CodeableConcept(o));
                }
            }
            if (obj.documentation) {
                _this.documentation = [];
                for (var _b = 0, _c = obj.documentation || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.documentation.push(new RelatedArtifact(o));
                }
            }
            if (obj.target) {
                _this.target = [];
                for (var _d = 0, _e = obj.target || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.target.push(new TargetComponent(o));
                }
            }
        }
        return _this;
    }
    return GoalComponent;
}(BackboneElement));

var TriggerDefinition = (function (_super) {
    __extends(TriggerDefinition, _super);
    function TriggerDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.eventName) {
                _this.eventName = obj.eventName;
            }
            if (obj.eventTiming) {
                _this.eventTiming = new Element(obj.eventTiming);
            }
            if (obj.eventData) {
                _this.eventData = new DataRequirement(obj.eventData);
            }
        }
        return _this;
    }
    return TriggerDefinition;
}(Element));

var RelatedActionComponent = (function (_super) {
    __extends(RelatedActionComponent, _super);
    function RelatedActionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.actionId) {
                _this.actionId = obj.actionId;
            }
            if (obj.relationship) {
                _this.relationship = obj.relationship;
            }
            if (obj.offset) {
                _this.offset = new Element(obj.offset);
            }
        }
        return _this;
    }
    return RelatedActionComponent;
}(BackboneElement));

var ActionComponent = (function (_super) {
    __extends(ActionComponent, _super);
    function ActionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.label) {
                _this.label = obj.label;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.textEquivalent) {
                _this.textEquivalent = obj.textEquivalent;
            }
            if (obj.code) {
                _this.code = [];
                for (var _i = 0, _a = obj.code || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.code.push(new CodeableConcept(o));
                }
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _b = 0, _c = obj.reason || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.reason.push(new CodeableConcept(o));
                }
            }
            if (obj.documentation) {
                _this.documentation = [];
                for (var _d = 0, _e = obj.documentation || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.documentation.push(new RelatedArtifact(o));
                }
            }
            if (obj.goalId) {
                _this.goalId = obj.goalId;
            }
            if (obj.triggerDefinition) {
                _this.triggerDefinition = [];
                for (var _f = 0, _g = obj.triggerDefinition || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.triggerDefinition.push(new TriggerDefinition(o));
                }
            }
            if (obj.condition) {
                _this.condition = [];
                for (var _h = 0, _j = obj.condition || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.condition.push(new ConditionComponent(o));
                }
            }
            if (obj.input) {
                _this.input = [];
                for (var _k = 0, _l = obj.input || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.input.push(new DataRequirement(o));
                }
            }
            if (obj.output) {
                _this.output = [];
                for (var _m = 0, _o = obj.output || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.output.push(new DataRequirement(o));
                }
            }
            if (obj.relatedAction) {
                _this.relatedAction = [];
                for (var _p = 0, _q = obj.relatedAction || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.relatedAction.push(new RelatedActionComponent(o));
                }
            }
            if (obj.timing) {
                _this.timing = new Element(obj.timing);
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _r = 0, _s = obj.participant || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.type) {
                _this.type = new Coding(obj.type);
            }
            if (obj.groupingBehavior) {
                _this.groupingBehavior = obj.groupingBehavior;
            }
            if (obj.selectionBehavior) {
                _this.selectionBehavior = obj.selectionBehavior;
            }
            if (obj.requiredBehavior) {
                _this.requiredBehavior = obj.requiredBehavior;
            }
            if (obj.precheckBehavior) {
                _this.precheckBehavior = obj.precheckBehavior;
            }
            if (obj.cardinalityBehavior) {
                _this.cardinalityBehavior = obj.cardinalityBehavior;
            }
            if (obj.definition) {
                _this.definition = new ResourceReference(obj.definition);
            }
            if (obj.transform) {
                _this.transform = new ResourceReference(obj.transform);
            }
            if (obj.dynamicValue) {
                _this.dynamicValue = [];
                for (var _t = 0, _u = obj.dynamicValue || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.dynamicValue.push(new DynamicValueComponent(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _v = 0, _w = obj.action || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.action.push(new ActionComponent(o));
                }
            }
        }
        return _this;
    }
    return ActionComponent;
}(BackboneElement));

var PlanDefinition = (function (_super) {
    __extends(PlanDefinition, _super);
    function PlanDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'PlanDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _f = 0, _g = obj.topic || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.topic.push(new CodeableConcept(o));
                }
            }
            if (obj.contributor) {
                _this.contributor = [];
                for (var _h = 0, _j = obj.contributor || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contributor.push(new Contributor(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.library) {
                _this.library = [];
                for (var _p = 0, _q = obj.library || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.library.push(new ResourceReference(o));
                }
            }
            if (obj.goal) {
                _this.goal = [];
                for (var _r = 0, _s = obj.goal || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.goal.push(new GoalComponent(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _t = 0, _u = obj.action || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.action.push(new ActionComponent(o));
                }
            }
        }
        return _this;
    }
    return PlanDefinition;
}(DomainResource));

var QualificationComponent = (function (_super) {
    __extends(QualificationComponent, _super);
    function QualificationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.issuer) {
                _this.issuer = new ResourceReference(obj.issuer);
            }
        }
        return _this;
    }
    return QualificationComponent;
}(BackboneElement));

var Practitioner = (function (_super) {
    __extends(Practitioner, _super);
    function Practitioner(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Practitioner';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.name) {
                _this.name = [];
                for (var _b = 0, _c = obj.name || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.name.push(new HumanName(o));
                }
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _d = 0, _e = obj.telecom || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.address) {
                _this.address = [];
                for (var _f = 0, _g = obj.address || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.address.push(new Address(o));
                }
            }
            if (obj.gender) {
                _this.gender = obj.gender;
            }
            if (obj.birthDate) {
                _this.birthDate = new Date(obj.birthDate);
            }
            if (obj.photo) {
                _this.photo = [];
                for (var _h = 0, _j = obj.photo || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.photo.push(new Attachment(o));
                }
            }
            if (obj.qualification) {
                _this.qualification = [];
                for (var _k = 0, _l = obj.qualification || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.qualification.push(new QualificationComponent(o));
                }
            }
            if (obj.communication) {
                _this.communication = [];
                for (var _m = 0, _o = obj.communication || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.communication.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return Practitioner;
}(DomainResource));

var PractitionerRole = (function (_super) {
    __extends(PractitionerRole, _super);
    function PractitionerRole(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'PractitionerRole';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.practitioner) {
                _this.practitioner = new ResourceReference(obj.practitioner);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.code) {
                _this.code = [];
                for (var _b = 0, _c = obj.code || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.code.push(new CodeableConcept(o));
                }
            }
            if (obj.specialty) {
                _this.specialty = [];
                for (var _d = 0, _e = obj.specialty || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialty.push(new CodeableConcept(o));
                }
            }
            if (obj.location) {
                _this.location = [];
                for (var _f = 0, _g = obj.location || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.location.push(new ResourceReference(o));
                }
            }
            if (obj.healthcareService) {
                _this.healthcareService = [];
                for (var _h = 0, _j = obj.healthcareService || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.healthcareService.push(new ResourceReference(o));
                }
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _k = 0, _l = obj.telecom || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.availableTime) {
                _this.availableTime = [];
                for (var _m = 0, _o = obj.availableTime || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.availableTime.push(new AvailableTimeComponent(o));
                }
            }
            if (obj.notAvailable) {
                _this.notAvailable = [];
                for (var _p = 0, _q = obj.notAvailable || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.notAvailable.push(new NotAvailableComponent(o));
                }
            }
            if (obj.availabilityExceptions) {
                _this.availabilityExceptions = obj.availabilityExceptions;
            }
            if (obj.endpoint) {
                _this.endpoint = [];
                for (var _r = 0, _s = obj.endpoint || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.endpoint.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return PractitionerRole;
}(DomainResource));

var FocalDeviceComponent = (function (_super) {
    __extends(FocalDeviceComponent, _super);
    function FocalDeviceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.action) {
                _this.action = new CodeableConcept(obj.action);
            }
            if (obj.manipulated) {
                _this.manipulated = new ResourceReference(obj.manipulated);
            }
        }
        return _this;
    }
    return FocalDeviceComponent;
}(BackboneElement));

var Procedure = (function (_super) {
    __extends(Procedure, _super);
    function Procedure(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Procedure';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _f = 0, _g = obj.partOf || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.notDone) {
                _this.notDone = obj.notDone;
            }
            if (obj.notDoneReason) {
                _this.notDoneReason = new CodeableConcept(obj.notDoneReason);
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.performed) {
                _this.performed = new Element(obj.performed);
            }
            if (obj.performer) {
                _this.performer = [];
                for (var _h = 0, _j = obj.performer || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.performer.push(new PerformerComponent(o));
                }
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _k = 0, _l = obj.reasonCode || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _m = 0, _o = obj.reasonReference || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = [];
                for (var _p = 0, _q = obj.bodySite || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.bodySite.push(new CodeableConcept(o));
                }
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.report) {
                _this.report = [];
                for (var _r = 0, _s = obj.report || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.report.push(new ResourceReference(o));
                }
            }
            if (obj.complication) {
                _this.complication = [];
                for (var _t = 0, _u = obj.complication || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.complication.push(new CodeableConcept(o));
                }
            }
            if (obj.complicationDetail) {
                _this.complicationDetail = [];
                for (var _v = 0, _w = obj.complicationDetail || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.complicationDetail.push(new ResourceReference(o));
                }
            }
            if (obj.followUp) {
                _this.followUp = [];
                for (var _x = 0, _y = obj.followUp || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.followUp.push(new CodeableConcept(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _z = 0, _0 = obj.note || []; _z < _0.length; _z++) {
                    var o = _0[_z];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.focalDevice) {
                _this.focalDevice = [];
                for (var _1 = 0, _2 = obj.focalDevice || []; _1 < _2.length; _1++) {
                    var o = _2[_1];
                    _this.focalDevice.push(new FocalDeviceComponent(o));
                }
            }
            if (obj.usedReference) {
                _this.usedReference = [];
                for (var _3 = 0, _4 = obj.usedReference || []; _3 < _4.length; _3++) {
                    var o = _4[_3];
                    _this.usedReference.push(new ResourceReference(o));
                }
            }
            if (obj.usedCode) {
                _this.usedCode = [];
                for (var _5 = 0, _6 = obj.usedCode || []; _5 < _6.length; _5++) {
                    var o = _6[_5];
                    _this.usedCode.push(new CodeableConcept(o));
                }
            }
        }
        return _this;
    }
    return Procedure;
}(DomainResource));

var ProcedureRequest = (function (_super) {
    __extends(ProcedureRequest, _super);
    function ProcedureRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ProcedureRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _f = 0, _g = obj.replaces || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.requisition) {
                _this.requisition = new Identifier(obj.requisition);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.doNotPerform) {
                _this.doNotPerform = obj.doNotPerform;
            }
            if (obj.category) {
                _this.category = [];
                for (var _h = 0, _j = obj.category || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.asNeeded) {
                _this.asNeeded = new Element(obj.asNeeded);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.performerType) {
                _this.performerType = new CodeableConcept(obj.performerType);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _k = 0, _l = obj.reasonCode || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _m = 0, _o = obj.reasonReference || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.supportingInfo) {
                _this.supportingInfo = [];
                for (var _p = 0, _q = obj.supportingInfo || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.supportingInfo.push(new ResourceReference(o));
                }
            }
            if (obj.specimen) {
                _this.specimen = [];
                for (var _r = 0, _s = obj.specimen || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.specimen.push(new ResourceReference(o));
                }
            }
            if (obj.bodySite) {
                _this.bodySite = [];
                for (var _t = 0, _u = obj.bodySite || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.bodySite.push(new CodeableConcept(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _v = 0, _w = obj.note || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.relevantHistory) {
                _this.relevantHistory = [];
                for (var _x = 0, _y = obj.relevantHistory || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.relevantHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return ProcedureRequest;
}(DomainResource));

var ItemsComponent = (function (_super) {
    __extends(ItemsComponent, _super);
    function ItemsComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.sequenceLinkId) {
                _this.sequenceLinkId = obj.sequenceLinkId;
            }
        }
        return _this;
    }
    return ItemsComponent;
}(BackboneElement));

var ProcessRequest = (function (_super) {
    __extends(ProcessRequest, _super);
    function ProcessRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ProcessRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.action) {
                _this.action = obj.action;
            }
            if (obj.target) {
                _this.target = new ResourceReference(obj.target);
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.provider) {
                _this.provider = new ResourceReference(obj.provider);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.response) {
                _this.response = new ResourceReference(obj.response);
            }
            if (obj.nullify) {
                _this.nullify = obj.nullify;
            }
            if (obj.reference) {
                _this.reference = obj.reference;
            }
            if (obj.item) {
                _this.item = [];
                for (var _b = 0, _c = obj.item || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.item.push(new ItemsComponent(o));
                }
            }
            if (obj.include) {
                _this.include = obj.include;
            }
            if (obj.exclude) {
                _this.exclude = obj.exclude;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return ProcessRequest;
}(DomainResource));

var ProcessNoteComponent = (function (_super) {
    __extends(ProcessNoteComponent, _super);
    function ProcessNoteComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.text) {
                _this.text = obj.text;
            }
        }
        return _this;
    }
    return ProcessNoteComponent;
}(BackboneElement));

var ProcessResponse = (function (_super) {
    __extends(ProcessResponse, _super);
    function ProcessResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ProcessResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.created) {
                _this.created = new Date(obj.created);
            }
            if (obj.organization) {
                _this.organization = new ResourceReference(obj.organization);
            }
            if (obj.request) {
                _this.request = new ResourceReference(obj.request);
            }
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.disposition) {
                _this.disposition = obj.disposition;
            }
            if (obj.requestProvider) {
                _this.requestProvider = new ResourceReference(obj.requestProvider);
            }
            if (obj.requestOrganization) {
                _this.requestOrganization = new ResourceReference(obj.requestOrganization);
            }
            if (obj.form) {
                _this.form = new CodeableConcept(obj.form);
            }
            if (obj.processNote) {
                _this.processNote = [];
                for (var _b = 0, _c = obj.processNote || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.processNote.push(new ProcessNoteComponent(o));
                }
            }
            if (obj.error) {
                _this.error = [];
                for (var _d = 0, _e = obj.error || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.error.push(new CodeableConcept(o));
                }
            }
            if (obj.communicationRequest) {
                _this.communicationRequest = [];
                for (var _f = 0, _g = obj.communicationRequest || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.communicationRequest.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return ProcessResponse;
}(DomainResource));

var Provenance = (function (_super) {
    __extends(Provenance, _super);
    function Provenance(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Provenance';
        if (obj) {
            if (obj.target) {
                _this.target = [];
                for (var _i = 0, _a = obj.target || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.target.push(new ResourceReference(o));
                }
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.recorded) {
                _this.recorded = new Date(obj.recorded);
            }
            if (obj.policy) {
                _this.policy = obj.policy;
            }
            if (obj.location) {
                _this.location = new ResourceReference(obj.location);
            }
            if (obj.reason) {
                _this.reason = [];
                for (var _b = 0, _c = obj.reason || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.reason.push(new Coding(o));
                }
            }
            if (obj.activity) {
                _this.activity = new Coding(obj.activity);
            }
            if (obj.agent) {
                _this.agent = [];
                for (var _d = 0, _e = obj.agent || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.agent.push(new AgentComponent(o));
                }
            }
            if (obj.entity) {
                _this.entity = [];
                for (var _f = 0, _g = obj.entity || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.entity.push(new EntityComponent(o));
                }
            }
            if (obj.signature) {
                _this.signature = [];
                for (var _h = 0, _j = obj.signature || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.signature.push(new Signature(o));
                }
            }
        }
        return _this;
    }
    return Provenance;
}(DomainResource));

var Questionnaire = (function (_super) {
    __extends(Questionnaire, _super);
    function Questionnaire(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Questionnaire';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _f = 0, _g = obj.contact || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.code) {
                _this.code = [];
                for (var _h = 0, _j = obj.code || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.code.push(new Coding(o));
                }
            }
            if (obj.subjectType) {
                _this.subjectType = obj.subjectType;
            }
            if (obj.item) {
                _this.item = [];
                for (var _k = 0, _l = obj.item || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.item.push(new ItemComponent(o));
                }
            }
        }
        return _this;
    }
    return Questionnaire;
}(DomainResource));

var QuestionnaireResponse = (function (_super) {
    __extends(QuestionnaireResponse, _super);
    function QuestionnaireResponse(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'QuestionnaireResponse';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _i = 0, _a = obj.basedOn || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.parent) {
                _this.parent = [];
                for (var _b = 0, _c = obj.parent || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.parent.push(new ResourceReference(o));
                }
            }
            if (obj.questionnaire) {
                _this.questionnaire = new ResourceReference(obj.questionnaire);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.authored) {
                _this.authored = new Date(obj.authored);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.source) {
                _this.source = new ResourceReference(obj.source);
            }
            if (obj.item) {
                _this.item = [];
                for (var _d = 0, _e = obj.item || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.item.push(new ItemComponent(o));
                }
            }
        }
        return _this;
    }
    return QuestionnaireResponse;
}(DomainResource));

var ReferralRequest = (function (_super) {
    __extends(ReferralRequest, _super);
    function ReferralRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ReferralRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _f = 0, _g = obj.replaces || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.serviceRequested) {
                _this.serviceRequested = [];
                for (var _h = 0, _j = obj.serviceRequested || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.serviceRequested.push(new CodeableConcept(o));
                }
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.specialty) {
                _this.specialty = new CodeableConcept(obj.specialty);
            }
            if (obj.recipient) {
                _this.recipient = [];
                for (var _k = 0, _l = obj.recipient || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.recipient.push(new ResourceReference(o));
                }
            }
            if (obj.reasonCode) {
                _this.reasonCode = [];
                for (var _m = 0, _o = obj.reasonCode || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.reasonCode.push(new CodeableConcept(o));
                }
            }
            if (obj.reasonReference) {
                _this.reasonReference = [];
                for (var _p = 0, _q = obj.reasonReference || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.reasonReference.push(new ResourceReference(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.supportingInfo) {
                _this.supportingInfo = [];
                for (var _r = 0, _s = obj.supportingInfo || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.supportingInfo.push(new ResourceReference(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _t = 0, _u = obj.note || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.relevantHistory) {
                _this.relevantHistory = [];
                for (var _v = 0, _w = obj.relevantHistory || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.relevantHistory.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return ReferralRequest;
}(DomainResource));

var RelatedPerson = (function (_super) {
    __extends(RelatedPerson, _super);
    function RelatedPerson(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'RelatedPerson';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.relationship) {
                _this.relationship = new CodeableConcept(obj.relationship);
            }
            if (obj.name) {
                _this.name = [];
                for (var _b = 0, _c = obj.name || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.name.push(new HumanName(o));
                }
            }
            if (obj.telecom) {
                _this.telecom = [];
                for (var _d = 0, _e = obj.telecom || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.telecom.push(new ContactPoint(o));
                }
            }
            if (obj.gender) {
                _this.gender = obj.gender;
            }
            if (obj.birthDate) {
                _this.birthDate = new Date(obj.birthDate);
            }
            if (obj.address) {
                _this.address = [];
                for (var _f = 0, _g = obj.address || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.address.push(new Address(o));
                }
            }
            if (obj.photo) {
                _this.photo = [];
                for (var _h = 0, _j = obj.photo || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.photo.push(new Attachment(o));
                }
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
        }
        return _this;
    }
    return RelatedPerson;
}(DomainResource));

var RequestGroup = (function (_super) {
    __extends(RequestGroup, _super);
    function RequestGroup(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'RequestGroup';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = [];
                for (var _b = 0, _c = obj.definition || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.definition.push(new ResourceReference(o));
                }
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _d = 0, _e = obj.basedOn || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.replaces) {
                _this.replaces = [];
                for (var _f = 0, _g = obj.replaces || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.replaces.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.author) {
                _this.author = new ResourceReference(obj.author);
            }
            if (obj.reason) {
                _this.reason = new Element(obj.reason);
            }
            if (obj.note) {
                _this.note = [];
                for (var _h = 0, _j = obj.note || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.action) {
                _this.action = [];
                for (var _k = 0, _l = obj.action || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.action.push(new ActionComponent(o));
                }
            }
        }
        return _this;
    }
    return RequestGroup;
}(DomainResource));

var ArmComponent = (function (_super) {
    __extends(ArmComponent, _super);
    function ArmComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
        }
        return _this;
    }
    return ArmComponent;
}(BackboneElement));

var ResearchStudy = (function (_super) {
    __extends(ResearchStudy, _super);
    function ResearchStudy(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ResearchStudy';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.protocol) {
                _this.protocol = [];
                for (var _b = 0, _c = obj.protocol || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.protocol.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _d = 0, _e = obj.partOf || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _f = 0, _g = obj.category || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.focus) {
                _this.focus = [];
                for (var _h = 0, _j = obj.focus || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.focus.push(new CodeableConcept(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.keyword) {
                _this.keyword = [];
                for (var _p = 0, _q = obj.keyword || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.keyword.push(new CodeableConcept(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _r = 0, _s = obj.jurisdiction || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.enrollment) {
                _this.enrollment = [];
                for (var _t = 0, _u = obj.enrollment || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.enrollment.push(new ResourceReference(o));
                }
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.sponsor) {
                _this.sponsor = new ResourceReference(obj.sponsor);
            }
            if (obj.principalInvestigator) {
                _this.principalInvestigator = new ResourceReference(obj.principalInvestigator);
            }
            if (obj.site) {
                _this.site = [];
                for (var _v = 0, _w = obj.site || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.site.push(new ResourceReference(o));
                }
            }
            if (obj.reasonStopped) {
                _this.reasonStopped = new CodeableConcept(obj.reasonStopped);
            }
            if (obj.note) {
                _this.note = [];
                for (var _x = 0, _y = obj.note || []; _x < _y.length; _x++) {
                    var o = _y[_x];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.arm) {
                _this.arm = [];
                for (var _z = 0, _0 = obj.arm || []; _z < _0.length; _z++) {
                    var o = _0[_z];
                    _this.arm.push(new ArmComponent(o));
                }
            }
        }
        return _this;
    }
    return ResearchStudy;
}(DomainResource));

var ResearchSubject = (function (_super) {
    __extends(ResearchSubject, _super);
    function ResearchSubject(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ResearchSubject';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.study) {
                _this.study = new ResourceReference(obj.study);
            }
            if (obj.individual) {
                _this.individual = new ResourceReference(obj.individual);
            }
            if (obj.assignedArm) {
                _this.assignedArm = obj.assignedArm;
            }
            if (obj.actualArm) {
                _this.actualArm = obj.actualArm;
            }
            if (obj.consent) {
                _this.consent = new ResourceReference(obj.consent);
            }
        }
        return _this;
    }
    return ResearchSubject;
}(DomainResource));

var PredictionComponent = (function (_super) {
    __extends(PredictionComponent, _super);
    function PredictionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.outcome) {
                _this.outcome = new CodeableConcept(obj.outcome);
            }
            if (obj.probability) {
                _this.probability = new Element(obj.probability);
            }
            if (obj.qualitativeRisk) {
                _this.qualitativeRisk = new CodeableConcept(obj.qualitativeRisk);
            }
            if (obj.relativeRisk) {
                _this.relativeRisk = obj.relativeRisk;
            }
            if (obj.when) {
                _this.when = new Element(obj.when);
            }
            if (obj.rationale) {
                _this.rationale = obj.rationale;
            }
        }
        return _this;
    }
    return PredictionComponent;
}(BackboneElement));

var RiskAssessment = (function (_super) {
    __extends(RiskAssessment, _super);
    function RiskAssessment(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'RiskAssessment';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.basedOn) {
                _this.basedOn = new ResourceReference(obj.basedOn);
            }
            if (obj.parent) {
                _this.parent = new ResourceReference(obj.parent);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.condition) {
                _this.condition = new ResourceReference(obj.condition);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
            if (obj.reason) {
                _this.reason = new Element(obj.reason);
            }
            if (obj.basis) {
                _this.basis = [];
                for (var _i = 0, _a = obj.basis || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.basis.push(new ResourceReference(o));
                }
            }
            if (obj.prediction) {
                _this.prediction = [];
                for (var _b = 0, _c = obj.prediction || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.prediction.push(new PredictionComponent(o));
                }
            }
            if (obj.mitigation) {
                _this.mitigation = obj.mitigation;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return RiskAssessment;
}(DomainResource));

var SampledData = (function (_super) {
    __extends(SampledData, _super);
    function SampledData(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.origin) {
                _this.origin = new Quantity(obj.origin);
            }
            if (obj.period) {
                _this.period = obj.period;
            }
            if (obj.factor) {
                _this.factor = obj.factor;
            }
            if (obj.lowerLimit) {
                _this.lowerLimit = obj.lowerLimit;
            }
            if (obj.upperLimit) {
                _this.upperLimit = obj.upperLimit;
            }
            if (obj.dimensions) {
                _this.dimensions = obj.dimensions;
            }
            if (obj.data) {
                _this.data = obj.data;
            }
        }
        return _this;
    }
    return SampledData;
}(Element));

var Schedule = (function (_super) {
    __extends(Schedule, _super);
    function Schedule(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Schedule';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.active) {
                _this.active = obj.active;
            }
            if (obj.serviceCategory) {
                _this.serviceCategory = new CodeableConcept(obj.serviceCategory);
            }
            if (obj.serviceType) {
                _this.serviceType = [];
                for (var _b = 0, _c = obj.serviceType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.serviceType.push(new CodeableConcept(o));
                }
            }
            if (obj.specialty) {
                _this.specialty = [];
                for (var _d = 0, _e = obj.specialty || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialty.push(new CodeableConcept(o));
                }
            }
            if (obj.actor) {
                _this.actor = [];
                for (var _f = 0, _g = obj.actor || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.actor.push(new ResourceReference(o));
                }
            }
            if (obj.planningHorizon) {
                _this.planningHorizon = new Period(obj.planningHorizon);
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return Schedule;
}(DomainResource));

var SearchParameter = (function (_super) {
    __extends(SearchParameter, _super);
    function SearchParameter(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'SearchParameter';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.base) {
                _this.base = obj.base;
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.derivedFrom) {
                _this.derivedFrom = obj.derivedFrom;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.expression) {
                _this.expression = obj.expression;
            }
            if (obj.xpath) {
                _this.xpath = obj.xpath;
            }
            if (obj.xpathUsage) {
                _this.xpathUsage = obj.xpathUsage;
            }
            if (obj.target) {
                _this.target = obj.target;
            }
            if (obj.comparator) {
                _this.comparator = obj.comparator;
            }
            if (obj.modifier) {
                _this.modifier = obj.modifier;
            }
            if (obj.chain) {
                _this.chain = obj.chain;
            }
            if (obj.component) {
                _this.component = [];
                for (var _f = 0, _g = obj.component || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.component.push(new ComponentComponent(o));
                }
            }
        }
        return _this;
    }
    return SearchParameter;
}(DomainResource));

var ReferenceSeqComponent = (function (_super) {
    __extends(ReferenceSeqComponent, _super);
    function ReferenceSeqComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.chromosome) {
                _this.chromosome = new CodeableConcept(obj.chromosome);
            }
            if (obj.genomeBuild) {
                _this.genomeBuild = obj.genomeBuild;
            }
            if (obj.referenceSeqId) {
                _this.referenceSeqId = new CodeableConcept(obj.referenceSeqId);
            }
            if (obj.referenceSeqPointer) {
                _this.referenceSeqPointer = new ResourceReference(obj.referenceSeqPointer);
            }
            if (obj.referenceSeqString) {
                _this.referenceSeqString = obj.referenceSeqString;
            }
            if (obj.strand) {
                _this.strand = obj.strand;
            }
            if (obj.windowStart) {
                _this.windowStart = obj.windowStart;
            }
            if (obj.windowEnd) {
                _this.windowEnd = obj.windowEnd;
            }
        }
        return _this;
    }
    return ReferenceSeqComponent;
}(BackboneElement));

var VariantComponent = (function (_super) {
    __extends(VariantComponent, _super);
    function VariantComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.start) {
                _this.start = obj.start;
            }
            if (obj.end) {
                _this.end = obj.end;
            }
            if (obj.observedAllele) {
                _this.observedAllele = obj.observedAllele;
            }
            if (obj.referenceAllele) {
                _this.referenceAllele = obj.referenceAllele;
            }
            if (obj.cigar) {
                _this.cigar = obj.cigar;
            }
            if (obj.variantPointer) {
                _this.variantPointer = new ResourceReference(obj.variantPointer);
            }
        }
        return _this;
    }
    return VariantComponent;
}(BackboneElement));

var QualityComponent = (function (_super) {
    __extends(QualityComponent, _super);
    function QualityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.standardSequence) {
                _this.standardSequence = new CodeableConcept(obj.standardSequence);
            }
            if (obj.start) {
                _this.start = obj.start;
            }
            if (obj.end) {
                _this.end = obj.end;
            }
            if (obj.score) {
                _this.score = new Quantity(obj.score);
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.truthTP) {
                _this.truthTP = obj.truthTP;
            }
            if (obj.queryTP) {
                _this.queryTP = obj.queryTP;
            }
            if (obj.truthFN) {
                _this.truthFN = obj.truthFN;
            }
            if (obj.queryFP) {
                _this.queryFP = obj.queryFP;
            }
            if (obj.gtFP) {
                _this.gtFP = obj.gtFP;
            }
            if (obj.precision) {
                _this.precision = obj.precision;
            }
            if (obj.recall) {
                _this.recall = obj.recall;
            }
            if (obj.fScore) {
                _this.fScore = obj.fScore;
            }
        }
        return _this;
    }
    return QualityComponent;
}(BackboneElement));

var RepositoryComponent = (function (_super) {
    __extends(RepositoryComponent, _super);
    function RepositoryComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.datasetId) {
                _this.datasetId = obj.datasetId;
            }
            if (obj.variantsetId) {
                _this.variantsetId = obj.variantsetId;
            }
            if (obj.readsetId) {
                _this.readsetId = obj.readsetId;
            }
        }
        return _this;
    }
    return RepositoryComponent;
}(BackboneElement));

var Sequence = (function (_super) {
    __extends(Sequence, _super);
    function Sequence(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Sequence';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.coordinateSystem) {
                _this.coordinateSystem = obj.coordinateSystem;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.specimen) {
                _this.specimen = new ResourceReference(obj.specimen);
            }
            if (obj.device) {
                _this.device = new ResourceReference(obj.device);
            }
            if (obj.performer) {
                _this.performer = new ResourceReference(obj.performer);
            }
            if (obj.quantity) {
                _this.quantity = new Quantity(obj.quantity);
            }
            if (obj.referenceSeq) {
                _this.referenceSeq = new ReferenceSeqComponent(obj.referenceSeq);
            }
            if (obj.variant) {
                _this.variant = [];
                for (var _b = 0, _c = obj.variant || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.variant.push(new VariantComponent(o));
                }
            }
            if (obj.observedSeq) {
                _this.observedSeq = obj.observedSeq;
            }
            if (obj.quality) {
                _this.quality = [];
                for (var _d = 0, _e = obj.quality || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.quality.push(new QualityComponent(o));
                }
            }
            if (obj.readCoverage) {
                _this.readCoverage = obj.readCoverage;
            }
            if (obj.repository) {
                _this.repository = [];
                for (var _f = 0, _g = obj.repository || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.repository.push(new RepositoryComponent(o));
                }
            }
            if (obj.pointer) {
                _this.pointer = [];
                for (var _h = 0, _j = obj.pointer || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.pointer.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return Sequence;
}(DomainResource));

var ServiceDefinition = (function (_super) {
    __extends(ServiceDefinition, _super);
    function ServiceDefinition(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ServiceDefinition';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.usage) {
                _this.usage = obj.usage;
            }
            if (obj.approvalDate) {
                _this.approvalDate = new Date(obj.approvalDate);
            }
            if (obj.lastReviewDate) {
                _this.lastReviewDate = new Date(obj.lastReviewDate);
            }
            if (obj.effectivePeriod) {
                _this.effectivePeriod = new Period(obj.effectivePeriod);
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.topic) {
                _this.topic = [];
                for (var _f = 0, _g = obj.topic || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.topic.push(new CodeableConcept(o));
                }
            }
            if (obj.contributor) {
                _this.contributor = [];
                for (var _h = 0, _j = obj.contributor || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.contributor.push(new Contributor(o));
                }
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _k = 0, _l = obj.contact || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.relatedArtifact) {
                _this.relatedArtifact = [];
                for (var _m = 0, _o = obj.relatedArtifact || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.relatedArtifact.push(new RelatedArtifact(o));
                }
            }
            if (obj.trigger) {
                _this.trigger = [];
                for (var _p = 0, _q = obj.trigger || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.trigger.push(new TriggerDefinition(o));
                }
            }
            if (obj.dataRequirement) {
                _this.dataRequirement = [];
                for (var _r = 0, _s = obj.dataRequirement || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.dataRequirement.push(new DataRequirement(o));
                }
            }
            if (obj.operationDefinition) {
                _this.operationDefinition = new ResourceReference(obj.operationDefinition);
            }
        }
        return _this;
    }
    return ServiceDefinition;
}(DomainResource));

var Slot = (function (_super) {
    __extends(Slot, _super);
    function Slot(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Slot';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.serviceCategory) {
                _this.serviceCategory = new CodeableConcept(obj.serviceCategory);
            }
            if (obj.serviceType) {
                _this.serviceType = [];
                for (var _b = 0, _c = obj.serviceType || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.serviceType.push(new CodeableConcept(o));
                }
            }
            if (obj.specialty) {
                _this.specialty = [];
                for (var _d = 0, _e = obj.specialty || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.specialty.push(new CodeableConcept(o));
                }
            }
            if (obj.appointmentType) {
                _this.appointmentType = new CodeableConcept(obj.appointmentType);
            }
            if (obj.schedule) {
                _this.schedule = new ResourceReference(obj.schedule);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.start) {
                _this.start = new Date(obj.start);
            }
            if (obj.end) {
                _this.end = new Date(obj.end);
            }
            if (obj.overbooked) {
                _this.overbooked = obj.overbooked;
            }
            if (obj.comment) {
                _this.comment = obj.comment;
            }
        }
        return _this;
    }
    return Slot;
}(DomainResource));

var CollectionComponent = (function (_super) {
    __extends(CollectionComponent, _super);
    function CollectionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.collector) {
                _this.collector = new ResourceReference(obj.collector);
            }
            if (obj.collected) {
                _this.collected = new Element(obj.collected);
            }
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.method) {
                _this.method = new CodeableConcept(obj.method);
            }
            if (obj.bodySite) {
                _this.bodySite = new CodeableConcept(obj.bodySite);
            }
        }
        return _this;
    }
    return CollectionComponent;
}(BackboneElement));

var ProcessingComponent = (function (_super) {
    __extends(ProcessingComponent, _super);
    function ProcessingComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.procedure) {
                _this.procedure = new CodeableConcept(obj.procedure);
            }
            if (obj.additive) {
                _this.additive = [];
                for (var _i = 0, _a = obj.additive || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.additive.push(new ResourceReference(o));
                }
            }
            if (obj.time) {
                _this.time = new Element(obj.time);
            }
        }
        return _this;
    }
    return ProcessingComponent;
}(BackboneElement));

var ContainerComponent = (function (_super) {
    __extends(ContainerComponent, _super);
    function ContainerComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.capacity) {
                _this.capacity = new SimpleQuantity(obj.capacity);
            }
            if (obj.specimenQuantity) {
                _this.specimenQuantity = new SimpleQuantity(obj.specimenQuantity);
            }
            if (obj.additive) {
                _this.additive = new Element(obj.additive);
            }
        }
        return _this;
    }
    return ContainerComponent;
}(BackboneElement));

var Specimen = (function (_super) {
    __extends(Specimen, _super);
    function Specimen(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Specimen';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.accessionIdentifier) {
                _this.accessionIdentifier = new Identifier(obj.accessionIdentifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.subject) {
                _this.subject = new ResourceReference(obj.subject);
            }
            if (obj.receivedTime) {
                _this.receivedTime = new Date(obj.receivedTime);
            }
            if (obj.parent) {
                _this.parent = [];
                for (var _b = 0, _c = obj.parent || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.parent.push(new ResourceReference(o));
                }
            }
            if (obj.request) {
                _this.request = [];
                for (var _d = 0, _e = obj.request || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.request.push(new ResourceReference(o));
                }
            }
            if (obj.collection) {
                _this.collection = new CollectionComponent(obj.collection);
            }
            if (obj.processing) {
                _this.processing = [];
                for (var _f = 0, _g = obj.processing || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.processing.push(new ProcessingComponent(o));
                }
            }
            if (obj.container) {
                _this.container = [];
                for (var _h = 0, _j = obj.container || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.container.push(new ContainerComponent(o));
                }
            }
            if (obj.note) {
                _this.note = [];
                for (var _k = 0, _l = obj.note || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return Specimen;
}(DomainResource));

var StructureComponent = (function (_super) {
    __extends(StructureComponent, _super);
    function StructureComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.mode) {
                _this.mode = obj.mode;
            }
            if (obj.alias) {
                _this.alias = obj.alias;
            }
            if (obj.documentation) {
                _this.documentation = obj.documentation;
            }
        }
        return _this;
    }
    return StructureComponent;
}(BackboneElement));

var StructureMap = (function (_super) {
    __extends(StructureMap, _super);
    function StructureMap(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'StructureMap';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _d = 0, _e = obj.useContext || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _f = 0, _g = obj.jurisdiction || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.structure) {
                _this.structure = [];
                for (var _h = 0, _j = obj.structure || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.structure.push(new StructureComponent(o));
                }
            }
            if (obj.import) {
                _this.import = obj.import;
            }
            if (obj.group) {
                _this.group = [];
                for (var _k = 0, _l = obj.group || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.group.push(new GroupComponent(o));
                }
            }
        }
        return _this;
    }
    return StructureMap;
}(DomainResource));

var ChannelComponent = (function (_super) {
    __extends(ChannelComponent, _super);
    function ChannelComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = obj.type;
            }
            if (obj.endpoint) {
                _this.endpoint = obj.endpoint;
            }
            if (obj.payload) {
                _this.payload = obj.payload;
            }
            if (obj.header) {
                _this.header = obj.header;
            }
        }
        return _this;
    }
    return ChannelComponent;
}(BackboneElement));

var Subscription = (function (_super) {
    __extends(Subscription, _super);
    function Subscription(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Subscription';
        if (obj) {
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactPoint(o));
                }
            }
            if (obj.end) {
                _this.end = new Date(obj.end);
            }
            if (obj.reason) {
                _this.reason = obj.reason;
            }
            if (obj.criteria) {
                _this.criteria = obj.criteria;
            }
            if (obj.error) {
                _this.error = obj.error;
            }
            if (obj.channel) {
                _this.channel = new ChannelComponent(obj.channel);
            }
            if (obj.tag) {
                _this.tag = [];
                for (var _b = 0, _c = obj.tag || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.tag.push(new Coding(o));
                }
            }
        }
        return _this;
    }
    return Subscription;
}(DomainResource));

var Substance = (function (_super) {
    __extends(Substance, _super);
    function Substance(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Substance';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = [];
                for (var _b = 0, _c = obj.category || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.category.push(new CodeableConcept(o));
                }
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.instance) {
                _this.instance = [];
                for (var _d = 0, _e = obj.instance || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.instance.push(new InstanceComponent(o));
                }
            }
            if (obj.ingredient) {
                _this.ingredient = [];
                for (var _f = 0, _g = obj.ingredient || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.ingredient.push(new IngredientComponent(o));
                }
            }
        }
        return _this;
    }
    return Substance;
}(DomainResource));

var SuppliedItemComponent = (function (_super) {
    __extends(SuppliedItemComponent, _super);
    function SuppliedItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.quantity) {
                _this.quantity = new SimpleQuantity(obj.quantity);
            }
            if (obj.item) {
                _this.item = new Element(obj.item);
            }
        }
        return _this;
    }
    return SuppliedItemComponent;
}(BackboneElement));

var SupplyDelivery = (function (_super) {
    __extends(SupplyDelivery, _super);
    function SupplyDelivery(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'SupplyDelivery';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _i = 0, _a = obj.basedOn || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _b = 0, _c = obj.partOf || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.suppliedItem) {
                _this.suppliedItem = new SuppliedItemComponent(obj.suppliedItem);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.supplier) {
                _this.supplier = new ResourceReference(obj.supplier);
            }
            if (obj.destination) {
                _this.destination = new ResourceReference(obj.destination);
            }
            if (obj.receiver) {
                _this.receiver = [];
                for (var _d = 0, _e = obj.receiver || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.receiver.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return SupplyDelivery;
}(DomainResource));

var OrderedItemComponent = (function (_super) {
    __extends(OrderedItemComponent, _super);
    function OrderedItemComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.quantity) {
                _this.quantity = new Quantity(obj.quantity);
            }
            if (obj.item) {
                _this.item = new Element(obj.item);
            }
        }
        return _this;
    }
    return OrderedItemComponent;
}(BackboneElement));

var SupplyRequest = (function (_super) {
    __extends(SupplyRequest, _super);
    function SupplyRequest(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'SupplyRequest';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.category) {
                _this.category = new CodeableConcept(obj.category);
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.orderedItem) {
                _this.orderedItem = new OrderedItemComponent(obj.orderedItem);
            }
            if (obj.occurrence) {
                _this.occurrence = new Element(obj.occurrence);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.supplier) {
                _this.supplier = [];
                for (var _i = 0, _a = obj.supplier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.supplier.push(new ResourceReference(o));
                }
            }
            if (obj.reason) {
                _this.reason = new Element(obj.reason);
            }
            if (obj.deliverFrom) {
                _this.deliverFrom = new ResourceReference(obj.deliverFrom);
            }
            if (obj.deliverTo) {
                _this.deliverTo = new ResourceReference(obj.deliverTo);
            }
        }
        return _this;
    }
    return SupplyRequest;
}(DomainResource));

var RestrictionComponent = (function (_super) {
    __extends(RestrictionComponent, _super);
    function RestrictionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.repetitions) {
                _this.repetitions = obj.repetitions;
            }
            if (obj.period) {
                _this.period = new Period(obj.period);
            }
            if (obj.recipient) {
                _this.recipient = [];
                for (var _i = 0, _a = obj.recipient || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.recipient.push(new ResourceReference(o));
                }
            }
        }
        return _this;
    }
    return RestrictionComponent;
}(BackboneElement));

var OutputComponent = (function (_super) {
    __extends(OutputComponent, _super);
    function OutputComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.type) {
                _this.type = new CodeableConcept(obj.type);
            }
            if (obj.value) {
                _this.value = new Element(obj.value);
            }
        }
        return _this;
    }
    return OutputComponent;
}(BackboneElement));

var Task = (function (_super) {
    __extends(Task, _super);
    function Task(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'Task';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.definition) {
                _this.definition = new Element(obj.definition);
            }
            if (obj.basedOn) {
                _this.basedOn = [];
                for (var _b = 0, _c = obj.basedOn || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.basedOn.push(new ResourceReference(o));
                }
            }
            if (obj.groupIdentifier) {
                _this.groupIdentifier = new Identifier(obj.groupIdentifier);
            }
            if (obj.partOf) {
                _this.partOf = [];
                for (var _d = 0, _e = obj.partOf || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.partOf.push(new ResourceReference(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.statusReason) {
                _this.statusReason = new CodeableConcept(obj.statusReason);
            }
            if (obj.businessStatus) {
                _this.businessStatus = new CodeableConcept(obj.businessStatus);
            }
            if (obj.intent) {
                _this.intent = obj.intent;
            }
            if (obj.priority) {
                _this.priority = obj.priority;
            }
            if (obj.code) {
                _this.code = new CodeableConcept(obj.code);
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.focus) {
                _this.focus = new ResourceReference(obj.focus);
            }
            if (obj.for) {
                _this.for = new ResourceReference(obj.for);
            }
            if (obj.context) {
                _this.context = new ResourceReference(obj.context);
            }
            if (obj.executionPeriod) {
                _this.executionPeriod = new Period(obj.executionPeriod);
            }
            if (obj.authoredOn) {
                _this.authoredOn = new Date(obj.authoredOn);
            }
            if (obj.lastModified) {
                _this.lastModified = new Date(obj.lastModified);
            }
            if (obj.requester) {
                _this.requester = new RequesterComponent(obj.requester);
            }
            if (obj.performerType) {
                _this.performerType = [];
                for (var _f = 0, _g = obj.performerType || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.performerType.push(new CodeableConcept(o));
                }
            }
            if (obj.owner) {
                _this.owner = new ResourceReference(obj.owner);
            }
            if (obj.reason) {
                _this.reason = new CodeableConcept(obj.reason);
            }
            if (obj.note) {
                _this.note = [];
                for (var _h = 0, _j = obj.note || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.note.push(new Annotation(o));
                }
            }
            if (obj.relevantHistory) {
                _this.relevantHistory = [];
                for (var _k = 0, _l = obj.relevantHistory || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.relevantHistory.push(new ResourceReference(o));
                }
            }
            if (obj.restriction) {
                _this.restriction = new RestrictionComponent(obj.restriction);
            }
            if (obj.input) {
                _this.input = [];
                for (var _m = 0, _o = obj.input || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.input.push(new ParameterComponent(o));
                }
            }
            if (obj.output) {
                _this.output = [];
                for (var _p = 0, _q = obj.output || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.output.push(new OutputComponent(o));
                }
            }
        }
        return _this;
    }
    return Task;
}(DomainResource));

var ModelInfo = (function () {
    function ModelInfo(obj) {
        if (obj) {
        }
    }
    return ModelInfo;
}());

var AssertComponent = (function (_super) {
    __extends(AssertComponent, _super);
    function AssertComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.result) {
                _this.result = obj.result;
            }
            if (obj.message) {
                _this.message = obj.message;
            }
            if (obj.detail) {
                _this.detail = obj.detail;
            }
        }
        return _this;
    }
    return AssertComponent;
}(BackboneElement));

var SetupActionComponent = (function (_super) {
    __extends(SetupActionComponent, _super);
    function SetupActionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.operation) {
                _this.operation = new OperationComponent(obj.operation);
            }
            if (obj.assert) {
                _this.assert = new AssertComponent(obj.assert);
            }
        }
        return _this;
    }
    return SetupActionComponent;
}(BackboneElement));

var SetupComponent = (function (_super) {
    __extends(SetupComponent, _super);
    function SetupComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.action) {
                _this.action = [];
                for (var _i = 0, _a = obj.action || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.action.push(new SetupActionComponent(o));
                }
            }
        }
        return _this;
    }
    return SetupComponent;
}(BackboneElement));

var TestActionComponent = (function (_super) {
    __extends(TestActionComponent, _super);
    function TestActionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.operation) {
                _this.operation = new OperationComponent(obj.operation);
            }
            if (obj.assert) {
                _this.assert = new AssertComponent(obj.assert);
            }
        }
        return _this;
    }
    return TestActionComponent;
}(BackboneElement));

var TestComponent = (function (_super) {
    __extends(TestComponent, _super);
    function TestComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.action) {
                _this.action = [];
                for (var _i = 0, _a = obj.action || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.action.push(new TestActionComponent(o));
                }
            }
        }
        return _this;
    }
    return TestComponent;
}(BackboneElement));

var TeardownActionComponent = (function (_super) {
    __extends(TeardownActionComponent, _super);
    function TeardownActionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.operation) {
                _this.operation = new OperationComponent(obj.operation);
            }
        }
        return _this;
    }
    return TeardownActionComponent;
}(BackboneElement));

var TeardownComponent = (function (_super) {
    __extends(TeardownComponent, _super);
    function TeardownComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.action) {
                _this.action = [];
                for (var _i = 0, _a = obj.action || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.action.push(new TeardownActionComponent(o));
                }
            }
        }
        return _this;
    }
    return TeardownComponent;
}(BackboneElement));

var TestReport = (function (_super) {
    __extends(TestReport, _super);
    function TestReport(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'TestReport';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.testScript) {
                _this.testScript = new ResourceReference(obj.testScript);
            }
            if (obj.result) {
                _this.result = obj.result;
            }
            if (obj.score) {
                _this.score = obj.score;
            }
            if (obj.tester) {
                _this.tester = obj.tester;
            }
            if (obj.issued) {
                _this.issued = new Date(obj.issued);
            }
            if (obj.participant) {
                _this.participant = [];
                for (var _i = 0, _a = obj.participant || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.participant.push(new ParticipantComponent(o));
                }
            }
            if (obj.setup) {
                _this.setup = new SetupComponent(obj.setup);
            }
            if (obj.test) {
                _this.test = [];
                for (var _b = 0, _c = obj.test || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.test.push(new TestComponent(o));
                }
            }
            if (obj.teardown) {
                _this.teardown = new TeardownComponent(obj.teardown);
            }
        }
        return _this;
    }
    return TestReport;
}(DomainResource));

var OriginComponent = (function (_super) {
    __extends(OriginComponent, _super);
    function OriginComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.index) {
                _this.index = obj.index;
            }
            if (obj.profile) {
                _this.profile = new Coding(obj.profile);
            }
        }
        return _this;
    }
    return OriginComponent;
}(BackboneElement));

var DestinationComponent = (function (_super) {
    __extends(DestinationComponent, _super);
    function DestinationComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.index) {
                _this.index = obj.index;
            }
            if (obj.profile) {
                _this.profile = new Coding(obj.profile);
            }
        }
        return _this;
    }
    return DestinationComponent;
}(BackboneElement));

var CapabilityComponent = (function (_super) {
    __extends(CapabilityComponent, _super);
    function CapabilityComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.required) {
                _this.required = obj.required;
            }
            if (obj.validated) {
                _this.validated = obj.validated;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.origin) {
                _this.origin = obj.origin;
            }
            if (obj.destination) {
                _this.destination = obj.destination;
            }
            if (obj.link) {
                _this.link = obj.link;
            }
            if (obj.capabilities) {
                _this.capabilities = new ResourceReference(obj.capabilities);
            }
        }
        return _this;
    }
    return CapabilityComponent;
}(BackboneElement));

var MetadataComponent = (function (_super) {
    __extends(MetadataComponent, _super);
    function MetadataComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.link) {
                _this.link = [];
                for (var _i = 0, _a = obj.link || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.link.push(new LinkComponent(o));
                }
            }
            if (obj.capability) {
                _this.capability = [];
                for (var _b = 0, _c = obj.capability || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.capability.push(new CapabilityComponent(o));
                }
            }
        }
        return _this;
    }
    return MetadataComponent;
}(BackboneElement));

var FixtureComponent = (function (_super) {
    __extends(FixtureComponent, _super);
    function FixtureComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.autocreate) {
                _this.autocreate = obj.autocreate;
            }
            if (obj.autodelete) {
                _this.autodelete = obj.autodelete;
            }
            if (obj.resource) {
                _this.resource = new ResourceReference(obj.resource);
            }
        }
        return _this;
    }
    return FixtureComponent;
}(BackboneElement));

var VariableComponent = (function (_super) {
    __extends(VariableComponent, _super);
    function VariableComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.defaultValue) {
                _this.defaultValue = obj.defaultValue;
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.expression) {
                _this.expression = obj.expression;
            }
            if (obj.headerField) {
                _this.headerField = obj.headerField;
            }
            if (obj.hint) {
                _this.hint = obj.hint;
            }
            if (obj.path) {
                _this.path = obj.path;
            }
            if (obj.sourceId) {
                _this.sourceId = obj.sourceId;
            }
        }
        return _this;
    }
    return VariableComponent;
}(BackboneElement));

var RuleParamComponent = (function (_super) {
    __extends(RuleParamComponent, _super);
    function RuleParamComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return RuleParamComponent;
}(BackboneElement));

var RuleComponent = (function (_super) {
    __extends(RuleComponent, _super);
    function RuleComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.resource) {
                _this.resource = new ResourceReference(obj.resource);
            }
            if (obj.param) {
                _this.param = [];
                for (var _i = 0, _a = obj.param || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.param.push(new RuleParamComponent(o));
                }
            }
        }
        return _this;
    }
    return RuleComponent;
}(BackboneElement));

var RulesetRuleParamComponent = (function (_super) {
    __extends(RulesetRuleParamComponent, _super);
    function RulesetRuleParamComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.value) {
                _this.value = obj.value;
            }
        }
        return _this;
    }
    return RulesetRuleParamComponent;
}(BackboneElement));

var RulesetRuleComponent = (function (_super) {
    __extends(RulesetRuleComponent, _super);
    function RulesetRuleComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.ruleId) {
                _this.ruleId = obj.ruleId;
            }
            if (obj.param) {
                _this.param = [];
                for (var _i = 0, _a = obj.param || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.param.push(new RulesetRuleParamComponent(o));
                }
            }
        }
        return _this;
    }
    return RulesetRuleComponent;
}(BackboneElement));

var RulesetComponent = (function (_super) {
    __extends(RulesetComponent, _super);
    function RulesetComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.resource) {
                _this.resource = new ResourceReference(obj.resource);
            }
            if (obj.rule) {
                _this.rule = [];
                for (var _i = 0, _a = obj.rule || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.rule.push(new RulesetRuleComponent(o));
                }
            }
        }
        return _this;
    }
    return RulesetComponent;
}(BackboneElement));

var TestScript = (function (_super) {
    __extends(TestScript, _super);
    function TestScript(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'TestScript';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = new Identifier(obj.identifier);
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _i = 0, _a = obj.contact || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _b = 0, _c = obj.useContext || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _d = 0, _e = obj.jurisdiction || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.origin) {
                _this.origin = [];
                for (var _f = 0, _g = obj.origin || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.origin.push(new OriginComponent(o));
                }
            }
            if (obj.destination) {
                _this.destination = [];
                for (var _h = 0, _j = obj.destination || []; _h < _j.length; _h++) {
                    var o = _j[_h];
                    _this.destination.push(new DestinationComponent(o));
                }
            }
            if (obj.metadata) {
                _this.metadata = new MetadataComponent(obj.metadata);
            }
            if (obj.fixture) {
                _this.fixture = [];
                for (var _k = 0, _l = obj.fixture || []; _k < _l.length; _k++) {
                    var o = _l[_k];
                    _this.fixture.push(new FixtureComponent(o));
                }
            }
            if (obj.profile) {
                _this.profile = [];
                for (var _m = 0, _o = obj.profile || []; _m < _o.length; _m++) {
                    var o = _o[_m];
                    _this.profile.push(new ResourceReference(o));
                }
            }
            if (obj.variable) {
                _this.variable = [];
                for (var _p = 0, _q = obj.variable || []; _p < _q.length; _p++) {
                    var o = _q[_p];
                    _this.variable.push(new VariableComponent(o));
                }
            }
            if (obj.rule) {
                _this.rule = [];
                for (var _r = 0, _s = obj.rule || []; _r < _s.length; _r++) {
                    var o = _s[_r];
                    _this.rule.push(new RuleComponent(o));
                }
            }
            if (obj.ruleset) {
                _this.ruleset = [];
                for (var _t = 0, _u = obj.ruleset || []; _t < _u.length; _t++) {
                    var o = _u[_t];
                    _this.ruleset.push(new RulesetComponent(o));
                }
            }
            if (obj.setup) {
                _this.setup = new SetupComponent(obj.setup);
            }
            if (obj.test) {
                _this.test = [];
                for (var _v = 0, _w = obj.test || []; _v < _w.length; _v++) {
                    var o = _w[_v];
                    _this.test.push(new TestComponent(o));
                }
            }
            if (obj.teardown) {
                _this.teardown = new TeardownComponent(obj.teardown);
            }
        }
        return _this;
    }
    return TestScript;
}(DomainResource));

var ConceptReferenceComponent = (function (_super) {
    __extends(ConceptReferenceComponent, _super);
    function ConceptReferenceComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.designation) {
                _this.designation = [];
                for (var _i = 0, _a = obj.designation || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.designation.push(new DesignationComponent(o));
                }
            }
        }
        return _this;
    }
    return ConceptReferenceComponent;
}(BackboneElement));

var ConceptSetComponent = (function (_super) {
    __extends(ConceptSetComponent, _super);
    function ConceptSetComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.concept) {
                _this.concept = [];
                for (var _i = 0, _a = obj.concept || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.concept.push(new ConceptReferenceComponent(o));
                }
            }
            if (obj.filter) {
                _this.filter = [];
                for (var _b = 0, _c = obj.filter || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.filter.push(new FilterComponent(o));
                }
            }
            if (obj.valueSet) {
                _this.valueSet = obj.valueSet;
            }
        }
        return _this;
    }
    return ConceptSetComponent;
}(BackboneElement));

var ComposeComponent = (function (_super) {
    __extends(ComposeComponent, _super);
    function ComposeComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.lockedDate) {
                _this.lockedDate = new Date(obj.lockedDate);
            }
            if (obj.inactive) {
                _this.inactive = obj.inactive;
            }
            if (obj.include) {
                _this.include = [];
                for (var _i = 0, _a = obj.include || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.include.push(new ConceptSetComponent(o));
                }
            }
            if (obj.exclude) {
                _this.exclude = [];
                for (var _b = 0, _c = obj.exclude || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.exclude.push(new ConceptSetComponent(o));
                }
            }
        }
        return _this;
    }
    return ComposeComponent;
}(BackboneElement));

var ContainsComponent = (function (_super) {
    __extends(ContainsComponent, _super);
    function ContainsComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.system) {
                _this.system = obj.system;
            }
            if (obj.abstract) {
                _this.abstract = obj.abstract;
            }
            if (obj.inactive) {
                _this.inactive = obj.inactive;
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.code) {
                _this.code = obj.code;
            }
            if (obj.display) {
                _this.display = obj.display;
            }
            if (obj.designation) {
                _this.designation = [];
                for (var _i = 0, _a = obj.designation || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.designation.push(new DesignationComponent(o));
                }
            }
            if (obj.contains) {
                _this.contains = [];
                for (var _b = 0, _c = obj.contains || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contains.push(new ContainsComponent(o));
                }
            }
        }
        return _this;
    }
    return ContainsComponent;
}(BackboneElement));

var ExpansionComponent = (function (_super) {
    __extends(ExpansionComponent, _super);
    function ExpansionComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.identifier) {
                _this.identifier = obj.identifier;
            }
            if (obj.timestamp) {
                _this.timestamp = new Date(obj.timestamp);
            }
            if (obj.total) {
                _this.total = obj.total;
            }
            if (obj.offset) {
                _this.offset = obj.offset;
            }
            if (obj.parameter) {
                _this.parameter = [];
                for (var _i = 0, _a = obj.parameter || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.parameter.push(new ParameterComponent(o));
                }
            }
            if (obj.contains) {
                _this.contains = [];
                for (var _b = 0, _c = obj.contains || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contains.push(new ContainsComponent(o));
                }
            }
        }
        return _this;
    }
    return ExpansionComponent;
}(BackboneElement));

var ValueSet = (function (_super) {
    __extends(ValueSet, _super);
    function ValueSet(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'ValueSet';
        if (obj) {
            if (obj.url) {
                _this.url = obj.url;
            }
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.version) {
                _this.version = obj.version;
            }
            if (obj.name) {
                _this.name = obj.name;
            }
            if (obj.title) {
                _this.title = obj.title;
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.experimental) {
                _this.experimental = obj.experimental;
            }
            if (obj.date) {
                _this.date = new Date(obj.date);
            }
            if (obj.publisher) {
                _this.publisher = obj.publisher;
            }
            if (obj.contact) {
                _this.contact = [];
                for (var _b = 0, _c = obj.contact || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.contact.push(new ContactDetail(o));
                }
            }
            if (obj.description) {
                _this.description = obj.description;
            }
            if (obj.useContext) {
                _this.useContext = [];
                for (var _d = 0, _e = obj.useContext || []; _d < _e.length; _d++) {
                    var o = _e[_d];
                    _this.useContext.push(new UsageContext(o));
                }
            }
            if (obj.jurisdiction) {
                _this.jurisdiction = [];
                for (var _f = 0, _g = obj.jurisdiction || []; _f < _g.length; _f++) {
                    var o = _g[_f];
                    _this.jurisdiction.push(new CodeableConcept(o));
                }
            }
            if (obj.immutable) {
                _this.immutable = obj.immutable;
            }
            if (obj.purpose) {
                _this.purpose = obj.purpose;
            }
            if (obj.copyright) {
                _this.copyright = obj.copyright;
            }
            if (obj.extensible) {
                _this.extensible = obj.extensible;
            }
            if (obj.compose) {
                _this.compose = new ComposeComponent(obj.compose);
            }
            if (obj.expansion) {
                _this.expansion = new ExpansionComponent(obj.expansion);
            }
        }
        return _this;
    }
    return ValueSet;
}(DomainResource));

var DispenseComponent = (function (_super) {
    __extends(DispenseComponent, _super);
    function DispenseComponent(obj) {
        var _this = _super.call(this, obj) || this;
        if (obj) {
            if (obj.product) {
                _this.product = new CodeableConcept(obj.product);
            }
            if (obj.eye) {
                _this.eye = obj.eye;
            }
            if (obj.sphere) {
                _this.sphere = obj.sphere;
            }
            if (obj.cylinder) {
                _this.cylinder = obj.cylinder;
            }
            if (obj.axis) {
                _this.axis = obj.axis;
            }
            if (obj.prism) {
                _this.prism = obj.prism;
            }
            if (obj.base) {
                _this.base = obj.base;
            }
            if (obj.add) {
                _this.add = obj.add;
            }
            if (obj.power) {
                _this.power = obj.power;
            }
            if (obj.backCurve) {
                _this.backCurve = obj.backCurve;
            }
            if (obj.diameter) {
                _this.diameter = obj.diameter;
            }
            if (obj.duration) {
                _this.duration = new SimpleQuantity(obj.duration);
            }
            if (obj.color) {
                _this.color = obj.color;
            }
            if (obj.brand) {
                _this.brand = obj.brand;
            }
            if (obj.note) {
                _this.note = [];
                for (var _i = 0, _a = obj.note || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.note.push(new Annotation(o));
                }
            }
        }
        return _this;
    }
    return DispenseComponent;
}(BackboneElement));

var VisionPrescription = (function (_super) {
    __extends(VisionPrescription, _super);
    function VisionPrescription(obj) {
        var _this = _super.call(this, obj) || this;
        _this.resourceType = 'VisionPrescription';
        if (obj) {
            if (obj.identifier) {
                _this.identifier = [];
                for (var _i = 0, _a = obj.identifier || []; _i < _a.length; _i++) {
                    var o = _a[_i];
                    _this.identifier.push(new Identifier(o));
                }
            }
            if (obj.status) {
                _this.status = obj.status;
            }
            if (obj.patient) {
                _this.patient = new ResourceReference(obj.patient);
            }
            if (obj.encounter) {
                _this.encounter = new ResourceReference(obj.encounter);
            }
            if (obj.dateWritten) {
                _this.dateWritten = new Date(obj.dateWritten);
            }
            if (obj.prescriber) {
                _this.prescriber = new ResourceReference(obj.prescriber);
            }
            if (obj.reason) {
                _this.reason = new Element(obj.reason);
            }
            if (obj.dispense) {
                _this.dispense = [];
                for (var _b = 0, _c = obj.dispense || []; _b < _c.length; _b++) {
                    var o = _c[_b];
                    _this.dispense.push(new DispenseComponent(o));
                }
            }
        }
        return _this;
    }
    return VisionPrescription;
}(DomainResource));

//# sourceMappingURL=fhir.js.map

/***/ }),

/***/ "./src/app/new-profile/new-profile.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/new-profile/new-profile.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  new-profile works!\n</p>\n"

/***/ }),

/***/ "./src/app/new-profile/new-profile.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewProfileComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NewProfileComponent = (function () {
    function NewProfileComponent() {
    }
    NewProfileComponent.prototype.ngOnInit = function () {
    };
    return NewProfileComponent;
}());
NewProfileComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-new-profile',
        template: __webpack_require__("./src/app/new-profile/new-profile.component.html"),
        styles: [__webpack_require__("./src/app/new-profile/new-profile.component.css")]
    }),
    __metadata("design:paramtypes", [])
], NewProfileComponent);

//# sourceMappingURL=new-profile.component.js.map

/***/ }),

/***/ "./src/app/select-choice-modal/select-choice-modal.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/select-choice-modal/select-choice-modal.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"modal-header\">\n    <h4 class=\"modal-title\">Select Choice</h4>\n    <button type=\"button\" class=\"close\" aria-label=\"Close\" (click)=\"activeModal.dismiss()\">\n        <span aria-hidden=\"true\">&times;</span>\n    </button>\n</div>\n<div class=\"modal-body\" *ngIf=\"element && structureDefinition\">\n    <div class=\"form-group\">\n        <label>Type</label>\n        <select class=\"form-control\" [(ngModel)]=\"selectedType\">\n            <option *ngFor=\"let type of element.element.type\" [ngValue]=\"type.code\">{{type.code}}</option>\n        </select>\n    </div>\n</div>\n<div class=\"modal-footer\">\n    <button type=\"button\" class=\"btn btn-default\" (click)=\"activeModal.close(selectedType)\" [disabled]=\"!selectedType\">OK</button>\n    <button type=\"button\" class=\"btn btn-outline-dark\" (click)=\"activeModal.dismiss()\">Cancel</button>\n</div>\n"

/***/ }),

/***/ "./src/app/select-choice-modal/select-choice-modal.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectChoiceModalComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SelectChoiceModalComponent = (function () {
    function SelectChoiceModalComponent(activeModal) {
        this.activeModal = activeModal;
    }
    SelectChoiceModalComponent.prototype.ngOnInit = function () {
    };
    return SelectChoiceModalComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], SelectChoiceModalComponent.prototype, "element", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Object)
], SelectChoiceModalComponent.prototype, "structureDefinition", void 0);
SelectChoiceModalComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-select-choice-modal',
        template: __webpack_require__("./src/app/select-choice-modal/select-choice-modal.component.html"),
        styles: [__webpack_require__("./src/app/select-choice-modal/select-choice-modal.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__ng_bootstrap_ng_bootstrap__["a" /* NgbActiveModal */]) === "function" && _a || Object])
], SelectChoiceModalComponent);

var _a;
//# sourceMappingURL=select-choice-modal.component.js.map

/***/ }),

/***/ "./src/app/services/auth.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_auth0_js__ = __webpack_require__("./node_modules/auth0-js/src/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_auth0_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_auth0_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__person_service__ = __webpack_require__("./src/app/services/person.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthService = (function () {
    function AuthService(router, personService) {
        this.router = router;
        this.personService = personService;
        this.auth0 = new __WEBPACK_IMPORTED_MODULE_2_auth0_js__["WebAuth"]({
            clientID: 'mpXWwpAOBTt5aUM1SE2q5KuUtr4YvUE9',
            domain: 'trifolia.auth0.com',
            responseType: 'token id_token',
            audience: 'https://trifolia.lantanagroup.com/api',
            redirectUri: 'http://localhost:49366/login',
            scope: 'openid profile name nickname email'
        });
        this.instanceNum = Math.random();
        this.authExpiresAt = JSON.parse(localStorage.getItem('expires_at'));
        this.authChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
    }
    AuthService.prototype.login = function () {
        this.auth0.authorize();
    };
    AuthService.prototype.handleAuthentication = function () {
        var _this = this;
        this.auth0.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                window.location.hash = '';
                _this.setSession(authResult);
                _this.getProfile(function () {
                    _this.router.navigate(['/home']);
                    _this.authChanged.emit();
                });
            }
            else if (err) {
                _this.router.navigate(['/home']);
                console.log(err);
            }
        });
    };
    AuthService.prototype.logout = function () {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.userProfile = null;
        this.person = null;
        this.authExpiresAt = null;
        // Go back to the home route
        this.router.navigate(['/']);
        this.authChanged.emit();
    };
    AuthService.prototype.isAuthenticated = function () {
        return new Date().getTime() < this.authExpiresAt;
    };
    AuthService.prototype.getProfile = function (cb) {
        var _this = this;
        var accessToken = localStorage.getItem('token');
        if (!accessToken) {
            throw new Error('Access token must exist to fetch profile');
        }
        var self = this;
        this.auth0.client.userInfo(accessToken, function (userInfoErr, userProfile) {
            if (userInfoErr) {
                return cb(userInfoErr);
            }
            if (userProfile) {
                self.userProfile = userProfile;
                _this.personService.getMe()
                    .subscribe(function (person) {
                    self.person = person;
                    cb(null, userProfile, person);
                    self.authChanged.emit();
                }, function (personErr) {
                    console.log(personErr);
                    cb(personErr);
                });
            }
        });
    };
    AuthService.prototype.setSession = function (authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        this.authExpiresAt = JSON.parse(expiresAt);
    };
    return AuthService;
}());
AuthService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__person_service__["a" /* PersonService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__person_service__["a" /* PersonService */]) === "function" && _b || Object])
], AuthService);

var _a, _b;
//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ "./src/app/services/config.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/@angular/common/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ConfigService = (function () {
    function ConfigService(http) {
        var _this = this;
        this.http = http;
        this.fhirServerChanged = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["EventEmitter"]();
        this.fhirServer = localStorage.getItem('fhirServer');
        this.http.get('/api/config')
            .map(function (res) { return res; })
            .subscribe(function (config) {
            _this.config = config;
            if (!_this.fhirServer) {
                _this.changeFhirServer(_this.config.fhirServers[0].id);
            }
        });
    }
    ConfigService.prototype.changeFhirServer = function (fhirServer) {
        var _this = this;
        this.fhirServer = fhirServer;
        localStorage.setItem('fhirServer', this.fhirServer);
        this.http.get('/api/config/fhir')
            .subscribe(function (res) {
            _this.fhirConformance = res;
            _this.fhirServerChanged.emit(_this.fhirServer);
        }, function (error) {
        });
    };
    ConfigService.prototype.setStatusMessage = function (message, timeout) {
        var _this = this;
        this.statusMessage = message;
        if (timeout) {
            setTimeout(function () { _this.statusMessage = ''; }, timeout);
        }
    };
    return ConfigService;
}());
ConfigService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], ConfigService);

var _a;
//# sourceMappingURL=config.service.js.map

/***/ }),

/***/ "./src/app/services/implementation-guide.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImplementationGuideService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/@angular/common/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ImplementationGuideService = (function () {
    function ImplementationGuideService(http) {
        this.http = http;
    }
    /*
    private _serverError(err: any) {
        console.log('sever error:', err);  // debug
        if (err instanceof Response) {
            return Observable.throw(err.json().error || 'backend server error');
            // if you're using lite-server, use the following line
            // instead of the line above:
            //return Observable.throw(err.text() || 'backend server error');
        }
        return Observable.throw(err || 'backend server error');
    }
    */
    ImplementationGuideService.prototype.getImplementationGuides = function (query) {
        return this.http.get('/api/implementationGuide');
        //.catch(this._serverError);
    };
    return ImplementationGuideService;
}());
ImplementationGuideService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], ImplementationGuideService);

var _a;
//# sourceMappingURL=implementation-guide.service.js.map

/***/ }),

/***/ "./src/app/services/person.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PersonService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_fhir__ = __webpack_require__("./src/app/models/fhir.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/@angular/common/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PersonService = (function () {
    function PersonService(http) {
        this.http = http;
    }
    PersonService.prototype.getMe = function (shouldCreate) {
        if (shouldCreate === void 0) { shouldCreate = false; }
        return this.http.get('/api/person/me?shouldCreate=' + shouldCreate)
            .map(function (personObj) { return new __WEBPACK_IMPORTED_MODULE_1__models_fhir__["b" /* Person */](personObj); });
    };
    PersonService.prototype.updateMe = function (person) {
        return this.http.put('/api/person/me', person);
    };
    return PersonService;
}());
PersonService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], PersonService);

var _a;
//# sourceMappingURL=person.service.js.map

/***/ }),

/***/ "./src/app/services/structure-definition.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StructureDefinitionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__("./node_modules/rxjs/_esm5/add/operator/map.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__("./node_modules/@angular/common/@angular/common/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StructureDefinitionService = (function () {
    function StructureDefinitionService(http) {
        this.http = http;
    }
    StructureDefinitionService.prototype.getStructureDefinitions = function () {
        return this.http.get('/api/structureDefinition')
            .map(function (res) {
            return res;
        });
    };
    StructureDefinitionService.prototype.getStructureDefinition = function (id) {
        return this.http.get('/api/structureDefinition/' + id);
    };
    StructureDefinitionService.prototype.getBaseStructureDefinition = function (resourceType) {
        return this.http.get('/api/structureDefinition/base/' + resourceType);
    };
    return StructureDefinitionService;
}());
StructureDefinitionService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClient */]) === "function" && _a || Object])
], StructureDefinitionService);

var _a;
//# sourceMappingURL=structure-definition.service.js.map

/***/ }),

/***/ "./src/app/structure-definition/structure-definition.component.css":
/***/ (function(module, exports) {

module.exports = "tr.selected > td {\r\n    border-top: 2px solid black;\r\n    border-bottom: 2px solid black;\r\n}\r\n\r\ntr.selected > td:first-child {\r\n    border-left: 2px solid black;\r\n}\r\n\r\ntr.selected > td:last-child {\r\n    border-right: 2px solid black;\r\n}\r\n\r\n.element-definition .card-body {\r\n    padding: 0px;\r\n    margin-top: -1px;\r\n}\r\n\r\ntr.constrained {\r\n    font-weight: bold;\r\n}\r\n\r\n.sd-main:not(.small) {\r\n    width: 100%;\r\n}\r\n\r\n.sd-main.small {\r\n    width: 75%;\r\n    display: inline-table;\r\n    padding-right: 10px;\r\n}\r\n\r\n.selected-element {\r\n    width: 25%;\r\n    position: fixed;\r\n    right: 29px;\r\n    top: 88px;\r\n}\r\n\r\n.selected-element {\r\n    overflow-y: auto;\r\n    max-height: 85%;\r\n}"

/***/ }),

/***/ "./src/app/structure-definition/structure-definition.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Structure Definition</h1>\r\n<div class=\"sd-main\" *ngIf=\"structureDefinition\" [class.small]=\"!!selectedElement\">\r\n    <h2>{{structureDefinition.name || 'No name'}}</h2>\r\n\r\n    <ngb-tabset (tabChange)=\"beforeTabChange($event)\">\r\n        <ngb-tab id=\"general\" title=\"General\">\r\n            <ng-template ngbTabContent>\r\n                <fieldset>\r\n                    <div class=\"row\">\r\n                        <div class=\"col-md-6\">\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    URL\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.url']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [(ngModel)]=\"structureDefinition.url\" />\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    Name\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.name']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [(ngModel)]=\"structureDefinition.name\" />\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('title')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'title', '')\" />\r\n                                    Title\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.title']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [disabled]=\"!structureDefinition.hasOwnProperty('title')\" [(ngModel)]=\"structureDefinition.title\" />\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('description')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'description', '')\" />\r\n                                    Description\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.description']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <app-markdown [(ngModel)]=\"structureDefinition.description\"></app-markdown>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"col-md-3\">\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    ID\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['resource.id']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [(ngModel)]=\"structureDefinition.id\" />\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('version')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'version', '')\" />\r\n                                    Version\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.version']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [disabled]=\"!structureDefinition.hasOwnProperty('version')\" [(ngModel)]=\"structureDefinition.version\" />\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('publisher')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'publisher', '')\" />\r\n                                    Publisher\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.publisher']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"text\" class=\"form-control\" [disabled]=\"!structureDefinition.hasOwnProperty('publisher')\" [(ngModel)]=\"structureDefinition.publisher\" />\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"col-md-3\">\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    Status\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.status']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <select class=\"form-control\" [(ngModel)]=\"structureDefinition.status\">\r\n                                    <option>draft</option>\r\n                                    <option>active</option>\r\n                                    <option>retired</option>\r\n                                    <option>unknown</option>\r\n                                </select>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('experimental')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'experimental', false)\" />\r\n                                    Experimental\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.experimental']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <select class=\"form-control\" [disabled]=\"!structureDefinition.hasOwnProperty('experimental')\" [(ngModel)]=\"structureDefinition.experimental\">\r\n                                    <option [ngValue]=\"false\">No</option>\r\n                                    <option [ngValue]=\"true\">Yes</option>\r\n                                </select>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label>\r\n                                    <input type=\"checkbox\" [ngModel]=\"structureDefinition.hasOwnProperty('date')\" (ngModelChange)=\"globals.toggleProperty(structureDefinition, 'date', false)\" />\r\n                                    Date\r\n                                    <i class=\"fa fa-question\" ngbTooltip=\"{{globals.tooltips['sd.date']}}\" placement=\"top\"></i>\r\n                                </label>\r\n                                <input type=\"date\" class=\"form-control\" [disabled]=\"!structureDefinition.hasOwnProperty('date')\" [(ngModel)]=\"structureDefinition.date\" />\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </fieldset>\r\n            </ng-template>\r\n        </ngb-tab>\r\n        <ngb-tab id=\"elements\" title=\"Elements\">\r\n            <ng-template ngbTabContent>\r\n                <table class=\"table table-striped\">\r\n                    <thead>\r\n                    <tr>\r\n                        <th>Element/Attribute</th>\r\n                        <th>Type</th>\r\n                        <th>Cardinality</th>\r\n                        <th>Binding</th>\r\n                        <th></th>\r\n                    </tr>\r\n                    </thead>\r\n                    <tbody>\r\n                    <tr class=\"clickable\" *ngFor=\"let e of elements\" (click)=\"toggleSelectedElement(e)\" [class.selected]=\"selectedElement === e\" [class.constrained]=\"!!e.constrainedElement\">\r\n                        <td>\r\n                            <span style=\"white-space: pre;\">{{e.tabs}}</span>\r\n                            <i class=\"fa\" [class.fa-plus]=\"!e.expanded\" [class.fa-minus]=\"e.expanded\" *ngIf=\"e.hasChildren\" (click)=\"toggleElementExpand(e)\"></i>\r\n                            <span>{{e.id}}</span>\r\n                            <i class=\"fa fa-edit\" *ngIf=\"e.id.endsWith('[x]')\" (click)=\"selectChoice(e)\" title=\"Select choice type\"></i>\r\n                        </td>\r\n                        <td>{{getTypeDisplay(e)}}</td>\r\n                        <td>{{e.min}}..{{e.max}}</td>\r\n                        <td>{{e.binding}}</td>\r\n                        <td>\r\n                            <div class=\"pull-right\">\r\n                                <i class=\"fa fa-remove\"></i>\r\n                            </div>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n            </ng-template>\r\n        </ngb-tab>\r\n        <ngb-tab id=\"json\" title=\"JSON\">\r\n            <ng-template ngbTabContent>\r\n                <t-json-viewer [json]=\"structureDefinition\"></t-json-viewer>\r\n            </ng-template>\r\n        </ngb-tab>\r\n    </ngb-tabset>\r\n</div>\r\n\r\n<div class=\"selected-element\" *ngIf=\"selectedElement\">\r\n    <div class=\"element-definition card\">\r\n        <div class=\"card-header\">\r\n            Element Definition\r\n\r\n            <div class=\"btn-group pull-right\">\r\n                <button type=\"button\" class=\"btn btn-default\" title=\"Constrain this element\" (click)=\"constrainElement(selectedElement)\" [disabled]=\"selectedElement.constrainedElement\"><i class=\"fa fa-edit\"></i></button>\r\n                <button type=\"button\" class=\"btn btn-default\" title=\"Slice this element\" (click)=\"sliceElement(selectedElement)\" [disabled]=\"!selectedElement.constrainedElement && cardinalityAllowsMultiple(selectedElement.baseElement.max)\"><i class=\"fa fa-copy\"></i></button>\r\n                <button type=\"button\" class=\"btn btn-default\" title=\"Remove this element\" (click)=\"removeElement(selectedElement)\" [disabled]=\"!selectedElement.constrainedElement\"><i class=\"fa fa-remove\"></i></button>\r\n            </div>\r\n        </div>\r\n        <div class=\"card-body\">\r\n            <app-element-definition-panel *ngIf=\"selectedElement.constrainedElement\" [elementTreeModel]=\"selectedElement\" [disabled]=\"false\"></app-element-definition-panel>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<footer class=\"footer\">\r\n    <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\">Save</button>\r\n    <span class=\"message\">{{message}}</span>\r\n</footer>"

/***/ }),

/***/ "./src/app/structure-definition/structure-definition.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StructureDefinitionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_structure_definition_service__ = __webpack_require__("./src/app/services/structure-definition.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_config_service__ = __webpack_require__("./src/app/services/config.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore__ = __webpack_require__("./node_modules/underscore/underscore.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__ = __webpack_require__("./node_modules/@ng-bootstrap/ng-bootstrap/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__select_choice_modal_select_choice_modal_component__ = __webpack_require__("./src/app/select-choice-modal/select-choice-modal.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__globals__ = __webpack_require__("./src/app/globals.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_element_tree_model__ = __webpack_require__("./src/app/models/element-tree-model.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var StructureDefinitionComponent = (function () {
    function StructureDefinitionComponent(route, strucDefService, configService, modalService, globals) {
        this.route = route;
        this.strucDefService = strucDefService;
        this.configService = configService;
        this.modalService = modalService;
        this.globals = globals;
        this.elements = [];
    }
    StructureDefinitionComponent.prototype.toggleSelectedElement = function (element) {
        if (!element || this.selectedElement === element) {
            this.selectedElement = null;
        }
        else {
            this.selectedElement = element;
        }
    };
    StructureDefinitionComponent.prototype.beforeTabChange = function (event) {
        if (event.nextId !== 'elements') {
            this.selectedElement = null;
        }
    };
    StructureDefinitionComponent.prototype.toggleElementExpand = function (target) {
        if (target.expanded) {
            // TODO: Account for expanding/collapsing slices
            var filtered = __WEBPACK_IMPORTED_MODULE_4_underscore__["filter"](this.elements, function (element) {
                return element.baseElement.path.startsWith(target.baseElement.path + '.');
            });
            for (var i = filtered.length - 1; i >= 0; i--) {
                var index = this.elements.indexOf(filtered[i]);
                this.elements.splice(index, 1);
            }
            target.expanded = false;
        }
        else {
            this.populateBaseElements(target);
            target.expanded = true;
        }
    };
    StructureDefinitionComponent.prototype.selectChoice = function (element) {
        var modalRef = this.modalService.open(__WEBPACK_IMPORTED_MODULE_6__select_choice_modal_select_choice_modal_component__["a" /* SelectChoiceModalComponent */]);
        modalRef.componentInstance.structureDefinition = this.baseStructureDefinition;
        modalRef.componentInstance.element = element;
        modalRef.result.then(function (selectedType) {
        });
    };
    StructureDefinitionComponent.prototype.populateElement = function (element) {
        return [element];
    };
    StructureDefinitionComponent.prototype.populateConstrainedElements = function (elementTreeModels) {
        var _loop_1 = function (i) {
            var elementTreeModel = elementTreeModels[i];
            var constrainedElements = __WEBPACK_IMPORTED_MODULE_4_underscore__["filter"](this_1.structureDefinition.differential.element, function (diffElement) {
                return diffElement.path === elementTreeModel.baseElement.path;
            });
            for (var x = 0; x < constrainedElements.length; x++) {
                var newElementTreeModel = elementTreeModel;
                if (x > 0) {
                    newElementTreeModel = new __WEBPACK_IMPORTED_MODULE_8__models_element_tree_model__["a" /* ElementTreeModel */]();
                    Object.assign(newElementTreeModel, elementTreeModel);
                    elementTreeModels.splice(i + x, 0, newElementTreeModel);
                }
                newElementTreeModel.constrainedElement = constrainedElements[x];
            }
        };
        var this_1 = this;
        for (var i = 0; i < elementTreeModels.length; i++) {
            _loop_1(i);
        }
    };
    StructureDefinitionComponent.prototype.populateBaseElements = function (parent) {
        var _this = this;
        // If no parent, then asking to populate the top-level, which is only
        // performed during a refresh
        if (!parent) {
            this.elements = [];
        }
        var nextIndex = parent ? this.elements.indexOf(parent) + 1 : 0;
        var parentPath = parent ? parent.baseElement.path : '';
        var filtered;
        if (parent && parent.baseElement.path.endsWith('[x]')) {
            // this is a choice element, the child elements are the types of the choice
            filtered = __WEBPACK_IMPORTED_MODULE_4_underscore__["map"](parent.baseElement.type, function (type) {
                return {
                    path: parent.baseElement.path.substring(0, parent.baseElement.path.lastIndexOf('[x]')) + type.code
                };
            });
        }
        else {
            // this is not a choice element, just need to find the children of the parent
            filtered = __WEBPACK_IMPORTED_MODULE_4_underscore__["filter"](this.baseStructureDefinition.snapshot.element, function (baseElement) {
                if (parentPath) {
                    return baseElement.path.startsWith(parentPath + '.') &&
                        baseElement.path.split('.').length === (parentPath.split('.').length + 1);
                }
                else {
                    return baseElement.path === _this.structureDefinition.type;
                }
            });
        }
        var _loop_2 = function (i) {
            var depth = parent ? parent.depth + 1 : 1;
            var hasChildren = __WEBPACK_IMPORTED_MODULE_4_underscore__["filter"](this_2.baseStructureDefinition.snapshot.element, function (element) {
                return element.path.startsWith(filtered[i].path + '.') &&
                    element.path.split('.').length === (filtered[i].path.split('.').length + 1);
            }).length > 0;
            var newElement = new __WEBPACK_IMPORTED_MODULE_8__models_element_tree_model__["a" /* ElementTreeModel */]();
            newElement.setFields(filtered[i], parent ? parent.depth + 1 : 1, hasChildren);
            var newElements = this_2.populateElement(newElement);
            this_2.populateConstrainedElements(newElements);
            for (var x = 0; x < newElements.length; x++) {
                this_2.elements.splice(nextIndex, 0, newElements[x]);
                nextIndex++;
            }
        };
        var this_2 = this;
        for (var i = 0; i < filtered.length; i++) {
            _loop_2(i);
        }
        if (parentPath === '' && this.elements.length === 1) {
            this.toggleElementExpand(this.elements[0]);
        }
    };
    StructureDefinitionComponent.prototype.getTypeDisplay = function (element) {
        if (!element.baseElement.type) {
            return '';
        }
        return __WEBPACK_IMPORTED_MODULE_4_underscore__["map"](element.baseElement.type, function (type) {
            return type.code;
        }).join(', ');
    };
    StructureDefinitionComponent.prototype.getStructureDefinition = function () {
        var _this = this;
        var strucDefId = this.route.snapshot.paramMap.get('id');
        this.configService.setStatusMessage('Loading structure definition');
        this.structureDefinition = null;
        this.elements = [];
        this.strucDefService.getStructureDefinition(strucDefId)
            .mergeMap(function (structureDefinition) {
            _this.structureDefinition = structureDefinition;
            _this.configService.setStatusMessage('Loading base structure definition');
            return _this.strucDefService.getBaseStructureDefinition(structureDefinition.type);
        })
            .subscribe(function (baseStructureDefinition) {
            _this.baseStructureDefinition = baseStructureDefinition;
            _this.populateBaseElements();
            _this.configService.setStatusMessage('');
        }, function (error) {
            _this.configService.setStatusMessage('Error loading structure definitions: ' + error);
        });
    };
    StructureDefinitionComponent.prototype.constrainElement = function (element) {
    };
    StructureDefinitionComponent.prototype.sliceElement = function (element) {
    };
    StructureDefinitionComponent.prototype.removeElement = function (element) {
    };
    StructureDefinitionComponent.prototype.cardinalityAllowsMultiple = function (max) {
        return max !== '0' && max !== '1';
    };
    StructureDefinitionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getStructureDefinition();
        this.configService.fhirServerChanged.subscribe(function (fhirServer) { return _this.getStructureDefinition(); });
    };
    StructureDefinitionComponent.prototype.save = function () {
    };
    return StructureDefinitionComponent;
}());
StructureDefinitionComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-profile',
        template: __webpack_require__("./src/app/structure-definition/structure-definition.component.html"),
        styles: [__webpack_require__("./src/app/structure-definition/structure-definition.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_2__services_structure_definition_service__["a" /* StructureDefinitionService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_structure_definition_service__["a" /* StructureDefinitionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_structure_definition_service__["a" /* StructureDefinitionService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__services_config_service__["a" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__services_config_service__["a" /* ConfigService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__ng_bootstrap_ng_bootstrap__["b" /* NgbModal */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_7__globals__["a" /* Globals */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__globals__["a" /* Globals */]) === "function" && _e || Object])
], StructureDefinitionComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=structure-definition.component.js.map

/***/ }),

/***/ "./src/app/structure-definitions/structure-definitions.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/structure-definitions/structure-definitions.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Structure Definitions</h1>\r\n\r\n<table class=\"table table-striped\">\r\n  <thead>\r\n    <tr>\r\n      <th>Name</th>\r\n      <th>Experimental</th>\r\n      <th>Description</th>\r\n      <th>\r\n        <div class=\"pull-right\">\r\n          <a class=\"btn btn-default\" routerLink=\"/structure-definition/new\">Add</a>\r\n        </div>\r\n      </th>\r\n    </tr>\r\n  </thead>\r\n  <tbody>\r\n    <tr *ngFor=\"let p of structureDefinitions\">\r\n      <td>{{p.name}} <span class=\"badge\">{{p.id}}</span></td>\r\n      <td>{{p.experimental ? \"Yes\" : \"No\"}}</td>\r\n      <td>{{p.description}}</td>\r\n      <td>\r\n        <div class=\"pull-right\">\r\n          <a class=\"btn btn-default\" [routerLink]=\"['/structure-definition', p.id]\">Edit</a>\r\n          <button type=\"button\" class=\"btn btn-default\" (click)=\"delete(p.id)\">Delete</button>\r\n        </div>\r\n      </td>\r\n    </tr>\r\n  </tbody>\r\n</table>\r\n"

/***/ }),

/***/ "./src/app/structure-definitions/structure-definitions.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StructureDefinitionsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_structure_definition_service__ = __webpack_require__("./src/app/services/structure-definition.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_config_service__ = __webpack_require__("./src/app/services/config.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StructureDefinitionsComponent = (function () {
    function StructureDefinitionsComponent(structureDefinitionService, configService) {
        this.structureDefinitionService = structureDefinitionService;
        this.configService = configService;
    }
    StructureDefinitionsComponent.prototype.delete = function (profileId) {
    };
    StructureDefinitionsComponent.prototype.getStructureDefinitions = function () {
        var _this = this;
        this.structureDefinitions = [];
        this.configService.setStatusMessage('Loading structure definitions');
        this.structureDefinitionService.getStructureDefinitions()
            .subscribe(function (structureDefinitions) {
            _this.structureDefinitions = structureDefinitions;
            _this.configService.setStatusMessage('');
        }, function (error) {
            _this.configService.setStatusMessage('Error loading structure definitions: ' + error);
        });
    };
    StructureDefinitionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.getStructureDefinitions();
        this.configService.fhirServerChanged.subscribe(function (fhirServer) { return _this.getStructureDefinitions(); });
    };
    return StructureDefinitionsComponent;
}());
StructureDefinitionsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-profiles',
        template: __webpack_require__("./src/app/structure-definitions/structure-definitions.component.html"),
        styles: [__webpack_require__("./src/app/structure-definitions/structure-definitions.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_structure_definition_service__["a" /* StructureDefinitionService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_structure_definition_service__["a" /* StructureDefinitionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_structure_definition_service__["a" /* StructureDefinitionService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__services_config_service__["a" /* ConfigService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__services_config_service__["a" /* ConfigService */]) === "function" && _b || Object])
], StructureDefinitionsComponent);

var _a, _b;
//# sourceMappingURL=structure-definitions.component.js.map

/***/ }),

/***/ "./src/app/user/user.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/user/user.component.html":
/***/ (function(module, exports) {

module.exports = "<h1>Edit User/Person</h1>\r\n\r\n<fhir-edit-human-names *ngIf=\"person\" [parent]=\"person\" property=\"name\"></fhir-edit-human-names>\r\n\r\n<footer class=\"footer\">\r\n  <button type=\"button\" class=\"btn btn-default\" (click)=\"save()\">Save</button>\r\n  <span class=\"message\">{{message}}</span>\r\n</footer>\r\n"

/***/ }),

/***/ "./src/app/user/user.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__services_person_service__ = __webpack_require__("./src/app/services/person.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var UserComponent = (function () {
    function UserComponent(personService) {
        this.personService = personService;
    }
    UserComponent.prototype.save = function () {
        var _this = this;
        this.message = 'Saving person...';
        this.personService.updateMe(this.person)
            .subscribe(function () {
            _this.message = 'Successfully saved person';
        }, function (err) {
            _this.message = 'Error saving person: ' + err;
        });
    };
    UserComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.personService.getMe()
            .subscribe(function (person) {
            _this.person = person;
        }, function (err) {
            console.log(err);
            // todo: handle
        });
    };
    return UserComponent;
}());
UserComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-user',
        template: __webpack_require__("./src/app/user/user.component.html"),
        styles: [__webpack_require__("./src/app/user/user.component.css")],
        providers: [__WEBPACK_IMPORTED_MODULE_1__services_person_service__["a" /* PersonService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__services_person_service__["a" /* PersonService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__services_person_service__["a" /* PersonService */]) === "function" && _a || Object])
], UserComponent);

var _a;
//# sourceMappingURL=user.component.js.map

/***/ }),

/***/ "./src/app/users/users.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/users/users.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  users works!\n</p>\n"

/***/ }),

/***/ "./src/app/users/users.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsersComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var UsersComponent = (function () {
    function UsersComponent() {
    }
    UsersComponent.prototype.ngOnInit = function () {
    };
    return UsersComponent;
}());
UsersComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-users',
        template: __webpack_require__("./src/app/users/users.component.html"),
        styles: [__webpack_require__("./src/app/users/users.component.css")]
    }),
    __metadata("design:paramtypes", [])
], UsersComponent);

//# sourceMappingURL=users.component.js.map

/***/ }),

/***/ "./src/app/valueset/valueset.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/valueset/valueset.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  valueset works!\n</p>\n"

/***/ }),

/***/ "./src/app/valueset/valueset.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValuesetComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ValuesetComponent = (function () {
    function ValuesetComponent() {
    }
    ValuesetComponent.prototype.ngOnInit = function () {
    };
    return ValuesetComponent;
}());
ValuesetComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-valueset',
        template: __webpack_require__("./src/app/valueset/valueset.component.html"),
        styles: [__webpack_require__("./src/app/valueset/valueset.component.css")]
    }),
    __metadata("design:paramtypes", [])
], ValuesetComponent);

//# sourceMappingURL=valueset.component.js.map

/***/ }),

/***/ "./src/app/valuesets/valuesets.component.css":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/valuesets/valuesets.component.html":
/***/ (function(module, exports) {

module.exports = "<p>\n  valuesets works!\n</p>\n"

/***/ }),

/***/ "./src/app/valuesets/valuesets.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ValuesetsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ValuesetsComponent = (function () {
    function ValuesetsComponent() {
    }
    ValuesetsComponent.prototype.ngOnInit = function () {
    };
    return ValuesetsComponent;
}());
ValuesetsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-valuesets',
        template: __webpack_require__("./src/app/valuesets/valuesets.component.html"),
        styles: [__webpack_require__("./src/app/valuesets/valuesets.component.css")]
    }),
    __metadata("design:paramtypes", [])
], ValuesetsComponent);

//# sourceMappingURL=valuesets.component.js.map

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map