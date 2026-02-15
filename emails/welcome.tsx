import { Section, Text, Button, Hr } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface WelcomeEmailProps {
  name?: string;
  verifyUrl?: string;
  unsubscribeUrl?: string;
}

export const WelcomeEmail = ({ name, verifyUrl, unsubscribeUrl }: WelcomeEmailProps) => {
  const userName = name || 'there';
  
  return (
    <BaseLayout 
      preview="Welcome to Frametale! Turn your photos into beautiful books."
      unsubscribeUrl={unsubscribeUrl}
    >
      <Section style={content}>
        <Text style={heading}>🎉 Welcome to Frametale!</Text>
        
        <Text style={paragraph}>Hi {userName},</Text>
        
        <Text style={paragraph}>
          We're thrilled to have you here! Frametale makes it easy to turn your favorite photos 
          into beautiful, professionally printed photo books.
        </Text>

        {verifyUrl && (
          <>
            <Text style={paragraph}>
              <strong>First things first:</strong> Please verify your email address to unlock all features.
            </Text>
            
            <Section style={buttonContainer}>
              <Button style={button} href={verifyUrl}>
                Verify Email Address
              </Button>
            </Section>
          </>
        )}

        <Hr style={hr} />

        <Text style={subheading}>What's Next?</Text>
        
        <Text style={listItem}>📸 <strong>Upload your photos</strong> - Drag and drop, or select from your device</Text>
        <Text style={listItem}>🎨 <strong>AI-powered layouts</strong> - We'll arrange them beautifully</Text>
        <Text style={listItem}>✨ <strong>Customize</strong> - Adjust layouts, add captions, pick themes</Text>
        <Text style={listItem}>📖 <strong>Print & ship</strong> - High-quality printing, delivered to your door</Text>

        <Text style={paragraph}>
          Ready to get started? Create your first photo book in just a few minutes!
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/upload`}>
            Create Your First Book
          </Button>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default WelcomeEmail;

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

const subheading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '30px 0 16px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '16px 0',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '12px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#ec4899',
  borderRadius: '25px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};
