'use client'

import { useEffect, useRef } from 'react'

// 为 Window 接口添加 tinymce 属性的类型声明
declare global {
  interface Window {
    tinymce: any
  }
}


interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  className?: string
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, label, className = '' }) => {
  const editorRef = useRef<any>(null)

  useEffect(() => {
    // 加载TinyMCE
    const script = document.createElement('script')
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js'
    script.async = true
    script.onload = () => {
      if (window.tinymce) {
        window.tinymce.init({
          selector: `#${editorRef.current.id}`,
          plugins: 'advlist autolink lists link image charmap print preview anchor',
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
          setup: (editor: any) => {
            editor.on('change', () => {
              onChange(editor.getContent())
            })
          }
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (window.tinymce) {
        window.tinymce.remove()
      }
      document.head.removeChild(script)
    }
  }, [])

  const id = `editor-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        ref={editorRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2"
        rows={10}
      />
    </div>
  )
}

export default RichEditor
