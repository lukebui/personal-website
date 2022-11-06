import { Module } from '@nestjs/common';
import { ParentalLinksService } from './parental-links.service';
import { ParentalLinksController } from './parental-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentalLink } from './entities/parental-link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParentalLink])],
  controllers: [ParentalLinksController],
  providers: [ParentalLinksService],
})
export class ParentalLinksModule {}
