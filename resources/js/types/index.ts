export type * from './auth';
export type * from './models';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';
import type { Division } from './models';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    divisions: Pick<Division, 'id' | 'name' | 'slug'>[];
    [key: string]: unknown;
};
