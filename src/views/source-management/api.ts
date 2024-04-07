import { request } from '@/service/request';
// import qs from 'qs';


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
	const res = await request.post('/config/data', data);
  return resHandle(res);
}

export async function DelObj(data: delQuery) {
  const res = await request.post('/config/del', data);
  return resHandle(res);
}

export async function AddObj(data: AddQuery) {
  const res = await request.post(`/config/add`, data);
  return res;
}

export async function UpdateObj(obj: updateQuery) {
  const res = await request.post(`/config/update`, obj);
  return res;
}
