import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  VerticalAlign
} from 'docx';
import { Bundle, DomainResource, ImplementationGuide } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { TofLogger } from '../tof-logger';
//import { StructureDefinition } from 'fhir/parseConformance';
import { Extension } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import {StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';


/**
 * This class is responsible for creating an MSWord DOCX document from a bundle of
 * resources. It uses the 'docx' component to create the document and returns a binary
 * Buffer to the caller.
 * @link https://docx.js.org/#/
 */
export class MSWordExporter {
  private doc: Document;
  private body: (Paragraph | Table | TableOfContents)[];
  private readonly logger = new TofLogger(MSWordExporter.name);

  constructor() {

  }

  addResource(resource: DomainResource) {
    this.body.push(new Paragraph({
      heading: HeadingLevel.HEADING_2,
      text: `${resource.resourceType}/${resource.id}`
    }));

    if ((<any> resource).description) {
      this.body.push((<any> resource).description);
    } else {
      this.body.push(new Paragraph('This profile does not have a description'));
    }
  }

  async export(bundle: Bundle) {
    this.doc = new Document();
    this.body = [];

    const implementationGuideEntry = (bundle.entry || []).find(entry => entry.resource && entry.resource.resourceType === 'ImplementationGuide');
    const implementationGuide = implementationGuideEntry ? <ImplementationGuide> implementationGuideEntry.resource : undefined;

    if (implementationGuide) {
      this.body.push(new Paragraph({
        text: implementationGuide.title || implementationGuide.name,
        heading: HeadingLevel.HEADING_1
      }));


      this.body.push(new Paragraph({
        text: "Description:" + implementationGuide.description
      }));
      this.body.push(new Paragraph({
        text: "Publisher:" + implementationGuide.publisher
      }));
      this.body.push(new Paragraph({
        text: "Copyright:" + implementationGuide.copyright
      }));

      this.body.push(new Paragraph({
        text: ""
      }));

      bundle.entry
        .filter(entry => entry.resource && (entry.resource.resourceType === 'StructureDefinition'))
        .forEach((entry) => {
          const extensionUrlKeys = Object.keys(Globals.extensionUrls);
          const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
          const keys = Object.keys(entry.resource);

          this.logger.log(" VERSION:" + implementationGuide.version);
          this.logger.log(" FHIR VERSION:" + implementationGuide.fhirVersion);

          const structureDefinition: STU3StructureDefinition | R4StructureDefinition = <STU3StructureDefinition | R4StructureDefinition> entry.resource;


            this.logger.log(" STRUCTURE name:" + structureDefinition.name);
            this.logger.log(" STRUCTURE purpose :" + structureDefinition.purpose);
            this.logger.log(" STRUCTURE title :" + structureDefinition.title);


            this.logger.log(" STRUCTURE version:" + structureDefinition.version);

            this.logger.log(" STRUCTURE fhirversion:" + structureDefinition.fhirVersion);

          this.logger.log(" STRUCTURE publisher:" + structureDefinition.publisher);

          this.logger.log(" STRUCTURE contact:" + structureDefinition.contact);

          this.logger.log(" STRUCTURE copyright:" + structureDefinition.copyright);


          // const structureDefinition: StructureDefinition = <StructureDefinition> entry.resource;  // we can do this because we know entry.resource will be a StructureDefinition because of the filter

          this.body.push(new Paragraph({ text: `Name: ${structureDefinition.name}` }));    // name is required, so we can expect it to be populated with a value
          if (structureDefinition.title) {
            this.body.push(new Paragraph({ text: `Title: ${structureDefinition.title}` }));    // name is required, so we can expect it to be populated with a value
          }


          if (structureDefinition.differential) {
            (structureDefinition.differential.element || []).forEach((element, eIndex) => {
                this.body.push(new Paragraph({ text: `Element ${eIndex + 1}` }));
                this.body.push(new Paragraph({ text: `Path: ${element.path}` }));
                this.body.push(new Paragraph({ text: `Min: ${element.min}` }));
                this.body.push(new Paragraph({ text: `Max: ${element.max}` }));
                this.body.push(new Paragraph({ text: `Must support: ${element.mustSupport}` }));
                this.body.push(new Paragraph({ text: `Binding: ${element.binding}` }));
                this.body.push(new Paragraph({ text: `Short: ${element.short}` }));
                this.body.push(new Paragraph({ text: `Label: ${element.label}` }));

              }
            );
          };



            keys.forEach((key) => {
            //if(key === 'name' || 'url' || 'description'){
            const table = new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph(key)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(entry.resource[key])],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              ]
            });
            this.body.push(table);
          //}
          });

          this.body.push(new Paragraph({
            text: ""
          }));
          }
        );

      bundle.entry
        .filter(entry => entry.resource && (entry.resource.resourceType === 'ValueSet'))
        .forEach((entry) => {
            const extensionUrlKeys = Object.keys(Globals.extensionUrls);
            const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
            const keys = Object.keys(entry.resource);

            keys.forEach((key) => {
              //if(key === 'name' || 'url' || 'description'){
              const table = new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(key)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(entry.resource[key])],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                ]
              });
              this.body.push(table);
              //}
            });

            this.body.push(new Paragraph({
              text: ""
            }));
          }
        );

      bundle.entry
        .filter(entry => entry.resource && (entry.resource.resourceType === 'CodeSystem'))
        .forEach((entry) => {
            const extensionUrlKeys = Object.keys(Globals.extensionUrls);
            const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
            const keys = Object.keys(entry.resource);

            keys.forEach((key) => {
              //if(key === 'name' || 'url' || 'description'){
              const table = new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(key)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(entry.resource[key])],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                ]
              });
              this.body.push(table);
              //}
            });

            this.body.push(new Paragraph({
              text: ""
            }));
            // const structureDefinition = <StructureDefinition> entry.resource;
          }
        );

      bundle.entry
        .filter(entry => entry.resource && (entry.resource.resourceType === 'CapabilityStatement'))
        .forEach((entry) => {
            const extensionUrlKeys = Object.keys(Globals.extensionUrls);
            const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
            const keys = Object.keys(entry.resource);

            keys.forEach((key) => {
              //if(key === 'name' || 'url' || 'description'){
              const table = new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph(key)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(entry.resource[key])],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                ]
              });
              this.body.push(table);
              //}
            });

            this.body.push(new Paragraph({
              text: ""
            }));
            // const structureDefinition = <StructureDefinition> entry.resource;
          }
        );

    }

    (bundle.entry || [])
      .filter(entry => entry.resource && entry.resource.resourceType !== 'ImplementationGuide')
      .forEach(entry => this.addResource(entry.resource));

    this.doc.addSection({
      properties: {},
      children: this.body
    });

    return await Packer.toBuffer(this.doc);
  }
}
