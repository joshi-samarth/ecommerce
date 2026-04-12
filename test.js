const axios = require('axios');

let cookies = [];
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    if (cookies.length > 0) config.headers.Cookie = cookies.join('; ');
    return config;
});

api.interceptors.response.use(response => {
    const setCookies = response.headers['set-cookie'];
    if (setCookies) {
        setCookies.forEach(cookie => {
            const name = cookie.split('=')[0];
            const idx = cookies.findIndex(c => c.startsWith(name));
            if (idx > -1) cookies[idx] = cookie.split(';')[0];
            else cookies.push(cookie.split(';')[0]);
        });
    }
    return response;
}, error => Promise.reject(error));

const ok = (msg) => console.log('✅ ' + msg);
const err = (msg) => console.log('❌ ' + msg);

async function run() {
    console.log('\n🧪 API TESTING 🧪\n');
    let cart, products;

    try {
        // Register
        let r = await api.post('/auth/register', {
            email: `user${Date.now()}@test.com`,
            password: 'Test@123456',
            name: 'Test User',
        });
        ok('User registered');

        // Get products
        r = await api.get('/products');
        products = r.data.data.slice(0, 3);
        ok(`Fetched ${products.length} products`);

        console.log('\n--- CART TESTS ---\n');

        // Add to cart
        r = await api.post('/cart/add', {
            productId: products[0]._id,
            quantity: 2,
            price: products[0].price,
        });
        cart = r.data.data;
        ok(`Add to cart - Items: ${cart.itemCount}, Subtotal: ₹${cart.subtotal}`);

        // Get cart
        r = await api.get('/cart');
        cart = r.data.data;
        ok(`Get cart - Items: ${cart.itemCount}, Total: ₹${cart.total}`);

        // Update quantity
        const prodId1 = (cart.items[0].product._id || cart.items[0].product).toString();
        r = await api.put(`/cart/update`, { productId: prodId1, quantity: 5 });
        cart = r.data.data;
        ok(`Update quantity to 5 - Subtotal: ₹${cart.subtotal}`);

        console.log('\n--- COUPON TESTS ---\n');

        // Apply WELCOME10
        r = await api.post('/cart/coupon', { code: 'WELCOME10' });
        cart = r.data.data;
        ok(`WELCOME10 applied - Discount: ₹${cart.discount}`);

        // Apply FLAT100
        r = await api.post('/cart/coupon', { code: 'FLAT100' });
        cart = r.data.data;
        ok(`FLAT100 applied - Discount: ₹${cart.discount}`);

        // Apply SAVE20
        r = await api.post('/cart/coupon', { code: 'SAVE20' });
        cart = r.data.data;
        ok(`SAVE20 applied - Discount: ₹${cart.discount}`);

        // Remove coupon
        r = await api.delete('/cart/coupon');
        cart = r.data.data;
        ok(`Coupon removed - Discount: ₹${cart.discount}`);

        console.log('\n--- MORE CART OPERATIONS ---\n');

        // Add second product
        r = await api.post('/cart/add', {
            productId: products[1]._id,
            quantity: 1,
            price: products[1].price,
        });
        cart = r.data.data;
        ok(`Add 2nd product - Items: ${cart.itemCount}`);

        // Remove first item
        const prodId2 = (cart.items[0].product._id || cart.items[0].product).toString();
        r = await api.delete(`/cart/remove/${prodId2}`);
        cart = r.data.data;
        ok(`Remove item - Remaining: ${cart.itemCount}`);

        // Clear cart
        r = await api.delete('/cart/clear');
        cart = r.data.data;
        ok(`Clear cart - Items: ${cart.itemCount}`);

        console.log('\n--- WISHLIST TESTS ---\n');

        // Add to wishlist
        r = await api.post('/wishlist/toggle', { productId: products[0]._id });
        ok(`Add to wishlist - Wishlisted: ${r.data.data.isWishlisted}`);

        // Get wishlist
        r = await api.get('/wishlist');
        ok(`Get wishlist - Items: ${r.data.data.length}`);
        r.data.data.forEach(p => console.log(`   - ${p.name}: ₹${p.price}`));

        // Remove from wishlist
        r = await api.post('/wishlist/toggle', { productId: products[0]._id });
        ok(`Remove from wishlist - Wishlisted: ${r.data.data.isWishlisted}`);

        console.log('\n✨ All tests passed!\n');
    } catch (e) {
        err(`${e.response?.data?.message || e.message}`);
        console.error(e.stack);
    }
}

run();
