export const GET_ALL_VISAS_QUERY = `
  query GetAllVisas($first: Int!) {
    products(first: $first, query: "product_type:*Visa") {
      edges {
        node {
          id
          title
          handle
          productType
          tags
          description
          descriptionHtml
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                sku
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          metafields(identifiers: [
            { namespace: "visa", key: "processing_time" }
            { namespace: "visa", key: "entry_type" }
            { namespace: "visa", key: "duration" }
            { namespace: "visa", key: "validity" }
            { namespace: "visa", key: "country" }
            { namespace: "visa", key: "flag_emoji" }
            { namespace: "visa", key: "category" }
            { namespace: "visa", key: "child_price" }
            { namespace: "visa", key: "features" }
            { namespace: "visa", key: "requirements" }
            { namespace: "visa", key: "important_notes" }
            { namespace: "visa", key: "express_available" }
            { namespace: "visa", key: "express_price" }
          ]) {
            key
            value
            type
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_VISA_BY_HANDLE_QUERY = `
  query GetVisaByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      productType
      tags
      description
      descriptionHtml
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            priceV2 {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            sku
          }
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      metafields(identifiers: [
        { namespace: "visa", key: "processing_time" }
        { namespace: "visa", key: "entry_type" }
        { namespace: "visa", key: "duration" }
        { namespace: "visa", key: "validity" }
        { namespace: "visa", key: "country" }
        { namespace: "visa", key: "flag_emoji" }
        { namespace: "visa", key: "category" }
        { namespace: "visa", key: "child_price" }
        { namespace: "visa", key: "features" }
        { namespace: "visa", key: "requirements" }
        { namespace: "visa", key: "important_notes" }
        { namespace: "visa", key: "express_available" }
        { namespace: "visa", key: "express_price" }
      ]) {
        key
        value
        type
      }
    }
  }
`;

export const GET_PRODUCTS_BY_HANDLES_QUERY = `
  query GetProductsByHandles($handles: [String!]!) {
    nodes(ids: $handles) {
      ... on Product {
        id
        title
        handle
        productType
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        images(first: 1) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export const GET_ADDONS_QUERY = `
  query GetAddons {
    products(first: 50, query: "product_type:'Add-on Service'") {
      edges {
        node {
          id
          title
          handle
          description
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
                priceV2 {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_CHECKOUT_MUTATION = `
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalPriceV2 {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
              customAttributes {
                key
                value
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const ADD_LINE_ITEMS_TO_CHECKOUT_MUTATION = `
  mutation CheckoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
        totalPriceV2 {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const UPDATE_CHECKOUT_LINE_ITEMS_MUTATION = `
  mutation CheckoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
    checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const REMOVE_LINE_ITEMS_FROM_CHECKOUT_MUTATION = `
  mutation CheckoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

export const GET_CHECKOUT_QUERY = `
  query GetCheckout($id: ID!) {
    node(id: $id) {
      ... on Checkout {
        id
        webUrl
        completedAt
        totalPriceV2 {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_VISAS_QUERY = `
  query SearchVisas($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            { namespace: "visa", key: "country" }
            { namespace: "visa", key: "flag_emoji" }
            { namespace: "visa", key: "category" }
            { namespace: "visa", key: "duration" }
            { namespace: "visa", key: "entry_type" }
            { namespace: "visa", key: "processing_time" }
          ]) {
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const GET_VISAS_BY_CATEGORY_QUERY = `
  query GetVisasByCategory($productType: String!, $first: Int!) {
    products(first: $first, query: $productType) {
      edges {
        node {
          id
          title
          handle
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          metafields(identifiers: [
            { namespace: "visa", key: "country" }
            { namespace: "visa", key: "flag_emoji" }
            { namespace: "visa", key: "duration" }
            { namespace: "visa", key: "entry_type" }
          ]) {
            key
            value
            type
          }
        }
      }
    }
  }
`;