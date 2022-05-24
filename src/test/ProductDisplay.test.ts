import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";
import ProductDisplay from "../VueMastery_Socks/components/ProductDisplay.vue";

test("mount component", async () => {
  expect(ProductDisplay).toBeTruthy();

  const wrapperSimple = mount(ProductDisplay, {
    props: {
      premium: false,
    },
  });

  const wrapperPremium = mount(ProductDisplay, {
    props: {
      premium: true,
    },
  });

  expect(wrapperSimple.text()).toContain("Shipping: 2.99");
  // expect(wrapperSimple.html()).toMatchSnapshot();

  expect(wrapperPremium.text()).toContain("Shipping: Free");
  // expect(wrapperPremium.html()).toMatchSnapshot();

  // expect(wrapperSimple.text()).toContain("Cart(0)");

  // await wrapperSimple.get("button.addBtn").trigger("click");

  // expect(wrapperSimple.text()).toContain("Cart(1)");

  // await wrapper.get("button").trigger("click");

  // expect(wrapper.text()).toContain("4 x 4 = 16");
});
