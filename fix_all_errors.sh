#!/bin/bash

# Fix all email templates - replace Code with CodeBlock
for file in emails/*.tsx; do
  if grep -q "{ Section, Text, Button, Code }" "$file" 2>/dev/null; then
    sed -i "s/{ Section, Text, Button, Code }/{ Section, Text, Button, CodeBlock }/" "$file"
    sed -i "s/<Code>/<CodeBlock>/" "$file"
    sed -i "s/<\/Code>/<\/CodeBlock>/" "$file"
    echo "✓ Fixed $file (Button variant)"
  fi
  
  if grep -q "{ Section, Text, Hr, Code }" "$file" 2>/dev/null; then
    sed -i "s/{ Section, Text, Hr, Code }/{ Section, Text, Hr, CodeBlock }/" "$file"
    sed -i "s/<Code>/<CodeBlock>/" "$file"
    sed -i "s/<\/Code>/<\/CodeBlock>/" "$file"
    echo "✓ Fixed $file (Hr variant)"
  fi
done

# Install missing dependency jsonwebtoken
cd /root/.openclaw/workspace/frametale
npm install jsonwebtoken @types/jsonwebtoken

echo "✓ All fixes applied"
