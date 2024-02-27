import { AxiosFailure, AxiosSuccess, NaverErrorResponsePayload, NaverRefreshResponsePayload } from "@/interfaces/common";
import axios, { AxiosHeaders } from "axios";

export async function POST(request: Request) {
  const body = await request.json();
  const refreshToken = body.refreshToken;

  const client_id = process.env.NAVER_CLIENT_ID;
  const redirect_uri = process.env.NAVER_REDIRECT_URI;
  const client_secret = process.env.NAVER_CLIENT_SECRET;

  const data = {
    grant_type: 'refresh_token',
    client_id,
    refresh_token: refreshToken,
    client_secret,
  };

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append('grant_type', 'refresh_token');
  urlSearchParams.append('client_id', client_id ?? '');
  urlSearchParams.append('client_secret', client_secret ?? '');
  urlSearchParams.append('refresh_token', refreshToken ?? '');

  const refresh_result = await axios.request({
    url: `https://nid.naver.com/oauth2.0/token?` + urlSearchParams.toString(),
    method: 'get',
  }).then(res => {
    return new AxiosSuccess<NaverRefreshResponsePayload>(res);
  }).catch(res => {
    return new AxiosFailure<NaverErrorResponsePayload>(res);
  });

  if (refresh_result instanceof AxiosFailure) {
    return new Response(JSON.stringify({ msg: `네이버로부터 토큰을 갱신하는데 실패하였습니다.`, ...refresh_result.payload }), {
      status: refresh_result.response.status,
    });
  }

  console.log('@refresh_result.payload', refresh_result.payload);

  return Response.json({ status: 200 });
}