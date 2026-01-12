import { defineType, defineField } from 'sanity'

export const stance = defineType({
  name: 'stance',
  title: 'Stance',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
      description: 'e.g., "Marriage", "Sanctity of Life", "The Bible"',
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
      description: 'A brief, one-paragraph summary of the stance',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Doctrine', value: 'doctrine' },
          { title: 'Ethics', value: 'ethics' },
          { title: 'Social Issues', value: 'social' },
          { title: 'Worship & Practice', value: 'practice' },
        ],
      },
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
      ],
    }),
    defineField({
      name: 'scriptureRefs',
      title: 'Scripture References',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., "Genesis 2:24", "Matthew 19:4-6"',
    }),
    defineField({
      name: 'practicalApplication',
      title: 'How We Practice This',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
        },
      ],
      description: 'Practical, ministry-facing explanation of how this stance is lived out',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare({ title, category }) {
      return {
        title,
        subtitle: category || 'No category',
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
