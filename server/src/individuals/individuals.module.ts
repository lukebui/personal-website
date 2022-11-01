import { Module } from '@nestjs/common';
import { IndividualsService } from './individuals.service';
import { IndividualsController } from './individuals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Individual } from './entities/individual.entity';
import { ParentsModule } from 'src/parents/parents.module';

@Module({
  imports: [TypeOrmModule.forFeature([Individual]), ParentsModule],
  controllers: [IndividualsController],
  providers: [IndividualsService],
})
export class IndividualsModule {}
