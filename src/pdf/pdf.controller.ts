import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ejs from 'ejs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Controller('pdf')
export class PdfController {
  @Post()
  async generateAgreementPDF(@Body() data: any, @Res() res: Response) {
    try {
      console.log('its pdf fileeee.....');
      // Render the EJS template with dynamic data
      // Use process.cwd() to get the correct base path
      const templatePath = path.join(
        process.cwd(),
        'src',
        'template',
        'agreement.ejs',
      );
      const html = await ejs.renderFile(templatePath, data);

      // Generate PDF using puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(html as string);
      const pdfBuffer = await page.pdf({ format: 'A4' });
      await browser.close();

      // Send the PDF as a response
      res.set({
        'Content-Type': 'application/pdf', // Ensure this is correct
        'Content-Disposition': `attachment; filename=agreement-${data._id}.pdf`,
      });
      console.log('pdf generated.!!');
      console.log('PDF buffer length:', pdfBuffer.length);
      console.log('PDF generation successful, sending response...');
      return res.status(200).send(Buffer.from(pdfBuffer));  // Ensure this is sent as binary
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
