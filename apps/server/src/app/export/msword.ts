import {Document, HeadingLevel, Packer, Paragraph, Table, TableOfContents} from 'docx';
import {Bundle, DomainResource, ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/r4/fhir';

/**
 * This class is responsible for creating an MSWord DOCX document from a bundle of
 * resources. It uses the 'docx' component to create the document and returns a binary
 * Buffer to the caller.
 * @link https://docx.js.org/#/
 */
export class MSWordExporter {
  private doc: Document;
  private body: (Paragraph | Table | TableOfContents)[];

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
