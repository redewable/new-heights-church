import { liveControl } from './liveControl'
import { sermon } from './sermon'
import { series } from './series'
import { speaker } from './speaker'
import { event } from './event'
import { stance } from './stance'
import { siteSettings } from './siteSettings'

export const schemaTypes = [
  // Singletons
  siteSettings,
  liveControl,
  
  // Documents
  sermon,
  series,
  speaker,
  event,
  stance,
]
