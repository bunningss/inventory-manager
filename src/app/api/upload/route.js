import { NextResponse } from "next/server";
import { getSignedURL } from "@/utils/file-upload";

export async function POST(request) {
  const res = await request.json();

  const signedUrlResult = await getSignedURL(res.files);

  // console.log(signedUrlResult);

  return NextResponse.json({ payload: signedUrlResult });
}
