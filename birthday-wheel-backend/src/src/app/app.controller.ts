import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ParticipateRequestDto } from './dto/participate.request.dto';
import { ParticipateResponseDto } from './dto/participate.response.dto';
import { SpinRequestDto } from './dto/spin.request.dto';
import { SpinResponseDto } from './dto/spin.response.dto';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/participate')
  async flow(
    @Body() dto: ParticipateRequestDto,
  ): Promise<ParticipateResponseDto> {
    return await this.appService.startFlow(dto);
  }

  @Post('/spin')
  async spin(@Body() dto: SpinRequestDto): Promise<SpinResponseDto> {
    return await this.appService.executeSpin(dto);
  }
}
