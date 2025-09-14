import axios from "axios";
import { benneiro, Relatorios } from "./types";

const api = axios.create({
  // baseURL: "http://localhost:8080",
  baseURL: "https://sgbr-api.up.railway.app/",
});

export function getRelatorios() {
  return api.get<Relatorios[]>("/relatorios")
}

export function getBenneiros() {
  return api.get("/benneiros");
}

export function getBenneiro() {
  return api.get<benneiro[]>("/benneiros");
}

export function postBenneiro(data: Omit<benneiro, "id">) {
  return api.post<benneiro>("/benneiros", data);
}

export function putBenneiro(id: number) {
  return api.put<benneiro>(`/benneiros/${id}`);
}

export function deleteBenneiro(id: number) {
  return api.delete<benneiro>(`/benneiros/${id}`);
}
