import nodemailer from "nodemailer";
import { EmailRepository } from "../repository/email.repository.js";
import { InvalidInputError } from "../util/error.js";

const myEmail = process.env.EMAIL;
const password = process.env.SMTPPASSWORD;

export class EmailService {
  private emailRepository: EmailRepository;
  private transporter;

  constructor() {
    this.emailRepository = new EmailRepository();
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myEmail,
        pass: password,
      },
    });
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmail(email: string) {
    // 인증번호 생성
    const code = this.generateVerificationCode();

    // 만료 시간 (5분 뒤)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    try {
      const mailOptions = {
        from: `"WithBuddy" <${myEmail}>`,
        to: email,
        subject: "WithBuddy 가입 인증 메일",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">WithBuddy 가입 인증 메일</h2>
            <p>안녕하세요,</p>
            <p>WithBuddy에 가입해주셔서 감사합니다. 아래 인증번호를 사용하여 가입을 완료해 주세요:</p>
            <h3 style="color: #0066cc; text-align: center; font-size: 24px; border: 1px solid #0066cc; padding: 10px; border-radius: 5px; display: inline-block;">${code}</h3>
            <p>인증번호는 <strong>5분 후 만료</strong>됩니다.</p>
            <p>감사합니다.</p>
          </div>
        `,
      };

      // 메일 보내기
      const info = await this.transporter.sendMail(mailOptions);

      // 인증번호 저장
      await this.emailRepository.saveCode(email, code, expiresAt);

      return info.accepted;
    } catch (error) {
      console.error("이메일 전송 실패:", error);
      throw new Error("이메일 전송 중 오류 발생");
    }
  }

  async verifyCode(email: string, inputCode: string) {
    const storedCode = await this.emailRepository.getCode(email);

    if (!storedCode) {
      throw new InvalidInputError("인증번호를 발급해주세요 ", email);
    }

    const { code, expiresAt } = storedCode;

    const now = new Date();

    if (now > expiresAt) {
      // 만료된 코드 삭제
      await this.emailRepository.deleteCode(email);

      throw new InvalidInputError(
        "인증번호가 만료되었습니다 다시 시도해주세요 ",
        email
      );
    }

    if (code !== inputCode) {
      throw new InvalidInputError(
        "인증번호가 틀렸습니다 다시 시도해주세요 ",
        email
      );
    }
    // 사용 후 삭제
    await this.emailRepository.deleteCode(email);
  }
}
