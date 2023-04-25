import { Types } from 'mongoose';
import { Role } from '../../users/types/profile.types';

export class IJwtPayload {
  readonly sub: Types.ObjectId;
  readonly email: string;
  readonly first_name: string;
  readonly role: Role;
}
