import { BASE_URL, LOGTO_APPID } from "./const";

export const reorder = <T>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] => {
  const [removed] = list.splice(startIndex, 1);
  list.splice(endIndex, 0, removed);

  return list;
};

export const getToken = () => {
  const accessTokenObject: any = JSON.parse(
    localStorage.getItem(`logto:${LOGTO_APPID}:accessToken`) ?? "{}",
  );
  return accessTokenObject[`@${BASE_URL}`].token || "";
};
