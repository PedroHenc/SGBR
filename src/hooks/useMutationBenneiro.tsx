import { postBenneiro, putBenneiro } from "@/services/sgbr-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { benneiro } from "@/services/types";

const useMutationBenneiro = () => {
    const queryClient = useQueryClient();

    const postBenneiroMutate = useMutation<any, Error, Omit<benneiro, 'id'>>({
        mutationFn: (data) => postBenneiro(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["benneiros"]});
        }
    })

    const putBenneiroMutate = useMutation<any, Error, benneiro>({
        mutationFn: (data) => putBenneiro(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["benneiros"]});
        }
    })


    return {
        postBenneiro: postBenneiroMutate,
        putBenneiro: putBenneiroMutate,
    }
}

export default useMutationBenneiro;
