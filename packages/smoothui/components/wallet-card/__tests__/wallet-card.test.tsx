import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import WalletCard, { type WalletAccount, type WalletMember } from "../index";

const accounts: WalletAccount[] = [
  {
    balance: 1250.5,
    currency: "USD",
    holder: "Ada Lovelace",
    id: "checking",
    label: "Checking",
    last4: "4242",
    network: "visa",
  },
  {
    balance: 320,
    currency: "USD",
    id: "savings",
    label: "Savings",
    network: "mastercard",
  },
];

const members: WalletMember[] = [{ id: "ada", name: "Ada Lovelace" }];

describe("WalletCard", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <WalletCard accounts={accounts} members={members} />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders the hidden-balance variant without throwing", () => {
    const { container } = render(<WalletCard accounts={accounts} hidden />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <WalletCard accounts={accounts} members={members} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
