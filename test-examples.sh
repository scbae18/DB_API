#!/bin/bash

# API 테스트 예시 스크립트 (Bash)
# 다른 사용자가 쉽게 테스트할 수 있도록 제공하는 예시

BASE_URL="${API_URL:-http://localhost:3000}"

echo "🧪 API 테스트 시작"
echo "📍 Base URL: $BASE_URL"
echo ""

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 테스트 함수
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo "테스트: $name"
    echo "URL: $url"
    
    response=$(curl -s -w "\n%{http_code}" "$url")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ 성공${NC} (HTTP $http_code)"
        echo "응답: $body" | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ 실패${NC} (HTTP $http_code, 예상: $expected_status)"
        echo "응답: $body"
    fi
    echo ""
}

# Health Check
test_endpoint "Health Check" "$BASE_URL/health"

# 상품 정보 조회
test_endpoint "상품 정보 조회 (PRD-0001)" "$BASE_URL/api/products/PRD-0001"
test_endpoint "존재하지 않는 상품 조회" "$BASE_URL/api/products/PRD-9999" 404

# 회원 정보 조회
test_endpoint "회원 정보 조회 (USR-0001)" "$BASE_URL/api/members/USR-0001"
test_endpoint "존재하지 않는 회원 조회" "$BASE_URL/api/members/USR-9999" 404

# 회원 주문 및 송장번호 조회
test_endpoint "회원 주문 및 송장번호 조회" "$BASE_URL/api/orders/member/USR-0001/tracking"

# 송장번호로 배송정보 조회
test_endpoint "송장번호로 배송정보 조회" "$BASE_URL/api/shipments/tracking/811518691982"
test_endpoint "존재하지 않는 송장번호 조회" "$BASE_URL/api/shipments/tracking/000000000000" 404

echo -e "${YELLOW}테스트 완료!${NC}"
