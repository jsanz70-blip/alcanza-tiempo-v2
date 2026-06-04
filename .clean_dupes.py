import json, urllib.request

env_path = 'C:/Users/jsanz/Desktop/alcanza-limpiar/.env'
with open(env_path) as f:
    for line in f:
        if 'VITE_SUPABASE_ANON_KEY' in line:
            api_key = line.strip().split('=', 1)[1]
            break

print(f"Key length: {len(api_key)}")

# Get all records
url = "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?select=id,fecha,franjas&order=fecha.desc"
req = urllib.request.Request(url)
req.add_header('apikey', api_key)
req.add_header('Accept', 'application/json')
response = urllib.request.urlopen(req)
data = json.loads(response.read().decode())

# Group by date
from collections import defaultdict
by_date = defaultdict(list)
for d in data:
    by_date[d['fecha']].append(d)

duplicates = [(date, records) for date, records in by_date.items() if len(records) > 1]
print(f"Found {len(duplicates)} dates with duplicates:")

deleted_count = 0
for date, records in duplicates:
    for r in records:
        f = r.get('franjas', [])
        if isinstance(f, str): f = json.loads(f) if f else []
        count = len(f) if isinstance(f, list) else 0
        print(f"  {date}: id={r['id']}, franjas={count}")
    
    sorted_records = sorted(records, key=lambda r: len(r.get('franjas', []) or []) if isinstance(r.get('franjas', []), list) else 0, reverse=True)
    keep = sorted_records[0]
    to_delete = [r for r in sorted_records[1:]]
    print(f"  -> Keeping id={keep['id']}, deleting: {[r['id'] for r in to_delete]}")
    
    for r in to_delete:
        del_url = f"https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/daily_objectives?id=eq.{r['id']}"
        del_req = urllib.request.Request(del_url, method='DELETE')
        del_req.add_header('apikey', api_key)
        del_req.add_header('Prefer', 'return=minimal')
        try:
            del_resp = urllib.request.urlopen(del_req)
            print(f"    Deleted id={r['id']}: HTTP {del_resp.status}")
            deleted_count += 1
        except Exception as e:
            print(f"    Error: {e}")

print(f"\nDeleted {deleted_count} duplicate records. Done!")
