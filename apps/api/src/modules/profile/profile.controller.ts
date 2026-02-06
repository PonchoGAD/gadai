import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private profile: ProfileService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async build(@Req() req: any, @Body() body: any): Promise<any> {
    return this.profile.buildProfile(req.user.userId, body);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(@Req() req: any) {
    return this.profile.getAll(req.user.userId);
  }
}
