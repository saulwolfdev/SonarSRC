import useLoadingStore from "@/zustand/shared/useLoadingStore";
import { useRouter } from "next/router";

export function useRouterPush() {
    const router = useRouter();
    const { setLoading } = useLoadingStore(); 
  
    const navigate = async (url: string) => {
      setLoading(true);
      try {
        await router.push(url); 
      } finally {
        setLoading(false); 
      }
    };
  
    return navigate; 
  }

  export function useRouterPushQuery() {
    const router = useRouter(); 
    const { setLoading } = useLoadingStore(); 
  
    const navigate = async ({pathname, query}:{pathname: string, query: any}) => {
      setLoading(true); 
      try {
        await router.push({pathname: pathname, query: query,}); 
      } finally {
        setLoading(false); 
      }
    };
  
    return navigate; 
  }