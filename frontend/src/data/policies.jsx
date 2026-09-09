import React from 'react'

// Shared policy copy for the checkout footer pop-ups. Kept short and in sync
// with the full pages under /return-policy, /shipping-policy, /privacy-policy
// and /terms. The "contact" entry is built at render time from live site
// settings, so it lives in CheckoutPage rather than here.

export const POLICIES = {
  refund: {
    title: 'Return & Refund Policy',
    body: (
      <>
        <p>
          At Durrani Harvest, your satisfaction is our priority. If you need to return a product,
          please review the policy below.
        </p>

        <h4>Return Eligibility</h4>
        <ul>
          <li><strong>Timeframe:</strong> Returns must be requested within 24 hours of delivery.</li>
          <li>
            <strong>Condition:</strong> Products must be unopened, unused, and in their original
            packaging. Opened or used products are not eligible.
          </li>
          <li><strong>Receipt:</strong> A valid proof of purchase (order confirmation) is required.</li>
        </ul>

        <h4>Non-Returnable Items</h4>
        <ul>
          <li>Opened or used products.</li>
          <li>Products bought on sale or with a promotional discount.</li>
          <li>Custom or personalized products.</li>
          <li>Perishable items with a limited shelf life.</li>
        </ul>

        <h4>Return Process</h4>
        <ul>
          <li>
            <strong>Step 1:</strong> Email <strong>support@durraniharvest.com</strong> or WhatsApp{' '}
            <strong>+92 333 9300672</strong> with your order number and the reason for the return.
          </li>
          <li>
            <strong>Step 2:</strong> If approved, you will receive return instructions. Return
            shipping costs are the customer's responsibility.
          </li>
          <li><strong>Step 3:</strong> The returned product is inspected against our eligibility criteria.</li>
          <li>
            <strong>Step 4:</strong> If approved, a refund is issued to your original payment method
            within 7–10 business days. Shipping costs are non-refundable.
          </li>
        </ul>

        <h4>Damaged or Defective Products</h4>
        <p>
          Contact us immediately at <strong>support@durraniharvest.com</strong> or{' '}
          <strong>+92 333 9300672</strong> with photos of the damaged item. We will arrange a
          replacement or refund as quickly as possible.
        </p>

        <h4>Refunds</h4>
        <ul>
          <li>Refunds go back to the original payment method used for the purchase.</li>
          <li>
            Shipping costs are non-refundable unless the return is due to our error (wrong or
            defective item sent).
          </li>
          <li>Please allow up to 14 business days for the refund to appear in your account.</li>
        </ul>
      </>
    ),
  },

  shipping: {
    title: 'Shipping Policy',
    body: (
      <>
        <p>
          Durrani Harvest aims to deliver your order safely, quickly, and efficiently across
          Pakistan.
        </p>

        <h4>Order Processing</h4>
        <ul>
          <li>Orders are processed within 1–2 business days after payment confirmation.</li>
          <li>Orders placed on weekends or public holidays are processed the next business day.</li>
        </ul>

        <h4>Shipping Time</h4>
        <ul>
          <li>Standard delivery within Pakistan takes 2–4 business days, depending on your city and courier.</li>
          <li>Remote areas may require additional delivery time.</li>
        </ul>

        <h4>Shipping Charges</h4>
        <ul>
          <li>Charges are calculated at checkout based on your location and order weight.</li>
          <li>Free shipping may be offered on selected promotions or minimum order amounts.</li>
        </ul>

        <h4>Order Tracking</h4>
        <p>Once dispatched, you receive a tracking number via SMS or WhatsApp.</p>

        <h4>Delays</h4>
        <p>
          Delays may occur due to weather, courier service issues, or high-volume seasons (Ramadan,
          Eid). We appreciate your patience.
        </p>

        <h4>Incorrect Address</h4>
        <p>
          Please ensure your shipping details are accurate. Durrani Harvest is not responsible for
          delays or failed deliveries caused by an incorrect or incomplete address.
        </p>

        <h4>Damaged Packages</h4>
        <p>
          If your package arrives damaged, contact us within 24 hours with pictures/video at{' '}
          <strong>support@durraniharvest.com</strong> or <strong>+92 333 9300672</strong>.
        </p>
      </>
    ),
  },

  privacy: {
    title: 'Privacy & Data Security Policy',
    body: (
      <>
        <h4>Information We Collect</h4>
        <p>
          When you place an order we collect your name, phone number, delivery address, and email
          address, solely to dispatch your products and send tracking updates.
        </p>

        <h4>How Your Information Is Used</h4>
        <ul>
          <li><strong>Order fulfillment:</strong> coordinating dispatch with courier partners.</li>
          <li><strong>Customer care:</strong> order confirmations and tracking via SMS or WhatsApp.</li>
          <li><strong>Offers:</strong> if you opt in, occasional discounts on seasonal harvests.</li>
        </ul>

        <h4>Zero Third-Party Sharing</h4>
        <p>
          Your personal data is never sold, traded, rented, or shared with unauthorized external
          marketing entities.
        </p>

        <h4>Data Deletion &amp; Inquiries</h4>
        <p>
          You may request deletion of your account or contact data at any time by emailing{' '}
          <strong>support@durraniharvest.com</strong> or calling <strong>+92 333 9300672</strong>.
        </p>
      </>
    ),
  },

  terms: {
    title: 'Terms & Conditions of Service',
    body: (
      <>
        <h4>Authentic Natural Products</h4>
        <p>
          All products are 100% genuine and ethically sourced. As our honey, dates, and shilajit are
          natural and unstabilized, slight seasonal variation in flavor, texture, colour, and aroma
          may occur between harvests.
        </p>

        <h4>Order Verification &amp; Dispatch</h4>
        <p>
          Orders are processed from Peshawar within 24 hours. For Cash on Delivery orders, our team
          may confirm your address by call or WhatsApp (<strong>+92 333 9300672</strong>) before
          dispatch.
        </p>

        <h4>Pricing &amp; Availability</h4>
        <p>
          All prices are in Pakistani Rupees (PKR). Durrani Harvest may adjust product availability
          based on seasonal harvest yields.
        </p>

        <h4>Contact &amp; Support</h4>
        <ul>
          <li><strong>Headquarters:</strong> Hayatabad, Peshawar, KP, Pakistan</li>
          <li><strong>Email:</strong> support@durraniharvest.com</li>
          <li><strong>Phone / WhatsApp:</strong> +92 333 9300672</li>
        </ul>
      </>
    ),
  },
}
