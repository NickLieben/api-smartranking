import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModule: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;

    const hasPlayer = await this.playerModule.findOne({ email }).exec();

    if (hasPlayer) {
      throw new BadRequestException(`email: ${email} already exists.`);
    }

    const player = new this.playerModule(createPlayerDto);

    await player.save();

    return await player;
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: CreatePlayerDto,
  ): Promise<void> {
    const hasPlayer = await this.playerModule.findOne({ _id }).exec();

    if (!hasPlayer) throw new NotFoundException(`ID: ${_id} not found.`);

    await this.playerModule
      .findOneAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModule.find().exec();
  }

  async getPlayerById(_id: string): Promise<Player> {
    const hasPlayer = await this.playerModule.findOne({ _id }).exec();

    if (!hasPlayer) throw new NotFoundException(`ID: ${_id} not found.`);

    return hasPlayer;
  }

  async deletePlayer(_id: string): Promise<any> {
    const hasPlayer = await this.playerModule.findOne({ _id }).exec();
    if (!hasPlayer) throw new NotFoundException(`ID: ${_id} not found.`);

    return await this.playerModule.findOneAndDelete({ _id }).exec();
  }
}
