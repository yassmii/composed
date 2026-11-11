# Comparison — bounded refresh, 2026-11-01

| Source / observations | Supported behaviour | Limit for the candidate |
| --- | --- | --- |
| [Shopify Cart](https://shopify.dev/docs/api/storefront/latest/objects/Cart.md), OBS-COM-001/002 | Cart costs are estimates and can change at checkout. | Does not prove immutable snapshots or price concurrency. |
| [WooCommerce statuses](https://woocommerce.com/document/managing-orders/order-statuses/), OBS-COM-003/010 | Pending and paid differ; eligible unpaid holds expire; manual refund labels can precede funds return. | Labels do not prove settlement or universal expiry policy. |
| [Adobe reservations](https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/basics/order-status), OBS-COM-004/011 | Salable allocations differ from physical stock; return-to-stock is optional. | Does not prove atomic multi-line allocation or universal no-backorders. |
| [Stripe events](https://docs.stripe.com/webhooks.md?locale=en-US), OBS-COM-005/006 | Delivery can repeat or arrive out of order; payload verification and freshness checks are documented. | Event-ID deduplication alone does not prove one business effect. |
| [Stripe idempotency](https://docs.stripe.com/api/idempotent_requests.md?locale=en-US), OBS-COM-007 | API v1 key reuse has parameter and retention constraints. | Provider keys are not indefinite checkout-operation records. |
| [Stripe refunds](https://docs.stripe.com/refunds.md?locale=en-US), OBS-COM-008/009 | Aggregate refunds are capped; requests can remain pending or fail. | An accepted request is not completed reimbursement. |

Convergence is narrow: mutable selection, distinct payment/order states and stock
effects connected to order progression. Allocation arithmetic, strict expiry
decision time, all-or-none holds, immutable accepted snapshots and no resurrection
after late payment are explicit Composed choices, marked in traceability. No common
vendor architecture, hold duration, transport or payment provider is inferred.

The candidate retains original clause IDs and adds REQ-COM-005/006 and POL-COM-003.
This is documentary research, not observed behaviour of an implemented storefront.
Wider domain/provider comparison awaits the deepening pass.
