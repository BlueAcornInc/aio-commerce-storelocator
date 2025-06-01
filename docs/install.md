---
title: Installation
layout: page
parent: Store Locator
---

# Installation

This guide will walk a merchant or a developer through how to set up this project with an Adobe Commerce SaaS Workspace. It assumes you have nothing but the following entitlements from Adobe:

## Pre-Reqs

* Adobe Developer App Builder 
* Access to a working Adobe Commerce as a Cloud Service (SaaS) tenant
* Local evironment running linux or compatible (i.e. MacOS or Windows with WCL2)
    * This repo contains a devcontainer suitable for running the solution, which requires a compatible IDE like Visual Studio Code and an OCI Runtime like Docker or Podman

## Setup SaaS and Storefront

If you haven't already, we need to prepare the project and workspaces within our Adobe App Builder organization, as well as the code repos that represent Adobe Commerce Storefront and any additional public apps you may need to use.

`aio commerce init` will create a few repos for you in github, so you must be authenticated with github. the `gh` tool can help with this.

```bash
$ gh auth login 
$ aio commerce init
```
