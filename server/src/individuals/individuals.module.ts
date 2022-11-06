import { Module } from '@nestjs/common';
import { IndividualsService } from './individuals.service';
import { IndividualsController } from './individuals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Individual } from './entities/individual.entity';
import { ParentChildRelationshipsModule } from 'src/parent-child-relationships/parent-child-relationships.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Individual]),
    ParentChildRelationshipsModule,
  ],
  controllers: [IndividualsController],
  providers: [IndividualsService],
})
export class IndividualsModule {}
