
import { enrich } from './users.js'

export const data = {

  product: {
    title: 'Bauhaus. Updated Edition',
    desc: 'The largest study on the history of the Bauhaus and its impact on modern design',
    image: 'img/bauhaus.webp',
    price: '$25.00',

    features: {
      'Binding': 'Paperback',
      'Date of issue': 2025,
      'Number of pages': 500,
    }
  },

  geolocation: {
    position: [52.4950942236103, 13.29032363473771],
    circles: [[52.4950942236103, 13.29032363473771]],
    circle_size: 500,
    design: 'minimal',
    zoom: 11,
  },

  users: enrich([
    {
      name: 'Olivia Martin',
      email: 'om@example.com',
      avatar: 'avatar-1.svg',
      commits: 281,
    },
    {
      name: 'Isabella Nguyen',
      email: 'ib@example.com',
      avatar: 'avatar-2.svg',
      commits: 155,
    },
    {
      name: 'Sofia Davis',
      email: 'sd@example.com',
      avatar: 'avatar-3.svg',
      commits: 125,
    },
    {
      name: 'Amanda Hawk',
      email: 'ah@example.com',
      avatar: 'avatar-4.svg',
      commits: 80,
    }

  ])

}