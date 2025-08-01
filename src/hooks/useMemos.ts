'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Memo, MemoFormData } from '@/types/memo'
import { localStorageUtils } from '@/utils/localStorage'
import { v4 as uuidv4 } from 'uuid'

export const useMemos = () => {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // 메모 로드
  useEffect(() => {
    const loadMemos = async () => {
      setLoading(true)
      try {
        // localStorage에서 메모 로드
        const loadedMemos = localStorageUtils.getMemos()
        
        // 데이터가 없으면 샘플 데이터 추가
        if (loadedMemos.length === 0) {
          const sampleMemo: Memo = {
            id: uuidv4(),
            title: '마크다운 편집기 테스트',
            content: `# 마크다운 편집기가 추가되었습니다! 🎉

이제 **마크다운 문법**을 사용하여 메모를 작성할 수 있습니다.

## 지원되는 기능들:

- **굵은 글씨** 및 *기울임체*
- [링크](https://example.com)
- \`코드\` 및 코드 블록
- 목록 작성

### 할 일 목록:
- [x] 마크다운 편집기 구현
- [x] 실시간 프리뷰 기능
- [ ] 더 많은 기능 추가

> 인용문도 사용할 수 있습니다!

\`\`\`javascript
// 코드 블록도 지원합니다
console.log('Hello, Markdown!');
\`\`\``,
            category: 'personal',
            tags: ['마크다운', '테스트', '편집기'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          localStorageUtils.addMemo(sampleMemo)
          setMemos([sampleMemo])
        } else {
          setMemos(loadedMemos)
        }
      } catch (error) {
        console.error('Failed to load memos:', error)
        setMemos([])
      } finally {
        setLoading(false)
      }
    }

    loadMemos()
  }, [])

  // 메모 생성
  const createMemo = useCallback(async (formData: MemoFormData): Promise<Memo | null> => {
    try {
      const newMemo: Memo = {
        id: uuidv4(),
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      localStorageUtils.addMemo(newMemo)
      setMemos(prev => [newMemo, ...prev])
      return newMemo
    } catch (error) {
      console.error('Failed to create memo:', error)
      return null
    }
  }, [])

  // 메모 업데이트
  const updateMemo = useCallback(
    async (id: string, formData: MemoFormData): Promise<boolean> => {
      try {
        const updatedMemo: Memo = {
          id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          tags: formData.tags,
          createdAt: memos.find(m => m.id === id)?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        
        localStorageUtils.updateMemo(updatedMemo)
        setMemos(prev => prev.map(memo => (memo.id === id ? updatedMemo : memo)))
        return true
      } catch (error) {
        console.error('Failed to update memo:', error)
        return false
      }
    },
    [memos]
  )

  // 메모 삭제
  const deleteMemo = useCallback(async (id: string): Promise<boolean> => {
    try {
      localStorageUtils.deleteMemo(id)
      setMemos(prev => prev.filter(memo => memo.id !== id))
      return true
    } catch (error) {
      console.error('Failed to delete memo:', error)
      return false
    }
  }, [])

  // 메모 검색
  const searchMemos = useCallback((query: string): void => {
    setSearchQuery(query)
  }, [])

  // 카테고리 필터링
  const filterByCategory = useCallback((category: string): void => {
    setSelectedCategory(category)
  }, [])

  // 특정 메모 가져오기
  const getMemoById = useCallback(
    async (id: string): Promise<Memo | null> => {
      try {
        return localStorageUtils.getMemoById(id)
      } catch (error) {
        console.error('Failed to get memo by id:', error)
        return null
      }
    },
    []
  )

  // 필터링된 메모 목록
  const filteredMemos = useMemo(() => {
    let filtered = memos

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(memo => memo.category === selectedCategory)
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        memo =>
          memo.title.toLowerCase().includes(query) ||
          memo.content.toLowerCase().includes(query) ||
          memo.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [memos, selectedCategory, searchQuery])

  // 모든 메모 삭제
  const clearAllMemos = useCallback(async (): Promise<boolean> => {
    try {
      localStorageUtils.clearMemos()
      setMemos([])
      setSearchQuery('')
      setSelectedCategory('all')
      return true
    } catch (error) {
      console.error('Failed to clear all memos:', error)
      return false
    }
  }, [])

  // 통계 정보
  const stats = useMemo(() => {
    const totalMemos = memos.length
    const categoryCounts = memos.reduce(
      (acc, memo) => {
        acc[memo.category] = (acc[memo.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      total: totalMemos,
      byCategory: categoryCounts,
      filtered: filteredMemos.length,
    }
  }, [memos, filteredMemos])

  return {
    // 상태
    memos: filteredMemos,
    allMemos: memos,
    loading,
    searchQuery,
    selectedCategory,
    stats,

    // 메모 CRUD
    createMemo,
    updateMemo,
    deleteMemo,
    getMemoById,

    // 필터링 & 검색
    searchMemos,
    filterByCategory,

    // 유틸리티
    clearAllMemos,
  }
}
