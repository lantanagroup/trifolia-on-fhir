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
import {StructureDefinition as STU3StructureDefinition} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {StructureDefinition as R4StructureDefinition} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

import {ValueSet as STU3ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ValueSet as R4ValueSet} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

import {CodeSystem as STU3CodeSystem} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CodeSystem as R4CodeSystem} from '../../../../../libs/tof-lib/src/lib/r4/fhir';


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


      const implTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Name")],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [new Paragraph(implementationGuide.title || implementationGuide.name)],
                verticalAlign: VerticalAlign.CENTER,
              }),
            ]
          })
        ]
      });

      if (implementationGuide.description) {
        implTable.addChildElement(new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Description")],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [new Paragraph(implementationGuide.description)],
                verticalAlign: VerticalAlign.CENTER,
              }),
            ]
          })
        );
      };
      if (implementationGuide.publisher) {
        implTable.addChildElement(new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Publisher")],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [new Paragraph(implementationGuide.publisher)],
                verticalAlign: VerticalAlign.CENTER,
              }),
            ]
          })
        );
      };
      if (implementationGuide.copyright) {
        implTable.addChildElement(new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph("Copyright")],
                verticalAlign: VerticalAlign.CENTER,
              }),
              new TableCell({
                children: [new Paragraph(implementationGuide.copyright)],
                verticalAlign: VerticalAlign.CENTER,
              }),
            ]
          })
        );
      };
      this.body.push(implTable);

      this.body.push(new Paragraph({
        text: ""
      }));

      bundle.entry
        .filter(entry => entry.resource && (entry.resource.resourceType === 'StructureDefinition'))
        .forEach((entry) => {
          const extensionUrlKeys = Object.keys(Globals.extensionUrls);
          const extensionUrls = extensionUrlKeys.map((key) => Globals.extensionUrls[key]);
          const keys = Object.keys(entry.resource);

          const structureDefinition: STU3StructureDefinition | R4StructureDefinition = <STU3StructureDefinition | R4StructureDefinition> entry.resource;


          const structDefTable = new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Name")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(structureDefinition.name)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            ]
          });

          if (structureDefinition.title) {
            structDefTable.addChildElement(new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Title")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(structureDefinition.title)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            );
          };

          if (structureDefinition.description) {
            structDefTable.addChildElement(new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("description")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(structureDefinition.description)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            );
          };


          if (structureDefinition.url) {
            structDefTable.addChildElement(new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("url")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(structureDefinition.url)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            );
          };

          if (structureDefinition.purpose) {
            structDefTable.addChildElement(new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("purpose")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(structureDefinition.purpose)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            );
          };


          if (structureDefinition.differential) {
            (structureDefinition.differential.element || []).forEach((element, eIndex) => {

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("Element")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${eIndex + 1}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );
                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("Id")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.id}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );
                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("Path")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.path}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("min")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.min}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("max")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.max}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("must support")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.mustSupport}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("bindings")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.binding}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );


                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("short")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.short}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("description")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.label}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );

                structDefTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("alias")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(`${element.alias}`)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );
              }
            );
          }

          this.body.push(structDefTable);

/*
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
            */

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

            const valueSet: STU3ValueSet | R4ValueSet = <STU3ValueSet | R4ValueSet> entry.resource;


            const valueSetTable = new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Name")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(valueSet.name || valueSet.title)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              ]
            });

          if (valueSet.url) {
            valueSetTable.addChildElement(new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("url")],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                  new TableCell({
                    children: [new Paragraph(valueSet.url)],
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ]
              })
            );
          };

          if (valueSet.identifier) {
            valueSet.identifier
              .forEach((identifier) => {
                valueSetTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("identifier")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(identifier)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );
              }
            )
          };

          if (valueSet.description) {
            valueSetTable.addChildElement(new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("description")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(valueSet.description)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              );
            };

          if (valueSet.compose.include) {
            valueSet.compose.include
              .forEach((include) => {
                  valueSetTable.addChildElement(new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph("compose")],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        new TableCell({
                          children: [new Paragraph(include)],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ]
                    })
                  )
                }
              )
          };

          if (valueSet.compose.exclude) {
            valueSet.compose.exclude
              .forEach((exclude) => {
                  valueSetTable.addChildElement(new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph("compose")],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        new TableCell({
                          children: [new Paragraph(exclude)],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ]
                    })
                  )
                }
              )
          };

          if (valueSet.contained) {
            valueSet.contained
              .forEach((contained) => {
                valueSetTable.addChildElement(new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("contained")],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                      new TableCell({
                        children: [new Paragraph(contained)],
                        verticalAlign: VerticalAlign.CENTER,
                      }),
                    ]
                  })
                );
              })
          };

          this.body.push(valueSetTable);

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

            const codeSystem: STU3CodeSystem | R4CodeSystem = <STU3CodeSystem | R4CodeSystem> entry.resource;


            const codeSystemTable = new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("Name")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(codeSystem.name || codeSystem.title)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              ]
            });

            if (codeSystem.url) {
              codeSystemTable.addChildElement(new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("url")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(codeSystem.url)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              );
            };

            if (codeSystem.identifier) {
              codeSystemTable.addChildElement(new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("identifier")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(codeSystem.identifier.valueOf())],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
              })
              );
            };

            if (codeSystem.description) {
              codeSystemTable.addChildElement(new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph("description")],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: [new Paragraph(codeSystem.description)],
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ]
                })
              );
            };

            if (codeSystem.concept) {
              codeSystem.concept
                .forEach((concept) => {
                  codeSystemTable.addChildElement(new TableRow({
                        children: [
                          new TableCell({
                            children: [new Paragraph("concept")],
                            verticalAlign: VerticalAlign.CENTER,
                          }),
                          new TableCell({
                            children: [new Paragraph(concept)],
                            verticalAlign: VerticalAlign.CENTER,
                          }),
                        ]
                      })
                    )
                  }
                )
            };

            if (codeSystem.contained) {
              codeSystem.contained
                .forEach((contained) => {
                  codeSystemTable.addChildElement(new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph("contained")],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                        new TableCell({
                          children: [new Paragraph(contained)],
                          verticalAlign: VerticalAlign.CENTER,
                        }),
                      ]
                    })
                  );
                })
            };

            this.body.push(codeSystemTable);

            this.body.push(new Paragraph({
              text: ""
            }));
          }
        );
    }

    this.doc.addSection({
      properties: {},
      children: this.body
    });

    return await Packer.toBuffer(this.doc);
  }
}
