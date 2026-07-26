"use client";

import { useCallback, useEffect, useState } from "react";

interface UseWebAuthnOptions {
  /** nombre visible de tu app en el diálogo del sistema */
  appName?: string;
  /** dominio (rp id). Default: el hostname actual */
  rpId?: string;
  /** pedile al backend las options de registro */
  getRegistrationOptions?: () => Promise<PublicKeyCredentialCreationOptions>;
  /** pedile al backend las options de login */
  getAuthenticationOptions?: () => Promise<PublicKeyCredentialRequestOptions>;
  /** enviá la credencial al backend para verificarla */
  verify?: (credential: PublicKeyCredential, kind: "register" | "login") => Promise<boolean>;
}

/**
 * Biometría (Face ID / huella / Windows Hello) vía WebAuthn.
 * Cierra el `onBiometric` de <PinLock/> y <BiometricGate/>.
 *
 * Sin backend no hay verificación real: pasá getRegistrationOptions /
 * getAuthenticationOptions / verify para el flujo completo.
 */
export function useWebAuthn({
  appName = "Mi App",
  rpId,
  getRegistrationOptions,
  getAuthenticationOptions,
  verify,
}: UseWebAuthnOptions = {}) {
  const [available, setAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = typeof window !== "undefined" && Boolean(window.PublicKeyCredential);

  useEffect(() => {
    if (!supported) return;
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable?.()
      .then(setAvailable)
      .catch(() => setAvailable(false));
  }, [supported]);

  const run = useCallback(
    async (kind: "register" | "login", userId?: string, userName?: string) => {
      if (!supported) {
        setError("Este dispositivo no soporta biometría.");
        return false;
      }
      setBusy(true);
      setError(null);
      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        let credential: PublicKeyCredential | null;

        if (kind === "register") {
          const options =
            (await getRegistrationOptions?.()) ??
            ({
              challenge,
              rp: { name: appName, id: rpId ?? location.hostname },
              user: {
                id: new TextEncoder().encode(userId ?? "user"),
                name: userName ?? "usuario",
                displayName: userName ?? "Usuario",
              },
              pubKeyCredParams: [
                { type: "public-key", alg: -7 },
                { type: "public-key", alg: -257 },
              ],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
                residentKey: "preferred",
              },
              timeout: 60000,
            } satisfies PublicKeyCredentialCreationOptions);
          credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential;
        } else {
          const options =
            (await getAuthenticationOptions?.()) ??
            ({
              challenge,
              rpId: rpId ?? location.hostname,
              userVerification: "required",
              timeout: 60000,
            } satisfies PublicKeyCredentialRequestOptions);
          credential = (await navigator.credentials.get({ publicKey: options })) as PublicKeyCredential;
        }

        if (!credential) throw new Error("Cancelado");
        if (verify) return await verify(credential, kind);
        return true;
      } catch (e) {
        const err = e as DOMException;
        setError(
          err.name === "NotAllowedError" ? "Cancelaste la verificación." : err.message || "Falló la verificación.",
        );
        return false;
      } finally {
        setBusy(false);
      }
    },
    [appName, getAuthenticationOptions, getRegistrationOptions, rpId, supported, verify],
  );

  return {
    supported,
    /** hay lector biométrico en el dispositivo */
    available,
    busy,
    error,
    register: (userId?: string, userName?: string) => run("register", userId, userName),
    authenticate: () => run("login"),
  };
}
