#!/bin/bash

# 🎨 Frametale 2026 Site-Wide Modernization Script
# Applies consistent design system to all pages

echo "═══════════════════════════════════════════════════════════"
echo "  🎨 FRAMETALE 2026 SITE-WIDE MODERNIZATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counter
PAGES_UPDATED=0

# Function to apply common patterns
apply_2026_patterns() {
    local file=$1
    echo -e "${BLUE}Processing:${NC} $file"
    
    # Remove AI language
    sed -i 's/AI-powered/intelligent automatic/g' "$file" 2>/dev/null
    sed -i 's/Smart AI/Intelligent/g' "$file" 2>/dev/null
    sed -i 's/Powered by AI/Advanced algorithms/g' "$file" 2>/dev/null
    
    ((PAGES_UPDATED++))
}

echo "Phase 1: Scanning all TSX/TS files..."
echo ""

# Find all page files
for file in $(find /root/.openclaw/workspace/frametale/src/app -name "page.tsx" -o -name "*.ts"); do
    if grep -q "AI" "$file" 2>/dev/null; then
        apply_2026_patterns "$file"
    fi
done

# Component files
for file in $(find /root/.openclaw/workspace/frametale/src/components -name "*.tsx" -o -name "*.ts"); do
    if grep -q "AI" "$file" 2>/dev/null; then
        apply_2026_patterns "$file"
    fi
done

echo ""
echo -e "${GREEN}✓${NC} AI language purge complete!"
echo -e "${GREEN}✓${NC} Files processed: $PAGES_UPDATED"
echo ""
echo "═══════════════════════════════════════════════════════════"

