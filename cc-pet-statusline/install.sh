#!/bin/bash

# CC Pet Statusline Installer
# This script helps you install and configure the pet statusline for Claude Code

set -e

echo "🐾 CC Pet Statusline Installer"
echo "=============================="
echo ""

# Get the absolute path of the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Make the script executable
echo "🔧 Making script executable..."
chmod +x "$SCRIPT_DIR/index.js"

# Step 3: Check for Claude Code settings
echo "⚙️  Configuring Claude Code..."

# Determine the target directory
if [ -n "$1" ]; then
    TARGET_DIR="$1"
else
    TARGET_DIR="$HOME"
    echo "No target directory specified, using home directory: $TARGET_DIR"
fi

CLAUDE_DIR="$TARGET_DIR/.claude"
SETTINGS_FILE="$CLAUDE_DIR/settings.json"

# Create .claude directory if it doesn't exist
mkdir -p "$CLAUDE_DIR"

# Check if settings.json exists
if [ -f "$SETTINGS_FILE" ]; then
    echo "Found existing settings.json"
    
    # Check if statusLine is already configured
    if grep -q "statusLine" "$SETTINGS_FILE"; then
        echo "⚠️  Warning: statusLine is already configured in settings.json"
        echo "Current configuration:"
        grep "statusLine" "$SETTINGS_FILE"
        echo ""
        read -p "Do you want to overwrite it? (y/n): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Skipping configuration update."
        else
            # Backup existing settings
            cp "$SETTINGS_FILE" "$SETTINGS_FILE.backup"
            echo "Backed up existing settings to $SETTINGS_FILE.backup"
            
            # Update statusLine using node for proper JSON handling
            node -e "
                const fs = require('fs');
                const settings = JSON.parse(fs.readFileSync('$SETTINGS_FILE', 'utf8'));
                settings.statusLine = {
                    type: 'command',
                    command: 'node $SCRIPT_DIR/index.js',
                    padding: 0
                };
                fs.writeFileSync('$SETTINGS_FILE', JSON.stringify(settings, null, 2));
            "
            echo "✅ Updated statusLine configuration"
        fi
    else
        # Add statusLine to existing settings
        node -e "
            const fs = require('fs');
            const settings = JSON.parse(fs.readFileSync('$SETTINGS_FILE', 'utf8'));
            settings.statusLine = {
                type: 'command',
                command: 'node $SCRIPT_DIR/index.js',
                padding: 0
            };
            fs.writeFileSync('$SETTINGS_FILE', JSON.stringify(settings, null, 2));
        "
        echo "✅ Added statusLine configuration"
    fi
else
    # Create new settings.json
    echo "{
  \"statusLine\": {
    \"type\": \"command\",
    \"command\": \"node $SCRIPT_DIR/index.js\",
    \"padding\": 0
  }
}" > "$SETTINGS_FILE"
    echo "✅ Created new settings.json with statusLine configuration"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "📝 Configuration location: $SETTINGS_FILE"
echo "📍 Script location: $SCRIPT_DIR/index.js"
echo ""
echo "🚀 Next steps:"
echo "1. Start or restart your Claude Code session"
echo "2. The pet statusline should appear at the bottom of your terminal"
echo "3. Watch your pet react to your token usage!"
echo ""
echo "🧪 Test the installation:"
echo "   npm test"
echo ""
echo "Happy coding with your new pet companion! 🐱"