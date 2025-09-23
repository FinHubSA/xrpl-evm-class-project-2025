import { useCallback, useEffect } from "react";
import { useTargetNetwork } from "./useTargetNetwork";
import { useInterval } from "usehooks-ts";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { fetchPriceFromUniswap } from "~~/utils/scaffold-eth";

const enablePolling = false;

/**
 * Get the price of Native Currency based on Native Token/USD trading pair from Uniswap SDK
 * For XRP the trading pair is WXRP/USDT - v2
 * For ETH the trading parid is WETH/DAI - v2
 */
export const useInitializeNativeCurrencyPrice = () => {
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  const setIsNativeCurrencyFetching = useGlobalState(state => state.setIsNativeCurrencyFetching);
  const { targetNetwork } = useTargetNetwork();

  const fetchPrice = useCallback(async () => {
    setIsNativeCurrencyFetching(true);
    const eth_dai_price = await fetchPriceFromUniswap();
    let xrp_dai_price = 0;
    if (targetNetwork.nativeCurrency.symbol === "XRP") {
      const eth_xrp_price = await fetchPriceFromUniswap(targetNetwork.nativeCurrencyTokenAddress);
      xrp_dai_price = eth_dai_price / eth_xrp_price;
    }

    setNativeCurrencyPrice(targetNetwork.nativeCurrency.symbol === "ETH" ? eth_dai_price : xrp_dai_price);
    setIsNativeCurrencyFetching(false);
  }, [setIsNativeCurrencyFetching, setNativeCurrencyPrice, targetNetwork]);

  // Get the price of ETH from Uniswap on mount
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  // Get the price of ETH from Uniswap at a given interval
  useInterval(fetchPrice, enablePolling ? scaffoldConfig.pollingInterval : null);
};
