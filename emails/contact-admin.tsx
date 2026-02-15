import { Section, Text, Hr, CodeBlock } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

export const ContactAdmin = ({ submissionId, name, email, subject, message, submittedAt }: any) => (
  <BaseLayout preview={`Contact: ${subject || 'No subject'}`}>
    <Section style={{padding:'30px 40px'}}>
      <Text style={{fontSize:'28px',fontWeight:'700',textAlign:'center' as const}}>📧 New Contact Submission</Text>
      <Section style={{backgroundColor:'#f3f4f6',padding:'16px',borderRadius:'8px'}}>
        <CodeBlock style={{backgroundColor:'#fff',padding:'8px 12px',borderRadius:'4px',fontSize:'14px'}}>{submissionId}</CodeBlock>
        <Text style={{fontSize:'14px',margin:'8px 0'}}>{submittedAt}</Text>
      </Section>
      <Hr />
      <Text style={{fontSize:'14px',fontWeight:'600',color:'#6b7280'}}>Name:</Text>
      <Text style={{fontSize:'16px'}}>{name}</Text>
      <Text style={{fontSize:'14px',fontWeight:'600',color:'#6b7280'}}>Email:</Text>
      <Text style={{fontSize:'16px'}}>{email}</Text>
      {subject && (
        <>
          <Text style={{fontSize:'14px',fontWeight:'600',color:'#6b7280'}}>Subject:</Text>
          <Text style={{fontSize:'16px'}}>{subject}</Text>
        </>
      )}
      <Hr />
      <Text style={{fontSize:'20px',fontWeight:'600'}}>Message</Text>
      <Section style={{backgroundColor:'#f9fafb',padding:'20px',borderRadius:'8px',border:'1px solid #e5e7eb'}}>
        <Text style={{fontSize:'16px',whiteSpace:'pre-wrap' as const}}>{message}</Text>
      </Section>
    </Section>
  </BaseLayout>
);

export default ContactAdmin;
