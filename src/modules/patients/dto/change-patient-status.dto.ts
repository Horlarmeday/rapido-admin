import { ProfileStatus } from "../entities/patient.entity";
import { IsEnum, IsNotEmpty } from "class-validator";

export class ChangePatientStatusDto {
  @IsNotEmpty()
  @IsEnum(ProfileStatus)
  profileStatus: ProfileStatus;
}