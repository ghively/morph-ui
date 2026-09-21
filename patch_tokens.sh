#!/bin/bash
# Append to src/tokens.css if not already there
if ! grep -q "\-\-s5" src/tokens.css; then
  echo "Adding tokens..."
  # Just to be safe, append it to the end of the file
  cat << 'CSS' >> src/tokens.css

:root {
  /* Wave 3 message surface tokens */
  --s5: 16px;
  --seam: 2px;
  --r-card: 20px;
  --t-num: 11px;
  --el1: none;
  --sec: #3f83f5;
  --sec-soft: rgba(80, 137, 236, 0.18);
  --d4: calc(540ms * var(--d-scale, 1));
  --ease-emph: cubic-bezier(0.34, 0.8, 0.34, 1);
}
CSS
fi
