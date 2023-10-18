export default {
	auth: {
		field: {
			name: 'Your name',
			namePlaceholder: 'John Doe',
			email: 'Your email',
			emailPlaceholder: 'name@company.com',
			password: 'Your password',
			passwordPlaceholder: '••••••••',
			passwordConfirm: 'Confirm password',
			passwordConfirmPlaceholder: '••••••••',
			passwordNew: 'New password',
			passwordNewPlaceholder: '••••••••',
			passwordNewConfirm: 'Confirm New password',
			passwordNewConfirmPlaceholder: '••••••••',
		},
		link: {
			forgotPassword: 'Forgot password?',
			notRegistered: 'Not registered?',
			createAccount: 'Create account',
			alreadyRegistered: 'Already registered?',
			loginHere: 'Login here',
		},
		login: {
			header: 'Sign in to platform',
			submit: 'Sign in to your account',
		},
		register: {
			header: 'Create an account',
			submit: 'Create account',
			validation: {
				passwordsDoNotMatch: 'Passwords do not match',
			},
		},
		resetPassword: {
			header: 'Reset your password',
			submit: 'Reset password',
		},
		forgotPassword: {
			header: 'Forgot your password?',
			description:
				"Don't fret! Just type in your email and we will send you a code to reset your password!",
			submit: 'Reset password',
		},
	},
	fileBrowser: {
		file: {
			edit: {
				header: 'Edit file',
				name: 'Name',
				submit: 'Edit',
			},
			action: {
				create: 'Upload file',
				edit: 'Rename file',
				share: 'Share',
				delete: 'Delete',
				download: 'Download',
				confirmDelete: 'Are you sure you want to delete this file?',
			},
			toast: {
				create: {
					success: 'has been uploaded',
					failed: 'Failed to upload file',
				},
				update: {
					success: 'has been updated',
					failed: 'Failed to update',
				},
				delete: {
					success: 'has been deleted',
					failed: 'Failed to delete',
				},
			},
		},
		folder: {
			create: {
				header: 'Create folder',
				name: 'Name',
				color: 'Color',
				submit: 'Create',
			},
			edit: {
				header: 'Edit folder',
				name: 'Name',
				color: 'Color',
				submit: 'Edit',
			},
			action: {
				create: 'Create folder',
				edit: 'Edit folder',
				share: 'Share',
				delete: 'Delete',
				openInNewTab: 'Open in new tab',
				confirmDelete: 'Are you sure you want to delete this folder?',
			},
			color: {
				required: 'Color is required',
				red: 'Red',
				orange: 'Orange',
				amber: 'Amber',
				yellow: 'Yellow',
				lime: 'Lime',
				green: 'Green',
				emerald: 'Emerald',
				teal: 'Teal',
				cyan: 'Cyan',
				sky: 'Sky',
				blue: 'Blue',
				indigo: 'Indigo',
				violet: 'Violet',
				purple: 'Purple',
				fuchsia: 'Fuchsia',
				pink: 'Pink',
				rose: 'Rose',
			},
			toast: {
				create: {
					success: 'has been created',
					failed: 'Failed to create',
				},
				update: {
					success: 'has been updated',
					failed: 'Failed to update',
				},
				delete: {
					success: 'has been deleted',
					failed: 'Failed to delete',
				},
			},
		},
		docs: {
			create: {
				header: 'Create Docs',
				name: 'Name',
				submit: 'Create',
			},
			edit: {
				header: 'Edit Docs',
				name: 'Name',
				submit: 'Edit',
			},
			action: {
				create: 'Create docs',
				edit: 'Rename docs',
				share: 'Share',
				delete: 'Delete',
				openInNewTab: 'Open in new tab',
				confirmDelete: 'Are you sure you want to delete this docs?',
			},
			toast: {
				create: {
					success: 'has been created',
					failed: 'Failed to create',
				},
				update: {
					success: 'has been updated',
					failed: 'Failed to update',
				},
				delete: {
					success: 'has been deleted',
					failed: 'Failed to delete',
				},
			},
		},
		shortcut: {
			link: {
				myfiles: 'My Files',
			},
			action: {
				create: 'Create shortcut',
				edit: 'Rename shortcut',
				share: 'Share',
				delete: 'Delete',
				openInNewTab: 'Open in new tab',
			},
		},
	},
	layout: {
		sr: {
			signOut: 'Sign out',
			openUserMenu: 'Open user menu',
		},
		link: {
			myfiles: 'My Files',
			sharedWithMe: 'Shared with me',
			settings: 'Settings',
			signOut: 'Sign out',
		},
		action: {
			toggleThemeMode: 'Light / dark mode',
		},
	},
	confirmModal: {
		yesImSure: 'Yes, I am sure',
		noCancel: 'No, cancel',
	},
	shareItemModal: {
		share: 'Share',
		peopleWithAccess: 'People with access',
		addPeople: 'Add people',
		owner: 'Owner',
		confirm: 'Confirm',
		toast: {
			create: {
				success: 'Access has been given',
				failed: 'Failed to give access',
			},
			delete: {
				success: 'Access has been removed',
				failed: 'Failed to remove access',
			},
		},
	},
};
