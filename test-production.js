/**
 * 배포된 서버 API 테스트 스크립트
 * 
 * 사용법:
 *   PRODUCTION_URL=http://YOUR_SERVER_IP:3000 node test-production.js
 * 
 * 또는 이 파일의 BASE_URL을 직접 수정하세요.
 */

const BASE_URL = process.env.PRODUCTION_URL || 'http://YOUR_SERVER_IP:3000';

// Node.js 18+ fetch 지원 확인 또는 node-fetch 사용
let fetch;
if (typeof globalThis.fetch === 'undefined') {
  try {
    fetch = require('node-fetch');
  } catch (e) {
    console.error('❌ 이 스크립트는 Node.js 18+ 또는 node-fetch 패키지가 필요합니다.');
    console.log('💡 해결 방법:');
    console.log('   1. Node.js 18 이상으로 업그레이드');
    console.log('   2. 또는: npm install node-fetch');
    process.exit(1);
  }
} else {
  fetch = globalThis.fetch;
}

// 테스트 결과를 저장할 배열
const testResults = [];

// 테스트 헬퍼 함수
async function testAPI(name, method, url, expectedStatus = 200) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, { method });
    const responseTime = Date.now() - startTime;
    const data = await response.json();
    const success = response.status === expectedStatus;
    
    testResults.push({
      name,
      status: response.status,
      expected: expectedStatus,
      success,
      responseTime,
      data: success ? data : null,
      error: success ? null : data
    });

    console.log(`${success ? '✅' : '❌'} ${name}`);
    console.log(`   Status: ${response.status} (expected: ${expectedStatus})`);
    console.log(`   Response Time: ${responseTime}ms`);
    if (success) {
      console.log(`   Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
    } else {
      console.log(`   Error:`, data.message || 'Unknown error');
    }
    console.log('');
    
    return success;
  } catch (error) {
    testResults.push({
      name,
      status: 'ERROR',
      expected: expectedStatus,
      success: false,
      error: error.message
    });
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// 테스트 실행
async function runTests() {
  console.log('🧪 배포된 서버 API 테스트 시작\n');
  console.log(`📍 Server URL: ${BASE_URL}\n`);
  console.log('='.repeat(50) + '\n');

  // 1. Health Check
  await testAPI(
    'Health Check',
    'GET',
    `${BASE_URL}/health`
  );

  // 2. 상품 정보 조회
  await testAPI(
    '상품 정보 조회 (PRD-0001)',
    'GET',
    `${BASE_URL}/api/products/PRD-0001`
  );

  // 존재하지 않는 상품 조회
  await testAPI(
    '존재하지 않는 상품 조회',
    'GET',
    `${BASE_URL}/api/products/PRD-9999`,
    404
  );

  // 3. 회원 정보 조회
  await testAPI(
    '회원 정보 조회 (USR-0001)',
    'GET',
    `${BASE_URL}/api/members/USR-0001`
  );

  // 존재하지 않는 회원 조회
  await testAPI(
    '존재하지 않는 회원 조회',
    'GET',
    `${BASE_URL}/api/members/USR-9999`,
    404
  );

  // 4. 회원 주문 및 송장번호 조회
  await testAPI(
    '회원 주문 및 송장번호 조회 (USR-0001)',
    'GET',
    `${BASE_URL}/api/orders/member/USR-0001/tracking`
  );

  // 5. 송장번호로 배송정보 조회
  await testAPI(
    '송장번호로 배송정보 조회 (811518691982)',
    'GET',
    `${BASE_URL}/api/shipments/tracking/811518691982`
  );

  // 존재하지 않는 송장번호 조회
  await testAPI(
    '존재하지 않는 송장번호 조회',
    'GET',
    `${BASE_URL}/api/shipments/tracking/000000000000`,
    404
  );

  // 테스트 결과 요약
  console.log('='.repeat(50));
  console.log('\n📊 테스트 결과 요약\n');
  
  const total = testResults.length;
  const passed = testResults.filter(r => r.success).length;
  const failed = total - passed;
  const avgResponseTime = testResults
    .filter(r => r.responseTime)
    .reduce((sum, r) => sum + r.responseTime, 0) / testResults.filter(r => r.responseTime).length;

  testResults.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
    console.log(`${icon} ${result.name} - ${result.success ? 'PASS' : 'FAIL'}${time}`);
  });

  console.log(`\n총 ${total}개 테스트 중 ${passed}개 성공, ${failed}개 실패`);
  if (avgResponseTime) {
    console.log(`평균 응답 시간: ${Math.round(avgResponseTime)}ms\n`);
  }

  if (failed === 0) {
    console.log('🎉 모든 테스트가 통과했습니다!');
    console.log(`\n🌐 배포된 서버 정보:`);
    console.log(`   - API 서버: ${BASE_URL}`);
    console.log(`   - Swagger 문서: ${BASE_URL}/api-docs`);
    console.log(`   - Health Check: ${BASE_URL}/health`);
    process.exit(0);
  } else {
    console.log('⚠️  일부 테스트가 실패했습니다.');
    process.exit(1);
  }
}

// 테스트 실행
runTests().catch(error => {
  console.error('테스트 실행 중 오류:', error);
  process.exit(1);
});
