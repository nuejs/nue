
import { enrich } from './users.js'

export const data = {

  product: {
    title: 'Apple Mac mini M4',
    desc: 'Unleashes the full speed and capabilities of M4 and M4 Pro chips',
    image: 'img/apple.jpg',
    price: '$799',

    features: {
      Memory: '16GB',
      Storage: '256GB SSD',
      Finish: 'Silver',
    }
  },

  geolocation: {
    position: [37.33487409706578, -122.00902564767274],
    circles: [[37.33487409706578, -122.00902564767274]],
    circle_size: 225,
    zoom: 11,
  },

  users: enrich([
    {
      name: 'Snatg Martin',
      email: 'om@example.com',
      commits: 453,
    },
    {
      name: 'Isabella Nguyen',
      email: 'ib@example.com',
      commits: 256,
    },
    {
      name: 'Sofia Davis',
      email: 'sd@example.com',
      commits: 180
    },
  ])
}