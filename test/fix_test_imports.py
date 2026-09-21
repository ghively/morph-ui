import os
import glob
import re

for filepath in glob.glob('test/*.tsx'):
    with open(filepath, 'r') as f:
        content = f.read()

    # remove unused act, screen, unmount, rerender, getByText etc
    content = re.sub(r'import \{[^}]*?\b(act)\b[^}]*\} from \'@testing-library/react\';\n', lambda m: m.group(0).replace('act', ''), content)
    # Actually just use simple sed lines or ignore unused vars via eslintrc
