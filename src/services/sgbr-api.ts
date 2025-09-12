import axios from "axios";
import { benneiro } from "./types";

const api = axios.create({
    baseURL: "https://sgbr-api.up.railway.app/"})


    export function getBenneiro() {
        return api.get<benneiro[]>("/benneiros")
    }

    export function postBenneiro() {
        return api.post<benneiro[]>("/benneiros")
    }