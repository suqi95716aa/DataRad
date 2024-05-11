import { request } from '@/service/request';
// import qs from 'qs';

const baseURL = import.meta.env.DEV ? '/api' : ''


type FormDataType = {
	[key: string]: any;
}

type AddQuery = {
	[key: string]: any;
}

type delQuery = {
	[key: string]: any;
}

type updateQuery = {
	[key: string]: any;
}

function resHandle(res: any) {
  return res.data;
}

export async function GetDetails(data: FormDataType) {
	const res = await request.post(`${baseURL}/config/data`, data);
  return resHandle(res);
}

export async function DelObj(data: delQuery) {
  const res = await request.post(`${baseURL}/config/del`, data);
  return resHandle(res);
}

export async function AddObj(data: AddQuery) {
  const res = await request.post(`${baseURL}/config/add`, data);
  return res;
}

export async function UpdateObj(obj: updateQuery) {
  const res = await request.post(`${baseURL}/config/update`, obj);
  return res;
}

export async function DownloadObj(obj: updateQuery) {
  const res = await request.post(`${baseURL}/config/download`, obj, { responseType: 'blob' });
  return res;
}
