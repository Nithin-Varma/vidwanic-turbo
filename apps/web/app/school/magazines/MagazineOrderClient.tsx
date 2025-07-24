"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CheckCircle,
  Package,
  Calendar,
  Users,
  IndianRupee
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  shortDesc: string | null;
  coverImage: string | null;
  price: number;
  suitableFor: string | null;
  totalPurchases: number;
  schoolPurchases: number;
  createdAt: string;
}

interface SchoolProfile {
  id: string;
  schoolName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contactPhone: string;
  contactEmail: string;
}

interface CartItem {
  magazineId: string;
  quantity: number;
  unitPrice: number;
}

interface MagazineOrderClientProps {
  schoolProfile: SchoolProfile;
  magazines: Magazine[];
  session: Session;
}

const MagazineOrderClient = ({ schoolProfile, magazines, session }: MagazineOrderClientProps) => {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const addToCart = (magazine: Magazine) => {
    setCart(prev => ({
      ...prev,
      [magazine.id]: {
        magazineId: magazine.id,
        quantity: (prev[magazine.id]?.quantity || 0) + 1,
        unitPrice: magazine.price
      }
    }));
  };

  const removeFromCart = (magazineId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[magazineId]) {
        if (newCart[magazineId].quantity > 1) {
          newCart[magazineId].quantity -= 1;
        } else {
          delete newCart[magazineId];
        }
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/school/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: Object.values(cart),
          deliveryAddress: `${schoolProfile.address}, ${schoolProfile.city}, ${schoolProfile.state} - ${schoolProfile.pincode}`,
          deliveryContact: schoolProfile.contactPhone,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOrderDetails(data.order);
        setOrderSuccess(true);
        setCart({});
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-vidwanic-background">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                VIDWANIC
              </Link>
              <div className="text-sm text-gray-600">
                Order Placed Successfully
              </div>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Order Placed Successfully! 🎉
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your order! Our team will reach out to you within 24 hours to confirm delivery details and payment arrangements.
              </p>

              {/* Order Details */}
              {orderDetails && (
                <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left max-w-2xl mx-auto">
                  <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-mono">{orderDetails.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold">₹{orderDetails.totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">
                        {orderDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/school/dashboard">
                  <Button className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full">
                    Back to Dashboard
                  </Button>
                </Link>
                <Link href="/school/magazines">
                  <Button 
                    variant="outline"
                    className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white font-semibold px-8 py-3 rounded-full"
                  >
                    Order More Magazines
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/school/dashboard" className="text-vidwanic-orange hover:text-vidwanic-orange-hover mr-4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <Link href="/" className="text-2xl font-bold text-vidwanic-orange">
                  VIDWANIC
                </Link>
                <span className="ml-4 text-sm text-gray-500">Magazine Ordering</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Cart Summary */}
              {getCartItemCount() > 0 && (
                <div className="flex items-center bg-vidwanic-orange text-white px-4 py-2 rounded-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {getCartItemCount()} items • ₹{getCartTotal()}
                  </span>
                </div>
              )}
              
              <span className="text-sm text-gray-600">
                {schoolProfile.schoolName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Magazines</h1>
          <p className="text-gray-600">
            Browse and order magazines for {schoolProfile.schoolName}
          </p>
        </div>

        {/* Magazine Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {magazines.map((magazine) => (
            <div
              key={magazine.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Magazine Cover */}
              <div className="relative h-64 bg-gradient-to-br from-vidwanic-orange to-vidwanic-orange-hover">
                {magazine.coverImage ? (
                  <Image
                    src={magazine.coverImage}
                    alt={magazine.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <Package className="w-12 h-12 mx-auto mb-2 opacity-80" />
                      <p className="text-sm opacity-90">No Cover</p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-white text-xs font-medium flex items-center">
                    <IndianRupee className="w-3 h-3 mr-1" />
                    {magazine.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {magazine.title}
                </h3>
                
                {magazine.shortDesc && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {magazine.shortDesc}
                  </p>
                )}

                {magazine.suitableFor && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-vidwanic-orange/10 text-vidwanic-orange text-xs font-medium">
                      <Users className="w-3 h-3 mr-1" />
                      {magazine.suitableFor}
                    </span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{magazine.schoolPurchases} schools</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{magazine.totalPurchases} total</span>
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="flex items-center justify-between">
                  {cart[magazine.id] ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(magazine.id)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                        {cart[magazine.id].quantity}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => addToCart(magazine)}
                        className="w-8 h-8 p-0 bg-vidwanic-orange hover:bg-vidwanic-orange-hover"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => addToCart(magazine)}
                      className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white text-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  )}
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{magazine.price}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {magazines.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Magazines Available</h2>
            <p className="text-gray-600 mb-4">There are currently no magazines available for ordering.</p>
            <Link href="/school/dashboard">
              <Button variant="outline" className="border-vidwanic-orange text-vidwanic-orange hover:bg-vidwanic-orange hover:text-white">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        )}

        {/* Checkout Section */}
        {getCartItemCount() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-900">
                  Total: ₹{getCartTotal()}
                </div>
                <div className="text-sm text-gray-600">
                  {getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'}
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="bg-vidwanic-orange hover:bg-vidwanic-orange-hover text-white font-semibold px-8 py-3 rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Checkout
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagazineOrderClient;