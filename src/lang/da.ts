export default {
	auth: {
		field: {
			name: 'Dit navn',
			namePlaceholder: 'Peter Jensen',
			email: 'Din e-mail',
			emailPlaceholder: 'navn@firma.dk',
			password: 'Din adgangskode',
			passwordPlaceholder: '••••••••',
			passwordConfirm: 'Bekræft adgangskode',
			passwordConfirmPlaceholder: '••••••••',
			passwordNew: 'Ny adgangskode',
			passwordNewPlaceholder: '••••••••',
			passwordNewConfirm: 'Bekræft ny adgangskode',
			passwordNewConfirmPlaceholder: '••••••••',
		},
		link: {
			forgotPassword: 'Glemt dit kodeord?',
			notRegistered: 'Ikke registeret?',
			createAccount: 'Opret konto',
			alreadyRegistered: 'Allerede registeret?',
			loginHere: 'Log ind',
		},
		login: {
			header: 'Log ind på platformen',
			submit: 'Log ind på din konto',
		},
		register: {
			header: 'Opret en konto',
			submit: 'Opret konto',
			validation: {
				passwordsDoNotMatch: 'Adgangskoderne er ikke ens',
			},
		},
		resetPassword: {
			header: 'Nulstil din adgangskode',
			submit: 'Nulstil adgangskode',
		},
		forgotPassword: {
			header: 'Glemt din adgangskode?',
			description:
				'Fortvivl ikke! Indtast blot din e-mail, og vi sender dig en kode til at nulstille din adgangskode!',
			submit: 'Nulstil adgangskode',
		},
	},
	fileBrowser: {
		file: {
			edit: {
				header: 'Rediger fil',
				name: 'Navn',
				submit: 'Rediger',
			},
			action: {
				create: 'Upload fil',
				edit: 'Omdøb fil',
				share: 'Del',
				delete: 'Slet',
				download: 'Download',
				confirmDelete: 'Er du sikker på, at du vil slette denne fil?',
			},
			toast: {
				create: {
					success: 'er blevet uploaded',
					failed: 'Fejl i upload af',
				},
				update: {
					success: 'er blevet opdateret',
					failed: 'Fejl under opdatering af',
				},
				delete: {
					success: 'er blevet slettet',
					failed: 'Fejl i sletning af',
				},
			},
		},
		folder: {
			create: {
				header: 'Opret mappe',
				name: 'Navn',
				color: 'Farve',
				submit: 'Opret',
			},
			edit: {
				header: 'Omdøb mappe',
				name: 'Navn',
				color: 'Farve',
				submit: 'Omdøb',
			},
			action: {
				create: 'Opret mappe',
				edit: 'Omdøb mappe',
				share: 'Del',
				delete: 'Slet',
				openInNewTab: 'Åben i nyt faneblad',
				confirmDelete: 'Er du sikker på, at du vil slette denne mappe?',
			},
			color: {
				required: 'Farve er påkrævet',
				red: 'Rød',
				orange: 'Orange',
				amber: 'Rav',
				yellow: 'Gul',
				lime: 'Lime',
				green: 'Grøn',
				emerald: 'Smaragd',
				teal: 'Blågrøn',
				cyan: 'Cyan',
				sky: 'Himmelblå',
				blue: 'Blå',
				indigo: 'Indigo',
				violet: 'Violet',
				purple: 'Lilla',
				fuchsia: 'Fuchsia',
				pink: 'Pink',
				rose: 'Rose',
			},
			toast: {
				create: {
					success: 'er blevet oprettet',
					failed: 'Fejl i opretning af',
				},
				update: {
					success: 'er blevet opdateret',
					failed: 'Fejl under opdatering af',
				},
				delete: {
					success: 'er blevet slettet',
					failed: 'Fejl i sletning af',
				},
			},
		},
		docs: {
			create: {
				header: 'Opret Docs',
				name: 'Navn',
				submit: 'Opret',
			},
			edit: {
				header: 'Omdøb Docs',
				name: 'Navn',
				submit: 'Omdøb',
			},
			action: {
				create: 'Opret Docs',
				edit: 'Omdøb Docs',
				share: 'Del',
				delete: 'Slet',
				openInNewTab: 'Åben i nyt faneblad',
				confirmDelete: 'Er du sikker på, at du vil slette denne Docs?',
			},
			toast: {
				create: {
					success: 'er blevet oprettet',
					failed: 'Fejl i opretning af',
				},
				update: {
					success: 'er blevet opdateret',
					failed: 'Fejl under opdatering af',
				},
				delete: {
					success: 'er blevet slettet',
					failed: 'Fejl i sletning af',
				},
			},
		},
		shortcut: {
			link: {
				myfiles: 'Mine Filer',
			},
			action: {
				create: 'Opret genvej',
				edit: 'Omdøb genvej',
				share: 'Del',
				delete: 'Slet',
				openInNewTab: 'Åben i nyt faneblad',
				createIn: 'Opret i',
				empty: 'Tom',
			},
			toast: {
				create: {
					success: 'er blevet oprettet (Genvej)',
					failed: 'Fejl i opretning af',
				},
				update: {
					success: 'er blevet opdateret',
					failed: 'Fejl under opdatering af',
				},
				delete: {
					success: 'er blevet slettet',
					failed: 'Fejl i sletning af',
				},
			},
		},
	},
	layout: {
		sr: {
			signOut: 'Log ud',
			openUserMenu: 'Åben brugermenu',
		},
		link: {
			myFiles: 'Mine Filer',
			sharedWithMe: 'Delt med mig',
			settings: 'Indstillinger',
			signOut: 'Log ud',
		},
		action: {
			toggleThemeMode: 'Lys / mørk tilstand',
		},
	},
	confirmModal: {
		yesImSure: 'Ja, jeg er sikker',
		noCancel: 'Nej, annuller',
	},
	shareItemModal: {
		share: 'Del',
		peopleWithAccess: 'Personer med adgang',
		addPeople: 'Tilføj personer',
		owner: 'Ejer',
		confirm: 'Bekræft',
		toast: {
			create: {
				success: 'Adgang er blevet givet',
				failed: 'Fejlede i at give adgang',
			},
			delete: {
				success: 'Adgangen er blevet fjernet',
				failed: 'Fejlede i at fjerne adgangen',
			},
		},
	},
	noFiles: {
		clickToUpload: 'Klik for at uploade',
		orDragAndDrop: 'eller træk og slip filer her',
		fileRequirements: 'Filer må maks. have en størrelse på 500 MB',
	},
	noSharedItems: {
		description: 'Ingen filer er blevet delt med dig endnu...',
	},
};
