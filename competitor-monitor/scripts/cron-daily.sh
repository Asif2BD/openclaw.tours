#!/bin/bash

# Competitor Monitor Cron Script
# Run daily at 8 AM

cd /root/.openclaw/workspace/competitor-monitor

echo "=== Competitor Monitor Daily Run ==="
echo "Started at: $(date)"

# Run full scan
echo ""
echo "[1/3] Running competitor scan..."
node scripts/scan-all.js

# Generate daily report
echo ""
echo "[2/3] Generating daily report..."
node scripts/report.js --daily

# Send Telegram alerts for unsent alerts
echo ""
echo "[3/3] Sending alerts..."
node scripts/send-alerts.js

echo ""
echo "=== Daily Run Complete ==="
echo "Finished at: $(date)"
