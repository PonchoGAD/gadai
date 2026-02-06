import { Controller, Post, Body } from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcProfileDto } from './dto';

@Controller('calc')
export class CalcController {
  constructor(private calc: CalcService) {}

  @Post('profile')
  async profile(@Body() dto: CalcProfileDto): Promise<any> {
    return this.calc.buildProfile(dto);
  }
}
