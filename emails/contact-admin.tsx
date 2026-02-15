import { Section, Text, Hr, Code } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface ContactAdminProps {
  submissionId: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  userId?: string;
  orderId?: string;
  submittedAt: string;
}

export const ContactAdmin = ({
  submissionId,
  name,
  email,
  subject,
  message,
  userId,
  orderId,
  submittedAt,
}: ContactAdminProps) => {
  return (
    <BaseLayout preview={`New contact form: ${subject || 'No subject'} - ${name}`}>
      <Section style={content}>
        <Text style={heading}>📧 New Contact Form Submission</Text>
        
        <Section style={infoBox}>
          <Text style={infoLabel}>Submission ID:</Text>
          <Code style={code}>{submissionId}</Code>
          
          <Text style={infoLabel}>Submitted:</Text>
          <Text style={infoValue}>{submittedAt}</Text>
        </Section>

        <Hr style={hr} />

        <Text style={sectionTitle}>Contact Details</Text>
        
        <Text style={detailLabel}>Name:</Text>
        <Text style={detailValue}>{name}</Text>
        
        <Text style={detailLabel}>Email:</Text>
        <Text style={detailValue}>{email}</Text>
        
        {subject && (
          <>
            <Text style={detailLabel}>Subject:</Text>
            <Text style={detailValue}>{subject}</Text>
          </>
        )}

        <Hr style={hr} />

        <Text style={sectionTitle}>Message</Text>
        <Section style={messageBox}>
          <Text style={messageText}>{message}</Text>
        </Section>

        {(userId || orderId) && (
          <>
            <Hr style={hr} />
            <Text style={sectionTitle}>Related Data</Text>
            
            {userId && (
              <>
                <Text style={detailLabel}>User ID:</Text>
                <Text style={detailValue}>{userId}</Text>
              </>
            )}
            
            {orderId && (
              <>
                <Text style={detailLabel}>Order ID:</Text>
                <Text style={detailValue}>{orderId}</Text>
              </>
            )}
          </>
        )}

        <Section style={actionBox}>
          <Text style={actionText}>
            Reply directly to {email} or manage this submission in the admin panel.
          </Text>
        </Section>
      </Section>
    </BaseLayout>
  );
};

export default ContactAdmin;

const content = {
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
  fontSize: '20px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '24px 0 12px',
};

const infoBox = {
  backgroundColor: '#f3f4f6',
  padding: '16px',
  borderRadius: '8px',
  margin: '20px 0',
};

const infoLabel = {
  fontSize: '12px',
  color: '#6b7280',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  margin: '12px 0 4px',
};

const infoValue = {
  fontSize: '14px',
  color: '#1f2937',
  margin: '0 0 12px',
};

const code = {
  backgroundColor: '#ffffff',
  padding: '8px 12px',
  borderRadius: '4px',
  fontSize: '14px',
  fontFamily: 'monospace',
  color: '#1f2937',
  display: 'inline-block',
};

const detailLabel = {
  fontSize: '14px',
  color: '#6b7280',
  fontWeight: '600',
  margin: '16px 0 4px',
};

const detailValue = {
  fontSize: '16px',
  color: '#1f2937',
  margin: '0 0 12px',
};

const messageBox = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
  margin: '12px 0',
};

const messageText = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#374151',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
};

const actionBox = {
  backgroundColor: '#dbeafe',
  padding: '16px',
  borderRadius: '8px',
  margin: '30px 0',
  textAlign: 'center' as const,
};

const actionText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#1e40af',
  margin: '0',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};
