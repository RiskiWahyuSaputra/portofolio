"use client";

import { createContext, useContext, useState } from "react";

type Lang = "EN" | "ID";
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "EN",
  toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("EN");
  const toggle = () => setLang((l) => (l === "EN" ? "ID" : "EN"));
  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
