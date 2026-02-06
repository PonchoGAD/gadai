import { Module } from '@nestjs/common';
import { CalcController } from './modules/calc/calc.controller';
import { CalcService } from './modules/calc/calc.service';

@Module({
  controllers: [CalcController],
  providers: [CalcService]
})
export class AppModule {}
