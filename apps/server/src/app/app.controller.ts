import { Controller } from '@nestjs/common';
import {BaseController} from './base.controller';

@Controller()
export class AppController extends BaseController {
  constructor() {
    super();
  }
}
