import { AxiosFailure, AxiosSuccess, NaverErrorResponsePayload, NaverTokenResposnePayload } from "@/interfaces/common";
import axios, { AxiosHeaders } from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const client_id = process.env.NAVER_CLIENT_ID;
  const redirect_uri = process.env.NAVER_REDIRECT_URI;
  const client_secret = process.env.NAVER_CLIENT_SECRET;

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // token 요청
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('grant_type', 'authorization_code');
  urlSearchParams.append('client_id', client_id ?? '');
  urlSearchParams.append('client_secret', client_secret ?? '');
  urlSearchParams.append('redirect_uri', redirect_uri ?? '');
  urlSearchParams.append('code', code ?? '');
  urlSearchParams.append('state', state ?? '');

  const url = 'https://nid.naver.com/oauth2.0/token?' + urlSearchParams.toString();

  const token_result = await axios.request({
    url,
    method: 'get',
    headers: new AxiosHeaders({
      'X-Naver-Client-Id': client_id ?? '',
      'X-Naver-Client-Secret': client_secret ?? '',
    }),
  }).then(res => {
    return new AxiosSuccess<NaverTokenResposnePayload>(res);
  }).catch(res => {
    return new AxiosFailure<NaverErrorResponsePayload>(res);
  });

  if (token_result instanceof AxiosFailure) {
    return new Response(JSON.stringify({ msg: `네이버로부터 토큰을 받아오는데 실패하였습니다.`, ...token_result.payload }), {
      status: token_result.response.status,
    });
  }

  console.log('@token_result.payload', token_result.payload);

  // access token 정보 요청
  const access_token_info_result = await axios.request({
    url: `https://openapi.naver.com/v1/nid/me`,
    method: 'get',
    headers: new AxiosHeaders({
      "Authorization": `Bearer ${token_result.payload.access_token}`,
    }),
  }).then(res => {
    return new AxiosSuccess(res);
  }).catch(res => {
    return new AxiosFailure<NaverErrorResponsePayload>(res);
  });

  if (access_token_info_result instanceof AxiosFailure) {
    return new Response(JSON.stringify({ msg: `네이버로부터 토큰 정보를 받아오는데 실패하였습니다.`, ...access_token_info_result.payload }), {
      status: access_token_info_result.response.status,
    });
  }

  console.log('@access_token_info_result.payload', access_token_info_result.payload);

  return Response.json({ status: 200 });
}