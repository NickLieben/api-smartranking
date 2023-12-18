import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { PlayersService } from './players.service';
import { Player } from './interfaces/player.interface';
import { PlayersValidationParametersPipe } from './pipes/players-validation-parameters.pipe';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    await this.playersService.createOrUpdatePlayer(createPlayerDto);
  }

  @Get()
  async getPlayers(
    @Query('email', PlayersValidationParametersPipe) email: string,
  ): Promise<Player[] | Player> {
    if (email) return await this.playersService.getPlayerByEmail(email);

    return await this.playersService.getAllPlayers();
  }

  @Delete()
  async deletePlayer(
    @Query('email', PlayersValidationParametersPipe) email: string,
  ): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
