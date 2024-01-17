import {Navigation} from '../models/navigation';

export const DASHBOARD_NAV: Navigation = {
  name: 'Dashboard',
  options: [
    {
      label: 'Whales',
      route: '/whales',
      icon: 'place'
    },
    {
      label: 'Users',
      route: 'users',
      icon: 'person_outline'
    },
    {
      label: 'Wallets',
      route: 'wallets',
      icon: 'account_balance_wallet'
    },
  ]
}
