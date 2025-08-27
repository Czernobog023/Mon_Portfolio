import http.server
import socketserver
import os

PORT = 8081
os.chdir('/home/user/webapp/projects/legourmet')

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Le Gourmet server running on port {PORT}")
    httpd.serve_forever()
