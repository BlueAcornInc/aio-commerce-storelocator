---
title: PaaS Setup
layout: page
parent: Store Locator
---

# PaaS Setup

This guide will walk a merchant or a developer through how to set up this project with Adobe Commerce. It assumes you have nothing but the following entitlements from Adobe:

## Pre-Reqs

- Adobe Developer App Builder
- Access to a working Adobe Commerce instance (Cloud, SaaS, or On-Premise)
- Local evironment running linux or compatible (i.e. MacOS or Windows with WCL2)
  - This repo contains a devcontainer suitable for running the solution, which requires a compatible IDE like Visual Studio Code and an OCI Runtime like Docker or Podman

## Setup Commerce and Storefront

If you haven't already, we need to prepare the project and workspaces within our Adobe App Builder organization, as well as the code repos that represent Adobe Commerce Storefront and any additional public apps you may need to use.

`aio commerce init` will create a few repos for you in github, so you must be authenticated with github. the `gh` tool can help with this.

```bash
$ gh auth login
$ aio commerce init
```

## Create an Integration in Adobe Commerce Admin

- This step allows your App Builder application to authenticate and communicate with your Adobe Commerce backend.

- In the Adobe Commerce Admin panel:
  - Navigate to:  
    `System > Extensions > Integrations`
    - Click **Add New Integration**

    - Fill in the following values:
      - **Name**: e.g. `Store Locator App Builder Integration`
      - Leave other fields blank unless required by your organization

    - Under the **API** tab, click **Select All** to grant all permissions, or configure scopes as needed

    - Save the integration and then **activate** it

    - You will be shown the following credentials:
      - **Consumer Key**
      - **Consumer Secret**
      - **Access Token**
      - **Access Token Secret**

- Remove the commented out Option 1 fields and update these to your `.env` file:

```env
  COMMERCE_CONSUMER_KEY=your-consumer-key
  COMMERCE_CONSUMER_SECRET=your-consumer-secret
  COMMERCE_ACCESS_TOKEN=your-access-token
  COMMERCE_ACCESS_TOKEN_SECRET=your-access-token-secret
```

This will allow the app to fetch commerce data in future updates.

## Configure App Management

App Management is the Adobe Experience Cloud console that connects your App Builder apps to your Commerce instance. Navigate to your organization's App Management page:

`Adobe Experience Cloud > Commerce > App Management`

Select your app to open its configuration page.

### SaaS (IMS) -- for ACCS Instances

For Adobe Commerce as a Cloud Service (ACCS), select **SaaS (IMS)** as the Authentication Type:

- **Commerce REST API Base URL**: Auto-populated for your ACCS instance (e.g., `https://na1-rest.adbe.com/api/v1`)
- **Authentication Type**: SaaS (IMS)
- **Consumer Key / Secret, Access Token / Secret**: Leave blank (PaaS only)
- **IMS Client ID**: Your App Builder project's OAuth server-to-server client ID from the [Developer Console](https://developer.adobe.com/)
- **IMS Client Secret**: The matching client secret

![App Management SaaS Configuration](img/app-management-saas.png)

### PaaS / On-Premise (OAuth 1.0a)

For Adobe Commerce Cloud (PaaS) or on-premise instances, select **PaaS/On-Premise (OAuth 1.0a)** as the Authentication Type:

- **Commerce REST API Base URL**: Your Commerce instance URL (e.g., `https://your-instance.magentosite.cloud`)
- **Authentication Type**: PaaS/On-Premise (OAuth 1.0a)
- **Consumer Key / Secret, Access Token / Secret**: From the integration created in the [previous step](#create-an-integration-in-adobe-commerce-admin)
- **IMS Client ID / IMS Client Secret**: From your App Builder project in the [Developer Console](https://developer.adobe.com/)

## Register App to Commerce Instance

This app has an Administrative compliment, which requires the Adobe IMS and Admin UI SDK to be configured.

### Setting up IMS

Behind the scenes, there is an app repository this gets registered with. It is exposed through IMS, so be sure to have your instances configured with IMS and in the same organization as your users and apps.

- [Setup IMS for Adobe Commerce](https://experienceleague.adobe.com/en/docs/commerce-admin/start/admin/ims/adobe-ims-config)

### Setting up Admin UI SDK

Stores > Configuration > Adobe Services > Admin UI SDK and configure it to suit your needs.

### Running Locally

![Running Admin UI SDK Locally](img/admin-ui-sdk-setup.png)

Once setup, click **Refresh Registrations** to bring in the app. This will expose the App in the _Apps_ section of the Main Admin Menu.
