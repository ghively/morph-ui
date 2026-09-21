const fs = require('fs');
let code = fs.readFileSync('src/components/MessageContent.tsx', 'utf8');

code = code.replace(
  `  parsePillHref = (href: string) => {\n    const parts = href.split('#/');\n    return parts.length > 1 ? parts[parts.length - 1]! : null;\n  },`,
  `  parsePillHref = (href: string) => {\n    const parts = href.split('#/');\n    if (parts.length > 1) {\n      const segs = parts[parts.length - 1].split('/');\n      return segs[segs.length - 1];\n    }\n    return null;\n  },`
);

fs.writeFileSync('src/components/MessageContent.tsx', code);
