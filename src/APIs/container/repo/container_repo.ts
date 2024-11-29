import { error } from "console";

const Stripe = require("stripe");
const stripe = new Stripe("sk_test_51QPhZID0nPeKrajIN2Adi7XnUIHz52kAKBkTO9P2nygfQstOgnSLeMgnKTi85nemDr4j2E07YszwIrLXOgye34ip00vWUaKZpe")

export default {
    payment_stripe : async(body : any) => {
            try{
                const {down_payment} = body
                 // Create a Payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(down_payment * 100), // Stripe accepts amounts in cents
        currency: "usd", // Adjust currency as needed
        // payment_method_types: ["card"],
        automatic_payment_methods: {
          enabled: true, // Enables automatic handling for payment methods
      },
      });
   console.log(paymentIntent)
     if(!paymentIntent){
         throw new Error("Failed to create payment intent")
     }  
       return paymentIntent;
            }
            catch(e){
                 console.log(e);
                 throw error;
            }
    }
}