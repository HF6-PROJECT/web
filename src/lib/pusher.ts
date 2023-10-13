import Pusher from 'pusher-js';

Pusher.logToConsole = true;

const pusher = new Pusher(import.meta.env.PUBLIC_PUSHER_APP_KEY, {
	cluster: import.meta.env.PUBLIC_PUSHER_APP_CLUSTER,
});

const getFolderChannel = (userId: number, itemId: number | null | undefined) => {
	const channelName = itemId ? `browser-folder-${itemId}` : `browser-root-${userId}`;

	return pusher.subscribe(channelName);
};

export { pusher, getFolderChannel };
