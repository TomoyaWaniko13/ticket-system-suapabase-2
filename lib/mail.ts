import { Resend } from 'resend';
import EmailTemplate from '@/components/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, hashed_token: string, baseUrl: string) => {
  // 検証用のリンクを生成します。このリンクには、トークンがクエリパラメータとして含まれています。
  // この token がデータベースの token と同じであれば、email が verified されているとわかります。
  const constructedLink = `${baseUrl}/auth/verify-email?hashed_token=${hashed_token}`;

  // Resendというメール送信サービスを使用して、検証メールを作成し送信します。
  return resend.emails.send({
    from: 'testing@resend.dev',
    to: email,
    subject: 'Verify your email address',
    react: EmailTemplate({ constructedLink }),
  });
};
