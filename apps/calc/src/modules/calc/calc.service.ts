import { Injectable } from '@nestjs/common';
import { calcAstrology } from './calculators/astrology';
import { calcNumerology } from './calculators/numerology';
import { calcArchetypes } from './calculators/archetypes';

@Injectable()
export class CalcService {
  buildProfile(input: any) {
    const astrology = calcAstrology(input);
    const numerology = calcNumerology(input.date_of_birth);
    const archetypes = calcArchetypes(numerology.life_path);

    const limitations = [];
    if (!input.time_of_birth) {
      limitations.push('No time of birth: solar chart only');
    }

    return {
      meta: {
        has_time_of_birth: Boolean(input.time_of_birth),
        limitations
      },
      astrology,
      numerology,
      archetypes
    };
  }
}
