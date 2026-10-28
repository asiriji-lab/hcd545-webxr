#!/usr/bin/env bash
# Builds every lab folder (lab1, lab2, lab3 ... each with its own package.json) into _site/<lab>/ and writes a home page that links them.
set -euo pipefail

cd "$(dirname "$0")/../.."
rm -rf _site
mkdir -p _site

links=""
for dir in lab*/; do
  lab="${dir%/}"
  [ -f "$lab/package.json" ] || continue
  echo "::group::Build $lab"
  (cd "$lab" && npm ci && npm run build)
  mkdir -p "_site/$lab"
  cp -r "$lab/dist/." "_site/$lab/"
  echo "::endgroup::"
  links="$links      <li><a href=\"./$lab/\">${lab/lab/Lab }</a></li>"$'\n'
done

touch _site/.nojekyll
cat > _site/index.html <<EOF
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>HCD-545 WebXR</title>
  <style>body{font:16px/1.55 system-ui,sans-serif;max-width:36rem;margin:2rem auto;padding:0 1rem;color:#222}a{color:#ca092b}li{margin:.4rem 0}</style>
</head>
<body>
  <main>
    <h1>HCD-545 WebXR</h1>
    <p>Virtual Reality | CMKL University</p>
    <ul>
${links}    </ul>
  </main>
</body>
</html>
EOF
echo "Built:$(printf '%s' "$links" | grep -o 'href="[^"]*"' | tr '\n' ' ')"
