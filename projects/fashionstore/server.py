import http.server
import socketserver
import os

PORT = 8082
os.chdir('/home/user/webapp/projects/fashionstore')

Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"Fashion Store server running on port {PORT}")
    httpd.serve_forever()
