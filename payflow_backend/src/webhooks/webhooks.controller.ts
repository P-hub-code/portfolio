import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get()
  async findAll() {
    return this.webhooksService.findAll();
  }

  @Post()
  async handleWebhook(
    @Headers('x-paystack-signature') signature: string,

    @Body() body: any,
  ) {
    if (!signature) {
      throw new UnauthorizedException('Signature is missing');
    }
    await this.webhooksService.handlePaystackWebhook(signature, body);
    return { received: true };
  }
}
