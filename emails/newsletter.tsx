import { Section, Text, Button, Hr } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

export const Newsletter = ({ subject, headline, content, unsubscribeUrl }: any) => (
  <BaseLayout preview={subject} unsubscribeUrl={unsubscribeUrl}>
    <Section style={{padding:'30px 40px'}}>
      <Text style={{fontSize:'28px',fontWeight:'700',textAlign:'center' as const}}>{headline}</Text>
      {content.map((item: any, i: number) => (
        <React.Fragment key={i}>
          {i > 0 && <Hr />}
          <Text style={{fontSize:'22px',fontWeight:'600',margin:'20px 0 12px'}}>{item.title}</Text>
          <Text style={{fontSize:'16px',margin:'12px 0'}}>{item.text}</Text>
          {item.buttonText && item.buttonUrl && (
            <Section style={{textAlign:'center' as const,margin:'24px 0'}}>
              <Button style={{backgroundColor:'#ec4899',borderRadius:'25px',color:'#fff',padding:'12px 32px'}} href={item.buttonUrl}>
                {item.buttonText}
              </Button>
            </Section>
          )}
        </React.Fragment>
      ))}
    </Section>
  </BaseLayout>
);

export default Newsletter;
