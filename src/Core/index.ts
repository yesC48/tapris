import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { Command, Event, Button, Env, Music, Gun } from '../Interfaces'
import * as locales from '../Locales'
import env from './env'

class ExtendedClient extends Client {
	public events: Collection<string, Event> = new Collection()
	public commands: Collection<string, Command> = new Collection()
	public buttons: Collection<string, Button> = new Collection()
	public locales = locales
	public env: Env = env as unknown as Env
	public music: Music = {
		queue: {},
		connection: undefined
	}
	public gun: Gun = {
		drum: []
	}

	public async init() {
		this.login(this.env.TOKEN)

		readdirSync('dist/Commands').forEach(async (dir) => {
			const commands = readdirSync(`dist/Commands/${dir}`).filter((file) =>
				file.endsWith('.js')
			)

			for (const file of commands) {
				const { command } = await import(
					`${__dirname}/../Commands/${dir}/${file}`
				)

				this.commands.set(command.name, command)
			}
		})

		readdirSync('dist/Events')
			.filter((file) => file.endsWith('.js'))
			.forEach(async (file) => {
				const { event } = await import(`../Events/${file}`)
				this.events.set(event.name, event)
				this.on(event.name, event.run.bind(null, this))
			})

		readdirSync('dist/Buttons')
			.filter((file) => file.endsWith('.js'))
			.forEach(async (file) => {
				const { button } = await import(`${__dirname}/../Buttons/${file}`)

				this.buttons.set(button.customId, button)
			})
	}
}

export default ExtendedClient
