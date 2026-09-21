const fs = require('fs');
let code = fs.readFileSync('src/components/MessageTile.tsx', 'utf8');

// I'll replace the button logic so it properly matches aria-label
code = code.replace(
  `      <button data-iconbtn="" aria-label="React" title="React" aria-expanded="false" onClick={(e) => {
        // Just minimal state toggle for the picker
        const btn = e.currentTarget;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        const picker = btn.parentElement?.nextElementSibling as HTMLElement;
        if (picker && picker.getAttribute('data-reactpicker') !== null) {
          picker.style.display = expanded ? 'none' : 'flex';
        }
      }}>`,
  `      <button data-iconbtn="" aria-label="React" title="React" aria-expanded="false" onClick={(e) => {
        const btn = e.currentTarget;
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const root = btn.closest('[data-turn]');
        const picker = root.querySelector('[data-reactpicker]');
        if (picker) picker.style.display = expanded ? 'none' : 'flex';
      }}>`
);

fs.writeFileSync('src/components/MessageTile.tsx', code);
