#!/bin/bash

# Fix EditorToolbar.tsx
sed -i 's/^export function EditorToolbar/export default function EditorToolbar/' src/components/studio/EditorToolbar.tsx

# Fix BookCanvas.tsx
sed -i 's/^export function BookCanvas/export default function BookCanvas/' src/components/studio/BookCanvas.tsx

# Fix EditorHeader.tsx
sed -i 's/^export function EditorHeader/export default function EditorHeader/' src/components/studio/EditorHeader.tsx

# Fix PageThumbnails.tsx
sed -i 's/^export function PageThumbnails/export default function PageThumbnails/' src/components/studio/PageThumbnails.tsx

# Fix PreviewModal.tsx
sed -i 's/^export function PreviewModal/export default function PreviewModal/' src/components/studio/PreviewModal.tsx

echo "✓ Fixed all component exports"
