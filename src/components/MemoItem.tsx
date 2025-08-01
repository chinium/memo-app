'use client'

import { Memo, MEMO_CATEGORIES } from '@/types/memo'
import MDEditor from '@uiw/react-md-editor'

interface MemoItemProps {
  memo: Memo
  onView: (memo: Memo) => void
  onEdit: (memo: Memo) => void
  onDelete: (id: string) => Promise<boolean>
}

export default function MemoItem({
  memo,
  onView,
  onEdit,
  onDelete,
}: MemoItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      work: 'bg-green-100 text-green-800',
      study: 'bg-purple-100 text-purple-800',
      idea: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit(memo)
  }

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      try {
        const success = await onDelete(memo.id)
        if (!success) {
          alert('메모 삭제에 실패했습니다.')
        }
      } catch (error) {
        console.error('Error deleting memo:', error)
        alert('메모 삭제 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onView(memo)}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {memo.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                memo.category
              )}`}
            >
              {MEMO_CATEGORIES[memo.category as keyof typeof MEMO_CATEGORIES] ||
                memo.category}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(memo.updatedAt)}
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 ml-4">
          <button
            onClick={handleEditClick}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="편집"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="삭제"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
          style={
            {
              '--tw-prose-body': 'rgb(55 65 81)',
              '--tw-prose-headings': 'rgb(31 41 55)',
              '--tw-prose-bold': 'rgb(31 41 55)',
              '--tw-prose-links': 'rgb(59 130 246)',
              maxHeight: '150px',
              overflow: 'hidden',
              position: 'relative',
            } as any
          }
        >
          <MDEditor.Markdown
            source={memo.content}
            style={{
              whiteSpace: 'normal',
              backgroundColor: 'transparent',
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          />
          {memo.content.length > 200 && (
            <div
              className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"
              style={{ pointerEvents: 'none' }}
            />
          )}
        </div>
      </div>

      {/* 태그 */}
      {memo.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {memo.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
