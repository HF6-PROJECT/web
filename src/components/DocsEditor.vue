<template>
	<div class="bg-white">
		<EditorContent v-if="editor" :editor="editor" />
	</div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from '@tiptap/starter-kit';
import * as Y from 'yjs';
import { createClient } from '@liveblocks/client';
import LiveblocksProvider from '@liveblocks/yjs';

const props = defineProps({
	docs: {
		type: Object as PropType<Docs>,
		required: true,
	},
});

const client = createClient({
	publicApiKey: 'pk_dev_Nwp6X3J4wQWoOKenVZfTTo20uVznlY5ir2_W95bx0RjleqvW7LKKMlPbCZISFsYI',
});

const room = client.enter('your-room-id', { initialPresence: {} });

// Create Yjs document and provider

const yDoc = new Y.Doc();

const yProvider = new LiveblocksProvider(room, yDoc);

const editor = useEditor({
	extensions: [
		StarterKit.configure({
			// The Collaboration extension comes with its own history handling

			history: false,
		}),

		// Register the document with Tiptap

		Collaboration.configure({
			document: yDoc,
		}),
	],
});
</script>
