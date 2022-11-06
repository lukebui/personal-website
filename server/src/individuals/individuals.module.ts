import { Module } from '@nestjs/common';
import { IndividualsService } from './individuals.service';
import { IndividualsController } from './individuals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Individual } from './entities/individual.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Individual])],
  controllers: [IndividualsController],
  providers: [IndividualsService],
})
export class IndividualsModule {}
