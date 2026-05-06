import { Env as MainEnv } from "../../const/env";

export const GOOGLE_CLIENT_ID: string = MainEnv.GOOGLE_CLIENT_ID ?? "";

export const IS_DEV: boolean = import.meta.env.DEV;

export const IS_PROD: boolean = import.meta.env.PROD;
