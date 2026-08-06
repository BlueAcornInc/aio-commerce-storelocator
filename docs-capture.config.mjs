/**
 * Screenshots for the Store Locator user guide.
 *
 * Run with:  npm run docs:capture
 * Output is committed to docs/img/ui/ and picked up by the docs site build.
 *
 * The UI is served as a plain static bundle, so index.js takes its
 * bootstrapRaw() path -- no Experience Cloud Shell, no IMS, no credentials.
 * Backend calls are stubbed below so every screenshot is reproducible.
 *
 * If the harness lives somewhere other than ../bin, set AIO_BIN.
 */

export default {
  // Produced by `aio app build`.
  distDir: "dist/commerce-backend-ui-1/web-prod",
  outDir: "docs/img/ui",

  // The app's prose is unconstrained, so it runs off the edge at 1280 and gets
  // clipped mid-sentence. 1440 gives the copy room to wrap naturally.
  viewport: { width: 1440, height: 900 },

  // Stub the Runtime actions. Without these the screens either hang on a
  // spinner or render an error state, neither of which documents anything.
  mocks: [
    {
      url: "**/api/v1/web/**",
      json: {
        restApiBaseUrl:
          "https://na1-sandbox.api.commerce.adobe.com/AbCdEf123456/",
        authType: "ims",
      },
    },
  ],

  shots: [
    {
      // selector rather than a viewport shot: crops to the rendered content so
      // the docs image has no dead space below the last paragraph.
      name: "app-welcome",
      path: "/",
      waitFor: "#root",
      selector: "#root",
      timeout: 20000,
    },
    {
      name: "app-support",
      path: "/",
      waitFor: "#root",
      selector: "#root",
      timeout: 20000,
      setup: async (page) => {
        // role=tab, not text: Spectrum also renders an offscreen label node,
        // and a plain text match picks the invisible one first.
        await page.getByRole("tab", { name: "Support" }).click();
        await page.waitForTimeout(400); // let the tab transition settle
      },
    },
  ],
};
