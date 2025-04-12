import React, { useRef } from "react";
import MDEditor, {
  commands,
  ICommand,
  TextState,
  TextAreaTextApi
} from "@uiw/react-md-editor";
import { uploadPostImage } from "@/service/PostService";
// import { addTransformationsToCloudinaryUrl } from "./utils"; // Giả sử bạn đã có hàm này

// Command để chèn tiêu đề h3
const title3: ICommand = {
  name: "title3",
  keyCommand: "title3",
  buttonProps: { "aria-label": "Insert title3" },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <path
        fill="currentColor"
        d="M15.7083333,468 C7.03242448,468 0,462.030833 0,454.666667 L0,421.333333 C0,413.969167 7.03242448,408 15.7083333,408 L361.291667,408 C369.967576,408 377,413.969167 377,421.333333 L377,454.666667 C377,462.030833 369.967576,468 361.291667,468 L15.7083333,468 Z M21.6666667,366 C9.69989583,366 0,359.831861 0,352.222222 L0,317.777778 C0,310.168139 9.69989583,304 21.6666667,304 L498.333333,304 C510.300104,304 520,310.168139 520,317.777778 L520,352.222222 C520,359.831861 510.300104,366 498.333333,366 L21.6666667,366 Z M136.835938,64 L136.835937,126 L107.25,126 L107.25,251 L40.75,251 L40.75,126 L-5.68434189e-14,126 L-5.68434189e-14,64 L136.835938,64 Z M212,64 L212,251 L161.648438,251 L161.648438,64 L212,64 Z M378,64 L378,126 L343.25,126 L343.25,251 L281.75,251 L281.75,126 L238,126 L238,64 L378,64 Z M449.047619,189.550781 L520,189.550781 L520,251 L405,251 L405,64 L449.047619,64 L449.047619,189.550781 Z"
      />
    </svg>
  ),
  execute: (state: TextState, api: TextAreaTextApi) => {
    let modifyText = `### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `### `;
    }
    api.replaceSelection(modifyText);
  }
};

// Command mới để chèn ảnh
const imageCommand: ICommand = {
  name: "image",
  keyCommand: "image",
  buttonProps: { "aria-label": "Insert image" },
  icon: (
    <svg width="16" height="16" viewBox="0 0 20 20">
      <path
        fill="currentColor"
        d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
      />
    </svg>
  ),
  execute: () => {
    // Chức năng này sẽ được gọi từ component
  }
};


interface MarkDownEditorProps {
  initValue?: string
  viewMode?: "edit" | "readOnly"
  value: string,
  onChange: Function
  onImageUpload: (file : File) => Promise<String>
}

const MarkdownEditor: React.FC<MarkDownEditorProps> = function MarkdownEditor({ onChange, value, viewMode = "edit", onImageUpload }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mdEditorRef = useRef<any>(null);
  let currentTextApi: TextAreaTextApi | null = null;
  let currentTextState: TextState | null = null;

  // Xử lý upload ảnh
  const handleImageUpload = async (file: File) => {
    try {
      const url = await onImageUpload(file)
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  // Xử lý khi người dùng chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && currentTextApi) {
      const file = files[0];
      
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      
      // Hiển thị trạng thái đang tải
      const placeholderText = `![Uploading ${file.name}...]()`;
      currentTextApi.replaceSelection(placeholderText);
      const currentValue = mdEditorRef.current.textarea?.value || mdEditorRef.current.value
      onChange(currentValue)
      // Upload ảnh
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        alert("Image upload success")
        const currentValue = mdEditorRef.current.textarea?.value || mdEditorRef.current.value
        const newValue = currentValue.replace(
          placeholderText,
          `![${file.name}](${imageUrl})`
        );

        onChange(newValue);
      } else {
        alert("Image upload failed")
        const currentValue = mdEditorRef.current.textarea?.value || mdEditorRef.current.value
        const newValue = currentValue.replace(
          placeholderText,
          `[Upload failed: ${file.name}]()`
        );
        onChange(newValue);
      }
    }
    
    // Reset input để có thể chọn cùng một file nhiều lần
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Tùy chỉnh lệnh chèn ảnh
  const customImageCommand: ICommand = {
    ...imageCommand,
    execute: (state: TextState, api: TextAreaTextApi) => {
      // Lưu trạng thái hiện tại để sử dụng khi file được chọn
      currentTextState = state;
      currentTextApi = api;
      
      // Kích hoạt input file
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Tạo danh sách lệnh tùy chỉnh
  const customCommands = [
    commands.group([
      commands.title1,
      commands.title2,
      title3,
      commands.title4,
      commands.title5,
      commands.title6
    ], {
      name: 'title',
      groupName: 'title',
      buttonProps: { 'aria-label': 'Insert title' }
    }),
    commands.divider,
    commands.group([
      commands.bold,
      commands.italic,
      commands.strikethrough
    ], {
      name: 'format',
      groupName: 'format',
      buttonProps: { 'aria-label': 'Format text' }
    }),
    commands.divider,
    commands.group([
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand
    ], {
      name: 'list',
      groupName: 'list',
      buttonProps: { 'aria-label': 'Insert list' }
    }),
    commands.divider,
    customImageCommand,
    commands.divider,
    commands.group([
      commands.link,
      commands.quote,
      commands.code
    ], {
      name: 'insert',
      groupName: 'insert',
      buttonProps: { 'aria-label': 'Insert' }
    })
  ];

  return (
    <div className="mark-down-editor flex-1 flex flex-col">
      {/* Input file ẩn để chọn ảnh */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <MDEditor
        ref={mdEditorRef}
        className="grow-1 flex flex-col justify-center"
        value={value}
        onChange={(val) => {
          onChange(val || '');
        }}
        commands={customCommands}
        preview={viewMode === "readOnly" ? "preview" : "live"}
        height={400}
      />
    </div>
  );
};

export default MarkdownEditor;