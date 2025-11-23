import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CheckoutFormInput } from "@/lib/validation/checkout";

interface CheckoutState {
  formData: CheckoutFormInput | null;
}

const initialState: CheckoutState = {
  formData: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutData: (state, action: PayloadAction<CheckoutFormInput>) => {
      state.formData = action.payload;
    },
    clearCheckoutData: (state) => {
      state.formData = null;
    },
  },
});

export const { setCheckoutData, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;

