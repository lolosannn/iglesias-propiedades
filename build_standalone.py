"""Genera Iglesias-boceto-web.html: un único archivo con CSS, JS e imágenes embebidas."""
import base64, os, re
root = os.path.dirname(os.path.abspath(__file__))
os.chdir(root)
html = open('index.html', encoding='utf-8').read()
js = open('js/app.js', encoding='utf-8').read()

def data_uri(path):
    mime = 'image/png' if path.endswith('.png') else 'image/jpeg'
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

imgs = sorted(set(re.findall(r'img/[\w\-]+\.(?:jpg|png)', html + js)))
for path in imgs:
    if os.path.exists(path):
        uri = data_uri(path)
        html = html.replace(path, uri)
        js = js.replace(path, uri)
html = html.replace('<script src="js/app.js"></script>', '<script>\n' + js + '\n</script>')
open('Iglesias-boceto-web.html', 'w', encoding='utf-8').write(html)
print('ok', len(imgs), 'imágenes')
