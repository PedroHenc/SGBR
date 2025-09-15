import {
  deleteBenneiro,
  getBenneiros,
  getRelatorios,
  postBenneiro,
  putBenneiro,
} from "@/services/sgbr-api";
import { benneiro } from "@/services/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useMutationBenneiro = () => {
  const queryClient = useQueryClient();

  const getRelaotiriosMutate = useMutation({
    mutationFn: getRelatorios,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["relatorios"] });
    },
  });

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

const delBenneiroMutate = useMutation<any, Error, number>({
  mutationFn: (id) => deleteBenneiro(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["benneiros"] });
  },
});
  return {
    getRelatorios: getRelaotiriosMutate,
    getBenneiro: getBenneirosMutate,
    postBenneiro: postBenneiroMutate,
    putBenneiro: putBenneiroMutate,
    deleteBenneiro: delBenneiroMutate,
  };
};

export default useMutationBenneiro;
