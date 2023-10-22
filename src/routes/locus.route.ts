import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { LocusController } from '@/controllers/locus.controller';

export class LocusRoute implements Routes {
  public path = '/locus';
  public router = Router();
  public locusController = new LocusController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.locusController.getLocuses);
  }
}
