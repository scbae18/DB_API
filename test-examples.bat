@echo off
REM API 테스트 예시 스크립트 (Windows Batch)
REM 다른 사용자가 쉽게 테스트할 수 있도록 제공하는 예시

set BASE_URL=%API_URL%
if "%BASE_URL%"=="" set BASE_URL=http://localhost:3000

echo 🧪 API 테스트 시작
echo 📍 Base URL: %BASE_URL%
echo.

echo 테스트: Health Check
curl -s %BASE_URL%/health
echo.
echo.

echo 테스트: 상품 정보 조회 (PRD-0001)
curl -s %BASE_URL%/api/products/PRD-0001
echo.
echo.

echo 테스트: 회원 정보 조회 (USR-0001)
curl -s %BASE_URL%/api/members/USR-0001
echo.
echo.

echo 테스트: 회원 주문 및 송장번호 조회
curl -s %BASE_URL%/api/orders/member/USR-0001/tracking
echo.
echo.

echo 테스트: 송장번호로 배송정보 조회
curl -s %BASE_URL%/api/shipments/tracking/811518691982
echo.
echo.

echo 테스트 완료!
