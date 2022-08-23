import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "src/api";
import { asyncThunkStatuses } from "src/interfaces/api";
import { parseErrors } from "src/redux/features/errors/errorsSlice";

export interface Currency {
  name: string;
  code: string;
  symbol?: string;
}

export interface AccountBase {
  name: string;
  userId: number;
}

export interface AccountCreate extends AccountBase {
  currencyCode: string;
}

export interface Account extends AccountBase {
  id: number;
  currency: Currency;

  balance: number;
  monthWorthChange: number;
}

interface AccountState {
  accounts: Account[];
  currencies: Currency[];

  accountFetchStatus: asyncThunkStatuses;
  accountCreationStatus: asyncThunkStatuses;
  accountUpdateStatus: asyncThunkStatuses;
}

const initialState: AccountState = {
  accounts: [],
  currencies: [],

  accountFetchStatus: "idle",
  accountCreationStatus: "idle",
  accountUpdateStatus: "idle",
};

export const fetchAccountsInformation = createAsyncThunk(
  "accounts/fetchAccountsInformation",
  async (arg: void, thunkApi) => {
    try {
      const result = await api.getAccountsInfo();
      return result;
    } catch (err) {
      parseErrors(err, thunkApi);
    }
  }
);

export const fetchAvailableCurrencies = createAsyncThunk(
  "accounts/fetchAvailableCurrencies",
  async (arg: void, thunkApi) => {
    try {
      const result = await api.getCurrencies();
      return result;
    } catch (err) {
      parseErrors(err, thunkApi);
    }
  }
);

export const createAccount = createAsyncThunk("accounts/createAccount", async (account: AccountCreate, thunkApi) => {
  try {
    const result = await api.createAccount(account);
    return result;
  } catch (err) {
    parseErrors(err, thunkApi);
  }
});

export const deleteAccount = createAsyncThunk("accounts/deleteAccount", async (account: Account, thunkApi) => {
  try {
    const result = await api.deleteAccount(account);
    return result;
  } catch (err) {
    parseErrors(err, thunkApi);
  }
});

export const accountsSlice = createSlice({
  name: "accounts",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAccountsInformation.pending, (state) => {
        state.accountFetchStatus = "pending";
      })
      .addCase(fetchAccountsInformation.fulfilled, (state, action) => {
        state.accounts = action.payload || [];
        state.accountFetchStatus = "succeeded";
      })
      .addCase(fetchAccountsInformation.rejected, (state) => {
        state.accounts = [];
        state.accountFetchStatus = "failed";
      })
      .addCase(fetchAvailableCurrencies.fulfilled, (state, action) => {
        state.currencies = action.payload || [];
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        if (action.payload) state.accounts.push(action.payload);
        state.accountCreationStatus = "succeeded";
      })
      .addCase(createAccount.rejected, (state) => {
        state.accountCreationStatus = "failed";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.accounts = state.accounts.filter((element) => element.id !== action.payload!.id);
      });
  },
});

export default accountsSlice.reducer;
