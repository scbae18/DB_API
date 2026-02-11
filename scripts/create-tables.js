const pool = require('../config/database');

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 상품정보 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS 상품정보 (
        "상품ID" VARCHAR(50) PRIMARY KEY,
        "카테고리" VARCHAR(50),
        "상품명" VARCHAR(200),
        "브랜드" VARCHAR(100),
        "정가(원)" INTEGER,
        "판매가(원)" INTEGER,
        "할인율(%)" INTEGER,
        "재고수량" INTEGER,
        "상품상태" VARCHAR(50),
        "등록일" DATE,
        "최종수정일" DATE,
        "상품설명" TEXT,
        "대표이미지URL" VARCHAR(500),
        "평점" DECIMAL(3,1),
        "리뷰수" INTEGER,
        "판매수" INTEGER
      )
    `);

    // 회원정보 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS 회원정보 (
        "회원ID" VARCHAR(50) PRIMARY KEY,
        "로그인ID" VARCHAR(100),
        "비밀번호(해시)" VARCHAR(255),
        "이름" VARCHAR(100),
        "이메일" VARCHAR(200),
        "전화번호" VARCHAR(20),
        "생년월일" DATE,
        "성별" VARCHAR(1),
        "우편번호" VARCHAR(10),
        "기본주소" VARCHAR(200),
        "상세주소" VARCHAR(200),
        "가입일" DATE,
        "최근로그인" DATE,
        "회원등급" VARCHAR(50),
        "적립포인트" INTEGER,
        "총주문수" INTEGER,
        "총주문금액(원)" INTEGER,
        "상태" VARCHAR(50),
        "마케팅동의" VARCHAR(1)
      )
    `);

    // 주문정보 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS 주문정보 (
        "주문ID" VARCHAR(50) PRIMARY KEY,
        "회원ID" VARCHAR(50),
        "주문일시" TIMESTAMP,
        "주문상태" VARCHAR(50),
        "결제방법" VARCHAR(50),
        "결제금액(원)" INTEGER,
        "할인금액(원)" INTEGER,
        "배송비(원)" INTEGER,
        "최종결제금액(원)" INTEGER,
        "수령인" VARCHAR(100),
        "수령인연락처" VARCHAR(20),
        "배송주소" VARCHAR(500),
        "배송메모" TEXT,
        "쿠폰코드" VARCHAR(50),
        FOREIGN KEY ("회원ID") REFERENCES 회원정보("회원ID")
      )
    `);

    // 배송정보 테이블
    await client.query(`
      CREATE TABLE IF NOT EXISTS 배송정보 (
        "배송ID" VARCHAR(50) PRIMARY KEY,
        "주문ID" VARCHAR(50),
        "택배사" VARCHAR(50),
        "송장번호" VARCHAR(100) UNIQUE,
        "배송상태" VARCHAR(50),
        "발송일" DATE,
        "예상도착일" DATE,
        "실제도착일" DATE,
        "수령인" VARCHAR(100),
        "수령인연락처" VARCHAR(20),
        "배송주소" VARCHAR(500),
        "배송메모" TEXT,
        "배송추적URL" VARCHAR(500),
        FOREIGN KEY ("주문ID") REFERENCES 주문정보("주문ID")
      )
    `);

    // 인덱스 생성
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_주문정보_회원ID ON 주문정보("회원ID")
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_배송정보_주문ID ON 배송정보("주문ID")
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_배송정보_송장번호 ON 배송정보("송장번호")
    `);

    await client.query('COMMIT');
    console.log('✅ Tables created successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// 실행
createTables()
  .then(() => {
    console.log('Database setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  });
