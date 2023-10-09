import { useEventBus, type EventBusKey } from '@vueuse/core';
import { isModalOpen } from '@stores/modal';

const contextMenuOpenEvent: EventBusKey<{ name: 'contextMenuOpen' }> = Symbol('contextMenuOpen');

const bus = useEventBus(contextMenuOpenEvent);

isModalOpen.listen((isOpen) => {
	if (isOpen) {
		bus.emit();
	}
});

export default bus;
