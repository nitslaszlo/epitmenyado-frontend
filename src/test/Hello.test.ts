import { expect, test } from "vitest";
import Hello from "../components/Hello.vue";
import { mount } from "@vue/test-utils";

test("mount component", async () => {
  expect(Hello).toBeTruthy();

  const wrapper = mount(Hello, {
    props: {
      count: 4,
    },
  });

  expect(wrapper.text()).toContain("4 x 2 = 8");
  expect(wrapper.html()).toMatchSnapshot();

  await wrapper.get("#plusBtn").trigger("click");

  expect(wrapper.text()).toContain("4 x 3 = 12");

  await wrapper.get("#plusBtn").trigger("click");

  expect(wrapper.text()).toContain("4 x 4 = 16");

  await wrapper.get("#minusBtn").trigger("click");

  expect(wrapper.text()).toContain("4 x 3 = 12");
});
