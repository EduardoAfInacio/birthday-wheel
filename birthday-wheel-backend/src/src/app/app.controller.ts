import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ParticipateRequestDto } from './dto/participate-request-dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/participate')
  async flow(@Body() dto: ParticipateRequestDto): Promise<void> {
    await this.appService.startFlow(dto);
  }
}
