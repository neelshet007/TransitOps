import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';
import { AuthenticationError } from '../helpers/errors';
import { config } from '../config';
import { JWTPayload } from '@transitops/types';
import { authLogger } from '../utils/logger';

export class AuthService {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user || !user.is_active) {
      authLogger.warn(`Authentication failed for email: ${email}`);
      throw new AuthenticationError('Invalid credentials or account is suspended.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      authLogger.warn(`Invalid password attempt for email: ${email}`);
      throw new AuthenticationError('Invalid credentials.');
    }

    // Extract roles and flat permissions list
    const roles = user.user_roles.map((ur) => ur.role.code);
    const permissions = Array.from(
      new Set(
        user.user_roles.flatMap((ur) =>
          ur.role.role_permissions.map((rp) => rp.permission.code)
        )
      )
    );

    const tokenPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      roles,
      permissions,
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshToken = this.generateRefreshToken(tokenPayload);

    authLogger.info(`User authenticated successfully: ${user.email}`);

    // Return tokens and safe user summary
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        roles,
        permissions,
      },
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET) as JWTPayload;
      
      // Fetch latest user details (roles/permissions could have changed)
      const user = await userRepository.findById(decoded.userId);
      if (!user || !user.is_active) {
        throw new AuthenticationError('User not found or suspended.');
      }

      const roles = user.user_roles.map((ur) => ur.role.code);
      const permissions = Array.from(
        new Set(
          user.user_roles.flatMap((ur) =>
            ur.role.role_permissions.map((rp) => rp.permission.code)
          )
        )
      );

      const tokenPayload: JWTPayload = {
        userId: user.id,
        email: user.email,
        roles,
        permissions,
      };

      const newAccessToken = this.generateAccessToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken(tokenPayload);

      authLogger.info(`Tokens rotated for user: ${user.email}`);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      authLogger.warn(`Token refresh failed: %o`, err);
      throw new AuthenticationError('Invalid or expired refresh token.');
    }
  }

  private generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.ACCESS_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'],
    });
  }

  private generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRY as jwt.SignOptions['expiresIn'],
    });
  }
}

export const authService = new AuthService();
