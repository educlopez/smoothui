"use client";

import type {
  SwapQuote,
  SwapStatus,
  SwapToken,
} from "@repo/smoothui/components/swap-panel";
import SwapPanel from "@repo/smoothui/components/swap-panel";
import { useState } from "react";

const QUOTE_DELAY_MS = 900;
const QUOTE_VALIDITY_MS = 20_000;
const MOCK_RATE = 0.412;

const NEBU: SwapToken = {
  balance: 1280.5,
  name: "Nebula",
  symbol: "NEBU",
};

const LUMEN: SwapToken = {
  name: "Lumen",
  symbol: "LUMEN",
};

export default function SwapPanelDemo() {
  const [amount, setAmount] = useState("100");
  const [status, setStatus] = useState<SwapStatus>("ready");
  const [quote, setQuote] = useState<SwapQuote | undefined>({
    expiresAt: Date.now() + QUOTE_VALIDITY_MS,
    fee: 0.002,
    output: 100 * MOCK_RATE,
    priceImpact: 0.004,
    rate: MOCK_RATE,
  });
  const [error, setError] = useState<string | undefined>();
  const [tokens, setTokens] = useState({ from: NEBU, to: LUMEN });

  const requestQuote = (nextAmount: string) => {
    setStatus("quoting");
    setError(undefined);
    setTimeout(() => {
      const parsed = Number.parseFloat(nextAmount);
      if (Number.isNaN(parsed) || parsed <= 0) {
        setStatus("error");
        setError("Enter an amount greater than zero.");
        setQuote(undefined);
        return;
      }
      setQuote({
        expiresAt: Date.now() + QUOTE_VALIDITY_MS,
        fee: parsed * 0.0002,
        output: parsed * MOCK_RATE,
        priceImpact: 0.004,
        rate: MOCK_RATE,
      });
      setStatus("ready");
    }, QUOTE_DELAY_MS);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    requestQuote(value);
  };

  const handleFlip = () => {
    setTokens((prev) => ({ from: prev.to, to: prev.from }));
    requestQuote(amount);
  };

  const handleSubmit = () => {
    setStatus("submitting");
    setTimeout(() => setStatus("ready"), QUOTE_DELAY_MS);
  };

  return (
    <div className="flex w-full items-center justify-center py-8">
      <SwapPanel
        amount={amount}
        error={error}
        from={tokens.from}
        onAmountChange={handleAmountChange}
        onFlip={handleFlip}
        onSubmit={handleSubmit}
        quote={quote}
        slippage={0.005}
        status={status}
        to={tokens.to}
      />
    </div>
  );
}
