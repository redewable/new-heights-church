import { defineType, defineField } from 'sanity'

export const liveControl = defineType({
  name: 'liveControl',
  title: 'Live Control',
  type: 'document',
  fields: [
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (Check YouTube)', value: 'auto' },
          { title: 'Force Live', value: 'force_live' },
          { title: 'Force Off', value: 'force_off' },
        ],
      },
      initialValue: 'auto',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'overrideVideoId',
      title: 'Override YouTube Video ID',
      type: 'string',
      description: 'Used when Mode = Force Live. Enter the YouTube video ID (e.g., dQw4w9WgXcQ)',
    }),
    defineField({
      name: 'showChat',
      title: 'Show Chat Embed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'startingSoonMessage',
      title: 'Starting Soon Message',
      type: 'string',
      initialValue: 'Service starts soon.',
    }),
    defineField({
      name: 'scheduledServices',
      title: 'Scheduled Services (Local Time)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Example: "Sun 09:00", "Sun 11:00", "Wed 19:00"',
    }),
  ],
  preview: {
    select: {
      mode: 'mode',
    },
    prepare({ mode }) {
      return {
        title: 'Live Control',
        subtitle: `Mode: ${mode || 'Not set'}`,
      }
    },
  },
})
