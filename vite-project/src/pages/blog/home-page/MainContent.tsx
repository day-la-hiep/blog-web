import ArticleList from "./ArticleList";

export default function MainContent() {
    return (
        <div className="flex flex-col items-center max-w-1/2">
            <div className="flex gap-5">
                <div className="flex-1">
                    <ArticleList />
                </div>
            </div>
        </div>
    )
}   