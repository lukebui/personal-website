import { Module } from '@nestjs/common';
import { ParentalTypesService } from './parental-types.service';
import { ParentalTypesController } from './parental-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentalType } from './entities/parental-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentalType])],
  controllers: [ParentalTypesController],
  providers: [ParentalTypesService],
})
export class ParentalTypesModule {}
