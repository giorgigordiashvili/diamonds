'use client';

import * as cartApi from '@/api/cart'; // Your cart API functions
import { CartItem } from '@/types/cart'; // Assuming CartItem is defined in your types
import { Diamond } from '@/types/diamond';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null; // Return null if not on client-side
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Diamond) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartTotal: () => number;
  clearCart: (isLogout?: boolean) => Promise<void>;
  loadCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Initialize isUserLoggedIn to false, update in useEffect for client-side check
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Client-side check for auth token to set initial login state
    setIsUserLoggedIn(!!getAuthToken());
  }, []);

  const syncCart = useCallback(async () => {
    setIsLoading(true);
    const token = getAuthToken();
    // Update isUserLoggedIn based on current token status (client-side)
    if (typeof window !== 'undefined') {
      setIsUserLoggedIn(!!token);
    }

    try {
      if (token) {
        console.log('User is logged in, fetching cart from API');
        const apiCart = await cartApi.getCart();
        // Ensure all items have a top-level price property
        const normalizedItems = (apiCart.items || []).map((item) => ({
          ...item,
          price: item.price !== undefined ? item.price : item?.diamond?.price || 0, // Use item.price if available, else item.diamond.price, default to 0
        }));
        setCartItems(normalizedItems as CartItem[]);
      } else {
        // Guest cart logic, ensure localStorage is accessed only on client
        if (typeof window !== 'undefined') {
          const storedCartItems = localStorage.getItem('guestCart');
          if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
          } else {
            setCartItems([]);
          }
        } else {
          setCartItems([]); // Default to empty cart on server
        }
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
      if (!token && typeof window !== 'undefined') {
        // Guard localStorage access
        localStorage.removeItem('guestCart');
      }
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncCart();
    const handleAuthChange = () => {
      syncCart();
    };
    // window.addEventListener is client-side only
    if (typeof window !== 'undefined') {
      window.addEventListener('authChanged', handleAuthChange);
      return () => window.removeEventListener('authChanged', handleAuthChange);
    }
  }, [syncCart]);

  useEffect(() => {
    // localStorage.setItem is client-side
    if (typeof window !== 'undefined' && !isUserLoggedIn) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isUserLoggedIn]);

  const loadCart = useCallback(async () => {
    await syncCart();
  }, [syncCart]);

  const addToCart = async (item: Diamond) => {
    setIsLoading(true);
    const token = getAuthToken();
    try {
      if (token) {
        const updatedCart = await cartApi.addToCart(item.id, 1);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart logic, state update is fine, localStorage is handled by useEffect
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((cartItem) => cartItem.diamondId === item.id);
          if (existingItem) {
            return prevItems.map((cartItem) =>
              cartItem.diamondId === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          }
          return [
            ...prevItems,
            { diamondId: item.id, quantity: 1, price: item.price, diamond: item },
          ];
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setIsLoading(true);
    const token = getAuthToken();
    try {
      if (token) {
        const updatedCart = await cartApi.removeFromCart(itemId);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart logic, state update is fine, localStorage is handled by useEffect
        setCartItems((prevItems) => prevItems.filter((item) => item.diamondId !== itemId));
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    const token = getAuthToken();
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      if (token) {
        const updatedCart = await cartApi.updateCartItem(itemId, quantity);
        setCartItems(updatedCart.items || []);
      } else {
        // Guest cart logic, state update is fine, localStorage is handled by useEffect
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.diamondId === itemId ? { ...item, quantity } : item))
        );
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async (isLogout: boolean = false) => {
    setIsLoading(true);
    const token = getAuthToken();
    try {
      if (token && !isLogout) {
        await cartApi.clearCart();
        setCartItems([]);
      } else {
        setCartItems([]);
        if (typeof window !== 'undefined') {
          // Guard localStorage access
          localStorage.removeItem('guestCart');
        }
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price);
      if (isNaN(price)) {
        console.warn('Invalid price for item:', item);
        return total;
      }
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartCount,
        getCartTotal,
        clearCart,
        loadCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const onLoginSuccess = async (cartContext: CartContextType | null) => {
  if (cartContext && 'loadCart' in cartContext) {
    // getAuthToken already has client-side check
    const token = getAuthToken();
    if (token && typeof window !== 'undefined') {
      // Guard localStorage access
      const guestCartItemsRaw = localStorage.getItem('guestCart');
      if (guestCartItemsRaw) {
        const guestItems = JSON.parse(guestCartItemsRaw) as CartItem[];
        if (guestItems.length > 0) {
          try {
            await cartApi.mergeCart();
            localStorage.removeItem('guestCart');
          } catch (error) {
            console.error('Failed to merge cart:', error);
          }
        }
      }
    }
    await cartContext.loadCart();
    if (typeof window !== 'undefined') {
      // Guard window access
      window.dispatchEvent(new CustomEvent('authChanged'));
    }
  }
};
