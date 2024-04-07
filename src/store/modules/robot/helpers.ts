import { localStg } from '@/utils';


export function getChatbotList() {
	const chatbotList = localStg.get('chatbotList') || [];
	return chatbotList;
}

export function getChatbotRecords() {
	const records = localStg.get('chatbotRecords') || [];
	return records;
}

export function getActiveChatbotId() {
	const id = localStg.get('chatbotId') || "";
	return id;
}


export function clearRobotStorage() {
  localStg.remove('chatbotList');
}
