import { Injectable } from '@nestjs/common';
import { HtmlExporter } from './export/html';

@Injectable()
export class ExportService {
  public exports: HtmlExporter[] = [];
}
