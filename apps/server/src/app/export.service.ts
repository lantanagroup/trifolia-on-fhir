import {Injectable} from '@nestjs/common';
import { HtmlExporter } from './export/html';

@Injectable()
export class ExportService {
  public exports: HtmlExporter[] = [];

  public cancel(packageId: string) {
    const exporter = this.exports.find(e => e.packageId === packageId);

    if (!exporter) return;

    const index = this.exports.indexOf(exporter);

    if (index >= 0) {
      this.exports.splice(index, 1);

      if (exporter.igPublisherProcess) {
        exporter.igPublisherProcess.kill("SIGKILL");
      }

      exporter.publishLog('progress', 'You have been removed from the queue');
      return true;
    }

    return false;
  }
}
