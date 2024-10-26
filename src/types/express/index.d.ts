import { User } from 'src/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User; // 'user' can be 'User' or 'undefined'
    }
  }
}
