import type { IAnimeResult } from '@consumet/extensions';

export type TypeOfList = 'planning' | 'watching' | 'complete' | 'favorite';

export interface IUserListItem {
    name: string;
    list: IAnimeResult[];
}
