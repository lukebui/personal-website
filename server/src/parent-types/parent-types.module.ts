import { Module } from '@nestjs/common';
import { ParentTypesService } from './parent-types.service';
import { ParentTypesController } from './parent-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentType } from './entities/parent-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentType])],
  controllers: [ParentTypesController],
  providers: [ParentTypesService],
})
export class ParentTypesModule {}
