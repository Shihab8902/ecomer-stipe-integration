require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

app.use(cors());
app.use(express.json());


app.post("/checkout", async (req, res) => {
    try {
        const originUrl = req.headers['origin'];
        const productData = req.body;
        const items = productData.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productName,
                    description: `Size: ${item.size}, Color: ${item.color}`,
                    images: [item.image],

                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        //Checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: items,
            mode: 'payment',
            billing_address_collection: 'required',
            shipping_address_collection: {
                allowed_countries: ["US", "AU", "CA"],
            },
            success_url: `${originUrl}/thank-you`,
            cancel_url: `${originUrl}/cancel`,

        });


        res.send(session.url)
    }
    catch (error) {
        res.send(error.message)
    }

})





















app.listen(9000, () => {
    console.log(`The server is running at http://localhost:9000`)
});