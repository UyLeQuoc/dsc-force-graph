import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button, message, Skeleton } from 'antd'
import MenuBar from './MenuBar'

const Editor = ({noteFirebase, loading, updateNote, isReadable = false}) => {
  if(!noteFirebase) return null;
  const editor = useEditor({
    editable: !isReadable,
    extensions: [
      StarterKit,
      Youtube
    ],
    content: noteFirebase.content,
  })

  const handleUpdate = () => {
    updateNote(editor.getHTML())
    .then(() => message.success('Saved!'))
  }

  return (
    <div className='bg-white rounded-lg flex flex-col border-[3px]'>
      {
        isReadable || (
          <header className='items-center flex flex-wrap p-1 border-b-[3px] flex-grow-0 flex-shrink-0'>
            <MenuBar editor={editor}/>
          </header>
        )
      }
      <section className='overflow-x-hidden overflow-y-auto scrolling-touch flex-grow-1 flex-shrink-1 py-5 px-4'>
        <Skeleton loading={loading}>
          <EditorContent editor={editor} />
        </Skeleton>
      </section>
      {
        isReadable || (
          <footer className='items-center text-black flex text-xs flex-wrap font-semibold justify-between whitespace-no-wrap px-3 py-1 border-t-[3px]'>
            <Button type='primary' onClick={handleUpdate}>Save</Button>
          </footer>
        )
      }
    </div>
  )
}

export default Editor;