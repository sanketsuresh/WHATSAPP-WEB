#!/bin/bash

echo "💾 WhatsApp Web Clone - Complete Project Backup"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PROJECT_NAME="WHATSAPP-WEB-CLONE"
BACKUP_DIR="backups"

# Create backup directory
mkdir -p $BACKUP_DIR

echo "📅 Backup timestamp: $TIMESTAMP"
echo "📁 Project: $PROJECT_NAME"
echo ""

# Function to create backup
create_backup() {
    local backup_type=$1
    local filename=$2
    local exclude_patterns=$3
    
    echo -e "${BLUE}📦 Creating $backup_type backup...${NC}"
    
    if [ -z "$exclude_patterns" ]; then
        tar -czf "$BACKUP_DIR/$filename" .
    else
        tar -czf "$BACKUP_DIR/$filename" --exclude="$exclude_patterns" .
    fi
    
    if [ $? -eq 0 ]; then
        local size=$(du -h "$BACKUP_DIR/$filename" | cut -f1)
        echo -e "${GREEN}✅ $backup_type backup created: $filename (Size: $size)${NC}"
    else
        echo -e "${RED}❌ $backup_type backup failed!${NC}"
        return 1
    fi
}

# 1. Complete Project Backup (everything)
echo -e "${YELLOW}🔄 Step 1: Complete Project Backup${NC}"
create_backup "Complete" "$PROJECT_NAME-COMPLETE-$TIMESTAMP.tar.gz"

# 2. Source Code Backup (excluding node_modules and dist)
echo -e "${YELLOW}🔄 Step 2: Source Code Backup${NC}"
create_backup "Source Code" "$PROJECT_NAME-SOURCE-$TIMESTAMP.tar.gz" "node_modules dist .git"

# 3. Production Build Backup
echo -e "${YELLOW}🔄 Step 3: Production Build Backup${NC}"
if [ -d "dist" ]; then
    tar -czf "$BACKUP_DIR/$PROJECT_NAME-BUILD-$TIMESTAMP.tar.gz" dist/
    if [ $? -eq 0 ]; then
        local size=$(du -h "$BACKUP_DIR/$PROJECT_NAME-BUILD-$TIMESTAMP.tar.gz" | cut -f1)
        echo -e "${GREEN}✅ Production build backup created: $PROJECT_NAME-BUILD-$TIMESTAMP.tar.gz (Size: $size)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No dist folder found. Run 'npm run build' first.${NC}"
fi

# 4. Configuration Files Backup
echo -e "${YELLOW}🔄 Step 4: Configuration Files Backup${NC}"
mkdir -p "$BACKUP_DIR/configs-$TIMESTAMP"
cp package.json "$BACKUP_DIR/configs-$TIMESTAMP/"
cp vercel.json "$BACKUP_DIR/configs-$TIMESTAMP/"
cp netlify.toml "$BACKUP_DIR/configs-$TIMESTAMP/"
cp tsconfig*.json "$BACKUP_DIR/configs-$TIMESTAMP/"
cp vite.config.ts "$BACKUP_DIR/configs-$TIMESTAMP/"
cp tailwind.config.js "$BACKUP_DIR/configs-$TIMESTAMP/"
cp eslint.config.js "$BACKUP_DIR/configs-$TIMESTAMP/"

tar -czf "$BACKUP_DIR/$PROJECT_NAME-CONFIGS-$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "configs-$TIMESTAMP"
rm -rf "$BACKUP_DIR/configs-$TIMESTAMP"

if [ $? -eq 0 ]; then
    local size=$(du -h "$BACKUP_DIR/$PROJECT_NAME-CONFIGS-$TIMESTAMP.tar.gz" | cut -f1)
    echo -e "${GREEN}✅ Configuration backup created: $PROJECT_NAME-CONFIGS-$TIMESTAMP.tar.gz (Size: $size)${NC}"
fi

# 5. Database Backup (if MongoDB is running)
echo -e "${YELLOW}🔄 Step 5: Database Backup${NC}"
if command -v mongodump >/dev/null 2>&1; then
    mkdir -p "$BACKUP_DIR/db-$TIMESTAMP"
    mongodump --out "$BACKUP_DIR/db-$TIMESTAMP" --db whatsapp-clone 2>/dev/null
    if [ $? -eq 0 ]; then
        tar -czf "$BACKUP_DIR/$PROJECT_NAME-DATABASE-$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "db-$TIMESTAMP"
        rm -rf "$BACKUP_DIR/db-$TIMESTAMP"
        local size=$(du -h "$BACKUP_DIR/$PROJECT_NAME-DATABASE-$TIMESTAMP.tar.gz" | cut -f1)
        echo -e "${GREEN}✅ Database backup created: $PROJECT_NAME-DATABASE-$TIMESTAMP.tar.gz (Size: $size)${NC}"
    else
        echo -e "${YELLOW}⚠️  Database backup skipped (MongoDB not accessible)${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  MongoDB tools not found. Database backup skipped.${NC}"
fi

# 6. Create backup summary
echo ""
echo -e "${GREEN}📊 BACKUP SUMMARY${NC}"
echo "=================="
echo "📁 Backup directory: $BACKUP_DIR"
echo "📅 Timestamp: $TIMESTAMP"
echo ""

# List all backup files
echo "📋 Backup files created:"
ls -lh "$BACKUP_DIR"/*"$TIMESTAMP"* | while read line; do
    echo "   $line"
done

# 7. Create restore instructions
echo ""
echo -e "${BLUE}📖 RESTORE INSTRUCTIONS${NC}"
echo "========================"
cat > "$BACKUP_DIR/RESTORE-INSTRUCTIONS-$TIMESTAMP.txt" << EOF
WHATSAPP WEB CLONE - RESTORE INSTRUCTIONS
=========================================

Backup created on: $TIMESTAMP

RESTORE STEPS:
1. Extract the backup: tar -xzf backup-file.tar.gz
2. Install dependencies: npm install
3. Set up environment variables
4. Start the application: npm run dev

BACKUP FILES:
- COMPLETE: Full project backup
- SOURCE: Source code only (excludes node_modules, dist)
- BUILD: Production build files
- CONFIGS: Configuration files
- DATABASE: Database backup (if available)

DEPLOYMENT:
- Vercel: vercel --prod
- Netlify: netlify deploy --prod

For more details, see DEPLOYMENT-GUIDE.md
EOF

echo -e "${GREEN}✅ Restore instructions saved to: RESTORE-INSTRUCTIONS-$TIMESTAMP.txt${NC}"

# 8. Create cloud backup preparation
echo ""
echo -e "${BLUE}☁️  CLOUD BACKUP PREPARATION${NC}"
echo "================================"
echo "To backup to cloud services:"
echo "1. Google Drive: Upload $BACKUP_DIR folder"
echo "2. Dropbox: Sync $BACKUP_DIR folder"
echo "3. GitHub: Push to repository"
echo "4. External Drive: Copy $BACKUP_DIR folder"

# 9. Final status
echo ""
echo -e "${GREEN}🎉 PROJECT BACKUP COMPLETED SUCCESSFULLY!${NC}"
echo "================================================"
echo "📁 All backups saved in: $BACKUP_DIR"
echo "💾 Total backup size: $(du -sh $BACKUP_DIR | cut -f1)"
echo ""
echo "🔒 Your project is now safely backed up!"
echo "🌍 Ready for deployment to Vercel + Netlify!"
echo ""
echo "📚 Next steps:"
echo "1. Test deployment: ./test-deployment.sh"
echo "2. Deploy to Vercel: ./deploy-vercel.sh"
echo "3. Deploy to both: ./deploy-both.sh"
