import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getProducts, getProductPrices } from '../lib/productApi';
import { getBrands } from '../lib/brandApi';
import { getCustomers } from '../lib/customerApi';
import { getPayments } from '../lib/paymentApi';
import { createOrder } from '../lib/orderApi';

export default function CreateOrderForm({ onClose, onCreated }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [brands, setBrands] = useState([]);

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '', email: '', phone: '',
    houseNumber: '', area: '', landmark: '',
    city: '', state: '', pincode: '', country: '',
  });

  const [notes, setNotes] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [productLines, setProductLines] = useState([{ productVariantId: '', quantity: 1, raw: null }]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [c, p, pay, b] = await Promise.all([
          getCustomers().catch(() => []),
          getProducts().catch(() => []),
          getPayments().catch(() => []),
          getBrands().catch(() => []),
        ]);
        
        console.log('Products loaded:', p);
        console.log('Sample product:', p[0]);
        
        setCustomers(c);
        setProducts(p);
        setPayments(pay);
        setBrands(b);
        
        // Fetch prices for all products
        const pricesMap = {};
        for (const product of p) {
          try {
            const prices = await getProductPrices(product.id);
            pricesMap[product.id] = Array.isArray(prices) ? prices : [];
          } catch (err) {
            console.error(`Failed to fetch prices for product ${product.id}:`, err);
            pricesMap[product.id] = [];
          }
        }
        
        console.log('Product prices loaded:', pricesMap);
        setProductPrices(pricesMap);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    const customer = customers.find(c =>
      c.id === selectedCustomerId ||
      c.id === parseInt(selectedCustomerId)
    );
    if (customer) {
      const parts = customer.address ? customer.address.split(', ') : [];
      const info = {
        fullName: customer.name || '',
        email: customer.email || '',
        phone: customer.mobile || '',
        houseNumber: parts[0] || '',
        area: parts[1] || '',
        landmark: parts[2] || '',
        city: parts[3] || '',
        state: parts[4] || '',
        pincode: parts[5] || '',
        country: parts[6] || '',
      };
      setCustomerInfo(info);
    } else {
      setCustomerInfo({
        fullName: '', email: '', phone: '',
        houseNumber: '', area: '', landmark: '',
        city: '', state: '', pincode: '', country: '',
      });
    }
  }, [selectedCustomerId, customers]);

  const customerOptions = customers.map(c => ({
    value: c.id,
    label: c.name,
    raw: c,
  }));
  const getTypeSuffix = (medicineType) => {
    switch(medicineType?.toLowerCase()) {
      case 'tablet': return 'tablets';
      case 'capsule': return 'capsules';
      case 'liquid': return 'ml';
      case 'gram': return 'g';
      default: return medicineType || '';
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : '';
  };

  const productOptions = products.flatMap(p => {
    const prices = productPrices[p.id] || [];
    
    if (prices.length > 0) {
      // Create options for each size/price variation
      return prices.map(priceData => {
        const brandName = getBrandName(p.brand_id);
        return {
          value: `${p.id}-${priceData.size}`,
          label: `${p.name} ${p.strength ? `(${p.strength})` : ''} ${brandName ? `- ${brandName}` : ''} - ${priceData.size} ${getTypeSuffix(p.medicine_type)} - ₹${priceData.selling_price || priceData.actual_price || 0}`,
          raw: {
            ...p,
            price: priceData.selling_price || priceData.actual_price || 0,
            size: priceData.size,
            quantity: priceData.quantity,
            priceId: priceData.id,
            productId: p.id,
            brandName: brandName,
          },
        };
      });
    } else {
      // Fallback to main product data if no separate prices
      const brandName = getBrandName(p.brand_id);
      return [{
        value: `${p.id}-default`,
        label: `${p.name} ${p.strength ? `(${p.strength})` : ''} ${brandName ? `- ${brandName}` : ''} - ₹${p.selling_price || p.actual_price || 0}`,
        raw: {
          ...p,
          price: p.selling_price || p.actual_price || 0,
          size: p.total_quantity || p.strength || 'default',
          productId: p.id,
          brandName: brandName,
        },
      }];
    }
  });
  const paymentOptions = payments.map(pay => ({
    value: pay.id,
    label: pay.method,
  }));

  const handleCustomerSelect = opt => {
    setSelectedCustomerId(opt ? opt.value : '');
  };

  const handleProductChange = (idx, field, val) => {
    const updated = [...productLines];
    if (field === 'productVariantId') {
      updated[idx] = {
        productVariantId: val.value,
        quantity: 1,
        raw: val.raw,
      };
    } else {
      updated[idx][field] = parseInt(val) || 0;
    }
    setProductLines(updated);
  };

  const addProductLine = () => {
    setProductLines([...productLines, { productVariantId: '', quantity: 1, raw: null }]);
  };

  const removeProductLine = idx => {
    const updated = [...productLines];
    updated.splice(idx, 1);
    setProductLines(updated);
  };

  const calculateTotalPrice = () => {
    return productLines.reduce((sum, ln) => {
      if (!ln.raw) return sum;
      const price = ln.raw.price || ln.raw.selling_price || ln.raw.actual_price || 0;
      return sum + (price * ln.quantity);
    }, 0);
  };

  const getItemSummary = () => {
    return productLines
      .map(ln => {
        if (!ln.raw) return '';
        const size = ln.raw.size || ln.raw.total_quantity || ln.raw.strength;
        const sizeText = size ? ` (${size})` : '';
        return `${ln.raw.name}${sizeText} x ${ln.quantity}`;
      })
      .filter(Boolean)
      .join(', ');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const address = `${customerInfo.houseNumber}, ${customerInfo.area}, ${customerInfo.landmark}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.pincode}, ${customerInfo.country}`;
    const order = {
      customer_id: selectedCustomerId,
      items: getItemSummary(),
      price: calculateTotalPrice(),
      address,
      payment_id: paymentId,
      notes,
      status: 'Ordered',
      date: new Date().toISOString(),
    };
    try {
      const created = await createOrder(order);
      onCreated(created);
      onClose();
    } catch {
      alert('Failed to create order');
    }
  };

  const handleCustomerInputChange = (field, value) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl max-h-full overflow-auto relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 text-xl">&times;</button>
        <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Customer */}
          <label className="block">
            Customer:
            <Select
              options={customerOptions}
              onChange={handleCustomerSelect}
              isClearable
              placeholder="Search or select customer..."
              className="mt-1"
            />
          </label>

          {/* Customer Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Full Name" value={customerInfo.fullName} onChange={e => handleCustomerInputChange('fullName', e.target.value)} className="border px-3 py-2 rounded" />
            <input required type="email" placeholder="Email" value={customerInfo.email} onChange={e => handleCustomerInputChange('email', e.target.value)} className="border px-3 py-2 rounded" />
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-100 text-gray-600">+91</span>
              <input required placeholder="Phone Number" value={customerInfo.phone} onChange={e => handleCustomerInputChange('phone', e.target.value)} className="border px-3 py-2 w-full rounded" />
            </div>
            <input required placeholder="House Number" value={customerInfo.houseNumber} onChange={e => handleCustomerInputChange('houseNumber', e.target.value)} className="border px-3 py-2 rounded" />
            <input required placeholder="Area" value={customerInfo.area} onChange={e => handleCustomerInputChange('area', e.target.value)} className="border px-3 py-2 rounded" />
            <input placeholder="Landmark" value={customerInfo.landmark} onChange={e => handleCustomerInputChange('landmark', e.target.value)} className="border px-3 py-2 rounded" />
            <input required placeholder="City" value={customerInfo.city} onChange={e => handleCustomerInputChange('city', e.target.value)} className="border px-3 py-2 rounded" />
            <input required placeholder="State" value={customerInfo.state} onChange={e => handleCustomerInputChange('state', e.target.value)} className="border px-3 py-2 rounded" />
            <input required placeholder="Pincode" value={customerInfo.pincode} onChange={e => handleCustomerInputChange('pincode', e.target.value)} className="border px-3 py-2 rounded" />
            <input required placeholder="Country" value={customerInfo.country} onChange={e => handleCustomerInputChange('country', e.target.value)} className="border px-3 py-2 rounded" />
          </div>

          {/* Product Lines */}
          <div>
            <label className="block font-semibold mb-2">Products:</label>
            {productLines.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-start mb-2">
                <div className="flex-1">
                  <Select
                    options={productOptions}
                    onChange={opt => handleProductChange(idx, 'productVariantId', opt)}
                    value={productOptions.find(o => o.value === line.productVariantId) || null}
                    isClearable
                    placeholder="Search or select product and size..."
                  />
                  {line.raw && (
                    <div className="text-xs text-gray-600 mt-1">
                      <div>Product: {line.raw.name}</div>
                      <div>Size: {line.raw.size} {getTypeSuffix(line.raw.medicine_type)}</div>
                      <div>Price: ₹{line.raw.price}</div>
                      <div>Type: {line.raw.medicine_type || '—'}</div>
                    </div>
                  )}
                </div>
                <input required type="number" min="1" value={line.quantity} onChange={e => handleProductChange(idx, 'quantity', e.target.value)} className="border w-20 px-2 py-1 rounded mt-1" />
                <button type="button" onClick={() => removeProductLine(idx)} disabled={productLines.length === 1} className="text-red-600 hover:underline self-start">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addProductLine} className="text-blue-600 hover:underline text-sm">+ Add another product</button>
          </div>

          {/* Payment */}
          <label className="block">
            Payment Method:
            <Select
              options={paymentOptions}
              onChange={opt => setPaymentId(opt?.value || '')}
              value={paymentOptions.find(o => o.value === paymentId) || null}
              isClearable
              placeholder="Select payment method..."
              className="mt‑1"
            />
          </label>

          {/* Notes */}
          <label className="block">
            Notes:
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="border w-full px-3 py-2 rounded mt-1" />
          </label>

          {/* Total */}
          <div className="text-right font-semibold text-lg">
            Total: ₹{calculateTotalPrice().toFixed(2)}
          </div>

          {/* Submit */}
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
}
