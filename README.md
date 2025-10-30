# Coding Interview: Middy Middleware (Product Code + Tracking Number)

Implement a Middy middleware that calculates product code for the handler and adds tracking number to the response.

## What’s provided

- Lambda handler: handlerFn in handler.ts
- Middy wrapper entrypoint: handler in index.ts
- Test scaffold: index.test.ts
- Config: package.json, tsconfig.json, jest.config.js

## Your tasks

- Implement a middleware that adds productCode and trackingNumber according the types
- Wire the middleware into the exported handler so tests run via Jest

Note: Use Middy v6 style `middy(handler)`. The `.js` extension in local imports is required by your ESM setup.

## Business rules

### Product code (3 characters)

The code contains three characters. These characters have to be alphabetically ordered starting from A.

- Priority:
  - D = Domestic (origin.countryCode === destination.countryCode)
  - F = Otherwise, if origin or destination country is Finland.
  - I = International (otherwise)
- DimensionFlag:
  - E = If any package has at least two dimensions strictly greater than 40 cm
  - S = Otherwise
- WeightFlag:
  - H = If total shipment weight `W_total = sum(weights)` is strictly greater than 20 kg
  - L = Otherwise

Examples:

- Domestic, small dimensions, 10 kg total => DLS
- International, not from or to Finland, any package has 2 dimensions > 40 cm, 30 kg total => EHI

### Tracking number

- Deterministic and reproducible for the same shipment
- Format: `{originCC}-{destCC}-{last4(shipmentId)}-{checksum}`
  - originCC, destCC: `origin.countryCode`, `destination.countryCode`
  - last4(shipmentId): last 4 characters of `Shipment.id` (left-pad with `0` if shorter)
  - checksum: 2-digit number computed as `sum(charCode of "{id}{originCC}{destCC}") % 100`, zero-padded (e.g., "07")

## Constraints and expectations

- Don’t change type definitions in types.ts
- Input event: ShipmentRequest; final HTTP response body: ShipmentResponse
- TypeScript strict mode must pass
- Keep middleware pure aside from setting `request.event` (before) and `request.response` (after)

## Getting started

Install:

```
npm install
```

Run tests:

```
npm test
```
