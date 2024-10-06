import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByUsername(username: string) {
    return this.findOne({ where: { username } });
  }
}
