import { Section, Text, Button, Hr, Img } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface NewsletterProps {
  subject: string;
  headline: string;
  content: {
    title: string;
    text: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
  }[];
  unsubscribeUrl: string;
}

export const Newsletter = ({ subject, headline, content, unsubscribeUrl }: NewsletterProps) => {
  return (
    <BaseLayout preview={subject} unsubscribeUrl={unsubscribeUrl}>
      <Section style={contentStyle}>
        <Text style={heading}>{headline}</Text>
        
        {content.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Hr style={hr} />}
            
            {item.imageUrl && (
              <Img
                src={item.imageUrl}
                alt={item.title}
                style={image}
              />
            )}
            
            <Text style={sectionTitle}>{item.title}</Text>
            <Text style={paragraph}>{item.text}</Text>
            
            {item.buttonText && item.buttonUrl && (
              <Section style={buttonContainer}>
                <Button style={button} href={item.buttonUrl}>
                  {item.buttonText}
                </Button>
              </Section>
            )}
          </React.Fragment>
        ))}

        <Hr style={hr} />

        <Section style={socialBox}>
          <Text style={socialText}>
            Follow us for inspiration and tips
          </Text>
          {/* Add social media links here */}
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default Newsletter;

const contentStyle = {
  padding: '30px 40px',
};

const heading = {
  fontSize: '28px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#1f2937',
  textAlign: 'center' as const,
  margin: '0 0 30px',
};

const sectionTitle = {
  fontSize: '22px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '20px 0 12px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '12px 0',
};

const image = {
  width: '100%',
  borderRadius: '8px',
  margin: '20px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
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
  padding: '12px 32px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const socialBox = {
  textAlign: 'center' as const,
  padding: '20px',
};

const socialText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0 0 16px',
};
