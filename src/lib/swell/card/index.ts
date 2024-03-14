import type { Card, Account } from "swell-js";
import { swell } from "../index";
import { getOrCreateCarts } from "../cart";
import { getLoggedInSwellAccountID } from "@pages/api/auth";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString().padStart(2, "0"),
  label: (i + 1).toString().padStart(2, "0"),
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 21 }, (_, i) => ({
  value: currentYear + i,
  label: currentYear + i,
}));

interface CardSummary {
  id: string | undefined;
  brand: string | undefined;
  last4: string | undefined;
  exp_month: number | undefined;
  exp_year: number | undefined;
  name: string | undefined;
  isDefault?: boolean | undefined;
}

/**
 * Get the cards for an account
 * @param email
 * @returns {Promise<Card[]>} A list of cards
 */
const getCards = async (email: string): Promise<Card[]> => {
  const response = await swell.get(`/accounts/${email}/cards`);
  return response.results;
};

/**
 * Get the default card for an account
 * @param cards
 * @param account
 * @returns {Card | undefined} The default card
 */
const getDefaultCard = (cards: Card[], account: Account): Card | undefined => {
  return cards.find((card) => card.token === account?.billing?.card?.token);
};

/**
 * Get a list of card summaries for an account, used for displaying cards in the UI
 * @param cards
 * @param account
 * @returns {CardSummary[]} A list of card summaries
 */
const getCardSummaries = (cards: Card[], account: Account): CardSummary[] => {
  const defaultCard = getDefaultCard(cards, account);
  return cards.map((card) => {
    const safeCard: CardSummary = {
      id: card.id,
      brand: card.brand,
      last4: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      name: card.billing?.name,
      isDefault: defaultCard && card.token === defaultCard.token,
    };
    return safeCard;
  });
};

/**
 * Update the billing information for an account and cart
 * @param email
 * @param sessionToken The Stytch session token
 * @param cardId The ID of the card to set as the default
 * @returns {Promise<void>}
 */
const updateBillingInfo = async (
  email: string,
  sessionToken: string,
  cardId: string,
): Promise<void> => {
  // Update account with new billing information
  await swell.put(`/accounts/${email}`, {
    billing: {
      account_card_id: cardId,
    },
  });

  // Update cart with new billing information
  const swellAccountID = await getLoggedInSwellAccountID(sessionToken);
  const carts = await getOrCreateCarts(swellAccountID);
  const cart = carts[0];
  if (cart) {
    await swell.put(`/carts/${cart.id}`, {
      billing: {
        account_card_id: cardId,
      },
    });
  }
};

export {
  getCards,
  getDefaultCard,
  getCardSummaries,
  updateBillingInfo,
  MONTHS,
  YEARS,
  type CardSummary,
};
