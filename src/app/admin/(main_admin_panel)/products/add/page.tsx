
import ProductForm from '@/components/admin/ProductForm';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

'use client';

import { useState } from 'react';

export default function AddLaptopForm() {
  const [form, setForm] = useState({
    ProductName: '',
    Brand: '',
    RAM: '',
    Processor: '',
    Storage: '',
    GraphicsCard: '',
    Display: '',
    Price: '',
    Condition: '',
    StockQuantity: '',
    RawSpecification: '',
    ProductDescription: '',
    MainImage: '',
    MainImageAIHint: '',
    AdditionalProductImages: '',
    IsNewArrival: false,
    IsFeaturedProduct: false,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert comma-separated images string into array
    const payload = {
      ...form,
      Price: Number(form.Price),
      StockQuantity: Number(form.StockQuantity),
      AdditionalProductImages: form.AdditionalProductImages
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url !== ''),
    };

    const res = await fetch('/api/add-laptop', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      setMessage('✅ Laptop added successfully!');
      setForm({
        ProductName: '',
        Brand: '',
        RAM: '',
        Processor: '',
        Storage: '',
        GraphicsCard: '',
        Display: '',
        Price: '',
        Condition: '',
        StockQuantity: '',
        RawSpecification: '',
        ProductDescription: '',
        MainImage: '',
        MainImageAIHint: '',
        AdditionalProductImages: '',
        IsNewArrival: false,
        IsFeaturedProduct: false,
      });
    } else {
      setMessage('❌ Failed to add laptop.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Laptop</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          'ProductName',
          'Brand',
          'RAM',
          'Processor',
          'Storage',
          'GraphicsCard',
          'Display',
          'Price',
          'Condition',
          'StockQuantity',
          'RawSpecification',
          'ProductDescription',
          'MainImage',
          'MainImageAIHint',
          'AdditionalProductImages',
        ].map((field) => (
          <div key={field}>
            <label className="block font-medium">{field}</label>
            {field === 'RawSpecification' || field === 'ProductDescription' ? (
              <textarea
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <input
                type="text"
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            )}
            {field === 'AdditionalProductImages' && (
              <p className="text-sm text-gray-500">Separate multiple URLs with commas</p>
            )}
          </div>
        ))}

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="IsNewArrival"
              checked={form.IsNewArrival}
              onChange={handleChange}
              className="mr-2"
            />
            New Arrival
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="IsFeaturedProduct"
              checked={form.IsFeaturedProduct}
              onChange={handleChange}
              className="mr-2"
            />
            Featured Product
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {message && <p className="mt-3 font-medium">{message}</p>}
      </form>
    </div>
  );
}
