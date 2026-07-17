"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ChevronDown, ChevronRight, Lock, CreditCard, Truck, Check, Shield, ArrowLeft, AlertCircle, X } from 'lucide-react';
import { useTranslations } from "next-intl";
import { APP_NAME, APP_CURRENCY_SYMBOL } from "@/lib/data";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

// ─── Inline mock cart data ────────────────────────────────────────────────────

interface LineItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  variant?: string;
}

const CART_ITEMS: LineItem[] = [
  {
    id: "p1",
    name: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    image: "https://graphics.secondipity.com/B2C/5409336_1.jpg",
    price: 279.99,
    originalPrice: 349.99,
    quantity: 1,
    variant: "Black",
  },
  {
    id: "p2",
    name: "Apple iPad Air 11-inch (M2) Wi-Fi 256GB",
    image: "/images/apple-ipad-air-m2-tablet.jpg",
    price: 699.0,
    originalPrice: 749.0,
    quantity: 1,
    variant: "Space Gray",
  },
  {
    id: "p3",
    name: "Nike Air Zoom Pegasus 41 Running Shoes",
    image: "/images/nike-air-zoom-pegasus-running-shoes.jpg",
    price: 130.0,
    quantity: 2,
    variant: "Size 10 / White",
  },
];

const SHIPPING_OPTIONS = [
  { id: "standard", label: "Standard Shipping", eta: "5–7 business days", price: 0 },
  { id: "express", label: "Express Shipping", eta: "2–3 business days", price: 9.99 },
  { id: "overnight", label: "Overnight Shipping", eta: "Next business day", price: 24.99 },
];

const STEPS = ["Shipping", "Payment", "Review"] as const;
type Step = (typeof STEPS)[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `${APP_CURRENCY_SYMBOL}${n.toFixed(2)}`;
}

function subtotal(items: LineItem[]) {
  return items.reduce((acc, it) => acc + it.price * it.quantity, 0);
}

// ─── Sub-components (inline) ─────────────────────────────────────────────────

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.38, ease: "easeOut" } },
  exit: { opacity: 0, x: -32, transition: { duration: 0.25, ease: "easeIn" } },
};

interface FieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  autoComplete?: string;
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  autoComplete,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
        }`}
      />
      {error && (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  );
}

// ─── Shipping form ────────────────────────────────────────────────────────────

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippingErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

function validateShipping(d: ShippingData): ShippingErrors {
  const e: ShippingErrors = {};
  if (!d.firstName.trim()) e.firstName = "First name is required";
  if (!d.lastName.trim()) e.lastName = "Last name is required";
  if (!d.email.trim()) e.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = "Enter a valid email";
  if (!d.phone.trim()) e.phone = "Phone number is required";
  if (!d.address.trim()) e.address = "Street address is required";
  if (!d.city.trim()) e.city = "City is required";
  if (!d.state.trim()) e.state = "State is required";
  if (!d.zip.trim()) e.zip = "ZIP code is required";
  return e;
}

interface ShippingStepProps {
  data: ShippingData;
  setData: (d: ShippingData) => void;
  shipping: string;
  setShipping: (s: string) => void;
  onNext: () => void;
}

function ShippingStep({ data, setData, shipping, setShipping, onNext }: ShippingStepProps) {
  const [errors, setErrors] = useState<ShippingErrors>({});

  const set = (key: keyof ShippingData) => (v: string) =>
    setData({ ...data, [key]: v });

  const handleNext = () => {
    const errs = validateShipping(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  return (
    <motion.div
      key="shipping"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="First Name"
            id="firstName"
            value={data.firstName}
            onChange={set("firstName")}
            placeholder="Jane"
            error={errors.firstName}
            autoComplete="given-name"
          />
          <Field
            label="Last Name"
            id="lastName"
            value={data.lastName}
            onChange={set("lastName")}
            placeholder="Smith"
            error={errors.lastName}
            autoComplete="family-name"
          />
          <div className="sm:col-span-2">
            <Field
              label="Email Address"
              id="email"
              type="email"
              value={data.email}
              onChange={set("email")}
              placeholder="jane@example.com"
              error={errors.email}
              autoComplete="email"
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Phone Number"
              id="phone"
              type="tel"
              value={data.phone}
              onChange={set("phone")}
              placeholder="+1 (555) 000-0000"
              error={errors.phone}
              autoComplete="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Street Address"
              id="address"
              value={data.address}
              onChange={set("address")}
              placeholder="123 Main Street"
              error={errors.address}
              autoComplete="street-address"
            />
          </div>
          <Field
            label="Apt / Suite (optional)"
            id="apt"
            value={data.apt}
            onChange={set("apt")}
            placeholder="Apt 4B"
            autoComplete="address-line2"
          />
          <Field
            label="City"
            id="city"
            value={data.city}
            onChange={set("city")}
            placeholder="New York"
            error={errors.city}
            autoComplete="address-level2"
          />
          <Field
            label="State"
            id="state"
            value={data.state}
            onChange={set("state")}
            placeholder="NY"
            error={errors.state}
            autoComplete="address-level1"
          />
          <Field
            label="ZIP Code"
            id="zip"
            value={data.zip}
            onChange={set("zip")}
            placeholder="10001"
            error={errors.zip}
            autoComplete="postal-code"
          />
          <div className="sm:col-span-2">
            <label htmlFor="country" className="text-sm font-medium text-gray-700 block mb-1">
              Country
            </label>
            <select
              id="country"
              value={data.country}
              onChange={(e) => set("country")(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
              autoComplete="country"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipping method */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Method</h2>
        <div className="flex flex-col gap-3">
          {SHIPPING_OPTIONS.map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center justify-between gap-4 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                shipping === opt.id
                  ? "border-[var(--primary)] bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    shipping === opt.id ? "border-[var(--primary)]" : "border-gray-300"
                  }`}
                >
                  {shipping === opt.id && (
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                  )}
                </div>
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={shipping === opt.id}
                  onChange={() => setShipping(opt.id)}
                  className="sr-only"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.eta}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {opt.price === 0 ? "Free" : fmt(opt.price)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={{ backgroundColor: "var(--primary)" }}
      >
        Continue to Payment
        <ChevronRight size={16} />
      </button>
    </motion.div>
  );
}

