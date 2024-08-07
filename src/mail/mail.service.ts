import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

// types
import type { User } from 'src/user/interfaces/user.interface'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  public async sendUserConfirmation(user: User) {
    // const url = `example.com/auth/confirm?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: '"Команда проекта" <plpo@ya.ru>', // override default from
      subject: 'Спасибо за регистрацию в Глазов-есть!',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        name: user.name,
        // url,
      },
    });
  }

  public async sendOrderNotifications(userEmails: string[], order: any) {
    return await this.mailerService.sendMail({
      to: userEmails,
      from: "Команда Глазов-есть <plpo@ya.ru>", // override default from
      subject: 'Новый заказ в Глазов-есть!',
      template: 'order', // `.hbs` extension is appended automatically
      context: { order: order._doc }
    });
  }

  public async sendResetLink(link: string, email: string) {
    return await this.mailerService.sendMail({
      to: email,
      from: "Команда Глазов-есть <plpo@ya.ru>", // override default from
      subject: 'Восстановление пароля',
      template: 'reset-pasword', // `.hbs` extension is appended automatically
      context: { link }
    });
  }
}
