# Security Policy

## Reporting a vulnerability

Please report security issues privately rather than opening a public issue. Use GitHub private
vulnerability reporting:

**https://github.com/zachshallbetter/Stateful-Elements/security/advisories/new**

Include a description of the issue and its impact, steps to reproduce (a minimal example is ideal),
and the affected file and version.

This is a solo-maintained project. Handling is best-effort with no SLA: there is no guaranteed
response or fix time.

## Scope

Stateful Elements is a small client-side JavaScript library in `src/`. It keeps state on a DOM
element, makes no network requests and does not write to browser storage. The relevant surface is
the data a host page passes in: state values given to `setState` and the `data-action` attributes read
from clicked child elements. Reports about those paths, such as prototype pollution through state
keys, are in scope. The library is not published to npm; it is copied into a project from `src/`.

## Supported versions

Only the latest tagged release receives fixes. Fixes land on `main` and ship in the next release.
