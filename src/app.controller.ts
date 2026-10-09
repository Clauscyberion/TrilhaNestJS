import { Controller, Get } from '@nestjs/common';
import packageJson from '../package.json' with { type: 'json' };

@Controller('health')
export class AppController {
  @Get('version')
  getVersion() {
    return { name: packageJson.name, 
             version: packageJson.version,};
  };
}
