#!/bin/bash
API_KEY=$(grep VITE_SUPABASE_ANON_KEY /c/Users/jsanz/Desktop/alcanza-limpiar/.env | cut -d= -f2)

echo "API Key length: ${#API_KEY}"

# Get the 8 franjas from yesterday (id=23)
curl --ssl-no-revoke -s "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.23&select=franjas" \
  -H "apikey: $API_KEY" \
  -H "Accept: application/json" -o /tmp/franjas23.json

echo "Got franjas from yesterday:"
cat /tmp/franjas23.json | python -c "
import json, sys
data = json.load(sys.stdin)
franjas = data[0]['franjas']
print(f'  Count: {len(franjas)}')
for s in franjas:
    print(f'  - {s[\"nombre\"]} ({s[\"hora_inicio\"]}-{s[\"hora_fin\"]})')
with open('/tmp/franjas_array.json', 'w') as f:
    json.dump(franjas, f)
"

# Update today's record (June 4, id=24)
FRANJAS=$(cat /tmp/franjas_array.json)
echo "Updating today's record (id=24)..."
curl --ssl-no-revoke -s -X PATCH "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.24" \
  -H "apikey: $API_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=minimal" \
  -d "{\"franjas\": $FRANJAS}"

echo ""
echo "Done!"
