import { useSonner } from "sonner";

export  function useToast() {
    const  toast  = useSonner()
    // const toast = (title: string, description?: string) => {
    //     sonner({
    //         title,
    //         {
    //             description.description
    //         }
    //     })
    // }
    return {toast}
}