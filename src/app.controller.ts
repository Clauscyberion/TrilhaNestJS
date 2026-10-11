import { Controller, Get } from '@nestjs/common';
import packageJson from '../package.json' with { type: 'json' };

@Controller()
export class AppController {
  

  @Get('version')
  Version() {
    return { name: packageJson.name, 
             version: packageJson.version,};
  };
  
  @Get('health')
  health() {
    return { status: 'ok' };
  };
  
  
  
}
