import axios from "axios";
import { benneiro } from "./types";

const api = axios.create({
    baseURL: process.env.localHost_API})


    export function getBenneiro() {
        return api.get<benneiro[]>("/benneiros")
    }

    export function postBenneiro() {
        return api.post<benneiro[]>("/benneiros")
    }