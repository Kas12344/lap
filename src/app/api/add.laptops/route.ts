// app/api/add-laptop/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Adjust if needed

export async function POST(req: Request) {
  const supabase = createClient();

  try {
    const data = await req.json();

    const {
      ProductName,
      Brand,
      RAM,
      Processor,
      Storage,
      GraphicsCard,
      Display,
      Price,
      Condition,
      StockQuantity,
      RawSpecification,
      ProductDescription,
      MainImage,
      MainImageAIHint,
      AdditionalProductImages,
    } = data;

    const { error } = await supabase.from('laptops').insert([
      {
        ProductName,
        Brand,
        RAM,
        Processor,
        Storage,
        GraphicsCard,
        Display,
        Price,
        Condition,
        StockQuantity,
        RawSpecification,
        ProductDescription,
        MainImage,
        MainImageAIHint,
        AdditionalProductImages,
      },
    ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: 'Failed to add laptop' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err: any) {
    console.error('Unexpected Server Error:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

