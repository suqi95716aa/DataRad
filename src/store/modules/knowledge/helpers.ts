import { localStg } from '@/utils';


export function getKnowledgeBaseList() {
	const kbList = localStg.get('knowledgeBaseList') || [];
	return kbList;
}
