import { AxiosError, AxiosResponse } from "axios";

export interface NaverTokenResposnePayload {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
  expires_in: `${number}`;
}

export interface NaverUserInfoResponsePayload {
  resultcode: string;
  message: string;
  response: {
    // https://developers.naver.com/docs/login/profile/profile.md
    id: string;
    nickname?: string;
    profile_image?: string;
    email?: string;
    name?: string;
    gender?: 'F' | 'M' | 'U';
    age?: string;
    birthday?: string;
    birthyear?: string;
    mobile?: string;
  }
}

export interface NaverRefreshResponsePayload {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer',
  expires_in: `${number}`;
}

export interface NaverErrorResponsePayload {
  error: string;
  error_description: string;
}

export class AxiosSuccess<T> {
  response: AxiosResponse;
  payload: T;

  constructor(response: AxiosResponse) {
    this.response = response;
    this.payload = response.data;
  }
}

export class AxiosFailure<T> {
  response: AxiosError;
  payload: T | undefined;
  error: Error | undefined;

  constructor(response: AxiosError) {
    this.response = response;
    this.error = this.response.cause;
    this.payload = response.response?.data as T;
  }
}