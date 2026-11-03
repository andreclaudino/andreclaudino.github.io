#!/usr/bin/env bash
# Submit every URL in sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver).
# The key file (<key>.txt, containing the key) must already be live at the site root.
#
# Usage: scripts/indexnow-submit.sh
set -euo pipefail

HOST="andreclaudino.com"
KEY_FILE=$(ls -1 ./*.txt | xargs -n1 basename | grep -E '^[0-9a-f]{32}\.txt$' | head -n1 || true)

if [[ -z "${KEY_FILE}" ]]; then
  echo "No IndexNow key file (<32 hex chars>.txt) found in the site root." >&2
  exit 1
fi
KEY="${KEY_FILE%.txt}"

URLS=$(grep -o '<loc>[^<]*</loc>' sitemap.xml | sed 's#</\?loc>##g' | paste -sd, -)

echo "Submitting to IndexNow: ${URLS}"
curl -sS -o /dev/null -w 'HTTP %{http_code}\n' \
  -X POST "https://api.indexnow.org/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d "{\"host\":\"${HOST}\",\"key\":\"${KEY}\",\"keyLocation\":\"https://${HOST}/${KEY_FILE}\",\"urlList\":[$(echo "${URLS}" | sed 's/,/","/g; s/^/"/; s/$/"/')]}"
