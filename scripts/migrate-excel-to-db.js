const XLSX = require('xlsx');
const path = require('path');
const pool = require('../config/database');

const excelFilePath = path.join(__dirname, '..', '쇼핑몰_CS챗봇_더미데이터.xlsx');

const migrateData = async () => {
  const workbook = XLSX.readFile(excelFilePath);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 상품정보 마이그레이션
    if (workbook.SheetNames.includes('상품정보')) {
      const 상품정보 = XLSX.utils.sheet_to_json(workbook.Sheets['상품정보']);
      console.log(`📦 Migrating ${상품정보.length} products...`);
      
      for (const row of 상품정보) {
        await client.query(`
          INSERT INTO 상품정보 (
            "상품ID", "카테고리", "상품명", "브랜드", "정가(원)", "판매가(원)",
            "할인율(%)", "재고수량", "상품상태", "등록일", "최종수정일",
            "상품설명", "대표이미지URL", "평점", "리뷰수", "판매수"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT ("상품ID") DO UPDATE SET
            "카테고리" = EXCLUDED."카테고리",
            "상품명" = EXCLUDED."상품명",
            "브랜드" = EXCLUDED."브랜드",
            "정가(원)" = EXCLUDED."정가(원)",
            "판매가(원)" = EXCLUDED."판매가(원)",
            "할인율(%)" = EXCLUDED."할인율(%)",
            "재고수량" = EXCLUDED."재고수량",
            "상품상태" = EXCLUDED."상품상태",
            "등록일" = EXCLUDED."등록일",
            "최종수정일" = EXCLUDED."최종수정일",
            "상품설명" = EXCLUDED."상품설명",
            "대표이미지URL" = EXCLUDED."대표이미지URL",
            "평점" = EXCLUDED."평점",
            "리뷰수" = EXCLUDED."리뷰수",
            "판매수" = EXCLUDED."판매수"
        `, [
          row['상품ID'], row['카테고리'], row['상품명'], row['브랜드'],
          row['정가(원)'], row['판매가(원)'], row['할인율(%)'], row['재고수량'],
          row['상품상태'], row['등록일'] || null, row['최종수정일'] || null,
          row['상품설명'], row['대표이미지URL'], row['평점'], row['리뷰수'], row['판매수']
        ]);
      }
      console.log('✅ Products migrated');
    }

    // 회원정보 마이그레이션
    if (workbook.SheetNames.includes('회원정보')) {
      const 회원정보 = XLSX.utils.sheet_to_json(workbook.Sheets['회원정보']);
      console.log(`👥 Migrating ${회원정보.length} members...`);
      
      for (const row of 회원정보) {
        await client.query(`
          INSERT INTO 회원정보 (
            "회원ID", "로그인ID", "비밀번호(해시)", "이름", "이메일", "전화번호",
            "생년월일", "성별", "우편번호", "기본주소", "상세주소", "가입일",
            "최근로그인", "회원등급", "적립포인트", "총주문수", "총주문금액(원)", "상태", "마케팅동의"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT ("회원ID") DO UPDATE SET
            "로그인ID" = EXCLUDED."로그인ID",
            "비밀번호(해시)" = EXCLUDED."비밀번호(해시)",
            "이름" = EXCLUDED."이름",
            "이메일" = EXCLUDED."이메일",
            "전화번호" = EXCLUDED."전화번호",
            "생년월일" = EXCLUDED."생년월일",
            "성별" = EXCLUDED."성별",
            "우편번호" = EXCLUDED."우편번호",
            "기본주소" = EXCLUDED."기본주소",
            "상세주소" = EXCLUDED."상세주소",
            "가입일" = EXCLUDED."가입일",
            "최근로그인" = EXCLUDED."최근로그인",
            "회원등급" = EXCLUDED."회원등급",
            "적립포인트" = EXCLUDED."적립포인트",
            "총주문수" = EXCLUDED."총주문수",
            "총주문금액(원)" = EXCLUDED."총주문금액(원)",
            "상태" = EXCLUDED."상태",
            "마케팅동의" = EXCLUDED."마케팅동의"
        `, [
          row['회원ID'], row['로그인ID'], row['비밀번호(해시)'], row['이름'],
          row['이메일'], row['전화번호'], row['생년월일'] || null, row['성별'],
          row['우편번호'], row['기본주소'], row['상세주소'], row['가입일'] || null,
          row['최근로그인'] || null, row['회원등급'], row['적립포인트'],
          row['총주문수'], row['총주문금액(원)'], row['상태'], row['마케팅동의']
        ]);
      }
      console.log('✅ Members migrated');
    }

    // 주문정보 마이그레이션
    if (workbook.SheetNames.includes('주문정보')) {
      const 주문정보 = XLSX.utils.sheet_to_json(workbook.Sheets['주문정보']);
      console.log(`📋 Migrating ${주문정보.length} orders...`);
      
      for (const row of 주문정보) {
        // 주문일시 파싱 (YYYY-MM-DD HH:MM 형식)
        let 주문일시 = null;
        if (row['주문일시']) {
          let dateStr = String(row['주문일시']);
          // Excel 날짜 형식 처리 (숫자로 된 경우)
          if (!isNaN(dateStr) && dateStr.includes('.')) {
            // Excel serial date를 JavaScript Date로 변환
            const excelDate = parseFloat(dateStr);
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
            dateStr = jsDate.toISOString().slice(0, 16).replace('T', ' ');
          }
          // 공백이 없으면 시간 추가
          if (!dateStr.includes(' ')) {
            dateStr = `${dateStr} 00:00`;
          }
          주문일시 = dateStr;
        }

        await client.query(`
          INSERT INTO 주문정보 (
            "주문ID", "회원ID", "주문일시", "주문상태", "결제방법",
            "결제금액(원)", "할인금액(원)", "배송비(원)", "최종결제금액(원)",
            "수령인", "수령인연락처", "배송주소", "배송메모", "쿠폰코드"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT ("주문ID") DO UPDATE SET
            "회원ID" = EXCLUDED."회원ID",
            "주문일시" = EXCLUDED."주문일시",
            "주문상태" = EXCLUDED."주문상태",
            "결제방법" = EXCLUDED."결제방법",
            "결제금액(원)" = EXCLUDED."결제금액(원)",
            "할인금액(원)" = EXCLUDED."할인금액(원)",
            "배송비(원)" = EXCLUDED."배송비(원)",
            "최종결제금액(원)" = EXCLUDED."최종결제금액(원)",
            "수령인" = EXCLUDED."수령인",
            "수령인연락처" = EXCLUDED."수령인연락처",
            "배송주소" = EXCLUDED."배송주소",
            "배송메모" = EXCLUDED."배송메모",
            "쿠폰코드" = EXCLUDED."쿠폰코드"
        `, [
          row['주문ID'], row['회원ID'], 주문일시, row['주문상태'], row['결제방법'],
          row['결제금액(원)'], row['할인금액(원)'], row['배송비(원)'], row['최종결제금액(원)'],
          row['수령인'], row['수령인연락처'], row['배송주소'], row['배송메모'] || '', row['쿠폰코드'] || ''
        ]);
      }
      console.log('✅ Orders migrated');
    }

    // 배송정보 마이그레이션
    if (workbook.SheetNames.includes('배송정보')) {
      const 배송정보 = XLSX.utils.sheet_to_json(workbook.Sheets['배송정보']);
      console.log(`🚚 Migrating ${배송정보.length} shipments...`);
      
      for (const row of 배송정보) {
        await client.query(`
          INSERT INTO 배송정보 (
            "배송ID", "주문ID", "택배사", "송장번호", "배송상태",
            "발송일", "예상도착일", "실제도착일", "수령인", "수령인연락처",
            "배송주소", "배송메모", "배송추적URL"
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT ("배송ID") DO UPDATE SET
            "주문ID" = EXCLUDED."주문ID",
            "택배사" = EXCLUDED."택배사",
            "송장번호" = EXCLUDED."송장번호",
            "배송상태" = EXCLUDED."배송상태",
            "발송일" = EXCLUDED."발송일",
            "예상도착일" = EXCLUDED."예상도착일",
            "실제도착일" = EXCLUDED."실제도착일",
            "수령인" = EXCLUDED."수령인",
            "수령인연락처" = EXCLUDED."수령인연락처",
            "배송주소" = EXCLUDED."배송주소",
            "배송메모" = EXCLUDED."배송메모",
            "배송추적URL" = EXCLUDED."배송추적URL"
        `, [
          row['배송ID'], row['주문ID'], row['택배사'], row['송장번호'], row['배송상태'],
          row['발송일'] || null, row['예상도착일'] || null, row['실제도착일'] || null,
          row['수령인'], row['수령인연락처'], row['배송주소'], row['배송메모'] || '', row['배송추적URL']
        ]);
      }
      console.log('✅ Shipments migrated');
    }

    await client.query('COMMIT');
    console.log('\n✅ All data migrated successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error migrating data:', error);
    throw error;
  } finally {
    client.release();
  }
};

// 실행
migrateData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
