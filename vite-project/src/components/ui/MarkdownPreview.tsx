import MDEditor from "@uiw/react-md-editor"

interface MarkdownPreviewProps{
    content: string
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({content}) => {
    return (
        <div className="markdown-editor flex flex-col items-center p-0 w-full">
        <MDEditor.Markdown
            className="w-full flex flex-col items-baseline"
            source={content}
        />
    </div>
    )
}

export default MarkdownPreview