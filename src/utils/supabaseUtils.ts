import { supabase } from '@/lib/supabase'
import { Memo } from '@/types/memo'
import { Database } from '@/types/database'

type MemoRow = Database['public']['Tables']['memos']['Row']
type MemoInsert = Database['public']['Tables']['memos']['Insert']
type MemoUpdate = Database['public']['Tables']['memos']['Update']

// Supabase 실시간 구독 payload 타입 (향후 구현 예정)
// type RealtimePayload = {
//   schema: string
//   table: string
//   commit_timestamp: string
//   eventType: 'INSERT' | 'UPDATE' | 'DELETE'
//   new?: MemoRow
//   old?: MemoRow
//   errors?: string[]
// }

// Convert database row to Memo interface
const convertRowToMemo = (row: MemoRow): Memo => ({
  id: row.id,
  title: row.title,
  content: row.content,
  category: row.category,
  tags: row.tags || [],
  createdAt: row.created_at || '',
  updatedAt: row.updated_at || '',
})

// Convert MemoFormData to database insert
const convertMemoToInsert = (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): MemoInsert => ({
  title: memo.title,
  content: memo.content,
  category: memo.category,
  tags: memo.tags,
})

export const supabaseUtils = {
  // 모든 메모 가져오기
  getMemos: async (): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memos:', error)
        throw error
      }

      return data?.map(convertRowToMemo) || []
    } catch (error) {
      console.error('Error loading memos from Supabase:', error)
      return []
    }
  },

  // 메모 추가
  addMemo: async (memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>): Promise<Memo | null> => {
    try {
      const insertData = convertMemoToInsert(memo)
      
      const { data, error } = await supabase
        .from('memos')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Error adding memo:', error)
        throw error
      }

      return data ? convertRowToMemo(data) : null
    } catch (error) {
      console.error('Error adding memo to Supabase:', error)
      return null
    }
  },

  // 메모 업데이트
  updateMemo: async (id: string, updates: Partial<Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Memo | null> => {
    try {
      const updateData: MemoUpdate = {
        ...(updates.title && { title: updates.title }),
        ...(updates.content && { content: updates.content }),
        ...(updates.category && { category: updates.category }),
        ...(updates.tags && { tags: updates.tags }),
      }

      const { data, error } = await supabase
        .from('memos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating memo:', error)
        throw error
      }

      return data ? convertRowToMemo(data) : null
    } catch (error) {
      console.error('Error updating memo in Supabase:', error)
      return null
    }
  },

  // 메모 삭제
  deleteMemo: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting memo:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting memo from Supabase:', error)
      return false
    }
  },

  // 메모 검색
  searchMemos: async (query: string): Promise<Memo[]> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching memos:', error)
        throw error
      }

      return data?.map(convertRowToMemo) || []
    } catch (error) {
      console.error('Error searching memos in Supabase:', error)
      return []
    }
  },

  // 카테고리별 메모 필터링
  getMemosByCategory: async (category: string): Promise<Memo[]> => {
    try {
      if (category === 'all') {
        return await supabaseUtils.getMemos()
      }

      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching memos by category:', error)
        throw error
      }

      return data?.map(convertRowToMemo) || []
    } catch (error) {
      console.error('Error filtering memos by category in Supabase:', error)
      return []
    }
  },

  // 특정 메모 가져오기
  getMemoById: async (id: string): Promise<Memo | null> => {
    try {
      const { data, error } = await supabase
        .from('memos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching memo by id:', error)
        throw error
      }

      return data ? convertRowToMemo(data) : null
    } catch (error) {
      console.error('Error getting memo by id from Supabase:', error)
      return null
    }
  },

  // 모든 메모 삭제 (개발용)
  clearMemos: async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('memos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

      if (error) {
        console.error('Error clearing memos:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error clearing memos from Supabase:', error)
      return false
    }
  },

  // 실시간 변경사항 구독 (향후 구현 예정)
  subscribeToMemos: (callback: (payload: unknown) => void) => {
    console.log('Real-time subscription not implemented yet', callback)
    // 향후 구현 예정
    return { unsubscribe: () => console.log('Unsubscribed') }
  },
}