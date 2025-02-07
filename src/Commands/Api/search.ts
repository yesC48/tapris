import { Command } from '../../Interfaces'
import { MessageEmbed } from 'discord.js'
import { DuckduckgoResponse } from '../../Interfaces/Duckduckgo'
import axios from 'axios'
import { AxiosResponse } from '../../Interfaces/Axios'

export const command: Command = {
	name: 'search',
	description: 'Get data from internet',
	options: [
		{
			name: 'text',
			description: 'Text to be searched',
			type: 'STRING',
			required: true
		}
	],
	run: async (client, interaction) => {
		const text = interaction.options.getString('text')

		const response: AxiosResponse = await axios.get(
			`https://api.duckduckgo.com/?q=${encodeURI(text)}&format=json`
		)

		const responseData: DuckduckgoResponse = response.data

		if (!responseData.Results[0])
			return interaction.reply({
				content: 'Can`t find results! :no_entry_sign:',
				ephemeral: true
			})

		const Embed = new MessageEmbed()
			.setColor(client.env.BOT_COLOR)
			.setTitle(responseData.Results[0].FirstURL)
			.setURL(responseData.Results[0].FirstURL)

		return interaction.reply({ embeds: [Embed] })
	}
}
