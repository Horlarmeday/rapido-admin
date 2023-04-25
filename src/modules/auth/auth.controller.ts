import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, HttpCode, Request } from "@nestjs/common";
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { sendSuccessResponse } from "../../core/responses/success.responses";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const { message, result } = await this.authService.login(req.user);
    return sendSuccessResponse(message, result);
  }
}
