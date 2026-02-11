# 배포 정보

## 배포된 서버 주소

> ⚠️ **주의**: 실제 배포된 서버 주소는 환경 변수나 별도 설정 파일에서 관리하세요.

- **API 서버**: `http://YOUR_SERVER_IP:3000`
- **Swagger 문서**: `http://YOUR_SERVER_IP:3000/api-docs`
- **Health Check**: `http://YOUR_SERVER_IP:3000/health`

실제 서버 주소를 사용하려면 환경 변수 `PRODUCTION_URL`을 설정하거나 `test-production.js` 파일을 수정하세요.

## 배포된 서버 테스트

### 자동화 테스트 실행

```bash
npm run test:prod
```

또는

```bash
node test-production.js
```

### 수동 테스트 (cURL)

```bash
# 환경 변수로 서버 URL 설정
export PRODUCTION_URL=http://YOUR_SERVER_IP:3000

# Health Check
curl $PRODUCTION_URL/health

# 상품 정보 조회
curl $PRODUCTION_URL/api/products/PRD-0001

# 회원 정보 조회
curl $PRODUCTION_URL/api/members/USR-0001

# 회원 주문 및 송장번호 조회
curl $PRODUCTION_URL/api/orders/member/USR-0001/tracking

# 송장번호로 배송정보 조회
curl $PRODUCTION_URL/api/shipments/tracking/811518691982
```

### 브라우저에서 테스트

1. **Swagger UI**: `http://YOUR_SERVER_IP:3000/api-docs`
2. **Health Check**: `http://YOUR_SERVER_IP:3000/health`
3. **API 엔드포인트 직접 접속**:
   - `http://YOUR_SERVER_IP:3000/api/products/PRD-0001`
   - `http://YOUR_SERVER_IP:3000/api/members/USR-0001`
   - `http://YOUR_SERVER_IP:3000/api/orders/member/USR-0001/tracking`
   - `http://YOUR_SERVER_IP:3000/api/shipments/tracking/811518691982`

### Postman 사용

Postman에서 `base_url` 변수를 실제 서버 주소로 설정하고 테스트하세요.

## API 엔드포인트 목록

### 1. 상품 정보 조회
```
GET http://YOUR_SERVER_IP:3000/api/products/:productId
```

**예시:**
```
GET http://YOUR_SERVER_IP:3000/api/products/PRD-0001
```

### 2. 회원 정보 조회
```
GET http://YOUR_SERVER_IP:3000/api/members/:memberId
```

**예시:**
```
GET http://YOUR_SERVER_IP:3000/api/members/USR-0001
```

### 3. 회원 주문 및 송장번호 조회
```
GET http://YOUR_SERVER_IP:3000/api/orders/member/:memberId/tracking
```

**예시:**
```
GET http://YOUR_SERVER_IP:3000/api/orders/member/USR-0001/tracking
```

### 4. 송장번호로 배송정보 조회
```
GET http://YOUR_SERVER_IP:3000/api/shipments/tracking/:trackingNumber
```

**예시:**
```
GET http://YOUR_SERVER_IP:3000/api/shipments/tracking/811518691982
```

## 응답 형식

### 성공 응답
```json
{
  "success": true,
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지"
}
```

## 문제 해결

### 서버에 연결할 수 없는 경우

1. 서버가 실행 중인지 확인
2. 방화벽 설정 확인 (포트 3000이 열려있는지)
3. EC2 보안 그룹 설정 확인

### CORS 오류

브라우저에서 다른 도메인으로 요청할 때 CORS 오류가 발생할 수 있습니다. 이 경우:
- 서버의 CORS 설정 확인
- 프록시 서버 사용 고려

### 응답이 느린 경우

- 데이터베이스 연결 상태 확인
- 서버 리소스 사용량 확인
- 네트워크 상태 확인
