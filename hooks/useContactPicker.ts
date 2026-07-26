"use client";

import { useCallback, useEffect, useState } from "react";

export interface PickedContact {
  name?: string;
  tel?: string;
  email?: string;
}

type ContactsManager = {
  select: (props: string[], opts?: { multiple?: boolean }) => Promise<Record<string, string[]>[]>;
  getProperties: () => Promise<string[]>;
};

/**
 * Selector de contactos del sistema (Android/Chrome). El usuario elige qué
 * contacto compartir: no tenés acceso a la agenda completa.
 * Necesita HTTPS y un gesto del usuario.
 */
export function useContactPicker() {
  const [supported, setSupported] = useState(false);
  const [contacts, setContacts] = useState<PickedContact[]>([]);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "contacts" in navigator && "ContactsManager" in window);
  }, []);

  const pick = useCallback(async (multiple = false): Promise<PickedContact[]> => {
    const mgr = (navigator as unknown as { contacts?: ContactsManager }).contacts;
    if (!mgr) return [];
    try {
      const available = await mgr.getProperties();
      const props = ["name", "tel", "email"].filter((p) => available.includes(p));
      const picked = await mgr.select(props, { multiple });
      const mapped = picked.map((c) => ({
        name: c.name?.[0],
        tel: c.tel?.[0],
        email: c.email?.[0],
      }));
      setContacts(mapped);
      return mapped;
    } catch {
      return [];
    }
  }, []);

  return { supported, pick, contacts };
}
