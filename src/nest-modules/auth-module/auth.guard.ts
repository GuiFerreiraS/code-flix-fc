import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    //Bearer XXXXX
    const token = request.headers.authorization?.split(' ')[1];

    console.log({ token, service: this.jwtService });
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify(token, { algorithms: ['RS256'] });
      console.log({ payload });
      request['user'] = payload;
      return true;
    } catch (e) {
      console.log('Error' + e);
      throw new UnauthorizedException();
    }
  }
}
