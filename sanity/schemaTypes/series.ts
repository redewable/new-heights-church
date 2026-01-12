import { defineType, defineField } from 'sanity'

export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'trailerVideoId',
      title: 'Trailer Video ID',
      type: 'string',
      description: 'Optional YouTube video ID for series trailer',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
      media: 'heroImage',
    },
    prepare({ title, startDate, media }) {
      return {
        title,
        subtitle: startDate || 'No start date',
        media,
      }
    },
  },
})
