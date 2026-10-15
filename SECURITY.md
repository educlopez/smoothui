# Security Policy

## Supported versions

Security fixes land in the latest release of `smoothui-cli` and in the
registry served at `https://smoothui.dev/r`. Older versions are not patched;
update to the latest release.

## Reporting a vulnerability

Please do not open a public issue for a security problem.

Report it privately through GitHub:
<https://github.com/educlopez/smoothui/security/advisories/new>

Useful details: what is affected (a component, the CLI, the registry or the
docs site), steps to reproduce, and the impact you see. This is a small
project, so replies are best effort, but reports are read and taken seriously.
You will get an acknowledgement, a fix or a clear answer on why not, and
credit in the advisory if you want it.

## Scope

In scope: the `smoothui-cli` package, the registry JSON served from `/r`
(including what a `shadcn add` writes into a project), the component source in
this repository, and the docs site.

Out of scope: vulnerabilities in third-party dependencies with no SmoothUI
specific impact (report those upstream), and findings that need a compromised
machine or browser.
