# Synthetic eligibility fixture v1

This file is the authority only for this disposable example. It is not a Composed product contract
and does not add requirements to any consumer.

- **EXAMPLE-BOUNDARY-001:** eligibility begins at exactly 24 hours. The independent observations are
  12 hours → false, 24 hours → true and 48 hours → true.
- **EXAMPLE-TEST-001:** execute the selected assertion cases against the actual candidate, and retain
  their outcomes. A passing baseline means those selected assertions passed. It does not establish
  that every observation of EXAMPLE-BOUNDARY-001 was tested.

The weak selection deliberately includes only 12 and 48 hours. The strong selection also includes
24 hours. The mutant `>=` → `>` compiles and differs at the exact boundary: it must survive the weak
selection and be detected by the strong one. Metadata and execution receipts remain scoped local
evidence. Fixture IDs name this exercise; they are not substituted for real consumer requirement IDs.
