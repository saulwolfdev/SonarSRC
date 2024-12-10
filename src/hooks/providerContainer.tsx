import { useContext,createContext, useState } from "react";

interface YPFContextValue {
    setAlertError: (alert: string | null) => void;
    alertError: string | null;
    alertInfo: string | null;
    setAlertInfo: (alert: string | null) => void;
    alertSuccess: string | null;
    setAlertSuccess: (alert: string | null) => void;
  }
  

export const YPFContext = createContext<YPFContextValue | undefined>(undefined);

function useProviderYPF() {  
    const [alertInfo, setAlertInfo] = useState<string | null>(null);
    const [alertSuccess, setAlertSuccess] = useState<string | null>(null);
    const [alertError, setAlertError] = useState<string | null>(null);
  
    return {
      alertInfo,
      setAlertInfo,
      alertSuccess,
      setAlertSuccess,
      alertError,
      setAlertError
    }
}

export function ProvideYPF({ children }: any) {
    const ypf = useProviderYPF();
    return <YPFContext.Provider value={ypf}>{children}</YPFContext.Provider>;
}

const useYPFContext = () => {
    const context = useContext(YPFContext);

    if (context === undefined) {
        throw new Error(
            "useYPFContext must be used within a OperatorContextProvider"
        );
    }

    return context;
};

export default useYPFContext;