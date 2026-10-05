import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));
const bodyProps = vi.hoisted(() => ({
  exit: undefined as unknown,
}));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  const BodyProbe = (props: Record<string, unknown>) => {
    if (props.className === "flex min-h-0 flex-1 flex-col") {
      bodyProps.exit = props.exit;
    }
    return <actual.motion.div {...props} />;
  };
  return {
    ...actual,
    motion: new Proxy(actual.motion, {
      get: (target, key) =>
        key === "div" ? BodyProbe : Reflect.get(target, key),
    }),
    useReducedMotion: () => reduced.value,
  };
});

import Drawer from "../index";

const closeDrawer = () => (
  <Drawer open={false} title="Exit title">
    <p>Body</p>
  </Drawer>
);

describe("Drawer body exit", () => {
  it("declares an exit that fades the body in 0.2s", () => {
    reduced.value = false;
    render(
      <Drawer open title="Exit title">
        <p>Body</p>
      </Drawer>
    );
    expect(bodyProps.exit).toMatchObject({
      opacity: 0,
      transition: { duration: 0.2 },
    });
  });

  it("declares an instant exit with reduced motion", () => {
    reduced.value = true;
    render(
      <Drawer open title="Exit title">
        <p>Body</p>
      </Drawer>
    );
    expect(bodyProps.exit).toMatchObject({
      opacity: 0,
      transition: { duration: 0 },
    });
  });

  it("keeps the body until its exit finishes, then removes it", async () => {
    reduced.value = false;
    const { rerender } = render(
      <Drawer open title="Exit title">
        <p>Body</p>
      </Drawer>
    );
    expect(screen.getByText("Exit title")).toBeInTheDocument();
    rerender(closeDrawer());
    await waitFor(() => expect(screen.queryByText("Exit title")).toBeNull(), {
      timeout: 2000,
    });
  });

  it("removes the body at once with reduced motion", () => {
    reduced.value = true;
    const { rerender } = render(
      <Drawer open title="Exit title">
        <p>Body</p>
      </Drawer>
    );
    rerender(closeDrawer());
    expect(screen.queryByText("Exit title")).toBeNull();
  });
});
