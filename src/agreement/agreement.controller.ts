import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AgreementService } from './agreement.service';
import { CreateAgreementDto } from './dto/create-agreement.dto';
import { EmailService } from 'src/email/email.service';

@Controller('agreement')
export class AgreementController {
  constructor(
    private readonly agreementService: AgreementService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  async create(@Body() createAgreementDto: CreateAgreementDto) {
    try {
      console.log('hello agreement POST');
      const newAgreement =
        await this.agreementService.create(createAgreementDto);
      return { id: newAgreement._id }; // Return the generated ID
    } catch (error) {
      console.log(error + 'There is an error');
    }
  }

  @Post('templateEmail/:id')
  @HttpCode(HttpStatus.OK)
  async sendTemplateEmail(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    try {
      // Fetch agreement details using the ID
      const agreement = await this.agreementService.findById(id);
      if (!agreement || !agreement.Add1.email) {
        throw new Error('No agreement or email found for the given ID');
      }

      const email = agreement.Add1.email; // Extracting the email from the agreement

      console.log('Sending template email to: ' + email);

      // Send the template email to the fetched email address
      await this.agreementService.sendTemplateEmail(email);

      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw new Error('Email Not Sent!!!');
    }
  }

  // For Email route, assuming an email pattern
  @Get(':email')
  async getCustomerByEmail(@Param('email') email: string) {
    try {
      console.log(email);
      const customer = await this.agreementService.findByEmail(email);
      if (!customer) {
        throw new NotFoundException(`Customer with email ${email} not found`);
      }
      console.log(customer);
      return customer;
    } catch (error) {
      throw new NotFoundException('Customer details not found');
    }
  }

  // For ID route, assuming an ID is numeric or a valid UUID (adjust regex accordingly)
  @Get('id/:id')
  async findOne(@Param('id') id: string) {
    const agreement = await this.agreementService.findById(id);
    return agreement;
  }
}
