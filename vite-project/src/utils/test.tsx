
import { fetchPublicCategories } from "@/service/CategoryApi";

import { useState } from "react";
import MdEditor from 'react-markdown-editor-lite';
import markdownit from 'markdown-it'
import "react-markdown-editor-lite/lib/index.css";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchDetailPage } from "@/service/PostApi";
import { changePassword } from "@/service/UserApi";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";



// const TestScreen = () => {
//     const [res, setRes] = useState("")
//     const action = async () => {
//         const res = await fetchPublicCategories()
//         console.log(res)
//         setRes(JSON.stringify(res, null, 2))
//     }

//     return (
//         <div className="self-center flex flex-col items-center justify-center h-screen p-10">
//             <Button onClick={action}>Test</Button>
//             <Textarea value={res} className="flex-1 w-full">

//             </Textarea>
//         </div>
//     );
// };

const TestScreen = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    return <>
        <div className="self-center flex flex-col items-center justify-center h-screen p-10">

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button>button</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => {
                        setTimeout(() => {
                            setIsOpen(true)
                        }, 0);
                    }}>
                        Edit
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <div>
                        Hell world

                    </div>
                </DialogContent>
            </Dialog>
        </div>

    </>
}

// const mdParser = new markdownit({
//     html: true,
//     linkify: true,
//     typographer: true,
// });

// const TestScreen = () => {

//     return (
//         <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '40px' }}>
//             <MdEditor
//                 style={{ height: '600px', width: '100%' }}
//                 renderHTML={(text) => mdParser.render(text)}
//                 config={{
//                     view: {
//                         menu: true,
//                         md: true,
//                         html: true,
//                     },
//                     canView: {
//                         menu: true,
//                         md: true,
//                         html: true,
//                         fullScreen: true,
//                         hideMenu: true,
//                     },
//                 }}
//             />
//         </div>
//     );
// };
export default TestScreen