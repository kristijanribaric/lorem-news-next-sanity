import sanityClient from '@sanity/client'

export default sanityClient({
  projectId: 'fbl5hfqb', 
  dataset: 'production',
  apiVersion: '2022-06-27',
  useCdn: false 
})