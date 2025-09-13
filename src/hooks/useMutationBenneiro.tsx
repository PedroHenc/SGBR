import {
  deleteBenneiro,
  getBenneiros,
  postBenneiro,
  putBenneiro,
} from "@/services/sgbr-api";
import { benneiro } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationBenneiro = () => {
  const queryClient = useQueryClient();

  const getBenneirosMutate = useMutation({
    mutationFn: getBenneiros,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benneiros"] });
    },
  });

  const postBenneiroMutate = useMutation({
    mutationFn: postBenneiro,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benneiros"] });
    },
  });

  const putBenneiroMutate = useMutation<any, Error, benneiro>({
    mutationFn: (data) => putBenneiro(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benneiros"] });
    },
  });

  const delBenneiroMutate = useMutation<any, Error, benneiro>({
    mutationFn: (data) => deleteBenneiro(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["benneiros"] });
    },
  });

  return {
    getBenneiro: getBenneirosMutate,
    postBenneiro: postBenneiroMutate,
    putBenneiro: putBenneiroMutate,
    deleteBenneiro: delBenneiroMutate,
  };
};

export default useMutationBenneiro;
