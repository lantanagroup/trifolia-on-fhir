import {Document, HeadingLevel, IParagraphOptions, Packer, Paragraph, Table, TableCell, TableOfContents, TableRow, TextRun, VerticalAlign} from 'docx';
import {
  Bundle,
  Extension as R4Extension,
  ImplementationGuide as R4ImplementationGuide,
  StructureDefinition as R4StructureDefinition,
  ValueSet as R4ValueSet
} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {TofLogger} from '../tof-logger';
import {
  Extension as STU3Extension,
  ImplementationGuide as STU3ImplementationGuide,
  StructureDefinition as STU3StructureDefinition,
  ValueSet as STU3ValueSet
} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {readFileSync} from 'fs';
import type {IImplementationGuide} from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {IgPageHelper, PageInfo} from '../../../../../libs/tof-lib/src/lib/ig-page-helper';

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

  private static createPara(text: string, heading?: HeadingLevel, bold?: boolean) {
    const options: IParagraphOptions = {
      children: [this.createRun(text, bold)],
      heading: heading
    };

    return new Paragraph(options);
  }

  private static createRun(text: string, bold?: boolean) {
    const options: any = {
      text: text
    };

    if (bold === true) {
      options.bold = true;
    }

    return new TextRun(options);
  }

  private static createFieldPara(fieldName: string, fieldValue: string) {
    return new Paragraph({
      children: [
        this.createRun(fieldName + ': ', true),
        this.createRun(fieldValue)
      ]
    });
  }

  private static createRow(header: boolean, ...cellValues: string[]) {
    return new TableRow({
      children: cellValues.map(cv => {
        return new TableCell({
          children: [MSWordExporter.createPara(cv, null, header)],
          verticalAlign: VerticalAlign.CENTER,
          margins: {
            left: 75,
            right: 75
          }
        });
      })
    });
  }

  private static createMarkdown(title: string, content: string) {
    const lines = content.replace(/\r/g, '').split('\n');
    const paragraphs = lines.map(l => this.createPara(l, null, false));

    return [
      this.createPara(title, null, true),
      ...paragraphs
    ];
  }

  async export(bundle: Bundle, version: 'stu3'|'r4') {
    this.doc = new Document({
      externalStyles: readFileSync('./assets/msword-styles.xml').toString()
    });
    this.body = [];

    this.body.push(new TableOfContents('Table of Contents', {
      hyperlink: true,
      headingStyleRange: '1-5'
    }));

    const implementationGuideEntry = (bundle.entry || []).find(entry => entry.resource && entry.resource.resourceType === 'ImplementationGuide');

    if (!implementationGuideEntry) throw new Error('No ImplementationGuide was included in the bundle for export');

    let implementationGuide: IImplementationGuide;
    const profiles = bundle.entry.filter(entry => entry.resource && (entry.resource.resourceType === 'StructureDefinition'));

    if (version === 'stu3') {
      implementationGuide = new STU3ImplementationGuide(implementationGuideEntry.resource);
    } else if (version === 'r4') {
      implementationGuide = new R4ImplementationGuide(implementationGuideEntry.resource);
    }

    if (implementationGuide) {
      this.body.push(MSWordExporter.createPara('IG Overview', HeadingLevel.HEADING_2));
      this.body.push(MSWordExporter.createFieldPara('Title/Name', (<any> implementationGuide).title || implementationGuide.name));
      this.body.push(MSWordExporter.createFieldPara('URL', implementationGuide.url));
      this.body.push(...MSWordExporter.createMarkdown('Description', implementationGuide.description || 'No description'));

      let pageInfos: PageInfo[];

      if (version === 'stu3') {
        const stu3ImplementationGuide = <STU3ImplementationGuide> implementationGuide;
        pageInfos = IgPageHelper.getSTU3PagesList([], stu3ImplementationGuide.page, stu3ImplementationGuide);
      } else if (version === 'r4') {
        const r4ImplementationGuide = <R4ImplementationGuide> implementationGuide;
        if (r4ImplementationGuide.definition) {
          pageInfos = IgPageHelper.getR4PagesList([], r4ImplementationGuide.definition.page, r4ImplementationGuide);
        }
      }

      if (pageInfos && pageInfos.length > 0) {
        this.body.push(MSWordExporter.createPara('Pages', HeadingLevel.HEADING_2));

        pageInfos.forEach((pageInfo, pageInfoIndex) => {
          this.body.push(MSWordExporter.createPara(`Page ${pageInfoIndex+1}`, HeadingLevel.HEADING_3));
          this.body.push(MSWordExporter.createFieldPara('Title', pageInfo.title));
          this.body.push(MSWordExporter.createFieldPara('File Name', pageInfo.fileName));
          this.body.push(...MSWordExporter.createMarkdown('Content', pageInfo.content || 'None/Auto-Generated'));
        });
      }
    }

    if (profiles.length > 0) {
      this.body.push(MSWordExporter.createPara('Profiles', HeadingLevel.HEADING_2));
    }

    profiles.forEach((entry, sdIndex) => {
      const structureDefinition: STU3StructureDefinition | R4StructureDefinition = <STU3StructureDefinition | R4StructureDefinition>entry.resource;
      const sdExtensions = <(STU3Extension | R4Extension)[]> structureDefinition.extension;

      this.body.push(MSWordExporter.createPara(`Profile ${sdIndex+1}: ${structureDefinition.url || structureDefinition.name}`, HeadingLevel.HEADING_3));
      this.body.push(MSWordExporter.createFieldPara('URL', structureDefinition.url));
      this.body.push(MSWordExporter.createFieldPara('Title/Name', structureDefinition.title || structureDefinition.name));
      this.body.push(MSWordExporter.createFieldPara('Status', structureDefinition.status));
      this.body.push(...MSWordExporter.createMarkdown('Description', structureDefinition.description || 'No description'));

      const introExt = (sdExtensions || []).find(e => e.url === Globals.extensionUrls['extension-sd-intro']);
      const notesExt = (sdExtensions || []).find(e => e.url === Globals.extensionUrls['extension-sd-notes']);

      if (introExt && introExt.valueMarkdown) {
        this.body.push(...MSWordExporter.createMarkdown('Intro', introExt.valueMarkdown || 'No intro'));
      }

      if (notesExt && notesExt.valueMarkdown) {
        this.body.push(...MSWordExporter.createMarkdown('Notes', notesExt.valueMarkdown || 'No notes'));
      }

      if (structureDefinition.differential && structureDefinition.differential.element && structureDefinition.differential.element.length > 0) {
        structureDefinition.differential.element.forEach((element, elementIndex) => {
          this.body.push(MSWordExporter.createPara(`Element ${elementIndex+1}: ${element.id || element.path}`, HeadingLevel.HEADING_4));

          if (element.hasOwnProperty('min')) {
            this.body.push(MSWordExporter.createFieldPara('Min', element.min.toString()));
          }

          if (element.max) {
            this.body.push(MSWordExporter.createFieldPara('Max', element.max || 'Inherited'));
          }

          if (element.definition) {
            this.body.push(MSWordExporter.createFieldPara('Definition', element.definition || 'Inherited'));
          }

          if (element.short) {
            this.body.push(MSWordExporter.createFieldPara('Short', element.short || 'Inherited'));
          }

          if (element.alias) {
            this.body.push(MSWordExporter.createFieldPara('Alias', element.alias || 'Inherited'));
          }
        });
      }
    });

    const valueSets = bundle.entry.filter(entry => entry.resource && (entry.resource.resourceType === 'ValueSet'));

    if (valueSets.length > 0) {
      this.body.push(MSWordExporter.createPara('Value Sets', HeadingLevel.HEADING_2));
    }

    valueSets.forEach((entry, valueSetIndex) => {
      const valueSet: STU3ValueSet | R4ValueSet = <STU3ValueSet | R4ValueSet> entry.resource;

      this.body.push(MSWordExporter.createPara(`Value Set ${valueSetIndex+1}`, HeadingLevel.HEADING_3));
      this.body.push(MSWordExporter.createFieldPara('Title/Name', valueSet.title || valueSet.name));
      this.body.push(MSWordExporter.createFieldPara('URL', valueSet.url));
      this.body.push(...MSWordExporter.createMarkdown('Description', valueSet.description || 'No description'));

      if (valueSet.compose && valueSet.compose.include && valueSet.compose.include.length > 0) {
        valueSet.compose.include.forEach((include, includeIndex) => {
          this.body.push(MSWordExporter.createPara(`Include ${includeIndex+1}`, HeadingLevel.HEADING_4));
          this.body.push(MSWordExporter.createFieldPara('System', include.system || 'None'));

          const includeTable = new Table({
            rows: [
              MSWordExporter.createRow(true, 'Code', 'Display'),
              ...(include.concept || []).map(concept => {
                return MSWordExporter.createRow(false, concept.code, concept.display)
              })
            ]
          });

          this.body.push(includeTable);
        });
      }

      this.body.push(MSWordExporter.createPara(''));
    });

    this.doc.addSection({
      properties: {},
      children: this.body
    });

    return await Packer.toBuffer(this.doc);
  }
}
