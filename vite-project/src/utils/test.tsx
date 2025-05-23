
import { fetchPublicCategories } from "@/service/CategoryApi";

import { useState } from "react";
import MdEditor from 'react-markdown-editor-lite';
import markdownit from 'markdown-it'
import "react-markdown-editor-lite/lib/index.css";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchDetailPage } from "@/service/PostApi";
import { changePassword } from "@/service/UserApi";


const TestScreen = () => {
    const [res, setRes] = useState("")
    const action = async () => {
        const res = await fetchPublicCategories()
        console.log(res)
        setRes(JSON.stringify(res, null, 2))
    }

    return (
        <div className="self-center flex flex-col items-center justify-center h-screen p-10">
            <Button onClick={action}>Test</Button>
            <Textarea value={res} className="flex-1 w-full">

            </Textarea>
        </div>
    );
};


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