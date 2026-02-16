'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Mulai ketik naskah khutbah Anda di sini...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div className="prose prose-emerald max-w-none">
            <div className="flex items-center gap-1 mb-4 no-print border-b border-slate-100 pb-2">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('bold') ? 'bg-slate-100 text-emerald-600' : ''}`}
                    title="Bold"
                >
                    <b>B</b>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('italic') ? 'bg-slate-100 text-emerald-600' : ''}`}
                    title="Italic"
                >
                    <i>I</i>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-slate-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-100 text-emerald-600' : ''}`}
                    title="Heading"
                >
                    H2
                </button>
            </div>
            <EditorContent editor={editor} className="min-h-[300px] outline-none" />
        </div>
    );
}
