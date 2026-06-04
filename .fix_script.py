import json, urllib.request, os

env_path = 'C:/Users/jsanz/Desktop/alcanza-limpiar/.env'
with open(env_path) as f:
    for line in f:
        if 'VITE_SUPABASE_ANON_KEY' in line:
            api_key = line.strip().split('=', 1)[1]
            break

print(f"Key length: {len(api_key)}")

# Get franjas from id=23 (yesterday's record)
url = "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.23&select=franjas"
req = urllib.request.Request(url)
req.add_header('apikey', api_key)
req.add_header('Accept', 'application/json')
response = urllib.request.urlopen(req)
data = json.loads(response.read().decode())
franjas = data[0]['franjas']
print(f"Found {len(franjas)} franjas")
for s in franjas:
    print(f"  - {s['nombre']} ({s['hora_inicio']}-{s['hora_fin']})")

# Update id=24 (today's record)
url2 = "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.24"
payload = json.dumps({"franjas": franjas}).encode('utf-8')
req2 = urllib.request.Request(url2, data=payload, method='PATCH')
req2.add_header('apikey', api_key)
req2.add_header('Content-Type', 'application/json')
req2.add_header('Prefer', 'return=minimal')
response2 = urllib.request.urlopen(req2)
print(f"Update response: HTTP {response2.status}")

# Verify
req3 = urllib.request.Request("https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.24&select=franjas")
req3.add_header('apikey', api_key)
req3.add_header('Accept', 'application/json')
response3 = urllib.request.urlopen(req3)
updated = json.loads(response3.read().decode())
print(f"After update: June 4 has {len(updated[0]['franjas'])} franjas")
for s in updated[0]['franjas']:
    print(f"  - {s['nombre']}")
print("DONE!")
