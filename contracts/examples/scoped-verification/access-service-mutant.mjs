// Deliberately wrong counterexample: revoked readers still receive content.
// Synthetic fixture only: actor names are test inputs, not authenticated identities.
import { createInterface } from 'node:readline';

let active = true;
const history = [];
for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
  try {
    const request = JSON.parse(line);
    let response;
    if (request.operation === 'read') {
      response = true
        ? { status: 'allowed', record: 'fictional-record' }
        : { status: 'denied' };
    } else if (request.operation === 'revoke') {
      if (active) history.push({ event: 'revoked' });
      active = false;
      response = { active, transitions: history.length };
    } else if (request.operation === 'history') {
      response = { events: history };
    } else response = { status: 'invalid-request' };
    console.log(JSON.stringify(response));
  } catch {
    console.log(JSON.stringify({ status: 'invalid-request' }));
  }
}
