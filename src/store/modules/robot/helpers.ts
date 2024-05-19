import { localStg } from '@/utils';

export interface ChatbotResData {
	ScreenDesc: string;
	ScreenId: string;
	ScreenName: string;
	ScreenQAConfig: Robot.ScreenQAConfig;
	Uid: string;
	UpdateTime: string;
}


export function getChatbotList() {
	const chatbotList: Robot.Chatbot[] = localStg.get('chatbotList') as Robot.Chatbot[];
	return chatbotList;
}

export function getChatbotRecords() {
	const records = localStg.get('chatbotRecords') as Robot.Records[];
	return records;
}

export function getActiveChatbotId() {
	const id = localStg.get('chatbotId') as string;
	return id;
}


export function clearRobotStorage() {
  localStg.remove('chatbotList');
}
