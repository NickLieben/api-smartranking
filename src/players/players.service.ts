import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async createOrUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<void> {
    const { email } = createPlayerDto;

    const hasPlayer = await this.playerModule.findOne({ email }).exec();

    if (hasPlayer) {
      this.update(createPlayerDto);
    } else {
      this.create(createPlayerDto);
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModule.find().exec();
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    const hasPlayer = await this.playerModule.findOne({ email }).exec();

    if (!hasPlayer) throw new NotFoundException(`Email: ${email} not found.`);

    return hasPlayer;
  }

  async deletePlayer(email: string): Promise<any> {
    return await this.playerModule.findOneAndDelete({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = new this.playerModule(createPlayerDto);

    return await player.save();

    // const { name, email, phoneNumber } = createPlayerDto;

    // const player: Player = {
    //   _id: uuidv4(),
    //   name,
    //   email,
    //   phoneNumber,
    //   ranking: 'A',
    //   positionRanking: 1,
    //   urlImage:
    //     'https://movinggirls.com.br/blog/wp-content/uploads/2020/06/mulher-fot%C3%B3grafa.jpg',
    // };

    // this.logger.log(`createPlayerDto: ${JSON.stringify(player)}`);
    // this.players.push(player);
  }

  private async update(updatePlayerDto: CreatePlayerDto): Promise<Player> {
    return await this.playerModule
      .findOneAndUpdate(
        { email: updatePlayerDto.email },
        { $set: updatePlayerDto },
      )
      .exec();

    // const { name } = updatePlayerDto;
    // hasPlayer.name = name;
  }
}
