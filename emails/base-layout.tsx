import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
} from '@react-email/components';
import * as React from 'react';

interface BaseLayoutProps {
  preview: string;
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

export const BaseLayout = ({ preview, children, unsubscribeUrl }: BaseLayoutProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>📖 Frametale</Text>
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or visit our{' '}
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/help`} style={link}>
                Help Center
              </Link>
            </Text>
            {unsubscribeUrl && (
              <Text style={footerText}>
                <Link href={unsubscribeUrl} style={link}>
                  Unsubscribe
                </Link>
                {' • '}
                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/email-preferences`} style={link}>
                  Email Preferences
                </Link>
              </Text>
            )}
            <Text style={footerText}>
              &copy; 2026 Frametale. Made with ❤️ for your memories.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 0',
  background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
  borderRadius: '10px 10px 0 0',
};

const headerTitle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  color: '#6b7280',
};

const footerText = {
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
};

const link = {
  color: '#ec4899',
  textDecoration: 'underline',
};
