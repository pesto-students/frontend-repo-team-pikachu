// import type { IUserAccountBillingHistory } from 'src/types/user';
// import type { IPaymentCard, IAddressItem } from 'src/types/common';

// import Grid from '@mui/material/Unstable_Grid2';

// import { AccountBillingPlan } from './user-billing-plan';
// import { AccountBillingPayment } from './user-billing-payment';
// import { AccountBillingHistory } from './user-billing-history';
// import { AccountBillingAddress } from './user-billing-address';

// // ----------------------------------------------------------------------

// type Props = {
//   plans: {
//     subscription: string;
//     price: number;
//     primary: boolean;
//   }[];
//   cards: IPaymentCard[];
//   addressBook: IAddressItem[];
//   invoices: IUserAccountBillingHistory[];
// };

// export function AccountBilling({ cards, plans, invoices, addressBook }: Props) {
//   return (
//     <Grid container spacing={5} disableEqualOverflow>
//       <Grid xs={12} md={8}>
//         <AccountBillingPlan plans={plans} cardList={cards} addressBook={addressBook} />

//         <AccountBillingPayment cards={cards} />

//         <AccountBillingAddress addressBook={addressBook} />
//       </Grid>

//       <Grid xs={12} md={4}>
//         <AccountBillingHistory invoices={invoices} />
//       </Grid>
//     </Grid>
//   );
// }
