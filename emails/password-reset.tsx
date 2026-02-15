import { Section, Text, Button } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface PasswordResetProps {
  resetUrl: string;
  expiryHours?: number;
}

export const PasswordReset = ({ resetUrl, expiryHours = 1 }: PasswordResetProps) => {
  return (
    <BaseLayout preview="Reset your Frametale password">
      <Section style={content}>
        <Text style={heading}>🔑 Reset Your Password</Text>
        
        <Text style={paragraph}>
          We received a request to reset your password. Click the button below to create a new password.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Reset Password
          </Button>
        </Section>

        <Section style={warningBox}>
          <Text style={warningText}>
            ⏰ This link will expire in {expiryHours} hour{expiryHours > 1 ? 's' : ''}.
          </Text>
        </Section>

        <Text style={paragraph}>
          If you didn't request a password reset, you can safely ignore this email. 
          Your password will remain unchanged.
        </Text>

        <Section style={securityBox}>
          <Text style={securityTitle}>🔒 Security Tip</Text>
          <Text style={securityText}>
            Never share your password or this reset link with anyone. Frametale will never 
            ask for your password via email.
          </Text>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default PasswordReset;

const content = {
  padding: '30px 40px',
};

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '25px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const warningBox = {
  backgroundColor: '#fef3c7',
  padding: '16px',
  borderRadius: '8px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const warningText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#92400e',
  margin: '0',
  fontWeight: '600',
};

const securityBox = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
};

const securityTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 8px',
};

const securityText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#4b5563',
  margin: '0',
};
