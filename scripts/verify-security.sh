#!/bin/bash

# Configuration
BASE_URL="http://localhost:3001"
TOKEN="test-token"
SECRET="test-secret"

# 1. Test revalidate-media WITHOUT token (Should fail)
echo "Testing revalidate-media (No Token)..."
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/api/revalidate-media")
if [ "$CODE" == "401" ] || [ "$CODE" == "500" ]; then
    echo "PASS: Rejected with $CODE"
else
    echo "FAIL: Unexpected code $CODE"
fi

# 2. Test revalidate-media WITH WRONG token (Should fail)
echo "Testing revalidate-media (Wrong Token)..."
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: Bearer wrong" "${BASE_URL}/api/revalidate-media")
if [ "$CODE" == "401" ]; then
    echo "PASS: Rejected with $CODE"
else
    echo "FAIL: Unexpected code $CODE"
fi

# 3. Test revalidate-media WITH CORRECT token (Should pass)
# Note: This requires the server to be running with REVALIDATE_TOKEN=test-token
echo "Testing revalidate-media (Correct Token)..."
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Authorization: Bearer ${TOKEN}" "${BASE_URL}/api/revalidate-media")
if [ "$CODE" == "200" ]; then
    echo "PASS: Accepted with $CODE"
else
    echo "FAIL: Unexpected code $CODE"
fi

# 4. Test cloudinary-webhook WITHOUT secret (Should fail/ignore)
echo "Testing cloudinary-webhook (No Secret)..."
# The webhook route returns 200 {message: 'Event ignored'} if payload type doesn't match, 
# or 401 if signature bad.
# We need to simulate a relevant event type AND signature.
# Ideally we should send a signed request. 
# For now, let's just check if it rejects empty/bad signature if we send a relevant event.

PAYLOAD='{"notification_type":"upload", "public_id":"test"}'
TIMESTAMP=$(date +%s)
# Valid signature calculation is complex in bash without xxd/openssl and precise formatting.
# We will just test that it FAILS with bad signature.

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "x-cld-timestamp: ${TIMESTAMP}" \
    -H "x-cld-signature: badsignature" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" \
    "${BASE_URL}/api/cloudinary-webhook")

if [ "$CODE" == "401" ]; then
    echo "PASS: Rejected bad signature with $CODE"
else
    echo "FAIL: Unexpected code $CODE"
fi

