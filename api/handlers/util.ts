import { Request, Response } from 'express'
import crypto from 'crypto';

export function badRequestResponse(res: Response, msg: string) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
  })
  res.end()
}

export function cliStderrResponse(res: Response, msg: string, details: string | undefined) {
  console.log(`ERROR HTTP 400: ${msg}`)
  res.status(400).json({
    errorMessage: msg,
    errorDetails: details,
  })
  res.end()
}

export function unautorizedResponse(req: Request, res: Response) {
  res.status(403).json({
    errorMessage: 'unauthorized',
  })
  console.log(`ERROR HTTP 403: ${req.url}`)
}

export function getHashSalt(): string {
  if (process.env.HASH_SALT) {
    return process.env.HASH_SALT;
  }
  const hashSalt = crypto.randomBytes(16).toString('hex');
  process.env.HASH_SALT = hashSalt;
  return hashSalt;
}

export async function hashSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

