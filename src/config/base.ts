import helpIcon from '@/assets/images/kb-help.png';
import tagsIcon from '@/assets/images/kb-tags.png';
import bookIcon from '@/assets/images/kb-book.png';
import notificationIcon from '@/assets/images/kb-notification.png';
import sealIcon from '@/assets/images/kb-seal.png';
import wrenchIcon from '@/assets/images/kb-wrench.png';

type iconType = {
	id: number,
	icon: any,
	key: string
}

export const kbIconList = [
	{
		id: 1,
		icon: helpIcon,
		key: 'help'
	},
	{
		id: 2,
		icon: tagsIcon,
		key: 'tags'
	},
	{
		id: 1,
		icon: bookIcon,
		key: 'book'
	},
	{
		id: 2,
		icon: notificationIcon,
		key: 'notification'
	},
	{
		id: 1,
		icon: sealIcon,
		key: 'seal'
	},
	{
		id: 2,
		icon: wrenchIcon,
		key: 'wrench'
	}
]

export const kbColorList = ['#2454ff', '#ff0074', '#ffa629', '#9747ff', '#48d1e0'];

export const getKbIcon = (type: string) => {
	const emptyObj: iconType = {
		id: 0,
		icon: '',
		key: ''
	}
	const obj: iconType = kbIconList.find(item => item.key === type) || emptyObj
	return obj.icon
}