// ─── Payment form ─────────────────────────────────────────────────────────────

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

interface PaymentErrors {
  cardNumber?: string;
  cardName?: string;
  expiry?: string;
  cvv?: string;
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function validatePayment(d: PaymentData): PaymentErrors {
  const e: PaymentErrors = {};
  const raw = d.cardNumber.replace(/\s/g, "");
  if (!raw) e.cardNumber = "Card number is required";
  else if (raw.length < 16) e.cardNumber = "Enter a valid 16-digit card number";
  if (!d.cardName.trim()) e.cardName = "Name on card is required";
  if (!d.expiry.trim()) e.expiry = "Expiry date is required";
  else if (!/^\d{2}\/\d{2}$/.test(d.expiry)) e.expiry = "Use MM/YY format";
  if (!d.cvv.trim()) e.cvv = "CVV is required";
  else if (d.cvv.length < 3) e.cvv = "CVV must be 3 or 4 digits";
  return e;
}

interface PaymentStepProps {
  data: PaymentData;
  setData: (d: PaymentData) => void;
  onNext: () => void;
  onBack: () => void;
}

function PaymentStep({ data, setData, onNext, onBack }: PaymentStepProps) {
  const [errors, setErrors] = useState<PaymentErrors>({});
  const [payMethod, setPayMethod] = useState<"card" | "paypal">("card");

  const set = (key: keyof PaymentData) => (v: string | boolean) =>
    setData({ ...data, [key]: v });

  const handleNext = () => {
    if (payMethod === "paypal") { onNext(); return; }
    const errs = validatePayment(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) onNext();
  };

  return (
    <motion.div
      key="payment"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

        {/* Method toggle */}
        <div className="flex gap-3 mb-5">
          {(["card", "paypal"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setPayMethod(m)}
              className={`flex-1 rounded-xl border-2 py-2.5 text-sm font-medium transition-all duration-200 ${
                payMethod === m
                  ? "border-[var(--primary)] bg-orange-50 text-[var(--primary)]"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {m === "card" ? "Credit / Debit Card" : "PayPal"}
            </button>
          ))}
        </div>

        {payMethod === "card" ? (
          <div className="flex flex-col gap-4">
            {/* Card preview */}
            <div
              className="relative rounded-2xl p-5 text-white overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Card Number</span>
                  <span className="text-base font-mono tracking-widest">
                    {data.cardNumber || "•••• •••• •••• ••••"}
                  </span>
                </div>
                <CreditCard size={28} className="text-white/60" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-white/50 uppercase tracking-widest block">Name</span>
                  <span className="text-sm font-medium">{data.cardName || "YOUR NAME"}</span>
                </div>
                <div>
                  <span className="text-xs text-white/50 uppercase tracking-widest block">Expires</span>
                  <span className="text-sm font-medium">{data.expiry || "MM/YY"}</span>
                </div>
              </div>
            </div>

            <Field
              label="Card Number"
              id="cardNumber"
              value={data.cardNumber}
              onChange={(v) => set("cardNumber")(formatCardNumber(v))}
              placeholder="1234 5678 9012 3456"
              error={errors.cardNumber}
              autoComplete="cc-number"
            />
            <Field
              label="Name on Card"
              id="cardName"
              value={data.cardName}
              onChange={(v) => set("cardName")(v)}
              placeholder="Jane Smith"
              error={errors.cardName}
              autoComplete="cc-name"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Expiry Date"
                id="expiry"
                value={data.expiry}
                onChange={(v) => set("expiry")(formatExpiry(v))}
                placeholder="MM/YY"
                error={errors.expiry}
                autoComplete="cc-exp"
              />
              <Field
                label="CVV"
                id="cvv"
                value={data.cvv}
                onChange={(v) => set("cvv")(v.replace(/\D/g, "").slice(0, 4))}
                placeholder="•••"
                error={errors.cvv}
                autoComplete="cc-csc"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => set("saveCard")(!data.saveCard)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                  data.saveCard ? "border-[var(--primary)] bg-[var(--primary)]" : "border-gray-300"
                }`}
              >
                {data.saveCard && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-gray-600">Save card for future purchases</span>
            </label>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2.5">
              <Lock size={13} className="text-green-500 flex-shrink-0" />
              Your payment info is encrypted with 256-bit SSL. We never store your full card number.
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 rounded-xl border-2 border-dashed border-gray-200">
            <div className="text-4xl">🅿️</div>
            <p className="text-sm text-gray-600 text-center max-w-xs">
              You will be redirected to PayPal to complete your payment securely after reviewing your order.
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          onClick={handleNext}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Review Order
          <ChevronRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Review step ──────────────────────────────────────────────────────────────

interface ReviewStepProps {
  shipping: ShippingData;
  payment: PaymentData;
  shippingMethod: string;
  items: LineItem[];
  onBack: () => void;
  onPlace: () => void;
  placing: boolean;
}

function ReviewStep({
  shipping,
  payment,
  shippingMethod,
  items,
  onBack,
  onPlace,
  placing,
}: ReviewStepProps) {
  const method = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod) ?? SHIPPING_OPTIONS[0];
  const sub = subtotal(items);
  const tax = sub * 0.08;
  const total = sub + tax + (method?.price ?? 0);

  return (
    <motion.div
      key="review"
      variants={stepVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex flex-col gap-6"
    >
      <h2 className="text-lg font-semibold text-gray-900">Review Your Order</h2>

      {/* Items */}
      <div className="rounded-xl border border-gray-100 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex gap-3 p-4 ${i < items.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' fill='%23e5e7eb'%3E%3Crect width='56' height='56'/%3E%3C/svg%3E";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
              {item.variant && <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>}
              <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
              {fmt(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      <div className="rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={15} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold text-gray-900">Shipping To</span>
        </div>
        <p className="text-sm text-gray-700">
          {shipping.firstName} {shipping.lastName}
        </p>
        <p className="text-sm text-gray-500">
          {shipping.address}
          {shipping.apt ? `, ${shipping.apt}` : ""}
        </p>
        <p className="text-sm text-gray-500">
          {shipping.city}, {shipping.state} {shipping.zip}
        </p>
        <p className="text-sm text-gray-500 mt-1">{method?.label} — {method?.eta}</p>
      </div>

      {/* Payment summary */}
      <div className="rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard size={15} style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold text-gray-900">Payment</span>
        </div>
        <p className="text-sm text-gray-700">
          {payment.cardNumber
            ? `Card ending in ${payment.cardNumber.replace(/\s/g, "").slice(-4)}`
            : "PayPal"}
        </p>
      </div>

      {/* Price breakdown */}
      <div className="rounded-xl bg-gray-50 p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{fmt(sub)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span>{method?.price === 0 ? "Free" : fmt(method?.price ?? 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tax (8%)</span>
          <span>{fmt(tax)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <motion.button
          onClick={onPlace}
          disabled={placing}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all duration-200 disabled:opacity-70"
          style={{ backgroundColor: "var(--primary)" }}
        >
          {placing ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Placing Order...
            </>
          ) : (
            <>
              <Lock size={15} />
              Place Order — {fmt(total)}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ orderId }: { orderId: string }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center gap-6 py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--primary)" }}
      >
        <Check size={36} className="text-white" strokeWidth={3} />
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Thank you for shopping with {APP_NAME}. Your order has been placed and is being processed.
        </p>
      </div>
      <div className="bg-gray-50 rounded-xl px-6 py-4 w-full max-w-xs">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
        <p className="text-base font-mono font-bold text-gray-900">{orderId}</p>
      </div>
      <p className="text-sm text-gray-500">
        A confirmation email has been sent to your inbox. Estimated delivery in 5–7 business days.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/account/orders"
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 text-center"
        >
          View Orders
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 text-center"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Order summary sidebar ────────────────────────────────────────────────────

interface SummaryProps {
  items: LineItem[];
  shippingMethod: string;
  coupon: string;
  setCoupon: (v: string) => void;
  couponApplied: boolean;
  onApplyCoupon: () => void;
}

function OrderSummary({
  items,
  shippingMethod,
  coupon,
  setCoupon,
  couponApplied,
  onApplyCoupon,
}: SummaryProps) {
  const method = SHIPPING_OPTIONS.find((o) => o.id === shippingMethod) ?? SHIPPING_OPTIONS[0];
  const sub = subtotal(items);
  const discount = couponApplied ? sub * 0.1 : 0;
  const tax = (sub - discount) * 0.08;
  const total = sub - discount + tax + (method?.price ?? 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
      <h3 className="text-base font-semibold text-gray-900">Order Summary</h3>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="relative flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='%23e5e7eb'%3E%3Crect width='48' height='48'/%3E%3C/svg%3E";
                }}
              />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: "var(--primary)" }}>
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
              {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
            </div>
            <span className="text-xs font-semibold text-gray-900 flex-shrink-0">
              {fmt(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="flex gap-2">
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all duration-200"
        />
        <button
          onClick={onApplyCoupon}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Apply
        </button>
      </div>
      {couponApplied && (
        <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
          <Check size={12} />
          Coupon SAVE10 applied — 10% off!
        </div>
      )}

      {/* Totals */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items)</span>
          <span>{fmt(sub)}</span>
        </div>
        {couponApplied && (
          <div className="flex justify-between text-xs text-green-600">
            <span>Discount (10%)</span>
            <span>-{fmt(discount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Shipping</span>
          <span>{method?.price === 0 ? "Free" : fmt(method?.price ?? 0)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Tax (8%)</span>
          <span>{fmt(tax)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-100 pt-2">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      {/* Trust */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        {[
          { icon: <Lock size={13} />, text: "SSL encrypted checkout" },
          { icon: <Shield size={13} />, text: "Buyer protection guarantee" },
          { icon: <Truck size={13} />, text: "Free returns within 30 days" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-green-500">{item.icon}</span>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<Step>("Shipping");
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderId] = useState(() => "MH-" + Math.random().toString(36).slice(2, 9).toUpperCase());

  const [shippingData, setShippingData] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    saveCard: false,
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const stepIndex = STEPS.indexOf(currentStep);

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SAVE10") {
      setCouponApplied(true);
    }
  };

  const handlePlaceOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setPlaced(true);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-[1200px]">
        {/* Page heading */}
        <Reveal>
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors duration-200 mb-4"
            >
              <ArrowLeft size={14} />
              Back to Cart
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              {placed ? "Order Confirmed" : "Secure Checkout"}
            </h1>
            {!placed && (
              <p className="text-sm text-gray-500 mt-1">
                Complete your purchase from {APP_NAME}
              </p>
            )}
          </div>
        </Reveal>

        {placed ? (
          <Reveal>
            <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
              <SuccessScreen orderId={orderId} />
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left: steps */}
            <div className="flex flex-col gap-6">
              {/* Step indicator */}
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                  <div className="flex items-center gap-0">
                    {STEPS.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                              i < stepIndex
                                ? "bg-green-500 text-white"
                                : i === stepIndex
                                ? "text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                            style={i === stepIndex ? { backgroundColor: "var(--primary)" } : {}}
                          >
                            {i < stepIndex ? <Check size={14} /> : i + 1}
                          </div>
                          <span
                            className={`text-xs font-medium transition-colors duration-200 ${
                              i === stepIndex ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors duration-300 ${
                              i < stepIndex ? "bg-green-500" : "bg-gray-100"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Step content */}
              <Reveal>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-8px_rgba(0,0,0,0.10)]">
                  <AnimatePresence mode="wait">
                    {currentStep === "Shipping" && (
                      <ShippingStep
                        key="shipping"
                        data={shippingData}
                        setData={setShippingData}
                        shipping={shippingMethod}
                        setShipping={setShippingMethod}
                        onNext={() => setCurrentStep("Payment")}
                      />
                    )}
                    {currentStep === "Payment" && (
                      <PaymentStep
                        key="payment"
                        data={paymentData}
                        setData={setPaymentData}
                        onNext={() => setCurrentStep("Review")}
                        onBack={() => setCurrentStep("Shipping")}
                      />
                    )}
                    {currentStep === "Review" && (
                      <ReviewStep
                        key="review"
                        shipping={shippingData}
                        payment={paymentData}
                        shippingMethod={shippingMethod}
                        items={CART_ITEMS}
                        onBack={() => setCurrentStep("Payment")}
                        onPlace={handlePlaceOrder}
                        placing={placing}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            </div>

            {/* Right: order summary */}
            <Reveal delay={0.1}>
              <div className="lg:sticky lg:top-20">
                <OrderSummary
                  items={CART_ITEMS}
                  shippingMethod={shippingMethod}
                  coupon={coupon}
                  setCoupon={setCoupon}
                  couponApplied={couponApplied}
                  onApplyCoupon={handleApplyCoupon}
                />
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}