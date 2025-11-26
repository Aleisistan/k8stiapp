import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService { // <-- ¡La palabra "export" es crucial!
  getHello(): string {
    return 'Hello World!';
  }
}