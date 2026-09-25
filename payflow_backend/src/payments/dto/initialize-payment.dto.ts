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
  @IsNotEmpty()
  @MinLength(2, { message: 'Customer name is too short' })
  @MaxLength(100, { message: 'Customer name is too long' })
  @Matches(/^[a-zA-ZÀ-ÿ\s\-']+$/, { message: 'Invalid customer name format' })
  customerName: string;

  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

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
