#!/bin/bash

echo "💾 Quick Save - WhatsApp Web Clone Project"
echo "=========================================="

# Get timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PROJECT_NAME="WHATSAPP-WEB-CLONE"

# Create backup directory
mkdir -p "backups"

# Create quick backup with error handling
echo "📦 Creating quick backup..."
tar -czf "backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP.tar.gz" \
    --exclude="node_modules" \
    --exclude="dist" \
    --exclude=".git" \
    --exclude="backups" \
    --exclude="*.tar.gz" \
    --exclude="*.log" \
    . 2>/dev/null

if [ $? -eq 0 ]; then
    SIZE=$(du -h "backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP.tar.gz" | cut -f1)
    echo "✅ Quick backup created: backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP.tar.gz"
    echo "📏 Size: $SIZE"
    echo ""
    echo "💡 This backup includes:"
    echo "   ✅ Source code"
    echo "   ✅ Configuration files"
    echo "   ✅ Scripts and documentation"
    echo "   ❌ node_modules (can be reinstalled)"
    echo "   ❌ dist (can be rebuilt)"
    echo "   ❌ backup files (to avoid duplicates)"
    echo ""
    echo "🔒 Your project is saved!"
    echo "🚀 Ready for deployment!"
    echo ""
    echo "📁 Backup location: backups/"
    echo "📋 List of backups:"
    ls -lh backups/*.tar.gz | tail -5
else
    echo "❌ Backup failed! Trying alternative method..."
    
    # Alternative backup method
    echo "🔄 Trying alternative backup method..."
    tar -czf "backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP-ALT.tar.gz" \
        --exclude="node_modules" \
        --exclude="dist" \
        --exclude=".git" \
        --exclude="backups" \
        --exclude="*.tar.gz" \
        --exclude="*.log" \
        --warning=no-file-changed \
        . 2>/dev/null
    
    if [ $? -eq 0 ]; then
        SIZE=$(du -h "backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP-ALT.tar.gz" | cut -f1)
        echo "✅ Alternative backup created: backups/QUICK-BACKUP-$PROJECT_NAME-$TIMESTAMP-ALT.tar.gz"
        echo "📏 Size: $SIZE"
        echo "🔒 Your project is saved!"
    else
        echo "❌ All backup methods failed!"
        echo "💡 Try running: ./backup-project.sh for complete backup"
        exit 1
    fi
fi
