import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // We'll store data (state) and functionality (updaters) in here and anyone can access it via the consumer
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCar() {
    setCartOpen(!cartOpen);
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCar, openCart, closeCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// Make a custom hook for accessing the cart local state
function useCart() {
  // We use a consumer here to access the local state
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
