import { MemoFormData } from '@/types/memo'
import { supabaseUtils } from './supabaseUtils'

export const sampleMemos: MemoFormData[] = [
  {
    title: '프로젝트 회의 준비',
    content:
      '다음 주 월요일 오전 10시 프로젝트 킥오프 미팅을 위한 준비사항:\n\n- 프로젝트 범위 정의서 작성\n- 팀원별 역할 분담\n- 일정 계획 수립\n- 필요한 리소스 정리',
    category: 'work',
    tags: ['회의', '프로젝트', '준비'],
  },
  {
    title: 'React 18 새로운 기능 학습',
    content:
      'React 18에서 새로 추가된 기능들을 학습해야 함:\n\n1. Concurrent Features\n2. Automatic Batching\n3. Suspense 개선사항\n4. useId Hook\n5. useDeferredValue Hook\n\n이번 주말에 공식 문서를 읽고 간단한 예제를 만들어보자.',
    category: 'study',
    tags: ['React', '학습', '개발'],
  },
  {
    title: '새로운 앱 아이디어: 습관 트래커',
    content:
      '매일 실천하고 싶은 습관들을 관리할 수 있는 앱:\n\n핵심 기능:\n- 습관 등록 및 관리\n- 일일 체크인\n- 진행 상황 시각화\n- 목표 달성 알림\n- 통계 분석\n\n기술 스택: React Native + Supabase\n출시 목표: 3개월 후',
    category: 'idea',
    tags: ['앱개발', '습관', 'React Native'],
  },
  {
    title: '주말 여행 계획',
    content:
      '이번 주말 제주도 여행 계획:\n\n토요일:\n- 오전: 한라산 등반\n- 오후: 성산일출봉 관광\n- 저녁: 흑돼지 맛집 방문\n\n일요일:\n- 오전: 우도 관광\n- 오후: 쇼핑 및 기념품 구매\n- 저녁: 공항 이동\n\n준비물: 등산화, 카메라, 선크림',
    category: 'personal',
    tags: ['여행', '제주도', '주말'],
  },
  {
    title: '독서 목록',
    content:
      '올해 읽고 싶은 책들:\n\n개발 관련:\n- 클린 코드 (로버트 C. 마틴)\n- 리팩토링 2판 (마틴 파울러)\n- 시스템 디자인 인터뷰 (알렉스 쉬)\n\n자기계발:\n- 아토믹 해빗 (제임스 클리어)\n- 데일 카네기 인간관계론\n\n소설:\n- 82년생 김지영 (조남주)\n- 미드나잇 라이브러리 (매트 헤이그)',
    category: 'personal',
    tags: ['독서', '책', '자기계발'],
  },
  {
    title: '성능 최적화 아이디어',
    content:
      '웹 애플리케이션 성능 최적화 방법들:\n\n프론트엔드:\n- 이미지 최적화 (WebP, lazy loading)\n- 코드 스플리팅\n- 번들 크기 최적화\n- 캐싱 전략\n\n백엔드:\n- 데이터베이스 쿼리 최적화\n- CDN 활용\n- 서버 사이드 렌더링\n- API 응답 캐싱\n\n모니터링:\n- Core Web Vitals 측정\n- 성능 예산 설정',
    category: 'idea',
    tags: ['성능', '최적화', '웹개발'],
  },
  {
    id: '7',
    title: '마크다운 스타일 테스트',
    content:
      '# 마크다운 테스트\n\n이 메모는 **마크다운 스타일링**을 테스트하기 위한 것입니다.\n\n## 불렛 포인트 테스트\n\n### 쇼핑 목록\n- 사과\n- 바나나\n- 우유\n- 빵\n  - 식빵\n  - 바게트\n    - 프렌치 바게트\n    - 독일식 브레첼\n\n### 할 일 목록\n1. 아침 운동하기\n2. 이메일 확인하기\n3. 회의 준비하기\n4. 프로젝트 진행하기\n   1. 요구사항 분석\n   2. 설계 문서 작성\n   3. 개발 시작\n\n## 기타 스타일\n\n**굵은 글씨**와 *기울임꼴*, 그리고 `코드`도 테스트해보겠습니다.\n\n> 이것은 인용구입니다.\n> 여러 줄에 걸쳐 작성할 수 있습니다.\n\n```javascript\nconst hello = () => {\n  console.log("Hello, World!");\n};\n```',
    category: 'other',
    tags: ['마크다운', '테스트', '스타일'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const seedSampleDataToSupabase = async (): Promise<boolean> => {
  try {
    // 기존 데이터가 있는지 확인
    const existingMemos = await supabaseUtils.getMemos()
    if (existingMemos.length > 0) {
      console.log('Sample data already exists, skipping seed.')
      return false
    }

    // 샘플 데이터를 하나씩 추가
    const insertPromises = sampleMemos.map(memo => supabaseUtils.addMemo(memo))
    const results = await Promise.all(insertPromises)
    
    const successCount = results.filter(result => result !== null).length
    console.log(`Sample data seeded successfully! ${successCount}/${sampleMemos.length} memos added.`)
    
    return successCount > 0
  } catch (error) {
    console.error('Error seeding sample data:', error)
    return false
  }
}

export const clearAllDataFromSupabase = async (): Promise<boolean> => {
  try {
    const success = await supabaseUtils.clearMemos()
    if (success) {
      console.log('All data cleared from Supabase!')
      return true
    }
    return false
  } catch (error) {
    console.error('Error clearing all data:', error)
    return false
  }
}

export const resetToSampleDataInSupabase = async (): Promise<boolean> => {
  try {
    // 먼저 모든 데이터 삭제
    await clearAllDataFromSupabase()
    
    // 샘플 데이터 추가
    const success = await seedSampleDataToSupabase()
    
    if (success) {
      console.log('Data reset to sample data in Supabase!')
      return true
    }
    return false
  } catch (error) {
    console.error('Error resetting to sample data:', error)
    return false
  }
}

// 기존 함수명과 호환성을 위한 alias (deprecated)
export const seedSampleData = seedSampleDataToSupabase
export const clearAllData = clearAllDataFromSupabase
export const resetToSampleData = resetToSampleDataInSupabase
