import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  async initialize(@Body() initializePaymentDto: InitializePaymentDto) {
    return this.paymentsService.initializePayment(initializePaymentDto);
  }
}
