import ArticleList from "./ArticleList";

export default function MainContent() {
    return (
        <div className="flex flex-col items-center max-w-2/3">
            <div className="flex-1 gap-5 w-full">
                    <ArticleList />
            </div>
        </div>
    )
}   