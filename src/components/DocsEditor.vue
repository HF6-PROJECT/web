<template>
	<div class="bg-white">
		<EditorContent v-if="editor" :editor="editor" />
	</div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import StarterKit from '@tiptap/starter-kit';
import * as Y from 'yjs';
import { createClient } from '@liveblocks/client';
import LiveblocksProvider from '@liveblocks/yjs';
import { type DocsType } from '@lib/items/docs';
import { type PropType } from 'vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<DocsType>,
		required: true,
	},

	user: {
		type: Object as PropType<{ name: string; color: string }>,
		required: true,
	},
});

const client = createClient({
	publicApiKey: 'pk_dev_Nwp6X3J4wQWoOKenVZfTTo20uVznlY5ir2_W95bx0RjleqvW7LKKMlPbCZISFsYI',
});

// We save text as a UUID room name
const room = client.enter(props.modelValue.text, { initialPresence: {} });

// Create Yjs document and provider

const yDoc = new Y.Doc();

const yProvider = new LiveblocksProvider(room, yDoc);

const editor = useEditor({
	editorProps: {
		attributes: {
			// Add styles to editor element

			class: 'editor',
		},
	},
	extensions: [
		StarterKit.configure({
			// The Collaboration extension comes with its own history handling

			history: false,
		}),

		Collaboration.configure({
			document: yDoc,
		}),

		// Attach provider and user info
		CollaborationCursor.configure({
			provider: yProvider,
			user: props.user,
		}),
	],
});
</script>

<style>
.editor {
	border-radius: inherit;
	flex-grow: 1;
	width: 100%;
	min-height: 100vh;
	padding: 1rem;
}

.editor p {
	margin: 1em 0;
}

/* Give a remote user a caret */
.collaboration-cursor__caret {
	border-left: 1px solid #0d0d0d;

	border-right: 1px solid #0d0d0d;

	margin-left: -1px;

	margin-right: -1px;

	pointer-events: none;

	position: relative;

	word-break: normal;
}

/* Render the username above the caret */

.collaboration-cursor__label {
	font-style: normal;

	font-weight: 600;

	left: -1px;

	line-height: normal;

	position: absolute;

	user-select: none;

	white-space: nowrap;

	font-size: 14px;

	color: #fff;

	top: -1.4em;

	border-radius: 6px;

	border-bottom-left-radius: 0;

	padding: 2px 6px;

	pointer-events: none;
}
</style>
