"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Heading, { type Level } from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import { Button } from "~/app/_components/ui/button";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListCheck,
  ListOrdered,
  Paperclip,
  Strikethrough,
  Underline as UnderlineIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "~/lib/utils";

//TODO: ajouter les codeblock et les quotes. voir pour les tables

interface HeaderSize {
  level: Level;
  icon: LucideIcon;
}

interface AlignType {
  align: string;
  icon: LucideIcon;
}

const headersSize: HeaderSize[] = [
  {
    level: 1,
    icon: Heading1,
  },
  {
    level: 2,
    icon: Heading2,
  },
  {
    level: 3,
    icon: Heading3,
  },
  {
    level: 4,
    icon: Heading4,
  },
  {
    level: 5,
    icon: Heading5,
  },
  {
    level: 6,
    icon: Heading6,
  },
];

const alignTypes: AlignType[] = [
  {
    align: "left",
    icon: AlignLeft,
  },
  {
    align: "center",
    icon: AlignCenter,
  },
  {
    align: "right",
    icon: AlignRight,
  },
  {
    align: "justify",
    icon: AlignJustify,
  },
];

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Heading,
      Paragraph,
      Text,
      Document,
      Underline,
      Strike,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    //content: "<p>Commence à écrire ton contenu ✍️</p>",
  });

  if (!editor) return null;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2">
        {/* Headings */}
        {headersSize.map((level) => {
          return (
            <Button
              key={level.level}
              type="button"
              variant="icon"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level.level })
                  .run()
              }
              className={cn(
                "",
                editor.isActive("heading", { level }) ? "bg-muted" : "",
              )}
            >
              <level.icon className="h-4 w-4" />
            </Button>
          );
        })}

        {/* Format */}
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="icon"
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="icon"
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant="icon"
          className={editor.isActive("underline") ? "bg-muted" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          variant="icon"
          className={editor.isActive("strike") ? "bg-muted" : ""}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        {/* Lists */}
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant="icon"
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant="icon"
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          variant="icon"
          className={editor.isActive("taskList") ? "bg-muted" : ""}
        >
          <ListCheck className="h-4 w-4" />
        </Button>

        {/* Align */}
        {alignTypes.map((align) => (
          <Button
            key={align.align}
            onClick={() =>
              editor.chain().focus().setTextAlign(align.align).run()
            }
            variant="icon"
            className={editor.isActive({ textAlign: align }) ? "bg-muted" : ""}
          >
            <align.icon className="h-4 w-4" />
          </Button>
        ))}

        {/* Link */}
        <Button
          onClick={() => {
            const url = prompt("URL du lien :");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
          variant="icon"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        {/* Clear formatting */}
        <Button
          onClick={() => editor.chain().clearContent().focus().run()}
          variant="destructive"
        >
          Vider
        </Button>
      </div>

      {/* Editeur */}
      <div className="rounded-md border bg-white text-black">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
