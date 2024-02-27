export async function GET(request: Request) {
  const client_id = process.env.NAVER_CLIENT_ID;
  const redirect_uri = process.env.NAVER_REDIRECT_URI;
  const state = '랜덤토큰';
  return Response.redirect(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=${state}`);
}