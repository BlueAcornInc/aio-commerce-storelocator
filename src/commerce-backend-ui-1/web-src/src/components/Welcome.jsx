import {
  Heading,
  View,
  Grid,
  Content,
  Text,
  Divider,
  Well,
} from "@adobe/react-spectrum";

export const Welcome = (props) => {
  return (
    <View>
      <Heading level={1}>Configuring the Store Locator</Heading>
      <Content>
        <Text>
          The store locator leverages Magento's native Multi-Source Inventory
          (MSI) features, making it straightforward to manage inventory across
          multiple locations. Setting it up is easy—just follow these steps:
          <br />
          <br />
        </Text>
        <Text>
          <b>Note:</b> Ensure you have the necessary permissions to manage
          sources and inventory in your Adobe Commerce instance.
          <br />
          <br />
        </Text>
      </Content>
      <Grid
        columns={{
          base: 1,
          M: "1fr 1fr",
        }}
        gap="size-400"
        marginBottom="size-400"
        width="size-6000"
        maxWidth="100%"
      >
        <Well>
          <Heading level={2}>Add Sources</Heading>
          <Content>
            <Text>
              1. Go to <b>Stores &gt; Inventory &gt; Sources</b>.<br />
              2. Click <b>Add Source</b>.<br />
              3. Fill in the required details.
              <br />
              4. Save your new source.
            </Text>
          </Content>
        </Well>
        <Well>
          <Heading level={2}>Add Inventory</Heading>
          <Content>
            <Text>
              1. Go to <b>Catalog &gt; Products</b>.<br />
              2. Select a <b>Product</b>.<br />
              3. Assign inventory from your sources.
              <br />
              4. Save your changes.
            </Text>
          </Content>
        </Well>
      </Grid>
      <Divider marginY="size-300" />
      <Heading level={2}>Setting up Adobe Commerce Storefront</Heading>
      <Content>
        <Text>
          1. Be sure to create a{" "}
          <a href="https://experienceleague.adobe.com/developer/commerce/storefront/get-started/">
            Storefront
          </a>
          .<br />
          2. Copy in our{" "}
          <a href="https://github.com/BlueAcornInc/aio-commerce-storelocator-blocks">
            Shared Blocks
          </a>{" "}
          into your Storefront
          <br />
          3. Save and publish your storefront to make it live.
        </Text>
      </Content>
    </View>
  );
};
