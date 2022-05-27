import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    };
  }
}
