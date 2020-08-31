import {Injectable} from '@nestjs/common';
import { HtmlExporter } from './export/html';

@Injectable()
export class ExportService {
  public exports: HtmlExporter[] = [];

  public cancel(packageId: string) {
    const exporter = this.exports.find(e => e.packageId === packageId);
    const index = this.exports.indexOf(exporter);

    if (index >= 0) {
      this.exports.splice(index, 1);
      exporter.igPublisherProcess.kill("SIGKILL");
      exporter.sendSocketMessage('progress', 'You have been removed from the queue');
      return true;
    }
    return false;
  }
}
