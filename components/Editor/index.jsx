import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from 'antd'
import { useState } from 'react'
import MenuBar from './MenuBar'

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `<h2>
    Hi there,
  </h2>
  <p>
    this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>
      That’s a bullet list with one …
    </li>
    <li>
      … or two list items.
    </li>
  </ul>
  <p>
    Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that’s amazing. Good work, boy! 👏
    <br />
    — Mom
  </blockquote>`,
  })

  return (
    <div className='bg-white rounded-lg flex flex-col border-[3px] m-10'>
      <header className='items-center flex flex-wrap p-1 border-b-[3px] flex-grow-0 flex-shrink-0'>
        <MenuBar editor={editor}/>
      </header>
      <section className='overflow-x-hidden overflow-y-auto scrolling-touch flex-grow-1 flex-shrink-1 py-5 px-4'>
        <EditorContent editor={editor} />
      </section>
      <footer className='items-center text-black flex text-xs flex-wrap font-semibold justify-between whitespace-no-wrap px-3 py-1 border-t-[3px]'>
        <Button type='primary' onClick={() => editor.commands.setContent({
          type: "doc",
          content: [{type:'paragraph', content: [{type:'text',text:'uydeptrai'}]}]
      })}>Save</Button>
      </footer>
    </div>
  )
}

export default Editor;