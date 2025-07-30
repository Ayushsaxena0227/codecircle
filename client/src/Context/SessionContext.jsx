import { createContext, useState, useContext } from "react";
export const SessionContext = createContext(null);
export const useSession = () => useContext(SessionContext);

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null); // { id, hostId, allowGuestRun }
  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
