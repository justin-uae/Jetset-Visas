import { useAppSelector } from "../redux/hooks";

export function useCurrency() {
    const { selectedCurrency } = useAppSelector((state) => state.currency);

    // Convert AED price to selected currency and format
    const formatPrice = (priceInAED: number): string => {
        const convertedPrice = priceInAED * selectedCurrency.rate;

        // Format based on currency
        if (selectedCurrency.code === 'AED') {
            return `AED ${convertedPrice.toFixed(2)}`;
        }

        return `${selectedCurrency.symbol}${convertedPrice.toFixed(2)}`;
    };

    // Get converted price as number (useful for calculations)
    const convertPrice = (priceInAED: number): number => {
        return priceInAED * selectedCurrency.rate;
    };

    return {
        selectedCurrency,
        formatPrice,
        convertPrice,
    };
}