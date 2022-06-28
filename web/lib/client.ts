import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'fbl5hfqb', 
  dataset: 'production',
  useCdn: false 
})