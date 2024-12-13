import { useSelector, TypedUseSelectorHook } from 'react-redux';

import { RootState } from '@/state/index.ts';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
