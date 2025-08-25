#!/usr/bin/env python3
"""
Générateur d'icônes PWA pour FitTracker
Crée des icônes PNG de base pour l'installation de l'app
"""

# Création d'icônes SVG converties en data URLs pour simuler des icônes
icon_sizes = [48, 72, 96, 128, 144, 152, 180, 192, 384, 512]

# Template SVG pour l'icône FitTracker
svg_template = '''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6200EA;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3700B3;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="{size}" height="{size}" fill="url(#grad1)" rx="{corner}"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="{font_size}" font-family="Arial, sans-serif" font-weight="bold">💪</text>
</svg>'''

# Création des fichiers SVG pour chaque taille
for size in icon_sizes:
    corner = size // 8  # Coins arrondis proportionnels
    font_size = size // 2  # Taille de police proportionnelle
    
    svg_content = svg_template.format(size=size, corner=corner, font_size=font_size)
    
    # Sauvegarder le fichier SVG
    filename = f"icon-{size}.svg"
    with open(filename, 'w') as f:
        f.write(svg_content)
    print(f"Created {filename}")

# Créer aussi un fichier HTML pour visualiser toutes les icônes
html_content = '''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>FitTracker Icons</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #f0f0f0;
        }
        .icon-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
        }
        .icon-item {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .icon-item img {
            max-width: 100%;
            height: auto;
        }
        .icon-item p {
            margin-top: 10px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <h1>FitTracker PWA Icons</h1>
    <div class="icon-grid">
'''

for size in icon_sizes:
    html_content += f'''
        <div class="icon-item">
            <img src="icon-{size}.svg" alt="Icon {size}x{size}">
            <p>{size}x{size}</p>
        </div>
'''

html_content += '''
    </div>
</body>
</html>'''

with open('icons-preview.html', 'w') as f:
    f.write(html_content)

print("\n✅ Toutes les icônes ont été créées!")
print("📱 Ces icônes permettent l'installation de l'app sur mobile")
print("🌐 Ouvrez icons-preview.html pour voir toutes les icônes")