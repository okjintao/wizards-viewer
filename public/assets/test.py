from datetime import datetime, timezone, timedelta
import requests

OPENSEA_API_VERSION = "v1"
OPENSEA_URL = "https://api.opensea.io/api/%s/assets" % OPENSEA_API_VERSION
OPENSEA_GRAPHQL_URL = 'https://api.opensea.io/graphql/'

def timestamp():
	timestamp = str(datetime.now(timezone.utc) - timedelta(minutes=1)).replace(' ', 'T')
	timestamp = timestamp[:timestamp.rfind('.') + 3]
	return timestamp

def slugForContract(contract):
	querystring = {
		"order_direction": "desc", 
		"offset": "0",
		"limit": "1",
		"asset_contract_address": contract
	}

	response = requests.get(OPENSEA_URL, params=querystring)
	try:
		return response.json()['assets'][0]['collection']['slug']
	except Exception as e:
		print("Failed to retrieve collection name from OpenSea")
		print(e)
		return None

payload = {
	"id": "EventHistoryPollQuery",
	"query": "query EventHistoryPollQuery(\n  $archetype: ArchetypeInputType\n  $categories: [CollectionSlug!]\n  $chains: [ChainScalar!]\n  $collections: [CollectionSlug!]\n  $count: Int = 10\n  $cursor: String\n  $eventTimestamp_Gt: DateTime\n  $eventTypes: [EventType!]\n  $identity: IdentityInputType\n  $showAll: Boolean = false\n) {\n  assetEvents(after: $cursor, archetype: $archetype, categories: $categories, chains: $chains, collections: $collections, eventTimestamp_Gt: $eventTimestamp_Gt, eventTypes: $eventTypes, first: $count, identity: $identity, includeHidden: True) {\n    edges {\n      node {\n        assetBundle @include(if: $showAll) {\n          ...AssetCell_assetBundle\n          id\n        }\n        assetQuantity {\n          asset @include(if: $showAll) {\n            ...AssetCell_asset\n            id\n          }\n          ...quantity_data\n          id\n        }\n        relayId\n        eventTimestamp\n        eventType\n        customEventName\n        offerEnteredClosedAt\n        devFee {\n          quantity\n          ...AssetQuantity_data\n          id\n        }\n        devFeePaymentEvent {\n          ...EventTimestamp_data\n          id\n        }\n        fromAccount {\n          address\n          ...AccountLink_data\n          id\n        }\n        price {\n          quantity\n          ...AssetQuantity_data\n          id\n        }\n        endingPrice {\n          quantity\n          ...AssetQuantity_data\n          id\n        }\n        seller {\n          ...AccountLink_data\n          id\n        }\n        toAccount {\n          ...AccountLink_data\n          id\n        }\n        winnerAccount {\n          ...AccountLink_data\n          id\n        }\n        ...EventTimestamp_data\n        id\n      }\n    }\n  }\n}\n\nfragment AccountLink_data on AccountType {\n  address\n  user {\n    publicUsername\n    id\n  }\n  ...ProfileImage_data\n  ...wallet_accountKey\n  ...accounts_url\n}\n\nfragment AssetCell_asset on AssetType {\n  collection {\n    name\n    id\n  }\n  name\n  ...AssetMedia_asset\n  ...asset_url\n}\n\nfragment AssetCell_assetBundle on AssetBundleType {\n  assetQuantities(first: 2) {\n    edges {\n      node {\n        asset {\n          collection {\n            name\n            id\n          }\n          name\n          ...AssetMedia_asset\n          ...asset_url\n          id\n        }\n        relayId\n        id\n      }\n    }\n  }\n  name\n  slug\n}\n\nfragment AssetMedia_asset on AssetType {\n  animationUrl\n  backgroundColor\n  collection {\n    description\n    displayData {\n      cardDisplayStyle\n    }\n    imageUrl\n    hidden\n    name\n    slug\n    id\n  }\n  description\n  name\n  tokenId\n  imageUrl\n  isDelisted\n}\n\nfragment AssetQuantity_data on AssetQuantityType {\n  asset {\n    ...Price_data\n    id\n  }\n  quantity\n}\n\nfragment EventTimestamp_data on AssetEventType {\n  eventTimestamp\n  transaction {\n    blockExplorerLink\n    id\n  }\n}\n\nfragment Price_data on AssetType {\n  decimals\n  imageUrl\n  symbol\n  usdSpotPrice\n  assetContract {\n    blockExplorerLink\n    account {\n      chain {\n        identifier\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment ProfileImage_data on AccountType {\n  imageUrl\n  address\n  chain {\n    identifier\n    id\n  }\n}\n\nfragment accounts_url on AccountType {\n  address\n  chain {\n    identifier\n    id\n  }\n  user {\n    publicUsername\n    id\n  }\n}\n\nfragment asset_url on AssetType {\n  assetContract {\n    account {\n      address\n      chain {\n        identifier\n        id\n      }\n      id\n    }\n    id\n  }\n  tokenId\n}\n\nfragment quantity_data on AssetQuantityType {\n  asset {\n    decimals\n    id\n  }\n  quantity\n}\n\nfragment wallet_accountKey on AccountType {\n  address\n  chain {\n    identifier\n    id\n  }\n}\n",
	"variables": {
		"archetype": None,
		"categories": None,
		"chains": None,
		"collections": [],
		"count": 100,
		"cursor": None,
		"eventTimestamp_Gt": timestamp(),
		"eventTypes": ["AUCTION_CREATED"],
		"identity": None,
		"showAll": True
	}
}


payload['variables']['collections'] = [slugForContract('0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42')]
listings = requests.post(url=OPENSEA_GRAPHQL_URL, json=payload)

print(listings.json())