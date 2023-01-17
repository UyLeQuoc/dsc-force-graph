import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from 'antd'

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p>Hello World! 🌎️</p>',
  })

  return (
    <>
      <EditorContent editor={editor} />
      <Button type='primary'>Save</Button>
    </>
  )
}

export default Editor;