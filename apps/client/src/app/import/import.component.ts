import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ImportService, VSACImportCriteria } from '../shared/import.service';
import { Bundle, DomainResource, EntryComponent, IssueComponent, Media as STU3Media, OperationOutcome, RequestComponent } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { NgbModal, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { FhirService } from '../shared/fhir.service';
import { CookieService } from 'ngx-cookie-service';
import { ContentModel, GithubService } from '../shared/github.service';
import { ImportGithubPanelComponent } from './import-github-panel/import-github-panel.component';
import { forkJoin, zip } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { getErrorString } from '../../../../../libs/tof-lib/src/lib/helper';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { ConfigService } from '../shared/config.service';
import { Media as R4Media } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import type { IDomainResource } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { UpdateDiffComponent } from './update-diff/update-diff.component';
import { ConformanceService } from '../shared/conformance.service';
import { IConformance, IExample, IProjectResource } from '@trifolia-fhir/models';
import { ExamplesService } from '../shared/examples.service';

const validExtensions = ['.xml', '.json', '.xlsx', '.jpg', '.gif', '.png', '.bmp', '.svg'];

enum ContentTypes {
  Json = 0,
  Xml = 1,
  Xlsx = 2,
  Image = 3
}

class ImportFileModel {
  public name: string;
  public contentType: ContentTypes = ContentTypes.Json;
  public isExample: boolean = false;
  public content: string | Uint8Array;
  public resource?: DomainResource;
  public vsBundle?: Bundle;
  public message: string;
  public status: 'add' | 'update' | 'unauthorized' | 'pending' | 'unknown' = 'pending';
  public existingResource?: IProjectResource;
  public bundleOperation: 'store' | 'execute';
  public singleIg = true;
  public multipleIgMessage: "";
}

class GitHubImportContent {
  content: ContentModel;
  resource?: DomainResource;
  message?: string;
}

@Component({
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit {
  public textContentType = ContentTypes.Json;
  public textContent: string;
  public files: ImportFileModel[] = [];
  public outcome: OperationOutcome;
  public importBundle: Bundle;
  public resultsBundle: Bundle;
  public message: string;
  public errorMessage: string = '';
  public activeTab = 'file';
  public vsacCriteria = new VSACImportCriteria();
  public rememberVsacCredentials: boolean;
  public applyContextPermissions = true;
  public Globals = Globals;
  public implementationGuideId: string;

  private readonly vsacPasswordCookieKey = 'vsac_password';

  @ViewChild('importGithubPanel')
  private importGithubPanel: ImportGithubPanelComponent;

  constructor(
    public fhirService: FhirService,
    public configService: ConfigService,
    private httpClient: HttpClient,
    private importService: ImportService,
    private conformanceService: ConformanceService,
    private examplesService: ExamplesService,
    private cdr: ChangeDetectorRef,
    private cookieService: CookieService,
    public githubService: GithubService,
    public modalService: NgbModal) {

    const vsacPassword = this.cookieService.get(this.vsacPasswordCookieKey);

    if (vsacPassword) {
      this.vsacCriteria.password = atob(vsacPassword);
      this.rememberVsacCredentials = true;
    }
  }

  viewUpdateDiff(fileModel: ImportFileModel) {
    const modalRef = this.modalService.open(UpdateDiffComponent, { backdrop: 'static', size: 'lg' });
    if (fileModel.isExample) {
      modalRef.componentInstance.importResource = fileModel.resource;
      modalRef.componentInstance.existingResource = (<IExample>fileModel.existingResource).content;
    }
    else {
      modalRef.componentInstance.importResource = fileModel.resource;
      modalRef.componentInstance.existingResource = (<IConformance>fileModel.existingResource).resource;
    }
  }

  private createMedia(name: string, contentType: string, buffer: ArrayBuffer) {
    const b64content = btoa(new Uint8Array(buffer)
      .reduce((data, byte) => data + String.fromCharCode(byte), ''));

    if (this.configService.isFhirSTU3) {
      const media = new STU3Media();
      media.id = name
        .substring(0, name.lastIndexOf('.'))
        .replace(/[^a-z0-9_]/gi, '')
        .replace(/_/gi, '-');
      media.type = 'photo';
      media.identifier = [{
        value: name
      }];
      media.content = {
        contentType,
        data: b64content
      };
      return media;
    } else if (this.configService.isFhirR4) {
      const media = new R4Media();
      media.id = name
        .substring(0, name.lastIndexOf('.'))
        .replace(/[^a-z0-9_]/gi, '')
        .replace(/_/gi, '-');
      media.status = 'completed';
      media.identifier = [{
        value: name
      }];
      media.content = {
        contentType,
        data: b64content
      };
      return media;
    } else {
      throw new Error('Can\'t create media. Unexpected FHIR server version');
    }
  }

  public getFileBundle(): Bundle {
    const bundle = new Bundle();
    bundle.type = 'batch';
    bundle.entry = [];

    this.files
      .filter((importFile: ImportFileModel) => {
        return importFile.contentType === ContentTypes.Json ||
          importFile.contentType === ContentTypes.Xml ||
          importFile.contentType === ContentTypes.Image;
      })
      .forEach((importFile: ImportFileModel) => {
        if (importFile.resource.resourceType === 'Bundle' && importFile.bundleOperation === 'execute') {
          const transactionBundle = <Bundle>importFile.resource;

          (transactionBundle.entry || []).forEach(bundleEntry => {
            if (!bundleEntry.resource) return;

            bundle.entry.push(bundleEntry);

            if (!bundleEntry.request) {
              bundleEntry.request = {
                method: bundleEntry.resource.id ? 'PUT' : 'POST',
                url: bundleEntry.resource.resourceType + (bundleEntry.resource.id ? '/' + bundleEntry.resource.id : '')
              };
            }
          });
        } else {
          const entry = new EntryComponent();
          entry.request = new RequestComponent();
          entry.request.method = importFile.resource.id ? 'PUT' : 'POST';
          entry.request.url = importFile.resource.resourceType + (importFile.resource.id ? '/' + importFile.resource.id : '');
          entry.resource = importFile.resource;
          bundle.entry.push(entry);
        }
      });

    this.files
      .filter((importFile: ImportFileModel) => importFile.contentType === ContentTypes.Xlsx)
      .forEach((importFile: ImportFileModel) => {
        if (importFile.vsBundle) {
          bundle.entry = bundle.entry.concat(importFile.vsBundle.entry);
        }
      });

    return bundle;
  }

  public async filesChanged(event) {
    const files = event.target.files;
    if (files.length === 1) {
      try {
        await this.populateFile(files[0]);
        this.updateFileStatus();
      } catch (ex) {
        this.message = ex.message;
      }
    }
  }

  public async getList(importFileModel) {
    if (!importFileModel.resource || !importFileModel.resource.resourceType || !importFileModel.resource.id) return;

    let url = `/api/fhir/${importFileModel.resource.resourceType}`;
    url += `/${importFileModel.resource.id}`;
    url += `/$validate-single-ig`;

    const singleIg = await this.httpClient.get(url).toPromise();
    if (!singleIg) {
      importFileModel.singleIg = false;
      importFileModel.multipleIgMessage = "This resource already belongs to another implementation guide. Continuing to import will add this resource to your current implementation guide, which may cause problems with the Publisher in the future."
    }
  }


  public removeImportFile(index: number) {
    //reset the error message
    this.errorMessage = '';
    this.files.splice(index, 1);
    this.importBundle = this.getFileBundle();
  }

  /**
   * Called/triggered when one or more files have been drag-and-dropped onto the import
   * panel, needing to be loaded into the list of files to be imported.
   * @param event
   */
  public async dropped(files: NgxFileDropEntry[]) {
    // Create an inline function that returns an awaitable promise
    // when the file has been loaded/populated
    const populateFile = (droppedFile: NgxFileDropEntry) => {
      return new Promise<void>(resolve => {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file(async (file: File) => {
          await this.populateFile(file);
          resolve();
        });
      });
    }

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        await populateFile(droppedFile);
      }
    }

    // Make sure to update the status of the resources after they have all been added
    // the files list by the drag-and-drop event. Loading the file is asynchronous,
    // so we have to make sure to await above for all the files to be loaded
    this.updateFileStatus();
  }

  /**
   * Asks the server for the status of each of the resources being imported, so that
   * the user knows if the import of a file/resource results in creating a new resource,
   * updating an existing resource, or if there are permission problems with one of
   * the resources being imported.
   * @private
   */
  private updateFileStatus() {
    const pendingResources = this.files
      .filter(f => !!f.resource && f.resource.id && f.status === 'pending');

    const resourceReferences: { resourceType: string, id: string, isExample: boolean }[] = pendingResources
      .map(pr => { return { resourceType: pr.resource.resourceType, id: pr.resource.id, isExample: pr.isExample } });

    this.files.filter(f => !!f.resource && !f.resource.id)
      .forEach(f => f.status = 'add');

    // Only ask the server if we have one or more resources with an ID that hasn't already been checked
    if (resourceReferences.length > 0) {
      let igId: string;
      if (this.configService.project && this.configService.project.implementationGuideId) {
        igId = this.configService.project.implementationGuideId
      }
      this.importService.checkResourcesStatus(resourceReferences, igId)
        .then((statuses) => {
          pendingResources.forEach(pr => {
            const path = `${pr.resource.resourceType}/${pr.resource.id}`;
            pr.status = statuses[path].action || 'unknown';
            pr.existingResource = statuses[path].resource;
          });
        })
        .catch((err) => {
          this.message = `Error retrieving status of imports: ${getErrorString(err)}`;
        });
    }
  }

  public getBundleEntryOutcome(entry: EntryComponent): OperationOutcome {
    if (entry && entry.response && entry.response.outcome && entry.response.outcome.resourceType === 'OperationOutcome') {
      return <OperationOutcome>entry.response.outcome;
    }
  }

  private populateFile(file: File) {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const reader = new FileReader();

    if (validExtensions.indexOf(extension) < 0) {
      alert('Expected one of the following file types: ' + validExtensions.join(' '));
      return;
    }

    return new Promise<void>((resolve, reject) => {
      reader.onload = (e: any) => {
        const result = e.target.result;
        const importFileModel = new ImportFileModel();
        this.errorMessage = '';
        importFileModel.name = file.name;
        importFileModel.content = result;

        if (extension === '.json') {
          importFileModel.contentType = ContentTypes.Json;
        } else if (extension === '.xml') {
          importFileModel.contentType = ContentTypes.Xml;
        } else if (extension === '.xlsx') {
          importFileModel.contentType = ContentTypes.Xlsx;
        } else if (extension === '.jpg' || extension === '.gif' || extension === '.png' || extension === '.bmp' || extension === '.svg') {
          importFileModel.contentType = ContentTypes.Image;
        }

        try {
          if (importFileModel.contentType === ContentTypes.Xml) {
            importFileModel.resource = this.fhirService.deserialize(result);
          } else if (importFileModel.contentType === ContentTypes.Json) {
            importFileModel.resource = JSON.parse(result);
          } else if (importFileModel.contentType === ContentTypes.Xlsx) {
            const convertResults = this.importService.convertExcelToValueSetBundle(result);
            if (!convertResults.success) {
              this.errorMessage = 'The XLSX that you\'re attempting to import is not valid. ' + convertResults.message + ' Please refer to the help documentation for guidance on the proper format of the XLSX.';
              throw new Error(convertResults.message);
            } else {
              this.errorMessage = '';
            }

            importFileModel.vsBundle = convertResults.bundle;
          } else if (importFileModel.contentType === ContentTypes.Image) {
            importFileModel.resource = this.createMedia(file.name, file.type, result);
          }
        } catch (ex) {
          importFileModel.message = ex.message;
        }

        if (importFileModel.resource && importFileModel.resource.resourceType === 'Bundle') {
          importFileModel.bundleOperation = 'execute';
        }

        // First find a matching file based on the file name. If it has the same file name as one that already exists, replace it
        let foundImportFile = this.files.find((importFile: ImportFileModel) => importFile.name === file.name);

        // If another file with the same name can't be found, determine if there is a file with the same resource id as this one, and replace it
        if (!foundImportFile && importFileModel.resource) {
          foundImportFile = this.files.find((importFile) => importFile.resource && importFile.resource.id === importFileModel.resource.id);
        }

        if (foundImportFile) {
          const index = this.files.indexOf(foundImportFile);
          this.files.splice(index, 1);
        }

        // only add to the list of files to import if it doesn't have a formatting error.
        if (this.errorMessage === '') {
          this.files.push(importFileModel);
        }
        // if (this.configService.project && this.configService.project.implementationGuideId) {
        //   this.getList(importFileModel);
        // }
        // this.importBundle = this.getFileBundle();
        this.cdr.detectChanges();

        resolve();
      };

      if (extension === '.json' || extension === '.xml') {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  }

  public downloadBundle(format: 'json' | 'xml') {
    let content, contentBlob;

    switch (format) {
      case 'json':
        content = JSON.stringify(this.importBundle, null, '\t');
        contentBlob = new Blob([content], { type: 'application/json' });
        saveAs(contentBlob, 'importBundle.json');
        break;
      case 'xml':
        content = this.fhirService.serialize(this.importBundle);
        contentBlob = new Blob([content], { type: 'application/xml' });
        saveAs(contentBlob, 'importBundle.xml');
    }
  }

  public getDisplayImportBundle(): Bundle {
    if (!this.importBundle) {
      return;
    }

    const clone = JSON.parse(JSON.stringify(this.importBundle));

    (clone.entry || []).forEach((entry: EntryComponent) => {
      entry.resource = {
        resourceType: entry.resource.resourceType,
        id: entry.resource.id
      };
    });

    return clone;
  }

  private importText(tabSet: NgbNav) {
    let resource;

    try {
      resource = this.textContentType === ContentTypes.Xml ?
        this.fhirService.fhir.xmlToObj(this.textContent) :
        JSON.parse(this.textContent);
    } catch (ex) {
      this.outcome = {
        resourceType: 'OperationOutcome',
        text: {
          status: 'generated',
          div: 'An error occurred while parsing the text content: ' + getErrorString(ex)
        },
        issue: []
      };
      this.message = 'Done. Errors occurred.';
      setTimeout(() => {
        tabSet.select('results');
      });
      return;
    }

    let url = `/api/fhir/${resource.resourceType}`;

    if (resource.id) {
      url += `/${resource.id}`;
    }

    url += `?applyContextPermissions=${this.applyContextPermissions}`;

    (resource.id ? this.httpClient.put(url, resource) : this.httpClient.post(url, resource))
      .subscribe((results: OperationOutcome) => {
        if (results.resourceType === 'OperationOutcome') {
          this.outcome = <OperationOutcome>results;
        } else {
          const successOutcome = new OperationOutcome();
          successOutcome.text = {
            status: 'generated',
            div: `<div><p>Successfully imported resource</p></div>`
          };
          successOutcome.issue = [{
            severity: 'information',
            code: 'success',
            diagnostics: 'Successfully imported the resource.'
          }];
          this.outcome = successOutcome;
        }

        this.message = 'Done.';
        setTimeout(() => {
          tabSet.select('results');
        });
      }, (err) => {
        if (err && err.error && err.error.resourceType === 'OperationOutcome') {
          this.outcome = err.error;
        } else {
          this.outcome = {
            resourceType: 'OperationOutcome',
            text: {
              status: 'generated',
              div: 'An error occurred while importing the resource(s): ' + getErrorString(err)
            },
            issue: []
          };
        }

        this.message = 'Done. Errors occurred: ' + getErrorString(err);
        setTimeout(() => {
          tabSet.select('results');
        });
      });
  }

  private importFiles(tabSet: NgbNav) {
    const json = JSON.stringify(this.importBundle, null, '\t');

    let requests = [];

    for (const file of this.files) {

      // ensure current IG is in the IG list for the resource if it is new
      // existing resources that are being updated already have the current IG in its list
      if (!file.existingResource && this.configService.project && this.configService.project.implementationGuideId) {
          file.existingResource = <IConformance | IExample>{ igIds: [this.configService.project.implementationGuideId] };
      }

      // add/update Example type
      if (file.isExample) {
        let example: IExample = <IExample>{ ...file.existingResource };
        example.content = file.content;
        requests.push(this.examplesService.save(example.id, example));
      }

      // add/update Conformance type
      else {
        let conformance: IConformance = <IConformance>{ ...file.existingResource };
        conformance.resource = file.resource;
        requests.push(this.conformanceService.save(conformance.id, conformance));
      }
    }

    zip(requests).subscribe({
      next: (res: IProjectResource[]) => {
        this.files = [];
        this.message = 'Done importing';
      },
      error: (err) => {
        if (err && err.message) {
          this.message = 'Error while importing: ' + err.message;
        } else {
          this.message = getErrorString(err);
        }
      }
    });
    
  }

  private importVsac(tabSet: NgbNav) {
    if (this.rememberVsacCredentials) {
      this.cookieService.set(this.vsacPasswordCookieKey, btoa(this.vsacCriteria.password));
    }

    this.importService.importVsac(this.vsacCriteria)
      .subscribe((results: OperationOutcome | Bundle) => {
        if (results.resourceType === 'OperationOutcome') {
          this.outcome = <OperationOutcome>results;
        } else if (results.resourceType === 'Bundle') {
          this.resultsBundle = <Bundle>results;
        }

        this.files = [];
        this.message = 'Done importing';
        setTimeout(() => {
          tabSet.select('results');
        });
      }, (err) => {
        if (err && err.error && err.error.resourceType === 'OperationOutcome') {
          this.outcome = <OperationOutcome>err.error;
          this.files = [];
          this.message = 'Import resulted in errors';
          setTimeout(() => {
            tabSet.select('results');
          });
        } else if (err && err.error && err.error.message) {
          this.message = err.error.message;
        } else if (err && err.message) {
          this.message = 'Error while importing: ' + err.message;
        } else {
          this.message = getErrorString(err);
        }
      });
  }

  /*
  public importGithub(tabSet: NgbNav) {
    // Filter the paths so that we don't include duplicate paths, or paths for directories where
    // child files are already selected.
    const filteredPaths = this.importGithubPanel.selectedPaths.filter((selectedPath: string) => {
      if (!selectedPath.startsWith('dir|') && !selectedPath.startsWith('file|')) {
        return false;
      }

      if (selectedPath.startsWith('dir|')) {
        const find1 = 'dir|' + selectedPath.substring(4) + '/';
        const find2 = 'file|' + selectedPath.substring(4) + '/';
        const foundChildren = this.importGithubPanel.selectedPaths.find((next: string) => next.startsWith(find1) || next.startsWith(find2));

        return !foundChildren;
      }

      return true;
    });

    const observables = filteredPaths.map((selectedPath: string) => {
      return this.githubService.getAllContents(this.importGithubPanel.ownerLogin, this.importGithubPanel.repositoryName, this.importGithubPanel.branchName, selectedPath);
    });

    forkJoin(observables).subscribe((results) => {
      const allFiles: GitHubImportContent[] = results
        .reduce((current: ContentModel[], files: ContentModel[]) => current.concat(files), [])
        .map((file: ContentModel) => {
          const importContent: GitHubImportContent = {
            content: file
          };

          if (file.name.endsWith('.xml') || file.name.endsWith('.json')) {
            let decodedContent = atob(file.content);

            if (decodedContent.startsWith('ï»¿')) {
              decodedContent = decodedContent.substring(3);
            }

            if (decodedContent.startsWith('{')) {
              try {
                importContent.resource = <DomainResource>JSON.parse(decodedContent);
              } catch (ex) {
                importContent.message = `${file.path}: An error occurred while deserializing JSON: ${ex.message}`;
              }
            } else if (decodedContent.startsWith('<')) {
              try {
                importContent.resource = <DomainResource>this.fhirService.deserialize(decodedContent);
              } catch (ex) {
                importContent.message = `${file.path}: An error occurred while converting from XML to JSON: ${ex.message}`;
              }
            } else {
              importContent.message = `${file.path}: This file does not appear to be a valid JSON or XML file.`;
            }

            if (importContent.resource) {
              if (importContent.resource.resourceType === 'Bundle') {
                const bundle = <Bundle>importContent.resource;

                if (bundle.type === 'transaction') {
                  importContent.message = `${file.path}: Cannot import Bundle resources of type "transaction"`;
                  delete importContent.resource;
                }
              }
            }
          } else {
            importContent.message = `${file.path} is not a JSON or XML file and cannot be imported.`;
          }

          return importContent;
        });

      const notSupportedFiles = allFiles.filter((file: GitHubImportContent) => !file.resource || !!file.message);

      if (notSupportedFiles.length > 0) {
        const issues: IssueComponent[] = notSupportedFiles.map((file: GitHubImportContent) => {
          return <IssueComponent>{
            severity: 'fatal',
            code: 'github-import-error',
            diagnostics: file.message || 'The resource could not be parsed.'
          };
        });
        this.outcome = <OperationOutcome>{
          resourceType: 'OperationOutcome',
          issue: issues
        };
        this.message = 'Errors occurred while importing';
        setTimeout(() => {
          tabSet.select('results');
        });
        return;
      }

      try {
        const bundle = new Bundle();
        bundle.type = 'transaction';
        bundle.entry = allFiles.map((file: GitHubImportContent) => {
          const entry = new EntryComponent();
          entry.fullUrl = 'urn:uuid:' + uuidv4();
          entry.resource = file.resource;
          entry.request = new RequestComponent();

          this.fhirService.setResourceGithubDetails(entry.resource, {
            owner: this.importGithubPanel.ownerLogin,
            repository: this.importGithubPanel.repositoryName,
            branch: this.importGithubPanel.branchName,
            path: file.content.path
          });

          entry.request.method = entry.resource.id ? 'PUT' : 'POST';
          entry.request.url = entry.resource.resourceType + (entry.resource.id ? '/' + entry.resource.id : '');

          return entry;
        });

        const json = JSON.stringify(bundle, null, '\t');
        this.fhirService.batch(json, 'application/json')
          .subscribe((importResults: OperationOutcome | Bundle) => {
            if (importResults.resourceType === 'OperationOutcome') {
              this.outcome = <OperationOutcome>importResults;
            } else if (importResults.resourceType === 'Bundle') {
              this.resultsBundle = <Bundle>importResults;
            }

            this.files = [];
            this.message = 'Done importing';
            setTimeout(() => {
              tabSet.select('results');
            });
          }, (err) => {
            this.message = getErrorString(err);
          });
      } catch (ex) {
        this.message = ex.message;
      }
    }, (err) => {
      this.message = getErrorString(err);
    });
  }
  */

  public import(tabSet: NgbNav) {
    this.outcome = null;
    this.resultsBundle = null;
    this.message = 'Importing...';

    if (this.activeTab === 'file') {
      this.importFiles(tabSet);
    } else if (this.activeTab === 'text') {
      this.importText(tabSet);
    } else if (this.activeTab === 'vsac') {
      this.importVsac(tabSet);
    } /*else if (this.activeTab === 'github') {
      this.importGithub(tabSet);
    }*/
  }

  public importDisabled(): boolean {
    if (this.activeTab) {
      if (this.activeTab === 'file') {
        const unauthorizedResources = this.files.filter(f => f.status === 'unauthorized');
        return !this.files || this.files.length === 0 || unauthorizedResources.length > 0;
      } else if (this.activeTab === 'text') {
        return !this.textContent;
      } else if (this.activeTab === 'vsac') {
        return !this.vsacCriteria.id || !this.vsacCriteria.password;
      } /*else if (this.importGithubPanel && this.activeTab === 'github') {
        return !this.importGithubPanel || !this.importGithubPanel.selectedPaths || this.importGithubPanel.selectedPaths.length === 0;
      }*/
    }
    return true;
  }

  public getIdDisplay(file: ImportFileModel) {
    if (file.contentType === ContentTypes.Xlsx) {
      if (file.vsBundle) {
        const ids = (file.vsBundle.entry || []).map((entry) => entry.resource.id);
        return ids.join(', ');
      }
    } else {
      if (file.resource) {
        return file.resource.id;
      }
    }
  }

  public getContentTypeDisplay(file: ImportFileModel) {
    switch (file.contentType) {
      case ContentTypes.Json:
        return 'Resource JSON';
      case ContentTypes.Xml:
        return 'Resource XML';
      case ContentTypes.Xlsx:
        return 'Value Set XLSX';
      case ContentTypes.Image:
        return 'Image';
      default:
        return 'Unknown';
    }
  }

  ngOnInit() {
  }
}
