import urllib.request
import json

url = "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/tareas?select=id&limit=1"
headers = {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcWdxd21pa3dveW50d2Roc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNjYwOTEsImV4cCI6MjA5NTg0MjA5MX0.mRmx7v84_fyg2BqgaNHKpDf4D3UxHfNQRejHaqUXXhE",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcWdxd21pa3dveW50d2Roc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNjYwOTEsImV4cCI6MjA5NTg0MjA5MX0.mRmx7v84_fyg2BqgaNHKpDf4D3UxHfNQRejHaqUXXhE",
    "Accept": "application/json"
}

# Test tareas table exists
req = urllib.request.Request(url, headers=headers)
resp = urllib.request.urlopen(req)
print(f"tareas table: OK - {resp.status}")

# Try to see if checklists table exists
url2 = "https://zaqgqwmikwoyntwdhskh.supabase.co/rest/v1/checklists?select=id&limit=1"
req2 = urllib.request.Request(url2, headers=headers)
try:
    resp2 = urllib.request.urlopen(req2)
    print(f"checklists table: OK - {resp2.status}")
except urllib.error.HTTPError as e:
    print(f"checklists table: {e.code} - {e.reason}")
    if e.code == 404:
        print("Table 'checklists' does not exist")
    elif e.code == 406:
        body = e.read().decode()
        print(f"Body: {body}")
except Exception as e:
    print(f"checklists table error: {e}")
