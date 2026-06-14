const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Active noise cancellation, transparency mode, adaptive audio, and personalized spatial audio with dynamic head tracking.',
    price: 249.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
    stock: 50,
    rating: 4.8
  },
  {
    name: 'Samsung 65" QLED 4K TV',
    description: 'Quantum HDR, Neo Quantum Processor 4K, Object Tracking Sound, and smart TV capabilities with Alexa built-in.',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    stock: 15,
    rating: 4.6
  },
  {
    name: 'Nike Air Max 270',
    description: 'Inspired by two icons of big Air: the Air Max 180 and Air Max 93. Features the largest heel Air unit yet.',
    price: 150.00,
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 100,
    rating: 4.5
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for anyone interested in personal finance.',
    price: 14.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    stock: 200,
    rating: 4.9
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer in one appliance.',
    price: 89.95,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    stock: 40,
    rating: 4.7
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'The original straight fit jean. Made with 100% cotton denim for a classic look that never goes out of style.',
    price: 59.50,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400',
    stock: 75,
    rating: 4.4
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancellation with two chips and eight microphones. 30-hour battery life and multipoint connection.',
    price: 349.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 30,
    rating: 4.8
  },
  {
    name: 'Yoga Mat — Non-Slip',
    description: 'Eco-friendly TPE material, 6mm thick for joint support, non-slip surface, alignment lines, and carry strap included.',
    price: 29.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 120,
    rating: 4.3
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by M2 chip. 13.6-inch Liquid Retina display, 18-hour battery, 8GB RAM, 256GB SSD.',
    price: 1099.00,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400',
    stock: 20,
    rating: 4.9
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 3 hand-poured soy wax candles in lavender, vanilla, and eucalyptus. 40-hour burn time each.',
    price: 34.99,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-dce3dfb22e7b?w=400',
    stock: 60,
    rating: 4.6
  },
  {
    name: 'Logitech MX Master 3 Mouse',
    description: 'Advanced wireless mouse with MagSpeed electromagnetic scrolling, 7 customizable buttons, and multi-device connectivity.',
    price: 99.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    stock: 45,
    rating: 4.7
  },
  {
    name: 'Hydro Flask 32 oz Water Bottle',
    description: 'TempShield double-wall vacuum insulation keeps drinks cold 24 hrs and hot 12 hrs. BPA-free stainless steel.',
    price: 49.95,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 90,
    rating: 4.8
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert products
    const inserted = await Product.insertMany(products);
    console.log(`Inserted ${inserted.length} products`);

    // Create admin user
    const adminPass = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@amazon.com',
      password: adminPass,
      role: 'admin'
    });
    console.log(`Admin created: ${admin.email} / admin123`);

    // Create demo customer
    const custPass = await bcrypt.hash('customer123', 10);
    const customer = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: custPass,
      role: 'customer'
    });
    console.log(`Customer created: ${customer.email} / customer123`);

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
