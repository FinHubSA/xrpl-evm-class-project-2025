import { getAlchemyHttpUrl } from "./networks";
import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { Pair, Route } from "@uniswap/v2-sdk";
import { Address, createPublicClient, fallback, http, parseAbi } from "viem";
import { mainnet } from "viem/chains";

const alchemyHttpUrl = getAlchemyHttpUrl(mainnet.id);
const rpcFallbacks = alchemyHttpUrl ? [http(alchemyHttpUrl), http()] : [http()];
const publicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(rpcFallbacks),
});

const ABI = parseAbi([
  "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() external view returns (address)",
  "function token1() external view returns (address)",
]);

export const fetchPriceFromUniswap = async (token0Address?: string, token1Address?: string): Promise<number> => {
  try {
    // DAI - 0x6B175474E89094C44Da98b954EedeAC495271d0F
    // WETH - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    let token0 = new Token(1, token0Address || "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18);
    let token1 = new Token(1, token1Address || "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18);
    const pairAddress = Pair.getAddress(token1, token0) as Address;

    const wagmiConfig = {
      address: pairAddress,
      abi: ABI,
    };

    const reserves = await publicClient.readContract({
      ...wagmiConfig,
      functionName: "getReserves",
    });

    token0Address = await publicClient.readContract({
      ...wagmiConfig,
      functionName: "token0",
    });

    token1Address = await publicClient.readContract({
      ...wagmiConfig,
      functionName: "token1",
    });
    token0 = [token1, token0].find(token => token.address === token0Address) as Token;
    token1 = [token1, token0].find(token => token.address === token1Address) as Token;
    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserves[0].toString()),
      CurrencyAmount.fromRawAmount(token1, reserves[1].toString()),
    );
    const route = new Route([pair], token1, token0);
    const price = parseFloat(route.midPrice.toSignificant(6));
    return price;
  } catch (error) {
    console.error(`useNativeCurrencyPrice - Error fetching price from Uniswap: `, error);
    return 0;
  }
};
