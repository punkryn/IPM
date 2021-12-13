export interface IUser {
  id: number;
  nickname: string;
  email: string;
  tabs: ITab[];
}

export interface ITab {
  tab_id: number;
  name: string;
}

export interface IInfo {
  info_id: number;
  tab_id: number;
  tab_name: string;
  userEmail: string;
  hint: string;
  host: string;
}

export interface ITabInfo {
  tab_id: number;
  tab_name: string;
}
