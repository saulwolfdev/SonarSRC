import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface IQuery {
  name: string;
  value: string;
}

function useQueryString() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
 

  const modifyQueries = (queries: IQuery[]) => {
    const params = new URLSearchParams(searchParams.toString());
    queries.forEach(q => {
      if (q.value === undefined || q.value === '') {
          params.delete(q.name); 
      } else {
          params.set(q.name, q.value); 
      }
  });

    router.push(pathname + "?" + params.toString());
  };
  const remove = () => {
    router.push(pathname);
  };

  const removeQueries = (names: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    names.forEach((name) => {
      params.delete(name);
    });
    router.push(pathname + "?" + params.toString());
  };

  return {
    modifyQueries,
    remove,
    removeQueries,
  };
}
export default useQueryString;
