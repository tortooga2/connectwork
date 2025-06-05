import { auth } from "@clerk/nextjs/server";
import crypto from "crypto"
import {genPresignedUrl} from "@/lib/s3/module.genPresignedUrl"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  console.log(params)
  const count = params.get('count');

  if(!count){
    return new Response("Missing File Count", {status : 400})
  }

  const urls : string[] = [];
  const keys : string[] = [];

  const fileCount = parseInt(count)

  if (isNaN(fileCount) || fileCount < 1) {
    return new Response("Missing File Count", {status : 400})
  }

  try {
    for (let i = 0; i < fileCount; i++) {
      const key = crypto.randomBytes(16).toString("hex");

      urls.push(await genPresignedUrl(userId, key, "PUT"));

      keys.push(key);
    }

    console.log(urls);

    return NextResponse.json({
      okay: true,
      urls: urls,
      keys: keys,
    }, {status : 200})

  } catch (err) {
    console.log(err)
    return new Response("Encountered an unknown condition. Either failed to generate presignedUrl or something far worse :(", {status : 500})
  }
}
