import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import ErrorMessage from '../components/ErrorMessage';
import OrderStyles from '../components/styles/OrderStyles';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import Link from 'next/link';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function pluralizeWord(word, quantity) {
  return quantity === 1 ? word : `${word}s`;
}

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDERS_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error}></ErrorMessage>;

  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map(order => {
          const itemsInAnOrder = countItemsInAnOrder(order);
          const productQuantity = order.items.length;

          return (
            <OrderItemStyles key={order.id}>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className='order-meta'>
                    <p>
                      {itemsInAnOrder}
                      {' '}
                      {pluralizeWord('Item', itemsInAnOrder)}
                    </p>
                    <p>
                      {productQuantity}
                      {' '}
                      {pluralizeWord('Product', productQuantity)}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map(item =>
                      <img
                        key={item.id}
                        src={item.photo?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    )}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </div>

  );
}