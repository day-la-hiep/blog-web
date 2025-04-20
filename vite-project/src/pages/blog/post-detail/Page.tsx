import { Separator } from "@/components/ui/separator"
import ArticleRecommend from "./ArticleRecommend"
import { Post } from '@/type/Post'
import CommentSection from "./CommentSection"
import MarkdownPreview from "@/components/ui/MarkdownPreview"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bookmark, Share2, ThumbsUp } from "lucide-react"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchPost } from "@/service/PostService"
import './MarkdownContent.css'

interface PostDetailProps {
    recommendPosts?: Post[]
}

const Page: React.FC<PostDetailProps> = ({ recommendPosts }) => {
    const { id } = useParams()
    const [post, setPost] = useState<Post>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadPost = async () => {
            console.log("id", id)
            if (id) {
                const postData = await fetchPost(parseInt(id))
                setPost(postData)
                setIsLoading(false)
            }
        }
        loadPost()
    }, [id])

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full max-w-4xl px-4 py-8 space-y-8">
                {/* Article Header */}
                <div className="space-y-6">
                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        {post?.title}
                    </h1>

                    {/* Author and Actions */}
                    <div className="flex items-center justify-between py-4 border-y border-gray-200">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={post?.authorAvatar} alt={post?.authorName} />
                                <AvatarFallback className="text-lg">{post?.authorName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-gray-900 text-lg">{post?.authorName}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(post?.createdAt || "").toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                <ThumbsUp className="h-4 w-4" />
                                <span>Like</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                <Bookmark className="h-4 w-4" />
                                <span>Save</span>
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center space-x-2">
                                <Share2 className="h-4 w-4" />
                                <span>Share</span>
                            </Button>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post?.thumbNailUrl && (
                        <div className="flex justify-center items-center w-full">
                            <div className="w-full max-w-3xl relative aspect-[16/9] rounded-lg overflow-hidden">
                                <img
                                    src={post.thumbNailUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover absolute inset-0"
                                />
                            </div>
                        </div>
                    )}

                    {/* Summary */}
                    <p className="text-xl text-gray-600 leading-relaxed">
                        {post?.summary}
                    </p>
                </div>

                {/* Main Content */}
                <article className="prose prose-lg max-w-none w-full flex flex-col items-center">
                    <div className="w-full max-w-3xl">
                        <MarkdownPreview content={post?.content || ""} />
                    </div>
                </article>

                {/* Tags */}
                {post?.categories && post.categories.length > 0 && (
                    <div className="py-6">
                        <h3 className="text-lg font-semibold mb-3">Topics</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.categories.map((category: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <Separator className="my-8" />

                {/* Comments Section */}
                <section className="py-6 w-full">
                    <CommentSection />
                </section>

                <Separator className="my-8" />

                {/* Recommended Articles */}
                <section className="py-6 w-full">
                    <ArticleRecommend />
                </section>
            </div>
        </div>
    )
}

export default Page


function getMarkdownSample() {
    const content = `# I solved 1583 LeetCode problems. But you only need these 300.

![alt text](https://miro.medium.com/v2/resize:fit:720/format:webp/1*veZ8QyHJ7W6b9EnPikj50A.png)

Over the past six years, I've solved more than 1500 LeetCode problems.

But for a long time, I felt stuck.

I used to believe that simply solving more problems would automatically make me better at LeetCode. So, I kept grinding through problems, thinking that quantity alone would lead to mastery.

But despite my growing problem count, my problem-solving skills didn't grow as much as I'd hoped.

Although solving more problems does help me in the beginning but most people spend too much time solving the wrong problems.

If your goal is to get better at LeetCode in short time, you should aim for quality problems and go deep into them rather than solving too many problems at a surface level.

Here are some tips that worked for me:

- Prioritize solving problems over theory.
- Visualize it using pen and paper.
- Understand, don't memorize. Sit through a problem until you fully understand why a solution works.
- Learn the patterns behind problems.
- For every problem you solve, ask yourself: what is one thing knowing which made everything else easier?
- Revisit problems which you couldn't solve in one go.
- Be consistent with your practice.

### So, how many problems one should solve?

The ideal number is subjective, but from experience, I've found that 300 well-chosen problems hit the sweet spot.

But it's not just any 300 problems.

You should focus on high-quality problems that cover the most common patterns and problem types.

To make it easier for you, I created this free resource — a curated list of the top 300 LeetCode problems organized into 60 key topics and patterns. This list is designed to help you prepare smarter, not harder.

It covers all the essential patterns and problems you need to master to succeed in coding interviews.

So, how many problems one should solve?
The ideal number is subjective, but from experience, I've found that 300 well-chosen problems hit the sweet spot.

But it's not just any 300 problems.

You should focus on high-quality problems that cover the most common patterns and problem types.

To make it easier for you, I created this free resource — a curated list of the top 300 LeetCode problems organized into 60 key topics and patterns. This list is designed to help you prepare smarter, not harder.

It covers all the essential patterns and problems you need to master to succeed in coding interviews.

![alt text](https://miro.medium.com/v2/resize:fit:720/format:webp/1*CFJDQqyIfPgHMG1c6nCxfw.png)`
    return content
}

function getHTMLContent() {
    const content = `<h1>I solved 1583 LeetCode problems. But you only need these 300.</h1><p>&nbsp;</p><figure class="image"><img style="aspect-ratio:720/381;" src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*veZ8QyHJ7W6b9EnPikj50A.png" width="720" height="381"></figure><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="ad4c" data-selectable-paragraph="">Over the past six years, I've solved more than 1500 LeetCode problems.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="ad4c" data-selectable-paragraph="">But for a long time, I felt stuck.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="98c9" data-selectable-paragraph="">I used to believe that simply solving more problems would automatically make me better at LeetCode. So, I kept grinding through problems, thinking that quantity alone would lead to mastery.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="fbe6" data-selectable-paragraph="">But despite my growing problem count, my problem-solving skills didn't grow as much as I'd hoped.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="a67d" data-selectable-paragraph="">Although solving more problems does help me in the beginning but most people spend too much time solving the wrong problems.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="9147" data-selectable-paragraph="">If your goal is to get better at LeetCode in short time, you should aim for <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">quality problems</strong> and go deep into them rather than solving too many problems at a surface level.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="bb3e" data-selectable-paragraph="">Here are some tips that worked for me:</p><ul><li><p style="margin-left:0px;">Prioritize solving problems over theory.</p></li><li><p style="margin-left:0px;">Visualize it using pen and paper.</p></li><li><p style="margin-left:0px;">Understand, don't memorize. Sit through a problem until you fully understand why a solution works.</p></li><li><p style="margin-left:0px;">Learn the patterns behind problems.</p></li><li><p style="margin-left:0px;">For every problem you solve, ask yourself: what is one thing knowing which made everything else easier?</p></li><li><p style="margin-left:0px;">Revisit problems which you couldn't solve in one go.</p></li><li><p style="margin-left:0px;">Be consistent with your practice.</p></li></ul><h2 class="aew aex yc bf aey aez afa afb jg afc afd afe jj aeb aff afg afh aef afi afj afk aej afl afm afn afo bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:sohne, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;letter-spacing:normal;line-height:24px;margin:1.72em 0px -0.31em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;" id="a7d8" data-selectable-paragraph=""><strong class="al" style="box-sizing:inherit;font-weight:inherit;">So, how many problems one should solve?</strong></h2><p class="pw-post-body-paragraph adq adr yc ads b adt afp adv adw adx afq adz aea aeb afr aed aee aef afs aeh aei aej aft ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:0.94em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="9bdc" data-selectable-paragraph="">The ideal number is subjective, but from experience, I've found that <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">300 well-chosen problems</strong> hit the sweet spot.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="71c9" data-selectable-paragraph="">But it's not just any 300 problems.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="f95e" data-selectable-paragraph="">You should focus on <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">high-quality problems</strong> that cover the most common patterns and problem types.</p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="7d69" data-selectable-paragraph=""><mark class="aoo aob ao" style="background-color:rgb(187, 219, 186);box-sizing:inherit;color:currentcolor;cursor:pointer;">To make it easier for you, I created this </mark><a class="af la" style="-webkit-tap-highlight-color:transparent;box-sizing:inherit;color:inherit;" target="_blank" rel="noopener noreferrer ugc nofollow" href="https://algomaster.io/practice/dsa-patterns"><mark class="aoo aob ao" style="background-color:rgb(187, 219, 186);box-sizing:inherit;color:currentcolor;cursor:pointer;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;"><u>free resource</u></strong></mark></a><mark class="aoo aob ao" style="background-color:rgb(187, 219, 186);box-sizing:inherit;color:currentcolor;cursor:pointer;"> — a curated list of the <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">top 300 LeetCode problems</strong> organized into <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">60 key topics and patterns</strong>. This list is designed to help you prepare <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">smarter, not harder</strong>.</mark></p><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="4733" data-selectable-paragraph="">It covers all the essential patterns and problems you need to master to succeed in coding interviews.</p><figure class="image"><img style="aspect-ratio:720/575;" src="https://miro.medium.com/v2/resize:fit:720/format:webp/1*CFJDQqyIfPgHMG1c6nCxfw.png" width="720" height="575"></figure><ul><li><p style="margin-left:0px;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">Detailed Solutions</strong>: Each problem comes with intuitive explanations, multiple approaches, and time complexity analysis — all available in a dedicated <a class="af la" style="-webkit-tap-highlight-color:transparent;box-sizing:inherit;color:inherit;" target="_blank" rel="noopener noreferrer ugc nofollow" href="https://github.com/AlgoMaster-io/leetcode-solutions"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;"><u>GitHub repo</u></strong></a>.</p></li><li><p style="margin-left:0px;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">Multiple Languages</strong>: Supports <strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">7 popular programming languages</strong> for interviews: Java, Python, C++, C#, JavaScript, TypeScript, and Go.</p></li><li><p style="margin-left:0px;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">Structured Learning Tracks</strong>: Choose a track based on your preparation time whether you have more than 3 months or less than a month.</p></li><li><p style="margin-left:0px;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">Filters</strong>: Filter problems by pattern, difficulty, status, or keywords.</p></li><li><p style="margin-left:0px;"><strong class="ads rb" style="box-sizing:inherit;font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;">Track Your Progress</strong>: Mark problems as completed or star them for revision.</p></li><li><p class="pw-post-body-paragraph adq adr yc ads b adt adu adv adw adx ady adz aea aeb aec aed aee aef aeg aeh aei aej aek ael aem aen rk bk" style="-webkit-text-stroke-width:0px;background-color:rgb(255, 255, 255);box-sizing:inherit;color:rgb(36, 36, 36);font-family:source-serif-pro, Georgia, Cambria, &quot;Times New Roman&quot;, Times, serif;font-size:20px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:-0.003em;line-height:32px;margin:2.14em 0px -0.46em;orphans:2;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-break:break-word;word-spacing:0px;" id="07fe" data-selectable-paragraph="">Hope you found it valuable!</p></li></ul>
    // `
    return content
}