import { useState } from "react";

export const useERC20Balance = (params) => {
  const [assets, setAssets] = useState([]);
  return { fetchERC20Balance: async () => [], assets };
};
