import { Command } from '../../Interfaces'
import { MessageEmbed } from 'discord.js'
import translate from '@iamtraction/google-translate'

export const command: Command = {
	name: 'translate',
	description: 'Translates text',
	options: [
		{
			name: 'language',
			description: 'Target language',
			type: 3,
			required: true
		},
		{
			name: 'text',
			description: 'Text to be translated',
			type: 3,
			required: true
		}
	],
	run: async (client, interaction) => {
		const language = interaction.options.getString('language')
		const text = interaction.options.getString('text')

		try {
			const response = await translate(text, { to: language })

			// Send result
			const Embed = new MessageEmbed()
				.setColor(client.env.BOT_COLOR)
				.setTitle(`Text in ${language}`)
				.setDescription(response.text)
				.addFields([
					{
						name: 'Original language',
						value: response.from.language.iso,
						inline: true
					},
					{
						name: 'Original message',
						value: text,
						inline: true
					}
				])
				.setFooter(
					`${interaction.user.username}#${interaction.user.discriminator}`,
					interaction.user.avatarURL()
				)
				.setTimestamp()

			return interaction.reply({ embeds: [Embed] })
		} catch {
			return interaction.reply({
				content: 'Error, language is not valid :no_entry_sign:',
				ephemeral: true
			})
		}
	}
}
