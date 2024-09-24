import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import * as ejs from 'ejs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';

@Controller('pdf')
export class PdfController {
  @Post()
  async generatePDF(@Body() data: any, @Res() res: Response) {
    try {
      console.log('Generating PDF...');

      // Determine which template to use based on the documentType
      const templatePath =
        data.documentType === 'loanPolicy'
          ? path.join(process.cwd(), 'src', 'template', 'loanTemplate.ejs')
          : path.join(process.cwd(), 'src', 'template', 'agreement.ejs');

      // Render the correct EJS template with dynamic data
      const html = await ejs.renderFile(templatePath, data);

      // Generate PDF using Puppeteer
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
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${data.documentType}-${data._id}.pdf`,
      });
      console.log('PDF generation successful, sending response...');
      return res.status(200).send(Buffer.from(pdfBuffer)); // Ensure this is sent as binary
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  }
}
