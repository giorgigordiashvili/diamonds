'use client';

import { cartApi } from '@/api';
import { useApi } from '@/hooks/useApi';
import { CartItem } from '@/types/cart';
import { useRouter } from 'next/navigation';

export default function CartExample() {
  const router = useRouter();

  // Use our custom hook to fetch the cart
  const {
    data: cart,
    loading,
    error,
    execute: fetchCart,
  } = useApi(cartApi.getCart, {
    loadOnMount: true, // Load cart data when component mounts
  });

  // Handle quantity update
  const handleUpdateQuantity = async (diamondId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await cartApi.removeFromCart(diamondId);
      } else {
        await cartApi.updateCartItem(diamondId, quantity);
      }

      // Refresh cart data
      fetchCart();
    } catch (err) {
      console.error('Failed to update cart:', err);
      alert('Failed to update cart');
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (diamondId: string) => {
    try {
      await cartApi.removeFromCart(diamondId);
      fetchCart();
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item from cart');
    }
  };

  // Clear cart
  const handleClearCart = async () => {
    if (confirm('Are you sure you want to empty your cart?')) {
      try {
        await cartApi.clearCart();
        fetchCart();
      } catch (err) {
        console.error('Failed to clear cart:', err);
        alert('Failed to clear cart');
      }
    }
  };

  // Calculate total price
  const calculateTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Proceed to checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading && !cart) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error loading cart: {error.message}</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your Cart is Empty</h2>
        <p>Add some beautiful diamonds to your cart!</p>
        <button onClick={() => router.push('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.diamond.id} className="cart-item">
            <div className="item-image">
              {item.diamond.image && (
                <img
                  src={item.diamond.image}
                  alt={item.diamond.name}
                  style={{ width: 80, height: 80, objectFit: 'cover' }}
                />
              )}
            </div>

            <div className="item-details">
              <h3>{item.diamond.name}</h3>
              <p>
                {item.diamond.carat}ct {item.diamond.color} {item.diamond.clarity}
              </p>
              <p>Shape: {item.diamond.shape}</p>
            </div>

            <div className="item-price">${item.price.toLocaleString()}</div>

            <div className="item-quantity">
              <button
                onClick={() => handleUpdateQuantity(item.diamond.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => handleUpdateQuantity(item.diamond.id, item.quantity + 1)}>
                +
              </button>
            </div>

            <div className="item-subtotal">${(item.price * item.quantity).toLocaleString()}</div>

            <button className="remove-button" onClick={() => handleRemoveItem(item.diamond.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span>${calculateTotal(cart.items).toLocaleString()}</span>
        </div>

        <div className="cart-actions">
          <button className="clear-cart" onClick={handleClearCart}>
            Clear Cart
          </button>
          <button className="continue-shopping" onClick={() => router.push('/')}>
            Continue Shopping
          </button>
          <button className="checkout" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
