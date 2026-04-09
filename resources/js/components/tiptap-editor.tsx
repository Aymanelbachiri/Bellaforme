import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Heading3,
    Link as LinkIcon,
    Undo,
    Redo,
    Quote,
    Minus,
    Palette,
} from 'lucide-react';
import { useRef, useState } from 'react';

interface TiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder = 'Commencez à écrire...' }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-blue-400 underline' },
            }),
            TextStyle,
            Color,
            Placeholder.configure({ placeholder }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-invert max-w-none min-h-[200px] px-4 py-3 focus:outline-none',
            },
        },
    });

    if (!editor) return null;

    return (
        <div className="overflow-hidden rounded-md border border-input bg-background">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL du lien:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const Btn = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title: string }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-0.5 border-b border-input px-2 py-1.5">
            <Btn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Gras">
                <Bold className="size-4" />
            </Btn>
            <Btn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italique">
                <Italic className="size-4" />
            </Btn>
            <Btn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Souligner">
                <UnderlineIcon className="size-4" />
            </Btn>

            <div className="mx-1 h-8 w-px bg-border" />

            <Btn active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Titre 1">
                <Heading1 className="size-4" />
            </Btn>
            <Btn active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Titre 2">
                <Heading2 className="size-4" />
            </Btn>
            <Btn active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Titre 3">
                <Heading3 className="size-4" />
            </Btn>

            <div className="mx-1 h-8 w-px bg-border" />

            <Btn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Liste à puces">
                <List className="size-4" />
            </Btn>
            <Btn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Liste numérotée">
                <ListOrdered className="size-4" />
            </Btn>
            <Btn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citation">
                <Quote className="size-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Ligne horizontale">
                <Minus className="size-4" />
            </Btn>

            <div className="mx-1 h-8 w-px bg-border" />

            <Btn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Aligner à gauche">
                <AlignLeft className="size-4" />
            </Btn>
            <Btn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Centrer">
                <AlignCenter className="size-4" />
            </Btn>
            <Btn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Aligner à droite">
                <AlignRight className="size-4" />
            </Btn>

            <div className="mx-1 h-8 w-px bg-border" />

            <Btn active={editor.isActive('link')} onClick={addLink} title="Lien">
                <LinkIcon className="size-4" />
            </Btn>

            <div className="mx-1 h-8 w-px bg-border" />

            <ColorPicker editor={editor} />

            <Btn onClick={() => editor.chain().focus().undo().run()} title="Annuler">
                <Undo className="size-4" />
            </Btn>
            <Btn onClick={() => editor.chain().focus().redo().run()} title="Rétablir">
                <Redo className="size-4" />
            </Btn>
        </div>
    );
}

const COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308',
    '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#d5ab70',
    '#6b7280', '#1a1a1a',
];

function ColorPicker({ editor }: { editor: ReturnType<typeof useEditor> }) {
    const [open, setOpen] = useState(false);
    const [customColor, setCustomColor] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    if (!editor) return null;

    const currentColor = editor.getAttributes('textStyle').color || '#000000';

    const applyColor = (color: string) => {
        editor.chain().focus().setColor(color).run();
        setOpen(false);
    };

    const applyCustomColor = () => {
        const color = customColor.startsWith('#') ? customColor : `#${customColor}`;
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
            applyColor(color);
            setCustomColor('');
        }
    };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                title="Couleur du texte"
                className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
                <Palette className="size-4" />
                <span
                    className="absolute bottom-1 left-1/2 h-0.5 w-3.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: currentColor }}
                />
            </button>
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1 rounded-lg border border-input bg-popover p-3 shadow-md w-52">
                    <div className="grid grid-cols-6 gap-1.5">
                        {COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                onClick={() => applyColor(color)}
                                className="h-7 w-7 rounded-md border border-input transition-transform hover:scale-110"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                        <input
                            type="color"
                            value={customColor || currentColor}
                            onChange={(e) => {
                                setCustomColor(e.target.value);
                                editor.chain().focus().setColor(e.target.value).run();
                            }}
                            className="h-7 w-7 shrink-0 cursor-pointer rounded border border-input bg-transparent p-0"
                            title="Sélecteur de couleur"
                        />
                        <input
                            type="text"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyCustomColor()}
                            placeholder="#d5ab70"
                            className="h-7 min-w-0 flex-1 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                        />
                        <button
                            type="button"
                            onClick={applyCustomColor}
                            className="h-7 shrink-0 rounded-md bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            OK
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            editor.chain().focus().unsetColor().run();
                            setCustomColor('');
                            setOpen(false);
                        }}
                        className="mt-2 w-full rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent"
                    >
                        Réinitialiser la couleur
                    </button>
                </div>
            )}
        </div>
    );
}
