import { postBenneiro } from "@/services/sgbr-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationBenneiro = () => {
    const queryClient = useQueryClient();

    const postBenneiromutate = useMutation({
        mutationFn: postBenneiro,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["benneiros"]});
        }
    })

    return {
        postBenneiro: postBenneiromutate,
    }
}

export default useMutationBenneiro;