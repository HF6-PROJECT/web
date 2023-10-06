import { useEventBus, type EventBusKey } from '@vueuse/core';

const contextMenuOpenEvent: EventBusKey<{ name: 'contextMenuOpen' }> = Symbol('contextMenuOpen');

const bus = useEventBus(contextMenuOpenEvent);

export default bus;
