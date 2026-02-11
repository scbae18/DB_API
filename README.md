# Shopping Mall API

엑셀 데이터를 PostgreSQL 데이터베이스로 마이그레이션하고 RESTful API를 제공하는 프로젝트입니다.

## 🌐 배포된 서버

배포된 서버 정보는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참고하세요.

배포된 서버 테스트: `npm run test:prod` 또는 환경 변수로 서버 URL 설정

## 기술 스택

- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (Neon)
- **Documentation**: Swagger/OpenAPI
- **Package Manager**: npm

## 프로젝트 구조

```
DB_API/
├── config/
│   └── database.js          # 데이터베이스 연결 설정
├── routes/
│   ├── products.js          # 상품 API 라우트
│   ├── members.js           # 회원 API 라우트
│   ├── orders.js            # 주문 API 라우트
│   └── shipments.js         # 배송 API 라우트
├── scripts/
│   ├── create-tables.js     # 테이블 생성 스크립트
│   └── migrate-excel-to-db.js  # 엑셀 데이터 마이그레이션 스크립트
├── server.js                # Express 서버
├── package.json
├── .env                     # 환경 변수 (생성 필요)
└── README.md
```

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# Server Configuration
PORT=3000
NODE_ENV=development
```

또는 `env.example` 파일을 복사하여 `.env` 파일을 만들 수 있습니다:

```bash
cp env.example .env
```

**Neon 데이터베이스 연결 문자열 가져오기:**
1. [Neon Console](https://console.neon.tech)에 로그인
2. 프로젝트 선택
3. "Connection Details" 또는 "Connection String"에서 연결 문자열 복사
4. `.env` 파일의 `DATABASE_URL`에 붙여넣기

### 3. 데이터베이스 테이블 생성

```bash
node scripts/create-tables.js
```

### 4. 엑셀 데이터 마이그레이션

```bash
npm run migrate
```

또는

```bash
node scripts/migrate-excel-to-db.js
```

## API 엔드포인트

### 1. 상품 정보 조회
```
GET /api/products/:productId
```

**예시:**
```bash
curl http://localhost:3000/api/products/PRD-0001
```

### 2. 회원 정보 조회
```
GET /api/members/:memberId
```

**예시:**
```bash
curl http://localhost:3000/api/members/USR-0001
```

### 3. 회원 주문 및 송장번호 조회
```
GET /api/orders/member/:memberId/tracking
```

**예시:**
```bash
curl http://localhost:3000/api/orders/member/USR-0001/tracking
```

**응답 예시:**
```json
{
  "success": true,
  "data": [
    {
      "주문ID": "ORD-00001",
      "송장번호": "811518691982",
      "택배사": "한진택배",
      "배송상태": "배송완료",
      "배송추적URL": "https://tracker.example.com/한진택배/811518691982"
    }
  ]
}
```

### 4. 송장번호로 배송정보 조회
```
GET /api/shipments/tracking/:trackingNumber
```

**예시:**
```bash
curl http://localhost:3000/api/shipments/tracking/811518691982
```

## 서버 실행

### 개발 모드
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버가 실행되면:
- API 서버: http://localhost:3000
- Swagger 문서: http://localhost:3000/api-docs
- Health check: http://localhost:3000/health

## API 테스트

### 자동화 테스트 실행

```bash
npm test
# 또는
npm run test:api
```

이 명령어는 모든 API 엔드포인트를 자동으로 테스트합니다.

### 수동 테스트 방법

자세한 테스트 가이드는 [TEST_GUIDE.md](./TEST_GUIDE.md)를 참고하세요.

**빠른 테스트 (cURL):**
```bash
# Health Check
curl http://localhost:3000/health

# 상품 정보 조회
curl http://localhost:3000/api/products/PRD-0001

# 회원 정보 조회
curl http://localhost:3000/api/members/USR-0001

# 회원 주문 및 송장번호 조회
curl http://localhost:3000/api/orders/member/USR-0001/tracking

# 송장번호로 배송정보 조회
curl http://localhost:3000/api/shipments/tracking/811518691982
```

**Postman 사용:**
1. Postman에서 `postman-collection.json` 파일을 Import
2. `base_url` 변수를 설정 (기본값: http://localhost:3000)
3. 각 요청을 실행하여 테스트

**Swagger UI 사용:**
1. http://localhost:3000/api-docs 접속
2. 각 API를 클릭하고 "Try it out" 버튼 사용

## Swagger API 문서

서버 실행 후 브라우저에서 다음 URL로 접속하여 API 문서를 확인할 수 있습니다:

```
http://localhost:3000/api-docs
```

## AWS 배포 가이드

### 1. AWS EC2 인스턴스 설정

1. EC2 인스턴스 생성 (Ubuntu 22.04 LTS 권장)
2. 보안 그룹 설정:
   - 인바운드 규칙: HTTP (80), HTTPS (443), SSH (22)
   - 필요시 커스텀 TCP 포트 (3000) 추가

### 2. 서버 환경 설정

```bash
# Node.js 설치 (Node.js 18.x 이상)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치 (프로세스 관리자)
sudo npm install -g pm2

# 프로젝트 클론 또는 업로드
git clone <your-repo-url>
cd DB_API

# 의존성 설치
npm install --production
```

### 3. 환경 변수 설정

```bash
# .env 파일 생성
nano .env

# DATABASE_URL과 기타 설정 추가
```

### 4. 데이터베이스 마이그레이션

```bash
# 테이블 생성
node scripts/create-tables.js

# 데이터 마이그레이션
npm run migrate
```

### 5. PM2로 서버 실행

```bash
# PM2로 서버 시작
pm2 start server.js --name "shopping-mall-api"

# 서버 자동 재시작 설정
pm2 startup
pm2 save

# 서버 상태 확인
pm2 status
pm2 logs shopping-mall-api
```

### 6. Nginx 리버스 프록시 설정 (선택사항)

```bash
# Nginx 설치
sudo apt-get update
sudo apt-get install nginx

# 설정 파일 생성
sudo nano /etc/nginx/sites-available/shopping-mall-api
```

Nginx 설정 파일 내용:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/shopping-mall-api /etc/nginx/sites-enabled/

# Nginx 재시작
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL 인증서 설정 (Let's Encrypt)

```bash
# Certbot 설치
sudo apt-get install certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d your-domain.com
```

## 문제 해결

### 데이터베이스 연결 오류

1. `.env` 파일의 `DATABASE_URL` 확인
2. Neon 데이터베이스가 활성화되어 있는지 확인
3. 방화벽 설정 확인 (Neon은 자동으로 처리)

### 포트 충돌

`.env` 파일에서 `PORT` 값을 변경하거나, 다른 포트를 사용하세요.

### 마이그레이션 오류

1. 테이블이 생성되었는지 확인: `node scripts/create-tables.js`
2. 엑셀 파일 경로 확인
3. 데이터베이스 연결 확인

## 개발 팁

- Swagger 문서는 코드 주석을 기반으로 자동 생성됩니다
- API 라우트 파일의 JSDoc 주석을 수정하면 Swagger 문서가 자동 업데이트됩니다
- 개발 중에는 `npm run dev`를 사용하여 nodemon으로 자동 재시작됩니다

## 라이선스

ISC
