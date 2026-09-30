import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class InitializePaymentDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'Le nom complet est obligatoire.' })
  @MinLength(2, { message: 'Customer name is too short' })
  @MaxLength(100, { message: 'Customer name is too long' })
  @Matches(/^[\p{L}\p{M}\s\-'’]+$/u, {
    message: 'Le nom contient des caractères non autorisés.',
  })
  customerName: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(1, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
