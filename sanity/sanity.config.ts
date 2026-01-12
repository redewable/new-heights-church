import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Define the structure for singleton documents
const singletonTypes = ['siteSettings', 'liveControl']

export default defineConfig({
  name: 'new-heights-church',
  title: 'New Heights Church',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singletons
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Live Control')
              .id('liveControl')
              .child(
                S.document()
                  .schemaType('liveControl')
                  .documentId('liveControl')
              ),
            S.divider(),
            // Regular document types
            S.documentTypeListItem('sermon').title('Sermons'),
            S.documentTypeListItem('series').title('Series'),
            S.documentTypeListItem('speaker').title('Speakers'),
            S.divider(),
            S.documentTypeListItem('event').title('Events'),
            S.divider(),
            S.documentTypeListItem('stance').title('Stances'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Prevent singletons from showing in "new document" menu
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.includes(schemaType)),
  },
})
