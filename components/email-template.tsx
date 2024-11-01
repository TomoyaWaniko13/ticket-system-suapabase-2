import * as React from 'react';

// https://resend.com/docs/send-with-nextjs

interface EmailTemplateProps {
  constructedLink: string;
}

const EmailTemplate = ({ constructedLink }: EmailTemplateProps) => {
  return (
    <>
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email address</p>
      <a href={constructedLink}>Verify email</a>
    </>
  );
};

export default EmailTemplate;
