import { apiSlice } from "./apiSlice";
import { ADDRESSES_URL } from "../constants";

export const addressApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAddress: builder.mutation({
      query: (address) => ({
        url: ADDRESSES_URL,
        method: "POST",
        body: { ...address },
      }),
      invalidatesTags: ["Address"],
    }),
    getBillingAddresses: builder.query({
      query: () => ({
        url: `${ADDRESSES_URL}/billing`,
      }),
      //   keepUnusedDataFor: 5,
      providesTags: ["Address"],
    }),
    getShippingAddresses: builder.query({
      query: () => ({
        url: `${ADDRESSES_URL}/shipping`,
      }),
      //   keepUnusedDataFor: 5,
      providesTags: ["Address"],
    }),
    getAddresses: builder.query({
      query: () => ({
        url: ADDRESSES_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getDefaultShipping: builder.query({
      query: () => ({
        url: `${ADDRESSES_URL}/defaultshipping`,
      }),
      //   keepUnusedDataFor: 5,
      providesTags: ["Address"],
    }),
    getDefaultBilling: builder.query({
      query: () => ({
        url: `${ADDRESSES_URL}/defaultbilling`,
      }),
      //   keepUnusedDataFor: 5,
      providesTags: ["Address"],
    }),
    getAddressById: builder.query({
      query: (addressId) => ({
        url: `${ADDRESSES_URL}/${addressId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `${ADDRESSES_URL}/${addressId}`,
        method: "DELETE",
      }),
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: `${ADDRESSES_URL}/${data._id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    setShippingDefault: builder.mutation({
      query: (addressId) => ({
        url: `${ADDRESSES_URL}/${addressId}/shippingdefault`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
    setBillingDefault: builder.mutation({
      query: (addressId) => ({
        url: `${ADDRESSES_URL}/${addressId}/billingdefault`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useCreateAddressMutation,
  useGetBillingAddressesQuery,
  useGetShippingAddressesQuery,
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
  useSetShippingDefaultMutation,
  useSetBillingDefaultMutation,
  useGetDefaultBillingQuery,
  useGetDefaultShippingQuery,
} = addressApiSlice;
