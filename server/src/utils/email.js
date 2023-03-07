const nodemailer = require('nodemailer')
const confirmTemplate = require('../html/email/confirm.template')
const resetTemplate = require('../html/email/reset.template')


module.exports = class Email {
   constructor(to, url) {
      Object.assign(this, { to, url })
      this.from = `Judo Novator <admin@judo-novator.com>`
   }

   newTransporter() {
      const env = process.env

      return nodemailer.createTransport({
         host: env.EMAIL_HOST,
         port: env.EMAIL_PORT,
         auth: {
            user: env.EMAIL_USERNAME,
            pass: env.EMAIL_PASSWORD
         }
      })
   }

   async send(template, subject) {
      // 1) Define email options
      const options = {
         from: this.from,
         to: this.to,
         subject,
         text: template
      }

      // 2) Create transporter and send email
      try {
         await this.newTransporter().sendMail(options)
      } catch (e) {
         console.log(e)
         // throw new AppError(e.message, 500)
      }
   }

   async sendConfirm(newEmail) {
      // 1) Get template
      const template = confirmTemplate(newEmail, this.url)

      // 2) Send mail
      await this.send(template, 'Змінна пошти ')
   }

   async sendReset() {
      // 1) Get template
      const template = resetTemplate(this.url)

      // 2) Send mail
      await this.send(template, 'Сброс пароля Judo Novator')
   }
}