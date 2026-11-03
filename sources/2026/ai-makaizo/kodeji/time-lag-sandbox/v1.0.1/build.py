"""Rebuild the offline, single-file artwork using only Python's standard library."""
from pathlib import Path
import hashlib

ROOT = Path(__file__).resolve().parent
shell = (ROOT / 'src/shell.html').read_text()
world = (ROOT / 'src/world.js').read_text()
app = (ROOT / 'src/app.js').read_text()
license_text = (ROOT / 'reference/SANDSPIEL-MIT.txt').read_text()
assert hashlib.sha256(license_text.encode()).hexdigest() == (ROOT / 'reference/license.sha256').read_text().strip(), 'License changed'
from html import escape
output = shell.replace('<!-- ENGINE_AND_APP -->', '<script>\n' + world + '\n' + app + '\n</script>').replace('<!-- MIT_LICENSE -->', escape(license_text))
assert '<!-- ENGINE_AND_APP -->' not in output
(ROOT / 'release').mkdir(exist_ok=True)
(ROOT / 'release/index.html').write_text(output)
(ROOT / 'release/LICENSES.txt').write_text('時差のある砂場 / こでじ\n\nSandspiel-derived sand and water rules:\n' + license_text + '\nOther code and graphics: new work by こでじ. No external libraries, images, audio or font files are included.\n')
print('Built release/index.html')
