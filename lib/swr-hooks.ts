import useSWR from 'swr';

const fetcher = async (url: string) => {
  return await window.fetch(url).then((res) => res.json());
};

export function useAEs() {
  const { data, error } = useSWR(`/api/get-aes`, fetcher);

  return {
    aes: data,
    isLoading: !error && !data,
    isError: error
  };
}
