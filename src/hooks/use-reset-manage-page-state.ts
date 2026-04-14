import useAppStore from 'stores/use-app-store';
import { useEffect } from 'react';

function useResetManagePageState(resourceKey?: string) {
  const { resetManagePageState } = useAppStore();

  useEffect(() => {
    resetManagePageState(resourceKey);
  }, [resetManagePageState, resourceKey]);
}

export default useResetManagePageState;
