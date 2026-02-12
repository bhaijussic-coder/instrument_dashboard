Place your instrument images in this folder and name them as you prefer.

Preferred approach (automatic mapping):
- Put all images in `public/images/` with any filenames.
- Run `node scripts/mapImages.js` to generate `public/images/manifest.json` mapping filenames to instrument names.

Manual approach (explicit mapping):
- Copy `manifest.template.json` to `manifest.json` and edit entries:
  {
    "filename.jpg": { "instrument": "Monopolar_Hook", "refCode": "120014", "desc": "Curved scissors" }
  }

Image filenames are matched to instrument names using a best-effort fuzzy rule. The app will prefer `public/images/<slug>.jpg` when showing featured instruments; if not found it falls back to a placeholder image.
