import { Request } from "express";

export interface SignupRequestBody {
  name: string;
  email: string;
  password?: string;
}

export interface LoginRequestBody {
  email: string;
  password?: string;
}

export interface CreateComponentRequestBody {
  name: string;
  code: string;
  props?: string[];
  visibility?: "private" | "public";
}

export interface TypedRequest<T> extends Request {
  body: T;
}
