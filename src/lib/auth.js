// src/lib/auth.js
import "server-only";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const COOKIE_NAME = "token";

const secretString = process.env.JWT_SECRET || "";
const SECRET = secretString ? new TextEncoder().encode(secretString) : null;

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Vérifie le JWT présent dans le cookie `token`.
 * Retourne { isValid, user, response } :
 *  - isValid: boolean
 *  - user: payload du token si valide
 *  - response: NextResponse prêt à renvoyer (erreurs 401/500), sinon null
 */
export async function verifyJWT(request) {
  if (!SECRET) {
    console.error("[auth] JWT_SECRET manquant");
    return {
      isValid: false,
      user: null,
      response: NextResponse.json(
        { error: "Configuration serveur invalide" },
        { status: 500, headers: NO_STORE }
      ),
    };
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return {
      isValid: false,
      user: null,
      response: NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401, headers: NO_STORE }
      ),
    };
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { isValid: true, user: payload, response: null };
  } catch (error) {
    // JWT invalide/expiré : on nettoie le cookie côté client
    const res = NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 401, headers: NO_STORE }
    );
    res.cookies.delete(COOKIE_NAME);
    return { isValid: false, user: null, response: res };
  }
}

/**
 * Enveloppe pour sécuriser un handler d'API:
 * withAuth(async (req, { params, user }) => { ... })
 */
export function withAuth(handler) {
  return async (request, context) => {
    const { isValid, user, response } = await verifyJWT(request);
    if (!isValid) return response;
    return handler(request, { ...context, user });
  };
}
