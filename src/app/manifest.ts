import { MetadataRoute } from 'next';
 
export default function manifest(): MetadataRoute.Manifest {
   return {
      name: 'Chatty',
      short_name: 'Chatty',
      description: 'Chat with whoever you want is fast, secure and fun with chatty',
      start_url: '/',
      display: 'standalone',
      icons: [
         {
         src: '/favicon.ico',
         sizes: 'any',
         type: 'image/x-icon',
         },
      ],
   }
}